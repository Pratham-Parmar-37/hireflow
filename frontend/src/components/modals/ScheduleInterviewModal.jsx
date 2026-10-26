import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import * as api from '../../api/client';
import { interviewError, localDate } from '../../utils/records';

export default function ScheduleInterviewModal() {
  const { activeModal, closeModal, candidates, applications, jobs, refreshAll, addToast } = useApp();
  const isOpen = activeModal === 'schedule-interview';

  const [formData, setFormData] = useState({
    candidateId: '',
    applicationId: '',
    interviewType: 'TECHNICAL',
    interviewDate: localDate(),
    feedback: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = interviewError({ ...formData, applications });
    if (error) { addToast(error, 'warning'); return; }
    setSubmitting(true);
    try {
      await api.createInterview({
        candidateId: formData.candidateId,
        applicationId: formData.applicationId,
        interviewType: formData.interviewType,
        interviewDate: formData.interviewDate,
        status: 'SCHEDULED',
        feedback: formData.feedback
      });
      addToast('Interview session scheduled! 📅', 'success');
      closeModal();
      setFormData({
        candidateId: '',
        applicationId: '',
        interviewType: 'TECHNICAL',
        interviewDate: localDate(),
        feedback: ''
      });
      await refreshAll();
    } catch (err) {
      addToast('Failed to schedule interview: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      busy={submitting}
      onClose={closeModal}
      title="Schedule Interview Round"
      subtitle="Coordinate technical, system design, or cultural assessment rounds."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label" htmlFor="ScheduleInterviewModal-1">Candidate</label>
          <select id="ScheduleInterviewModal-1"
            className="form-select"
            required
            value={formData.candidateId}
            onChange={(e) => setFormData({ ...formData, candidateId: e.target.value, applicationId: '' })}
          >
            <option value="">Select a candidate</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="ScheduleInterviewModal-2">Associated Pipeline Application</label>
          <select id="ScheduleInterviewModal-2"
            className="form-select"
            required
            disabled={!formData.candidateId}
            value={formData.applicationId}
            onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
          >
            <option value="">Select this candidate's application</option>
            {applications.filter(application => application.candidateId === formData.candidateId).map(a => (
              <option key={a.id} value={a.id}>{jobs.find(job => job.id === a.jobId)?.title || 'Unavailable job'} &bull; {a.status} (#{a.id.slice(-6)})</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label" htmlFor="ScheduleInterviewModal-3">Interview Type</label>
            <select id="ScheduleInterviewModal-3"
              className="form-select"
              value={formData.interviewType}
              onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
            >
              <option value="TECHNICAL">Technical Deep Dive</option>
              <option value="SYSTEM_DESIGN">System Architecture</option>
              <option value="BEHAVIORAL">Culture & Leadership</option>
              <option value="ONLINE">Screening Assessment</option>
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="ScheduleInterviewModal-4">Interview Date</label>
            <input id="ScheduleInterviewModal-4"
              type="date"
              min={localDate()}
              className="form-input"
              value={formData.interviewDate}
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="ScheduleInterviewModal-5">Focus Notes & Prep Brief</label>
          <textarea id="ScheduleInterviewModal-5"
            className="form-textarea"
            rows="2"
            placeholder="Key topics to evaluate (e.g. Distributed transactions, Spring Cloud, Kafka)..."
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" disabled={submitting} onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting || !formData.applicationId}>
            {submitting ? 'Scheduling...' : 'Confirm Schedule'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
