import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AssetCard } from '../components/AssetCard';
import { PreviewPanel } from '../components/PreviewPanel';
import { useApp } from '../context/AppContext';
import { mockCases, mockAssets } from '../data/mockData';
import type { Asset } from '../types';
import { canExportAssets, calculateRelevance } from '../utils/assetUtils';

export const CaseView: React.FC = () => {
  const { caseCode } = useParams<{ caseCode: string }>();
  const navigate = useNavigate();
  const { setSelectedAssetIds, setIsDrawerOpen, selectedAssetIds, toggleAssetSelection } = useApp();
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  const caseItem = mockCases.find(c => c.caseCode === caseCode);
  const caseAssets = mockAssets.filter(asset => asset.caseCode === caseCode);

  if (!caseItem) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto py-12 px-8">
          <p>Case not found</p>
        </div>
      </MainLayout>
    );
  }

  const clientSafeAssets = caseAssets.filter(asset => asset.sensitivity === 'Client-safe');
  const { canExport: canExportPack, blockingAssets } = canExportAssets(caseAssets);

  const handleExportCasePack = () => {
    if (canExportPack) {
      alert(`Exporting case pack for ${caseCode} with ${caseAssets.length} assets...`);
    }
  };

  const handleAskAIAdvisor = () => {
    // Select all client-safe assets from this case
    setSelectedAssetIds(clientSafeAssets.map(a => a.id));
    setIsDrawerOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-white border-b border-border-200">
            <button
              onClick={() => navigate('/cases')}
              className="text-sm text-text-600 hover:text-text-900 focus-ring mb-4"
            >
              ← Back to Cases
            </button>

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-primary-600 mb-1">
                  {caseItem.caseCode}
                </div>
                <h1 className="text-3xl font-bold text-text-900 mb-2">
                  {caseItem.name}
                </h1>
                <p className="text-text-600 mb-4">
                  {caseItem.description}
                </p>

                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-text-600">Client: </span>
                    <span className="font-medium text-text-900">{caseItem.client}</span>
                  </div>
                  <div>
                    <span className="text-text-600">Region: </span>
                    <span className="font-medium text-text-900">{caseItem.region}</span>
                  </div>
                  <div>
                    <span className="text-text-600">Industry: </span>
                    <span className="font-medium text-text-900">{caseItem.industry}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={handleExportCasePack}
                  disabled={!canExportPack}
                  title={canExportPack ? 'Export all assets in this case' : 'Cannot export: contains non-client-safe assets'}
                >
                  Export Case Pack
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleAskAIAdvisor}
                >
                  Ask AI Advisor
                </Button>
              </div>
            </div>

            {/* Export Status */}
            <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl">
              <div>
                <span className="text-sm text-text-600">Total Assets: </span>
                <span className="font-semibold text-text-900">{caseAssets.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="Client-safe">{clientSafeAssets.length} Client-safe</Badge>
                {blockingAssets.length > 0 && (
                  <Badge variant="warning">{blockingAssets.length} Internal/Restricted</Badge>
                )}
              </div>
            </div>

            {!canExportPack && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  ⚠️ Export Blocked
                </p>
                <p className="text-sm text-yellow-800 mb-2">
                  Case pack export is disabled because the following assets are not Client-safe:
                </p>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {blockingAssets.map(asset => (
                    <li key={asset.id}>
                      • <strong>{asset.id}</strong> - {asset.title} ({asset.sensitivity})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Assets List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-text-900">
                Assets in this Case
              </h2>
            </div>

            <div className="space-y-4">
              {caseAssets.map(asset => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedAssetIds.includes(asset.id)}
                  onToggleSelect={() => toggleAssetSelection(asset.id)}
                  onViewDetails={() => setPreviewAsset(asset)}
                  relevance={calculateRelevance(asset, '')}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <PreviewPanel
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      </div>
    </MainLayout>
  );
};
