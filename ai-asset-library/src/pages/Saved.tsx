import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';

export const Saved: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-8 text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h1 className="text-4xl font-bold text-text-900 mb-4">Saved Assets</h1>
        <p className="text-text-600 mb-8">
          This feature is coming soon. You'll be able to save and organize your favorite assets here.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="text-primary-600 hover:underline focus-ring"
        >
          Browse Assets →
        </button>
      </div>
    </MainLayout>
  );
};
