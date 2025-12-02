import React from 'react';
import { TrendingUp, TrendingDown, FileText, Users, CheckSquare, BookOpen } from 'lucide-react';
import { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
  userRole: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, userRole }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
      case 'coordinator':
        return [
          {
            title: 'Total Topics',
            value: stats.total_topics,
            change: '+12%',
            changeType: 'increase' as const,
            icon: FileText,
            color: 'blue',
          },
          {
            title: 'Active Topics',
            value: stats.active_topics,
            change: '+8%',
            changeType: 'increase' as const,
            icon: Users,
            color: 'green',
          },
          {
            title: 'Pending Approvals',
            value: stats.pending_approvals,
            change: '-5%',
            changeType: 'decrease' as const,
            icon: CheckSquare,
            color: 'orange',
          },
          {
            title: 'Publications',
            value: stats.publications,
            change: '+15%',
            changeType: 'increase' as const,
            icon: BookOpen,
            color: 'purple',
          },
        ];
      
      case 'guide':
        return [
          {
            title: 'My Students',
            value: stats.active_topics,
            change: '+2',
            changeType: 'increase' as const,
            icon: Users,
            color: 'blue',
          },
          {
            title: 'Completed Topics',
            value: stats.completed_topics,
            change: '+1',
            changeType: 'increase' as const,
            icon: FileText,
            color: 'green',
          },
          {
            title: 'Overdue Reviews',
            value: stats.overdue_milestones,
            change: '-1',
            changeType: 'decrease' as const,
            icon: CheckSquare,
            color: 'orange',
          },
          {
            title: 'Publications',
            value: stats.publications,
            change: '+3',
            changeType: 'increase' as const,
            icon: BookOpen,
            color: 'purple',
          },
        ];
      
      case 'student':
        return [
          {
            title: 'Topic Status',
            value: 'In Progress',
            change: '70% Complete',
            changeType: 'neutral' as const,
            icon: FileText,
            color: 'blue',
          },
          {
            title: 'Milestones',
            value: '4/6',
            change: '2 Remaining',
            changeType: 'neutral' as const,
            icon: CheckSquare,
            color: 'green',
          },
          {
            title: 'Publications',
            value: stats.publications,
            change: 'In Review',
            changeType: 'neutral' as const,
            icon: BookOpen,
            color: 'purple',
          },
          {
            title: 'Next Deadline',
            value: '15 Days',
            change: 'Milestone 5',
            changeType: 'neutral' as const,
            icon: TrendingUp,
            color: 'orange',
          },
        ];
      
      default:
        return [
          {
            title: 'Pending Reviews',
            value: stats.pending_approvals,
            change: 'This week',
            changeType: 'neutral' as const,
            icon: CheckSquare,
            color: 'orange',
          },
          {
            title: 'Topics Reviewed',
            value: stats.completed_topics,
            change: '+3 this month',
            changeType: 'increase' as const,
            icon: FileText,
            color: 'green',
          },
        ];
    }
  };

  const statsCards = getStatsForRole();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      red: 'bg-red-50 text-red-600 border-red-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg border ${getColorClasses(stat.color)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center text-sm">
                {stat.changeType === 'increase' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                {stat.changeType === 'decrease' && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                <span className={
                  stat.changeType === 'increase' ? 'text-green-600' :
                  stat.changeType === 'decrease' ? 'text-red-600' :
                  'text-gray-500'
                }>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};