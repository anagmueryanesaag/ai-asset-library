import React, { useState, type FormEvent } from 'react';
import { Button } from './Button';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch: (query: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search assets...',
  initialValue = '',
  onSearch,
  size = 'md',
}) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const sizeClasses = {
    sm: 'text-sm py-2',
    md: 'text-base py-3',
    lg: 'text-lg py-4',
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 px-4 ${sizeClasses[size]} rounded-xl border-2 border-border-200 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all`}
      />
      <Button type="submit" size={size === 'lg' ? 'lg' : 'md'}>
        Search
      </Button>
    </form>
  );
};
