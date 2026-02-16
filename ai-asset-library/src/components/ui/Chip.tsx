import React from 'react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'primary';
}

export const Chip: React.FC<ChipProps> = ({ label, onRemove, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-surface-50 text-text-900 border border-border-200',
    primary: 'bg-primary-500 text-white',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs ${variantClasses[variant]}`}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors focus-ring"
          aria-label={`Remove ${label} filter`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};
