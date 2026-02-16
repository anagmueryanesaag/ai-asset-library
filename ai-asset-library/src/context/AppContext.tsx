import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Filters, ChatMessage, ChatHistory } from '../types';

interface AppContextType {
  // Selection
  selectedAssetIds: string[];
  toggleAssetSelection: (assetId: string) => void;
  clearSelection: () => void;
  setSelectedAssetIds: (ids: string[]) => void;
  savedAssetIds: string[];
  saveAssets: (assetIds: string[]) => void;
  removeSavedAsset: (assetId: string) => void;

  // Filters
  activeFilters: Filters;
  setActiveFilters: (filters: Filters) => void;
  clearFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // AI Drawer
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  currentChatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearCurrentChat: () => void;
  chatHistories: ChatHistory[];
  addChatHistory: (history: ChatHistory) => void;
  loadChatHistory: (historyId: string) => void;

  // Sort
  sortBy: 'relevance' | 'recent';
  setSortBy: (sort: 'relevance' | 'recent') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [savedAssetIds, setSavedAssetIds] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    types: [],
    caseCodes: [],
    clients: [],
    domains: [],
    industries: [],
    techStacks: [],
    regions: [],
    statuses: [],
    sensitivities: [],
    owners: [],
    tags: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentChatMessages, setCurrentChatMessages] = useState<ChatMessage[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: 'chat-1',
      title: 'Multi-cloud deployment patterns',
      timestamp: '2025-01-20T10:30:00',
      assetIds: ['A-0001', 'A-0003']
    },
    {
      id: 'chat-2',
      title: 'RAG implementation best practices',
      timestamp: '2025-01-19T14:15:00',
      assetIds: ['A-0004', 'A-0005']
    }
  ]);
  const [sortBy, setSortBy] = useState<'relevance' | 'recent'>('relevance');

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssetIds(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const clearSelection = () => {
    setSelectedAssetIds([]);
  };

  const saveAssets = (assetIds: string[]) => {
    setSavedAssetIds(prev => {
      const next = new Set(prev);
      assetIds.forEach(id => next.add(id));
      return Array.from(next);
    });
  };

  const removeSavedAsset = (assetId: string) => {
    setSavedAssetIds(prev => prev.filter(id => id !== assetId));
  };

  const clearFilters = () => {
    setActiveFilters({
      types: [],
      caseCodes: [],
      clients: [],
      domains: [],
      industries: [],
      techStacks: [],
      regions: [],
      statuses: [],
      sensitivities: [],
      owners: [],
      tags: [],
    });
  };

  const addChatMessage = (message: ChatMessage) => {
    setCurrentChatMessages(prev => [...prev, message]);
  };

  const clearCurrentChat = () => {
    setCurrentChatMessages([]);
  };

  const addChatHistory = (history: ChatHistory) => {
    setChatHistories(prev => [history, ...prev]);
  };

  const loadChatHistory = (historyId: string) => {
    // In a real app, this would load the full chat from backend
    const history = chatHistories.find(h => h.id === historyId);
    if (history) {
      setSelectedAssetIds(history.assetIds);
      clearCurrentChat();
      // Add a mock message
      addChatMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Loaded previous chat: "${history.title}"`,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedAssetIds,
        toggleAssetSelection,
        clearSelection,
        setSelectedAssetIds,
        savedAssetIds,
        saveAssets,
        removeSavedAsset,
        activeFilters,
        setActiveFilters,
        clearFilters,
        searchQuery,
        setSearchQuery,
        isDrawerOpen,
        setIsDrawerOpen,
        currentChatMessages,
        addChatMessage,
        clearCurrentChat,
        chatHistories,
        addChatHistory,
        loadChatHistory,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
