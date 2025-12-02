import React from 'react';
import { X, Calendar, User, Tag, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Topic } from '../../types';

interface TopicDetailModalProps {
  topic: Topic;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  userRole: string;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  isOpen,
  onClose,
  onEdit,
  userRole,
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return CheckCircle;
      case 'rejected':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon(topic.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = userRole === 'student' && (topic.status === 'draft' || topic.status === 'rejected');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{topic.title}</h2>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(topic.status)}`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {topic.status.replace('_', ' ').toUpperCase()}
              </div>
              <span className="text-sm text-gray-600">Student ID: {topic.student_id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domain</label>
                  <p className="text-gray-900">{topic.domain}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Methodology</label>
                  <p className="text-gray-900">{topic.methodology}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ethics Approval Required</label>
                  <p className="text-gray-900">{topic.ethics_approval_required ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Submitted: {formatDate(topic.submitted_at)}</span>
                </div>
                {topic.approved_at && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Approved: {formatDate(topic.approved_at)}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Last Updated: {formatDate(topic.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{topic.description}</p>
          </div>

          {/* Objectives */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Objectives</h3>
            <p className="text-gray-700 leading-relaxed">{topic.objectives}</p>
          </div>

          {/* Expected Outcomes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Expected Outcomes</h3>
            <p className="text-gray-700 leading-relaxed">{topic.expected_outcomes}</p>
          </div>

          {/* Keywords */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {topic.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Similarity Score */}
          {topic.similarity_score !== undefined && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Similarity Analysis</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Similarity Score</span>
                  <span className={`font-bold ${
                    topic.similarity_score > 70 ? 'text-red-600' : 
                    topic.similarity_score > 50 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {topic.similarity_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      topic.similarity_score > 70 ? 'bg-red-500' : 
                      topic.similarity_score > 50 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${topic.similarity_score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {topic.similarity_score > 70 
                    ? 'High similarity detected - review required'
                    : topic.similarity_score > 50 
                    ? 'Moderate similarity - acceptable with justification'
                    : 'Low similarity - topic is unique'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Guide Information */}
          {topic.guide_id && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Guide Assignment</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Guide ID: {topic.guide_id}</span>
                </div>
                {topic.co_guide_id && (
                  <div className="flex items-center mt-2">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Co-Guide ID: {topic.co_guide_id}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {topic.rejected_reason && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rejection Reason</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{topic.rejected_reason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {canEdit && onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Topic
            </button>
          )}
        </div>
      </div>
    </div>
  );
};