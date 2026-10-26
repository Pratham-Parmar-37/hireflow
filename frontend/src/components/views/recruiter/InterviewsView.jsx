import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, PlusCircle, Clock } from 'lucide-react';

export default function InterviewsView() {
  const { interviews, candidates, applications, jobs, openModal } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Interview Coordination</h1>
          <p className="view-desc">Schedule and manage technical assessments and team evaluation rounds.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('schedule-interview')}>
          <PlusCircle size={14} /> Schedule Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="empty-state">
          <Calendar size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem auto' }} />
          <p>No interviews scheduled yet.</p>
        </div>
      ) : (
        <div className="interviews-grid">
          {interviews.map(iv => {
            const candidate = candidates.find(c => c.id === iv.candidateId) || { fullName: 'Candidate' };
            const app = applications.find(a => a.id === iv.applicationId);
            const job = app ? (jobs.find(j => j.id === app.jobId) || { title: 'Position' }) : { title: 'Position' };

            const isCompleted = iv.status === 'COMPLETED';

            return (
              <div key={iv.id} className="interview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="interview-title">{candidate.fullName}</h3>
                    <div className="interview-job-target">{job.title}</div>
                  </div>
                  <span className={`badge ${isCompleted ? 'badge-open' : 'badge-neutral'}`}>
                    {iv.status || 'SCHEDULED'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                  <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                    {iv.interviewType || 'TECHNICAL'}
                  </span>
                  <span className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={11} /> {iv.interviewDate || 'TBD'}
                  </span>
                </div>

                <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <strong>Notes:</strong> {iv.feedback || 'No notes provided.'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
