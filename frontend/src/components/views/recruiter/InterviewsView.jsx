import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, PlusCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Modal from '../../common/Modal';

export default function InterviewsView() {
  const {
    interviews,
    candidates,
    applications,
    jobs,
    openModal,
    completeInterviewSession,
    cancelInterviewSession
  } = useApp();

  // State for complete/cancel modal
  const [activeAction, setActiveAction] = useState(null); // { type: 'complete' | 'cancel', interview: obj, note: string }
  const [submitting, setSubmitting] = useState(false);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!activeAction) return;

    setSubmitting(true);
    try {
      if (activeAction.type === 'complete') {
        await completeInterviewSession(activeAction.interview.id, activeAction.note);
      } else if (activeAction.type === 'cancel') {
        await cancelInterviewSession(activeAction.interview.id, activeAction.note);
      }
      setActiveAction(null);
    } catch {
      // Error toast already handled by AppContext
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') {
      return <span className="badge badge-open">COMPLETED</span>;
    }
    if (status === 'CANCELLED') {
      return <span className="badge badge-danger">CANCELLED</span>;
    }
    return <span className="badge badge-neutral">{status || 'SCHEDULED'}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Interview Coordination</h1>
          <p className="view-desc">Schedule, evaluate, complete, or cancel technical assessments and team evaluation rounds.</p>
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
            const isCancelled = iv.status === 'CANCELLED';
            const isScheduled = !isCompleted && !isCancelled;

            return (
              <div key={iv.id} className="interview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="interview-title">{candidate.fullName}</h3>
                    <div className="interview-job-target">{job.title}</div>
                  </div>
                  {getStatusBadge(iv.status)}
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
                  <strong>{isCompleted ? 'Evaluation Feedback:' : isCancelled ? 'Status Detail:' : 'Focus Notes:'}</strong> {iv.feedback || 'No notes provided.'}
                </div>

                {/* Complete & Cancel Actions */}
                {isScheduled && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        flex: 1,
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        background: 'var(--success-bg)',
                        color: 'var(--success-text)',
                        border: '1px solid var(--success-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveAction({
                        type: 'complete',
                        interview: iv,
                        note: iv.feedback || ''
                      })}
                    >
                      <CheckCircle2 size={13} /> Complete
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        flex: 1,
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        background: 'var(--danger-bg)',
                        color: 'var(--danger-text)',
                        border: '1px solid var(--danger-border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveAction({
                        type: 'cancel',
                        interview: iv,
                        note: ''
                      })}
                    >
                      <XCircle size={13} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Complete / Cancel Confirmation Modal */}
      {activeAction && (
        <Modal
          isOpen={Boolean(activeAction)}
          busy={submitting}
          onClose={() => setActiveAction(null)}
          title={activeAction.type === 'complete' ? 'Complete Interview Assessment' : 'Cancel Interview Session'}
          subtitle={
            activeAction.type === 'complete'
              ? 'Record evaluation results, scorecard summary, and overall candidate feedback.'
              : 'Cancel this scheduled interview. A cancellation notification will be sent to the candidate.'
          }
        >
          <form onSubmit={handleActionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label" htmlFor="action-note">
                {activeAction.type === 'complete' ? 'Evaluation Feedback & Notes' : 'Reason for Cancellation'}
              </label>
              <textarea
                id="action-note"
                className="form-textarea"
                rows="3"
                required={activeAction.type === 'cancel'}
                placeholder={
                  activeAction.type === 'complete'
                    ? 'E.g., Strong performance in coding & Spring Boot. Recommended to proceed to final round.'
                    : 'E.g., Candidate requested rescheduling, or position was filled.'
                }
                value={activeAction.note}
                onChange={(e) => setActiveAction({ ...activeAction, note: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={submitting}
                onClick={() => setActiveAction(null)}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn"
                disabled={submitting}
                style={{
                  background: activeAction.type === 'complete' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color: activeAction.type === 'complete' ? 'var(--success-text)' : 'var(--danger-text)',
                  border: `1px solid ${activeAction.type === 'complete' ? 'var(--success-border)' : 'var(--danger-border)'}`
                }}
              >
                {submitting
                  ? (activeAction.type === 'complete' ? 'Completing...' : 'Cancelling...')
                  : (activeAction.type === 'complete' ? 'Mark Completed' : 'Confirm Cancellation')
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
