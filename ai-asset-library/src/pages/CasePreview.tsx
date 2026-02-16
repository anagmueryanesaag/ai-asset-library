import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { mockCases } from '../data/mockData';

const assetRows = [
  { label: 'Code general overview (md file)', key: 'codeOverview' },
  { label: 'Pipeline orchestration (md file)', key: 'pipelineOrchestration' },
  { label: 'User journeys (md file)', key: 'userJourneys' },
  { label: 'Behavior & control (md file)', key: 'behaviorControl' },
  { label: 'HLD (ppt file)', key: 'hld' },
  { label: 'PDD (word file)', key: 'pdd' },
  { label: 'Standard decision log (md file)', key: 'standardDecisionLog' },
  { label: 'Figma', key: 'figma' },
  { label: 'Demo', key: 'demo' },
] as const;

type AssetLinkKey = typeof assetRows[number]['key'];

type CasePreviewNavState = {
  returnTo?: string;
  previewAssetId?: string;
} | null;

export const CasePreview: React.FC = () => {
  const { caseCode } = useParams<{ caseCode: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const caseItem = mockCases.find(c => c.caseCode === caseCode);
  const teamMembers = caseItem?.aisTeamMembers?.length
    ? caseItem.aisTeamMembers.join(', ')
    : 'N/A';

  const handleBack = () => {
    const state = location.state as CasePreviewNavState;
    if (state?.returnTo) {
      navigate(state.returnTo, { state: { previewAssetId: state.previewAssetId } });
    } else {
      navigate(-1);
    }
  };

  if (!caseItem) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-12 px-8">
          <button
            onClick={handleBack}
            className="text-xs text-text-600 hover:text-text-900 focus-ring mb-4"
          >
            ← Back to Library
          </button>
          <p>Case not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-10 px-8">
        <button
          onClick={handleBack}
          className="text-xs text-text-600 hover:text-text-900 focus-ring mb-4"
        >
          ← Back to Library
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-text-900 mb-2">
            {caseItem.name}
          </h1>
          <p className="text-sm text-text-600">
            Case preview for {caseItem.caseCode}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white border border-border-200 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-text-900 mb-3">Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-text-500">Case code</dt>
                  <dd className="text-sm text-text-900 font-medium">{caseItem.caseCode}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-500">Client</dt>
                  <dd className="text-sm text-text-900 font-medium">{caseItem.client}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-500">Industry</dt>
                  <dd className="text-sm text-text-900 font-medium">{caseItem.industry}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-500">Region</dt>
                  <dd className="text-sm text-text-900 font-medium">{caseItem.region}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-500">Date</dt>
                  <dd className="text-sm text-text-900 font-medium">{caseItem.date}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-text-500">AIS team members</dt>
                  <dd className="text-sm text-text-900 font-medium">{teamMembers}</dd>
                </div>
              </dl>
            </section>

            <section className="bg-white border border-border-200 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-text-900 mb-2">Summary</h2>
              <p className="text-sm text-text-600 leading-relaxed">
                {caseItem.description}
              </p>
            </section>
          </div>

          <section className="bg-white border border-border-200 rounded-2xl p-5 h-fit">
            <h2 className="text-sm font-semibold text-text-900 mb-3">Assets related</h2>
            <div className="space-y-3">
              {assetRows.map(row => {
                const link = caseItem.assetLinks?.[row.key as AssetLinkKey];
                return (
                  <div key={row.key} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-text-700">{row.label}</span>
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-xs text-text-400">N/A</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
