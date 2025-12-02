import React, { useState } from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import { Topic } from '../../types';
import { TopicCard } from './TopicCard';

interface TopicListProps {
  topics: Topic[];
  userRole: string;
  onCreateTopic?: () => void;
  onViewTopic: (topic: Topic) => void;
  onEditTopic?: (topic: Topic) => void;
  onExport?: () => void;
}

export const TopicList: React.FC<TopicListProps> = ({
  topics,
  userRole,
  onCreateTopic,
  onViewTopic,
  onEditTopic,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || topic.status === statusFilter;
    const matchesDomain = domainFilter === 'all' || topic.domain === domainFilter;

    return matchesSearch && matchesStatus && matchesDomain;
  });

  const domains = [...new Set(topics.map(t => t.domain))];
  const statuses = [...new Set(topics.map(t => t.status))];

  const canCreateTopic = userRole === 'student' || userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userRole === 'student' ? 'My Topic' : 'Topics Management'}
          </h2>
          <p className="text-gray-600 mt-1">
            {userRole === 'student' 
              ? 'Manage your dissertation topic and track progress'
              : 'Review and manage all dissertation topics'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onExport}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          {canCreateTopic && onCreateTopic && (
            <button
              onClick={onCreateTopic}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {userRole === 'student' ? 'Submit Topic' : 'Add Topic'}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search topics, keywords, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredTopics.length} of {topics.length} topics
        </p>
        {(searchTerm || statusFilter !== 'all' || domainFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDomainFilter('all');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || domainFilter !== 'all'
              ? 'Try adjusting your search criteria'
              : 'Get started by creating your first topic'
            }
          </p>
          {canCreateTopic && onCreateTopic && (
            <button
              onClick={onCreateTopic}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Topic
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onView={onViewTopic}
              onEdit={onEditTopic}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};