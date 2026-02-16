import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { mockAssets } from '../data/mockData';
import { Button } from './ui/Button';
import type { Asset, ChatMessage } from '../types';
import { AI_SUGGESTED_QUESTIONS } from '../constants';

export const AIDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    selectedAssetIds,
    currentChatMessages,
    addChatMessage,
    clearCurrentChat,
    chatHistories,
    loadChatHistory,
    addChatHistory,
  } = useApp();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedAssets = mockAssets.filter(asset =>
    selectedAssetIds.includes(asset.id)
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChatMessages]);

  const handleSendMessage = React.useCallback(async (question?: string) => {
    const messageText = question || inputValue.trim();
    if (!messageText || selectedAssets.length === 0) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (deterministic based on question)
    setTimeout(() => {
      const assistantMessage = generateMockResponse(messageText, selectedAssets);
      addChatMessage(assistantMessage);
      setIsTyping(false);

      // Save to history if this is a new chat
      if (currentChatMessages.length === 0) {
        addChatHistory({
          id: crypto.randomUUID(),
          title: messageText.slice(0, 50),
          timestamp: new Date().toISOString(),
          assetIds: selectedAssetIds,
        });
      }
    }, 1500);
  }, [inputValue, selectedAssets, addChatMessage, currentChatMessages.length, addChatHistory, selectedAssetIds]);

  const handleNewChat = () => {
    clearCurrentChat();
  };

  const handleRemoveAsset = (assetId: string) => {
    // In a real app, this would update the selection
    alert(`Removing ${assetId} from selection would close the drawer and update context`);
  };

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-900">AI Advisor</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-text-600 hover:text-text-900 focus-ring rounded p-1"
            aria-label="Close AI Advisor"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar: New Chat & History */}
        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-border-200 flex flex-col">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNewChat}
              className="m-3"
            >
              + New Chat
            </Button>
            <div className="flex-1 overflow-y-auto px-3">
              <h3 className="text-xs font-semibold text-text-600 mb-2 px-2">HISTORY</h3>
              <div className="space-y-1">
                {chatHistories.slice(0, 10).map(history => (
                  <button
                    key={history.id}
                    onClick={() => loadChatHistory(history.id)}
                    className="w-full text-left px-2 py-2 text-xs text-text-900 hover:bg-surface-50 rounded transition-colors focus-ring"
                  >
                    <div className="truncate">{history.title}</div>
                    <div className="text-text-600 mt-0.5">
                      {history.assetIds.length} assets
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentChatMessages.length === 0 ? (
              // Empty state
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-text-900 mb-2">
                    What do you need to get smart on?
                  </h3>
                  <p className="text-sm text-text-600 mb-6">
                    Answers are based <strong>only on your selected assets</strong>.
                    We cite sources for every claim.
                  </p>

                  {/* Suggested Questions */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-text-600 mb-3">SUGGESTED QUESTIONS</p>
                    <div className="grid grid-cols-1 gap-2">
                      {AI_SUGGESTED_QUESTIONS.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(question)}
                          className="px-4 py-2 text-sm text-left bg-surface-50 hover:bg-primary-50 border border-border-200 hover:border-primary-600 rounded-lg transition-all focus-ring"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Assets */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold text-text-600 mb-2">SELECTED ASSETS ({selectedAssets.length})</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedAssets.map(asset => (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between px-3 py-2 bg-surface-50 rounded-lg text-xs"
                        >
                          <span className="truncate flex-1 text-text-900">{asset.title}</span>
                          <button
                            onClick={() => handleRemoveAsset(asset.id)}
                            className="ml-2 text-text-600 hover:text-red-600 focus-ring"
                            aria-label={`Remove ${asset.title}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Chat messages
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {currentChatMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface-50 text-text-900 border border-border-200'
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border-200">
                            <p className="text-xs font-semibold text-text-600 mb-1">Sources:</p>
                            <ul className="text-xs space-y-1">
                              {message.sources.map((source, idx) => (
                                <li key={idx} className="text-text-600">• {source}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-surface-50 border border-border-200 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-text-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-text-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-text-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-600 rounded-full text-xs font-medium">
                  {selectedAssets.length} Assets Selected
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-xs text-text-600 hover:text-text-900 underline focus-ring"
                >
                  Modify selection
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question about your selected assets..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border-200 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                  disabled={isTyping || selectedAssets.length === 0}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping || selectedAssets.length === 0}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Mock AI response generator
function generateMockResponse(question: string, selectedAssets: Asset[]): ChatMessage {
  const questionLower = question.toLowerCase();
  let content = '';
  const sources: string[] = [];

  // Generate response based on question type
  if (questionLower.includes('architecture') || questionLower.includes('pattern')) {
    content = `Based on the ${selectedAssets.length} selected assets, here are the key architecture patterns:\n\n`;
    content += `1. **Multi-Cloud Architecture**: Recommended for enterprise deployments with unified governance across AWS, Azure, and GCP. (Source: ${selectedAssets[0]?.id} – ${selectedAssets[0]?.title})\n\n`;
    content += `2. **Edge Computing Patterns**: For latency-sensitive applications, K3s-based edge deployments show significant performance improvements. (Source: ${selectedAssets[1]?.id} – ${selectedAssets[1]?.title})\n\n`;
    content += `3. **Serverless ML Inference**: Cost-effective for intermittent workloads, achieving 70% cost reduction vs dedicated instances.`;
    sources.push(`${selectedAssets[0]?.id} – ${selectedAssets[0]?.title}`);
    if (selectedAssets[1]) sources.push(`${selectedAssets[1]?.id} – ${selectedAssets[1]?.title}`);
  } else if (questionLower.includes('security') || questionLower.includes('compliance')) {
    content = `Security considerations across your selected assets:\n\n`;
    content += `• **Zero-Trust Model**: Implement identity-based access with continuous verification for all AI workloads\n`;
    content += `• **Data Encryption**: Use KMS and CloudHSM for encryption at rest and TLS for data in transit\n`;
    content += `• **Audit Logging**: Comprehensive logging required for HIPAA and financial services compliance\n\n`;
    content += `All recommendations align with industry standards for ${selectedAssets[0]?.industry} sector.`;
    sources.push(`${selectedAssets[0]?.id} – ${selectedAssets[0]?.title}`);
  } else if (questionLower.includes('deploy') || questionLower.includes('deployment')) {
    content = `Deployment recommendations from your selected assets:\n\n`;
    content += `**For Cloud Environments**:\n`;
    content += `- Use Kubernetes with GitOps (ArgoCD) for production deployments\n`;
    content += `- Implement blue-green deployment strategy for zero-downtime updates\n\n`;
    content += `**For Edge/Client Environments**:\n`;
    content += `- Model optimization: quantization and pruning for 8x size reduction\n`;
    content += `- Offline-first architecture for network-constrained environments\n\n`;
    content += `Average deployment time reduced to <2 hours with automated pipelines.`;
    sources.push(`${selectedAssets[0]?.id} – ${selectedAssets[0]?.title}`);
  } else if (questionLower.includes('tech stack') || questionLower.includes('technology')) {
    const allTech = new Set<string>();
    selectedAssets.forEach(asset => asset.techStack?.forEach((t: string) => allTech.add(t)));
    content = `Technology stack summary across ${selectedAssets.length} assets:\n\n`;
    content += `**Most Common Technologies**:\n`;
    Array.from(allTech).slice(0, 5).forEach(tech => {
      content += `• ${tech}\n`;
    });
    content += `\nThese technologies are production-proven and have strong community support.`;
    sources.push(`${selectedAssets[0]?.id} – ${selectedAssets[0]?.title}`);
  } else {
    content = `Based on your ${selectedAssets.length} selected assets, here's a comprehensive answer:\n\n`;
    content += `The assets cover domains including ${selectedAssets.map(a => a.domain).slice(0, 3).join(', ')}. `;
    content += `Key insights include proven implementations across ${selectedAssets.map(a => a.industry).filter((v, i, a) => a.indexOf(v) === i).join(', ')} industries.\n\n`;
    content += `Common themes:\n`;
    content += `• Production-ready patterns with documented case studies\n`;
    content += `• Client-safe deployment approaches\n`;
    content += `• Scalable architectures handling enterprise workloads\n\n`;
    content += `I recommend reviewing the specific technical documentation for implementation details.`;
    sources.push(`${selectedAssets[0]?.id} – ${selectedAssets[0]?.title}`);
    if (selectedAssets[1]) sources.push(`${selectedAssets[1]?.id} – ${selectedAssets[1]?.title}`);
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    sources,
  };
}
