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
- **Empirical Historical Dataset:** Grounded in 25 authentic service records for Hyderabad institutional dining (`src/lib/data/historicalServices.ts`) across Lunch, Breakfast, and Dinner shifts.
- **Parametric Inputs:** Expected registered diners (e.g. 820), meal shift (Lunch), scheduled menu, campus context factor (Sunny / Regular, Heavy Rain, Campus Fest).
- **Mathematical Multi-Dish Yield:** Computes expected attendance ($795$ predicted on 820 expected, $\sim 96.95\%$ historical ratio) and dish-by-dish preparation quantities in real physical culinary units:
  - Steamed Sona Masoori Rice: **43.0 kg**
  - Dal Tadka: **18.0 L**
  - Andhra Chicken Curry: **31.0 kg**
  - Mixed Veg Korma: **16.5 kg**
  - Fresh Set Curd: **12.0 L**
- **Two-Stage Batch Staging:** Splits each dish into Initial Cook (84%) and Reserve Staging (16% cooked only if turnstiles cross 80% at 1:15 PM), preventing kitchen overproduction before it happens.
- **Risk Assessment:** Dynamic operational risk (`LOW`, `MEDIUM`, `HIGH`) derived from shift variance.

### B. Forecast API (`POST /api/forecast`)
- Validates input headcount and meal type.
- Executes deterministic calculations and dish conversion.
- Prompts Google Gemini (3.8 Flash) asynchronously strictly for qualitative operational advice (staged batch timing).
- Persists record directly into Supabase PostgreSQL table `public.demand_forecasts`.
- Graceful degradation: If Gemini is offline, deterministic forecasts complete with verified local explanations.

### C. Consumption & Variance Engine (`src/lib/business/balance.ts`)
- **Dish-Level Consumption Tracking:** Real-time logging of prepared, served, and unserved pan leftovers.
- **Leftover $\neq$ Waste Principle:** Safely hot-held food ($\ge 63^\circ\text{C}$) is flagged as high-priority recoverable surplus; only non-recoverable food is classified as organic kitchen waste.
- **Automated State Detection:**
  - `SURPLUS`: Triggered when unserved pan leftovers exist (e.g. 3.2 kg Rice, 2.5 kg Chicken Curry, 1.8 L Dal).
  - `SHORTAGE`: Triggered when demand exceeds prepared trays.
  - `BALANCED`: Triggered when preparation matches attendance within tolerance.
- **Variance Cause Analysis:** Diagnoses causes (e.g. "Low attendance vs expected registration: 795 expected vs 748 actual").

### D. Consumption API (`POST /api/consumption`)
- Ingests dish arrays and total headcounts.
- Evaluates surplus/shortage balance and waste analysis.
- Persists record into Supabase PostgreSQL table `public.daily_consumption`.
- Triggers active surplus listings for rescue routing.

### E. Interactive Spatial Recovery Corridor (`src/components/recovery/RecoveryMapbox.tsx`)
- **Mapbox GL JS 3.10 Integration:** Live vector map centered on Hyderabad institutional corridor.
- **Geodesic Haversine Distance Engine (`src/lib/geo/distance.ts`):** Calculates real spherical distances between kitchen dock and verified local partners:
  - Robin Hood Army Gachibowli: **2.8 km**
  - Feeding India Madhapur: **4.6 km**
  - Annamrita Foundation Kondapur: **3.4 km**
  - Aasara Welfare Society Tolichowki: **6.2 km**
- **Interactive Dispatch Flow:** Direct marker click $\to$ card sync $\to$ pickup schedule modal with OTP generation.
- **Resilient Fallback:** Displays interactive GIS partner cards if Mapbox token is unset or network is offline.

### F. Kitchen Control Center UI
- Redesigned with calm visual hierarchy and high information density without clutter.
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
[ Empirical Regressor ]         [ Balance & Waste Evaluator ]
    │ (Dishes in kg, L, pieces)         │ (Leftover != Waste)
    ├─────────────────────┐             │
    ▼                     ▼             ▼
[ Supabase PostgreSQL ] [ Gemini AI ] [ Mapbox GL JS ]
(demand_forecasts)     (Copilot Only) (Hyderabad Corridor)
```

---

## 4. Test Verification Matrix

| Component / Workflow | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **Next.js Production Build** | `npm run build` | Turbopack compilation without TS errors | **PASS** |
| **TypeScript Typecheck** | `npx tsc --noEmit` | Clean zero-error compilation | **PASS** |
| **Forecast Engine (Diners)** | 820 expected, Lunch, Regular | 795 predicted diners (96.95% ratio) | **PASS** |
| **Forecast Engine (Dishes)** | 820 expected, Lunch, Regular | 43 kg Rice, 18 L Dal, 31 kg Chicken, etc. | **PASS** |
| **Two-Stage Batch Staging** | 43 kg Rice total | 36.1 kg Initial Cook + 6.9 kg Reserve | **PASS** |
| **Forecast API** | `POST /api/forecast` | Returns JSON with dishes & batch plan | **PASS** |
| **Haversine Distance Engine** | Hyderabad Kitchen to Gachibowli | 2.8 km calculated | **PASS** |
| **Consumption Surplus** | Rice 43 prep, 39.8 served, 3.2 leftover | Status `SURPLUS`, 3.2 kg Rice surplus | **PASS** |
| **Leftover != Waste** | Unserved pan food at >= 63°C | Flagged as recoverable surplus, not waste | **PASS** |
| **Mapbox & Fallback** | Mapbox token unset or offline | Graceful interactive GIS corridor cards | **PASS** |
| **Page Refresh Persistence** | Reload browser at `#dashboard` | Operational metrics preserved | **PASS** |


---

## 5. Known Limitations (Honest Disclosure)
- **Supabase Cloud Credentials:** If live network Supabase keys are not present in `.env.local`, the application seamlessly falls back to persistent storage to guarantee zero crash behavior during live demonstrations.
- **Weather & Calendar APIs:** External live meteorology APIs are simulated via the context parameter (`None`, `Heavy Weather`, `Exam Week`) rather than live third-party radar feeds.

---

## 6. Next Development Phase (Round 3 Roadmap)
1. **Automated Vector Routing:** Direct multi-stop route optimization for recovery courier vans.
2. **Turnstile IoT Webhook Integration:** Live RFID badge ingress streaming directly into PostgreSQL.
3. **Automated Weekly Weight Recalibration:** Closed-loop regression retraining based on 90-day history tables.
