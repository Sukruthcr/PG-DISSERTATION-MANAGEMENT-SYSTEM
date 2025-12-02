import React from 'react';
import { Plus, FileText, Users, CheckSquare, Search } from 'lucide-react';

interface QuickActionsProps {
  userRole: string;
  onActionClick: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ userRole, onActionClick }) => {
  const getActionsForRole = () => {
    switch (userRole) {
      case 'admin':
      case 'coordinator':
        return [
          { id: 'users', label: 'Add User', icon: Plus, color: 'blue' },
          { id: 'topics', label: 'Review Topics', icon: FileText, color: 'green' },
          { id: 'assignments', label: 'Assign Guides', icon: Users, color: 'purple' },
          { id: 'analytics', label: 'View Reports', icon: Search, color: 'orange' },
        ];
      
      case 'guide':
        return [
          { id: 'progress', label: 'Review Progress', icon: CheckSquare, color: 'blue' },
          { id: 'project-review', label: 'Give Feedback', icon: FileText, color: 'green' },
          { id: 'dashboard', label: 'My Students', icon: Users, color: 'purple' },
        ];
      
      case 'student':
        return [
          { id: 'topics', label: 'Submit Topic', icon: Plus, color: 'blue' },
          { id: 'progress', label: 'Upload Progress', icon: FileText, color: 'green' },
          { id: 'dashboard', label: 'Contact Guide', icon: Users, color: 'purple' },
        ];
      
      default:
        return [
          { id: 'approvals', label: 'Review Pending', icon: CheckSquare, color: 'orange' },
          { id: 'topics', label: 'View Topics', icon: FileText, color: 'blue' },
        ];
    }
  };

  const actions = getActionsForRole();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      orange: 'bg-orange-600 hover:bg-orange-700 text-white',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${getColorClasses(action.color)}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};