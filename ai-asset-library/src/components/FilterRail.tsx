import React, { useState } from 'react';
import type { Filters } from '../types';
import { mockAssets } from '../data/mockData';
import { getUniqueValues } from '../utils/assetUtils';

interface FilterRailProps {
  activeFilters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const FilterRail: React.FC<FilterRailProps> = ({ activeFilters, onFiltersChange }) => {
  const allTypes = getUniqueValues(mockAssets, 'type');
  const allIndustries = getUniqueValues(mockAssets, 'industry');
  const allRegions = getUniqueValues(mockAssets, 'region');
  const allClients = getUniqueValues(mockAssets, 'client');

  const toggleFilter = <K extends keyof Filters>(
    category: K,
    value: string
  ) => {
    const currentValues = activeFilters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...activeFilters,
      [category]: newValues,
    });
  };

  const FilterSection: React.FC<{
    title: string;
    category: keyof Filters;
    options: string[];
    maxVisible?: number;
  }> = ({ title, category, options, maxVisible = 5 }) => {
    const [expanded, setExpanded] = useState(false);
    const visibleOptions = expanded ? options : options.slice(0, maxVisible);
    const hasMore = options.length > maxVisible;
    const activeValues = activeFilters[category] as string[];

    return (
      <div className="mb-6">
        <h3 className="font-semibold text-text-900 mb-2 text-sm">{title}</h3>
        <div className="space-y-1.5">
          {visibleOptions.map(option => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer hover:bg-surface-50 p-1.5 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={activeValues.includes(option)}
                onChange={() => toggleFilter(category, option)}
                className="w-4 h-4 rounded border-2 border-border-200 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              />
              <span className="text-sm text-text-900">{option}</span>
            </label>
          ))}
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary-600 mt-2 hover:underline focus-ring"
          >
            {expanded ? 'Show less' : `Show ${options.length - maxVisible} more`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white rounded-2xl p-6 border-2 border-border-200 h-fit sticky top-4">
      <h2 className="font-bold text-text-900 mb-6 text-lg">Filters</h2>

      <FilterSection title="Type" category="types" options={allTypes} />
      <FilterSection title="Industry" category="industries" options={allIndustries} />
      <FilterSection title="Region" category="regions" options={allRegions} />
      <FilterSection title="Client" category="clients" options={allClients} />
    </div>
  );
};
