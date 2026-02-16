/**
 * Application-wide constants
 * Centralized location for magic strings and configuration values
 */

// Quick start templates for home page
export const QUICK_START_TEMPLATES = [
  {
    title: 'Architecture Pattern Finder',
    description: 'Find proven architecture patterns for specific use cases',
    icon: '🏗️',
    query: 'architecture patterns cloud deployment enterprise',
  },
  {
    title: 'Benchmarks & Model Selection',
    description: 'Compare models and find performance benchmarks',
    icon: '📊',
    query: 'benchmark comparison model performance evaluation',
  },
  {
    title: 'Deployment in Client Environments',
    description: 'Client-safe deployment guides and best practices',
    icon: '🚀',
    query: 'deployment guide client environment production',
  },
] as const;

// AI Advisor suggested questions
export const AI_SUGGESTED_QUESTIONS = [
  'What are the key architecture patterns in these assets?',
  'Compare deployment approaches across selected assets',
  'What are the security considerations mentioned?',
  'Summarize the tech stack recommendations',
] as const;

// Asset type icons mapping
export const ASSET_TYPE_ICONS: Record<string, string> = {
  'Architecture HLD': '🏗️',
  'Code Sample': '💻',
  'Deployment Guide': '🚀',
  'Technical Doc': '📄',
  'Benchmark Report': '📊',
  'Model Card': '🎯',
  'Integration Pattern': '🔗',
  'Security Guide': '🔒',
} as const;

// Relevance scoring weights
export const RELEVANCE_SCORING = {
  TITLE_EXACT: 40,
  TITLE_KEYWORD: 15,
  SUMMARY_EXACT: 20,
  SUMMARY_KEYWORD: 5,
  TAG_MATCH: 8,
  TECH_MATCH: 5,
  DOMAIN_MATCH: 10,
  TYPE_MATCH: 10,
  MAX_RECENCY_BONUS: 10,
  RECENCY_DECAY_DAYS: 10,
} as const;

// UI Configuration
export const UI_CONFIG = {
  MAX_VISIBLE_FILTERS: 5,
  MAX_CHAT_HISTORY: 10,
  AI_RESPONSE_DELAY_MS: 1500,
  DEBOUNCE_SEARCH_MS: 300,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_ASSETS: 'ai-library:selected-assets',
  ACTIVE_FILTERS: 'ai-library:filters',
  RECENT_SEARCHES: 'ai-library:recent-searches',
  CLIENT_SAFE_MODE: 'ai-library:client-safe-mode',
} as const;

// External links
export const EXTERNAL_LINKS = {
  SUPPORT_EMAIL: 'ai-assets@bain.com',
  DOCUMENTATION: 'https://example.com/docs',
  FEEDBACK_FORM: 'https://example.com/feedback',
} as const;
