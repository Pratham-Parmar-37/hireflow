// ==============================================================================
// HireFlow – Client Orchestration Engine
// High-performance Vanilla JavaScript for Microservices Routing & Real-time State
// ==============================================================================

const API_BASE = window.location.protocol.startsWith('http')
  ? ''
  : 'http://localhost:8088';

// Central State
const state = {
  jobs: [],
  candidates: [],
  applications: [],
  interviews: [],
  companies: [],
  users: [],
  notifications: [],
  serviceHealth: [
    { name: 'eureka-server', port: 8761, desc: 'Central Service Registry & Discovery Server', tech: 'Spring Cloud Netflix Eureka', status: 'unknown', latency: null },
    { name: 'api-gateway', port: 8088, desc: 'Dynamic Reactive Reverse Proxy & UI Host', tech: 'Spring Cloud Gateway (WebFlux)', status: 'unknown', latency: null },
    { name: 'user-service', port: 8081, desc: 'Role-based User Profiles & Identity Management', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
    { name: 'company-job-service', port: 8082, desc: 'Enterprise Directory & Job Openings Catalog', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
    { name: 'candidate-service', port: 8083, desc: 'Talent Pool, Skills Graph & Resume Profiles', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
    { name: 'application-service', port: 8084, desc: 'Hiring Workflow & OpenFeign Job Consumer', tech: 'Spring Boot 3 + OpenFeign', status: 'unknown', latency: null },
    { name: 'interview-service', port: 8085, desc: 'Technical Screening & Evaluation Rounds', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
    { name: 'notification-service', port: 8086, desc: 'Event-driven Candidate Alerts & Messages', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null }
  ]
};

// ==============================================================================
// Initialization
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initModals();
  initSearchAndFilters();
  initActionButtons();
  fetchAllData();
  initServiceHealth();
});

// ==============================================================================
// Theme Orchestration (Crisp Light default + Linear Dark)
// ==============================================================================
function initTheme() {
  const saved = localStorage.getItem('hireflow-theme') || 'light';
  applyTheme(saved);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('hireflow-theme', next);
    });
  }
}

function applyTheme(theme) {
  const icon = document.getElementById('theme-icon');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) icon.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (icon) icon.textContent = '🌙';
  }
}

// ==============================================================================
// Navigation Tabs
// ==============================================================================
function initTabs() {
  const tabButtons = document.querySelectorAll('.nav-item[data-tab]');
  const titleMap = {
    'tab-overview': 'Overview',
    'tab-jobs': 'Job Openings',
    'tab-candidates': 'Candidate Directory',
    'tab-pipeline': 'Hiring Pipeline',
    'tab-interviews': 'Interviews',
    'tab-companies': 'Companies & Team',
    'tab-health': 'Service Health',
    'tab-architecture': 'Eureka Topology'
  };

  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      tabButtons.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      if (tab.dataset.tab === 'tab-health') checkHealthPings();
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      const titleEl = document.getElementById('current-view-title');
      if (titleEl && titleMap[tab.dataset.tab]) {
        titleEl.textContent = titleMap[tab.dataset.tab];
      }
    });
  });

  const homeBtn = document.getElementById('brand-home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      document.querySelector('.nav-item[data-tab="tab-overview"]')?.click();
    });
  }
}

// ==============================================================================
// Data Fetching
// ==============================================================================
async function fetchAllData() {
  try {
    await Promise.allSettled([
      fetchJobs(),
      fetchCandidates(),
      fetchApplications(),
      fetchInterviews(),
      fetchCompanies(),
      fetchUsers(),
      fetchNotifications()
    ]);
    updateKPIs();
  } catch (err) {
    console.error('Error fetching data:', err);
    showToast('Failed to load microservices data', 'error');
  }
}

async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE}/api/jobs`);
    if (res.ok) {
      state.jobs = await res.json();
      renderJobs();
    }
  } catch (e) {
    console.warn('Jobs service unreachable', e);
  }
}

async function fetchCandidates() {
  try {
    const res = await fetch(`${API_BASE}/api/candidates`);
    if (res.ok) {
      state.candidates = await res.json();
      renderCandidates();
    }
  } catch (e) {
    console.warn('Candidate service unreachable', e);
  }
}

async function fetchApplications() {
  try {
    const res = await fetch(`${API_BASE}/api/applications`);
    if (res.ok) {
      state.applications = await res.json();
      renderPipeline();
    }
  } catch (e) {
    console.warn('Application service unreachable', e);
  }
}

async function fetchInterviews() {
  try {
    const res = await fetch(`${API_BASE}/api/interviews`);
    if (res.ok) {
      state.interviews = await res.json();
      renderInterviews();
    }
  } catch (e) {
    console.warn('Interview service unreachable', e);
  }
}

async function fetchCompanies() {
  try {
    const res = await fetch(`${API_BASE}/api/companies`);
    if (res.ok) {
      state.companies = await res.json();
      renderCompanies();
      populateCompanySelects();
    }
  } catch (e) {
    console.warn('Company service unreachable', e);
  }
}

async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/api/users`);
    if (res.ok) {
      state.users = await res.json();
      renderUsers();
    }
  } catch (e) {
    console.warn('User service unreachable', e);
  }
}

async function fetchNotifications() {
  try {
    const res = await fetch(`${API_BASE}/api/notifications`);
    if (res.ok) {
      state.notifications = await res.json();
      renderNotifications();
    }
  } catch (e) {
    console.warn('Notification service unreachable', e);
  }
}

// ==============================================================================
// Health Checks & Pings
// ==============================================================================
let healthCheckInFlight = false;

function initServiceHealth() {
  renderServiceHealth();
  document.getElementById('refresh-health-btn')?.addEventListener('click', checkHealthPings);
  setInterval(() => {
    if (!document.hidden && document.getElementById('tab-health')?.classList.contains('active')) {
      checkHealthPings();
    }
  }, 30000);
}

async function checkHealthPings() {
  if (healthCheckInFlight) return;
  healthCheckInFlight = true;
  const button = document.getElementById('refresh-health-btn');
  if (button) button.disabled = true;
  document.getElementById('health-summary').textContent = 'Checking…';
  state.serviceHealth.forEach(s => { s.status = 'checking'; s.latency = null; });
  renderServiceHealth();
  try {
    await Promise.all(state.serviceHealth.map(async s => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const start = performance.now();
      try {
        const endpoint = s.name === 'api-gateway' ? '/health' : `/api/platform/health/${s.name}`;
        const response = await fetch(`${API_BASE}${endpoint}`, { signal: controller.signal, cache: 'no-store' });
        const health = await response.json();
        if (response.ok && health.status === 'UP') s.status = 'healthy';
        else if (health.status === 'DOWN' || health.status === 'OUT_OF_SERVICE') s.status = 'down';
        else s.status = 'unknown';
        s.latency = `${Math.round(performance.now() - start)}ms`;
      } catch {
        s.status = 'unknown';
        s.latency = null;
      } finally {
        clearTimeout(timeout);
      }
    }));
    const healthy = state.serviceHealth.filter(s => s.status === 'healthy').length;
    document.getElementById('health-summary').textContent = `${healthy} of ${state.serviceHealth.length} healthy`;
    document.getElementById('health-checked-at').textContent = `Last checked: ${new Date().toLocaleTimeString()}. Response times include gateway routing. Unverified means the check failed or returned an unexpected response.`;
  } finally {
    healthCheckInFlight = false;
    if (button) button.disabled = false;
    renderServiceHealth();
  }
}

function renderServiceHealth() {
  const container = document.getElementById('services-health-grid');
  if (!container) return;
  const labels = { healthy: 'Healthy', down: 'Unhealthy', unknown: 'Unverified', checking: 'Checking' };
  container.innerHTML = state.serviceHealth.map(s => `
    <div class="service-row">
      <div class="service-row-left">
        <span class="status-dot-indicator ${s.status === 'healthy' ? '' : s.status === 'down' ? 'down' : 'unknown'}"></span>
        <span class="service-row-name">${escapeHtml(s.name)}</span>
      </div>
      <div class="service-row-right">
        <span>${labels[s.status]}</span>
        <span class="latency-pill">${s.latency || '—'}</span>
      </div>
    </div>
  `).join('');
}

// ==============================================================================
// KPI Engine
// ==============================================================================
function updateKPIs() {
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setEl('kpi-jobs', state.jobs.length);
  setEl('kpi-candidates', state.candidates.length);
  setEl('kpi-applications', state.applications.length);
  setEl('kpi-interviews', state.interviews.length);
  setEl('kpi-companies', state.companies.length);

  setEl('badge-jobs-count', state.jobs.length);
  setEl('badge-candidates-count', state.candidates.length);
  setEl('badge-applications-count', state.applications.length);
  setEl('badge-interviews-count', state.interviews.length);
}

// ==============================================================================
// Jobs Renderer
// ==============================================================================
function renderJobs() {
  const container = document.getElementById('jobs-container');
  const search = (document.getElementById('job-search-input')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('job-type-filter')?.value || '';
  const statusFilter = document.getElementById('job-status-filter')?.value || '';

  const filtered = state.jobs.filter(j => {
    const matchesSearch = !search ||
      j.title?.toLowerCase().includes(search) ||
      j.description?.toLowerCase().includes(search) ||
      j.salary?.toLowerCase().includes(search);
    const matchesType = !typeFilter || j.employmentType === typeFilter;
    const matchesStatus = !statusFilter || j.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (container) {
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>No job postings match your filters. Click 'Post Job Opening' or 'Seed Sample Data'.</p>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(job => {
        const company = state.companies.find(c => c.id === job.companyId) || { companyName: 'Hiring Partner' };
        const isOpen = (job.status || 'OPEN') === 'OPEN';

        return `
          <div class="job-card">
            <div class="job-card-top">
              <div>
                <h3 class="job-title">${escapeHtml(job.title)}</h3>
                <div class="job-company">${escapeHtml(company.companyName)}</div>
              </div>
              <span class="badge ${isOpen ? 'badge-open' : 'badge-neutral'}">${escapeHtml(job.status || 'OPEN')}</span>
            </div>

            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <span class="badge badge-neutral">${escapeHtml(job.employmentType || 'FULL_TIME')}</span>
              <span class="badge badge-neutral">${escapeHtml(job.experienceRequired || '1-3 years')}</span>
            </div>

            <p class="job-desc">${escapeHtml(job.description || 'Engineering role within our distributed microservices platform.')}</p>

            <div class="job-card-bottom">
              <div>
                <div class="job-salary">${escapeHtml(job.salary || 'Competitive')}</div>
                <span style="font-size: 0.685rem; color: var(--text-tertiary); font-family: var(--font-mono);">${job.id ? job.id.substring(0, 8) : ''}</span>
              </div>
              <button class="btn btn-secondary" onclick="openApplyForJob('${job.id}')" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
                Apply
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Also populate the Overview summary list
  const overviewRecent = document.getElementById('overview-recent-jobs');
  if (overviewRecent) {
    if (state.jobs.length === 0) {
      overviewRecent.innerHTML = `<div class="empty-state"><p>No open requisitions found. Click "Post Job Opening" or "Seed Sample Data".</p></div>`;
    } else {
      overviewRecent.innerHTML = state.jobs.slice(0, 4).map(job => {
        const company = state.companies.find(c => c.id === job.companyId) || { companyName: 'Hiring Partner' };
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">${escapeHtml(job.title)}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem;">
                ${escapeHtml(company.companyName)} &bull; <span class="badge badge-neutral" style="padding: 0.1rem 0.35rem; font-size: 0.65rem;">${escapeHtml(job.employmentType || 'FULL_TIME')}</span>
              </div>
            </div>
            <button class="btn btn-secondary" onclick="openApplyForJob('${job.id}')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">Apply</button>
          </div>
        `;
      }).join('');
    }
  }
}

// ==============================================================================
// Candidates Renderer
// ==============================================================================
function renderCandidates() {
  const container = document.getElementById('candidates-container');
  if (!container) return;

  const search = (document.getElementById('candidate-search-input')?.value || '').toLowerCase();
  const filtered = state.candidates.filter(c => {
    if (!search) return true;
    const nameMatch = c.fullName?.toLowerCase().includes(search);
    const expMatch = c.experience?.toLowerCase().includes(search);
    const skillsMatch = Array.isArray(c.skills) && c.skills.some(s => s.toLowerCase().includes(search));
    return nameMatch || expMatch || skillsMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No candidates found. Click 'Add Candidate' or 'Seed Demo Data'.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(c => {
    const initials = (c.fullName || 'Candidate')
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const skills = Array.isArray(c.skills) ? c.skills : (c.skills ? [c.skills] : ['Java', 'Spring Boot']);

    return `
      <div class="candidate-card">
        <div class="candidate-header">
          <div class="candidate-avatar">${initials}</div>
          <div>
            <h3 class="candidate-name">${escapeHtml(c.fullName)}</h3>
            <div class="candidate-email">${escapeHtml(c.email)}</div>
          </div>
        </div>

        <div class="candidate-meta">
          ${escapeHtml(c.education || 'Computer Science')} &bull; ${escapeHtml(c.experience || '3 years')}
        </div>

        <div class="candidate-skills">
          ${skills.map(s => `<span class="skill-chip">${escapeHtml(s)}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: auto; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
          <a href="${c.resumeUrl || '#'}" target="_blank" class="btn btn-ghost" style="flex: 1; padding: 0.35rem; font-size: 0.75rem; text-align: center;">
            Resume
          </a>
          <button class="btn btn-secondary" onclick="openApplyForCandidate('${c.id}')" style="flex: 1; padding: 0.35rem; font-size: 0.75rem;">
            Submit App
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ==============================================================================
// Kanban Pipeline Renderer
// ==============================================================================
function renderPipeline() {
  const statuses = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'OFFERED', 'REJECTED'];

  statuses.forEach(status => {
    const col = document.getElementById(`col-${status}`);
    const countEl = document.getElementById(`count-${status}`);
    if (!col) return;

    const items = state.applications.filter(a => (a.status || 'APPLIED') === status);
    if (countEl) countEl.innerText = items.length;

    if (items.length === 0) {
      col.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); font-size: 0.75rem; padding: 2rem 0;">No applications</div>`;
      return;
    }

    col.innerHTML = items.map(app => {
      const candidate = state.candidates.find(c => c.id === app.candidateId) || { fullName: 'Candidate #' + app.candidateId?.substring(0, 6) };
      const job = state.jobs.find(j => j.id === app.jobId) || { title: 'Role #' + app.jobId?.substring(0, 6) };

      return `
        <div class="pipeline-card" onclick="viewFeignComposite('${app.id}')">
          <div class="pipeline-card-candidate">${escapeHtml(candidate.fullName)}</div>
          <div class="pipeline-card-job">${escapeHtml(job.title)}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.725rem; color: var(--text-tertiary);">
            <span>${escapeHtml(app.applicationDate || 'Recent')}</span>
            <span style="color: var(--primary);">Feign /with-job</span>
          </div>
          <div style="margin-top: 0.35rem;" onclick="event.stopPropagation();">
            <select class="pipeline-status-select" onchange="updateApplicationStatus('${app.id}', this.value)">
              ${statuses.map(st => `<option value="${st}" ${st === status ? 'selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
        </div>
      `;
    }).join('');
  });
}

// ==============================================================================
// Interviews Renderer
// ==============================================================================
function renderInterviews() {
  const container = document.getElementById('interviews-container');
  if (!container) return;

  if (state.interviews.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No interviews scheduled. Click 'Schedule Interview' or 'Seed Demo Data'.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.interviews.map(i => {
    const candidate = state.candidates.find(c => c.id === i.candidateId) || { fullName: 'Candidate #' + i.candidateId?.substring(0, 6) };

    return `
      <div class="interview-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="font-family: var(--font-display); font-size: 0.95rem; color: var(--text-primary); font-weight: 600;">
              ${escapeHtml(candidate.fullName)}
            </h3>
            <span class="badge badge-neutral" style="margin-top: 0.25rem;">${escapeHtml(i.interviewType || 'ONLINE')}</span>
          </div>
          <span class="badge badge-neutral">${escapeHtml(i.interviewDate || 'Upcoming')}</span>
        </div>

        <p style="font-size: 0.785rem; color: var(--text-secondary); line-height: 1.45;">
          ${escapeHtml(i.feedback || 'Scheduled technical evaluation round.')}
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.65rem; font-size: 0.725rem; color: var(--text-tertiary);">
          <span>Status: <strong style="color: var(--success);">${escapeHtml(i.status || 'SCHEDULED')}</strong></span>
          <span style="font-family: var(--font-mono);">${i.applicationId ? i.applicationId.substring(0, 8) : ''}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ==============================================================================
// Companies & Users Renderer
// ==============================================================================
function renderCompanies() {
  const container = document.getElementById('companies-container');
  if (!container) return;

  if (state.companies.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No companies registered.</p></div>`;
    return;
  }

  container.innerHTML = state.companies.map(c => `
    <div class="company-card">
      <div class="company-title">${escapeHtml(c.companyName)}</div>
      <div style="font-size: 0.75rem; color: var(--primary); font-weight: 500;">${escapeHtml(c.industry || 'Technology')} &bull; ${escapeHtml(c.location || 'Remote')}</div>
      <p style="font-size: 0.785rem; color: var(--text-secondary); line-height: 1.45;">${escapeHtml(c.description || 'Enterprise partner in the HireFlow network.')}</p>
      <a href="${c.website || '#'}" target="_blank" class="company-link">
        ${escapeHtml(c.website || 'https://example.com')} &rarr;
      </a>
    </div>
  `).join('');
}

function renderUsers() {
  const container = document.getElementById('users-container');
  if (!container) return;

  if (state.users.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No users registered.</p></div>`;
    return;
  }

  container.innerHTML = state.users.map(u => `
    <div class="company-card">
      <div class="company-title">${escapeHtml(u.fullName)}</div>
      <div style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(u.email)}</div>
      <div style="margin-top: 0.35rem;">
        <span class="badge badge-neutral">${escapeHtml(u.role || 'USER')}</span>
      </div>
    </div>
  `).join('');
}

// ==============================================================================
// Notifications Renderer
// ==============================================================================
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  const badge = document.getElementById('notif-badge');
  if (!list) return;

  const unreadCount = state.notifications.filter(n => n.status !== 'READ').length;
  if (badge) {
    badge.innerText = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  if (state.notifications.length === 0) {
    list.innerHTML = `<div style="text-align: center; padding: 1.5rem; color: var(--text-tertiary); font-size: 0.75rem;">No notifications</div>`;
    return;
  }

  list.innerHTML = state.notifications.slice(0, 8).map(n => `
    <div class="drawer-item ${n.status !== 'READ' ? 'unread' : ''}">
      <div>${escapeHtml(n.message || 'Notification')}</div>
      <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 0.2rem;">${escapeHtml(n.createdAt || 'Recent')}</div>
    </div>
  `).join('');
}

// ==============================================================================
// Search & Filter Listeners
// ==============================================================================
function initSearchAndFilters() {
  const jobSearch = document.getElementById('job-search-input');
  const jobType = document.getElementById('job-type-filter');
  const jobStatus = document.getElementById('job-status-filter');

  if (jobSearch) jobSearch.addEventListener('input', renderJobs);
  if (jobType) jobType.addEventListener('change', renderJobs);
  if (jobStatus) jobStatus.addEventListener('change', renderJobs);

  const candidateSearch = document.getElementById('candidate-search-input');
  if (candidateSearch) candidateSearch.addEventListener('input', renderCandidates);
}

// ==============================================================================
// Modals & Action Listeners
// ==============================================================================
function initModals() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      document.getElementById(modalId)?.classList.remove('active');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  document.getElementById('open-post-job-modal-btn')?.addEventListener('click', () => {
    populateCompanySelects();
    openModal('modal-post-job');
  });

  document.getElementById('open-add-candidate-modal-btn')?.addEventListener('click', () => {
    openModal('modal-add-candidate');
  });

  document.getElementById('open-apply-modal-btn')?.addEventListener('click', () => {
    populateApplicationSelects();
    openModal('modal-submit-app');
  });

  document.getElementById('open-schedule-interview-modal-btn')?.addEventListener('click', () => {
    populateInterviewSelects();
    openModal('modal-schedule-interview');
  });

  document.getElementById('open-add-company-modal-btn')?.addEventListener('click', () => {
    openModal('modal-add-company');
  });

  document.getElementById('open-add-user-modal-btn')?.addEventListener('click', () => {
    openModal('modal-add-user');
  });

  bindFormSubmits();
}

function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

function initActionButtons() {
  document.getElementById('refresh-all-btn')?.addEventListener('click', () => {
    if (document.getElementById('tab-health')?.classList.contains('active')) {
      checkHealthPings();
      return;
    }
    showToast('Refreshing microservices data...', 'info');
    fetchAllData();
  });

  document.getElementById('seed-demo-btn')?.addEventListener('click', () => {
    seedDemoData();
  });

  document.getElementById('notifications-toggle-btn')?.addEventListener('click', () => {
    const drawer = document.getElementById('notifications-drawer');
    drawer?.classList.toggle('active');
  });

  document.getElementById('clear-notifs-btn')?.addEventListener('click', () => {
    document.getElementById('notifications-drawer')?.classList.remove('active');
  });
}

function populateCompanySelects() {
  const select = document.getElementById('job-company-select');
  if (!select) return;

  if (state.companies.length === 0) {
    select.innerHTML = `<option value="">No companies registered (Create one first)</option>`;
    return;
  }
  select.innerHTML = state.companies.map(c => `<option value="${c.id}">${escapeHtml(c.companyName)}</option>`).join('');
}

function populateApplicationSelects(preselectedJobId = null, preselectedCandId = null) {
  const candSelect = document.getElementById('app-candidate-select');
  const jobSelect = document.getElementById('app-job-select');

  if (candSelect) {
    candSelect.innerHTML = state.candidates.map(c => `
      <option value="${c.id}" ${c.id === preselectedCandId ? 'selected' : ''}>${escapeHtml(c.fullName)} (${escapeHtml(c.email)})</option>
    `).join('');
  }

  if (jobSelect) {
    jobSelect.innerHTML = state.jobs.map(j => `
      <option value="${j.id}" ${j.id === preselectedJobId ? 'selected' : ''}>${escapeHtml(j.title)}</option>
    `).join('');
  }
}

function populateInterviewSelects() {
  const candSelect = document.getElementById('interview-candidate-select');
  const appSelect = document.getElementById('interview-app-select');

  if (candSelect) {
    candSelect.innerHTML = state.candidates.map(c => `
      <option value="${c.id}">${escapeHtml(c.fullName)}</option>
    `).join('');
  }

  if (appSelect) {
    appSelect.innerHTML = state.applications.map(a => `
      <option value="${a.id}">Application #${a.id?.substring(0, 8)} (${a.status})</option>
    `).join('');
  }
}

window.openApplyForJob = function(jobId) {
  populateApplicationSelects(jobId, null);
  openModal('modal-submit-app');
};

window.openApplyForCandidate = function(candId) {
  populateApplicationSelects(null, candId);
  openModal('modal-submit-app');
};

// ==============================================================================
// Form Submissions
// ==============================================================================
function bindFormSubmits() {
  document.getElementById('form-post-job')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('job-title-input').value,
      companyId: document.getElementById('job-company-select').value,
      employmentType: document.getElementById('job-type-select').value,
      salary: document.getElementById('job-salary-input').value,
      experienceRequired: document.getElementById('job-exp-input').value,
      description: document.getElementById('job-desc-input').value,
      status: 'OPEN',
      postedByUserId: state.users[0]?.id || 'admin'
    };

    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Job opening published', 'success');
        closeModal('modal-post-job');
        document.getElementById('form-post-job').reset();
        await fetchJobs();
        updateKPIs();
      } else {
        throw new Error('Failed to post job');
      }
    } catch (err) {
      showToast('Error saving job: ' + err.message, 'error');
    }
  });

  document.getElementById('form-add-candidate')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const skillsRaw = document.getElementById('candidate-skills-input').value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      userId: state.users[0]?.id || 'user-1',
      fullName: document.getElementById('candidate-name-input').value,
      email: document.getElementById('candidate-email-input').value,
      skills: skills,
      experience: document.getElementById('candidate-exp-input').value,
      education: document.getElementById('candidate-edu-input').value,
      resumeUrl: document.getElementById('candidate-resume-input').value
    };

    try {
      const res = await fetch(`${API_BASE}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Candidate profile registered', 'success');
        closeModal('modal-add-candidate');
        document.getElementById('form-add-candidate').reset();
        await fetchCandidates();
        updateKPIs();
      } else {
        throw new Error('Failed to create candidate');
      }
    } catch (err) {
      showToast('Error adding candidate: ' + err.message, 'error');
    }
  });

  document.getElementById('form-submit-app')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      candidateId: document.getElementById('app-candidate-select').value,
      jobId: document.getElementById('app-job-select').value,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'APPLIED'
    };

    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Application submitted', 'success');
        closeModal('modal-submit-app');
        await fetchApplications();
        updateKPIs();
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (err) {
      showToast('Error submitting application: ' + err.message, 'error');
    }
  });

  document.getElementById('form-schedule-interview')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      candidateId: document.getElementById('interview-candidate-select').value,
      applicationId: document.getElementById('interview-app-select').value,
      interviewType: document.getElementById('interview-type-select').value,
      interviewDate: document.getElementById('interview-date-input').value,
      status: 'SCHEDULED',
      feedback: document.getElementById('interview-feedback-input').value
    };

    try {
      const res = await fetch(`${API_BASE}/api/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Interview round scheduled', 'success');
        closeModal('modal-schedule-interview');
        document.getElementById('form-schedule-interview').reset();
        await fetchInterviews();
        updateKPIs();
      } else {
        throw new Error('Failed to schedule interview');
      }
    } catch (err) {
      showToast('Error scheduling interview: ' + err.message, 'error');
    }
  });

  document.getElementById('form-add-company')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      companyName: document.getElementById('company-name-input').value,
      industry: document.getElementById('company-industry-input').value,
      location: document.getElementById('company-location-input').value,
      website: document.getElementById('company-website-input').value,
      description: document.getElementById('company-desc-input').value
    };

    try {
      const res = await fetch(`${API_BASE}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Company registered', 'success');
        closeModal('modal-add-company');
        document.getElementById('form-add-company').reset();
        await fetchCompanies();
        updateKPIs();
      } else {
        throw new Error('Failed to create company');
      }
    } catch (err) {
      showToast('Error saving company: ' + err.message, 'error');
    }
  });

  document.getElementById('form-add-user')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      fullName: document.getElementById('user-name-input').value,
      email: document.getElementById('user-email-input').value,
      role: document.getElementById('user-role-select').value
    };

    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('User profile created', 'success');
        closeModal('modal-add-user');
        document.getElementById('form-add-user').reset();
        await fetchUsers();
      } else {
        throw new Error('Failed to create user');
      }
    } catch (err) {
      showToast('Error saving user: ' + err.message, 'error');
    }
  });
}

window.updateApplicationStatus = async function(appId, newStatus) {
  const app = state.applications.find(a => a.id === appId);
  if (!app) return;

  const updated = { ...app, status: newStatus };
  try {
    const res = await fetch(`${API_BASE}/api/applications/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      showToast(`Status updated to ${newStatus}`, 'success');
      app.status = newStatus;
      renderPipeline();
    }
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
};

window.viewFeignComposite = async function(appId) {
  const viewer = document.getElementById('feign-json-content');
  if (viewer) viewer.innerText = 'Invoking OpenFeign: Application Service -> Eureka -> Company Job Service...';
  openModal('modal-feign-viewer');

  try {
    const res = await fetch(`${API_BASE}/api/applications/${appId}/with-job`);
    if (res.ok) {
      const data = await res.json();
      viewer.innerText = JSON.stringify(data, null, 2);
    } else {
      viewer.innerText = `HTTP ${res.status}: Feign call failed or job details unavailable.`;
    }
  } catch (err) {
    viewer.innerText = 'Error calling OpenFeign composite endpoint:\n' + err.message;
  }
};

// ==============================================================================
// Demo Data Seeder
// ==============================================================================
async function seedDemoData() {
  showToast('Populating sample records across microservices...', 'info');

  try {
    const compRes = await fetch(`${API_BASE}/api/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Starlight Technologies',
        industry: 'Distributed Cloud Systems',
        location: 'San Francisco, CA & Remote',
        website: 'https://starlight.tech',
        description: 'Enterprise cloud infrastructure and distributed platform engineering.'
      })
    });
    const company = await compRes.json();

    const jobRes1 = await fetch(`${API_BASE}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Senior Java & Spring Cloud Architect',
        companyId: company.id,
        employmentType: 'REMOTE',
        salary: '18-28 LPA ($140,000)',
        experienceRequired: '4-7 years',
        description: 'Architect and scale fault-tolerant microservices using Spring Boot 3, Spring Cloud Gateway, Eureka discovery, and Docker Compose.',
        status: 'OPEN',
        postedByUserId: 'admin'
      })
    });
    const job1 = await jobRes1.json();

    const jobRes2 = await fetch(`${API_BASE}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Full Stack Distributed Systems Engineer',
        companyId: company.id,
        employmentType: 'FULL_TIME',
        salary: '14-22 LPA ($110,000)',
        experienceRequired: '2-5 years',
        description: 'Develop reactive Netty endpoints, high-throughput MongoDB data models, and modern user-centric interfaces.',
        status: 'OPEN',
        postedByUserId: 'admin'
      })
    });
    const job2 = await jobRes2.json();

    const candRes1 = await fetch(`${API_BASE}/api/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-pratham',
        fullName: 'Pratham Parmar',
        email: 'pratham@hireflow.ai',
        skills: ['Java 17', 'Spring Boot 3', 'Spring Cloud Gateway', 'Docker', 'MongoDB', 'Jenkins CI/CD'],
        experience: '4 years backend microservices engineering',
        education: 'B.Tech in Computer Science',
        resumeUrl: 'https://github.com/Pratham-Parmar-37/hireflow'
      })
    });
    const candidate1 = await candRes1.json();

    const candRes2 = await fetch(`${API_BASE}/api/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-alina',
        fullName: 'Alina Vance',
        email: 'alina.v@starlight.tech',
        skills: ['Spring Cloud', 'Kubernetes', 'Reactive WebFlux', 'MongoDB', 'Kafka'],
        experience: '5 years cloud-native engineering',
        education: 'M.S. Software Systems',
        resumeUrl: 'https://starlight.tech/resumes/alina.pdf'
      })
    });
    const candidate2 = await candRes2.json();

    const appRes = await fetch(`${API_BASE}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: candidate1.id,
        jobId: job1.id,
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'SHORTLISTED'
      })
    });
    const app1 = await appRes.json();

    await fetch(`${API_BASE}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: candidate2.id,
        jobId: job2.id,
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'UNDER_REVIEW'
      })
    });

    await fetch(`${API_BASE}/api/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: candidate1.id,
        applicationId: app1.id,
        interviewType: 'TECHNICAL',
        interviewDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        status: 'SCHEDULED',
        feedback: 'Candidate demonstrated strong mastery of Eureka registry, Feign composition, and Docker CI/CD.'
      })
    });

    await fetch(`${API_BASE}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: candidate1.userId,
        message: 'Application for Senior Java Architect moved to SHORTLISTED',
        type: 'APPLICATION',
        status: 'UNREAD',
        createdAt: new Date().toLocaleTimeString()
      })
    });

    showToast('Sample records populated successfully', 'success');
    await fetchAllData();
  } catch (err) {
    console.error('Seed demo error:', err);
    showToast('Error seeding records: ' + err.message, 'error');
  }
}

// ==============================================================================
// Utility Functions
// ==============================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
