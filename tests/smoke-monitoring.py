"""Run against an isolated test deployment; creates and removes its own records."""
import argparse
import json
import time
import urllib.error
import urllib.request

parser = argparse.ArgumentParser()
parser.add_argument('--gateway', required=True)
args = parser.parse_args()

def request(path, method='GET', data=None):
    body = None if data is None else json.dumps(data).encode()
    req = urllib.request.Request(args.gateway.rstrip('/') + path, data=body,
                                 method=method, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=15) as response:
        raw = response.read()
        return json.loads(raw) if raw else None

services = ['eureka-server', 'user-service', 'company-job-service', 'candidate-service',
            'application-service', 'interview-service', 'notification-service']
deadline = time.monotonic() + 180
while True:
    try:
        assert request('/health') == {'status': 'UP'}
        for service in services:
            assert request('/api/platform/health/' + service) == {'status': 'UP'}, service
        break
    except (OSError, AssertionError):
        if time.monotonic() >= deadline:
            raise
        time.sleep(3)
print('PASS: all eight health endpoints through gateway')

records = {}
try:
    payloads = {
        'users': {'fullName': 'Monitoring smoke test', 'email': 'monitoring@example.test', 'role': 'RECRUITER'},
        'companies': {'companyName': 'Monitoring smoke test'},
        'jobs': {'title': 'Monitoring smoke test', 'status': 'OPEN'},
        'candidates': {'fullName': 'Monitoring smoke test', 'skills': ['Java']},
        'applications': {'status': 'APPLIED'},
        'interviews': {'status': 'SCHEDULED'},
        'notifications': {'message': 'Monitoring smoke test'}
    }
    for resource, payload in payloads.items():
        if resource == 'jobs': payload['companyId'] = records['companies']
        if resource == 'applications':
            payload.update(jobId=records['jobs'], candidateId=records['candidates'])
        if resource == 'interviews': payload['applicationId'] = records['applications']
        created = request('/api/' + resource, 'POST', payload)
        records[resource] = created['id']
        path = '/api/' + resource + '/' + created['id']
        assert request(path)['id'] == created['id']
        assert any(row['id'] == created['id'] for row in request('/api/' + resource))
        updated = request(path, 'PUT', payload)
        assert updated['id'] == created['id']
        print('PASS: create/list/read/update ' + resource)
    # Eureka clients refresh independently; the Feign client's registry can lag
    # behind the gateway immediately after a fresh stack starts.
    deadline = time.monotonic() + 90
    while True:
        joined = request('/api/applications/' + records['applications'] + '/with-job')
        if isinstance(joined['jobDetails'], dict):
            assert joined['jobDetails']['id'] == records['jobs']
            break
        if time.monotonic() >= deadline:
            raise AssertionError(joined['jobDetails'])
        time.sleep(3)
    print('PASS: application-to-job OpenFeign lookup')
finally:
    for resource, record_id in reversed(list(records.items())):
        request('/api/' + resource + '/' + record_id, 'DELETE')
        assert not any(row['id'] == record_id for row in request('/api/' + resource))
        print('PASS: delete ' + resource)
