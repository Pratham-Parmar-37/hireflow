import React from 'react';
import { useApp } from '../../../context/AppContext';
import { BookmarkCheck, Calendar, Briefcase, Building } from 'lucide-react';

export default function CandidateApplicationsView() {
  const { candidateApplications, jobs, companies, setActiveTab } = useApp();

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">My Applications</h1>
          <p className="view-desc">Live status tracking for your submitted applications across hiring partners.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('tab-job-board')}>
          Browse More Jobs
        </button>
      </div>

      {candidateApplications.length === 0 ? (
        <div className="empty-state">
          <BookmarkCheck size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem auto' }} />
          <p>You haven't applied to any roles yet.</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Check the Job Board to discover open positions matching your tech stack.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '0.75rem' }}
            onClick={() => setActiveTab('tab-job-board')}
          >
            Go to Job Board
          </button>
        </div>
      ) : (
        <div className="my-apps-list">
          {candidateApplications.map(app => {
            const job = jobs.find(j => j.id === app.jobId) || { title: 'Position', employmentType: 'FULL_TIME' };
            const company = companies.find(c => c.id === job.companyId) || { companyName: 'Partner Organization' };
            const status = app.status || 'APPLIED';

            return (
              <div key={app.id} className="my-app-card">
                <div className="my-app-card-header">
                  <div>
                    <div className="my-app-job-title">{job.title}</div>
                    <div className="my-app-company">
                      <Building size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {company.companyName}
                    </div>
                  </div>
                  <span className={`status-pill ${getStatusPillClass(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                </div>

                <div className="my-app-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} /> Applied: {app.applicationDate || 'Recently'}
                  </span>
                  <span className="badge badge-neutral">{job.employmentType || 'FULL_TIME'}</span>
                  {job.salary && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Briefcase size={12} /> {job.salary}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
