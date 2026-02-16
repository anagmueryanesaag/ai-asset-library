import React from 'react';
import { Button } from './ui/Button';
import type { Asset } from '../types';

interface SelectionBarProps {
  selectedAssets: Asset[];
  onSaveSelected: () => void;
  onClearSelection: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedAssets,
  onSaveSelected,
  onClearSelection,
}) => {
  if (selectedAssets.length === 0) return null;

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

        <Button variant="primary" onClick={onSaveSelected}>
          Save Selected
        </Button>
      </div>
    </div>
  );
};
