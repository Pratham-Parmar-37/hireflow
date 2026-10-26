import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import * as api from '../../api/client';
import { applicationError, localDate } from '../../utils/records';

export default function SubmitApplicationModal() {
  const { activeModal, modalData, closeModal, candidates, jobs, applications, refreshAll, addToast } = useApp();
  const isOpen = activeModal === 'submit-app';

  const [candidateId, setCandidateId] = useState(modalData?.candidateId || '');
  const [jobId, setJobId] = useState(modalData?.jobId || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = applicationError({ candidateId, jobId, candidates, jobs, applications });
    if (error) { addToast(error, 'warning'); return; }
    setSubmitting(true);
    try {
      await api.createApplication({
        candidateId,
        jobId,
        applicationDate: localDate(),
        status: 'APPLIED'
      });
      addToast('Application submitted to pipeline! 📋', 'success');
      closeModal();
      await refreshAll();
    } catch (err) {
      addToast('Failed to submit application: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      busy={submitting}
      onClose={closeModal}
      title="Submit Application"
      subtitle="Connect a candidate to an active opening in the recruitment pipeline."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label" htmlFor="SubmitApplicationModal-1">Select Candidate</label>
          <select id="SubmitApplicationModal-1"
            className="form-select"
            required
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
          >
            <option value="">{candidates.length ? 'Select a candidate' : 'Register a candidate first'}</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="SubmitApplicationModal-2">Target Job Opening</label>
          <select id="SubmitApplicationModal-2"
            className="form-select"
            required
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          >
            <option value="">Select an open job</option>
            {jobs.filter(job => job.status === 'OPEN').map(j => (
              <option key={j.id} value={j.id}>{j.title} ({j.employmentType})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" disabled={submitting} onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting || !candidates.length || !jobs.some(job => job.status === 'OPEN')}>
            {submitting ? 'Submitting...' : 'Submit to Pipeline'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
