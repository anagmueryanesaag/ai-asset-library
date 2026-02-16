import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Asset } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDate } from '../utils/assetUtils';

interface PreviewPanelProps {
  asset: Asset | null;
  onClose: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ asset, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!asset) {
    return null;
  }

  return (
    <div className="w-96 bg-white border-l-2 border-border-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border-200 flex items-start justify-between">
        <h2 className="font-bold text-text-900 text-lg">Preview</h2>
        <button
          onClick={onClose}
          className="text-text-600 hover:text-text-900 focus-ring rounded p-1"
          aria-label="Close preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="font-semibold text-text-900 text-xl mb-3 leading-tight">
          {asset.title}
        </h3>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-text-900 mb-2">Summary</h4>
          <p className="text-sm text-text-600 leading-relaxed">
            {asset.summary}
          </p>
        </div>

        {asset.content && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-text-900 mb-2">Content Excerpt</h4>
            <div className="text-sm text-text-600 leading-relaxed bg-surface-50 p-4 rounded-xl border border-border-200">
              {asset.content}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-text-900 mb-2">Details</h4>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-text-600">Type</dt>
              <dd className="text-text-900 font-medium">{asset.type}</dd>
            </div>
            <div>
              <dt className="text-text-600">Client</dt>
              <dd className="text-text-900 font-medium">{asset.client}</dd>
            </div>
            <div>
              <dt className="text-text-600">Industry</dt>
              <dd className="text-text-900 font-medium">{asset.industry}</dd>
            </div>
            <div>
              <dt className="text-text-600">Region</dt>
              <dd className="text-text-900 font-medium">{asset.region}</dd>
            </div>
            <div>
              <dt className="text-text-600">Last Updated</dt>
              <dd className="text-text-900 font-medium">{formatDate(asset.updatedAt)}</dd>
            </div>
          </dl>
        </div>

      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border-200 space-y-3">
        <>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => window.open(asset.sourceUrl, '_blank')}
          >
            Open
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              if (!asset.caseCode) return;
              const encodedCase = encodeURIComponent(asset.caseCode);
              navigate(`/cases/${encodedCase}/preview`, {
                state: {
                  returnTo: `${location.pathname}${location.search}`,
                  previewAssetId: asset.id,
                },
              });
            }}
          >
            Go to case
          </Button>
        </>
      </div>
    </div>
  );
};
