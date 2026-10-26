// Requests use the gateway on this origin unless a deployment explicitly configures one.
const API_BASE = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.message || `Request failed (HTTP ${response.status})`);
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The server took too long to respond. Please try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function list(resource) {
  const data = await request(`/api/${resource}`);
  if (!Array.isArray(data)) throw new Error(`Invalid ${resource} response`);
  return data;
}
function write(resource, method, data) {
  return request(`/api/${resource}`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}
export const getJobs = () => list('jobs');
export const createJob = data => write('jobs', 'POST', data);
export const getCandidates = () => list('candidates');
export const createCandidate = data => write('candidates', 'POST', data);
export const getApplications = () => list('applications');
export const createApplication = data => write('applications', 'POST', data);
export const getInterviews = () => list('interviews');
export const createInterview = data => write('interviews', 'POST', data);
export const getCompanies = () => list('companies');
export const createCompany = data => write('companies', 'POST', data);
export const getUsers = () => list('users');
export const createUser = data => write('users', 'POST', data);
export const getNotifications = () => list('notifications');
export const createNotification = data => write('notifications', 'POST', data);
export const updateApplication = (id, data) => write(`applications/${encodeURIComponent(id)}`, 'PUT', data);
export const getApplicationWithJob = id => request(`/api/applications/${encodeURIComponent(id)}/with-job`);

export async function checkServiceHealth(serviceName) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  const start = performance.now();
  try {
    const endpoint = serviceName === 'api-gateway' ? '/health' : `/api/platform/health/${serviceName}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { signal: controller.signal, cache: 'no-store' });
    const data = await res.json();
    const latency = `${Math.round(performance.now() - start)}ms`;
    if (res.ok && data.status === 'UP') {
      return { status: 'healthy', latency };
    } else if (data.status === 'DOWN' || data.status === 'OUT_OF_SERVICE') {
      return { status: 'down', latency };
    }
    return { status: 'unknown', latency };
  } catch {
    return { status: 'unknown', latency: null };
  } finally {
    clearTimeout(timeout);
  }
}
