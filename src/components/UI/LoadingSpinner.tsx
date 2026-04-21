import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}></div>
  );
};

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-secondary-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-secondary-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

interface FullPageLoadingProps {
  message?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
        <p className="text-secondary-600 font-medium">{message}</p>
      </div>
    </div>
  );
};
