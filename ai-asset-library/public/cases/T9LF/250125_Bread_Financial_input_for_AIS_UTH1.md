---
title: "Bread Financial – GenAI Contact Center Knowledge Management (Care Center)"
description: "GenAI-powered knowledge management solution for contact center agents in a financial services organization, focused on improving policy/procedure lookup and answer generation during live customer interactions. Built as a scalable RAG application with reusable platform components (ingestion, retrieval, security/guardrails, evaluation, and an AI gateway) to extend beyond the Care Center into other operations and functions."
contacts:
  - name: "John Groves"
    email: "TBD"
  - name: "Bhavi Mehta"
    email: "TBD"
  - name: "Henry Huang"
    email: "TBD"
  - name: "Mikaela Boyd"
    email: "TBD"
  - name: "Gerard du Toit"
    email: "TBD"
  - name: "Brandon Meloche"
    email: "TBD"
  - name: "Matt Stolper"
    email: "TBD"
  - name: "Corrie Carrigan"
    email: "TBD"
  - name: "Maria Teresa Tejada"
    email: "TBD"
  - name: "Syed Ali"
    email: "TBD"
  - name: "Ali Arian"
    email: "TBD"
  - name: "Calvin Maguranis"
    email: "TBD"
---

## Overview

Bread Financial’s first prioritized GenAI build was a **Care Center Knowledge Management (KM) solution** to help contact center agents quickly find, interpret, and summarize product and procedure content while supporting customers. fileciteturn0file0 fileciteturn0file1

The solution was designed with **scale and extensibility** in mind—reusable components and program enablers (risk & compliance, InfoSec, change management, and agile delivery) were treated as foundational so future GenAI use cases could move faster. fileciteturn0file1 fileciteturn0file2

---

## Code documentation

> This section is a consolidated “transcript-style” technical documentation, extracted from the Bread Financial technical survey plus the two supporting architecture/component decks. fileciteturn0file0 fileciteturn0file1 fileciteturn0file2

### 1) Use case summary

- **Case code:** T9LF fileciteturn0file0  
- **Use case:** Knowledge management solution for contact center agents within a financial services organization. fileciteturn0file0  
- **Primary content:** General product knowledge and procedure documents stored as **HTML**. fileciteturn0file0  

### 2) Deployment & infrastructure

**Cloud / platform**
- Survey indicates multiple cloud options were considered, but the implemented deployment described is on **AWS**. fileciteturn0file0  
- **Deployment architecture:** Implemented as an application deployed on an **AWS EKS** cluster. fileciteturn0file0  

**Core services**
- **Compute / orchestration:** AWS EKS fileciteturn0file0  
- **Object storage / landing zone:** AWS S3 fileciteturn0file0  
- **Relational storage:** RDS Postgres fileciteturn0file0  
- **Vector store:** Redis Vector Search (used as vector database / vector indexing). fileciteturn0file0  
- **Caching:** Application caching is called out in the reference architecture; caching is also referenced as a platform capability. fileciteturn0file1 fileciteturn0file2  

**Scaling assumptions**
- Target concurrency: ~**2,000 concurrent users** (~**85 requests/minute**). fileciteturn0file0  
- Autoscaling: enabled via EKS. fileciteturn0file0  
- LLM throughput: ~**2M TPM** usage of LLMs (as a planning/expected consumption point). fileciteturn0file0  

### 3) GenAI approach & patterns

**Primary pattern**
- **Retrieval Augmented Generation (RAG)** is the backbone (retrieve from knowledge store; generate answers). fileciteturn0file0 fileciteturn0file1 fileciteturn0file2  

**Additional patterns referenced in materials**
- Chatbot/assistant experience for agents
- Classification (topic / intent identification)
- Guardrails and evaluation as first-class components (not afterthoughts) fileciteturn0file1 fileciteturn0file2  

**LLMs**
- The survey lists several possible providers and model families; implementation approach called out: **API via Azure OpenAI**. fileciteturn0file0  
- The broader component architecture is **provider-agnostic** through an AI gateway / broker pattern (supports cloud/SaaS/self-hosted models). fileciteturn0file2  

### 4) High-level architecture (functional)

The “example architecture” described in the deck organizes the solution into a few layers. fileciteturn0file1  

**A) Frontend (agent experience)**
- Agent UI for search + answer display
- Authentication
- Frontend datastore (for UI/UX needs) fileciteturn0file1  

**B) RAG / KM logic layer**
- Intent routing / topic classification
- Prompt template (“App Prompt”)
- Retriever
- Generator
- Vector search + ranking
- Application caching (to reduce latency / cost)
- Conversation/session handling (threads/history) fileciteturn0file1 fileciteturn0file2  

**C) Data ingestion layer**
- Extraction pipeline
- Parsing & chunking
- Vectorization
- Ingestion jobs/services to keep the index up to date fileciteturn0file1 fileciteturn0file2  

**D) Storage**
- Document storage (landing zone + documents store)
- Vector store (Redis Vector Search in the Bread Financial survey)
- LLM / app metadata store(s) fileciteturn0file0 fileciteturn0file1 fileciteturn0file2  

**E) AI layer / gateway**
- LLM broker + routing
- Prompt management
- Caching, fallback, retry policies
- Governance / traceability / cost tracking fileciteturn0file1 fileciteturn0file2  

### 5) Data ingestion & knowledge preparation

**Data types & sources**
- Knowledge content: “general product knowledge and procedure documents stored in HTML.” fileciteturn0file0  

**Ingestion capabilities (reusable component deck)**
- Real-time and batch ingestion from cloud storage (AWS S3 / Azure Blob / local file system sensors). fileciteturn0file2  
- Processing pipelines for common formats (PDF, Word, Text, HTML, etc.) and “difficult” extractions (embedded tables/images). fileciteturn0file2  
- Distributed processing (e.g., Celery workers) to reduce time-to-ingestion and handle volume. fileciteturn0file2  
- A predefined vector DB schema to preserve document metadata for downstream filtering and retrieval. fileciteturn0file2  

### 6) Retrieval & generation (RAG workflow)

The reusable components deck lays out a concrete RAG workflow. fileciteturn0file2  

- User query
- Query reformulation
- Topic classification (intent)
- Metadata filtering (including permissions)
- Vector DB retrieval
- Hybrid search (keyword + semantic)
- (Optional) re-ranking (noted as “coming soon”)
- LLM generation
- Output guardrails
- Response to the user fileciteturn0file2  

### 7) Safety, guardrails & security controls

**Security/guardrail microservice pattern**
- The KM deck describes a reusable **security layer deployed as a microservice** that can be reused across GenAI apps. fileciteturn0file1  

**Guardrails and controls (examples referenced)**
- Prompt guard
- Content moderation / content inspection
- PII data filtering / scrubbing (incl. “scrubbing and replacement” before sending requests to LLMs)
- Security logging / auditing
- Watermarking is referenced in the example architecture’s AI layer components fileciteturn0file1 fileciteturn0file2  

**InfoSec dimensions emphasized**
- Application security & compliance (API security, endpoint exposure, transport security, certs)
- Data management (encryption in transit/at rest, retention, privacy/training constraints, lineage)
- Identity & access management (SSO / Okta integration is explicitly called out)
- Resiliency + observability / manageability (monitoring, logs, performance) fileciteturn0file1 fileciteturn0file2  

### 8) Evaluation

A dedicated evaluation capability is positioned as a separate service/application. fileciteturn0file1 fileciteturn0file2  

- Experimentation UI to run tests against a ground-truth dataset
- Pre-defined evaluation metrics (with templates for new, use-case-specific metrics)
- Used to compare prompts, models, and retrieval strategies and measure output quality/consistency fileciteturn0file2  

### 9) Observability, monitoring, and tracing

From the technical survey: fileciteturn0file0  

- Monitoring/logging tools: **Dynatrace**, **Splunk**
- LLM tracing: **Langfuse** (LLM request/response tracing and analysis)

### 10) CI/CD and delivery mechanics

From the technical survey: fileciteturn0file0  

- CI/CD: **GitHub Actions**

From the KM deck (delivery mechanics, “how” the program shipped): fileciteturn0file1  

- Agile delivery in **two-week sprints**
- Sprint cadence: planning → daily stand-ups → review/demo → retrospective
- Explicit “migration to production” workstream: code approval, security scans, QA migration, production migration support

### 11) Integration footprint

- Survey states no integration with external tools/systems for this use case. fileciteturn0file0  

### 12) Code / reference implementation pointers

The survey references a reusable framework that informed the build. (Included here as-is.) fileciteturn0file0  

```text
https://github.com/Bain/aag-knowledge-management
https://special-couscous-kgl4zqq.pages.github.io/
```

---

## Insights, Learning & Anecdotes

### Why build (vs. buy) and what “extensible” meant in practice

- Bread Financial (referred to as “Payments Co” in supporting materials) chose a **fit-for-purpose build** given their Care Center tech stack, risk/security processes, and requirements—while designing the solution to be **extensible** to other customer operations (e.g., complaints) and eventually other business functions. fileciteturn0file1  
- A major “day 1” philosophy was to treat the project not as a one-off chatbot, but as a **platform starter kit**: ingestion, conversation/session management, RAG logic, safety/security, evaluation, and an AI gateway that can be reused on the next use case. fileciteturn0file2  

### What repeatedly mattered most for adoption

- The decks emphasize that **visible sponsorship + true product ownership** are decisive: frontline leaders and representatives need to feel the solution is being built *with them*, not imposed on them. fileciteturn0file1  
- Adoption tactics were framed as an operating system: small agent council, embedded change management from day one, “train the trainer,” and hands-on training designed around real “moments of truth” on the job. fileciteturn0file1  

### “Product mentality” over “project mentality”

A recurring theme: the fastest programs behave like product teams.

- Expect roadblocks; create a standing forum to escalate and resolve quickly.
- Avoid sequential/siloed decision-making (it creates delays).
- The “2‑in‑a‑box” model (Bain + client counterpart for key roles) supports shared ownership and faster decisions. fileciteturn0file1  

### Risk, compliance, and InfoSec: treat them as design partners

The materials describe a proactive posture: instead of waiting for later-stage approvals, bring second-line partners into design.

- Map end-to-end approvals early (cycle times matter).
- Add GenAI-specific risks (e.g., hallucination) into the risk taxonomy and tie them to controls + testing.
- Build repeatable documentation for initial and BAU regulatory updates.
- Use a structured InfoSec assessment mindset (data classification/flow, threat modeling, and DevSecOps scanning). fileciteturn0file1  

### Architecture choices that show “what teams learned”

Several architecture decisions reflect lessons from prior KM deployments:

- **Hybrid search + metadata filtering**: improves relevance and enforces document-level permissions. fileciteturn0file2  
- **Streaming responses**: reduces perceived latency for agents in live calls. fileciteturn0file2  
- **Central AI gateway**: makes model choice a configuration problem (routing, fallbacks, governance, traceability) rather than rewriting applications. fileciteturn0file2  
- **Dedicated evaluation service**: enables iterative improvement (prompts/models/retrieval) with measurable quality and consistency. fileciteturn0file2  

### A pragmatic delivery blueprint

The Care Center KM sprint plan and workstreams describe an “operators’ view” of shipping GenAI in an enterprise environment:

- Early: onboard developers, determine tech decisions, identify data sources, provision environments (P‑2), and align on feature requirements.
- Middle: build UI + ingestion + app logic; integrate; debug; create evaluation tooling; load test.
- Late: formalize risk/InfoSec requirements; complete security scans; migrate to QA; run UAT; refine; migrate to production with documented approvals. fileciteturn0file1  

---

## Appendix: Source materials used

- GenAI Use Case Technical Survey – Bread Financial (T9LF). fileciteturn0file0  
- Payments Co – GenAI Knowledge Management in Care Center (deck). fileciteturn0file1  
- Payments Co – Overview of GenAI Contact Center Knowledge Management Reusable Components (deck). fileciteturn0file2  
