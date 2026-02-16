import React from 'react';
import { Button } from './ui/Button';
import type { Asset } from '../types';
import { canExportAssets } from '../utils/assetUtils';

interface SelectionBarProps {
  selectedAssets: Asset[];
  onOpenAIAdvisor: () => void;
  onClearSelection: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedAssets,
  onOpenAIAdvisor,
  onClearSelection,
}) => {
  if (selectedAssets.length === 0) return null;

  const { canExport, blockingAssets } = canExportAssets(selectedAssets);

  const handleExport = () => {
    if (canExport) {
      alert(`Exporting ${selectedAssets.length} assets...`);
      // In a real app, this would trigger download
    }
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-white border-t-2 border-border-200 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-text-900">
            {selectedAssets.length} {selectedAssets.length === 1 ? 'asset' : 'assets'} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-text-600 hover:text-text-900 underline focus-ring"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onOpenAIAdvisor}>
            Ask AI Advisor
          </Button>

          <div className="relative group">
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={!canExport}
            >
              Export Selected
            </Button>
            {!canExport && (
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-white border-2 border-border-200 rounded-xl p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-sm font-semibold text-text-900 mb-2">
                  Cannot export selection
                </p>
                <p className="text-xs text-text-600 mb-2">
                  The following assets are not Client-safe and block export:
                </p>
                <ul className="text-xs text-text-600 space-y-1">
                  {blockingAssets.slice(0, 3).map(asset => (
                    <li key={asset.id}>
                      • {asset.id} - {asset.sensitivity}
                    </li>
                  ))}
                  {blockingAssets.length > 3 && (
                    <li>• ...and {blockingAssets.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
