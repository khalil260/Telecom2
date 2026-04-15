# Telecom Offer Recommendation Platform (CSV MVP)

This repository is the rebuild of a PFE project for Tunisie Telecom:

- Source report: Rapport_PFE_Tunisie_Telecom_MED_AZIZ_CHELBI_ET_FATMA_ZGHAL (7).pdf
- Goal: recreate the application using only Next.js, with either:
	- MongoDB Atlas as primary data storage, or
	- static CSV files as a first version / fallback mode.

## 0) MVP Status (Implemented)

The current repository now contains a complete CSV-first MVP, including:

- Authentication flow (cookie-based).
- Frontend pages for all required modules.
- Professional dashboard organization with responsive module pages.
- Backend API routes for each module.
- Static CSV datasets generated for demo and development.

### App Pages

- /login
- /
- /dashboard/global
- /dashboard/client
- /dashboard/packages
- /dashboard/revenue
- /dashboard/recommendation

### API Endpoints

- GET /api/meta/clients
- POST /api/auth/login
- GET /api/dashboard/global
- GET /api/dashboard/client?clientId=1001
- GET /api/dashboard/packages
- GET /api/dashboard/revenue
- GET /api/recommendation?clientId=1001

### Demo Login

- username: value from `DASHBOARD_USERNAME` in `.env.local`
- password: value from `DASHBOARD_PASSWORD` in `.env.local`

### CSV Files Used By The MVP

- data/client_consumption.csv
- data/package_activations.csv
- data/weekly_consumption.csv

## 1) What Was Built In The Original Report

The original project was a BI + recommendation system that included:

- Data pipeline and preparation from CSV/Excel sources (ETL flow).
- A multidimensional model around client telecom behavior.
- Dashboarding for business users.
- Supervised ML models to recommend telecom offers.

Original stack (from report):

- SQL Server, SSIS, SSAS
- Power BI
- Streamlit
- Python ML (Random Forest, AdaBoost, XGBoost)

## 2) Core Business Objective

Predict and recommend the most suitable telecom offer for each client using:

- consumption history,
- purchase/activation behavior,
- profile and financial indicators.

Expected business impact:

- better offer personalization,
- improved customer retention,
- improved ARPU and revenue monitoring,
- better marketing targeting.

## 3) Functional Requirements Extracted From The Report

1. Collect and process client data (consumption, purchases, recharge, interactions).
2. Analyze behavioral patterns.
3. Generate personalized offer recommendations.
4. Provide dashboards for operational and marketing users.
5. Train/test/update predictive models.
6. Integrate with existing systems via files or APIs.
7. Support authentication before accessing features.

## 4) Non-Functional Requirements

1. Fast response time for recommendation queries.
2. Security and privacy for personal data (GDPR-style principles).
3. Scalability with increasing data volume.
4. High availability target (report mentions 99%).
5. Clear, usable interface for non-technical users.

## 5) Data Scope Understood From The Report

Main fact datasets:

- Client consumption fact table (about 20,000 rows, 98 columns in report).
- Package activation fact table (Nov/Dec/Jan).
- Weekly consumption fact table (Nov/Dec/Jan).

Important signal groups:

- Internet usage (session volume, weekend volume, 2G/3G/4G split).
- Calls and voice behavior (counts, durations, on-net/off-net/operator split).
- SMS behavior and related revenue.
- Recharge and package metrics (amounts, counts, validity, allocated data/minutes).
- Financial indicators (ARPU, ARPM, revenue composition).
- Incoming activity metrics.

## 6) Dashboards To Recreate In Next.js

From the report, the app navigation should include:

1. Global consumption overview
2. Individual customer behavior analysis
3. Package analysis
4. Revenue and profitability

Observed KPI examples in report:

- ARPU
- Off-net / inter-network revenue
- total transaction amount
- activity by month/week
- allocated data/minutes/SMS trends

## 7) ML Understanding From The Report

Models tested:

- Random Forest
- AdaBoost
- XGBoost

Evaluation metrics used:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix

Report conclusion selected XGBoost as the most balanced and reliable model.

Note for rebuild:

- Very high reported scores suggest we should validate carefully for leakage/overfitting when reproducing.

## 8) Rebuild Architecture (Next.js Only)

The target architecture is one codebase with two data providers:

- Provider A: MongoDB Atlas
- Provider B: CSV (static/local)

Current implementation status:

- Implemented now: CSV provider.
- Planned next: MongoDB Atlas provider with the same API contract.

Suggested app layers:

- Next.js App Router pages
- Route Handlers for API endpoints
- Data access layer (Mongo provider + CSV provider)
- Analytics service (KPI aggregations)
- Recommendation service (rule-based baseline, ML-ready interface)

## 9) Proposed Collections / Data Models (Mongo Mode)

1. clients
2. client_consumption
3. package_activations
4. weekly_consumption
5. recommendations
6. users (for authentication / roles)

Recommended indexes:

- client_id
- month_dt
- week_dt
- offer / package type
- created_at

## 10) CSV Mode (Implemented)

Keep source files in a data folder, for example:

- data/client_consumption.csv
- data/package_activations.csv
- data/weekly_consumption.csv

CSV mode should:

- parse files on server side,
- normalize field names,
- cache transformed results for dashboard speed,
- expose same API contract as Mongo mode.

## 11) Security And Governance To Keep

- Authentication required for dashboards.
- Role-based access (analyst vs operational).
- Input validation on all API routes.
- Basic audit logging for recommendation queries.
- No raw PII in client-side logs.

## 12) Development Plan

The full step-by-step build plan is in TODO.md.

## 13) Current Project Commands

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

## 14) Suggested Environment Variables

```env
# Data source mode target (csv now, mongo later)
DATA_SOURCE_MODE=csv

# Mongo Atlas
MONGODB_URI=
MONGODB_DB=telecom

# Auth
AUTH_SECRET=
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=telecom2026
```

## 15) Rebuild Success Criteria

1. All four dashboard sections are available and consistent with report intent.
2. Recommendation endpoint returns top offer suggestion per client.
3. Same pages work in both mongo and csv modes.
4. KPI values are reproducible from source data.
5. App is deployable as a standard Next.js application.
