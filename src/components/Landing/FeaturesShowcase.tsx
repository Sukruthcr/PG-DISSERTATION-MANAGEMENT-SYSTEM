import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  MessageSquare,
  ArrowRight,
  Play
} from 'lucide-react';

interface Feature {
  icon: any;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const features: Feature[] = [
  {
    icon: FileText,
    title: 'Topic Management',
    description: 'Submit, review, and get approval for dissertation topics with ease.',
    benefits: [
      'Smart topic suggestions',
      'Peer review system',
      'Real-time status tracking',
      'Feedback collection'
    ],
    color: 'primary'
  },
  {
    icon: Users,
    title: 'Guide Allocation',
    description: 'Get matched with the perfect supervisor based on your research interests.',
    benefits: [
      'AI-powered matching',
      'Expertise alignment',
      'Workload balancing',
      'Preference consideration'
    ],
    color: 'success'
  },
  {
    icon: Calendar,
    title: 'Progress Tracking',
    description: 'Monitor your dissertation journey with comprehensive milestone tracking.',
    benefits: [
      'Visual progress charts',
      'Deadline reminders',
      'Milestone notifications',
      'Progress analytics'
    ],
    color: 'warning'
  },
  {
    icon: CheckSquare,
    title: 'Review Workflow',
    description: 'Streamlined review process with multiple approval stages.',
    benefits: [
      'Multi-stage approvals',
      'Version control',
      'Comment threading',
      'Revision tracking'
    ],
    color: 'error'
  },
  {
    icon: BookOpen,
    title: 'Publication Hub',
    description: 'Manage final submissions and academic journal publications.',
    benefits: [
      'Format validation',
      'Plagiarism checking',
      'Journal submission',
      'DOI management'
    ],
    color: 'purple'
  },
  {
    icon: MessageSquare,
    title: 'Communication Center',
    description: 'Stay connected with your team through integrated messaging.',
    benefits: [
      'Real-time chat',
      'File sharing',
      'Video conferencing',
      'Discussion forums'
    ],
    color: 'secondary'
  }
];

export const FeaturesShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const getColorClasses = (color: string) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600 border-primary-200',
      success: 'bg-success-100 text-success-600 border-success-200',
      warning: 'bg-warning-100 text-warning-600 border-warning-200',
      error: 'bg-error-100 text-error-600 border-error-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      secondary: 'bg-secondary-100 text-secondary-600 border-secondary-200'
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const getGradientClasses = (color: string) => {
    const gradients = {
      primary: 'bg-gradient-primary',
      success: 'bg-gradient-success',
      warning: 'bg-gradient-warning',
      error: 'bg-gradient-error',
      purple: 'bg-gradient-purple',
      secondary: 'bg-gradient-secondary'
    };
    return gradients[color as keyof typeof gradients] || gradients.primary;
  };

  return (
    <section className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Powerful Features for Every Need
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Discover how our comprehensive platform transforms the dissertation management experience
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`flex items-center px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                  activeFeature === index
                    ? `${getColorClasses(feature.color)} border-opacity-100`
                    : 'bg-white border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span className="font-medium">{feature.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className={`p-8 rounded-2xl ${getColorClasses(features[activeFeature].color)} border-2`}>
              <div className={`w-16 h-16 rounded-xl ${getGradientClasses(features[activeFeature].color)} flex items-center justify-center mb-6`}>
                {React.createElement(features[activeFeature].icon, { className: "h-8 w-8 text-white" })}
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                {features[activeFeature].title}
              </h3>
              <p className="text-secondary-600 mb-6">
                {features[activeFeature].description}
              </p>
              <div className="space-y-3">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
                    <span className="text-secondary-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <button className={`mt-6 ${getGradientClasses(features[activeFeature].color)} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center`}>
                Learn More
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary-100 to-indigo-100 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-secondary-900">Live Demo</h4>
                  <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors">
                    <Play className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-secondary-700">Topic Submitted</span>
                    </div>
                    <div className="text-xs text-secondary-600">Your topic "Machine Learning in Healthcare" is under review</div>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-secondary-700">Guide Assigned</span>
                    </div>
                    <div className="text-xs text-secondary-600">Dr. Sarah Johnson has been assigned as your guide</div>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-secondary-700">Milestone Due</span>
                    </div>
                    <div className="text-xs text-secondary-600">Literature Review due in 5 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
              <div key={index} className="card-hover">
                <div className={`w-12 h-12 rounded-lg ${getGradientClasses(feature.color)} flex items-center justify-center mb-4`}>
                  {React.createElement(feature.icon, { className: "h-6 w-6 text-white" })}
                </div>
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">{feature.title}</h4>
                <p className="text-secondary-600 text-sm">{feature.description}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
