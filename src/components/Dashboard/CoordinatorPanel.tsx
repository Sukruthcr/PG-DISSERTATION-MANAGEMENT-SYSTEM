import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, Mail, User as UserIcon, Eye, CheckCircle, XCircle } from 'lucide-react';

interface CoordinatorPanelProps {
  coordinatorId: string;
  coordinatorName?: string;
}

interface AssignedStudent {
  project: {
    id: string;
    title: string;
    status: string;
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

export const CoordinatorPanel: React.FC<CoordinatorPanelProps> = ({ coordinatorId, coordinatorName }) => {
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignedStudents();
  }, [coordinatorId]);

  const loadAssignedStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coordinators/${coordinatorId}/students`);
      const data = await response.json();
      if (data.success) {
        setAssignedStudents(data.students);
      }
    } catch (error) {
      console.error('Error loading assigned students:', error);
      alert('Failed to load assigned students');
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Eye className="h-5 w-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading assigned students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-purple-600 p-2 rounded-lg mr-3">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Student Progress Monitoring</h3>
          <p className="text-gray-600">
            Tracking {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-purple-800">
          <strong>Coordinator Role:</strong> You can monitor student progress and project status. 
          Grading and project deletion are handled by assigned guides.
        </p>
      </div>

      {/* Students List */}
      {assignedStudents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No students assigned for monitoring</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignedStudents.map((item) => (
            <div key={item.project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Student Info */}
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <UserIcon className="h-5 w-5 text-purple-600" />
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
                      <div className="text-xs text-gray-500 mt-1">
                        {item.student?.department} • {item.student?.specialization}
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="ml-11 space-y-2">
                    <div className="flex items-start">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{item.project.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.project.approval_status)}`}>
                        {item.project.approval_status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated: {new Date(item.project.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Icon */}
                <div className="ml-4 flex items-center justify-center">
                  {getStatusIcon(item.project.approval_status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Progress Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-blue-900">
              {assignedStudents.filter(s => s.project.approval_status === 'pending' || s.project.approval_status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600 font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-900">
              {assignedStudents.filter(s => s.project.approval_status === 'approved').length}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-orange-600 font-medium">Needs Revision</p>
            <p className="text-2xl font-bold text-orange-900">
              {assignedStudents.filter(s => s.project.approval_status === 'needs_revision').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-red-600 font-medium">Rejected</p>
            <p className="text-2xl font-bold text-red-900">
              {assignedStudents.filter(s => s.project.approval_status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
