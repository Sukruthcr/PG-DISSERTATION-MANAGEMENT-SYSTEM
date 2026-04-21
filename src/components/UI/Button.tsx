import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-medium focus:ring-primary-500',
    secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-700 focus:ring-secondary-500',
    success: 'bg-success-600 hover:bg-success-700 text-white shadow-soft hover:shadow-medium focus:ring-success-500',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white shadow-soft hover:shadow-medium focus:ring-warning-500',
    error: 'bg-error-600 hover:bg-error-700 text-white shadow-soft hover:shadow-medium focus:ring-error-500',
    ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-700 focus:ring-secondary-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (loading) {
      return <div className="loading-spinner h-4 w-4"></div>;
    }
    if (Icon) {
      return <Icon className={iconSizeClasses[size]} />;
    }
    return null;
  };

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon() && (
        <span className="mr-2">{renderIcon()}</span>
      )}
      {children}
      {iconPosition === 'right' && renderIcon() && (
        <span className="ml-2">{renderIcon()}</span>
      )}
    </button>
  );
};
