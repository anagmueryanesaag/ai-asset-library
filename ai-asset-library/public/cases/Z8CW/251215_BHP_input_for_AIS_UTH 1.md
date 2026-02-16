---
title: "BHP (Escondida) Mine & Route Safety GenAI Monitoring Platform"
description: "An AI-powered safety monitoring and evaluation platform for BHP’s Escondida operations, focused on reducing incidents by detecting unsafe behaviors and non-compliance with safety protocols. The solution combines multi-source operational data (e.g., radio comms, GPS, fatigue/speed/proximity signals) with GenAI-based audio transcription and conversation evaluation to generate real-time alerts and management insights. Outputs are operationalized via dashboards and workflow tooling to drive corrective actions and measurable safety improvements."
contacts:
  - name: "Ana María Castillo Núñez"
    email: "Ana.Castillo@Bain.com"
  - name: "Trinidad Pizarro"
    email: "Trinidad.Pizarro@Bain.com"
  - name: "Mariapaz Salvatierra"
    email: "Mariapaz.Salvatierra@Bain.com"
---

## Overview

This application delivers **end-to-end safety intelligence** for mining **route and in-mine operations**, consolidating scattered safety controls into a single monitoring platform. It provides supervisors with a live view of safety controls and deviations, highlights hotspots, and recommends next steps—supported by Power BI dashboards for performance insights by shift, zone, and control.

### What it monitors

The platform integrates multiple safety controls and complementary data sources across a large fleet and user base (e.g., vehicles, operators, supervisors). Typical monitored signals and controls include proximity detection, speeding/signage compliance, fatigue and distraction indicators, and radio communication effectiveness—paired with GenAI analysis of radio audio.

### GenAI components for radio data

Four core GenAI steps are used to process radio communications:
1. **Whisper** for transcription of radio audio.
2. **GPT-4o** for threading/grouping incoming conversations.
3. **GPT-4o** for understanding context and classifying conversation type.
4. **GPT-4o** for evaluating safety protocol compliance within conversations.

Reported performance during development/piloting included: median cosine similarity ~93% and correct word rate ~72% for transcription; ~94% correctly grouped audios; ~87% classification accuracy; and ~83% precision for deviation detection in evaluation.

---

## Key contacts

- Ana María Castillo Núñez — Ana.Castillo@Bain.com  
- Trinidad Pizarro — Trinidad.Pizarro@Bain.com  
- Mariapaz Salvatierra — Mariapaz.Salvatierra@Bain.com  

---

## Code documentation

Below is the **full transcript** of the provided code documentation.

# Technical & AI Overview

Repository root: `/Users/64419/repos/aag-mining-safety`

This document explains the system end-to-end with focus on AI/ML/GenAI components. Statements are labelled **(Confirmed)** when directly evidenced in code/config, **(Inferred)** when reasonably derived from patterns or dependencies, and **Unknown / Needs manual confirmation** where the repository does not contain the information.

---

## 1. High-level summary

- What the app does:
  - Mine Behaviour Monitoring (MBM): ingestion pipelines, audio transcription, LLM-driven conversation splitting, classification and procedure evaluation, and consolidation for reporting. (Confirmed)

- AI/ML/GenAI presence:
  - Yes. Primary AI usage is OpenAI / Azure OpenAI (Whisper for audio transcription, GPT-4o family for splitting/classification/evaluation). Embeddings appear in test utilities only. There is no evidence of a vector DB or RAG pipeline in this repository. (Confirmed)

- Key stack and architecture:
  - Python 3.12, `sqlmodel`/SQLAlchemy, Azure SDKs, `openai` Python SDK, `tenacity` for retries. (Confirmed)
  - Infra: Azure Functions (integrations/), Azure ML pipelines (pipelines/), Docker image for pipeline runtime (`Dockerfile.pipeline`), `docker compose` for local dev (compose.yml). (Confirmed)

---

## 2. Components & Modules (summary)

| Component / Module | Path(s) | Responsibility / Notes (Confirmed / Inferred) |
|---|---:|---|
| Core package | `bhp_hse/` | Main package for data models, ETL, audio processing, logger, DB utilities. (Confirmed)
| Audio LLM flows | `bhp_hse/audio/` | All OpenAI/Azure interactions: client wrapper, splitting, classification, evaluation, prompts and schemas. (Confirmed)
| Audio pipeline runner | `pipelines/audio_processing/` | Pipeline entry and components (`components/process_audio.py`) which orchestrate batch processing using the audio logic. (Confirmed)
| Azure Speech helpers | `extras/azure_speech/` | Azure Speech Batch client, Transformers to Whisper-like format, orchestration helpers and tests. (Confirmed)
| Ingest integrations | `integrations/` | Azure Functions to load raw data (ETL). (Confirmed)
| Tests & notebooks | `tests/`, `notebooks/` | Unit/async tests and experimentation notebooks. (Confirmed)
| Infra/config | `pyproject.toml`, `compose.yml`, `Dockerfile.pipeline` | Dependencies, local compose, and pipeline container base. (Confirmed)

(If you want, I can expand the table to include all major files.)

---

## 3. Architecture diagram (Mermaid)

```mermaid
flowchart LR
  AudioSources[(Audio recordings)] -->|upload| Blob[Azure Blob Storage / Azurite]
  Blob --> ETL_Aud[Azure Function\n(ETL Audios)]
  ETL_Aud --> RawStore[Raw Data Store / Blob]
  RawStore --> AML_Pipeline[Azure ML Pipeline\n(audio_processing)]
  AML_Pipeline --> ProcessAudioComp[process_audio.py]
  ProcessAudioComp -->|get client| KeyVault[Azure Key Vault]
  ProcessAudioComp -->|call| OpenAI_API[OpenAI / Azure OpenAI\n(Whisper + gpt-4o)]
  OpenAI_API -->|whisper| Transcription[Transcription (verbose json)]
  OpenAI_API -->|gpt-4o| SplitClassEval[Splitting / Classification / Evaluation\n(bhp_hse/audio/*)]
  SplitClassEval --> DB[(SQL Server / Snowflake)]
  SplitClassEval --> ProcessedBlob[Processed Blob Storage]
  DB -->|consolidate| Consolidation[Consolidation Pipeline]
  Consolidation --> Transform[Transform (Azure Functions) -> PowerBI]
  ExtrasAzureSpeech[extras/azure_speech: Azure Speech Batch] --> OpenAI_API
  note right of OpenAI_API: No vector DB detected\n(no Pinecone/Qdrant/FAISS code)
```

Notes: KeyVault/KeyVault-secrets usage is present in pipeline code. Local compose spins up SQL Server and Azurite for dev. (Confirmed)

---

## 4. Core feature flows / critical paths

Feature: End-to-end audio processing and evaluation

- What it does:
  - Ingests audio files, transcribes them (Whisper or Azure Speech Batch), groups utterances into conversations, classifies interaction type and evaluates procedural correctness using LLM prompts, then stores results for consolidation and BI. (Confirmed)

- Entry points:
  - Azure Functions ETL (ingestion) — under `integrations/`. (Confirmed)
  - Azure ML pipeline runner: `pipelines/audio_processing/components/process_audio.py`. (Confirmed)

- Flow & modules involved (representative files & line ranges):
  - `pipelines/audio_processing/components/process_audio.py:1-220` — pipeline entry that builds/get OpenAI client and orchestrates batch processing. (Confirmed)
  - `bhp_hse/audio/openai_services.py:1-200` — OpenAI/Azure wrapper: `get_client()`, `transcribe_using_whisper()`, `completion()` helper with `tenacity` retries. (Confirmed)
  - `bhp_hse/audio/pipeline.py` — orchestrates split/classify/evaluate per batch. (Confirmed)
  - `bhp_hse/audio/splitting.py:1-400` — prompt-based GPT splitting flow with JSON validation. (Confirmed)
  - `bhp_hse/audio/classification.py:1-300` — classification using GPT (two-step) and response validation. (Confirmed)
  - `bhp_hse/audio/evaluate.py:1-400` — two-step evaluation strategy using GPT-4o and Pydantic response models; includes fallback behavior. (Confirmed)
  - `extras/azure_speech/speech_client.py:1-250` and `extras/azure_speech/transcription.py:1-200` — Azure Speech batch integration & conversion to Whisper-like format, used as an alternative to OpenAI Whisper. (Confirmed)

- AI involvement:
  - Transcription: `whisper-1` (OpenAI) or Azure Speech Batch. (Confirmed)
  - Conversation splitting: `gpt-4o` family, JSON responses validated by pydantic. (Confirmed)
  - Classification & evaluation: `gpt-4o` family; prompts in `bhp_hse/audio/prompts/`. (Confirmed)
  - Retries/timeouts: `tenacity` and environment-configurable `OPENAI_TIMEOUT`. (Confirmed)

- External dependencies:
  - OpenAI / Azure OpenAI SDKs (`openai` dependency in `pyproject.toml`) — (Confirmed)
  - Azure Blob Storage, Azure Speech (batch), Azure Key Vault — (Confirmed)
  - Relational DBs (SQL Server locally, Snowflake dependency present) — (Confirmed / Inferred)

- Edge cases & error handling:
  - Tenacity retries around OpenAI calls. (Confirmed)
  - `process_response()` in `evaluate.py` contains a fallback that produces a dummy all-correct evaluation when response parsing fails. (Confirmed)
  - Logging is pervasive (loguru); some logs include message content — risk of leaking PII if not redacted. (Confirmed & Inferred risk)

---

## 5. Data model & persistence

- Data models & schemas:
  - `sqlmodel` and `pydantic` models are used extensively across `bhp_hse/` for DB entities and LLM response models. (Confirmed)

- Storage technologies:
  - Azure Blob Storage for audio and processed blobs (compose.yml uses Azurite for local dev). (Confirmed)
  - Relational DB (SQL Server used in compose.yml; Snowflake libraries present) — production mapping unknown. (Confirmed / Inferred)
  - No vector DB, no RAG index code found. (Confirmed)

- Data types & sensitivity:
  - Audio (binary), transcriptions (text with speaker segments and words), structured evaluation records. (Confirmed)
  - Audio/transcripts can contain PII (operator IDs, voice) — treat as sensitive data. (Inferred)

- ETL & pipelines:
  - Ingest via Azure Functions; processing via Azure ML pipelines and custom pipeline scripts. Consolidation and transform pipelines persist results for reporting. (Confirmed)

---

## 6. AI / ML / GenAI capabilities (detailed)

- Patterns present:
  - LLM API integration (OpenAI/Azure OpenAI) for several operations (transcription, splitting, classification, evaluation). (Confirmed)
  - Multimodal pipeline: audio -> text -> LLM. (Confirmed)
  - Structured LLM outputs with Pydantic validation and JSON response expectations. (Confirmed)
  - Embeddings are used in tests/utilities for cosine similarity (`text-embedding-ada-002`) but there is no production RAG layer. (Confirmed)

- Not present in repo:
  - No training/fine-tuning code (LoRA/PEFT/RLHF). (Confirmed)
  - No LangChain/LlamaIndex/Haystack-style orchestration libraries. The project uses a custom orchestration pattern. (Confirmed)

---

## 7. Models, Providers & Orchestration

- Providers & models (evidence in code):
  - OpenAI SDK & Azure OpenAI usage: `AsyncOpenAI`, `AsyncAzureOpenAI` imports across `bhp_hse/audio/*` and `extras/azure_speech/*`. (Confirmed)
  - Model names: `gpt-4o-2024-08-06`, `gpt-4o-2024-10-15`, `gpt-4o` (assertions), `whisper-1` (or `whisper` on Azure), and `text-embedding-ada-002` in tests. (Confirmed)
  - Typical settings: temperature often set to `0.0` for deterministic outputs; response formats requested as JSON objects for structured parsing. (Confirmed)

- Credentials & secrets:
  - Environment variables (`OPENAI_API_KEY`, `AZURE_ENDPOINT`, `AZURE_API_VERSION`, `USE_AZURE`) and optional Key Vault (`AZURE_KEYVAULT_NAME`) retrieval in pipeline code. (Confirmed)

- Orchestration & prompt mgmt:
  - Custom orchestration with strategy classes / Protocols for splitting/classification/evaluation (see `bhp_hse/audio/*`), and prompts stored in `bhp_hse/audio/prompts/` (examples: `split_audio_batch.py`). Some prompts appear versioned by filename (e.g., `SPLIT_PROMPT_V20241125`). (Confirmed)

- RAG / retrieval:
  - No vector store or indexing pipeline detected (searches for Pinecone/Qdrant/FAISS/Chroma returned no relevant results). (Confirmed)

---

## 8. Configuration, deployment & infrastructure

- Configuration:
  - Environment variables and Azure Key Vault are used. `pyproject.toml` lists dependencies (including `openai`, `azure-*`, `tenacity`). `compose.yml` defines local dev env vars and services. (Confirmed)

- Deployment & infra (in-repo evidence):
  - Azure Functions (integrations/), Azure ML pipelines (pipelines/), `Dockerfile.pipeline` referencing AzureML base image, and local `docker compose` for dev (compose.yml). (Confirmed)
  - No repository-level IaC (Terraform/ARM/Helm) or explicit production k8s manifests found — production topology is Unknown and needs confirmation. (Unknown)

- Integrations:
  - Azure services (Blob, Key Vault, Speech), SQL Server / Snowflake clients, and OpenAI/Azure OpenAI APIs. (Confirmed)

---

## 9. Data, governance & safety

- Types & sources of data:
  - Audio recordings, transcriptions, interaction/evaluation records, and consolidated tables for reporting. (Confirmed)

- Data governance & safety practices observed:
  - Pydantic validation to enforce expected structured LLM responses. (Confirmed)
  - Tenacity + configurable timeouts used for retries/timeouts. (Confirmed)
  - No explicit redaction before logging/transmission visible in code; logs sometimes include transcription content — this is a potential PII exposure risk. (Inferred Risk)
  - No moderation / safety API calls observed. (Confirmed)

---

## 10. Cross-cutting concerns

- Logging & observability:
  - `loguru` used for logging. No explicit traces (OpenTelemetry), metrics, or cost/latency dashboards found in this repo. (Confirmed)

- Testing:
  - Tests exist under `tests/` (including audio / OpenAI client tests). `pyproject.toml` includes pytest config. I did not run tests in this step; I can run them if you want. (Confirmed / Not executed)

- Performance, scaling & fault tolerance:
  - The system uses async OpenAI clients and configurable concurrency limits (e.g., `CONCURRENT_LIMIT` in `process_audio.py`). Tenacity retries provide some resilience to transient errors. (Confirmed)

---

## 11. Limitations & open questions

- Production topology (how components are deployed, k8s vs serverless vs managed Azure) — **Unknown**. Repo includes pipeline dockerfile and Azure artifacts but no IaC. (Unknown)
- CI/CD pipeline definitions (workflows) — **Unknown** (no `.github/workflows` or similar found in repo root). (Unknown)
- Data retention / PII policy and redaction practices — **Unknown** (no policy docs in repo). (Unknown)
- Are embeddings / vector search planned outside this repo? The repo lacks a RAG implementation — confirm if this is intentional. (Confirmed absence; rationale Unknown)
- Cost-control / quota enforcement for OpenAI usage — **Unknown**. (Unknown)

---

## 12. Representative files & locations (quick pointers)

- OpenAI client wrapper and helpers: `bhp_hse/audio/openai_services.py` (approx. lines 1-200). (Confirmed)
- Conversation splitting logic & prompt: `bhp_hse/audio/splitting.py` and `bhp_hse/audio/prompts/split_audio_batch.py` (Confirmed)
- Classification: `bhp_hse/audio/classification.py` (approx. lines 1-300). (Confirmed)
- Two-step evaluation: `bhp_hse/audio/evaluate.py` (approx. lines 1-400). (Confirmed)
- Pipeline entry: `pipelines/audio_processing/components/process_audio.py` (approx. lines 1-220). (Confirmed)
- Azure Speech batch client & transcription: `extras/azure_speech/speech_client.py`, `extras/azure_speech/transcription.py`, `extras/azure_speech/pipeline.py`. (Confirmed)
- Embeddings example (test): `extras/test/transcription.py` (embedding calls around lines ~200-260). (Confirmed)
- Configuration: `pyproject.toml`, `compose.yml`, `Dockerfile.pipeline`. (Confirmed)

---

## 13. Quick recommendations (prioritized)

1. Add or link production infra manifests / CI workflows (IaC or deployment docs). (High)
2. Add explicit data governance: redaction before logging or storing transcripts, retention and access-control notes. (High)
3. Add LLM observability: per-call latency/cost logging and prompt/response tracing with opt-in data protections. (Medium)
4. Add tests that simulate LLM failures (timeouts, partial JSON, rate limit) and assert safe fallback behavior to avoid silent bad writes. (Medium)
5. If RAG is ever required, add a dedicated vector index and ingestion pipeline (pgvector, Qdrant, or managed alternative). (Low)

---

## 14. Next actions I can take for you

- I created this overview file in the repository root so you can share it. If you want I can:
  - Run the test subset (for example `tests/audio/test_openai_services.py`) and report results. (requires runtime/test execution) 
  - Search deeper for infra/CI artifacts or add a diagram image. 
  - Expand the Components table into a full file-by-file map.

---

### Document provenance & certainty

- This overview was produced by reading the repository files and configs. All `Confirmed` labels indicate direct evidence (imports, usage, file presence). `Inferred` labels are used where behavior/config is implied by code patterns or dependencies but not explicitly documented in the repo. Anything labeled `Unknown` needs maintainers to confirm.

---

_End of document._

---

## Insights, Learning & Anecdotes

This section captures the “how it really went” details from interviews and working materials—what made the BHP/Escondida safety use case succeed (and what was harder than expected).

### 1) The work wasn’t just “build a model”—it was a frontline monitoring system

The case centered on building an AI-based monitoring and evaluation system that could **transcribe operator communications** and **evaluate them against safety/behavior KPIs**, then operationalize that into a monitoring/change system that directly impacted frontline operators.

A key implication: once you are influencing day-to-day operator behavior (not just internal analytics), **adoption, communications, and governance become core product requirements**, not “nice-to-haves.”

### 2) Stakeholders were a multi-entity maze (and Bain often sat “in the middle”)

A major organizational complexity was effectively dealing with “two companies” inside the client setup:
- the **asset** (Escondida, the mine operation), and  
- **BHP central technology** (where technology teams sit).

These groups didn’t always align, and there were multiple vendors and stakeholder layers (business, tech, external DS vendors, and worker representation structures). The practical lesson was that you spend real time on alignment and diplomacy—making progress without appearing to take sides.

### 3) Productionization was underestimated—paperwork and approvals were “phase 2”

A repeated lesson: the team initially assumed development would be a few months, but **production readiness and formal approvals** took a comparable amount of time afterward, driven by documentation, validation, and governance requirements.

This matches what we see in the technical documentation too: the repo shows strong engineering patterns for pipelines, but explicit production topology / IaC / CI/CD artifacts were not evident in-repo, reinforcing how much “outside-the-code” work matters in enterprise deployment.

### 4) Change management in a unionized environment was its own workstream

Because the system monitored operator behavior, change impact was significant. In practice, that meant aligning communications and rollout steps with **legal, HR, labor relations, and union leadership**, down to details like messaging and signage for vehicles—positioning the system as “safety enablement” rather than surveillance.

**Takeaway for future teams:** treat union and frontline communications as a first-class delivery stream, not a last-mile comms task.

### 5) The hardest “technical” bottleneck was the golden dataset

Interestingly, the interview notes emphasize that the “generic” transcription + evaluation pipeline worked well, but building a reliable **golden dataset** was the hardest part:
- Real, noisy Spanish mine audio is challenging even for humans.
- The team had to manually listen, transcribe, and label/evaluate hours of data.
- Midway, they built an internal tool to speed up labeling, but it remained effort-heavy.

This connects directly to the product metrics cited in the presentation (transcription quality, grouping accuracy, classification accuracy, deviation detection precision), which rely on having that labeled baseline.

### 6) A reusable “pattern” (and emerging IP): configurable behavior monitoring with GenAI

Beyond mining, the team described the reusable building blocks as:
- A generic monitoring & behavior evaluation platform (moving toward industry-agnostic configurability).
- A human-in-the-loop labeling/evaluation tool to create golden datasets faster.
- A repeatable architecture: **audio → transcription (Whisper) → LLM agents (GPT) → structured evaluation → operational dashboards/workflows**.

The code documentation also supports the “repeatable architecture” claim: it highlights no vector DB / no RAG in this repo, and instead a structured-prompt + validation approach for split/classify/evaluate.

### 7) What helped “sell” it internally: a scrappy demo with real client data

One effective tactic mentioned was creating an early proof-of-concept demo using the client’s real audio:
- Transcribe in seconds.
- Provide a basic evaluation in a simple interface.
- Create the “wow” moment and align expectations early.

### 8) Practical recommendations the team would enforce next time

From the interview, four “non-negotiables” emerged:
- Secure a **strong client-side product owner** embedded in operations (not just a sponsor).
- Budget and staff a dedicated **productionization** stream (docs, security/compliance, approvals).
- Treat **change management and union alignment** as a core workstream from day one.
- Plan explicitly for the **golden dataset** as the true bottleneck (people, tooling, process).
