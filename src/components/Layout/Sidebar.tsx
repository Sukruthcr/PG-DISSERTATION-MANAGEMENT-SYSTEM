import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  BookOpen, 
  Settings, 
  UserCheck,
  ClipboardList,
  Award
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'topics', label: 'All Topics', icon: FileText },
        { id: 'assignments', label: 'Guide Assignments', icon: UserCheck },
        { id: 'approvals', label: 'Approvals', icon: CheckSquare },
        { id: 'publications', label: 'Publications', icon: BookOpen },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ],
      coordinator: [
        { id: 'topics', label: 'Topics Management', icon: FileText },
        { id: 'assignments', label: 'Guide Assignments', icon: UserCheck },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'guides', label: 'Guides', icon: Users },
        { id: 'approvals', label: 'Approvals', icon: CheckSquare },
        { id: 'analytics', label: 'Reports', icon: TrendingUp },
      ],
      guide: [
        { id: 'my-students', label: 'My Students', icon: Users },
        { id: 'topics', label: 'Student Topics', icon: FileText },
        { id: 'project-review', label: 'Project Review', icon: CheckSquare },
        { id: 'progress', label: 'Progress Tracking', icon: ClipboardList },
        { id: 'publications', label: 'Publications', icon: BookOpen },
      ],
      student: [
        { id: 'my-topic', label: 'My Topic', icon: FileText },
        { id: 'progress', label: 'Progress', icon: ClipboardList },
        { id: 'publications', label: 'Publications', icon: BookOpen },
        { id: 'guides', label: 'My Guides', icon: Users },
      ],
      ethics_committee: [
        { id: 'ethics-review', label: 'Ethics Review', icon: CheckSquare },
        { id: 'topics', label: 'Topics for Review', icon: FileText },
      ],
      examiner: [
        { id: 'evaluations', label: 'Evaluations', icon: Award },
        { id: 'topics', label: 'Topics to Examine', icon: FileText },
      ],
    };

    return [
      ...commonItems,
      ...roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || []
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-white shadow-sm border-r border-gray-200 w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};