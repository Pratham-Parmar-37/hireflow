import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Search, PlusCircle, Building, Briefcase } from 'lucide-react';

export default function JobsView() {
  const { jobs, companies, openModal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.salary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || job.employmentType === typeFilter;
    const matchesStatus = !statusFilter || (job.status || 'OPEN') === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="view-header">
        <div>
          <h1 className="view-title">Job Openings</h1>
          <p className="view-desc">Catalog of active corporate positions & requisitions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('post-job')}>
          <PlusCircle size={14} /> Post Opening
        </button>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <div className="search-box">
          <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search openings by title, salary or keywords..."
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

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={36} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.5rem auto' }} />
          <p>No job openings match your filters.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => {
            const company = companies.find(c => c.id === job.companyId) || { companyName: 'Partner Org' };
            const isOpen = job.status === 'OPEN';

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
                  <span className={`badge ${isOpen ? 'badge-open' : 'badge-neutral'}`}>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-neutral">{job.employmentType || 'FULL_TIME'}</span>
                  <span className="badge badge-neutral">{job.experienceRequired || 'Experience not specified'}</span>
                </div>

                <p className="job-desc">{job.description || 'No description provided.'}</p>

                <div className="job-card-bottom">
                  <div className="job-salary">{job.salary || 'Salary not specified'}</div>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
                    disabled={!isOpen}
                    onClick={() => openModal('submit-app', { jobId: job.id })}
                  >
                    Submit Candidate
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
