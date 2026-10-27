import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api/client';
import { localDate, applicationError } from '../utils/records';

const AppContext = createContext(null);

const INITIAL_SERVICES = [
  { name: 'eureka-server', port: 8761, desc: 'Central Service Registry & Discovery Server', tech: 'Spring Cloud Netflix Eureka', status: 'unknown', latency: null },
  { name: 'api-gateway', port: 8088, desc: 'Dynamic Reactive Reverse Proxy & UI Host', tech: 'Spring Cloud Gateway (WebFlux)', status: 'unknown', latency: null },
  { name: 'user-service', port: 8081, desc: 'Role-based User Profiles & Identity Management', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
  { name: 'company-job-service', port: 8082, desc: 'Enterprise Directory & Job Openings Catalog', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
  { name: 'candidate-service', port: 8083, desc: 'Talent Pool, Skills Graph & Resume Profiles', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
  { name: 'application-service', port: 8084, desc: 'Hiring Workflow & OpenFeign Job Consumer', tech: 'Spring Boot 3 + OpenFeign', status: 'unknown', latency: null },
  { name: 'interview-service', port: 8085, desc: 'Technical Screening & Evaluation Rounds', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null },
  { name: 'notification-service', port: 8086, desc: 'Event-driven Candidate Alerts & Messages', tech: 'Spring Boot 3 + MongoDB', status: 'unknown', latency: null }
];

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('hireflow-theme') || 'light');

  // Authenticated User from MongoDB
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hireflow-auth-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => localStorage.getItem('hireflow-auth-token') || null);

  // Authenticated Role from MongoDB
  const role = currentUser?.role || null;
  const isAuthenticated = Boolean(currentUser && authToken);

  // Simulated Candidate Persona for candidate views
  const [simulatedCandidateId, setSimulatedCandidateId] = useState(null);

  // Active Tab
  const [activeTab, setActiveTabState] = useState(() => {
    const userRole = currentUser?.role;
    return userRole === 'CANDIDATE' ? 'tab-candidate-dashboard' : 'tab-overview';
  });

  // Microservices Entities
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [serviceHealth, setServiceHealth] = useState(INITIAL_SERVICES);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const healthChecking = useRef(false);
  const [lastHealthCheck, setLastHealthCheck] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState([]);
  const refreshSequence = useRef(0);
  const applying = useRef(new Set());
  const [applyingJobIds, setApplyingJobIds] = useState([]);

  // Modals & Panels
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Theme synchronization
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('hireflow-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Role-guarded active tab setter
  const setActiveTab = useCallback((newTab) => {
    if (role === 'CANDIDATE') {
      const allowed = ['tab-candidate-dashboard', 'tab-job-board', 'tab-my-applications', 'tab-my-interviews'];
      if (!allowed.includes(newTab)) {
        setActiveTabState('tab-candidate-dashboard');
        return;
      }
    } else if (role === 'RECRUITER') {
      if (newTab === 'tab-health') {
        setActiveTabState('tab-overview');
        addToast('Service Health monitoring requires Administrator permissions.', 'warning');
        return;
      }
    }
    setActiveTabState(newTab);
  }, [role, addToast]);

  // Authentication: Login
  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    setCurrentUser(res.user);
    setAuthToken(res.token);
    localStorage.setItem('hireflow-auth-user', JSON.stringify(res.user));
    localStorage.setItem('hireflow-auth-token', res.token);

    if (res.user.role === 'CANDIDATE') {
      setActiveTabState('tab-candidate-dashboard');
    } else {
      setActiveTabState('tab-overview');
    }

    addToast(`Signed in as ${res.user.fullName} (${res.user.role})`, 'success');
    return res.user;
  }, [addToast]);

  // Authentication: Logout
  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('hireflow-auth-user');
    localStorage.removeItem('hireflow-auth-token');
    setActiveTabState('tab-overview');
    addToast('Signed out of session.', 'info');
  }, [addToast]);

  // Authentication: Register
  const register = useCallback(async (userData) => {
    const res = await api.register(userData);
    setCurrentUser(res.user);
    setAuthToken(res.token);
    localStorage.setItem('hireflow-auth-user', JSON.stringify(res.user));
    localStorage.setItem('hireflow-auth-token', res.token);

    if (res.user.role === 'CANDIDATE') {
      try {
        const cand = await api.createCandidate({
          userId: res.user.id,
          fullName: res.user.fullName,
          email: res.user.email,
          skills: ['Software Engineering'],
          experience: 'Candidate Profile',
          education: 'Degree'
        });
        setSimulatedCandidateId(cand.id);
      } catch (e) {
        console.warn('Candidate profile creation notice:', e);
      }
      setActiveTabState('tab-candidate-dashboard');
    } else {
      setActiveTabState('tab-overview');
    }

    addToast(`Account created! Welcome, ${res.user.fullName}!`, 'success');
    return res.user;
  }, [addToast]);

  // Data fetching
  const refreshAll = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getJobs(),
        api.getCandidates(),
        api.getApplications(),
        api.getInterviews(),
        api.getCompanies(),
        api.getUsers(),
        api.getNotifications()
      ]);

      if (sequence !== refreshSequence.current) return false;
      const labels = ['Job openings', 'Candidates', 'Applications', 'Interviews', 'Companies', 'Users', 'Notifications'];
      const failures = results.flatMap((result, index) => result.status === 'rejected' ? [labels[index]] : []);
      setLoadErrors(failures);
      if (results[0].status === 'fulfilled') setJobs(results[0].value);
      if (results[1].status === 'fulfilled') {
        const cands = results[1].value;
        setCandidates(cands);
        // Link candidate persona
        if (currentUser?.role === 'CANDIDATE') {
          const match = cands.find(c => c.email?.toLowerCase() === currentUser.email?.toLowerCase() || c.userId === currentUser.id);
          if (match) setSimulatedCandidateId(match.id);
          else if (cands.length > 0) setSimulatedCandidateId(cands[0].id);
        } else {
          setSimulatedCandidateId(prev => {
            if (prev && cands.some(c => c.id === prev)) return prev;
            return cands.length > 0 ? cands[0].id : null;
          });
        }
      }
      if (results[2].status === 'fulfilled') setApplications(results[2].value);
      if (results[3].status === 'fulfilled') setInterviews(results[3].value);
      if (results[4].status === 'fulfilled') setCompanies(results[4].value);
      if (results[5].status === 'fulfilled') setUsers(results[5].value);
      if (results[6].status === 'fulfilled') setNotifications(results[6].value);
      return failures.length === 0;
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoadErrors(['Recruitment data']);
      return false;
    } finally {
      if (sequence === refreshSequence.current) setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Health ping check
  const refreshHealth = useCallback(async () => {
    if (healthChecking.current) return;
    healthChecking.current = true;
    setIsHealthChecking(true);
    setServiceHealth(prev => prev.map(s => ({ ...s, status: 'checking', latency: null })));

    try {
      const updated = await Promise.all(
        INITIAL_SERVICES.map(async s => {
          const res = await api.checkServiceHealth(s.name);
          return { ...s, status: res.status, latency: res.latency };
        })
      );
      setServiceHealth(updated);
      setLastHealthCheck(new Date().toLocaleTimeString());
    } finally {
      healthChecking.current = false;
      setIsHealthChecking(false);
    }
  }, []);

  // Candidate: 1-click apply to job
  const candidateApplyToJob = useCallback(async (jobId) => {
    const error = applicationError({ candidateId: simulatedCandidateId, jobId, candidates, jobs, applications });
    if (error) { addToast(error, 'error'); return; }
    const requestKey = `${simulatedCandidateId}:${jobId}`;
    if (applying.current.has(requestKey)) return;
    applying.current.add(requestKey);
    setApplyingJobIds([...applying.current]);
    try {
      const created = await api.createApplication({
        candidateId: simulatedCandidateId,
        jobId: jobId,
        applicationDate: localDate(),
        status: 'APPLIED'
      });

      setApplications(prev => [...prev, created]);
      const candidate = candidates.find(item => item.id === simulatedCandidateId);
      if (candidate?.userId) {
        api.createNotification({
          userId: candidate.userId,
          type: 'APPLICATION',
          createdAt: new Date().toISOString(),
          message: 'Application successfully submitted! Current status: APPLIED.',
          status: 'UNREAD'
        }).then(() => api.getNotifications().then(setNotifications)).catch(() => {});
      }

      addToast('Application submitted successfully! 🎉', 'success');
    } catch (err) {
      addToast('Failed to submit application: ' + err.message, 'error');
    } finally {
      applying.current.delete(requestKey);
      setApplyingJobIds([...applying.current]);
    }
  }, [simulatedCandidateId, candidates, jobs, applications, addToast]);

  // Recruiter: update application pipeline status
  const updateApplicationStatus = useCallback(async (appId, newStatus) => {
    const existing = applications.find(a => a.id === appId);
    if (!existing) return;

    try {
      await api.updateApplication(appId, { ...existing, status: newStatus });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      addToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      addToast('Failed to update status: ' + err.message, 'error');
    }
  }, [applications, addToast]);

  // Recruiter: complete interview session
  const completeInterviewSession = useCallback(async (interviewId, feedback) => {
    try {
      const updated = await api.completeInterview(interviewId, feedback);
      setInterviews(prev => prev.map(i => i.id === interviewId ? updated : i));
      addToast('Interview marked as Completed! ✅', 'success');

      const interview = interviews.find(i => i.id === interviewId);
      if (interview) {
        const cand = candidates.find(c => c.id === interview.candidateId);
        if (cand?.userId) {
          api.createNotification({
            userId: cand.userId,
            type: 'INTERVIEW',
            createdAt: new Date().toISOString(),
            message: `Your interview has been completed! Notes: ${feedback || 'Evaluated successfully.'}`,
            status: 'UNREAD'
          }).then(() => api.getNotifications().then(setNotifications)).catch(() => {});
        }
      }
      return updated;
    } catch (err) {
      addToast('Failed to complete interview: ' + err.message, 'error');
      throw err;
    }
  }, [interviews, candidates, addToast]);

  // Recruiter: cancel interview session
  const cancelInterviewSession = useCallback(async (interviewId, reason) => {
    try {
      const updated = await api.cancelInterview(interviewId, reason);
      setInterviews(prev => prev.map(i => i.id === interviewId ? updated : i));
      addToast('Interview session cancelled.', 'info');

      const interview = interviews.find(i => i.id === interviewId);
      if (interview) {
        const cand = candidates.find(c => c.id === interview.candidateId);
        if (cand?.userId) {
          api.createNotification({
            userId: cand.userId,
            type: 'INTERVIEW',
            createdAt: new Date().toISOString(),
            message: `Your scheduled interview was cancelled.${reason ? ` Reason: ${reason}` : ''}`,
            status: 'UNREAD'
          }).then(() => api.getNotifications().then(setNotifications)).catch(() => {});
        }
      }
      return updated;
    } catch (err) {
      addToast('Failed to cancel interview: ' + err.message, 'error');
      throw err;
    }
  }, [interviews, candidates, addToast]);

  // Recruiter: OpenFeign composite viewer
  const viewFeignComposite = useCallback(async (appId) => {
    setActiveModal('feign-viewer');
    setModalData({ loading: true, data: null, error: null });
    try {
      const data = await api.getApplicationWithJob(appId);
      setModalData({ loading: false, data, error: null });
    } catch (err) {
      setModalData({ loading: false, data: null, error: err.message });
    }
  }, []);

  const openModal = useCallback((modalName, data = null) => {
    setActiveModal(modalName);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // Compute active candidate object
  const activeCandidate = candidates.find(c => c.id === simulatedCandidateId) || null;

  // Compute candidate-specific collections
  const candidateApplications = simulatedCandidateId
    ? applications.filter(a => a.candidateId === simulatedCandidateId)
    : [];

  const candidateInterviews = simulatedCandidateId
    ? interviews.filter(i => i.candidateId === simulatedCandidateId)
    : [];

  const visibleNotifications = role === 'CANDIDATE'
    ? notifications.filter(notification => activeCandidate?.userId && notification.userId === activeCandidate.userId)
    : notifications;

  return (
    <AppContext.Provider
      value={{
        isLoading,
        loadErrors,
        applyingJobIds,
        visibleNotifications,
        theme,
        toggleTheme,
        currentUser,
        authToken,
        isAuthenticated,
        role,
        login,
        logout,
        register,
        activeTab,
        setActiveTab,
        simulatedCandidateId,
        setSimulatedCandidateId,
        activeCandidate,
        jobs,
        candidates,
        applications,
        interviews,
        companies,
        users,
        notifications,
        serviceHealth,
        isHealthChecking,
        lastHealthCheck,
        candidateApplications,
        candidateInterviews,
        activeModal,
        modalData,
        openModal,
        closeModal,
        isNotificationsOpen,
        setIsNotificationsOpen,
        toasts,
        addToast,
        removeToast,
        refreshAll,
        refreshHealth,
        candidateApplyToJob,
        updateApplicationStatus,
        viewFeignComposite,
        completeInterviewSession,
        cancelInterviewSession
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
