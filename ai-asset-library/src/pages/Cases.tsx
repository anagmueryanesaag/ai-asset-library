import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { mockCases, mockAssets } from '../data/mockData';

export const Cases: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-text-600 hover:text-text-900 focus-ring mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-text-900 mb-2">Cases</h1>
          <p className="text-text-600">Browse assets organized by client cases and projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCases.map(caseItem => {
            const caseAssets = mockAssets.filter(
              asset => asset.caseCode === caseItem.caseCode
            );
            return (
              <button
                key={caseItem.caseCode}
                onClick={() => navigate(`/cases/${caseItem.caseCode}`)}
                className="bg-white rounded-2xl p-6 border-2 border-border-200 hover:border-primary-600 hover:shadow-lg transition-all text-left focus-ring"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-primary-600 mb-1">
                      {caseItem.caseCode}
                    </div>
                    <h3 className="text-xl font-bold text-text-900 mb-2">
                      {caseItem.name}
                    </h3>
                  </div>
                  <span className="text-2xl">📁</span>
                </div>

                <p className="text-sm text-text-600 mb-4 line-clamp-2">
                  {caseItem.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-text-600">Client:</span>
                    <div className="font-medium text-text-900">{caseItem.client}</div>
                  </div>
                  <div>
                    <span className="text-text-600">Region:</span>
                    <div className="font-medium text-text-900">{caseItem.region}</div>
                  </div>
                  <div>
                    <span className="text-text-600">Industry:</span>
                    <div className="font-medium text-text-900">{caseItem.industry}</div>
                  </div>
                  <div>
                    <span className="text-text-600">Assets:</span>
                    <div className="font-medium text-text-900">{caseAssets.length} total</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-200 text-xs text-text-600">
                  {caseAssets.length} total assets
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};
