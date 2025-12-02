import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, Clock, User, Download, Eye } from 'lucide-react';
import { getAllUsers, getProjectsForGuide, reviewProject, deleteProject, type User as DbUser, type StudentProject } from '../../services/databaseService';

type Project = StudentProject;

type Student = DbUser;

interface ProjectReviewProps {
  guideId: string;
}

export const ProjectReview: React.FC<ProjectReviewProps> = ({ guideId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    marks: '',
    feedback: '',
    approval_status: 'pending' as 'pending' | 'approved' | 'rejected' | 'needs_revision'
  });

  useEffect(() => {
    loadData();
  }, [guideId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, usersData] = await Promise.all([
        getProjectsForGuide(guideId),
        getAllUsers()
      ]);

      setProjects(projectsData);
      setStudents(usersData.filter(user => user.role === 'student'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentInfo = (studentId: string) => {
    // Try to find by id first, then by student_id field
    return students.find(student => 
      student.id === studentId || student.student_id === studentId
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      needs_revision: 'bg-orange-100 text-orange-800',
      submitted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleReviewProject = (project: Project) => {
    setSelectedProject(project);
    setReviewData({
      marks: project.marks?.toString() || '',
      feedback: project.feedback || '',
      approval_status: project.approval_status || 'pending'
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedProject) return;

    try {
      await reviewProject(selectedProject.id, {
        marks: reviewData.marks ? parseInt(reviewData.marks) : undefined,
        feedback: reviewData.feedback || undefined,
        approval_status: reviewData.approval_status
      });
      await loadData();
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      await deleteProject(projectId);
      await loadData();
      alert('Project deleted.');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Review</h2>
          <p className="text-gray-600 mt-1">Review and provide feedback on student projects</p>
        </div>
        <div className="text-sm text-gray-500">
          {projects.length} project{projects.length !== 1 ? 's' : ''} assigned
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => {
                const student = getStudentInfo(project.student_id);
                return (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student?.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{student?.student_id || project.student_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status || 'in_progress')}`}>
                        {(project.status || 'in_progress').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.submitted_at ? new Date(project.submitted_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.marks ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {project.marks}/100
                        </div>
                      ) : (
                        <span className="text-gray-400">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReviewProject(project)}
                          className="inline-flex items-center px-3 py-1 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                          title="Review Project"
                        >
                          <Eye className="h-4 w-4 mr-1" /> Review
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                          title="Download Files"
                        >
                          <Download className="h-4 w-4 mr-1" /> Files
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="inline-flex items-center px-3 py-1 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                          title="Delete Project"
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-sm text-gray-500" colSpan={7}>
                    No projects assigned for review
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Project</h3>
                <p className="text-gray-600">{selectedProject.title}</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
                <p className="text-sm text-gray-600">{selectedProject.description}</p>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Submitted: {selectedProject.submitted_at ? new Date(selectedProject.submitted_at).toLocaleDateString() : 'Not submitted'}
                </div>
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










