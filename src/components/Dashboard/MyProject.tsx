import React, { useState, useEffect } from 'react';
import { FileText, Star, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getStudentProjects } from '../../services/databaseService';

interface MyProjectProps {
  studentId?: string;
}

interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  specialization: string;
  status: string;
  approval_status: string;
  marks: number | null;
  feedback: string;
  guide_id: string | null;
  submitted_at: string;
  updated_at: string;
}

export const MyProject: React.FC<MyProjectProps> = ({ studentId }) => {
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!studentId) {
          throw new Error('Missing studentId');
        }

        const projects = await getStudentProjects();
        const studentProject = projects.find((p: any) => p.student_id === studentId);
        
        if (studentProject) {
          setProject(studentProject);
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project information');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [studentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'needs_revision':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'needs_revision':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading project information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">My Project</h3>
            <p className="text-gray-600">Your dissertation project details</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No project submitted yet</p>
          <p className="text-xs text-gray-400 mt-1">Submit your project to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">My Project</h3>
            <p className="text-gray-600">Your dissertation project details</p>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(project.approval_status)}`}>
          {getStatusIcon(project.approval_status)}
          <span className="ml-2 text-sm font-medium capitalize">
            {project.approval_status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Project Details */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
          <p className="text-gray-600 text-sm">{project.description}</p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
              {project.specialization}
            </span>
          </div>
        </div>

        {/* Marks Section */}
        {project.marks !== null && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-medium text-gray-900">Marks Assigned</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{project.marks}</div>
                <div className="text-xs text-gray-500">out of 100</div>
              </div>
            </div>
            
            {/* Grade Badge */}
            <div className="mt-3">
              {project.marks >= 90 && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Excellent (A+)
                </span>
              )}
              {project.marks >= 80 && project.marks < 90 && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Very Good (A)
                </span>
              )}
              {project.marks >= 70 && project.marks < 80 && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  Good (B)
                </span>
              )}
              {project.marks >= 60 && project.marks < 70 && (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                  Satisfactory (C)
                </span>
              )}
              {project.marks < 60 && (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  Needs Improvement
                </span>
              )}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {project.feedback && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start">
              <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-2">Guide's Feedback</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{project.feedback}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Marks/Feedback Yet */}
        {project.marks === null && !project.feedback && project.guide_id && (
          <div className="border-t border-gray-200 pt-4">
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Awaiting review from your guide</p>
              <p className="text-xs text-gray-500 mt-1">Your guide will provide marks and feedback soon</p>
            </div>
          </div>
        )}

        {/* No Guide Assigned */}
        {!project.guide_id && (
          <div className="border-t border-gray-200 pt-4">
            <div className="text-center py-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-yellow-700 text-sm font-medium">No guide assigned yet</p>
              <p className="text-xs text-yellow-600 mt-1">Contact your coordinator for guide assignment</p>
            </div>
          </div>
        )}

        {/* Project Timeline */}
        <div className="border-t border-gray-200 pt-4">
          <h5 className="font-medium text-gray-900 mb-3">Project Timeline</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="text-gray-900">{new Date(project.submitted_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900">{new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
