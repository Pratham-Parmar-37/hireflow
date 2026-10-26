import { safeWebUrl } from '../../../utils/records';
import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Building2, UserPlus, Globe, MapPin, Shield } from 'lucide-react';

export default function CompaniesView() {
  const { companies, users, openModal } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Organizations & Team</h1>
          <p className="view-desc">Registered partner companies and access directory.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => openModal('add-company')}>
            <Building2 size={14} /> Register Company
          </button>
          <button className="btn btn-primary" onClick={() => openModal('add-user')}>
            <UserPlus size={14} /> Create User
          </button>
        </div>
      </div>

      {/* Partner Companies Section */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
          Partner Companies ({companies.length})
        </h3>
        {companies.length === 0 ? (
          <div className="empty-state">
            <p>No partner companies registered yet.</p>
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map(c => (
              <div key={c.id} className="company-card">
                <div className="company-title">{c.companyName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                  <span>{c.industry || 'Industry not specified'}</span>
                  <span>&bull;</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <MapPin size={11} /> {c.location || 'Location not specified'}
                  </span>
                </div>
                <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {c.description || 'Enterprise partner in the HireFlow talent ecosystem.'}
                </p>
                {safeWebUrl(c.website) && (
                  <a href={safeWebUrl(c.website)} target="_blank" rel="noopener noreferrer" className="company-link">
                    <Globe size={12} /> {c.website} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Accounts Section */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
          Team Accounts ({users.length})
        </h3>
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No user accounts registered.</p>
          </div>
        ) : (
          <div className="companies-grid">
            {users.map(u => (
              <div key={u.id} className="company-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="company-title">{u.fullName}</div>
                  <span className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Shield size={10} /> {u.role || 'USER'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
