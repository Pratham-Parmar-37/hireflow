import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import NotificationsDrawer from './components/layout/NotificationsDrawer';
import ToastContainer from './components/common/ToastContainer';

// Recruiter Views
import OverviewView from './components/views/recruiter/OverviewView';
import JobsView from './components/views/recruiter/JobsView';
import CandidatesView from './components/views/recruiter/CandidatesView';
import PipelineView from './components/views/recruiter/PipelineView';
import InterviewsView from './components/views/recruiter/InterviewsView';
import CompaniesView from './components/views/recruiter/CompaniesView';

// Candidate Views
import CandidateDashboardView from './components/views/candidate/CandidateDashboardView';
import CandidateJobBoardView from './components/views/candidate/CandidateJobBoardView';
import CandidateApplicationsView from './components/views/candidate/CandidateApplicationsView';
import CandidateInterviewsView from './components/views/candidate/CandidateInterviewsView';

// Administrator View
import ServiceHealthView from './components/views/admin/ServiceHealthView';

// Modals
import PostJobModal from './components/modals/PostJobModal';
import AddCandidateModal from './components/modals/AddCandidateModal';
import SubmitApplicationModal from './components/modals/SubmitApplicationModal';
import ScheduleInterviewModal from './components/modals/ScheduleInterviewModal';
import AddCompanyModal from './components/modals/AddCompanyModal';
import AddUserModal from './components/modals/AddUserModal';
import FeignViewerModal from './components/modals/FeignViewerModal';

function MainContent() {
  const { activeTab, activeModal, isLoading, loadErrors, refreshAll } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      // Recruiter Tabs
      case 'tab-overview':
        return <OverviewView />;
      case 'tab-jobs':
        return <JobsView />;
      case 'tab-candidates':
        return <CandidatesView />;
      case 'tab-pipeline':
        return <PipelineView />;
      case 'tab-interviews':
        return <InterviewsView />;
      case 'tab-companies':
        return <CompaniesView />;

      // Candidate Tabs
      case 'tab-candidate-dashboard':
        return <CandidateDashboardView />;
      case 'tab-job-board':
        return <CandidateJobBoardView />;
      case 'tab-my-applications':
        return <CandidateApplicationsView />;
      case 'tab-my-interviews':
        return <CandidateInterviewsView />;

      // Admin Tab
      case 'tab-health':
        return <ServiceHealthView />;

      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-stage">
        <Topbar />
        <div className="content-workspace">
          {isLoading && <div className="data-status" role="status">Loading recruitment data…</div>}
          {loadErrors.length > 0 && <div className="data-status error" role="alert">
            Could not load: {loadErrors.join(', ')}. Previously loaded records may be out of date.
            <button className="btn btn-secondary" onClick={refreshAll} disabled={isLoading}>Retry</button>
          </div>}
          {renderActiveView()}
        </div>
      </main>

      {/* Global Modals & Drawers */}
      {activeModal === 'post-job' && <PostJobModal />}
      {activeModal === 'add-candidate' && <AddCandidateModal />}
      {activeModal === 'submit-app' && <SubmitApplicationModal />}
      {activeModal === 'schedule-interview' && <ScheduleInterviewModal />}
      {activeModal === 'add-company' && <AddCompanyModal />}
      {activeModal === 'add-user' && <AddUserModal />}
      <FeignViewerModal />
      <NotificationsDrawer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
