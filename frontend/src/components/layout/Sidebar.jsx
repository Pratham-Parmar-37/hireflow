import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  Calendar,
  Building2,
  Activity,
  UserCheck,
  BookmarkCheck,
  CalendarClock,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const {
    currentUser,
    role,
    logout,
    activeTab,
    setActiveTab,
    activeCandidate,
    jobs,
    candidates,
    applications,
    interviews,
    candidateApplications,
    candidateInterviews
  } = useApp();

  const handleBrandClick = () => {
    if (role === 'CANDIDATE') {
      setActiveTab('tab-candidate-dashboard');
    } else {
      setActiveTab('tab-overview');
    }
  };

  const openJobsCount = jobs.filter(j => (j.status || 'OPEN') === 'OPEN').length;

  const initials = (currentUser?.fullName || 'U')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const roleBadgeMap = {
    ADMIN: { label: 'Administrator', class: 'role-indicator-admin' },
    RECRUITER: { label: 'Recruiter', class: 'role-indicator-recruiter' },
    CANDIDATE: { label: 'Candidate', class: 'role-indicator-candidate' }
  };

  const roleInfo = roleBadgeMap[role] || { label: role || 'User', class: 'role-indicator-recruiter' };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo">H</div>
          <span className="sidebar-brand-name">HireFlow</span>
        </div>
        <span className="sidebar-workspace-pill">v2.0</span>
      </div>

      {/* Authenticated User Status Card */}
      <div style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', color: 'var(--success-text)', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
            <span></span>
          </div>
          <span className={`role-indicator ${roleInfo.class}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
            {roleInfo.label}
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentUser?.fullName}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentUser?.email}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Recruiter & Admin Sections */}
        {(role === 'RECRUITER' || role === 'ADMIN') && (
          <>
            <div className="nav-section-label">Recruitment</div>

            <button
              className={`nav-item ${activeTab === 'tab-overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-overview')}
            >
              <div className="nav-item-left">
                <LayoutDashboard size={15} />
                <span>Overview</span>
              </div>
            </button>

            <button
              className={`nav-item ${activeTab === 'tab-jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-jobs')}
            >
              <div className="nav-item-left">
                <Briefcase size={15} />
                <span>Job Openings</span>
              </div>
              <span className="nav-counter">{jobs.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'tab-candidates' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-candidates')}
            >
              <div className="nav-item-left">
                <Users size={15} />
                <span>Candidate Pool</span>
              </div>
              <span className="nav-counter">{candidates.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'tab-pipeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-pipeline')}
            >
              <div className="nav-item-left">
                <GitBranch size={15} />
                <span>Pipeline</span>
              </div>
              <span className="nav-counter">{applications.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'tab-interviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-interviews')}
            >
              <div className="nav-item-left">
                <Calendar size={15} />
                <span>Interviews</span>
              </div>
              <span className="nav-counter">{interviews.length}</span>
            </button>
          </>
        )}

        {/* Candidate Sections */}
        {role === 'CANDIDATE' && (
          <>
            <div className="nav-section-label">My Candidate Portal</div>

            <button
              className={`nav-item ${activeTab === 'tab-candidate-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-candidate-dashboard')}
            >
              <div className="nav-item-left">
                <UserCheck size={15} />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              className={`nav-item ${activeTab === 'tab-job-board' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-job-board')}
            >
              <div className="nav-item-left">
                <Briefcase size={15} />
                <span>Browse Jobs</span>
              </div>
              <span className="nav-counter">{openJobsCount}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'tab-my-applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-my-applications')}
            >
              <div className="nav-item-left">
                <BookmarkCheck size={15} />
                <span>My Applications</span>
              </div>
              <span className="nav-counter">{candidateApplications.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'tab-my-interviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-my-interviews')}
            >
              <div className="nav-item-left">
                <CalendarClock size={15} />
                <span>My Interviews</span>
              </div>
              <span className="nav-counter">{candidateInterviews.length}</span>
            </button>
          </>
        )}

        {/* Platform Sections */}
        {(role === 'RECRUITER' || role === 'ADMIN') && (
          <>
            <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>Platform</div>

            <button
              className={`nav-item ${activeTab === 'tab-companies' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-companies')}
            >
              <div className="nav-item-left">
                <Building2 size={15} />
                <span>Companies & Team</span>
              </div>
            </button>

            {role === 'ADMIN' && (
              <button
                className={`nav-item ${activeTab === 'tab-health' ? 'active' : ''}`}
                onClick={() => setActiveTab('tab-health')}
              >
                <div className="nav-item-left">
                  <Activity size={15} />
                  <span>Service Health</span>
                </div>
              </button>
            )}
          </>
        )}
      </nav>

      {/* Sidebar Footer User Badge with Sign Out */}
      <div className="sidebar-footer">
        <div className="sidebar-user-row">
          <div className="user-profile-badge">
            <div className="user-avatar-sm">{initials}</div>
            <div>
              <div className="user-info-text">{currentUser?.fullName}</div>
              <div className="user-role-text">{roleInfo.label}</div>
            </div>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={logout}
            title="Sign Out / Switch Account"
            aria-label="Sign Out"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--danger-text)' }}
          >
            <LogOut size={13} />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
