import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';

export const Help: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-4xl font-bold text-text-900 mb-4">Help & Support</h1>
          <p className="text-text-600">
            Learn how to make the most of the AI Asset Library
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-border-200">
            <h2 className="text-xl font-semibold text-text-900 mb-3">Getting Started</h2>
            <ul className="space-y-2 text-text-600">
              <li>• Use the search bar to find assets by keyword, technology, or use case</li>
              <li>• Apply filters to narrow down results by type, industry, tech stack, and more</li>
              <li>• Select multiple assets to ask the AI Advisor questions</li>
              <li>• Export client-safe assets for use in your projects</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-border-200">
            <h2 className="text-xl font-semibold text-text-900 mb-3">AI Advisor</h2>
            <ul className="space-y-2 text-text-600">
              <li>• Select one or more assets from search results or case views</li>
              <li>• Click "Ask AI Advisor" to open the chat interface</li>
              <li>• Ask questions about the selected assets - answers are based only on your selection</li>
              <li>• All responses include source citations for verification</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-border-200">
            <h2 className="text-xl font-semibold text-text-900 mb-3">Asset Sensitivity</h2>
            <ul className="space-y-2 text-text-600">
              <li>• <strong>Client-safe:</strong> Can be freely shared and exported</li>
              <li>• <strong>Internal:</strong> For internal use only, cannot be downloaded</li>
              <li>• <strong>Restricted:</strong> Requires special access permissions</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-border-200">
            <h2 className="text-xl font-semibold text-text-900 mb-3">Contact Support</h2>
            <p className="text-text-600">
              For additional help or to report issues, contact the AI Asset Library team at{' '}
              <a href="mailto:ai-assets@bain.com" className="text-primary-600 hover:underline">
                ai-assets@bain.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
