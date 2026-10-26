import React from 'react';
import { useApp } from '../../../context/AppContext';
import { PlusCircle, Code, Briefcase, Calendar } from 'lucide-react';

const COLUMNS = [
  { id: 'APPLIED', title: 'Applied', color: 'var(--primary)' },
  { id: 'UNDER_REVIEW', title: 'Under Review', color: 'var(--warning)' },
  { id: 'SHORTLISTED', title: 'Shortlisted', color: 'var(--success)' },
  { id: 'OFFERED', title: 'Offered', color: '#16a34a' },
  { id: 'REJECTED', title: 'Rejected', color: 'var(--danger)' }
];

export default function PipelineView() {
  const {
    applications,
    candidates,
    jobs,
    companies,
    updateApplicationStatus,
    viewFeignComposite,
    openModal
  } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Hiring Pipeline (Kanban)</h1>
          <p className="view-desc">
            Orchestrate candidate progression across recruitment stages. Each card can inspect OpenFeign composite aggregation in real time.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('submit-app')}>
          <PlusCircle size={14} /> Submit Candidate
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="pipeline-board">
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => (a.status || 'APPLIED') === col.id);

          return (
            <div key={col.id} className="pipeline-col">
              <div className="pipeline-col-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: col.color
                    }}
                  />
                  <span className="pipeline-col-title">{col.title}</span>
                </div>
                <span className="pipeline-counter">{colApps.length}</span>
              </div>

              <div className="pipeline-cards-wrap">
                {colApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>
                    No candidates in this stage
                  </div>
                ) : (
                  colApps.map(app => {
                    const candidate = candidates.find(c => c.id === app.candidateId) || {
                      fullName: 'Candidate',
                      email: 'No email'
                    };
                    const job = jobs.find(j => j.id === app.jobId) || {
                      title: 'Position Opening',
                      companyId: null
                    };
                    const company = companies.find(c => c.id === job.companyId) || {
                      companyName: 'Hiring Partner'
                    };

                    const initials = (candidate.fullName || 'C')
                      .split(' ')
                      .map(n => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    return (
                      <div key={app.id} className="pipeline-card">
                        <div className="pipeline-card-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="user-avatar-sm" style={{ width: '26px', height: '26px', fontSize: '0.65rem' }}>
                              {initials}
                            </div>
                            <div>
                              <div className="pipeline-card-name">{candidate.fullName}</div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{candidate.email}</div>
                            </div>
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                            #{app.id.slice(-4)}
                          </span>
                        </div>

                        <div style={{ margin: '0.5rem 0 0.4rem 0' }}>
                          <div className="pipeline-card-job" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Briefcase size={12} style={{ color: 'var(--text-tertiary)' }} />
                            <span>{job.title}</span>
                          </div>
                          <div className="pipeline-company-tag" style={{ marginLeft: '1rem', marginTop: '0.1rem' }}>
                            {company.companyName}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginBottom: '0.65rem' }}>
                          <Calendar size={11} />
                          <span>Applied: {app.applicationDate || 'Recent'}</span>
                        </div>

                        {/* Move Stage Selector & Feign Inspector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                          <select
                            className="form-select"
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', height: '28px', flex: 1 }}
                            value={app.status || 'APPLIED'}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          >
                            <option value="APPLIED">Move: Applied</option>
                            <option value="UNDER_REVIEW">Move: Under Review</option>
                            <option value="SHORTLISTED">Move: Shortlisted</option>
                            <option value="OFFERED">Move: Offered</option>
                            <option value="REJECTED">Move: Rejected</option>
                          </select>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            title="Inspect OpenFeign Composite Response"
                            style={{ padding: '0.2rem 0.45rem', height: '28px' }}
                            onClick={() => viewFeignComposite(app.id)}
                          >
                            <Code size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
