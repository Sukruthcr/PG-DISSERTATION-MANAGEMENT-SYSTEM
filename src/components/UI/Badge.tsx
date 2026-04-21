import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  size = 'sm',
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    success: 'bg-success-100 text-success-800 border border-success-200',
    warning: 'bg-warning-100 text-warning-800 border border-warning-200',
    error: 'bg-error-100 text-error-800 border border-error-200'
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed' | 'needs-revision';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    pending: { variant: 'warning' as const, text: 'Pending' },
    approved: { variant: 'success' as const, text: 'Approved' },
    rejected: { variant: 'error' as const, text: 'Rejected' },
    'in-progress': { variant: 'primary' as const, text: 'In Progress' },
    completed: { variant: 'success' as const, text: 'Completed' },
    'needs-revision': { variant: 'error' as const, text: 'Needs Revision' }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
};
