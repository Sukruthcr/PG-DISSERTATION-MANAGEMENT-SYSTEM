import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, Upload, Download, MessageSquare, FileText, Edit2, Save, X, Check, Star, Trash2 } from 'lucide-react';
import { ProgressMilestone, Document } from '../../types';
import { FinalSubmissionModal } from './FinalSubmissionModal';

interface ProgressTrackerProps {
  topicId: string;
  userRole: string;
  userId: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ topicId, userRole, userId }) => {
  const [milestones, setMilestones] = useState<ProgressMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessMessage, setAccessMessage] = useState('');

  // State for guide feedback editing
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [gradeValue, setGradeValue] = useState('');

  // State for Final Submission modal
  const [showFinalSubmissionModal, setShowFinalSubmissionModal] = useState(false);
  const [finalSubmissionMilestoneId, setFinalSubmissionMilestoneId] = useState<string | null>(null);

  // Load milestones from API
  useEffect(() => {
    loadMilestones();
  }, [topicId]);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      
      if (!topicId) {
        console.error('No topicId provided');
        setLoading(false);
        return;
      }
      
      console.log('Loading milestones for topic:', topicId);
      const response = await fetch(`http://localhost:3001/api/topics/${topicId}/milestones?userId=${userId}&userRole=${userRole}`);
      
      if (response.status === 403) {
        const data = await response.json();
        setAccessDenied(true);
        setAccessMessage(data.message || 'Access denied');
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Milestones response:', data);
      
      if (data.success) {
        if (data.milestones.length === 0) {
          console.log('No milestones found, initializing...');
          // Initialize milestones if none exist
          const initResponse = await fetch(`http://localhost:3001/api/topics/${topicId}/milestones/init`, {
            method: 'POST',
          });
          
          if (!initResponse.ok) {
            throw new Error(`Failed to initialize milestones: ${initResponse.status}`);
          }
          
          // Reload after initialization
          const reloadResponse = await fetch(`http://localhost:3001/api/topics/${topicId}/milestones`);
          const reloadData = await reloadResponse.json();
          if (reloadData.success) {
            setMilestones(reloadData.milestones);
            console.log('Milestones initialized:', reloadData.milestones.length);
          }
        } else {
          setMilestones(data.milestones);
          console.log('Loaded milestones:', data.milestones.length);
        }
      } else {
        console.error('API returned success: false', data);
        alert('Failed to load milestones: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to load milestones. Error: ${errorMessage}\n\nPlease check:\n1. Server is running on port 3001\n2. MongoDB is running\n3. You have a valid project`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
        return Clock;
      case 'overdue':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Guide functions
  const handleEditFeedback = (milestoneId: string, currentFeedback: string, currentGrade: number) => {
    setEditingMilestone(milestoneId);
    setFeedbackText(currentFeedback || '');
    setGradeValue(currentGrade?.toString() || '');
  };

  const handleSaveFeedback = async (milestoneId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/milestones/${milestoneId}/feedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback: feedbackText,
          grade: parseInt(gradeValue) || 0,
          userId,
          userRole,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await loadMilestones();
        setEditingMilestone(null);
        setFeedbackText('');
        setGradeValue('');
        alert('Feedback and grade saved successfully!');
      } else {
        alert('Failed to save feedback: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingMilestone(null);
    setFeedbackText('');
    setGradeValue('');
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/milestones/${milestoneId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userRole,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        await loadMilestones();
        alert('Milestone approved successfully!');
      } else {
        alert('Failed to approve milestone: ' + data.message);
      }
    } catch (error) {
      console.error('Error approving milestone:', error);
      alert('Failed to approve milestone. Please try again.');
    }
  };

  const handleFileUpload = (milestoneId: string, milestoneTitle: string) => {
    // Check if this is the Final Submission milestone
    if (milestoneTitle === 'Final Submission') {
      setFinalSubmissionMilestoneId(milestoneId);
      setShowFinalSubmissionModal(true);
      return;
    }

    // Regular file upload for other milestones
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx';

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        try {
          // Create document objects for uploaded files
          const newDocuments: Document[] = Array.from(files).map((file, index) => ({
            id: `doc_${Date.now()}_${index}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: '#', // In real app, this would be the uploaded file URL
            uploaded_by: 'current_user', // In real app, use actual user ID
            uploaded_at: new Date().toISOString(),
          }));

          const response = await fetch(`http://localhost:3001/api/milestones/${milestoneId}/documents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documents: newDocuments }),
          });

          const data = await response.json();
          if (data.success) {
            await loadMilestones();
            alert(`${files.length} file(s) uploaded successfully!\n\nFiles: ${Array.from(files).map(f => f.name).join(', ')}`);
          } else {
            alert('Failed to upload files: ' + data.message);
          }
        } catch (error) {
          console.error('Error uploading files:', error);
          alert('Failed to upload files. Please try again.');
        }
      }
    };

    input.click();
  };

  const handleDownloadDocument = (document: Document) => {
    alert(`Downloading: ${document.name}\n\nIn a real application, this would download the actual file from the server.`);
  };

  const handleDeleteDocument = async (milestoneId: string, documentId: string, documentName: string) => {
    if (!confirm(`Are you sure you want to delete "${documentName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/milestones/${milestoneId}/documents/${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await loadMilestones();
        alert('Document deleted successfully!');
      } else {
        alert('Failed to delete document: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleFinalSubmission = async (fileName: string, confidenceScore: number) => {
    if (!finalSubmissionMilestoneId) return;

    try {
      // Create document object for the accepted file
      const newDocument: Document = {
        id: `doc_${Date.now()}`,
        name: fileName,
        type: 'application/pdf',
        size: 0,
        url: '#',
        uploaded_by: userId,
        uploaded_at: new Date().toISOString(),
      };

      // Upload the document
      const uploadResponse = await fetch(`http://localhost:3001/api/milestones/${finalSubmissionMilestoneId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documents: [newDocument],
          analyzerScore: confidenceScore,
          analyzerFeedback: `Student-verified confidence score: ${confidenceScore}%`,
        }),
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.message || 'Failed to upload document');
      }

      // Approve the milestone (mark as completed)
      const approveResponse = await fetch(`http://localhost:3001/api/milestones/${finalSubmissionMilestoneId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userRole,
          autoApproved: true,
          analyzerScore: confidenceScore,
        }),
      });

      const approveData = await approveResponse.json();
      if (!approveData.success) {
        throw new Error(approveData.message || 'Failed to approve milestone');
      }

      // Reload milestones
      await loadMilestones();
      
      // Close modal
      setShowFinalSubmissionModal(false);
      setFinalSubmissionMilestoneId(null);

      // Show success message
      alert(`Your dissertation has been submitted successfully!\n\nConfidence Score: ${confidenceScore}%\nStatus: Final Submission Completed ✅`);
    } catch (error) {
      console.error('Error submitting final dissertation:', error);
      throw error;
    }
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading milestones...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">{accessMessage}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Progress tracking is restricted to assigned guides only. 
              If you believe you should have access, please contact the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Progress Overview</h2>
          <span className="text-sm text-gray-600">
            {completedCount} of {milestones.length} milestones completed
          </span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">{milestones.filter(m => m.status === 'completed').length}</p>
            <p className="text-sm text-green-700">Completed</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-600">{milestones.filter(m => m.status === 'in_progress').length}</p>
            <p className="text-sm text-blue-700">In Progress</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-yellow-600">{milestones.filter(m => m.status === 'pending').length}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-red-600">{milestones.filter(m => m.status === 'overdue').length}</p>
            <p className="text-sm text-red-700">Overdue</p>
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Research Milestones</h3>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {milestones.map((milestone, index) => {
              const StatusIcon = getStatusIcon(milestone.status);
              const isLast = index === milestones.length - 1;
              const isEditing = editingMilestone === milestone.id;

              return (
                <div key={milestone.id} className="relative">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}

                  <div className="flex items-start space-x-4">
                    {/* Status Icon */}
                    <div className={`p-2 rounded-full ${getStatusColor(milestone.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                            
                            {/* Final Submission Notice */}
                            {milestone.title === 'Final Submission' && milestone.status !== 'completed' && userRole === 'student' && (
                              <div className="mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                                <p className="text-xs font-semibold text-blue-900 mb-1">📄 Format & Similarity Check Required</p>
                                <p className="text-xs text-blue-800">
                                  Use the official analyzer to verify format and check similarity percentage before submission.
                                </p>
                                <a 
                                  href="https://pg-dissertation-research-paper-analyzer.onrender.com" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800 underline font-medium mt-1 inline-block"
                                >
                                  Open Analyzer Tool →
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due: {formatDate(milestone.due_date)}
                            </div>
                            {milestone.completion_date && (
                              <div className="text-sm text-green-600">
                                Completed: {formatDate(milestone.completion_date)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Documents */}
                        {milestone.documents.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Documents</h5>
                            <div className="space-y-2">
                              {milestone.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{doc.name}</p>
                                      <p className="text-sm text-gray-600">
                                        {formatFileSize(doc.size)} • Uploaded {formatDate(doc.uploaded_at)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleDownloadDocument(doc)}
                                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                      title="Download"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                    {userRole === 'student' && milestone.status !== 'completed' && (
                                      <button
                                        onClick={() => handleDeleteDocument(milestone.id, doc.id, doc.name)}
                                        className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Feedback and Grade Section */}
                        {isEditing ? (
                          <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="text-sm font-medium text-blue-900 mb-3">Edit Feedback & Grade</h5>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-blue-900 mb-1">Feedback</label>
                                <textarea
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  className="w-full p-2 border border-blue-300 rounded-md text-sm"
                                  rows={3}
                                  placeholder="Enter your feedback..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-blue-900 mb-1">Grade (0-100)</label>
                                <input
                                  type="number"
                                  value={gradeValue}
                                  onChange={(e) => setGradeValue(e.target.value)}
                                  className="w-full p-2 border border-blue-300 rounded-md text-sm"
                                  min="0"
                                  max="100"
                                  placeholder="Enter grade..."
                                />
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSaveFeedback(milestone.id)}
                                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          milestone.feedback && (
                            <div className="mb-3">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start">
                                  <MessageSquare className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-blue-900">Guide Feedback</p>
                                    <p className="text-sm text-blue-800 mt-1">{milestone.feedback}</p>
                                    {milestone.grade && (
                                      <div className="flex items-center mt-2">
                                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                        <p className="text-sm font-medium text-blue-900">
                                          Grade: {milestone.grade}/100
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </span>

                          <div className="flex space-x-2">
                            {userRole === 'student' && milestone.status !== 'completed' && (
                              <button
                                onClick={() => handleFileUpload(milestone.id, milestone.title)}
                                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                {milestone.title === 'Final Submission' ? 'Submit Final Dissertation' : (milestone.documents.length > 0 ? 'Upload More' : 'Upload')}
                              </button>
                            )}

                            {userRole === 'guide' && milestone.status === 'in_progress' && milestone.documents.length > 0 && (
                              <>
                                <button
                                  onClick={() => handleEditFeedback(milestone.id, milestone.feedback || '', milestone.grade || 0)}
                                  className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                                >
                                  <Edit2 className="h-4 w-4 mr-1" />
                                  {milestone.feedback ? 'Edit' : 'Add'} Feedback
                                </button>
                                <button
                                  onClick={() => handleApproveMilestone(milestone.id)}
                                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final Submission Modal */}
      {showFinalSubmissionModal && finalSubmissionMilestoneId && (
        <FinalSubmissionModal
          onClose={() => {
            setShowFinalSubmissionModal(false);
            setFinalSubmissionMilestoneId(null);
          }}
          onSubmit={handleFinalSubmission}
        />
      )}
    </div>
  );
};
