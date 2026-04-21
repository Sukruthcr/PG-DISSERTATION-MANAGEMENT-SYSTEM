import React from 'react';
import { 
  GraduationCap, 
  Users, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Award,
  Shield,
  Clock,
  TrendingUp,
  UserCheck,
  FolderOpen,
  ArrowRight,
  Play,
  Star
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="bg-gradient-primary p-4 rounded-2xl shadow-strong animate-pulse-slow">
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gradient mb-6 animate-fade-in">
                PG Dissertation Management System
              </h1>
              <p className="text-xl text-secondary-600 mb-8 max-w-2xl animate-slide-up">
                Transform your dissertation journey with our comprehensive platform. From topic selection to final publication, we've got you covered every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up mb-8">
                <button 
                  onClick={() => window.location.hash = '#login'}
                  className="btn-primary text-lg px-8 py-4 group"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => window.location.hash = '#login'}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Learn More
                </button>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 mb-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/student${i}/40/40.jpg`}
                      alt={`Student ${i}`}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 text-warning-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-secondary-600">Join 500+ successful students</p>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-strong">
                <img
                  src="https://picsum.photos/seed/dissertation-management-dashboard/600/400.jpg"
                  alt="Dissertation Management Dashboard Interface"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-medium p-4 animate-float">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Topic Approved</span>
                </div>
                <p className="text-xs text-secondary-600">Your research topic has been approved!</p>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-medium p-4 animate-float-delayed">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Guide Assigned</span>
                </div>
                <p className="text-xs text-secondary-600">Dr. Sarah Johnson is now your guide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What It Does Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              What Our Platform Does
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              A complete ecosystem for managing every aspect of your postgraduate dissertation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-hover group">
              <div className="relative mb-6">
                <img
                  src="https://picsum.photos/seed/dissertation-topic-submission/400/250.jpg"
                  alt="Dissertation Topic Submission Form"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 bg-primary-600 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">Topic Management</h3>
              <p className="text-secondary-600 mb-4">
                Submit, review, and get approval for dissertation topics with our streamlined workflow system.
              </p>
              <ul className="text-sm text-secondary-600 space-y-2">
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Smart topic suggestions</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Real-time status tracking</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Peer review system</li>
              </ul>
            </div>

            <div className="card-hover group">
              <div className="relative mb-6">
                <img
                  src="https://picsum.photos/seed/dissertation-supervisor-matching/400/250.jpg"
                  alt="Dissertation Supervisor Matching System"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 bg-success-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-success-600 transition-colors">Smart Guide Allocation</h3>
              <p className="text-secondary-600 mb-4">
                AI-powered matching system that connects you with the perfect supervisor for your research.
              </p>
              <ul className="text-sm text-secondary-600 space-y-2">
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Expertise alignment</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Workload balancing</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Preference matching</li>
              </ul>
            </div>

            <div className="card-hover group">
              <div className="relative mb-6">
                <img
                  src="https://picsum.photos/seed/dissertation-milestone-tracker/400/250.jpg"
                  alt="Dissertation Milestone Tracking Dashboard"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 bg-warning-600 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-warning-600 transition-colors">Progress Tracking</h3>
              <p className="text-secondary-600 mb-4">
                Monitor your dissertation journey with comprehensive milestone tracking and deadline management.
              </p>
              <ul className="text-sm text-secondary-600 space-y-2">
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Visual progress charts</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Deadline reminders</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Milestone notifications</li>
              </ul>
            </div>

            <div className="card-hover group">
              <div className="relative mb-6">
                <img
                  src="https://picsum.photos/seed/dissertation-review-workflow/400/250.jpg"
                  alt="Dissertation Review Workflow Interface"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 bg-purple-600 p-2 rounded-lg">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-purple-600 transition-colors">Streamlined Review</h3>
              <p className="text-secondary-600 mb-4">
                Multi-stage approval process with comprehensive feedback collection and revision tracking.
              </p>
              <ul className="text-sm text-secondary-600 space-y-2">
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Version control</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Comment threading</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Revision tracking</li>
              </ul>
            </div>

            <div className="card-hover group">
              <div className="relative mb-6">
                <img
                  src="https://picsum.photos/seed/dissertation-publication-submission/400/250.jpg"
                  alt="Dissertation Publication Submission System"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 bg-error-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-error-600 transition-colors">Publication Hub</h3>
              <p className="text-secondary-600 mb-4">
                Manage final submissions and academic journal publications with our integrated system.
              </p>
              <ul className="text-sm text-secondary-600 space-y-2">
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Format validation</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Plagiarism checking</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> DOI management</li>
              </ul>
            </div>

            <div className="card-hover group">
              <div className="relative mb-6">
                <img
                  src="https://picsum.photos/seed/dissertation-student-portal/400/250.jpg"
                  alt="Dissertation Student Communication Portal"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 bg-secondary-600 p-2 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-secondary-600 transition-colors">Communication Center</h3>
              <p className="text-secondary-600 mb-4">
                Integrated messaging system for seamless collaboration between all stakeholders.
              </p>
              <ul className="text-sm text-secondary-600 space-y-2">
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Real-time chat</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> File sharing</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div> Video conferencing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Designed for Every Role
            </h2>
            <p className="text-xl text-secondary-600">
              Tailored experiences for students, guides, coordinators, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-start mb-4">
                <div className="bg-primary-100 p-3 rounded-lg mr-4">
                  <UserCheck className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">For Students</h3>
                  <ul className="text-secondary-600 space-y-2">
                    <li>Submit and track dissertation topics</li>
                    <li>Monitor progress through milestones</li>
                    <li>Communicate with assigned guides</li>
                    <li>Receive feedback and submit revisions</li>
                    <li>Manage final publication process</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start mb-4">
                <div className="bg-success-100 p-3 rounded-lg mr-4">
                  <Award className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">For Guides</h3>
                  <ul className="text-secondary-600 space-y-2">
                    <li>Review and approve student topics</li>
                    <li>Track assigned students' progress</li>
                    <li>Provide feedback and guidance</li>
                    <li>Manage milestone reviews</li>
                    <li>Oversee final dissertation approval</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start mb-4">
                <div className="bg-warning-100 p-3 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-warning-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">For Coordinators</h3>
                  <ul className="text-secondary-600 space-y-2">
                    <li>Oversee department-level progress</li>
                    <li>Manage guide assignments</li>
                    <li>Monitor quality standards</li>
                    <li>Generate progress reports</li>
                    <li>Ensure timeline compliance</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">For Administrators</h3>
                  <ul className="text-secondary-600 space-y-2">
                    <li>Manage user accounts and permissions</li>
                    <li>Configure system settings</li>
                    <li>Monitor overall system health</li>
                    <li>Generate institutional reports</li>
                    <li>Ensure data security and compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-secondary-600">
              Everything you need for successful dissertation management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-primary p-4 rounded-xl mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Secure Authentication</h4>
              <p className="text-secondary-600 text-sm">Role-based access control with advanced security</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-success p-4 rounded-xl mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Real-time Updates</h4>
              <p className="text-secondary-600 text-sm">Instant notifications and progress tracking</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-warning p-4 rounded-xl mb-4">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Document Management</h4>
              <p className="text-secondary-600 text-sm">Centralized file storage and version control</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-error p-4 rounded-xl mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Analytics Dashboard</h4>
              <p className="text-secondary-600 text-sm">Comprehensive insights and reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Ready to Transform Your Dissertation Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 animate-slide-up">
            Join 500+ successful students who are already accelerating their research with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button 
              onClick={() => window.location.hash = '#login'}
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong flex items-center justify-center"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Start Your Journey
            </button>
            <button 
              onClick={() => window.location.hash = '#login'}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Request Demo
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-primary-100">Platform Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-100">Expert Guides</div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full"></div>
        </div>
      </section>
    </div>
  );
};
