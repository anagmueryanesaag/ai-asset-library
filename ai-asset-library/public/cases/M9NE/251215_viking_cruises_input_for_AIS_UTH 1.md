---
title: "Viking Cruises — Revenue Management System (RMS) Technical Codification"
description: "End-to-end revenue management and dynamic pricing system for Viking Cruises, built on Azure Databricks. It ingests operational and marketing data, forecasts demand and price elasticity, models cancellations/options, optimizes cabin prices under business constraints, and publishes weekly recommendations via a review frontend and downstream pricing integrations."
contacts:
  - name: "Boran Morvaj"
    email: "Boran.Morvaj@Bain.com"
---

# Viking Cruises

## Application overview

Viking RMS is an end-to-end revenue management platform that produces weekly price recommendations for cruise cabins. It is implemented primarily as Azure Databricks Jobs and pipelines (DLT + notebooks), with ML models tracked in MLflow and deployed via Databricks Bundles. A lightweight Dash frontend enables analyst review/overrides, and approved prices are published to downstream pricing systems.

## Code documentation

Technical & AI Overview
High-level Summary
What it does (Confirmed): End-to-end revenue management system on Azure Databricks for cruise products. It ingests data (SharePoint, Event Hubs, internal tables), runs demand forecasting (DoubleML + LightGBM), computes cancellations/options, performs multi-step price optimization with smoothing, and publishes recommendations and weekly updates through orchestrated jobs.
AI/ML presence (Confirmed): Extensive classical ML. No Generative AI/LLMs detected. Models are trained/logged with MLflow and served via Databricks Unity Catalog model registry, inference orchestrates multiple LightGBM components.
Stack and architecture (Confirmed): Python + PySpark + Databricks DLT + MLflow + Delta Lake + Unity Catalog + Databricks Bundles; CI/CD via Azure DevOps pipelines; secret management via Azure Key Vault (through Databricks secrets).
Style (Inferred): Modular monolith of data pipelines + ML training/inference notebooks and orchestrators, running as Databricks Jobs with a bundle-based deployment.
Components & Modules

| Component / Module | Path(s) | Responsibility / Description (Confirmed / Inferred) |
| --- | --- | --- |
| Data Pipelines (DLT + ETL) | 01 Data pipelines/** | DLT ingestion from Azure Event Hubs (Kafka), SharePoint connector ingestion, weekly aggregation and feature prep (Confirmed; e.g., read_evo_status_evh.py:1-90, sharepoint/etl.py:15-54). |
| Demand Modelling (Training/Inference) | 03 Demand modelling/src/**, notebooks/** | DoubleML-based demand forecasting with LightGBM, feature selection (Boruta + SHAP), MLflow model logging/registry; multi-horizon grouping and fallback logic (Confirmed; e.g., multi_step_inference_DML.py:1-360,360-624). |
| Cancellation Modelling | 07 Cancellation modelling/** | Cancellation rate model training/inference; writes Delta tables and supports inventory constraints (Confirmed; via repeated delta.DeltaTable.forName). |
| Multi-Step Pricing Optimizer | 08b_Multi-Step_Pricing_Optimizer/src/** | Price gap computation, revenue effects, smoothing, product/capacity transforms; orchestrated parallel runs and smoothing (Confirmed; e.g., pricing.py, Parallel Optimizations and Smoothing.py). |
| Weekly Orchestration | 09 Weekly Multi-Step Job/**, weekly_rms_update.yml | Weekly RMS job orchestrating ETL → Demand → Cancellation/Options → Optimization → FET update (Confirmed; weekly_rms_update.yml:1-220). |
| FET Pipelines | 100 FET-pipelines/** | Downstream pipeline updates for forecasts/external tables (Inferred based on naming and usage from weekly job). |
| Reporting | 11 Reporting/** | Databricks notebooks producing reports (Confirmed; Spark DataFrames and SQL usage). |
| Utilities | utils/** | Spark/Pandas dtype mapping, table save helpers, workflow status utilities (Confirmed; e.g., pd_to_spark_mapper.py, workflow_utils/*). |
| Configuration & Bundles | databricks.yml, resources/** | Databricks Bundle config, job/pipeline definitions, connectors; environment variables, clusters, policies (Confirmed). |
| CI/CD | azureDevOps/** | Azure DevOps pipeline templates to validate/deploy/destroy Databricks bundles; uses DATABRICKS_HOST/DATABRICKS_TOKEN (Confirmed). |
| Tests | 08b_Multi-Step_Pricing_Optimizer/tests/** | Limited unit tests (Confirmed; oversell_reallocation_unit_tests.py:298). |

Architecture Diagram








Core Feature Flows / Critical Paths
Weekly RMS Update
What: Orchestrated weekly pipeline to refresh data, forecast demand, compute cancellations/options, run pricing optimization, and update FET.
Entry points (Confirmed): resources/workflows/weekly_rms_update.yml:1-220, 09 Weekly Multi-Step Job/Weekly_RMS_Update_Orchestrator.py:11-73.
Flow & modules (Confirmed):
DLT ingestion from Event Hubs: 01 Data pipelines/read_evo_status_evh.py:1-90.
SharePoint ingestion: resources/connectors/spo_rms_yield_connector.yml:1-38, resources/pipelines/spo_rms_yield_ingestion.yml:1-30, 01 Data pipelines/sharepoint/etl.py:15-54.
Weekly aggregation & mapping: 01 Data pipelines/03 Demand Data/08_weekly_aggregation_upd (Notebook path in workflow), 10_cabinclass_to_cabintype_mapping, 11_cabinclass_to_cabintype_conversion.
Demand forecast trigger: 09 Weekly Multi-Step Job/trigger_multi_step_demand_forecast.py:75-165.
Cancellation/Options tables: 01 Data pipelines/06 Optimizer_IntraWeek_Cancellation/cxl_rate_tables.py:505-541, OptionsConversion.py:1004-1040.
Optimizer run: 08b_Multi-Step_Pricing_Optimizer/Parallel Optimizations and Smoothing.py:16-26,414-481.
FET update: 09 Weekly Multi-Step Job/trigger_fet_update.py:100-140.
AI involvement (Confirmed): DoubleML + LightGBM inference via MLflow UC models.
External dependencies (Confirmed): Event Hubs (Kafka), SharePoint connector, Unity Catalog model registry, Databricks Bundles, Azure DevOps CI/CD.
Error handling (Confirmed/Inferred):
Job status polling utilities: utils/workflow_utils/check_databricks_job_status used across triggers (Confirmed).
Retries and backoff: workflow task has max_retries/min_retry_interval_millis (Confirmed).
Fallback in inference thresholds for binary/count (Confirmed; multi_step_inference_DML.py:1-160).
Demand Forecast Inference
What: Multi-step horizon inference (binary booking probability + conditional counts), with weighted aggregation and correction multipliers.
Entry points (Confirmed): 03 Demand modelling/src/multi_step_inference_DML.py.
Flow & modules (Confirmed):
Load models via MLflow UC: read_mlflow_model and read_models_target_mlflow (multi_step_inference_DML.py:95-180,187-234).
Construct DML per horizon/rank: VikingDemandForecast_2steps_DML.read_models (multi_step_inference_DML.py:392-418).
Predict and aggregate with weights and correction multipliers: predict_individual_step and predict_detail (multi_step_inference_DML.py:432-624).
AI involvement (Confirmed): LightGBM models + DoubleML orchestration; SHAP used for feature transparency in training notebooks.
External dependencies: MLflow UC, Delta tables used for registry lookups (model_registry_lookup_from_prefix hitting UC tables; multi_step_inference_DML.py:209-248).
Edge cases (Confirmed/Inferred): Fallback thresholds (0.025, 0.975), scaling coefficients optional, weights beyond horizon group with decay (Confirmed; calculate_weight:21-56). Try/except around MLflow loading to raise explicit errors (Confirmed; read_mlflow_model:121-153).
Multi-Step Pricing Optimization
What: Compute price gaps/effects, apply smoothing, enforce product/capacity constraints, orchestrate parallel optimization.
Entry points (Confirmed): 08b_Multi-Step_Pricing_Optimizer/Parallel Optimizations and Smoothing.py.
Flow & modules:
Pricing transformations and gap calculations (Confirmed): src/pricing.py:7-479, src/price_gap.py:1-243.
Smoothing functions (Confirmed): src/smoothing.py:5-146.
Capacity/cabin limits (Confirmed): src/capacity_and_cabin_limit.py:3-5.
Job orchestration (Confirmed): Parallel Optimizations and Smoothing.py:150-481 with Databricks SDK and job status utils.
AI involvement: Uses output of demand forecasts; no LLM.
Edge handling: Result status aggregation and fail/succeed checks via utilities; smoothing parameterization (Confirmed).
Data Model & Persistence
Storage (Confirmed):
Delta Lake tables in Unity Catalog catalogs: services, raw, prepared, with schemas like rms, resdata, etc. (databricks.yml:37-120).
Volumes path: "/Volumes/services/rms" or environment-specific overrides (databricks.yml:37-120,600-726).
Key tables (Confirmed/Inferred):
Demand forecast tables: var.table_demand_forecast default is "demand_forecast_hybrid_cabin_type_multi_week_allCruiseLines" (databricks.yml:45-120).
Model prefix registry lookup: services.rms.demand_model_prefix_registry_lookup queried in inference (multi_step_inference_DML.py:209-248).
Cancellation/Options Delta tables updated in 01 Data pipelines/06 Optimizer_IntraWeek_Cancellation/*.py via delta.DeltaTable.forName.
Data operations (Confirmed):
DLT: streaming view and table creation (read_evo_status_evh.py:1-90).
DeltaTable deletes and merges for maintenance (Confirmed; e.g., resources/maintenance/catalog_changes/110425_delete_old_records_from_price_recommendations_sku_level.py:2-9).
Constraints/indices (Unknown): Not visible in code; relies on UC/Delta configs.
Environment partitioning (Confirmed): Variables per target (dev, qa, prod) with catalogs/schemas/cluster pools (# lines: databricks.yml multiple presets sections).
AI / ML / GenAI Capabilities
Solution types (Confirmed):
Standard ML inference: LightGBM for regression and classification.
DoubleML orchestration: multi-treatment residual modeling with cross-validated submodels (03 Demand modelling/src/doubleML.py, referenced by inference and notebooks).
SHAP-based feature selection and transparency (src/boruta_feature_selection.py:209-318, notebooks).
Modalities (Confirmed): Tabular numeric/categorical demand data; no image/audio/video/text LLMs.
Invocation points (Confirmed): Inference classes call MLflow UC to load registered models; notebooks and jobs prepare features and assemble horizon/rank groups.
Models, Providers & Orchestration
Providers (Confirmed): Local/Databricks ML via LightGBM; MLflow registry in Unity Catalog (mlflow.set_registry_uri('databricks-uc')).
Models (Confirmed):
LightGBM models for target (counts) and treatments (promotion variables), with monotonic constraints and calibration coefficients where configured (train_DML.py:126-210, multi_step_inference_DML.py:360-418).
Configuration (Confirmed):
Model names resolved via UC prefix registry and per-CV-index naming (multi_step_inference_DML.py:187-234).
Optional fallback S-learner model (read_fallback: multi_step_inference_DML.py:248-289).
Orchestration (Confirmed):
Databricks Jobs via Bundles (resources/workflows/*.yml) with task dependencies.
Databricks SDK used to trigger and poll jobs (trigger_multi_step_demand_forecast.py:75-165, optimizer script).
Prompts/templates (Not applicable): No LLM usage.
RAG/vector search (Not applicable): No embedding/vector store detected.
Configuration, Deployment & Infrastructure
Config (Confirmed):
databricks.yml: bundle name, repo URL, included resources, security groups/permissions, variables for catalogs/schemas/experiments, cluster pools/policies per environment, secret scope keys for Event Hubs, pause status, DLT dev flag, SharePoint connection name, warehouse id (lines 1-120, 600-726).
Secrets from Key Vault via Databricks secrets (read_evo_status_evh.py:1-24).
Deployment (Confirmed):
Azure DevOps pipelines install Databricks CLI, validate/deploy/destroy bundles; references DATABRICKS_HOST and DATABRICKS_TOKEN env vars (azureDevOps/templates/release_pipeline_template.yml:46-85).
Targets: dev, qa, prod with Databricks workspace host adb-6254662177164675.15.azuredatabricks.net (Confirmed; databricks.yml:720).
Integrations (Confirmed):
Azure Event Hubs (Kafka) for status ingestion (DLT).
SharePoint Online connector for static documents (connector YAML).
MLflow Unity Catalog model registry.
Databricks Warehouse (ID present) (Confirmed; databricks.yml:600-726).
Data, Governance & Safety
Data types (Confirmed/Inferred):
Structured tabular data: demand signals, promotions, options, cancellations. Likely includes internal proprietary and potentially PII-adjacent fields (Inferred; no direct PII fields seen).
Governance (Confirmed/Inferred):
MLflow registry tagging strategy with mdl_prefix for version selection (Confirmed; multi_step_inference_DML.py:129-180 uses tags).
SHAP visualizations logged to MLflow for transparency (Confirmed; notebooks).
No explicit PII masking/anonymization logic detected (Unknown/Inferred risk).
AI safety (Inferred Risk):
No prompt injection or LLM guardrails needed; not applicable.
Model misuse mitigations: Fallback thresholds and calibration coefficients used for robustness; no explicit fairness/ethics module noted (Inferred).
Cross-cutting Concerns
Logging & Observability (Confirmed/Inferred):
MLflow metrics/artifacts logged during training and performance notebooks (train_single_model.py:124-628).
Job status tracking utilities centralize polling and success/fail aggregation (utils/workflow_utils/check_databricks_job_status, referenced widely).
No explicit tracing/metrics systems (Prometheus/OpenTelemetry) detected (Unknown).
Testing (Confirmed/Inferred):
Minimal unit tests present (08b_Multi-Step_Pricing_Optimizer/tests/oversell_reallocation_unit_tests.py:298). Broad areas appear under-tested, especially pipelines and ML inference (Inferred gap).
Performance & Scalability (Confirmed/Inferred):
Cluster pools and policies tuned per environment; large-scale SHAP sampling gating thresholds (e.g., >= 50_000 rows) (Confirmed).
Smoothing algorithm parameters configurable; parallel optimization orchestrated (Confirmed).
Latency/cost trade-offs managed via job dependencies and cluster sizing (Inferred).
Limitations & Open Questions
Production topology details beyond Databricks Bundles (Unknown): No Terraform/K8s manifests; all infra via Databricks.
Exact test coverage and reliability metrics (Unknown): Sparse tests found.
Data privacy specifics (Unknown): No explicit PII handling code surfaced.
Model training parameters and governance policies (Partly Confirmed): MLflow used; broader MLOps process not documented.
SLAs/SLOs for weekly jobs (Unknown): Workflow schedules exist; SLAs not documented.
External systems consuming recommendations (Unknown): Downstream publication endpoints not visible beyond Delta tables and FET updates.
Marking Certainty
Confirmed: Based on direct code/config evidence cited with file:approx_line ranges above.
Inferred: Naming patterns (“FET-pipelines”), architectural conventions (modular monolith with Databricks jobs), likely data sensitivity.
Unknown: Items without code/config evidence in the repo.

## Insights, Learning & Anecdotes

### What was built and why it mattered
Viking’s Revenue Management System (RMS) is a **weekly dynamic pricing** capability for cruise cabins. It produces recommended prices at a granular SKU level (sailing × cabin type) and projects **up to ~100 booking weeks** ahead so that near-term changes still result in long-run, customer-friendly price paths (instead of noisy week-to-week swings). The objective is to maximize expected revenue while respecting real operational and commercial constraints (capacity, cabin hierarchies, stop-sell behavior, and pricing guardrails).

A key design choice is a **hybrid modeling approach**:
- A **baseline demand model** that estimates the underlying demand level (volume).
- A **causal elasticity model** (DoubleML-style) that estimates the causal impact of changing discount/price on demand.
Separating “baseline volume” from “elasticity” makes it possible to answer the business question (“What happens if we change EBD by X%?”) without letting purely-correlated features distort price-response behavior.

### Data reality: sparse, bursty, high-value transactions
Cruise bookings are sparse at SKU level: many historical weeks have **zero bookings**, while a single booking can be worth thousands of dollars. This breaks many standard regression setups. RMS addresses this with a **two-step forecasting structure**:
1) A binary model predicts whether any bookings will occur in a given week.
2) A conditional regression predicts how many bookings occur when bookings are non-zero.
The expected bookings are then probability × conditional expectation, which yields stable forecasts even under heavy zero-inflation.

### Raw-to-net demand: options and cancellations
The optimizer needs **net demand**, not raw bookings. RMS adjusts forecasts using:
- **Options conversion** (some bookings are provisional and cancel if not paid within an allowed window).
- **Cancellations** (customers cancel at varying rates by weeks-to-sail and other drivers).
This raw-to-net conversion is critical to get the right “net cabin revenue” view and to trigger stop-sell behavior when booking barriers are breached.

### Why the optimizer is “the product”
In practice, much of the business value lives in the optimization layer and its overlays:
- **Guardrails** (week-over-week change limits, floor/ceiling constraints, price-ending rules).
- **Inversion avoidance** (preventing illogical cabin hierarchy pricing and enforcing minimum gaps).
- **Capacity / cabin limits** (align recommendations with inventory realities).
- **Smoothing** (especially for dense river itineraries) to keep similar products priced coherently.
The optimizer often evaluates multiple scenarios (including air-price scenarios) and selects the revenue-best feasible curve after applying constraints and inversion fixes.

### Operational workflow and adoption
RMS is built around a **weekly operating cadence**:
- Databricks jobs refresh data, run demand + cancellation/options, run the optimizer, and write recommendation tables.
- Analysts review recommendations in a frontend tool (Dash), typically focusing on approving/modifying the **next week** while the long-horizon curve enforces smoothness.
- Approved prices are pushed to downstream pricing systems (e.g., EVO) that ultimately expose prices to customers via website/call center.

This “human-in-the-loop” design helps adoption: analysts retain control, and overrides are recorded with user details for traceability.

### The hard part: knowledge loss and production fragility
A recurring theme from the case interview is that **technical debt and knowledge concentration** dominated delivery:
- The solution accumulated a very large, complex codebase with limited documentation and sparse comments.
- High turnover and limited handover created repeated rediscovery cycles; onboarding could take months.
- Debugging and extending the system was risky because the system behaved more like an MVP even after being “in production.”

A large portion of late-stage work went into stabilization: reducing brittleness in orchestration, clarifying run dependencies, making failures diagnosable, and paying down technical debt so weekly operations were reliable.

### What we would replicate next time (and what we’d change)
Reusable patterns:
- **Baseline + causal uplift** for sparse demand where elasticity matters.
- **Multi-horizon / grouped horizon** forecasting to reduce maintenance and improve consistency across booking windows.
- Clear separation of stages (data → forecast → cancellations/options → optimize → publish), which is invaluable for debugging.

What to change:
- Invest earlier in production engineering (tests, logging/observability, clear ownership boundaries).
- Treat documentation and handover as non-negotiable deliverables.
- Avoid single-person dependency through code reviews and componentization.
- Be explicit about horizon governance: long horizons can help smoothness, but uncertainty grows quickly beyond ~6–12 months, so stakeholders need clear interpretation of far-horizon outputs.

### A “day-in-the-life” mental model from onboarding
The onboarding materials describe RMS as a sequence of composable stages:
1) Data preparation and transformations (DLT + ETL).
2) Demand forecasting (baseline + DoubleML elasticity).
3) Options conversion and cancellation modeling to convert raw forecasts to net demand.
4) Multi-step price optimization with guardrails, inversion avoidance, and smoothing.
5) Frontend review and deployment into downstream pricing systems.

This structure is a practical troubleshooting guide: when issues arise, you can localize problems to one stage instead of treating RMS as a single black box.
