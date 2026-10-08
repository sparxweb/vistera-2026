# FOODFLOW — Round 2 Development Progress Report

**Hackathon:** VISTERA 2026  
**Problem Statement:** PS-44 — Cutting Food Waste  
**Project:** FOODFLOW — AI-Powered Food Waste Prevention & Surplus Recovery Platform  
**Tagline:** Predict. Prevent. Recover.  
**Phase:** Round 2 — Real Working MVP Foundation  

---

## 1. Executive Summary & Objective

In accordance with the official VISTERA 2026 Round 2 mandate (*"Setting up your project and repository, creating the basic system architecture, setting up your database, backend, frontend... getting at least one small part of your project working"*), this milestone delivers the first **complete, working vertical slice** of FOODFLOW:

$$\text{FORECAST} \longrightarrow \text{PREPARE} \longrightarrow \text{MONITOR} \longrightarrow \text{DETECT}$$

Rather than building an overwhelming, incomplete admin dashboard with mock values, we engineered a clean, deterministic core operational loop connected to **Next.js App Router API routes**, **Supabase PostgreSQL database**, and persistent browser state.

---

## 2. Completed & Working Features

### A. Forecasting Engine (`src/lib/forecast/engine.ts`)
- **Deterministic Numerical Computation:** Strictly decoupled from LLM text generation to prevent hallucinations.
- **Parametric Inputs:** Expected diners (e.g. 800), meal type (Breakfast, Lunch, Dinner), scheduled recipe (e.g. Rice + Dal + Chicken), and campus context modifiers (Exam Week, Holiday, Event, Heavy Weather).
- **Mathematical Yield:** Calculates predicted demand ($742$ servings on baseline) and recommended staging ($760$ servings, incorporating a $+18$ serving / $2.426\%$ safety buffer margin).
- **Risk Assessment:** Classifies operational risk as `LOW`, `MEDIUM`, or `HIGH` based on variance from the rolling historical shift baseline.

### B. Forecast API (`POST /api/forecast`)
- Validates input headcount.
- Executes deterministic calculations.
- Prompts Google Gemini (3.8 Flash) asynchronously for contextual reasoning only (e.g., meal-staging suggestions).
- Persists record directly into Supabase PostgreSQL table `public.demand_forecasts`.
- Graceful degradation: If Gemini is offline, deterministic forecasts complete with verified local explanations.

### C. Consumption Balance Engine (`src/lib/business/balance.ts`)
- **Real-Time Difference Calculation:** $\text{Remaining} = \max(0, \text{Prepared} - \text{Served})$.
- **Automated State Detection:**
  - `SURPLUS`: Triggered when remaining servings exceed safety threshold (e.g., $760$ prepared vs $728$ served $\to$ $32$ surplus).
  - `SHORTAGE`: Triggered when turnstile sales exceed staged preparation (e.g., $700$ prepared vs $728$ served $\to$ $28$ shortage).
  - `BALANCED`: Triggered when preparation tightly matches attendance within tolerance ($\pm 5$ servings).

### D. Consumption API (`POST /api/consumption`)
- Receives actual headcount counts.
- Evaluates surplus/shortage balance.
- Persists record into Supabase PostgreSQL table `public.daily_consumption`.
- Flags surplus pans for immediate recovery routing.

### E. Database Persistence & Resilience (`src/lib/supabase/service.ts`)
- Dual-layer storage architecture: Supabase PostgreSQL remote persistence + synchronous local storage fallback.
- **Refresh Persistence Guarantee:** Creating a forecast and logging consumption remains preserved via client fallback cache across full browser page reloads.

### F. Kitchen Control Center UI
- Redesigned with Apple-level simplicity: 1 primary operational card per screen, 1 primary CTA, zero clutter.
- Responsive design across desktop, tablet, and mobile.

---

## 3. Architecture Overview

```
[ User / Kitchen Manager ]
          │
          ▼
[ FOODFLOW Next.js 16 UI ]
          │
    ┌─────┴─────────────────────────────┐
    ▼                                   ▼
[ POST /api/forecast ]         [ POST /api/consumption ]
    │                                   │
    ▼                                   ▼
[ Deterministic Regressor ]    [ Balance Evaluator ]
    │ (Numerical Forecast)              │ (Surplus / Shortage)
    ├─────────────────────┐             │
    ▼                     ▼             ▼
[ Supabase PostgreSQL ] [ Gemini AI ] [ Supabase PostgreSQL ]
(demand_forecasts)     (Explanations) (daily_consumption)
```

---

## 4. Test Verification Matrix

| Component / Workflow | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **Next.js Production Build** | `npm run build` | Turbopack compilation without TS errors | **PASS** |
| **TypeScript Typecheck** | `npx tsc --noEmit` | Clean zero-error compilation | **PASS** |
| **Forecast Engine** | 800 diners, Lunch, None | 742 predicted, 760 prep, Medium risk | **PASS** |
| **Forecast API** | `POST /api/forecast` | Returns JSON with forecastId & metrics | **PASS** |
| **Consumption Surplus** | 760 prep, 728 served | 32 remaining, status `SURPLUS` | **PASS** |
| **Consumption Shortage** | 700 prep, 728 served | 0 remaining, status `SHORTAGE` | **PASS** |
| **Consumption Balanced** | 728 prep, 728 served | 0 remaining, status `BALANCED` | **PASS** |
| **Consumption API** | `POST /api/consumption` | Returns balanceStatus & remaining | **PASS** |
| **Page Refresh Persistence** | Reload browser at `#dashboard` | Forecast & consumption remain intact | **PASS** |

---

## 5. Known Limitations (Honest Disclosure)
- **Supabase Cloud Credentials:** If live network Supabase keys are not present in `.env.local`, the application seamlessly falls back to persistent storage to guarantee zero crash behavior during live demonstrations.
- **Weather & Calendar APIs:** External live meteorology APIs are simulated via the context parameter (`None`, `Heavy Weather`, `Exam Week`) rather than live third-party radar feeds.

---

## 6. Next Development Phase (Round 3 Roadmap)
1. **Automated Vector Routing:** Direct multi-stop route optimization for recovery courier vans.
2. **Turnstile IoT Webhook Integration:** Live RFID badge ingress streaming directly into PostgreSQL.
3. **Automated Weekly Weight Recalibration:** Closed-loop regression retraining based on 90-day history tables.
