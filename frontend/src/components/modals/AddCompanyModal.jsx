import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import * as api from '../../api/client';

export default function AddCompanyModal() {
  const { activeModal, closeModal, refreshAll, addToast } = useApp();
  const isOpen = activeModal === 'add-company';

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    location: '',
    description: '',
    website: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      addToast('Company name is required', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await api.createCompany(formData);
      addToast('Company registered successfully! 🏢', 'success');
      closeModal();
      setFormData({
        companyName: '',
        industry: '',
        location: '',
        description: '',
        website: ''
      });
      await refreshAll();
    } catch (err) {
      addToast('Failed to register company: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      busy={submitting}
      onClose={closeModal}
      title="Register Partner Organization"
      subtitle="Add an enterprise company to HireFlow's directory."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label" htmlFor="AddCompanyModal-1">Company Name</label>
          <input id="AddCompanyModal-1"
            type="text"
            className="form-input"
            placeholder="e.g. Acme Corp or Starlight Tech"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div>
            <label className="form-label" htmlFor="AddCompanyModal-2">Industry Domain</label>
            <input id="AddCompanyModal-2"
              type="text"
              className="form-input"
              placeholder="e.g. Cloud Infrastructure, FinTech"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="AddCompanyModal-3">HQ Location</label>
            <input id="AddCompanyModal-3"
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, CA / Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="AddCompanyModal-4">Website</label>
          <input id="AddCompanyModal-4"
            type="url"
            className="form-input"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="AddCompanyModal-5">Company Overview</label>
          <textarea id="AddCompanyModal-5"
            className="form-textarea"
            rows="2"
            placeholder="Brief mission statement or engineering overview..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" disabled={submitting} onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register Company'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
