export type AssetType =
  | 'Architecture HLD'
  | 'Code Sample'
  | 'Deployment Guide'
  | 'Technical Doc'
  | 'Benchmark Report'
  | 'Model Card'
  | 'Integration Pattern'
  | 'Security Guide';

export type Sensitivity =
  | 'Client-safe'
  | 'Internal'
  | 'Restricted';

export type Status =
  | 'Active'
  | 'Draft'
  | 'Deprecated'
  | 'Under Review';

export interface Asset {
  id: string;
  title: string;
  summary: string;
  type: AssetType;
  caseCode: string;
  client: string;
  domain: string;
  industry: string;
  region: string;
  status: Status;
  sensitivity: Sensitivity;
  techStack: string[];
  tags: string[];
  owner: string;
  updatedAt: string;
  sourceUrl: string;
  content?: string; // Full content for preview/AI
}

export interface Case {
  caseCode: string;
  name: string;
  client: string;
  region: string;
  industry: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  assetIds: string[];
}

export interface Filters {
  types: string[];
  caseCodes: string[];
  clients: string[];
  domains: string[];
  industries: string[];
  techStacks: string[];
  regions: string[];
  statuses: string[];
  sensitivities: string[];
  owners: string[];
  tags: string[];
}
