---
title: "PLDT Kayana Data & AI Platform and DigiCo Digital Services Roadmap"
description: "Bain supported PLDT in defining and scaling its digital services entity ("DigiCo") and the underlying data-and-AI platform initiative ("Kayana"). The work set a five-year business roadmap and revenue/valuation ambition while enabling early product commercialization and GenAI/ML proof-of-concepts on an AWS-based data ecosystem."
contacts:
  - name: "John Zheng"
    email: "john.zheng@bain.com"
---

## Summary

PLDT launched a new digital business unit (“DigiCo”) to incubate and scale fintech and digital platform ventures beyond traditional telecom services, leveraging proprietary assets across the broader group (telco, utilities, fintech, etc.).   
In parallel, a group-wide digital initiative (“Kayana”) focused on integrating customer data that had been siloed across subsidiaries into a unified ecosystem to enable new data and AI products. 

### What Bain helped deliver

- **Five-year ambition and equity narrative:** Defined an aspiration to grow revenues ~7x and leadership alignment on ~10x EV uplift ambition, supported by market sizing, benchmarking, and analog-based narrative building.   
- **Product portfolio strategy:** Built business cases and prioritized bets across fintech, data products, and GenAI (e.g., credit scoring, B2B payments, digital marketing / lead gen use cases).   
- **Commercialization and partnerships:** Identified priority partners and advanced term sheets/commercial structures for strategic partnerships (credit scoring, B2B payments).   
- **Platform-enabled experimentation:** Established/used an AWS-hosted data lake platform (built with partners) and ran multiple traditional ML /GenAI POCs—e.g., payment-confirmation GenAI automation connected to backend systems to streamline customer support. 

---

## Code documentation

> **Note:** The materials provided describe the technical build and implementation approach at a practical level, but do not include full repository listings, specific service configurations, or code snippets. Where specifics were not provided, this documentation uses **TBD** placeholders.

### 1) System purpose and boundaries

**Primary objective:** Enable cross-vertical data sharing (subject to customer consent and governance) and accelerate the delivery of data science and GenAI use cases that monetize group assets and improve operational performance. 

**Key scope areas**
- **Data integration layer:** Consolidate previously siloed customer and operational data from multiple subsidiaries into a single ecosystem (“Kayana”). 
- **Analytics/ML experimentation:** Run data science experiments and ML-driven products (segmentation, acquisition, campaign optimization, mapping). 
- **GenAI enablement:** Prototype GenAI workflows that can interact with backend systems to automate customer-service and operational tasks (e.g., payment-confirmation POC). 
- **Commercial productization:** Transition proven use cases to scaled offerings, including lead-generation products and other monetizable data products. 

### 2) High-level architecture (as implemented/operated)

**Hosting / cloud**
- Runs on **AWS**. The physical build of the platform was delivered by implementation partners (e.g., Accenture and a local vendor), with internal teams building ML use cases on top. 

**Reference architecture (conceptual)**
1. **Source systems (multi-subsidiary):**
   - Customer, merchant, payments, and other operational datasets across group companies (varied maturity and data quality). 
2. **Ingestion + standardization:**
   - Pipelines to ingest data into the lake, apply mapping/standardization, and reconcile identifiers across subsidiaries (supported by “data mapping” use cases). 
   - *Implementation detail:* AWS service choices not specified (**TBD**; common patterns would include managed ETL/ELT, object storage, and cataloging).
3. **Unified data lake / lakehouse layer (“Kayana ecosystem”):**
   - Centralized storage + governance to make cross-vertical analytics feasible while respecting consent. 
4. **Analytics + ML workspace:**
   - Data science work executed largely as **POC-level Jupyter notebooks** (limited general reusability, but valuable as reference for similar problems). 
5. **GenAI application layer:**
   - GenAI POCs that connect to backend systems and customer-service workflows (e.g., payment confirmation). 
6. **Activation channels:**
   - Campaign tooling, merchant acquisition flows, payments journeys, and support operations where models/GenAI outputs are applied (e.g., conversion uplift, cycle-time reduction). 

### 3) Core data/AI use cases (technical notes)

#### A) ML-based customer acquisition and conversion optimization
**Goal:** Improve merchant conversion and digital payment conversion using ML-driven targeting and optimization.  
**Reported outcomes:** 2–3x merchant conversion uplift; 10x improvement in digital payment conversions. 

**Typical workflow**
- Feature creation from cross-vertical customer/merchant signals.
- Segmentation / propensity scoring.
- Campaign optimization loops (model → targeting → results capture → retrain).

**Artifacts**
- Jupyter notebooks for modeling and evaluation.   
- Supporting datasets and mapping logic (TBD on storage conventions).

#### B) GenAI payment-confirmation automation (customer service)
**Goal:** Automate customer-service queries about payments by connecting a GenAI experience to backend systems, reducing handling effort and improving speed.   
**Reported outcome:** ~65% reduction in payment processing time through GenAI solutions (portfolio-level figure). 

**Reference flow (conceptual)**
1. User submits a “payment confirmation / status” query.
2. GenAI layer:
   - Interprets intent and required entities (account, transaction reference, date/time, etc.).
   - Calls backend APIs or database queries to retrieve the authoritative payment state (**TBD** interfaces).
3. Response generation:
   - GenAI produces a customer-friendly response with the retrieved status and any next steps.
4. Logging + feedback:
   - Capture conversation outcomes and edge cases for iterative improvement (**TBD**).

#### C) Data mapping and identity reconciliation
**Goal:** Connect data across subsidiaries (historically siloed) to enable cross-company products and analytics.   
**Key dependency:** customer consent and governance for cross-company data use. 

### 4) Repositories, packaging, and deployment (as-described)

- **Repo structure:** Documentation exists “in our repository,” but specific repo names/structure were not provided in the supplied materials (**TBD**).   
- **Reusability:** Most artifacts are POC notebooks and tailored to context; expected to be reusable primarily for highly similar problems.   
- **Deployment:** Partner-built AWS environment; model/product deployment patterns not detailed (**TBD**). 

### 5) Operating model and delivery timeline (how it was built)

- **2023:** Planning, business setup, and platform creation; large cross-functional effort with up to ~30 case teams / workstreams.   
- **2024:** Data science experiments and GenAI POCs.   
- **2025:** Scaling, product development, and market expansion (especially lead-generation products using ML and cross-vertical data).   

---

## Insights, Learning & Anecdotes

### 1) Cross-vertical value is real—but consent and governance decide whether it’s monetizable
A major theme was the shift from “subsidiary-by-subsidiary analytics” to **cross-vertical signal advantage** (e.g., using telecom-adjacent and payments-adjacent signals together). The team highlighted that unlocking this required sustained effort on **customer consent and governance**, and that these weren’t side projects—they were prerequisites for scaling beyond POCs. 

**Practical learning:** Treat consent flows, data permissions, and governance instrumentation as first-class product features—otherwise you can’t reliably operationalize cross-company data products.

### 2) The platform didn’t create value by itself; applied use cases did
The “Kayana” ecosystem solved a foundational problem (siloed data), but the most tangible proof points came from **use-case delivery**:
- Merchant conversion lift driven by ML-based acquisition targeting (2–3x).   
- Digital payments conversion improvement (10x).   
- Operational cycle-time improvement through GenAI automation (~65% reduction in payment processing time, portfolio-level).   

**Anecdote (from the interview):** The payment-confirmation GenAI POC stood out because it wasn’t a “chatbot for FAQs”—it connected to backend systems to retrieve real payment states, which is what made it operationally meaningful. 

### 3) Heterogeneous maturity across companies is the default in conglomerates
One of the biggest challenges called out was that different group companies had very different data/AI maturity. That created uneven starting points, inconsistent data quality, and difficulty creating a one-size-fits-all rollout plan.   

**Practical learning:** Build a tiered onboarding model (minimum viable data standards + “fast lane” for mature entities) to keep momentum while raising the floor.

### 4) Leadership churn changes roadmaps—design for it
Leadership changes impacted priorities, scope, and the roadmap.   
This mattered because the work spanned: platform creation, experimentation, and scaling—all of which can be re-prioritized when leadership shifts.

**Practical learning:** Put “decision memos” and governance artifacts in place early (what was decided, why, what would trigger a revisit). These become the continuity layer when stakeholders rotate.

### 5) Strategy-to-execution linkage: business cases + partnerships as the bridge
The case summary emphasizes that DigiCo needed both a credible ambition (revenue/valuation) and an executable path—translated into business cases and partnership commercialization.   
Two notable elements:
- Strategic roadmap + business cases across existing assets and new ventures.   
- Converting early partnerships into term sheets and commercial structures (credit scoring, B2B payments) to validate and launch offerings.   

**Practical learning:** For new digital businesses, partnerships are not “later-stage scaling”—they are often the fastest way to validate product-market fit and prove distribution early.

---

## Appendix: Engagement outcomes (from case materials)

- Five-year strategic roadmap with sequencing and value-realization milestones across fintech, data, and GenAI.   
- Revenue ambition: ~7x growth across core product lines.   
- Valuation aspiration: ~10x EV uplift.   
- Initial funding round: ~$10M equity funding facilitated to support early product execution.   
- Partnership progress: advanced commercial structures for two strategic partnerships (credit scoring and B2B payments).   
