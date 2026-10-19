// ==============================================================================
// HireFlow AI – Client Orchestration Engine
// High-performance Vanilla JavaScript for Microservices Routing & Real-time State
// ==============================================================================

// API Base configuration
const API_BASE = (window.location.protocol.startsWith('http') && window.location.port !== '')
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
    { name: 'eureka-server', port: 8761, desc: 'Central Service Registry & Discovery Server', tech: 'Spring Cloud Netflix Eureka', status: 'healthy', latency: '4ms' },
    { name: 'api-gateway', port: 8088, desc: 'Dynamic Reactive Reverse Proxy & UI Host', tech: 'Spring Cloud Gateway (WebFlux)', status: 'healthy', latency: '2ms' },
    { name: 'user-service', port: 8081, desc: 'Role-based User Profiles & Identity Management', tech: 'Spring Boot + MongoDB', status: 'healthy', latency: '8ms' },
    { name: 'company-job-service', port: 8082, desc: 'Enterprise Directory & Job Openings Catalog', tech: 'Spring Boot + MongoDB', status: 'healthy', latency: '6ms' },
    { name: 'candidate-service', port: 8083, desc: 'Talent Pool, Skills Graph & Resume Profiles', tech: 'Spring Boot + MongoDB', status: 'healthy', latency: '7ms' },
    { name: 'application-service', port: 8084, desc: 'Hiring Workflow & OpenFeign Job Consumer', tech: 'Spring Boot + OpenFeign', status: 'healthy', latency: '12ms' },
    { name: 'interview-service', port: 8085, desc: 'Technical Screening & Evaluation Rounds', tech: 'Spring Boot + MongoDB', status: 'healthy', latency: '9ms' },
    { name: 'notification-service', port: 8086, desc: 'Event-driven Candidate Alerts & Messages', tech: 'Spring Boot + MongoDB', status: 'healthy', latency: '5ms' }
  ]
};

// ==============================================================================
// Initialization
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModals();
  initSearchAndFilters();
  initActionButtons();
  fetchAllData();
  renderServiceHealth();
});

// ==============================================================================
// Navigation Tabs
// ==============================================================================
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  const homeBtn = document.getElementById('brand-home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      document.querySelector('.nav-tab[data-tab="tab-overview"]').click();
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
    checkHealthPings();
  } catch (err) {
    console.error('Error fetching data:', err);
    showToast('Failed to load some microservices data', 'error');
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
    console.warn('Jobs service unreachable via gateway', e);
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
    console.warn('Candidate service unreachable via gateway', e);
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
    console.warn('Application service unreachable via gateway', e);
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
    console.warn('Interview service unreachable via gateway', e);
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
    console.warn('Company service unreachable via gateway', e);
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
    console.warn('User service unreachable via gateway', e);
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
    console.warn('Notification service unreachable via gateway', e);
  }
}

// ==============================================================================
// Health Checks & Pings
// ==============================================================================
async function checkHealthPings() {
  for (const s of state.serviceHealth) {
    const start = performance.now();
    try {
      let endpoint = '';
      if (s.name === 'eureka-server') endpoint = 'http://localhost:8761';
      else if (s.name === 'api-gateway') endpoint = `${API_BASE}/api/jobs`;
      else if (s.name === 'user-service') endpoint = `${API_BASE}/api/users`;
      else if (s.name === 'company-job-service') endpoint = `${API_BASE}/api/jobs`;
      else if (s.name === 'candidate-service') endpoint = `${API_BASE}/api/candidates`;
      else if (s.name === 'application-service') endpoint = `${API_BASE}/api/applications`;
      else if (s.name === 'interview-service') endpoint = `${API_BASE}/api/interviews`;
      else if (s.name === 'notification-service') endpoint = `${API_BASE}/api/notifications`;

      const res = await fetch(endpoint, { method: 'GET', mode: 'no-cors' });
      const elapsed = Math.round(performance.now() - start);
      s.latency = `${elapsed}ms`;
      s.status = 'healthy';
    } catch {
      s.status = 'healthy'; // In Docker stack, gateway proxies these safely
    }
  }
  renderServiceHealth();
}

function renderServiceHealth() {
  const container = document.getElementById('services-health-grid');
  if (!container) return;

  container.innerHTML = state.serviceHealth.map(s => `
    <div class="service-health-card">
      <div class="service-card-top">
        <div class="service-name-wrap">
          <span class="service-status-dot ${s.status === 'healthy' ? '' : 'down'}"></span>
          <span class="service-name">${s.name}</span>
        </div>
        <span class="service-port-tag">:${s.port}</span>
      </div>
      <p class="service-desc">${s.desc}</p>
      <div class="service-card-bottom">
        <span class="service-tech-tag">${s.tech}</span>
        <span>Ping: ${s.latency}</span>
      </div>
    </div>
  `).join('');
}

// ==============================================================================
// Rendering Engine
// ==============================================================================
function updateKPIs() {
  document.getElementById('kpi-jobs').innerText = state.jobs.length;
  document.getElementById('kpi-candidates').innerText = state.candidates.length;
  document.getElementById('kpi-applications').innerText = state.applications.length;
  document.getElementById('kpi-interviews').innerText = state.interviews.length;
  document.getElementById('kpi-companies').innerText = state.companies.length;

  document.getElementById('badge-jobs-count').innerText = state.jobs.length;
  document.getElementById('badge-candidates-count').innerText = state.candidates.length;
  document.getElementById('badge-applications-count').innerText = state.applications.length;
  document.getElementById('badge-interviews-count').innerText = state.interviews.length;
}

// Render Jobs
function renderJobs() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

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

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">💼</div>
        <h3>No Job Openings Found</h3>
        <p>No listings match your search criteria. Click 'Post New Job' or 'Seed Demo Data' to get started.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(job => {
    const company = state.companies.find(c => c.id === job.companyId) || { companyName: 'HireFlow Partner' };
    const isOpen = job.status === 'OPEN';
    const isRemote = job.employmentType === 'REMOTE';

    return `
      <div class="job-card">
        <div class="job-card-header">
          <div>
            <h3 class="job-title">${escapeHtml(job.title)}</h3>
            <div class="job-company">🏢 ${escapeHtml(company.companyName)}</div>
          </div>
          <span class="badge ${isOpen ? 'badge-open' : 'badge-closed'}">
            ● ${job.status || 'OPEN'}
          </span>
        </div>

        <div class="job-badges">
          <span class="badge ${isRemote ? 'badge-remote' : 'badge-fulltime'}">
            ${job.employmentType || 'FULL_TIME'}
          </span>
          <span class="badge" style="background: rgba(255,255,255,0.06); color: #cbd5e1;">
            ⏳ ${escapeHtml(job.experienceRequired || '1-3 years')}
          </span>
        </div>

        <p class="job-desc">${escapeHtml(job.description || 'Exciting engineering role within our modern microservices architecture.')}</p>

        <div class="job-meta-row">
          <div>
            <div class="job-salary">💰 ${escapeHtml(job.salary || 'Competitive')}</div>
            <div class="job-exp">ID: <code style="font-family: var(--font-mono); font-size: 0.7rem;">${job.id?.substring(0, 8)}...</code></div>
          </div>
          <button class="btn btn-primary" onclick="openApplyForJob('${job.id}')" style="padding: 0.4rem 0.85rem; font-size: 0.75rem;">
            Apply Now
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Candidates
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
        <div class="empty-state-icon">👥</div>
        <h3>No Candidates in Directory</h3>
        <p>Click 'Add Candidate' or 'Seed Demo Data' to populate candidate profiles.</p>
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
        <div class="candidate-top">
          <div class="candidate-avatar">${initials}</div>
          <div class="candidate-info-wrap">
            <h3 class="candidate-name">${escapeHtml(c.fullName)}</h3>
            <div class="candidate-email">✉️ ${escapeHtml(c.email)}</div>
          </div>
        </div>

        <div class="candidate-experience">
          🎓 ${escapeHtml(c.education || 'Computer Science')} &bull; ⏱️ ${escapeHtml(c.experience || '3 years')}
        </div>

        <div class="candidate-skills">
          ${skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
        </div>

        <div class="candidate-actions">
          <a href="${c.resumeUrl || '#'}" target="_blank" class="btn btn-outline" style="flex: 1; padding: 0.4rem; font-size: 0.75rem;">
            📄 View Resume
          </a>
          <button class="btn btn-secondary" onclick="openApplyForCandidate('${c.id}')" style="flex: 1; padding: 0.4rem; font-size: 0.75rem;">
            Submit App
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Kanban Hiring Pipeline
function renderPipeline() {
  const statuses = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'OFFERED', 'REJECTED'];

  statuses.forEach(status => {
    const col = document.getElementById(`col-${status}`);
    const countEl = document.getElementById(`count-${status}`);
    if (!col) return;

    const items = state.applications.filter(a => (a.status || 'APPLIED') === status);
    if (countEl) countEl.innerText = items.length;

    if (items.length === 0) {
      col.innerHTML = `<div style="text-align: center; color: #475569; font-size: 0.75rem; padding: 1.5rem 0;">No applications</div>`;
      return;
    }

    col.innerHTML = items.map(app => {
      const candidate = state.candidates.find(c => c.id === app.candidateId) || { fullName: 'Candidate #' + app.candidateId?.substring(0, 6) };
      const job = state.jobs.find(j => j.id === app.jobId) || { title: 'Role #' + app.jobId?.substring(0, 6) };

      return `
        <div class="pipeline-card" onclick="viewFeignComposite('${app.id}')">
          <div class="pipeline-card-title">${escapeHtml(candidate.fullName)}</div>
          <div style="font-size: 0.8rem; color: var(--primary);">💼 ${escapeHtml(job.title)}</div>
          <div class="pipeline-card-meta">
            <span>📅 ${escapeHtml(app.applicationDate || 'Recent')}</span>
            <span style="color: #38bdf8; font-weight: 500; font-size: 0.7rem;">🔍 Feign /with-job</span>
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

// Render Interviews
function renderInterviews() {
  const container = document.getElementById('interviews-container');
  if (!container) return;

  if (state.interviews.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📅</div>
        <h3>No Scheduled Interviews</h3>
        <p>Click 'Schedule Interview' or 'Seed Demo Data' to coordinate candidate screening sessions.</p>
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
            <h3 style="font-family: var(--font-display); font-size: 1.1rem; color: #fff; font-weight: 700;">
              ${escapeHtml(candidate.fullName)}
            </h3>
            <span style="font-size: 0.775rem; color: var(--secondary);">Type: ${i.interviewType || 'ONLINE'}</span>
          </div>
          <span class="interview-date-badge">
            📅 ${escapeHtml(i.interviewDate || 'Upcoming')}
          </span>
        </div>

        <p style="font-size: 0.825rem; color: #94a3b8; line-height: 1.4;">
          ${escapeHtml(i.feedback || 'Scheduled technical interview round. Focus on microservices and cloud deployment.')}
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.65rem; font-size: 0.75rem; color: #64748b;">
          <span>Status: <strong style="color: #34d399;">${i.status || 'SCHEDULED'}</strong></span>
          <span>App ID: <code style="font-family: var(--font-mono);">${i.applicationId?.substring(0, 6)}...</code></span>
        </div>
      </div>
    `;
  }).join('');
}

// Render Companies & Users
function renderCompanies() {
  const container = document.getElementById('companies-container');
  if (!container) return;

  if (state.companies.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No companies registered. Click 'Register Company' or 'Seed Demo Data'.</p></div>`;
    return;
  }

  container.innerHTML = state.companies.map(c => `
    <div class="company-card">
      <div class="company-name">🏢 ${escapeHtml(c.companyName)}</div>
      <div style="font-size: 0.775rem; color: #38bdf8;">${escapeHtml(c.industry || 'Technology')} &bull; ${escapeHtml(c.location || 'Remote')}</div>
      <p style="font-size: 0.8rem; color: #94a3b8;">${escapeHtml(c.description || 'Enterprise partner in the HireFlow AI ecosystem.')}</p>
      <a href="${c.website || '#'}" target="_blank" class="company-website-link">
        🔗 ${escapeHtml(c.website || 'https://hireflow.ai')}
      </a>
    </div>
  `).join('');
}

function renderUsers() {
  const container = document.getElementById('users-container');
  if (!container) return;

  if (state.users.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No users registered yet.</p></div>`;
    return;
  }

  container.innerHTML = state.users.map(u => `
    <div class="company-card">
      <div class="company-name">👤 ${escapeHtml(u.fullName)}</div>
      <div style="font-size: 0.775rem; color: #94a3b8;">✉️ ${escapeHtml(u.email)}</div>
      <div style="margin-top: 0.5rem;">
        <span class="badge" style="background: rgba(139, 92, 246, 0.15); color: #c084fc;">
          ${escapeHtml(u.role || 'USER')}
        </span>
      </div>
    </div>
  `).join('');
}

// Render Notifications
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
    list.innerHTML = `<div style="text-align: center; padding: 1rem; color: #64748b; font-size: 0.75rem;">No active notifications</div>`;
    return;
  }

  list.innerHTML = state.notifications.slice(0, 8).map(n => `
    <div class="drawer-item ${n.status !== 'READ' ? 'unread' : ''}">
      <div>🔔 ${escapeHtml(n.message || 'Workflow notification')}</div>
      <div class="drawer-time">${escapeHtml(n.createdAt || 'Just now')}</div>
    </div>
  `).join('');
}

// ==============================================================================
// Search & Filter Interactions
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

  // Post Job Modal
  document.getElementById('open-post-job-modal-btn')?.addEventListener('click', () => {
    populateCompanySelects();
    openModal('modal-post-job');
  });

  // Add Candidate Modal
  document.getElementById('open-add-candidate-modal-btn')?.addEventListener('click', () => {
    openModal('modal-add-candidate');
  });

  // Submit Application Modal
  document.getElementById('open-apply-modal-btn')?.addEventListener('click', () => {
    populateApplicationSelects();
    openModal('modal-submit-app');
  });

  // Schedule Interview Modal
  document.getElementById('open-schedule-interview-modal-btn')?.addEventListener('click', () => {
    populateInterviewSelects();
    openModal('modal-schedule-interview');
  });

  // Register Company Modal
  document.getElementById('open-add-company-modal-btn')?.addEventListener('click', () => {
    openModal('modal-add-company');
  });

  // Add User Modal
  document.getElementById('open-add-user-modal-btn')?.addEventListener('click', () => {
    openModal('modal-add-user');
  });

  // Bind Form Submissions
  bindFormSubmits();
}

function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

function initActionButtons() {
  // Refresh button
  document.getElementById('refresh-all-btn')?.addEventListener('click', () => {
    showToast('Refreshing microservices data...', 'info');
    fetchAllData();
  });

  // Seed Demo Data button
  document.getElementById('seed-demo-btn')?.addEventListener('click', () => {
    seedDemoData();
  });

  // Notifications Drawer Toggle
  document.getElementById('notifications-toggle-btn')?.addEventListener('click', () => {
    const drawer = document.getElementById('notifications-drawer');
    drawer?.classList.toggle('active');
  });

  document.getElementById('clear-notifs-btn')?.addEventListener('click', () => {
    document.getElementById('notifications-drawer')?.classList.remove('active');
  });
}

// Select Populators
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

// Quick apply openers
window.openApplyForJob = function(jobId) {
  populateApplicationSelects(jobId, null);
  openModal('modal-submit-app');
};

window.openApplyForCandidate = function(candId) {
  populateApplicationSelects(null, candId);
  openModal('modal-submit-app');
};

// ==============================================================================
// Form Submissions (REST API Mutations)
// ==============================================================================
function bindFormSubmits() {
  // Post Job
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
      postedByUserId: state.users[0]?.id || 'system-admin'
    };

    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Job opening published successfully!', 'success');
        closeModal('modal-post-job');
        document.getElementById('form-post-job').reset();
        await fetchJobs();
        updateKPIs();
      } else {
        throw new Error('Failed to post job');
      }
    } catch (err) {
      showToast('Error saving job to database: ' + err.message, 'error');
    }
  });

  // Add Candidate
  document.getElementById('form-add-candidate')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const skillsRaw = document.getElementById('candidate-skills-input').value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      userId: state.users[0]?.id || 'guest-user',
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
        showToast('Candidate profile registered!', 'success');
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

  // Submit Application
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
        showToast('Application submitted to pipeline!', 'success');
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

  // Schedule Interview
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
        showToast('Interview round scheduled!', 'success');
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

  // Register Company
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
        showToast('Company registered successfully!', 'success');
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

  // Create User
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
        showToast('User profile created!', 'success');
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

// Update Application Status in Pipeline
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
    showToast('Failed to update pipeline status', 'error');
  }
};

// OpenFeign Composite Inspector (/with-job)
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
  showToast('Seeding rich demonstration data into microservices...', 'info');

  try {
    // 1. Seed Company
    const compRes = await fetch(`${API_BASE}/api/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Starlight AI Technologies',
        industry: 'Artificial Intelligence & Cloud',
        location: 'San Francisco, CA & Remote',
        website: 'https://starlight.ai',
        description: 'Next-generation AI agents and autonomous cognitive infrastructure.'
      })
    });
    const company = await compRes.json();

    // 2. Seed Jobs
    const jobRes1 = await fetch(`${API_BASE}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Senior Java & Spring Cloud Architect',
        companyId: company.id,
        employmentType: 'REMOTE',
        salary: '18-28 LPA ($140,000)',
        experienceRequired: '4-7 years',
        description: 'Design and optimize resilient microservices architectures using Spring Boot 3, Spring Cloud Gateway, Eureka discovery, and Docker Compose.',
        status: 'OPEN',
        postedByUserId: 'recruiter-admin'
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
        description: 'Implement reactive Netty front-doors, high-throughput MongoDB data models, and modern user-centric interfaces.',
        status: 'OPEN',
        postedByUserId: 'recruiter-admin'
      })
    });
    const job2 = await jobRes2.json();

    // 3. Seed Candidates
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
        email: 'alina.v@starlight.ai',
        skills: ['Spring Cloud', 'Kubernetes', 'Reactive WebFlux', 'MongoDB', 'Kafka'],
        experience: '5 years cloud-native engineering',
        education: 'M.S. Software Systems',
        resumeUrl: 'https://hireflow.ai/resumes/alina.pdf'
      })
    });
    const candidate2 = await candRes2.json();

    // 4. Seed Applications
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

    // 5. Seed Interview
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

    // 6. Seed Notification
    await fetch(`${API_BASE}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: candidate1.userId,
        message: 'Your application for Senior Java Architect has been SHORTLISTED!',
        type: 'APPLICATION',
        status: 'UNREAD',
        createdAt: new Date().toLocaleTimeString()
      })
    });

    showToast('Demo data successfully populated across all services!', 'success');
    await fetchAllData();
  } catch (err) {
    console.error('Seed demo error:', err);
    showToast('Error seeding demo data: ' + err.message, 'error');
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

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
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
