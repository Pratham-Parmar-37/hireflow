import test from 'node:test';
import assert from 'node:assert/strict';
import { applicationError, interviewError, localDate, safeWebUrl } from '../src/utils/records.js';
const candidates = [{ id: 'candidate-a' }];
const jobs = [{ id: 'open-job', status: 'OPEN' }, { id: 'closed-job', status: 'CLOSED' }];
const applications = [{ id: 'application-a', candidateId: 'candidate-a', jobId: 'open-job' }];

test('applications require an existing candidate and an open job', () => {
  assert.match(applicationError({ candidateId: '', jobId: 'open-job', candidates, jobs, applications: [] }), /candidate/);
  assert.match(applicationError({ candidateId: 'candidate-a', jobId: 'closed-job', candidates, jobs, applications: [] }), /open job/);
  assert.equal(applicationError({ candidateId: 'candidate-a', jobId: 'open-job', candidates, jobs, applications: [] }), null);
});
test('an existing application cannot be submitted again', () => {
  assert.match(applicationError({ candidateId: 'candidate-a', jobId: 'open-job', candidates, jobs, applications }), /already applied/);
});
test('interviews cannot link a candidate to another candidate application', () => {
  assert.match(interviewError({ candidateId: 'candidate-b', applicationId: 'application-a', interviewDate: '2026-10-27', today: '2026-10-26', applications }), /belonging/);
  assert.equal(interviewError({ candidateId: 'candidate-a', applicationId: 'application-a', interviewDate: '2026-10-27', today: '2026-10-26', applications }), null);
});
test('interview dates reject past dates but allow today', () => {
  const data = { candidateId: 'candidate-a', applicationId: 'application-a', applications, today: '2026-10-26' };
  assert.match(interviewError({ ...data, interviewDate: '2026-10-25' }), /future/);
  assert.equal(interviewError({ ...data, interviewDate: '2026-10-26' }), null);
});
test('date-only form defaults preserve the local calendar date', () => {
  assert.equal(localDate(new Date(2026, 9, 26, 0, 15)), '2026-10-26');
});
test('record links reject script, data and malformed URLs', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hi', 'not a URL', null]) assert.equal(safeWebUrl(url), undefined);
  assert.equal(safeWebUrl('https://example.com/resume.pdf'), 'https://example.com/resume.pdf');
});
