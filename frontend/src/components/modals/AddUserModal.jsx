import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import * as api from '../../api/client';

export default function AddUserModal() {
  const { activeModal, closeModal, refreshAll, addToast } = useApp();
  const isOpen = activeModal === 'add-user';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'RECRUITER'
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
      await api.createUser(formData);
      addToast('User account created! 👥', 'success');
      closeModal();
      setFormData({
        fullName: '',
        email: '',
        role: 'RECRUITER'
      });
      await refreshAll();
    } catch (err) {
      addToast('Failed to create user: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      busy={submitting}
      onClose={closeModal}
      title="Create User Account"
      subtitle="Create a directory profile with a role for the demo workspace."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label" htmlFor="AddUserModal-1">Full Name</label>
          <input id="AddUserModal-1"
            type="text"
            className="form-input"
            placeholder="e.g. Maya Lin"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="AddUserModal-2">Email Address</label>
          <input id="AddUserModal-2"
            type="email"
            className="form-input"
            placeholder="e.g. maya@hireflow.ai"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="AddUserModal-3">Directory Role</label>
          <select id="AddUserModal-3"
            className="form-select"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="RECRUITER">Recruiter</option>
            <option value="ADMIN">Platform Administrator</option>
            <option value="CANDIDATE">Candidate</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" disabled={submitting} onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
