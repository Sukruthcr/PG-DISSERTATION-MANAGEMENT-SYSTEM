import React, { useState } from 'react';
import { UserCheck, GraduationCap } from 'lucide-react';
import { AuthProvider } from './components/AuthProvider';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TopicList } from './components/Topics/TopicList';
import { TopicDetailModal } from './components/Topics/TopicDetailModal';
import { TopicForm } from './components/Topics/TopicForm';
import { ProgressTracker } from './components/Progress/ProgressTracker';
import { PublicationManager } from './components/Publications/PublicationManager';
import UserManagement from './components/Users/UserManagement';
import { ApprovalWorkflow } from './components/Approvals/ApprovalWorkflow';
import { AdminApproval } from './components/AdminApproval';
import { GuideAllocation } from './components/GuideAllocation';
import { GroupGuideAllocation } from './components/Admin/GroupGuideAllocation';
import { CoordinatorAllocation } from './components/CoordinatorAllocation';
import { ProjectReview } from './components/Projects/ProjectReview';
import { PendingRegistration } from './components/PendingRegistration';
import { exportTopicsToCSV, generateTopicReport } from './utils/exportUtils';
import { useAuth } from './hooks/useAuth';
import { useTopics } from './hooks/useTopics';
import { Topic } from './types';
import { LandingPage } from './components/Landing/LandingPage';
import { AboutSection } from './components/Landing/AboutSection';
import { FeaturesShowcase } from './components/Landing/FeaturesShowcase';
import { FuturisticLandingPage } from './components/Landing/FuturisticLandingPage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { topics, addTopic, updateTopic, getTopicsByStudent } = useTopics();
  const [activeView, setActiveView] = useState('dashboard');
  const [landingView, setLandingView] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showTopicDetail, setShowTopicDetail] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [showAdminApproval, setShowAdminApproval] = useState(false);
  const [showGuideAllocation, setShowGuideAllocation] = useState(false);
  const [showGroupGuideAllocation, setShowGroupGuideAllocation] = useState(false);
  const [showCoordinatorAllocation, setShowCoordinatorAllocation] = useState(false);
  const [showPendingRegistration, setShowPendingRegistration] = useState(false);

  // Listen for navigation events from Dashboard quick actions
  React.useEffect(() => {
    const handleNavigate = (event: any) => {
      const { view } = event.detail;
      setActiveView(view);
    };
    
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // Get topics based on user role
  const getTopicsForUser = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        // Students see only their own topics
        return getTopicsByStudent(user.student_id || user.id);
      case 'guide':
        // Guides see topics assigned to them AND submitted topics that need assignment
        return topics.filter(topic => {
          // Topics already assigned to this guide
          const assignedTopics = topic.guide_id === user.id || topic.co_guide_id === user.id;
          // Submitted topics that need assignment (no guide assigned yet)
          const submittedTopics = topic.status === 'submitted' && !topic.guide_id;
          // Topics under review that might need assignment
          const underReviewTopics = topic.status === 'under_review';

          return assignedTopics || submittedTopics || underReviewTopics;
        });
      case 'admin':
      case 'coordinator':
      case 'ethics_committee':
        // Admin and coordinators see all topics
        return topics;
      default:
        return topics;
    }
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleViewTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowTopicDetail(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setShowTopicForm(true);
  };

  const handleCreateTopic = () => {
    setEditingTopic(null);
    setShowTopicForm(true);
  };

  const handleSaveTopic = (topicData: Partial<Topic>) => {
    try {
      if (editingTopic) {
        // Update existing topic
        updateTopic(editingTopic.id, topicData);
        alert('Topic updated successfully!');
      } else {
        // Add new topic - ensure proper student_id assignment
        const newTopic = addTopic({
          ...topicData,
          student_id: user?.student_id || user?.id || 'current_student',
          status: 'submitted', // Ensure status is set to submitted
        });
        alert(`Topic "${newTopic.title}" submitted successfully! It will appear in your topic list.`);
      }
      setShowTopicForm(false);
      setEditingTopic(null);
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('Error saving topic. Please try again.');
    }
  };

  const handleExportTopics = () => {
    const userTopics = getTopicsForUser();
    exportTopicsToCSV(userTopics);
  };

  const handleGenerateReport = (topic: Topic) => {
    generateTopicReport(topic);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'topics':
      case 'my-topic':
        return (
          <>
            <TopicList
              topics={getTopicsForUser()}
              userRole={user?.role || 'student'}
              onCreateTopic={handleCreateTopic}
              onViewTopic={handleViewTopic}
              onEditTopic={handleEditTopic}
              onExport={handleExportTopics}
            />
            
            {/* Topic Detail Modal */}
            {selectedTopic && (
              <TopicDetailModal
                topic={selectedTopic}
                isOpen={showTopicDetail}
                onClose={() => {
                  setShowTopicDetail(false);
                  setSelectedTopic(null);
                }}
                onEdit={() => {
                  setShowTopicDetail(false);
                  handleEditTopic(selectedTopic);
                }}
                userRole={user?.role || 'student'}
              />
            )}

            {/* Topic Form Modal */}
            <TopicForm
              topic={editingTopic || undefined}
              isOpen={showTopicForm}
              onClose={() => {
                setShowTopicForm(false);
                setEditingTopic(null);
              }}
              onSave={handleSaveTopic}
              isEditing={!!editingTopic}
            />
          </>
        );
      
      case 'users':
        return (
          <UserManagement 
            userRole={user?.role || 'student'} 
            onCreateUser={() => {}}
            onEditUser={(user) => alert(`Edit user: ${user.full_name}`)}
            onDeleteUser={(user) => {}}
          />
        );
      
      case 'assignments':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignments Management</h2>
                <p className="text-gray-600">Manage guide and coordinator allocations</p>
              </div>
              {user?.role === 'admin' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGuideAllocation(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Guide Allocation
                  </button>
                  <button
                    onClick={() => setShowGroupGuideAllocation(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Group Guide Allocation
                  </button>
                  <button
                    onClick={() => setShowCoordinatorAllocation(true)}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Coordinator Allocation
                  </button>
                </div>
              )}
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Use the buttons above to manage guide and coordinator assignments</p>
            </div>
          </div>
        );
      
      case 'approvals':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Approvals</h2>
                <p className="text-gray-600">Manage user registrations and topic approvals</p>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowAdminApproval(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Manage User Approvals
                </button>
              )}
            </div>
            
            <ApprovalWorkflow 
              userRole={user?.role || 'student'}
              onApprove={(id, comment) => {
                console.log(`Approved: ${id} with comment: ${comment}`);
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.innerHTML = `
                  <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 00-8-8 4 4 0 008 8zm3.707-9.293a1 1 0 00-1.414 1.414L9.586 16.586A2 2 0 017.172 12.828 2.828 2.828zm-8.486 8H12a1 1 0 00-1 1v4a1 1 0 001 1h3.586l-1.707 1.707A4 4 0 011.586 8.414 8.414z" clip-rule="evenodd"/>
                      </svg>
                      Approval successful!
                    </div>
                  </div>
                `;
                successMessage.style.cssText = `
                  position: fixed;
                  top: 1rem;
                  right: 1rem;
                  z-index: 9999;
                `;
                document.body.appendChild(successMessage);
                setTimeout(() => {
                  document.body.removeChild(successMessage);
                }, 3000);
              }}
              onReject={(id, comment) => {
                console.log(`Rejected: ${id} with comment: ${comment}`);
                // Show rejection message
                const rejectMessage = document.createElement('div');
                rejectMessage.innerHTML = `
                  <div class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 00-8-8 4 4 0 008 8zm3.707-9.293a1 1 0 00-1.414 1.414L9.586 16.586A2 2 0 017.172 12.828 2.828 2.828zm-8.486 8H12a1 1 0 00-1 1v4a1 1 0 001 1h3.586l-1.707 1.707A4 4 0 011.586 8.414 8.414z" clip-rule="evenodd"/>
                      </svg>
                      Rejected successfully!
                    </div>
                  </div>
                `;
                rejectMessage.style.cssText = `
                  position: fixed;
                  top: 1rem;
                  right: 1rem;
                  z-index: 9999;
                `;
                document.body.appendChild(rejectMessage);
                setTimeout(() => {
                  document.body.removeChild(rejectMessage);
                }, 3000);
              }}
            />
          </div>
        );
      
      case 'progress':
        // Get user's project ID
        const userTopics = getTopicsForUser();
        const userTopicId = userTopics.length > 0 ? userTopics[0].id : '';
        
        if (!userTopicId) {
          return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No project found. Please submit a project first.</p>
            </div>
          );
        }
        
        return (
          <ProgressTracker 
            topicId={userTopicId} 
            userRole={user?.role || 'student'} 
            userId={user?.id || ''} 
          />
        );
      
      case 'publications':
        return (
          <PublicationManager 
            topicId="1" 
            userRole={user?.role || 'student'}
            onSavePublication={(data) => alert(`Publication saved: ${data.title}`)}
          />
        );
      
      case 'project-review':
        return (
          <ProjectReview guideId={user?.id || ''} />
        );
      
      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reports</h2>
            <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        {landingView === 'home' && <FuturisticLandingPage />}
        {landingView === 'about' && <AboutSection />}
        {landingView === 'features' && <FeaturesShowcase />}
        {landingView === 'login' && <LoginForm />}
        
        {/* Floating Login Button */}
        {landingView !== 'login' && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={() => setLandingView('login')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-strong hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Sign In
            </button>
          </div>
        )}
        
        {/* Landing Navigation */}
        {landingView !== 'login' && (
          <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-secondary-200 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="bg-gradient-primary p-2 rounded-lg mr-3">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gradient">PG Dissertation</span>
                  </div>
                </div>
                <div className="flex space-x-8">
                  <button
                    onClick={() => setLandingView('home')}
                    className={`text-sm font-medium transition-colors ${
                      landingView === 'home' ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setLandingView('about')}
                    className={`text-sm font-medium transition-colors ${
                      landingView === 'about' ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setLandingView('features')}
                    className={`text-sm font-medium transition-colors ${
                      landingView === 'features' ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'
                    }`}
                  >
                    Features
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
        
        {/* Back to Landing Button for Login */}
        {landingView === 'login' && (
          <div className="fixed top-8 left-8 z-50">
            <button
              onClick={() => setLandingView('home')}
              className="text-secondary-600 hover:text-secondary-900 font-medium transition-colors flex items-center"
            >
              &larr; Back to Home
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
        <main className="flex-1 ml-64 p-8 mt-16">
          {renderContent()}
        </main>
      </div>

      {/* Admin Approval Modal */}
      <AdminApproval
        isOpen={showAdminApproval}
        onClose={() => setShowAdminApproval(false)}
        onApprovalChange={async () => {
          // Force a page refresh to update user data
          window.location.reload();
        }}
      />

      {/* Guide Allocation Modal */}
      <GuideAllocation
        isOpen={showGuideAllocation}
        onClose={() => setShowGuideAllocation(false)}
        onAllocationChange={() => {
          // Refresh data if needed
          console.log('Allocation status changed');
        }}
      />

      {/* Group Guide Allocation Modal */}
      <GroupGuideAllocation
        isOpen={showGroupGuideAllocation}
        onClose={() => setShowGroupGuideAllocation(false)}
        onAllocationChange={() => {
          // Refresh data if needed
          console.log('Group allocation status changed');
        }}
      />

      {/* Coordinator Allocation Modal */}
      <CoordinatorAllocation
        isOpen={showCoordinatorAllocation}
        onClose={() => setShowCoordinatorAllocation(false)}
        onAllocationChange={() => {
          // Refresh data if needed
          console.log('Coordinator allocation status changed');
        }}
      />

      {/* Pending Registration Modal */}
      <PendingRegistration
        isOpen={showPendingRegistration}
        onClose={() => setShowPendingRegistration(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;