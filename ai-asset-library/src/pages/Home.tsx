import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchQuery } = useApp();
  const [query, setQuery] = useState('');
  const [showTips, setShowTips] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-12 px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-text-secondary mb-2">Welcome to</p>
          <h1 className="text-4xl font-semibold text-text-primary mb-3">
            AIS Knowledge
          </h1>
          <p className="text-sm text-text-secondary">
            Start Smart. Stay Ahead.
          </p>
        </div>

        {/* Query Composer */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Describe what you are looking for
          </h3>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for multi-cloud architecture pattern for financial services"
              className="w-full h-48 px-4 py-3 rounded-xl border-2 transition-all resize-none text-sm"
              style={{
                borderColor: '#E8E8EE',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#B03048';
                e.target.style.boxShadow = '0 0 0 3px rgba(176, 48, 72, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E8E8EE';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Search Tips Accordion */}
        <div className="bg-white rounded-xl border border-DEFAULT mb-8">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full px-6 py-4 flex items-center justify-between text-left focus-ring rounded-xl"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-semibold text-text-primary">
                Search Tips
              </h3>
            </div>
            <svg
              className={`w-4 h-4 text-text-secondary transition-transform ${showTips ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTips && (
            <div className="px-6 pb-6 border-t border-DEFAULT">
              <div className="pt-6 space-y-6">
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary mb-2">Simple Keyword Search</p>
                      <p className="text-sm text-text-secondary mb-2">Use specific keywords to find experts quickly.</p>
                    </div>
                  </div>
                  <div className="ml-9 grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-text-secondary">
                    <div>
                      <p className="mb-1">• Expert names: "John Smith", "Sarah Chen"</p>
                      <p>• Job titles: "VP Engineering", "CTO"</p>
                    </div>
                    <div>
                      <p className="mb-1">• Company names: "Tesla", "BMW", "Siemens"</p>
                      <p>• Industries: "automotive", "renewable energy"</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary mb-2">Advanced Search</p>
                      <p className="text-sm text-text-secondary mb-2">Use advanced search to find experts with specific skills and experience.</p>
                    </div>
                  </div>
                  <div className="ml-9 grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-text-secondary">
                    <div>
                      <p className="mb-1">• Company names or examples (Tesla, Siemens, etc.)</p>
                      <p className="mb-1">• Specific roles or seniority levels (VP, Director, C-level)</p>
                      <p>• Years of experience or tenure requirements</p>
                    </div>
                    <div>
                      <p className="mb-1">• Industry or capability focus (sustainability, operations)</p>
                      <p>• Geographic region if relevant (EMEA, Americas)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="px-8 py-2.5 rounded-lg border-2 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: '#B03048',
              color: '#B03048',
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              if (query.trim()) {
                e.currentTarget.style.backgroundColor = '#B03048';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#B03048';
            }}
          >
            Search
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
