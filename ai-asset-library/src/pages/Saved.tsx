import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { mockAssets } from '../data/mockData';
import { formatDate } from '../utils/assetUtils';

export const Saved: React.FC = () => {
  const navigate = useNavigate();
  const { savedAssetIds, removeSavedAsset } = useApp();

  const savedAssets = useMemo(() => {
    return mockAssets.filter(asset => savedAssetIds.includes(asset.id));
  }, [savedAssetIds]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-900 mb-2">Saved Assets</h1>
          <p className="text-text-600">
            Your saved assets are listed below.
          </p>
        </div>

        {savedAssets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border-200">
            <h2 className="text-xl font-semibold text-text-900 mb-2">No saved assets yet</h2>
            <p className="text-text-600 mb-6">
              Save assets from the Library to see them here.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="text-primary-600 hover:underline focus-ring"
            >
              Browse Assets →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedAssets.map(asset => (
              <div
                key={asset.id}
                className="bg-white rounded-2xl p-5 border-2 border-border-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-text-900 mb-2">
                      {asset.type} - {asset.client}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-text-600">
                      <span>{asset.client}</span>
                      <span>{asset.industry}</span>
                      <span>{asset.region}</span>
                      <span>{formatDate(asset.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <a
                      href={asset.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary-600 hover:underline focus-ring"
                    >
                      Open file
                    </a>
                    <button
                      onClick={() => removeSavedAsset(asset.id)}
                      className="text-xs text-text-600 hover:text-red-600 focus-ring"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
