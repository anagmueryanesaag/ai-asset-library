import React from 'react';
import type { Sensitivity, Status } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | Sensitivity | Status;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm' }) => {
  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    'Client-safe': 'bg-green-100 text-green-800',
    'Internal': 'bg-yellow-100 text-yellow-800',
    'Restricted': 'bg-red-100 text-red-800',
    'Active': 'bg-green-100 text-green-800',
    'Draft': 'bg-gray-100 text-gray-800',
    'Deprecated': 'bg-red-100 text-red-800',
    'Under Review': 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
};
