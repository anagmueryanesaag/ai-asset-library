import React from 'react';
import type { Asset } from '../types';
import { Badge } from './ui/Badge';
import { formatDate } from '../utils/assetUtils';
import { ASSET_TYPE_ICONS } from '../constants';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewDetails: () => void;
  relevance?: number;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isSelected,
  onToggleSelect,
  onViewDetails,
  relevance,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 border-2 transition-all ${
        isSelected
          ? 'border-primary-600 shadow-md'
          : 'border-border-200 hover:border-primary-500 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="mt-0.5 w-4 h-4 rounded border-2 border-border-200 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 cursor-pointer"
          aria-label={`Select ${asset.title}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-3 mb-1">
            <div className="flex-1 min-w-0">
              <button
                onClick={onViewDetails}
                className="text-left font-semibold text-text-900 text-base leading-snug mb-1 hover:underline focus-ring"
                aria-label={`View details for ${asset.type} - ${asset.client}`}
              >
                {asset.type} - {asset.client}
              </button>
            </div>
          </div>

          {/* Relevance */}
          {relevance !== undefined && (
            <div className="mb-2">
              <span className="text-xs text-text-600">
                Relevance: {relevance}%
              </span>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between text-[11px] text-text-600 pt-2 border-t border-border-200">
            <div className="flex items-center gap-3">
              <span className="font-medium">{asset.caseCode}</span>
              <span>{asset.client}</span>
              <span>{formatDate(asset.updatedAt)}</span>
              <span>{asset.owner}</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};
