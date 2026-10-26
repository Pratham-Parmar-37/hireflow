import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import * as api from '../../api/client';

export default function PostJobModal() {
  const { activeModal, closeModal, companies, users, refreshAll, addToast } = useApp();
  const isOpen = activeModal === 'post-job';

  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    postedByUserId: '',
    description: '',
    salary: '',
    experienceRequired: '',
    employmentType: 'FULL_TIME',
    status: 'OPEN'
  });
  const [submitting, setSubmitting] = useState(false);
  const recruiters = users.filter(user => ['RECRUITER', 'ADMIN'].includes(user.role));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Please enter a job title', 'warning');
      return;
    }

    if (!companies.some(company => company.id === formData.companyId) || !recruiters.some(user => user.id === formData.postedByUserId)) {
      addToast('Select a registered company and posting recruiter.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        title: formData.title.trim()
      };
      await api.createJob(payload);
      addToast('Job opening posted successfully! 🚀', 'success');
      closeModal();
      setFormData({
        title: '',
        companyId: '',
    postedByUserId: '',
        description: '',
        salary: '',
        experienceRequired: '',
        employmentType: 'FULL_TIME',
        status: 'OPEN'
      });
      await refreshAll();
    } catch (err) {
      addToast('Failed to post job: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      busy={submitting}
      onClose={closeModal}
      title="Create Job Opening"
      subtitle="Publish a new position to the talent pool & company catalog."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label" htmlFor="PostJobModal-1">Position Title</label>
          <input id="PostJobModal-1"
            type="text"
            className="form-input"
            placeholder="e.g. Senior Distributed Systems Engineer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="posting-recruiter">Posting Recruiter</label>
          <select id="posting-recruiter" className="form-select" value={formData.postedByUserId} required
            onChange={event => setFormData({ ...formData, postedByUserId: event.target.value })}>
            <option value="">{recruiters.length ? 'Select a recruiter' : 'Create a recruiter in Companies & Team first'}</option>
            {recruiters.map(user => <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>)}
          </select>
        </div>
        <div className="form-row">
          <div>
            <label className="form-label" htmlFor="PostJobModal-2">Hiring Company</label>
            <select id="PostJobModal-2"
              className="form-select"
              required
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            >
              <option value="">{companies.length ? 'Select a company' : 'Register a company first'}</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="PostJobModal-3">Employment Type</label>
            <select id="PostJobModal-3"
              className="form-select"
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="REMOTE">Remote</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label" htmlFor="PostJobModal-4">Salary Band / Compensation</label>
            <input id="PostJobModal-4"
              type="text"
              className="form-input"
              placeholder="e.g. $140,000 - $180,000"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="PostJobModal-5">Experience Required</label>
            <input id="PostJobModal-5"
              type="text"
              className="form-input"
              placeholder="e.g. 3-5 years"
              value={formData.experienceRequired}
              onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="PostJobModal-6">Job Description & Responsibilities</label>
          <textarea id="PostJobModal-6"
            className="form-textarea"
            rows="3"
            placeholder="Outline core responsibilities, tech stack, and qualifications..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" disabled={submitting} onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting || !companies.length || !recruiters.length}>
            {submitting ? 'Publishing...' : 'Publish Position'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
