const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function app(fetch) {
  const elements = new Map();
  const context = vm.createContext({
    window: { location: { protocol: 'http:', port: '' } },
    document: {
      addEventListener() {},
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, { textContent: '', innerHTML: '', disabled: false });
        return elements.get(id);
      }
    },
    fetch, AbortController, performance, setTimeout, clearTimeout, console
  });
  vm.runInContext(fs.readFileSync('src/api-gateway/src/main/resources/static/js/app.js', 'utf8'), context);
  // The existing escapeHtml helper uses DOM APIs; these tests exercise health state.
  vm.runInContext('escapeHtml = value => String(value)', context);
  return { context, elements, run: code => vm.runInContext(code, context) };
}

test('all eight checks use health endpoints and only verified UP responses are healthy', async () => {
  const urls = [];
  const instance = app(async url => {
    urls.push(url);
    if (url.endsWith('user-service')) return { ok: false, json: async () => ({ status: 'DOWN' }) };
    if (url.endsWith('candidate-service')) throw new Error('Connection refused');
    if (url.endsWith('interview-service')) return { ok: true, json: async () => { throw new Error('Not JSON'); } };
    if (url.endsWith('notification-service')) return { ok: false, json: async () => ({ status: 'UP' }) };
    return { ok: true, json: async () => ({ status: 'UP' }) };
  });
  assert.equal(instance.run('state.serviceHealth.every(s => s.status === "unknown")'), true);
  await instance.run('checkHealthPings()');
  assert.equal(urls.length, 8);
  assert.ok(urls.includes('/health'));
  assert.ok(urls.every(url => url === '/health' || url.startsWith('/api/platform/health/')));
  assert.equal(instance.run('state.serviceHealth.find(s => s.name === "user-service").status'), 'down');
  assert.equal(instance.run('state.serviceHealth.filter(s => s.status === "unknown").length'), 3);
  assert.equal(instance.elements.get('health-summary').textContent, '4 of 8 healthy');
  assert.equal(instance.elements.get('refresh-health-btn').disabled, false);
});

test('overlapping refreshes are suppressed and a later failure clears previous healthy status', async () => {
  let fail = false;
  let calls = 0;
  const instance = app(async () => {
    calls++;
    if (fail) throw new Error('Offline');
    return { ok: true, json: async () => ({ status: 'UP' }) };
  });
  await Promise.all([instance.run('checkHealthPings()'), instance.run('checkHealthPings()')]);
  assert.equal(calls, 8);
  fail = true;
  await instance.run('checkHealthPings()');
  assert.equal(instance.run('state.serviceHealth.every(s => s.status === "unknown" && s.latency === null)'), true);
});

test('aborted requests become unverified and release the refresh lock', async () => {
  const instance = app((url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('Timed out')));
  }));
  instance.context.setTimeout = callback => setTimeout(callback, 1);
  await instance.run('checkHealthPings()');
  assert.equal(instance.run('healthCheckInFlight'), false);
  assert.equal(instance.run('state.serviceHealth.every(s => s.status === "unknown")'), true);
});

test('recruitment refresh does not probe service health', async () => {
  const urls = [];
  const instance = app(async url => { urls.push(url); return { ok: false }; });
  await instance.run('fetchAllData()');
  assert.equal(urls.length, 7);
  assert.ok(urls.every(url => !url.includes('health')));
});

test('recruitment views resolve related records when companies arrive last', async () => {
  let releaseCompanies;
  const companiesReady = new Promise(resolve => { releaseCompanies = resolve; });
  const instance = app(async url => {
    const resource = url.split('/').pop();
    if (resource === 'companies') await companiesReady;
    const rows = {
      jobs: [{ id: 'job-1', companyId: 'company-1' }],
      companies: [{ id: 'company-1', companyName: 'Example Company' }],
      candidates: [], applications: [], interviews: [], users: [], notifications: []
    };
    return { ok: true, json: async () => rows[resource] };
  });
  instance.run(`
    var renderedCompany = '';
    renderJobs = () => {
      renderedCompany = state.companies.find(c => c.id === state.jobs[0]?.companyId)?.companyName || 'Hiring Partner';
    };
    renderCandidates = renderPipeline = renderInterviews = renderCompanies =
      renderUsers = renderNotifications = populateCompanySelects = updateKPIs = () => {};
  `);
  const refresh = instance.run('fetchAllData()');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(instance.run('renderedCompany'), 'Hiring Partner');
  releaseCompanies();
  await refresh;
  assert.equal(instance.run('renderedCompany'), 'Example Company');
});
