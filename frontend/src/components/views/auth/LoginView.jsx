import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Shield, KeyRound, Mail, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN',
    label: 'Administrator',
    badgeClass: 'role-indicator-admin',
    name: 'Pratham Parmar',
    email: 'pratham@hireflow.ai',
    password: 'admin123',
    desc: 'System health, monitoring, user admin & talent pipeline'
  },
  {
    role: 'RECRUITER',
    label: 'Recruiter',
    badgeClass: 'role-indicator-recruiter',
    name: 'Sarah Jenkins',
    email: 'sarah.j@hireflow.ai',
    password: 'recruiter123',
    desc: 'Job requisitions, candidate pool, Kanban pipeline & scheduling'
  },
  {
    role: 'CANDIDATE',
    label: 'Candidate',
    badgeClass: 'role-indicator-candidate',
    name: 'Alina Vance',
    email: 'alina.v@starlight.tech',
    password: 'candidate123',
    desc: 'Job board, 1-click apply, application tracking & interviews'
  }
];

export default function LoginView() {
  const { login, register, addToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name');
          setLoading(false);
          return;
        }
        await register({ fullName, email, password, role });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrorMessage('');
    setLoading(true);
    try {
      await login(account.email, account.password);
    } catch (err) {
      setErrorMessage(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-app)',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="sidebar-logo" style={{ width: '38px', height: '38px', fontSize: '1.25rem' }}>H</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              HireFlow
            </h1>
            <span className="sidebar-workspace-pill">v2.0</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
            Enterprise Microservices Talent & Pipeline Platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="panel-card" style={{ padding: '2rem', boxShadow: 'var(--shadow-overlay)' }}>
          {/* Mode Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-subtle)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              style={{
                border: 'none',
                background: mode === 'login' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: mode === 'login' ? 600 : 500,
                fontSize: '0.8rem',
                padding: '0.5rem',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition)'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              style={{
                border: 'none',
                background: mode === 'register' ? 'var(--bg-surface)' : 'transparent',
                color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: mode === 'register' ? 600 : 500,
                fontSize: '0.8rem',
                padding: '0.5rem',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition)'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger-text)',
              fontSize: '0.785rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                    placeholder="e.g. Maya Lin"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="form-label">Account Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="CANDIDATE">Candidate (Job seeker profile)</option>
                  <option value="RECRUITER">Recruiter (Manage pipeline & requisitions)</option>
                  <option value="ADMIN">Administrator (Full system & health access)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem', marginTop: '0.5rem', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating with MongoDB...</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  {mode === 'login' ? 'Sign In to HireFlow' : 'Create Account'}
                  <ArrowRight size={14} />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Quick Demo Credentials Box */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.785rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              1-Click Demo Accounts (MongoDB Auth)
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', margin: '0 0 0.85rem 0' }}>
            Click below to instantly authenticate against MongoDB users collection with real role authorizations:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-border)';
                  e.currentTarget.style.background = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {acc.name}
                    </span>
                    <span className={`role-indicator ${acc.badgeClass}`}>
                      {acc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                    {acc.email} &bull; pass: <code>{acc.password}</code>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
