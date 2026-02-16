---
title: "i-Med AI Typist Platform (Radiology Report Generation)"
description: "i-Med’s AI Typist Platform automates radiology report drafting by converting dictated audio into highly structured reports while preserving each radiologist’s preferred format and terminology. The solution integrates into the Radiology Information System workflow using HL7/API and RPA-style last-mile integrations, and it uses managed AWS AI services for transcription and generative report generation. It is designed to reduce report turnaround time and typist workload while maintaining high accuracy and clinical trust."
contacts:
  - name: "Nick Therkelsen"
    email: "TBD"
    role: "Expert Partner"
  - name: "Michael Blake"
    email: "TBD"
    role: "Expert Partner"
  - name: "John Lowe"
    email: "TBD"
    role: "Expert Associate Partner"
  - name: "Vikram Kapur"
    email: "TBD"
    role: "Partner"
  - name: "James Viles"
    email: "TBD"
    role: "Partner"
  - name: "Anthony Wicht"
    email: "TBD"
    role: "Partner"
  - name: "Ro Mathew"
    email: "TBD"
    role: "Expert Senior Manager"
  - name: "Adam Sommerfeld"
    email: "TBD"
    role: "Expert Manager, Product Management"
  - name: "James McKeone"
    email: "TBD"
    role: "Expert Manager, Data Science"
---

## Code documentation

Below is the full transcript of the provided code / technical documentation.

**Technical & AI Overview — Typist Platform**

**Evidence base**: This overview is grounded in the uploaded design and solution documents, primarily:

*20240910 Typist Solution Documentation*

*Typist – Technical **High Level** Design*

*Typist – Technical Scoping Document*

*Platform – High Level Design*

*Future State – Typist* / *AWS Typist Workflow* diagrams

Where statements rely on architectural patterns or naming rather than explicit statements, they are marked **(Inferred)**. Where the documents are explicit, they are marked **(Confirmed)**.


**1. High-level Summary**

**What the system does**

**Typist** is an **AWS-native, AI-enabled transcription and documentation platform** designed to:

Ingest audio (e.g., meetings, calls, dictated notes)

Transcribe speech to text

Apply **Generative AI** to structure, summarize, and enrich transcripts

Produce downstream artefacts (clinical / operational notes, summaries, structured documents)

(**Confirmed** from Solution Documentation & AWS Workflow PDFs)

**AI / ML / GenAI involvement**

The platform **does include significant AI capabilities**, specifically:

**Speech-to-text ML inference** (AWS Transcribe)

**LLM-based Generative AI** for summarization, formatting, and document generation (AWS Bedrock with Anthropic Claude models)

**Retrieval-Augmented Generation (RAG)** patterns for contextual enrichment (**lightweight / domain-scoped**, not a full enterprise KB)

(**Confirmed**: Bedrock, Claude, Transcribe explicitly referenced)

**Key high-level properties**

**Architecture style**: Event-driven, serverless-oriented AWS architecture (**Confirmed**)

**Deployment**: AWS managed services (Lambda, Step Functions, S3, API Gateway) (**Confirmed**)

**AI strategy**: Managed foundation models via AWS Bedrock (no self-hosted models) (**Confirmed**)


**2. Components & Modules**

| Component / Module | Path / Artifact | Responsibility |
| --- | --- | --- |
| Client Applications | Not in repo (external) | Upload audio, trigger transcription workflows (Inferred) |
| API Layer | API Gateway (design docs) | Entry point for uploads, job status, results (Confirmed) |
| Orchestration | AWS Step Functions | Coordinates transcription → AI enrichment → output generation (Confirmed) |
| Transcription Engine | AWS Transcribe | Speech-to-text inference (Confirmed) |
| AI Generation Layer | AWS Bedrock (Claude) | Summarization, structuring, document generation (Confirmed) |
| Storage – Raw | Amazon S3 | Audio files, raw transcripts (Confirmed) |
| Storage – Processed | Amazon S3 / DynamoDB | AI-generated outputs & metadata (Confirmed) |
| Security / IAM | AWS IAM, KMS | Access control, encryption (Confirmed) |
| Monitoring | CloudWatch | Logs, metrics, workflow tracking (Confirmed) |


**3. Architecture Diagram**

flowchart LR

User -->|Upload Audio| API[API Gateway]

API --> SF[Step Functions Workflow]


SF --> TR[AWS Transcribe]

TR --> S3Raw[(S3 Raw Transcripts)]


S3Raw --> AI[Bedrock - Claude LLM]

AI --> S3Out[(S3 Processed Outputs)]


S3Out --> API

API --> User


SF --> CW[CloudWatch Logs & Metrics]

**Highlights**

AI services are **external managed dependencies** (Bedrock, Transcribe)

No persistent model hosting inside the platform

Strong separation between orchestration and AI execution


**4. Core Feature Flows / Critical Paths**

**Feature 1: Audio Transcription & AI-Generated Notes**

**What it does**
Transforms uploaded audio into structured, human-readable documentation.

**Entry points**

REST API call via API Gateway (**Confirmed**)

**Flow**

Audio uploaded → stored in S3

Step Functions workflow initiated

AWS Transcribe generates raw transcript

Transcript passed to Bedrock LLM

LLM applies domain-specific prompts (summarization, formatting)

Output stored and returned

(**Confirmed via AWS Typist Workflow & Solution Docs**)

**AI involvement**

ML inference: Speech recognition

GenAI: Claude LLM for text transformation

**External dependencies**

AWS Transcribe

AWS Bedrock (Claude)

**Edge cases**

Transcription confidence issues

LLM output variability

Retry and failure states handled by Step Functions (**Confirmed**)


**5. Data Model & Persistence**

**Storage technologies**

**Amazon S3**: Audio files, transcripts, generated documents (**Confirmed**)

**DynamoDB (likely)**: Job state, metadata (**Inferred**, referenced indirectly)

**Data characteristics**

Unstructured audio

Semi-structured text (transcripts)

Structured AI outputs (JSON / formatted text)

**Performance considerations**

S3-based pipelines optimize for throughput, not low-latency conversational UX

Batch-style AI invocation favored over streaming (**Confirmed**)


**6. AI / ML / GenAI Capabilities**

**Solution patterns detected**

✅ Standard ML inference (speech-to-text)

✅ LLM / Generative AI

✅ Document summarization & transformation

⚠️ RAG (limited, contextual prompts rather than large vector KB)

**Modalities**

Audio → Text

Text → Text

**Where AI is invoked**

Post-transcription enrichment stage

No AI in request validation or security layers (**Confirmed**)


**7. Models, Providers & Orchestration**

**Model providers**

**AWS Transcribe** — speech recognition (**Confirmed**)

**AWS Bedrock – Anthropic Claude** — generative text (**Confirmed**)

**Model configuration**

Prompts defined at workflow stage (**Confirmed**)

Temperature / max tokens not explicitly documented (**Unknown**)

**Orchestration**

**AWS Step Functions** act as the AI workflow engine

No LangChain / LlamaIndex / custom agent framework detected (**Confirmed absence**)


**8. Configuration, Deployment & Infrastructure**

**Configuration**

Environment variables for service ARNs, bucket names (**Confirmed**)

Secrets via AWS-managed IAM & KMS (**Confirmed**)

**Deployment architecture**

AWS-native, serverless-first

Strong reliance on managed AI services

No Kubernetes or VM-based inference (**Confirmed**)

**Integrations**

No third-party SaaS beyond AWS ecosystem detected (**Confirmed**)


**9. Data, Governance & Safety**

**Data sensitivity**

Likely includes **PII and potentially sensitive operational/clinical data** (**Inferred Risk**)

**Governance controls**

IAM-based access control

Encryption at rest (S3, KMS)

No explicit prompt redaction or PII masking logic described (**Inferred Gap**)

**AI safety**

No explicit prompt-injection defenses documented

No moderation or content filtering layer described
(**Inferred Risk**)


**10. Cross-cutting Concerns**

**Logging & observability**

CloudWatch logs for workflows and Lambdas (**Confirmed**)

No dedicated LLM observability tooling (e.g., prompt tracing dashboards) (**Confirmed absence**)

**Testing**

UAT documentation present

Automated AI evaluation (golden sets, RAG evals) **not documented** (**Unknown**)

**Performance & scalability**

Horizontally scalable via AWS managed services

Cost scales with transcription minutes and LLM tokens (**Confirmed**)


**11. Limitations & Open Questions**

| Topic | Status | Notes |
| --- | --- | --- |
| Prompt versions & governance | Unknown | No versioning strategy documented |
| AI quality evaluation | Unknown | No metrics or eval pipelines described |
| Human-in-the-loop review | Unknown | Not described in workflows |
| Vector DB usage | Absent / Minimal | RAG appears prompt-based, not embedding-based |
| Fine-tuning | Absent | No custom model training indicated |
| Production SLAs | Unknown | Not defined in docs |


**Final Assessment**

**Typist** is a **well-architected, AWS-native AI application** that:

Leverages **managed AI services** effectively

Avoids operational complexity of self-hosted models

Uses **workflow orchestration instead of agent frameworks**

Key risks and future improvement areas center on:

AI governance (prompt versioning, evals, safety)

Observability into LLM behavior

Explicit handling of sensitive data in prompts and outputs

If you want, next steps I can:

Produce an **AI risk & controls matrix**

Translate this into an **ARB / architecture review narrative**

Create a **developer onboarding explainer**

Map this to **enterprise GenAI reference architectures**

## Insights, Learning & Anecdotes

### Why this mattered
- The client operated a large radiology footprint (250+ clinics) and relied heavily on human typists for a significant share of radiologists’ reporting workflow, with report turnaround times that could extend to hours or days and meaningful labor cost pressure (including outsourced transcription).
- GenAI delivery was positioned as a strategic capability and proof-point (including for “exit” narrative), making real-world deployment and adoption as important as model performance.

### The hard part wasn’t “just transcription”
A recurring theme in stakeholder feedback was that radiology reporting is an accuracy- and trust-critical product. One quote captured it: **“As a radiologist, my reports are my brand… error-free.”** The challenge was not only word accuracy, but:
- **Personalized structure and terminology** by radiologist and modality.
- **Workflow compatibility** (minimal disruption to RIS-based dictation, typing, and review).
- **Trust mechanics**: typists don’t just type—they *flag uncertainties* and implicitly communicate confidence.

### A key learning: unflagged errors are more dangerous than visible errors
Even with very high word-level accuracy, clinical risk concentrates in rare but subtle mistakes (e.g., numeric values or similar-sounding medical terms). Radiologists often review reports in batches (end of day / next morning) and may not recall specifics of a dictation, increasing the chance that “looks plausible” errors slip through.

This led to a strong emphasis on **error flagging and assessment**—not only generating text, but explicitly identifying “likely wrong” regions (especially numeric/medical terms) so the review workflow remains safe and efficient.

### Architecture and integration lessons from a messy real environment
The solution had to operate inside a complex, vendor-heavy stack with uneven environments (dev/test/prod mismatches) and limited automation. The delivery team encountered:
- Source control used without end-to-end CI/CD, plus a fragmented toolchain (separate systems for CI, tickets, and infrastructure).
- Limited ability to run “plan” style checks before merging, limited developer access to logs/audit trails, and vendor releases changing behavior late in the run-up to deployment.
- Network/DNS constraints that required pragmatic, sometimes static, configuration approaches.

**Mitigation pattern:** decouple “report generation” from “file movement” and last-mile RIS integration. This reduced blast radius, enabled more iterative AI improvements, and made it easier to swap components later.

### Design choices that improved quality (and adoption)
1) **Hybrid orchestration:** event-driven workflow with clear states (triage → transcribe → generate → assess → store/return), rather than a monolithic service.
2) **Medical-grade transcription + customization:** AWS Transcribe Medical with **custom vocabulary** to better handle domain terms.
3) **LLM report generation with guardrails:** Claude (via Amazon Bedrock) used for report drafting *and* for review/assessment prompts.
4) **RAG-lite using prior reports:** retrieval of a small number of relevant historic reports (e.g., by doctor + modality + similarity cues) to anchor structure and reduce formatting drift.
5) **Explicit triage:** empirical + LLM-based checks for audio quality and feasibility before attempting straight-through processing.

### “One workflow” wasn’t realistic: three operational lanes
To make adoption practical, the end-state supported three distinct workflows:
- **Straight-through processing (~20% target):** high audio quality / short reports, suitable for radiologist sign-off with minimal edits.
- **Typist-in-the-loop (~60% target):** AI drafts the report and a typist uplifts it to required standards (faster than typing from scratch).
- **Typist-only (~20% target):** out-of-scope or template-heavy cases that remain manual.

This framing helped align stakeholders on what “good” looks like, avoided overpromising, and provided a safe path to scale.

### Pilot outcomes and what they taught the team
Pilot feedback indicated meaningful productivity and satisfaction gains without forcing abrupt workflow change:
- Typists reported large speedups using AI drafts as a starting point (often described as **~50% reduction** in time to uplift vs. typing from scratch, with some cases faster as familiarity grew).
- Radiologists found reports acceptable in pilot testing, and in some cases even “raw AI” outputs were sufficient—though confidence signaling and error flagging remained central to trust.
- The deployment narrative emphasized both patient impact (faster turnaround reduces anxiety) and operational value (material savings potential and scalability).

### Change management: staged rollout beats big-bang
The rollout approach recognized cultural resistance in clinical workflows:
- Start with a “listener” role (typist trained to make only minor corrections) for high-quality dictations.
- Disguise initial deployments as case studies where helpful, to reduce bias and overreaction to early imperfections.
- Accept that a subset of highly specific radiologists may never adopt AI-assisted reporting.

### Practical takeaways for future builds
- **Optimize for trust signals, not only accuracy.** Confidence/flagging and review ergonomics can matter more than marginal WER gains.
- **Treat integration as a first-class product.** HL7/RPA/API “last mile” determines whether the AI ever reaches users.
- **Design for swapability.** Keep transcription and generation layers modular to allow future model upgrades (including potential self-hosted alternatives).
- **Measure what users feel.** Time-to-uplift, number of flags, and correction patterns are better leading indicators than generic NLP metrics.
