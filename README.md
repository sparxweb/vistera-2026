# FOODFLOW — Predict. Prevent. Recover.

> **Hackathon Track:** VISTERA 2026  
> **Problem Statement:** PS-44 — Cutting Food Waste  
> **Target Sector:** Commercial Hospitality, Banquet Operations & Community Food Redistribution  
> **Master Documentation:** For comprehensive technical specifications, mathematical derivations, database schemas, test results, and live judge scripts, see [**`FOODFLOW_MASTER_DOCUMENTATION.md`**](./FOODFLOW_MASTER_DOCUMENTATION.md).

---

## 1. Project Overview

**FOODFLOW** is an integrated kitchen operations and surplus recovery platform engineered for commercial hotels and institutional dining facilities. It addresses the systemic causes of commercial food waste by closing the operational loop:

$$\mathbf{Demand\ Forecast} \longrightarrow \mathbf{Two\text{-}Tier\ Batch\ Prep} \longrightarrow \mathbf{Service\ Tracking} \longrightarrow \mathbf{Four\text{-}Gate\ Safety\ Certification} \longrightarrow \mathbf{NGO\ Recovery\ Handover}$$

By giving executive chefs accurate, deterministic attendance forecasts and structured 80/20 batch-cooking recommendations, FOODFLOW prevents overproduction before cooking starts. When unavoidable surplus occurs, the platform enables instantaneous, safety-compliant routing directly to verified non-profit partners.

---

## 2. Main Features

- **Interactive Multi-Tenant Access:** Fast role-switching between Hotel Staff (*Deccan Grand Hotel, Hyderabad*) and NGO Coordinators (*Hyderabad Community Food Support*).
- **Deterministic Demand Forecasting Engine:** Calculates dinner and lunch attendance using booked diners, meal baselines, day-of-week multipliers, event factors, and physical venue capacity (1,000 covers max).
- **Transparent Mathematical Explanations:** Step-by-step breakdown modal demonstrating exact coefficient weights with zero black-box obscurity.
- **Two-Tier Batch Cooking Guidance:** Dish-level quantities across 12 standardized Indian menu items split into an 80% initial batch and a 20% on-demand reserve batch.
- **Dynamic Safety Buffer Control:** Interactive 0% to 20% slider dynamically adjusting total preparation quantities.
- **Cross-Screen Service Tracking:** Automatically imports the active forecast, compares actual covers served against consumed portions, and calculates net balance.
- **Four-Gate Food Safety Certification:** Enforces the 4-hour consumption window, safe temperature thresholds ($\ge 63^\circ\text{C}$ hot / $\le 5^\circ\text{C}$ cold), sensory inspection, and chef accountability sign-off.
- **Connected Two-Sided Recovery Workflow:** Real-time offer lifecycle from publication to NGO inbox discovery, acceptance, vehicle dispatch coordination, and handover confirmation.
- **Geographic Discovery Map:** Interactive Leaflet + OpenStreetMap visualization showing straight-line geodesic distances across Hyderabad recovery partners.
- **Decoupled Gemini Operational Briefs:** Optional natural-language kitchen advisory powered by Google Gemini 3.8 Flash, strictly decoupled from numerical predictions.
- **Dual-Mode Persistence:** Transparent client-side `localStorage` fallback ensuring uninterrupted state synchronization when remote databases are offline.
- **Smart Waste Insights & Prevention Alerts:** Historical pattern engine detecting dish surplus/shortage frequencies, consumption rate drift, and practical batch staging recommendations.

---

## 3. Technology Stack

- **Framework:** Next.js `14.2.5` (App Router)
- **UI & Components:** React `18.3.1`, Tailwind CSS `3.4.1`, Lucide React `0.428.0`
- **Language:** TypeScript `5.5.4` (Strict Type Safety)
- **Database & BaaS:** Supabase (`@supabase/supabase-js` `2.45.1`), PostgreSQL migrations
- **AI Operational Briefs:** Google Gemini 3.8 Flash via official `@google/genai` SDK
- **Maps & Geolocation:** Leaflet `1.9.4`, React-Leaflet `4.2.1`, OpenStreetMap tile servers
- **Automated Verification:** Custom Node.js ESM test suite (`68/68` tests passing, 100% pass rate)
- **Release Audit Report:** Full feature-by-feature verification inventory in [**`ROUND3_FULL_SYSTEM_AUDIT_REPORT.md`**](./ROUND3_FULL_SYSTEM_AUDIT_REPORT.md).

---

## 4. Installation and How to Run

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or pnpm

### Quick Setup
```bash
# 1. Navigate to the application directory
cd vistera-app

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
# Copy template and add keys if available
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Verification Tests
```bash
# Run the 62-test automated verification suite (via tsx)
npm test
# or: npx tsx tests/foodflow-suite.mjs

# Verify TypeScript compilation (0 errors)
npx tsc --noEmit

# Verify ESLint (0 errors)
npm run lint

# Verify Production Build
npm run build
```

---

## 5. Required Environment Variables

Configure the following variables in `vistera-app/.env.local` (referenced by name only; do not commit secret values):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project API endpoint.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anonymous client JWT key.
- `GEMINI_API_KEY` — Google Gemini API key for operational kitchen briefing summaries.

*(Note: The application includes full deterministic fallback logic. If API keys are absent, all forecasting, batching, service balance, and recovery workflows continue to operate seamlessly).*

---

## 6. Known Limitations

1. **Remote Database Migrations Pending:** Remote Supabase tables return `PGRST205` because SQL migrations have not been applied to the hosted cloud project. The active dual-mode fallback stores state reliably in `localStorage`.
2. **Straight-Line Distance Calculations:** NGO distances use the mathematical Haversine formula (geodesic distance) rather than real-time turn-by-turn road navigation.
3. **Deterministic Parameter Tuning:** Forecasting multipliers are code-defined rather than continuously retrained against live database history.
4. **Illustrative NGO Directory:** The 7 Hyderabad non-profit recovery partners are realistic simulated entities created for evaluation purposes.

---

## 7. Complete Master Documentation

For in-depth analysis, architectural diagrams, formula derivations, code examples, audit reports, judge Q&As, and live demonstration scripts, please consult:

👉 [**`FOODFLOW_MASTER_DOCUMENTATION.md`**](./FOODFLOW_MASTER_DOCUMENTATION.md)
