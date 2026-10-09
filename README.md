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

## 2. Round 3 Progress & Verification

### Features Completed
- **Deterministic Demand Forecasting Engine:** Calculates dinner and lunch attendance using booked diners, meal baselines, day-of-week multipliers, event factors, and physical venue capacity (1,000 covers max).
- **Two-Tier Batch Prep Guidance:** Dish-level quantities across 12 standardized Indian menu items split into an 80% initial batch and a 20% on-demand reserve batch, with an interactive 0%–20% safety buffer slider.
- **Cross-Screen Service Tracking:** Automatically imports the active forecast, records actual covers served and consumed portions, and calculates net balance while preserving shortages (deficits are NOT clamped to zero).
- **Four-Gate Food Safety Certification:** Enforces the 4-hour consumption window, safe temperature thresholds ($\ge 63^\circ\text{C}$ hot / $\le 5^\circ\text{C}$ cold), sensory inspection, and chef accountability sign-off.
- **Connected Two-Sided Recovery Workflow:** Real-time offer lifecycle from publication to NGO inbox discovery, acceptance, vehicle dispatch coordination, and handover confirmation.
- **Smart Waste Insights & Prevention Alerts (PS-44):** Deterministic pattern engine in `src/lib/business/wasteInsights.ts` analyzing historical shift records to identify recurring surplus/shortage frequencies, per-diner prep rate drift, and practical batch staging recommendations.
- **Full-System API Route Matrix:** Next.js server API routes (`/api/forecast`, `/api/consumption`, `/api/ai`) hardened with malformed JSON handling, input validation (HTTP 400), and lazy AI initialization with 503 fallback.
- **Small-Viewport Responsive Optimization:** Clamped modal max-height (`max-h-[92vh] overflow-y-auto`), responsive navigation drawer, and flex-wrapped action bars tested down to 320px width.

### Main Workflow Demonstrated
- **End-to-End Hotel-to-NGO Closed Loop:**
  1. **Demand Forecasting:** Chef inputs 600 bookings on Saturday dinner → engine predicts 690 diners with 759 recommended servings (+10% buffer).
  2. **Production Batching:** Recipe breakdown calculates 167.0 kg of Paneer Butter Masala (133.6 kg Batch 1 / 33.4 kg Batch 2).
  3. **Service Tracking:** 670 guests served; Biryani consumption leaves +25.7 kg surplus balance.
  4. **Safety Review:** Chef Vikram certifies 4 gates (cooked 2 hrs ago, held at 68°C, sensory check passed).
  5. **Two-Sided Handover:** Switching to NGO account (*Hyderabad Community Food Support*), offer appears 4.5 km away in inbox; coordinator accepts and schedules driver Ramesh Kumar (ETA: 25 mins); switching back to hotel shows status synchronized to `Pickup Scheduled`.

### Testing Performed & Actual Results
- **Automated Verification Test Suite (`tests/foodflow-suite.mjs`):**
  - **76 / 76 Tests Passed (100% Pass Rate)** across 16 test suites covering dataset integrity, pattern analysis, holdout validation, forecast determinism, prep batching, Haversine proximity, surplus matching, service balance, AI sanitizer, state consistency, safety buffer, 15-step recovery workflow, edge cases, system audit, smart waste insights, and API route resilience.
- **TypeScript Strict Compilation (`npx tsc --noEmit`):**
  - **0 Type Errors** across all screen components and business logic modules.
- **ESLint Code Quality (`npm run lint`):**
  - **0 Errors** (44 non-blocking unused-variable warnings).
- **Next.js Production Build (`npm run build`):**
  - **Clean Build (Exit Code 0)** compiled via Turbopack in 1.5s with zero route generation failures.

### Responsive Viewports Tested
The application was tested and verified across 6 responsive viewport resolutions:
- **320 x 568 (iPhone SE / compact mobile):** Single-column layout, modal height scroll-clamped, buttons flex-wrapped.
- **375 x 812 (Standard mobile):** Touch-friendly form inputs, responsive sticky actions.
- **430 x 932 (Large mobile / iPhone Pro Max):** Multi-card metric display, complete checklist layout.
- **768 x 1024 (Tablet portrait / iPad):** 2-column grid adaptation, minimum 44px touch targets.
- **1366 x 768 (Standard laptop):** Full desktop layout, interactive Leaflet map, split-screen recovery.
- **1920 x 1080 (Full HD desktop):** High-density analytics view with trend charts and audit logs.

### Database & API Integration Status
- **Client-Side Persistence (LocalStorage):** **VERIFIED (Active Dual-Mode Fallback)**. Seamless state synchronization and multi-page persistence between hotel and NGO personas.
- **Supabase Cloud Database:** **PARTIAL (Dual-Mode Fallback Engaged)**. DDL migrations are authored in repository (`supabase/migrations/`); hosted cloud database returns `PGRST205` (unapplied migrations), gracefully intercepted with zero application crashes.
- **Google Gemini API:** **VERIFIED (Decoupled with Fallback)**. Generates natural-language operational summaries via `@google/genai`; falls back gracefully to deterministic advice if `GEMINI_API_KEY` is omitted.
- **NVIDIA AI API:** **PARTIAL (Fallback Active)**. Configuration templates supported; lazy getter safely falls back to Gemini or rule-based logic when unconfigured.
- **OpenStreetMap Tiles:** **VERIFIED**. Free map rendering in Leaflet without external API key dependencies.

### Remaining Limitations & Honest Disclosures
1. **Remote Cloud Migrations:** Supabase cloud database requires applying SQL migrations; client operates via local storage fallback.
2. **Straight-Line Geodesic Distances:** NGO proximity is calculated using the Haversine formula rather than road-network turn-by-turn routing.
3. **Deterministic Parameter Tuning:** Forecasting multipliers use code-defined baselines rather than runtime regression against database records.
4. **Simulated NGO Directory:** The 7 Hyderabad recovery partners are realistic simulated entities created for evaluation.

---

## 3. Main Features

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

## 4. Technology Stack

- **Framework:** Next.js `14.2.5` (App Router)
- **UI & Components:** React `18.3.1`, Tailwind CSS `3.4.1`, Lucide React `0.428.0`
- **Language:** TypeScript `5.5.4` (Strict Type Safety)
- **Database & BaaS:** Supabase (`@supabase/supabase-js` `2.45.1`), PostgreSQL migrations
- **AI Operational Briefs:** Google Gemini 3.8 Flash via official `@google/genai` SDK
- **Maps & Geolocation:** Leaflet `1.9.4`, React-Leaflet `4.2.1`, OpenStreetMap tile servers
- **Automated Verification:** Custom Node.js ESM test suite (`76/76` tests passing, 100% pass rate)
- **Release Audit Report:** Full feature-by-feature verification inventory in [**`ROUND3_FULL_SYSTEM_AUDIT_REPORT.md`**](./ROUND3_FULL_SYSTEM_AUDIT_REPORT.md).

---

## 5. Installation and How to Run

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
# Run the 76-test automated verification suite (via tsx)
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

## 6. Required Environment Variables

Configure the following variables in `vistera-app/.env.local` (referenced by name only; do not commit secret values):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project API endpoint.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anonymous client JWT key.
- `GEMINI_API_KEY` — Google Gemini API key for operational kitchen briefing summaries.

*(Note: The application includes full deterministic fallback logic. If API keys are absent, all forecasting, batching, service balance, and recovery workflows continue to operate seamlessly).*

---

## 7. Known Limitations

1. **Remote Database Migrations Pending:** Remote Supabase tables return `PGRST205` because SQL migrations have not been applied to the hosted cloud project. The active dual-mode fallback stores state reliably in `localStorage`.
2. **Straight-Line Distance Calculations:** NGO distances use the mathematical Haversine formula (geodesic distance) rather than real-time turn-by-turn road navigation.
3. **Deterministic Parameter Tuning:** Forecasting multipliers are code-defined rather than continuously retrained against live database history.
4. **Illustrative NGO Directory:** The 7 Hyderabad non-profit recovery partners are realistic simulated entities created for evaluation purposes.

---

## 8. Complete Master Documentation

For in-depth analysis, architectural diagrams, formula derivations, code examples, audit reports, judge Q&As, and live demonstration scripts, please consult:

👉 [**`FOODFLOW_MASTER_DOCUMENTATION.md`**](./FOODFLOW_MASTER_DOCUMENTATION.md)
