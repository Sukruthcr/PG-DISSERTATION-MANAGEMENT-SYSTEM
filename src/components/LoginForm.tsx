import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, GraduationCap, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PendingRegistration } from './PendingRegistration';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const { login, loading } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-900">PG Dissertation</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Streamline Your Research Journey
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Comprehensive platform for managing postgraduate dissertations, from topic selection to publication.
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">System Access</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Secure authentication system</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>New user registration with admin approval</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Don't have an account? Register below</p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {error && !showRegistration && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!showRegistration ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="login-email"
                    name="login-email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-pass" className="block text-sm font-medium text-gray-700 mb-2">
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
                      
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 font-monospace"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Register here
                  </button>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Need help? Contact{' '}
                  <a href="mailto:support@university.edu" className="text-blue-600 hover:text-blue-700 font-medium">
                    IT Support
                  </a>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Account not found. Please complete your registration below.
                </p>
              </div>
              <button
                onClick={() => setShowRegistration(false)}
                className="text-gray-600 hover:text-gray-800 text-sm underline"
              >
                ← Back to Login
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
