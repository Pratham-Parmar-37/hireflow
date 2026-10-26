import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import * as api from '../../api/client';

export default function AddCandidateModal() {
  const { activeModal, closeModal, users, refreshAll, addToast } = useApp();
  const isOpen = activeModal === 'add-candidate';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    skills: '',
    experience: '',
    education: '',
    resumeUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      addToast('Name and email are required', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        userId: users.find(user => user.role === 'CANDIDATE' && user.email?.trim().toLowerCase() === formData.email.trim().toLowerCase())?.id || null,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        skills: skillsArray,
        experience: formData.experience,
        education: formData.education,
        resumeUrl: formData.resumeUrl
      };

      await api.createCandidate(payload);
      addToast('Candidate registered successfully! 👤', 'success');
      closeModal();
      setFormData({
        fullName: '',
        email: '',
        skills: '',
        experience: '',
        education: '',
        resumeUrl: ''
      });
      await refreshAll();
    } catch (err) {
      addToast('Failed to add candidate: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      busy={submitting}
      onClose={closeModal}
      title="Register Talent Profile"
      subtitle="Matching candidate accounts are linked by email. Profiles can also be registered without an account."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-row">
          <div>
            <label className="form-label" htmlFor="AddCandidateModal-1">Full Name</label>
            <input id="AddCandidateModal-1"
              type="text"
              className="form-input"
              placeholder="e.g. Elena Rostova"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label" htmlFor="AddCandidateModal-2">Email Address</label>
            <input id="AddCandidateModal-2"
              type="email"
              className="form-input"
              placeholder="e.g. elena@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="AddCandidateModal-3">Technical Skills (Comma separated)</label>
          <input id="AddCandidateModal-3"
            type="text"
            className="form-input"
            placeholder="e.g. React, TypeScript, Spring Boot, Docker, Kafka"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div>
            <label className="form-label" htmlFor="AddCandidateModal-4">Experience Summary</label>
            <input id="AddCandidateModal-4"
              type="text"
              className="form-input"
              placeholder="e.g. 4 years full stack engineering"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="AddCandidateModal-5">Education / Degree</label>
            <input id="AddCandidateModal-5"
              type="text"
              className="form-input"
              placeholder="e.g. B.S. in Computer Science"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="AddCandidateModal-6">Portfolio or Resume Link</label>
          <input id="AddCandidateModal-6"
            type="url"
            className="form-input"
            placeholder="https://github.com/... or https://linkedin.com/in/..."
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" disabled={submitting} onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Registering...' : 'Add to Pool'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
