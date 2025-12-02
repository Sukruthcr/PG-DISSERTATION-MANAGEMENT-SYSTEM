import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Topic } from '../../types';

interface TopicFormProps {
  topic?: Topic;
  isOpen: boolean;
  onClose: () => void;
  onSave: (topicData: Partial<Topic>) => void;
  isEditing?: boolean;
}

export const TopicForm: React.FC<TopicFormProps> = ({
  topic,
  isOpen,
  onClose,
  onSave,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: topic?.title || '',
    description: topic?.description || '',
    keywords: topic?.keywords?.join(', ') || '',
    domain: topic?.domain || '',
    methodology: topic?.methodology || '',
    objectives: topic?.objectives || '',
    expected_outcomes: topic?.expected_outcomes || '',
    ethics_approval_required: topic?.ethics_approval_required || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.keywords.trim()) newErrors.keywords = 'Keywords are required';
    if (!formData.domain.trim()) newErrors.domain = 'Domain is required';
    if (!formData.methodology.trim()) newErrors.methodology = 'Methodology is required';
    if (!formData.objectives.trim()) newErrors.objectives = 'Objectives are required';
    if (!formData.expected_outcomes.trim()) newErrors.expected_outcomes = 'Expected outcomes are required';

    if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    }

    if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    const keywordArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
    if (keywordArray.length < 3) {
      newErrors.keywords = 'At least 3 keywords are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const topicData: Partial<Topic> = {
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      updated_at: new Date().toISOString(),
    };

    // The useTopics hook will handle setting the proper fields for new topics

    onSave(topicData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Topic' : 'Submit New Topic'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter a descriptive title for your research topic"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Provide a detailed description of your research topic, including background and scope"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords * (comma-separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.keywords ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Machine Learning, Healthcare, Deep Learning, Medical Imaging"
            />
            {errors.keywords && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.keywords}
              </p>
            )}
          </div>

          {/* Domain and Methodology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain *
              </label>
              <select
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.domain ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Domain</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Psychology">Psychology</option>
                <option value="Economics">Economics</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Other">Other</option>
              </select>
              {errors.domain && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.domain}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Research Methodology *
              </label>
              <select
                value={formData.methodology}
                onChange={(e) => handleInputChange('methodology', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.methodology ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Methodology</option>
                <option value="Experimental Research">Experimental Research</option>
                <option value="Theoretical Research">Theoretical Research</option>
                <option value="Applied Research">Applied Research</option>
                <option value="Quantitative Research">Quantitative Research</option>
                <option value="Qualitative Research">Qualitative Research</option>
                <option value="Mixed Methods Research">Mixed Methods Research</option>
                <option value="Case Study">Case Study</option>
                <option value="Survey Research">Survey Research</option>
                <option value="Design Science Research">Design Science Research</option>
              </select>
              {errors.methodology && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.methodology}
                </p>
              )}
            </div>
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Objectives *
            </label>
            <textarea
              value={formData.objectives}
              onChange={(e) => handleInputChange('objectives', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.objectives ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Clearly state the main objectives of your research"
            />
            {errors.objectives && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.objectives}
              </p>
            )}
          </div>

          {/* Expected Outcomes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Outcomes *
            </label>
            <textarea
              value={formData.expected_outcomes}
              onChange={(e) => handleInputChange('expected_outcomes', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expected_outcomes ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the expected outcomes and impact of your research"
            />
            {errors.expected_outcomes && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.expected_outcomes}
              </p>
            )}
          </div>

          {/* Ethics Approval */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.ethics_approval_required}
                onChange={(e) => handleInputChange('ethics_approval_required', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                This research requires ethics committee approval
              </span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Check this if your research involves human subjects, sensitive data, or ethical considerations
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Topic' : 'Submit Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};