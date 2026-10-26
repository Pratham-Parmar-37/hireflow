import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Briefcase, Users, GitBranch, Calendar, PlusCircle, ArrowUpRight } from 'lucide-react';

export default function OverviewView() {
  const {
    jobs,
    candidates,
    applications,
    interviews,
    setActiveTab,
    openModal
  } = useApp();

  const openJobs = jobs.filter(j => j.status === 'OPEN').length;

  // Pipeline distribution counts
  const stageCounts = {
    APPLIED: applications.filter(a => (a.status || 'APPLIED') === 'APPLIED').length,
    UNDER_REVIEW: applications.filter(a => a.status === 'UNDER_REVIEW').length,
    SHORTLISTED: applications.filter(a => a.status === 'SHORTLISTED').length,
    OFFERED: applications.filter(a => a.status === 'OFFERED').length,
    REJECTED: applications.filter(a => a.status === 'REJECTED').length
  };

  const totalApps = applications.length || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Talent Operations Dashboard</h1>
          <p className="view-desc">Unified control plane across distributed talent microservices.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => openModal('post-job')}>
            <PlusCircle size={14} /> Post Opening
          </button>
          <button className="btn btn-secondary" onClick={() => openModal('add-candidate')}>
            <Users size={14} /> Add Candidate
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => setActiveTab('tab-jobs')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Job Openings</span>
            <div className="kpi-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
              <Briefcase size={16} />
            </div>
          </div>
          <div className="kpi-value">{jobs.length}</div>
          <div className="kpi-subtext" style={{ color: 'var(--success-text)' }}>
            {openJobs} actively accepting candidates
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('tab-candidates')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Candidate Pool</span>
            <div className="kpi-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="kpi-value">{candidates.length}</div>
          <div className="kpi-subtext">Registered talent profiles</div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('tab-pipeline')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Applications</span>
            <div className="kpi-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <GitBranch size={16} />
            </div>
          </div>
          <div className="kpi-value">{applications.length}</div>
          <div className="kpi-subtext">Across 5 hiring stages</div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('tab-interviews')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-label">Scheduled Interviews</span>
            <div className="kpi-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
              <Calendar size={16} />
            </div>
          </div>
          <div className="kpi-value">{interviews.filter(interview => interview.status === 'SCHEDULED').length}</div>
          <div className="kpi-subtext">Technical & cultural rounds</div>
        </div>
      </div>

      {/* Pipeline Stage Distribution & Quick Actions */}
      <div className="overview-layout">
        {/* Pipeline Distribution Card */}
        <div className="panel-card">
          <div className="panel-header">
            <span className="panel-title">Pipeline Stage Distribution</span>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              onClick={() => setActiveTab('tab-pipeline')}
            >
              Open Pipeline <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="panel-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { stage: 'Applied', key: 'APPLIED', color: 'var(--primary)' },
                { stage: 'Under Review', key: 'UNDER_REVIEW', color: 'var(--warning)' },
                { stage: 'Shortlisted', key: 'SHORTLISTED', color: 'var(--success)' },
                { stage: 'Offered', key: 'OFFERED', color: '#16a34a' },
                { stage: 'Rejected', key: 'REJECTED', color: 'var(--danger)' }
              ].map(item => {
                const count = stageCounts[item.key] || 0;
                const pct = Math.round((count / totalApps) * 100);
                return (
                  <div key={item.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.stage}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: '7px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: item.color,
                          borderRadius: 'var(--radius-pill)',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Recruitment Actions */}
        <div className="panel-card">
          <div className="panel-header">
            <span className="panel-title">Fast Actions</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              onClick={() => openModal('post-job')}
            >
              <Briefcase size={15} style={{ color: 'var(--primary)' }} />
              <span>Post New Requisition</span>
            </button>

            <button
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              onClick={() => openModal('add-candidate')}
            >
              <Users size={15} style={{ color: 'var(--success)' }} />
              <span>Register Candidate Profile</span>
            </button>

            <button
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              onClick={() => openModal('submit-app')}
            >
              <GitBranch size={15} style={{ color: 'var(--warning)' }} />
              <span>Submit Candidate to Pipeline</span>
            </button>

            <button
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              onClick={() => openModal('schedule-interview')}
            >
              <Calendar size={15} style={{ color: '#9333ea' }} />
              <span>Schedule Assessment Round</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Talent Pool Snapshot */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Recent Candidate Profiles
          </h3>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
            onClick={() => setActiveTab('tab-candidates')}
          >
            View All ({candidates.length})
          </button>
        </div>

        <div className="candidates-grid">
          {candidates.slice(0, 4).map(c => {
            const initials = (c.fullName || 'C')
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();
            return (
              <div key={c.id} className="candidate-card">
                <div className="candidate-header">
                  <div className="candidate-avatar">{initials}</div>
                  <div>
                    <h3 className="candidate-name">{c.fullName}</h3>
                    <div className="candidate-email">{c.email}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {c.experience || 'Experience not provided'}
                </p>
                <div className="candidate-skills">
                  {(c.skills || []).slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-chip">{skill}</span>
                  ))}
                  {(c.skills || []).length > 3 && (
                    <span className="skill-chip">+{c.skills.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
