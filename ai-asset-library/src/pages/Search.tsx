import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { SearchBar } from '../components/ui/SearchBar';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { FilterRail } from '../components/FilterRail';
import { AssetCard } from '../components/AssetCard';
import { PreviewPanel } from '../components/PreviewPanel';
import { SelectionBar } from '../components/SelectionBar';
import { useApp } from '../context/AppContext';
import { mockAssets } from '../data/mockData';
import { filterAssets, sortAssets, calculateRelevance } from '../utils/assetUtils';
import type { Asset } from '../types';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    clearFilters,
    selectedAssetIds,
    toggleAssetSelection,
    clearSelection,
    setIsDrawerOpen,
    clientSafeMode,
    setClientSafeMode,
    sortBy,
    setSortBy,
  } = useApp();

  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  // Initialize search from URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    return filterAssets(mockAssets, activeFilters, clientSafeMode);
  }, [activeFilters, clientSafeMode]);

  const sortedAssets = useMemo(() => {
    return sortAssets(filteredAssets, sortBy, searchQuery);
  }, [filteredAssets, sortBy, searchQuery]);

  const selectedAssets = mockAssets.filter(asset =>
    selectedAssetIds.includes(asset.id)
  );

  // Get active filter count
  const activeFilterCount = Object.values(activeFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRemoveFilter = (category: keyof typeof activeFilters, value: string) => {
    setActiveFilters({
      ...activeFilters,
      [category]: activeFilters[category].filter(v => v !== value),
    });
  };

  const handleOpenAIAdvisor = () => {
    if (selectedAssetIds.length > 0) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <MainLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Left: Filters */}
        <div className="w-64 p-4 overflow-y-auto">
          <FilterRail
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
          />
        </div>

        {/* Center: Search and Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-white/80 backdrop-blur border-b border-border-200">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-text-600 hover:text-text-900 focus-ring"
              >
                ← Back to Home
              </button>
            </div>

            <h1 className="text-3xl font-bold text-text-900 mb-6">Asset Library</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <SearchBar
                  initialValue={searchQuery}
                  onSearch={handleSearch}
                  placeholder="Search assets by keyword, technology, use case..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedAssetIds.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                    {selectedAssetIds.length} Selected
                  </div>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleOpenAIAdvisor}
                  disabled={selectedAssetIds.length === 0}
                  title={selectedAssetIds.length === 0 ? 'Select assets first' : 'Ask AI Advisor about selected assets'}
                >
                  Ask AI Advisor
                </Button>

                <label className="flex items-center gap-2 text-sm text-text-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientSafeMode}
                    onChange={(e) => setClientSafeMode(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-border-200 text-primary-600 focus:ring-2 focus:ring-primary-600"
                  />
                  Client-safe mode
                </label>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'recent')}
                className="px-3 py-1.5 text-sm border-2 border-border-200 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="recent">Sort: Most recent</option>
              </select>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm text-text-600">Active filters:</span>
                {Object.entries(activeFilters).map(([category, values]) =>
                  values.map((value: string) => (
                    <Chip
                      key={`${category}-${value}`}
                      label={value}
                      onRemove={() => handleRemoveFilter(category as keyof typeof activeFilters, value)}
                    />
                  ))
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:underline focus-ring ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <p className="text-sm text-text-600">
                <span className="font-semibold text-text-900">
                  {sortedAssets.length}
                </span>{' '}
                of {mockAssets.length} results
              </p>
            </div>

            <div className="space-y-4 pb-24">
              {sortedAssets.map(asset => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedAssetIds.includes(asset.id)}
                  onToggleSelect={() => toggleAssetSelection(asset.id)}
                  onViewDetails={() => setPreviewAsset(asset)}
                  relevance={Math.round(calculateRelevance(asset, searchQuery))}
                />
              ))}

              {sortedAssets.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-text-900 mb-2">
                    No assets found
                  </h3>
                  <p className="text-text-600 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearFilters} variant="secondary">
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <PreviewPanel
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      </div>

      {/* Bottom: Selection Bar */}
      <SelectionBar
        selectedAssets={selectedAssets}
        onOpenAIAdvisor={handleOpenAIAdvisor}
        onClearSelection={clearSelection}
      />
    </MainLayout>
  );
};
