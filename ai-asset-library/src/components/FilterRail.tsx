import React, { useState } from 'react';
import type { Filters } from '../types';
import { mockAssets } from '../data/mockData';
import { getUniqueValues } from '../utils/assetUtils';

interface FilterRailProps {
  activeFilters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const FilterRail: React.FC<FilterRailProps> = ({ activeFilters, onFiltersChange }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const allTypes = getUniqueValues(mockAssets, 'type');
  const allCaseCodes = getUniqueValues(mockAssets, 'caseCode');
  const allClients = getUniqueValues(mockAssets, 'client');
  const allDomains = getUniqueValues(mockAssets, 'domain');
  const allIndustries = getUniqueValues(mockAssets, 'industry');
  const allTechStacks = getUniqueValues(mockAssets, 'techStack');
  const allRegions = getUniqueValues(mockAssets, 'region');
  const allStatuses = getUniqueValues(mockAssets, 'status');
  const allSensitivities = getUniqueValues(mockAssets, 'sensitivity');
  const allOwners = getUniqueValues(mockAssets, 'owner');

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
      <FilterSection title="Case Code" category="caseCodes" options={allCaseCodes} />
      <FilterSection title="Client" category="clients" options={allClients} />
      <FilterSection title="Domain" category="domains" options={allDomains} />
      <FilterSection title="Industry" category="industries" options={allIndustries} />
      <FilterSection title="Tech Stack" category="techStacks" options={allTechStacks} />

      {/* More Filters Section */}
      <div className="border-t border-border-200 pt-4 mt-4">
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="flex items-center justify-between w-full text-sm font-semibold text-text-900 hover:text-primary-600 transition-colors focus-ring py-2 rounded"
        >
          <span>More Filters</span>
          <svg
            className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMoreFilters && (
          <div className="mt-4">
            <FilterSection title="Region" category="regions" options={allRegions} />
            <FilterSection title="Status" category="statuses" options={allStatuses} />
            <FilterSection title="Sensitivity" category="sensitivities" options={allSensitivities} />
            <FilterSection title="Owner" category="owners" options={allOwners} />
          </div>
        )}
      </div>
    </div>
  );
};
