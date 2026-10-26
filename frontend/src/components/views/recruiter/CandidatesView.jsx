import { safeWebUrl } from '../../../utils/records';
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Search, UserPlus, FileText, ExternalLink, GraduationCap, Clock } from 'lucide-react';

export default function CandidatesView() {
  const { candidates, openModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.skills?.some(s => s.toLowerCase().includes(term)) ||
      c.experience?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Candidate Directory</h1>
          <p className="view-desc">Global talent pool with skills graph & resume profiles.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('add-candidate')}>
          <UserPlus size={14} /> Register Candidate
        </button>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <div className="search-box">
          <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search candidates by name, email, or skill (e.g. Java, Spring Boot, React)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="empty-state">
          <FileText size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem auto' }} />
          <p>No candidates found matching your criteria.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {filteredCandidates.map(c => {
            const initials = (c.fullName || 'C')
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div key={c.id} className="candidate-card">
                <div className="candidate-header">
                  <div className="candidate-avatar">{initials}</div>
                  <div>
                    <h3 className="candidate-name">{c.fullName}</h3>
                    <div className="candidate-email">{c.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={13} style={{ color: 'var(--text-tertiary)' }} />
                    <span>{c.experience || 'Experience not provided'}</span>
                  </div>
                  {c.education && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={13} style={{ color: 'var(--text-tertiary)' }} />
                      <span>{c.education}</span>
                    </div>
                  )}
                </div>

                {/* Skills Graph */}
                <div className="candidate-skills">
                  {(c.skills || []).map((skill, idx) => (
                    <span key={idx} className="skill-chip">{skill}</span>
                  ))}
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                  {safeWebUrl(c.resumeUrl) ? (
                    <a
                      href={safeWebUrl(c.resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="candidate-resume-link"
                    >
                      Resume <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>No link</span>
                  )}

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => openModal('submit-app', { candidateId: c.id })}
                  >
                    Submit to Job
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
