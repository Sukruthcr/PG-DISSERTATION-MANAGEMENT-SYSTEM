import React from 'react';
import { Calendar, User, Tag, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Topic } from '../../types';

interface TopicCardProps {
  topic: Topic;
  onView: (topic: Topic) => void;
  onEdit?: (topic: Topic) => void;
  showActions?: boolean;
}

export const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  onView, 
  onEdit, 
  showActions = true 
}) => {
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
        return XCircle;
      case 'in_progress':
      case 'submitted':
      case 'under_review':
        return Clock;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon(topic.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {topic.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(topic.submitted_at)}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Student ID: {topic.student_id}
              </div>
            </div>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(topic.status)}`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {topic.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {topic.description}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Tag className="h-4 w-4 text-gray-400" />
          {topic.keywords.slice(0, 3).map((keyword, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {keyword}
            </span>
          ))}
          {topic.keywords.length > 3 && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
              +{topic.keywords.length - 3} more
            </span>
          )}
        </div>

        {/* Domain and Progress */}
        <div className="flex justify-between items-center mb-4">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
            {topic.domain}
          </span>
          {topic.similarity_score !== undefined && (
            <span className={`text-sm ${
              topic.similarity_score > 70 ? 'text-red-600' : 
              topic.similarity_score > 50 ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {topic.similarity_score}% similarity
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3">
            <button
              onClick={() => onView(topic)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              View Details
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(topic)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};