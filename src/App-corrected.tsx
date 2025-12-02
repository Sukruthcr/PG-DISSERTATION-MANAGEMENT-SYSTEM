import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
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
import { UserManagement } from './components/Users/UserManagement';
import { ApprovalWorkflow } from './components/Approvals/ApprovalWorkflow';
import { AdminApproval } from './components/AdminApproval';
import { GuideAllocation } from './components/GuideAllocation';
import { PendingRegistration } from './components/PendingRegistration';
import { exportTopicsToCSV, generateTopicReport } from './utils/exportUtils';
import { useAuth } from './hooks/correctedUseAuth';
import { useTopics } from './hooks/useTopics';
import { Topic } from './types';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { topics, addTopic, updateTopic, getTopicsByStudent } = useTopics();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showTopicDetail, setShowTopicDetail] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [showAdminApproval, setShowAdminApproval] = useState(false);
  const [showGuideAllocation, setShowGuideAllocation] = useState(false);
  const [showPendingRegistration, setShowPendingRegistration] = useState(false);

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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Guide Assignments</h2>
                <p className="text-gray-600">Automatic guide allocation based on expertise matching</p>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowGuideAllocation(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Manage Allocations
                </button>
              )}
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600">Guide assignment management interface</p>
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
              onApprove={(id, comment) => alert(`Approved: ${id} with comment: ${comment}`)}
              onReject={(id, comment) => alert(`Rejected: ${id} with comment: ${comment}`)}
            />
          </div>
        );

      case 'progress':
        return (
          <ProgressTracker topicId="1" userRole={user?.role || 'student'} />
        );

      case 'publications':
        return (
          <PublicationManager
            topicId="1"
            userRole={user?.role || 'student'}
            onSavePublication={(data) => alert(`Publication saved: ${data.title}`)}
          />
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
    return <LoginForm />;
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
        onApprovalChange={() => {
          // Refresh data if needed
          console.log('Approval status changed');
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

      {/* Pending Registration Modal */}
      <PendingRegistration
        isOpen={showPendingRegistration}
        onClose={() => setShowPendingRegistration(false)}
        onRegistrationSubmitted={() => {
          // Refresh data if needed
          console.log('Registration submitted');
        }}
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
