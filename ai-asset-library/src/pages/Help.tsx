import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';

export const Help: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-900 mb-4">Help & Support</h1>
          <p className="text-text-600">
            Learn how to make the most of the AI Asset Library
          </p>
        </div>

        <div className="space-y-6">
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
