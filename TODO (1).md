# TODO - Telecom Rebuild Roadmap (Next.js + Mongo/CSV)

This checklist translates the report into implementation steps.

## Phase 0 - Project Foundation

- [x] Confirm target mode for first delivery: Mongo Atlas or CSV.
- [x] Define canonical field names shared by both modes.
- [x] Add environment variable strategy (DATA_SOURCE_MODE, Mongo URI, CSV dir).
- [ ] Create data access layer interface (same methods for Mongo and CSV providers).
- [x] Set up basic app layout and navigation skeleton.

## Phase 1 - Data Ingestion And Validation

- [x] Prepare source datasets:
  - [x] client_consumption
  - [x] package_activations
  - [x] weekly_consumption
- [x] Build CSV parser + schema validation (types, missing fields, date parsing).
- [ ] Implement data cleaning rules from report insights:
  - [ ] null handling
  - [ ] duplicate handling
  - [ ] text normalization (case/whitespace)
- [ ] Implement Mongo import script (if mongo mode used first).
- [ ] Add indexes in Mongo for client_id, month_dt, week_dt.

## Phase 2 - API Layer (Next.js Route Handlers)

- [x] Create API endpoint for global KPI summary.
- [x] Create API endpoint for per-client behavior details.
- [x] Create API endpoint for package analysis metrics.
- [x] Create API endpoint for revenue and profitability metrics.
- [x] Create API endpoint for recommendation by client_id.
- [x] Add request validation and consistent error format.

## Phase 3 - Dashboards (UI)

- [x] Build login/auth page.
- [x] Build home navigation page with 4 modules:
  - [x] Global consumption overview
  - [x] Individual behavior analysis
  - [x] Package analysis
  - [x] Revenue and profitability
- [x] Add filters (month, week, client_id, package).
- [x] Add reusable KPI card components.
- [ ] Add chart components for trend, distribution, and comparison views.
- [x] Ensure mobile and desktop responsiveness.

## Phase 4 - Recommendation Engine

- [x] Implement baseline recommendation logic (rules/scoring) for MVP.
- [x] Define feature vector from available fields.
- [ ] Add model service contract to allow external ML integration later.
- [x] Return top recommendation with explanation fields (why this offer).
- [ ] Log recommendations for audit and future training data.

## Phase 5 - Security, Roles, And Observability

- [x] Add authentication and session protection.
- [ ] Add role checks (operational vs analyst).
- [ ] Prevent PII leakage in client logs.
- [ ] Add server-side request logging and API timing.
- [ ] Add basic rate limiting for recommendation endpoint.

## Phase 6 - Testing And Quality

- [ ] Unit tests for aggregation and recommendation logic.
- [ ] Integration tests for API routes.
- [ ] UI smoke tests for main dashboard paths.
- [ ] Data consistency checks between CSV mode and Mongo mode outputs.
- [ ] Regression checklist for KPI correctness.

## Phase 7 - Deployment And Handover

- [ ] Production env setup (secrets, Mongo network access).
- [x] Build and run production bundle.
- [ ] Add backup/export strategy for data.
- [ ] Create admin runbook for ingestion and troubleshooting.
- [ ] Prepare v2 plan:
  - [ ] real-time streaming ingestion
  - [ ] automated retraining pipeline
  - [ ] hybrid recommendation techniques

## Priority Order For First Working Version

1. Data access layer + CSV mode
2. APIs for 4 dashboard modules
3. UI dashboard pages
4. Baseline recommendation endpoint
5. Auth and role checks
6. Mongo Atlas integration
7. Testing and deployment hardening
