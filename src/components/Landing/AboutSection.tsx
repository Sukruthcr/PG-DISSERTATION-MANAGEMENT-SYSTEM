import React from 'react';
import { 
  Target, 
  Lightbulb, 
  Rocket, 
  Users, 
  Award,
  BookOpen,
  Heart
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Active Students', icon: Users },
    { number: '50+', label: 'Expert Guides', icon: Award },
    { number: '1000+', label: 'Dissertations Completed', icon: BookOpen },
    { number: '95%', label: 'Success Rate', icon: Target }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Leveraging technology to simplify complex academic processes and enhance research productivity.'
    },
    {
      icon: Heart,
      title: 'Student Success',
      description: 'Committed to supporting students throughout their dissertation journey with comprehensive tools and guidance.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Fostering meaningful connections between students, guides, and academic institutions.'
    },
    {
      icon: Rocket,
      title: 'Excellence',
      description: 'Maintaining high standards of quality and academic integrity in every aspect of the platform.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-secondary-900 mb-2">{stat.number}</div>
                <div className="text-secondary-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-secondary-900 mb-6">
              Empowering Academic Excellence Through Technology
            </h2>
            <p className="text-lg text-secondary-600 mb-6">
              The PG Dissertation Management System was born from a deep understanding of the challenges faced by postgraduate students and faculty in managing complex dissertation projects. Our platform bridges the gap between traditional academic processes and modern digital efficiency.
            </p>
            <p className="text-lg text-secondary-600 mb-6">
              We believe that great research deserves great tools. Our comprehensive solution streamlines every aspect of the dissertation journey, from initial topic selection to final publication, allowing students to focus on what matters most - their research.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-primary border-2 border-white flex items-center justify-center text-white text-sm font-medium"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-medium text-secondary-900">Trusted by leading institutions</div>
                <div className="text-sm text-secondary-600">worldwide</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-100 to-indigo-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">24/7</div>
                  <div className="text-sm text-secondary-600">Platform Access</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-success-600">100%</div>
                  <div className="text-sm text-secondary-600">Data Security</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-warning-600">50%</div>
                  <div className="text-sm text-secondary-600">Time Saved</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-error-600">4.9/5</div>
                  <div className="text-sm text-secondary-600">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h3 className="text-3xl font-bold text-secondary-900 text-center mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gradient-primary p-4 rounded-xl mb-4 inline-block">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-secondary-900 mb-3">{value.title}</h4>
                  <p className="text-secondary-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
