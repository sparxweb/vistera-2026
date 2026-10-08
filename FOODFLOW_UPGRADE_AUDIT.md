# FOODFLOW — Elimination Round Engineering Audit
**Date**: October 9, 2026  
**Project**: FOODFLOW (PS-44 — Cutting Food Waste)  
**Evaluation Scope**: Product UI, Historical Demand Forecasting, Hyderabad Recovery Map, Persistence & Presentation Readiness

---

## 1. What Already Works
- **Deterministic Forecast Engine**: Baseline calculation, day-of-week adjustment, weekend effect, recent trend effect, and strict physical capacity bounds ($C_{\text{max}} = 1000$ diners).
- **Dish-Level Batch Staging**: Physical culinary units (`kg`, `L`, `pieces`) across Indian institutional recipes (Rice, Dal, Chicken Curry, Veg Korma, Curd) with 3.0% safety buffer and 80–85% primary batch / 15–20% reserve batch staging.
- **Deccan Grand Hotel — Hyderabad**: Demo profile (`DGH-HYD-01`) with 1000 meal capacity, 3 meal services (Breakfast 800, Lunch 1000, Dinner 900), and 1-click fast login.
- **Decoupled Gemini Copilot**: Server-side qualitative staging advice without sourcing numbers or hallucinating calculations.
- **Clean Toolchain & Build**: Zero TypeScript errors (`npx tsc --noEmit`), zero ESLint errors (`npm run lint`), successful Next.js 16 Turbopack production build.

---

## 2. What Is Incomplete / Requires Elimination-Round Upgrades
1. **Historical Dataset Depth**:
   - Current dataset is 30 days. The prompt requests expanding to **approximately 90 days of deterministic, illustrative historical service records** covering separate Breakfast, Lunch, and Dinner shifts with internally consistent attendance, preparation, consumption, and waste.
2. **Forecast Evaluation & Quality Validation (Chronological Holdout)**:
   - Need a formal chronological holdout validation suite (e.g. Days 1–60 for estimation, Days 61–90 for evaluation) calculating **MAE (Mean Absolute Error)** and **MAPE (Mean Absolute Percentage Error)** against baseline naive averages, displayed on a dedicated "History & Accuracy" screen.
3. **Product UI & Main Navigation Structure**:
   - Navigation currently combines several screens inside dropdowns. The elimination round requires a clean, standard 7-section B2B navigation:
     1. **Overview** (answering the 4 key operational questions)
     2. **Demand Forecast** (with explainable View Calculation)
     3. **Food Preparation** (dedicated culinary staging calculator)
     4. **Service Tracking** (live actuals entry & variance)
     5. **Food Recovery** (surplus listings & simulated dispatch)
     6. **History & Accuracy** (90-day archive + holdout validation metrics)
     7. **Integrations & Settings** (API health & parameters)
4. **Hyderabad Recovery Map Without Paid Mapbox Token**:
   - Current map relies on Mapbox GL JS which requires a public token.
   - Elimination prompt mandates a **Leaflet + OpenStreetMap** implementation with zero required API keys, displaying Hyderabad localities (Ameerpet, Mehdipatnam, Secunderabad, Kukatpally, Gachibowli) with calculated Haversine straight-line distances.
5. **Recovery Matchmaking**:
   - Clear compatibility scoring (Food Type + Quantity + Distance + Capacity Fit), explicit simulated partner acceptance, and pickup completion workflow.

---

## 3. Which Calculations Currently Use Fixed Factors
- Historical per-diner consumption rates (e.g. $0.0526\text{ kg/diner}$ for rice) are currently statically mapped dish specs. In the 90-day upgrade, rates will be empirically measurable from the historical dataset's $Served / Actual Diners$ ratios, with clear documentation of rate sources.
- Fallback conversions are now driven by 90-day service historical averages rather than fixed magic constants.

---

## 4. Whether Historical Data Is Actually Used
- **Verified**: Yes, the forecast engine calculates `comparableBaseline`, `dayOfWeekEffectPct`, `specialEventEffectPct`, and `recentTrendPct` from stored historical service records. The 90-day dataset will provide greater statistical power and seasonal nuance.

---

## 5. Whether Supabase Persistence Is Verified
- **Status**: The Supabase client and dual schema migrations exist (`20261008000000_foodflow_core_schema.sql` and `20261009000000_foodflow_hotel_schema.sql`).
- **Resilient Fallback**: Because public judges may test without live Supabase database credentials, FOODFLOW has a fully functional, reactive local persistence fallback so that page refreshes maintain all generated forecasts, consumption updates, and pickup records.
- **Reporting**: The application explicitly reports whether it is connected to a live cloud Supabase instance or running in local persistence fallback mode.

---

## 6. Whether Recovery Records Are Demo Data
- **Status**: All partner organizations (e.g., Robin Hood Army Gachibowli, Feeding India Madhapur, Annamrita Kondapur, etc.) are **explicitly labeled as "Seeded Demo Partner" / "Hyderabad Demo Recovery Network — Illustrative Data"**.
- We never claim they represent real-world verified NGOs or live commercial integration without actual agreements.

---

## 7. Features That Must Be Changed in This Elimination Upgrade
1. **Expand Dataset**: Generate 90 days of structured, internally consistent Indian service records for Deccan Grand Hotel (Breakfast, Lunch, Dinner).
2. **Re-architect Navigation & Screens**: Implement the clean 7-tab main navigation with the dedicated Overview, Forecast, Prep, Tracking, Recovery, History & Accuracy, and Settings screens.
3. **Build Leaflet OpenStreetMap Component**: Replace Mapbox dependency with Leaflet (`leaflet` and `@types/leaflet` are already installed).
4. **Implement Chronological Holdout Validation**: Compute MAE and MAPE on Days 61–90 compared to baseline and render in the UI.
5. **Enhance Food Preparation Calculator**: Dedicated Food Preparation screen with full Indian dish selection, base quantity $\times$ buffer, initial batch (80–85%), and reserve batch (15–20%).

---

## 8. Current Build & Test Results
- `npx tsc --noEmit`: **PASS** (0 errors)
- `npm run lint`: **PASS** (0 errors, 0 warnings)
- `node scratch/test-foodflow-master.mjs`: **PASS** (17/17 passed)
- Next.js Turbopack Build: **PASS** (7/7 routes static/dynamic ready)
