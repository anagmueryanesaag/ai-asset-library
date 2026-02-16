import React, { useMemo, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { mockAssets } from '../data/mockData';
import type { Asset } from '../types';

interface WizardSource {
  title: string;
  url: string;
}

interface WizardMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: WizardSource[];
}

const MAX_RESULTS = 5;

const tokenize = (input: string) => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 2);
};

const countOccurrences = (text: string, token: string) => {
  if (!text || !token) return 0;
  let count = 0;
  let index = text.indexOf(token);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(token, index + token.length);
  }
  return count;
};

const scoreAsset = (asset: Asset, tokens: string[], phrase: string) => {
  const fields = [
    { text: asset.title, weight: 6 },
    { text: asset.summary, weight: 4 },
    { text: asset.content ?? '', weight: 3 },
    { text: asset.domain, weight: 3 },
    { text: asset.industry, weight: 3 },
    { text: asset.type, weight: 2 },
    { text: asset.client, weight: 2 },
    { text: asset.region, weight: 2 },
    { text: asset.tags.join(' '), weight: 2 },
    { text: asset.techStack.join(' '), weight: 2 },
    { text: asset.caseCode, weight: 1.5 },
  ];

  const phraseLower = phrase.toLowerCase();
  let score = 0;

  fields.forEach(field => {
    const textLower = field.text.toLowerCase();
    if (phraseLower && textLower.includes(phraseLower)) {
      score += 10 * field.weight;
    }
    tokens.forEach(token => {
      const hits = countOccurrences(textLower, token);
      if (hits > 0) {
        score += hits * field.weight;
      }
    });
  });

  return score;
};

const searchAssets = (query: string) => {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return [] as Asset[];
  }

  return mockAssets
    .map(asset => ({
      asset,
      score: scoreAsset(asset, tokens, query),
    }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(result => result.asset);
};

const buildAnswer = (query: string, results: Asset[]) => {
  if (results.length === 0) {
    return {
      content: `I could not find relevant assets for "${query}". Try adding more detail like industry, domain, or technology.`,
      sources: [] as WizardSource[],
    };
  }

  const insights = results
    .map(asset => `- ${asset.title}: ${asset.summary}`)
    .join('\n');

  return {
    content:
      `I searched metadata and content across the asset library. Here are the most relevant matches:\n\n${insights}\n\n` +
      `Open the linked sources below to review full details.`,
    sources: results.map(asset => ({
      title: `${asset.id} - ${asset.title}`,
      url: asset.sourceUrl,
    })),
  };
};

export const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<WizardMessage[]>([
    {
      id: 'wizard-intro',
      role: 'assistant',
      content:
        'Ask me a question about the asset library. I will search metadata and content, then point you to the most relevant files.',
    },
  ]);

  const canSend = useMemo(() => inputValue.trim().length > 0 && !isThinking, [inputValue, isThinking]);

  const handleSend = () => {
    const query = inputValue.trim();
    if (!query || isThinking) return;

    const userMessage: WizardMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      const results = searchAssets(query);
      const answer = buildAnswer(query, results);
      const assistantMessage: WizardMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer.content,
        sources: answer.sources,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-10 px-8 flex flex-col h-[calc(100vh-6rem)]">
        <div className="mb-6">
          <p className="text-sm text-text-secondary mb-2">Wizard</p>
          <h1 className="text-3xl font-semibold text-text-primary mb-2">
            AIS Knowledge Assistant
          </h1>
          <p className="text-sm text-text-secondary">
            Ask in natural language. Results are grounded in asset metadata and content.
          </p>
        </div>

        <div className="flex-1 bg-white border border-DEFAULT rounded-2xl p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-50 text-text-900 border border-border-200'
                  }`}
                >
                  <div>{message.content}</div>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border-200">
                      <p className="text-xs font-semibold text-text-600 mb-2">Relevant files</p>
                      <ul className="text-xs space-y-1">
                        {message.sources.map(source => (
                          <li key={source.url} className="text-text-600">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary-600 hover:underline"
                            >
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-surface-50 border border-border-200 rounded-2xl px-4 py-3 text-sm text-text-600">
                  Searching assets...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about architectures, benchmarks, deployments, or specific industries"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-border-200 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 text-sm"
            disabled={isThinking}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="px-6 py-3 rounded-xl border-2 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: '#B03048',
              color: canSend ? '#B03048' : '#8a8a8a',
              backgroundColor: 'white',
            }}
            onMouseEnter={(e) => {
              if (canSend) {
                e.currentTarget.style.backgroundColor = '#B03048';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = canSend ? '#B03048' : '#8a8a8a';
            }}
          >
            Ask
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
