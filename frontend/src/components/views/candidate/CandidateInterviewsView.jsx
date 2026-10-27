import React from 'react';
import { useApp } from '../../../context/AppContext';
import { CalendarClock } from 'lucide-react';

export default function CandidateInterviewsView() {
  const { candidateInterviews, candidateApplications, jobs } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">My Interviews</h1>
          <p className="view-desc">Upcoming technical assessments and evaluation sessions.</p>
        </div>
      </div>

      {candidateInterviews.length === 0 ? (
        <div className="empty-state">
          <CalendarClock size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem auto' }} />
          <p>No interviews scheduled yet.</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Once your submitted applications are shortlisted by recruiters, scheduled sessions will appear here.
          </p>
        </div>
      ) : (
        <div className="my-interviews-list">
          {candidateInterviews.map(iv => {
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
                    &bull; {iv.feedback || 'Technical round'}
                  </div>
                </div>
                <span className={`badge ${iv.status === 'COMPLETED' ? 'badge-open' : iv.status === 'CANCELLED' ? 'badge-danger' : 'badge-neutral'}`}>
                  {iv.status || 'SCHEDULED'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
