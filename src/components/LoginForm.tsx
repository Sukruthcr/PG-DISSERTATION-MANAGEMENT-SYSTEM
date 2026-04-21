import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PendingRegistration } from './PendingRegistration';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const { login, loading } = useAuth();

  // Check URL hash for signup on component mount
  useEffect(() => {
    // Clear hash to show login form by default
    window.location.hash = '';
    setShowRegistration(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any autofill-related bubbling
    setError('');

    // Clear any autofill interference by resetting state and forcing focus/blur
    const trimmedEmail = email.trim().toLowerCase();
    setEmail(trimmedEmail);
    setPassword(password);

    // Force re-render and clear potential autofill
    setTimeout(() => {
      const emailInput = document.getElementById('login-email') as HTMLInputElement;
      const passwordInput = document.getElementById('login-pass') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = trimmedEmail;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (passwordInput) {
        passwordInput.value = password;
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.focus();
      }
    }, 0);

    try {
      await login(trimmedEmail, password);
    } catch (err) {
      console.error('Login error:', err); // Log for debugging
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);

      // Check if error indicates user needs to register
      if (errorMessage.includes('User not found') || errorMessage.includes('register')) {
        // Don't show error, just show registration form
        setShowRegistration(true);
      }
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setError('Registration request submitted successfully! Please wait for admin approval.');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left animate-slide-up">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="bg-gradient-primary p-3 rounded-xl shadow-medium transform hover:scale-105 transition-all duration-300">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gradient">PG Dissertation</h1>
              <p className="text-sm text-secondary-600">Management System</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Streamline Your Research Journey
          </h2>
          <p className="text-lg text-secondary-600 mb-8">
            Comprehensive platform for managing postgraduate dissertations, from topic selection to publication.
          </p>

          <div className="card animate-scale-in">
            <h3 className="font-semibold text-secondary-900 mb-4">System Features</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-secondary-600">
                <div className="w-2 h-2 bg-success-500 rounded-full mr-3 animate-pulse-slow"></div>
                <span>Secure authentication system</span>
              </div>
              <div className="flex items-center text-secondary-600">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse-slow"></div>
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center text-secondary-600">
                <div className="w-2 h-2 bg-warning-500 rounded-full mr-3 animate-pulse-slow"></div>
                <span>New user registration with admin approval</span>
              </div>
            </div>
            <p className="text-xs text-secondary-500 mt-3">Don't have an account? Register below</p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl shadow-strong p-8 border border-secondary-100 animate-slide-up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gradient mb-2">Welcome Back</h2>
            <p className="text-secondary-600">Sign in to your account to continue</p>
          </div>

          {error && !showRegistration && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg animate-slide-down">
              <p className="text-error-600 text-sm">{error}</p>
            </div>
          )}

          {!showRegistration ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="login-email"
                    name="login-email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-pass" className="block text-sm font-medium text-secondary-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-pass"
                      name="login-pass"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pr-12 font-mono"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="loading-spinner h-5 w-5"></div>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-secondary-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Register here
                  </button>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-secondary-600">
                  Need help? Contact{' '}
                  <a href="mailto:support@university.edu" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                    IT Support
                  </a>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg animate-slide-down">
                <p className="text-primary-800 text-sm">
                  Account not found. Please complete your registration below.
                </p>
              </div>
              <button
                onClick={() => setShowRegistration(false)}
                className="text-secondary-600 hover:text-secondary-800 text-sm underline transition-colors"
              >
                &larr; Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      <PendingRegistration
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onRegistrationSubmitted={handleRegistrationSuccess}
      />
    </div>
  );
};
