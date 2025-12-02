import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Star, CheckCircle, Clock, Mail, User as UserIcon, Trash2 } from 'lucide-react';
import { getAssignmentsForGuide, reviewProject, deleteProject, type User } from '../../services/databaseService';

interface GuideDashboardProps {
  guideId: string;
  guideName?: string;
}

interface AssignedStudent {
  project: {
    id: string;
    title: string;
    description: string;
    specialization: string;
    status: string;
    marks: number | null;
    approval_status: string;
    updated_at: string;
  };
  student: {
    id: string;
    full_name: string;
    email: string;
    department: string;
    specialization: string;
    student_id: string;
  } | null;
}

export const GuideDashboard: React.FC<GuideDashboardProps> = ({ guideId, guideName }) => {
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<AssignedStudent | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    marks: '',
    feedback: '',
    approval_status: 'pending' as 'pending' | 'approved' | 'rejected' | 'needs_revision'
  });

  useEffect(() => {
    loadAssignedStudents();
  }, [guideId]);

  const loadAssignedStudents = async () => {
    try {
      setLoading(true);
      const data = await getAssignmentsForGuide(guideId);
      setAssignedStudents(data);
    } catch (error) {
      console.error('Error loading assigned students:', error);
      alert('Failed to load assigned students');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (student: AssignedStudent) => {
    setSelectedStudent(student);
    setReviewData({
      marks: student.project.marks?.toString() || '',
      feedback: '',
      approval_status: (student.project.approval_status as any) || 'pending'
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedStudent) return;

    try {
      await reviewProject(selectedStudent.project.id, {
        marks: reviewData.marks ? parseInt(reviewData.marks) : undefined,
        feedback: reviewData.feedback || undefined,
        approval_status: reviewData.approval_status
      });
      await loadAssignedStudents();
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete the project "${projectTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProject(projectId);
      await loadAssignedStudents();
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      needs_revision: 'bg-orange-100 text-orange-800',
      in_progress: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading assigned students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Assigned Students</h3>
          <p className="text-gray-600">
            {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>
      </div>

      {/* Students List */}
      {assignedStudents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No students assigned yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignedStudents.map((item) => (
            <div key={item.project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Student Info */}
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.student?.full_name || 'Unknown Student'}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{item.student?.student_id}</span>
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {item.student?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="ml-11 space-y-2">
                    <div className="flex items-start">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{item.project.title}</p>
                        <p className="text-sm text-gray-600">{item.project.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.project.approval_status)}`}>
                        {item.project.approval_status.replace('_', ' ')}
                      </span>
                      {item.project.marks !== null && (
                        <div className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 mr-1" />
                          <span className="font-medium">{item.project.marks}/100</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated: {new Date(item.project.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleReviewClick(item)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Review
                  </button>
                  <button
                    onClick={() => handleDeleteProject(item.project.id, item.project.title)}
                    className="flex items-center px-3 py-1.5 border border-red-200 text-red-700 text-sm rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Project</h3>
                <p className="text-gray-600">{selectedStudent.project.title}</p>
                <p className="text-sm text-gray-500">Student: {selectedStudent.student?.full_name}</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
                <p className="text-sm text-gray-600">{selectedStudent.project.description}</p>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks (out of 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={reviewData.marks}
                  onChange={(e) => setReviewData(prev => ({ ...prev, marks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter marks"
                />
              </div>

              {/* Approval Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Status
                </label>
                <select
                  value={reviewData.approval_status}
                  onChange={(e) => setReviewData(prev => ({ ...prev, approval_status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="needs_revision">Needs Revision</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea
                  value={reviewData.feedback}
                  onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed feedback for the student..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
