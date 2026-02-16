import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

/**
 * Loading spinner component for indicating async operations
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-primary-600/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
      {message && (
        <p className="text-sm text-text-600">{message}</p>
      )}
    </div>
  );
};
