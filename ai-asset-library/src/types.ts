export type AssetType =
  | 'Behavior & controls'
  | 'Code overview'
  | 'Decision logs'
  | 'Demo'
  | 'Experience share'
  | 'Figma'
  | 'HLD'
  | 'Methodologies'
  | 'Other decks'
  | 'PDD'
  | 'Pipeline orchestration'
  | 'Tech documentation'
  | 'User journeys'
  | 'Video';

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

export interface CaseAssetLinks {
  codeOverview?: string;
  pipelineOrchestration?: string;
  userJourneys?: string;
  behaviorControl?: string;
  hld?: string;
  pdd?: string;
  standardDecisionLog?: string;
  figma?: string;
  demo?: string;
}

export interface Case {
  caseCode: string;
  name: string;
  client: string;
  date: string;
  region: string;
  industry: string;
  description: string;
  aisTeamMembers: string[];
  assetLinks?: CaseAssetLinks;
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
