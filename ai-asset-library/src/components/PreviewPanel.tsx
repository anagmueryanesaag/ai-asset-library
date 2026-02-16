import React from 'react';
import type { Asset } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDate } from '../utils/assetUtils';

interface PreviewPanelProps {
  asset: Asset | null;
  onClose: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ asset, onClose }) => {
  if (!asset) {
    return (
      <div className="w-96 bg-white border-l-2 border-border-200 p-6 flex items-center justify-center text-text-600">
        <div className="text-center">
          <div className="text-4xl mb-3">👁️</div>
          <p>Select an asset to preview</p>
        </div>
      </div>
    );
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

        <div className="flex gap-2 mb-4">
          <Badge variant={asset.status}>{asset.status}</Badge>
          <Badge variant={asset.sensitivity}>{asset.sensitivity}</Badge>
        </div>

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

        <div>
          <h4 className="text-sm font-semibold text-text-900 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {asset.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-surface-50 text-text-600 rounded-full border border-border-200"
              >
                {tag}
              </span>
            ))}
          </div>
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
            onClick={() => alert(`Downloading ${asset.title}...`)}
          >
            Download
          </Button>
        </>
      </div>
    </div>
  );
};
