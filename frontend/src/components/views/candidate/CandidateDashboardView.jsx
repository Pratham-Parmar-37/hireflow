import React from 'react';
import { useApp } from '../../../context/AppContext';
import { localDate } from '../../../utils/records';

export default function CandidateDashboardView() {
  const {
    candidates,
    simulatedCandidateId,
    setSimulatedCandidateId,
    activeCandidate,
    candidateApplications,
    candidateInterviews,
    jobs,
    companies,
    setActiveTab,
    addToast,
    currentUser,
    role
  } = useApp();

  const handlePersonaChange = (e) => {
    const newId = e.target.value;
    setSimulatedCandidateId(newId);
    const cand = candidates.find(c => c.id === newId);
    if (cand) addToast(`Viewing as ${cand.fullName}`, 'info');
  };

  const initials = (activeCandidate?.fullName || 'C')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const upcomingInterviews = candidateInterviews.filter(interview => interview.status === 'SCHEDULED' && interview.interviewDate >= localDate()).sort((a, b) => a.interviewDate.localeCompare(b.interviewDate));

  const offeredCount = candidateApplications.filter(a => a.status === 'OFFERED').length;

  const getStatusPillClass = (status) => {
    const map = {
      APPLIED: 'status-pill-applied',
      UNDER_REVIEW: 'status-pill-under-review',
      SHORTLISTED: 'status-pill-shortlisted',
      OFFERED: 'status-pill-offered',
      REJECTED: 'status-pill-rejected'
    };
    return map[status] || 'status-pill-applied';
  };

  const getStatusLabel = (status) => {
    const map = {
      APPLIED: 'Applied',
      UNDER_REVIEW: 'Under Review',
      SHORTLISTED: 'Shortlisted',
      OFFERED: 'Offered 🎉',
      REJECTED: 'Not Selected'
    };
    return map[status] || status;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Header with Persona Picker */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Welcome Back 👋</h1>
          <p className="view-desc">Track your job applications, upcoming interviews, and career progress.</p>
        </div>

        {/* Candidate Persona Switcher or Authenticated Status */}
        {role !== 'CANDIDATE' ? (
          <div className="candidate-persona-picker">
            <label htmlFor="persona-select" className="candidate-persona-label">Testing as:</label>
            <select
              id="persona-select"
              className="candidate-persona-select"
              value={simulatedCandidateId || ''}
              onChange={handlePersonaChange}
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.fullName}</option>
              ))}
            </select>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', background: 'var(--bg-surface)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.825rem', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--role-candidate)', boxShadow: '0 0 6px var(--role-candidate)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Logged in as <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.fullName}</strong></span>
          </div>
        )}
      </div>

      {/* Candidate Profile Summary Card */}
      <div className="my-profile-card">
        <div className="my-profile-header">
          <div className="my-profile-avatar">{initials}</div>
          <div className="my-profile-details">
            <div className="my-profile-name">{activeCandidate?.fullName || 'Candidate Profile'}</div>
            <div className="my-profile-email">{activeCandidate?.email || 'No candidate profile selected'}</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {(activeCandidate?.skills || []).map((skill, idx) => (
                <span key={idx} className="skill-chip" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="my-profile-stats">
          <div className="my-profile-stat" onClick={() => setActiveTab('tab-my-applications')} style={{ cursor: 'pointer' }}>
            <div className="my-profile-stat-value">{candidateApplications.length}</div>
            <div className="my-profile-stat-label">Applications</div>
          </div>
          <div className="my-profile-stat" onClick={() => setActiveTab('tab-my-interviews')} style={{ cursor: 'pointer' }}>
            <div className="my-profile-stat-value">{candidateInterviews.length}</div>
            <div className="my-profile-stat-label">Interviews</div>
          </div>
          <div className="my-profile-stat">
            <div className="my-profile-stat-value" style={{ color: '#16a34a' }}>{offeredCount}</div>
            <div className="my-profile-stat-label">Job Offers</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Snapshot */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Recent Applications
          </h3>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
            onClick={() => setActiveTab('tab-my-applications')}
          >
            View All ({candidateApplications.length})
          </button>
        </div>

        {candidateApplications.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any applications yet.</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '0.75rem', fontSize: '0.75rem' }}
              onClick={() => setActiveTab('tab-job-board')}
            >
              Browse Open Positions
            </button>
          </div>
        ) : (
          <div className="my-apps-list">
            {candidateApplications.slice(0, 3).map(app => {
              const job = jobs.find(j => j.id === app.jobId) || { title: 'Position', employmentType: 'FULL_TIME' };
              const company = companies.find(c => c.id === job.companyId) || { companyName: 'Partner Organization' };
              const status = app.status || 'APPLIED';

              return (
                <div key={app.id} className="my-app-card">
                  <div className="my-app-card-header">
                    <div>
                      <div className="my-app-job-title">{job.title}</div>
                      <div className="my-app-company">{company.companyName}</div>
                    </div>
                    <span className={`status-pill ${getStatusPillClass(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                  </div>
                  <div className="my-app-meta">
                    <span>Applied: {app.applicationDate || 'Recently'}</span>
                    <span className="badge badge-neutral">{job.employmentType || 'FULL_TIME'}</span>
                    {job.salary && <span>{job.salary}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Interviews Snapshot */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Upcoming Interviews
          </h3>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
            onClick={() => setActiveTab('tab-my-interviews')}
          >
            View All ({candidateInterviews.length})
          </button>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming interviews.</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
              When your application is shortlisted by recruiters, interview rounds will appear here.
            </p>
          </div>
        ) : (
          <div className="my-interviews-list">
            {upcomingInterviews.slice(0, 3).map(iv => {
              const app = candidateApplications.find(a => a.id === iv.applicationId);
              const job = app ? (jobs.find(j => j.id === app.jobId) || { title: 'Position' }) : { title: 'Position' };

              let month = 'DATE';
              let day = '';
              if (iv.interviewDate) {
                try {
                  const d = new Date(`${iv.interviewDate}T00:00:00`);
                  if (Number.isNaN(d.getTime())) throw new Error('Invalid date');
                  month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                  day = d.getDate();
                } catch {
                  month = 'DAY';
                  day = iv.interviewDate;
                }
              }

              return (
                <div key={iv.id} className="my-interview-card">
                  <div className="interview-date-badge">
                    <span className="date-month">{month}</span>
                    <span className="date-day">{day}</span>
                  </div>
                  <div className="my-interview-info">
                    <div className="my-interview-title">{job.title}</div>
                    <div className="my-interview-meta">
                      <span className="badge badge-neutral" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                        {iv.interviewType || 'TECHNICAL'}
                      </span>
                      &bull; {iv.feedback || 'Assessment session'}
                    </div>
                  </div>
                  <span className={`badge ${iv.status === 'COMPLETED' ? 'badge-open' : 'badge-neutral'}`}>
                    {iv.status || 'SCHEDULED'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
