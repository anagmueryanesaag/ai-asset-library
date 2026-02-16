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
      className={`bg-white rounded-2xl p-5 border-2 transition-all ${
        isSelected
          ? 'border-primary-600 shadow-lg'
          : 'border-border-200 hover:border-primary-500 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="mt-1 w-5 h-5 rounded border-2 border-border-200 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 cursor-pointer"
          aria-label={`Select ${asset.title}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-900 text-lg leading-tight mb-1">
                {asset.title}
              </h3>
              <p className="text-sm text-text-600 line-clamp-2">
                {asset.summary}
              </p>
            </div>
          </div>

          {/* Relevance */}
          {relevance !== undefined && (
            <div className="mb-3">
              <span className="text-sm text-text-600">
                Relevance: {relevance}%
              </span>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between text-xs text-text-600 pt-3 border-t border-border-200">
            <div className="flex items-center gap-4">
              <span className="font-medium">{asset.caseCode}</span>
              <span>{asset.client}</span>
              <span>{formatDate(asset.updatedAt)}</span>
              <span>{asset.owner}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={onViewDetails}
              className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus-ring"
            >
              View details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
