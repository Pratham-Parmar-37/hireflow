import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, Bell, Sun, Moon } from 'lucide-react';

const TITLE_MAP = {
  'tab-overview': 'Overview',
  'tab-jobs': 'Job Openings',
  'tab-candidates': 'Candidate Directory',
  'tab-pipeline': 'Hiring Pipeline',
  'tab-interviews': 'Interviews',
  'tab-companies': 'Companies & Team',
  'tab-health': 'Service Health',
  'tab-candidate-dashboard': 'My Dashboard',
  'tab-job-board': 'Job Board',
  'tab-my-applications': 'My Applications',
  'tab-my-interviews': 'My Interviews'
};

export default function Topbar() {
  const {
    activeTab,
    theme,
    toggleTheme,
    refreshAll,
    refreshHealth,
    visibleNotifications: notifications,
    setIsNotificationsOpen,
    addToast
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.status !== 'READ').length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (activeTab === 'tab-health') {
      await refreshHealth();
      addToast('Service health checks updated', 'info');
    } else {
      const succeeded = await refreshAll();
      addToast(succeeded ? 'Recruitment data refreshed' : 'Some data could not be refreshed. See the message above.', succeeded ? 'info' : 'warning');
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="breadcrumb-label">HireFlow /</span>
        <span className="breadcrumb-active">{TITLE_MAP[activeTab] || 'Overview'}</span>
        <span style={{ color: 'var(--border-muted)', margin: '0 0.25rem' }}>&bull;</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{currentTime}</span>
      </div>

      <div className="topbar-actions">
        {/* Refresh Data Button */}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleRefresh}
          title="Refresh microservices data"
          disabled={isRefreshing}
          style={{ gap: '0.45rem', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>

        {/* Notifications Toggle */}
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => setIsNotificationsOpen(prev => !prev)}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="icon-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="btn btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
