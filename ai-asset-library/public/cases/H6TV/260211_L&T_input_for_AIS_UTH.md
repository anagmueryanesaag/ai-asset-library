---
title: "L&T AI-Driven Transformation Across the EPC Value Chain"
description: "A multi-application enterprise AI program for Larsen & Toubro (L&T) that delivered high-impact AI use cases across EPC operations and support functions over ~18 months. The delivery included composite AI applications for project execution, equipment planning, workmen planning/compliance, procurement vendor optimization, and multiple HR assistants, built with agentic orchestration, RAG, ML optimization, and Azure-based deployment."
contacts:
  - name: "TBD"
    email: "TBD"
---

# Code documentation

## Source materials used
This document is based on the following attached materials:
- Composite EPC AI repository technical crawl/overview fileciteturn0file0
- Vendor Optimization (Procurement AI / “god3”) repository technical crawl/overview fileciteturn0file1
- L&T AI codification call summary (program context, challenges, anecdotes) fileciteturn0file2

## 1) What was built (applications, modules, and delivery scope)

### 1.1 Program structure
The engagement ran for ~18 months and delivered multiple enterprise AI applications across EPC operations and support functions, supported by extensive documentation (7–9 IRIS decks covering use cases, value, architecture, and scaling roadmap), enterprise architecture workshops, and Figma designs/demos. fileciteturn0file2

### 1.2 Application portfolio (EPC value chain coverage)
Across the delivered artifacts and repositories, the portfolio spans:

**Project Execution**
- **Project Health AI**: conversational AI/chatbot over enterprise project data with intent classification, tool-calling, and (optionally) multi-agent (“swarm”) orchestration. fileciteturn0file0
- **Equipment AI**: planning, mobilization, utilization, plus predictive maintenance scheduling and optimization-driven recommendations (where enabled). fileciteturn0file0
- **Workmen AI**: workmen planning and mobilization recommendations; plus a compliance-focused RAG chatbot for legal/compliance queries (IR/compliance). fileciteturn0file0

**Supply Chain / Procurement**
- **Procurement AI / Vendor Optimization**: material search + vendor prioritization, market intelligence, vendor risk, and new vendor identification with agentic web discovery. fileciteturn0file1

**Support Functions**
- HR AI applications (multiple independent assistants such as employee/leadership/KRA/recruitment/staffing assistants are referenced in the program materials). fileciteturn0file2

## 2) Technical architecture (how it works end-to-end)

### 2.1 Overall architecture pattern
Across the EPC composite platform codebase, the delivery follows a multi-service architecture:
- Multiple FastAPI backends with dedicated frontends (Vite/React and Next.js)
- Azure-integrated AI services (Azure OpenAI, Azure AI Search, Blob Storage; plus optional Key Vault, Redis, Postgres)
- Deployment patterns spanning Docker Compose for local and Helm charts for Kubernetes (AKS) deployments fileciteturn0file0

In the Vendor Optimization (“god3”) procurement stack, the architecture is a modular backend + SPA frontend behind an Nginx gateway, with Postgres + Redis, Azure AI Search for retrieval, and optional LiteLLM proxy for model routing and caching. fileciteturn0file1

### 2.2 AI patterns used (by application)
**A) Conversational agent + tool-calling (Project Health AI)**
- Intent classification using LLM + structured outputs (Pydantic)
- Tool registry and tool-calling to run data tools (SQL/data access, mobilization/workmen planning, equipment tools, etc.)
- Optional “swarm” of specialist agents orchestrated by a triage agent
- Azure OpenAI for intent, tool-calling, and response synthesis; embeddings used for equipment similarity search in helper tooling fileciteturn0file0

**B) RAG (Workmen Compliance)**
- Full retrieval-augmented generation pipeline:
  - Azure OpenAI embeddings
  - Azure AI Search (vector + hybrid retrieval over document + summary collections)
  - FlashRank reranker
  - LLM answer generation with citations and guardrails (intent guard for “business” vs non-business intents)
- Optional Langfuse for tracing/observability fileciteturn0file0

**C) ML prediction + optimization (Equipment AI)**
- Pre-trained regression models loaded from `.pkl` for equipment counts (tower crane, rack & pinion), machine-months, and project-type cost models (“other costs” and “total equipment cost”).
- Optimization engine using PuLP (LP/MIP) + scipy (bisect) to compute optimal equipment quantity planning when enabled by IC/BU.
- LLM usage for narrative “insights” in some endpoints (Azure OpenAI) alongside deterministic optimization/prediction. fileciteturn0file0

**D) Vendor Optimization + agentic web discovery (Procurement AI / god3)**
- Material search with query enrichment (LLM) and hybrid/vector retrieval over Azure AI Search
- Vendor scoring/prioritization using internal performance data + deterministic scoring, with optional LLM explanation
- Agentic discovery workflows (planner → search → summarizer loop) grounded with web search tools (Gemini + Google Search tool, or optional Azure Foundry + Bing grounding)
- Optional LiteLLM proxy (Redis semantic cache, spend tracking, fallback routing) fileciteturn0file1

## 3) Key components and modules (repo-level documentation)

### 3.1 EPC composite platform repository (bain-composite-ai)
Key components and responsibilities (as evidenced in code/config):

- **Project Health AI backend (FastAPI)**: chat APIs, intent classifier, tool registry, optional multi-agent orchestration, Azure OpenAI integration, Redis for chat/session context, blob/spark data access, evaluation hooks. fileciteturn0file0
- **Equipment AI backend (FastAPI)**: equipment planning/mobilization/utilization APIs, ML model inference from `.pkl`, optimization via PuLP/scipy, Azure OpenAI for insights and embeddings in some flows. fileciteturn0file0
- **Workmen-recommendation backend (FastAPI)**: workmen planning/tendering/mobilization recommendations, Azure OpenAI-based insight generation, Postgres + Blob integration. fileciteturn0file0
- **Workmen-compliance backend (FastAPI)**: RAG chatbot over compliance documents, Azure AI Search vector stores, FlashRank reranker, intent guardrails, optional Langfuse. fileciteturn0file0
- **Frontends**: Vite and Next.js applications for the above domains; Streamlit client also present. fileciteturn0file0
- **Jobs & pipelines**: ingestion jobs (blob → Postgres), chat history extract to blob, pre-processing pipelines (incl. Databricks-oriented workmen productivity pipeline using sklearn + XGBoost), and an eval harness that runs test questions and uploads results to blob. fileciteturn0file0
- **Infra**: Helm charts for each major service and Azure DevOps pipelines for build/deploy. fileciteturn0file0

### 3.2 Procurement AI repository (aag-lnt-vendor-optimization / god3)
Key components and responsibilities:

- **Backend API (FastAPI)**: routers for material search, vendor prioritization, vendor profile, market intelligence, new vendor identification, services smart search, feedback, auth/integration endpoints. fileciteturn0file1
- **Material matcher**: query enrichment + Azure AI Search hybrid/vector retrieval + LLM match classification. fileciteturn0file1
- **Vendor prioritization**: scoring engine + vendor selector + optional LLM explanation; Redis caching for response tables when enabled. fileciteturn0file1
- **Agentic discovery**: orchestrator loop using planner and summarizer agents with grounding via web search tools; Pydantic-based validation and retry. fileciteturn0file1
- **ETL pipelines**: layered pipelines feeding Postgres/Azure Storage and uploading to Azure Search; cron job support via Helm. fileciteturn0file1
- **Optional LiteLLM proxy**: centralized model routing with Redis semantic caching and spend tracking. fileciteturn0file1

## 4) Data, integrations, and deployment

### 4.1 Data sources and persistence
Across the EPC composite platform:
- Azure Blob Storage for parquet/Excel/PDF/CSV inputs and outputs, plus some shared datasets
- Redis for chat/session state (where used)
- Postgres used by parts of the system (e.g., recommendation backend; ingestion components) fileciteturn0file0

In Procurement AI (god3):
- PostgreSQL as system-of-record (materials, vendors, POs, feedback, etc.)
- Redis for caching (and LiteLLM semantic cache when enabled)
- Azure AI Search as primary retrieval index for materials and services
- Azure Storage as parquet/csv store for ETL outputs and backend-loaded profiles fileciteturn0file1

### 4.2 Security and access
- Keycloak-based authentication and token validation are present across the stacks, with endpoint-level authorization patterns. fileciteturn0file0turn0file1

### 4.3 Deployment
- Local development supported via Docker Compose.
- Production-style deployments supported via Helm charts (AKS/Kubernetes) and CI/CD pipelines. fileciteturn0file0turn0file1

## 5) Evaluation and quality
- The EPC composite platform includes an evaluation harness that runs test question sets against the chat API and uploads results to blob; observability via Langfuse is optional in some modules. fileciteturn0file0
- The codification call notes that evaluations were initially run through an Excel-heavy workflow, creating friction and iteration overhead during UAT, with a recommendation to invest early in reusable evaluation pipelines and SME-friendly tooling. fileciteturn0file2

---

# Insights, Learning & Anecdotes

## 1) “Evals are a major time sink” (and why it mattered)
A recurring theme was that evaluation overhead dominated the iteration cycle:
- Running evals on client datasets required significant effort.
- UAT frequently introduced new requirements, triggering repeated evaluation and rework loops.
- The process was initially Excel-based, which increased friction and slowed feedback loops. fileciteturn0file2

**What this changed in practice**
- Teams had to allocate substantial engineering and SME time to manage evaluation runs.
- Quality improvements and scope adjustments were gated by evaluation turnaround time.
- The program recommendation was to invest early in reusable evaluation pipelines and modern tooling that reduces boilerplate and improves SME review workflows. fileciteturn0file2

## 2) AI-driven scope expansion: “users only know what they want after they see it”
The call summary highlights AI-driven scope expansion as a consistent pattern:
- Once stakeholders saw AI outputs in context, new requirements emerged rapidly.
- Seemingly small feature requests often required substantial backend expansion (additional data tables, broader pipelines, and more engineering work). fileciteturn0file2

**Why Figma helped (but didn’t fully solve it)**
Figma was helpful to stabilize UI and align on flows early, but “real” scope expansion often happened after hands-on usage and output review, when stakeholders could react to concrete AI behaviors. fileciteturn0file2

## 3) Organizational complexity and stakeholder management
The program involved multiple stakeholders across operational and support functions, and the call notes that different stakeholders required different management styles. The engagement being described as the first large AI case in India increased scrutiny and complexity, impacting timelines and resourcing. fileciteturn0file2

## 4) Reusable assets and what’s portable to future work
The program identified several reusable components/patterns:
- Agentic architecture patterns
- Modular composite AI application design
- Evaluation pipeline concept (to be industrialized)
- Procurement AI demo as a repeatable asset
- Enterprise AI roadmap materials fileciteturn0file2

From the repositories, the most reusable technical “building blocks” visible in code are:
- Tool-calling chat architecture (intent → tools/agents → synthesis) fileciteturn0file0
- End-to-end RAG implementation (vector + hybrid retrieval, reranking, structured prompts, guardrails) fileciteturn0file0
- ML + optimization hybrid approach for planning (pretrained regression models + LP/MIP optimization) fileciteturn0file0
- Agentic web discovery loop with grounding and validation (planner/search/summarize + Pydantic validation) fileciteturn0file1
- Proxy-based LLM routing + semantic caching (LiteLLM + Redis) fileciteturn0file1

## 5) Anecdotes that bring the build to life
- The engagement is characterized as the first major AI case in India, which elevated complexity and expectations. fileciteturn0file2
- A memorable pattern: “one new requirement” could trigger the need for 10+ new tables and significant pipeline redesign—an illustration of how AI-driven products expand once users engage with outputs. fileciteturn0file2
- Early evaluations were managed through Excel, which became a practical bottleneck until more reusable evaluation approaches were introduced. fileciteturn0file2
