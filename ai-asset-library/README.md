# AI Asset Library

A production-quality web UI for managing and exploring technical AI/ML codification assets. Built with React, TypeScript, and Tailwind CSS.

## Features

### Core Workflows
- **Search & Discovery**: Natural language search with faceted filtering across 30+ mock assets
- **Multi-select Curation**: Select multiple assets for analysis and export
- **AI Advisor**: Closed-context AI assistant that answers questions using only selected assets with source citations
- **Case Pack Management**: Browse assets by client cases with export controls based on sensitivity
- **Export Controls**: Automatic validation prevents exporting Internal/Restricted assets

### Key Capabilities
- 🔍 **Advanced Search**: Keyword search with relevance scoring and multiple sort options
- 🎯 **Faceted Filters**: Filter by type, case, client, domain, industry, tech stack, region, status, sensitivity, owner, and tags
- 🤖 **AI Assistant**: Context-aware chat with citation-backed responses
- 📦 **Case Packs**: Organized asset bundles by client engagement
- 🔒 **Sensitivity Controls**: Client-safe mode and export restrictions
- ♿ **Accessible**: Keyboard navigable with ARIA labels

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **React Router** for navigation
- **Tailwind CSS** for styling with custom design tokens
- **Context API** for state management
- **Mock Data**: 30 realistic assets + 10 cases

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd ai-asset-library
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (SidebarNav, MainLayout)
│   ├── ui/             # Base UI components (Button, Badge, Chip, SearchBar)
│   ├── AIDrawer.tsx    # AI Advisor chat interface
│   ├── AssetCard.tsx   # Asset card with metadata
│   ├── FilterRail.tsx  # Faceted filter sidebar
│   ├── PreviewPanel.tsx # Asset detail preview
│   └── SelectionBar.tsx # Bottom selection controls
├── context/            # React Context for state management
│   └── AppContext.tsx  # Global app state
├── data/               # Mock data
│   └── mockData.ts     # 30 assets + 10 cases
├── pages/              # Route pages
│   ├── Home.tsx        # Landing page with quick start
│   ├── Search.tsx      # Main search interface
│   ├── Cases.tsx       # Case list
│   ├── CaseView.tsx    # Individual case view
│   ├── Saved.tsx       # Saved assets (stub)
│   └── Help.tsx        # Help documentation
├── utils/              # Utility functions
│   └── assetUtils.ts   # Filter, sort, relevance scoring
├── types.ts            # TypeScript interfaces
├── App.tsx             # Root component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## User Flows

### 1. Search & Filter
1. Start at Home page
2. Enter a search query or use a quick start template
3. Apply faceted filters from the left rail
4. View results with relevance scores
5. Click "View details" to preview an asset

### 2. AI Advisor Workflow
1. Select one or more assets using checkboxes
2. Click "Ask AI Advisor" (enabled when assets are selected)
3. Right-side drawer opens with chat interface
4. Ask questions about the selected assets
5. Receive answers with source citations
6. View chat history and start new conversations

### 3. Case Pack Export
1. Navigate to Cases page
2. Select a case to view details
3. Review case assets and sensitivity distribution
4. Click "Export Case Pack" (disabled if non-client-safe assets present)
5. System shows which assets block export if applicable

### 4. Multi-select & Export
1. Select multiple assets from search results
2. Selection bar appears at bottom with count
3. Click "Export Selected" to download
4. If any Internal/Restricted assets selected, export is blocked with explanation
5. Hover over disabled button to see which assets block export

## Design System

### Colors
- **Background Gradient**: Soft pink-to-lavender (#F0D0D8 → #E0D8E8)
- **Primary**: Purple (#6848D0, #7848B8)
- **Accent**: Subtle red (#B03048)
- **Text**: Dark gray (#1F1F1F) and medium gray (#6B6B6B)
- **Borders**: Light gray (#E6E6E6)
- **Surface**: Off-white (#F8F8FB)

### Components
- **Rounded cards**: 12–16px border radius
- **Thin borders**: 2px with hover states
- **Purple gradient pills**: Active navigation items
- **Shadow on hover**: Subtle elevation changes
- **Focus rings**: 2px primary color ring for accessibility

## Data Model

### Asset
```typescript
interface Asset {
  id: string;              // e.g., "A-0001"
  title: string;
  summary: string;
  type: AssetType;         // Architecture HLD, Code Sample, etc.
  caseCode: string;        // Links to case
  client: string;
  domain: string;
  industry: string;
  region: string;
  status: Status;          // Active, Draft, Deprecated, Under Review
  sensitivity: Sensitivity; // Client-safe, Internal, Restricted
  techStack: string[];
  tags: string[];
  owner: string;
  updatedAt: string;       // ISO date
  sourceUrl: string;
  content?: string;        // Full content for preview
}
```

### Filters
All filters support multi-select:
- Type (8 types)
- Case code (10 cases)
- Client
- Domain
- Industry
- Tech stack
- Region
- Status
- Sensitivity
- Owner
- Tags

## Key Features Detail

### Relevance Scoring
Client-side scoring algorithm:
- Title match: 40 points + 15 per keyword
- Summary match: 20 points + 5 per keyword
- Tags match: 8 points per keyword
- Tech stack match: 5 points per keyword
- Recency bonus: Up to 10 points

Normalized to 0–100 scale.

### AI Advisor Mock Responses
Deterministic responses based on question keywords:
- "architecture" → architecture patterns summary
- "security" → security considerations
- "deployment" → deployment recommendations
- "tech stack" → technology summary
- Default → general synthesis

All responses include source citations in format:
```
(Source: A-0006 – Asset Title)
```

### Export Rules
**Client-safe Assets**: Can be freely exported
**Internal Assets**: Cannot be downloaded (Open only)
**Restricted Assets**: Require access request

**Case Pack Export**: Blocked if any non-client-safe assets in case

## Accessibility

- Keyboard navigation throughout
- Focus rings on all interactive elements
- ARIA labels on icon buttons
- Semantic HTML structure
- Color contrast meets WCAG AA standards

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

- Backend integration with real API
- User authentication and permissions
- Real LLM integration for AI Advisor
- Advanced analytics and usage tracking
- Saved searches and collections
- Collaborative features (comments, ratings)
- Version control for assets
- Advanced export formats (PDF, presentations)

## License

© 2026 Bain & Company - Internal Use Only

## Support

For questions or issues, contact: ai-assets@bain.com
