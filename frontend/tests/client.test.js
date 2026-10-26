import test from 'node:test';
import assert from 'node:assert/strict';
import { getJobs, createJob, request } from '../src/api/client.js';

test('API failures preserve server validation details and reject invalid lists', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ message: 'Company does not exist' }), { status: 400 }));
  await assert.rejects(createJob({ title: 'Test' }), /Company does not exist/);
  globalThis.fetch.mock.mockImplementation(async () => new Response('{}', { status: 200 }));
  await assert.rejects(getJobs(), /Invalid jobs response/);
});
test('API handles empty successful responses and escaped JSON bodies', async t => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/jobs');
    assert.equal(JSON.parse(options.body).title, 'Engineer "Platform"');
    return new Response(null, { status: 204 });
  });
  assert.equal(await createJob({ title: 'Engineer "Platform"' }), null);
});
test('timeout errors are actionable', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new DOMException('Aborted', 'AbortError'); });
  await assert.rejects(request('/api/jobs'), /too long/);
});
