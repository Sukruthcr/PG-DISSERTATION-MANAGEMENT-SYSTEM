import React, { useState } from 'react';
import { Plus, BookOpen, ExternalLink, Calendar, Users, Award } from 'lucide-react';
import { Publication } from '../../types';

interface PublicationManagerProps {
  topicId: string;
  userRole: string;
  onSavePublication: (data: any) => void;
}

export const PublicationManager: React.FC<PublicationManagerProps> = ({ 
  topicId, 
  userRole, 
  onSavePublication 
}) => {
  const [publications] = useState<Publication[]>([
    {
      id: '1',
      topic_id: topicId,
      title: 'Machine Learning Approaches for Early Disease Detection in Medical Imaging',
      authors: ['John Doe', 'Dr. Jane Smith', 'Dr. Robert Johnson'],
      journal_name: 'Journal of Medical AI',
      publication_type: 'journal',
      doi: '10.1234/jmai.2024.001',
      url: 'https://example.com/publication/1',
      publication_date: '2024-03-15T00:00:00Z',
      status: 'published',
      impact_factor: 4.2,
      citation_count: 12,
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      topic_id: topicId,
      title: 'Deep Learning Framework for Healthcare Diagnostics: A Comprehensive Study',
      authors: ['John Doe', 'Dr. Jane Smith'],
      conference_name: 'International Conference on AI in Healthcare',
      publication_type: 'conference',
      status: 'accepted',
      publication_date: '2024-07-20T00:00:00Z',
      created_at: '2024-02-10T10:00:00Z',
    },
    {
      id: '3',
      topic_id: topicId,
      title: 'Novel Algorithms for Medical Image Processing',
      authors: ['John Doe', 'Dr. Jane Smith', 'Dr. Alice Brown'],
      journal_name: 'Nature Machine Intelligence',
      publication_type: 'journal',
      status: 'under_review',
      impact_factor: 8.1,
      created_at: '2024-04-05T10:00:00Z',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddPublication = () => {
    setShowAddForm(true);
  };

  const handleSavePublication = (publicationData: any) => {
    onSavePublication(publicationData);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
          <p className="text-gray-600 mt-1">Manage research publications and track citations</p>
        </div>
        {userRole === 'student' && (
          <button
            onClick={handleAddPublication}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </button>
        )}
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {publications.map((publication) => (
          <div key={publication.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{publication.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {publication.authors.join(', ')}
                  </div>
                  {publication.publication_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(publication.publication_date)}
                    </div>
                  )}
                </div>
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(publication.status)}`}>
                {publication.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            {/* Publication Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Venue</label>
                <p className="text-sm text-gray-900 mt-1">
                  {publication.journal_name || publication.conference_name || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                <p className="text-sm text-gray-900 mt-1 capitalize">
                  {publication.publication_type.replace('_', ' ')}
                </p>
              </div>
              {publication.impact_factor && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Impact Factor</label>
                  <div className="flex items-center mt-1">
                    <Award className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{publication.impact_factor}</span>
                  </div>
                </div>
              )}
              {publication.citation_count !== undefined && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Citations</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{publication.citation_count}</p>
                </div>
              )}
            </div>

            {/* DOI and URL */}
            <div className="flex items-center space-x-4">
              {publication.doi && (
                <div className="flex items-center text-sm text-blue-600">
                  <span className="font-medium mr-2">DOI:</span>
                  <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {publication.doi}
                  </a>
                </div>
              )}
              {publication.url && (
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Publication
                </a>
              )}
            </div>
          </div>
        ))}

        {publications.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Publications Yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first research publication</p>
            {userRole === 'student' && (
              <button
                onClick={handleAddPublication}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Publication Form Modal */}
      {showAddForm && (
        <PublicationForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSave={handleSavePublication}
          topicId={topicId}
        />
      )}
    </div>
  );
};

interface PublicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  topicId: string;
}

const PublicationForm: React.FC<PublicationFormProps> = ({ isOpen, onClose, onSave, topicId }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    publication_type: 'journal',
    journal_name: '',
    conference_name: '',
    doi: '',
    url: '',
    publication_date: '',
    status: 'draft',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.authors.trim()) {
      alert('Please fill in all required fields (Title and Authors)');
      return;
    }
    
    const publicationData = {
      ...formData,
      topic_id: topicId,
      authors: formData.authors.split(',').map(a => a.trim()),
      created_at: new Date().toISOString(),
    };
    onSave(publicationData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Publication</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Authors (comma-separated) *</label>
            <input
              type="text"
              value={formData.authors}
              onChange={(e) => setFormData(prev => ({ ...prev, authors: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe, Dr. Jane Smith"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.publication_type}
                onChange={(e) => setFormData(prev => ({ ...prev, publication_type: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="journal">Journal</option>
                <option value="conference">Conference</option>
                <option value="book_chapter">Book Chapter</option>
                <option value="patent">Patent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {formData.publication_type === 'journal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Journal Name</label>
              <input
                type="text"
                value={formData.journal_name}
                onChange={(e) => setFormData(prev => ({ ...prev, journal_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {formData.publication_type === 'conference' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conference Name</label>
              <input
                type="text"
                value={formData.conference_name}
                onChange={(e) => setFormData(prev => ({ ...prev, conference_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DOI</label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="10.1234/example.2024.001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
              <input
                type="date"
                value={formData.publication_date.split('T')[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, publication_date: e.target.value + 'T00:00:00Z' }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/publication"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Publication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};