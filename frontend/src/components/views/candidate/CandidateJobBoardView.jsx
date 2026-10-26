import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Search, Briefcase, Building, Check } from 'lucide-react';

export default function CandidateJobBoardView() {
  const { jobs, companies, candidateApplications, candidateApplyToJob, activeCandidate, simulatedCandidateId, applyingJobIds } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const openJobs = jobs.filter(j => j.status === 'OPEN');

  const filteredJobs = openJobs.filter(job => {
    const matchesSearch = !searchTerm ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.salary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || job.employmentType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Job Board</h1>
          <p className="view-desc">Browse open engineering roles and apply directly with your talent profile.</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <div className="search-box">
          <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search open roles by title, salary, or tech keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Employment Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="REMOTE">Remote</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </div>

      {/* Job Board Grid */}
      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem auto' }} />
          <p>No open positions match your search criteria. Check back soon!</p>
        </div>
      ) : (
        <div className="job-board-grid">
          {filteredJobs.map(job => {
            const company = companies.find(c => c.id === job.companyId) || { companyName: 'Partner Organization' };
            const isApplied = candidateApplications.some(a => a.jobId === job.id);

            return (
              <div key={job.id} className="job-card">
                <div className="job-card-top">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-company">
                      <Building size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {company.companyName}
                    </div>
                  </div>
                  <span className="badge badge-open">Open</span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-neutral">{job.employmentType || 'FULL_TIME'}</span>
                  <span className="badge badge-neutral">{job.experienceRequired || 'Experience not specified'}</span>
                </div>

                <p className="job-desc">{job.description || 'No description provided.'}</p>

                <div className="job-card-bottom">
                  <div className="job-salary">{job.salary || 'Salary not specified'}</div>

                  {isApplied ? (
                    <span className="badge badge-open" style={{ padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Check size={12} /> Applied
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                      disabled={!activeCandidate || applyingJobIds.includes(`${simulatedCandidateId}:${job.id}`)}
                      onClick={() => candidateApplyToJob(job.id)}
                    >
                      {applyingJobIds.includes(`${simulatedCandidateId}:${job.id}`) ? 'Applying…' : !activeCandidate ? 'Select a candidate first' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
