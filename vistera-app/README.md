# FOODFLOW Application (`/vistera-app`)

> **FOODFLOW — Predict. Prevent. Recover.**  
> **Master Project Reference:** See the comprehensive judge-ready master document at [**`../FOODFLOW_MASTER_DOCUMENTATION.md`**](../FOODFLOW_MASTER_DOCUMENTATION.md).  
> **Root Overview:** See [**`../README.md`**](../README.md).

---

## 1. Quick Start

```bash
# Install dependencies
npm install

# Start local Next.js development server
npm run dev

# Run full automated verification suite (76 tests)
npm test
# or: npx tsx tests/foodflow-suite.mjs

# Verify type safety
npx tsc --noEmit

# Run linter
npm run lint

# Test production build
npm run build
```

**Release Verification Report:** See [**`ROUND3_FULL_SYSTEM_AUDIT_REPORT.md`**](./ROUND3_FULL_SYSTEM_AUDIT_REPORT.md).

Open [http://localhost:3000](http://localhost:3000) to view the live application.

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

## 3. Directory Structure

- `src/app/` — Next.js 14 App Router layout, main page, and server API routes (`/api/forecast`, `/api/consumption`, `/api/ai`).
- `src/components/` — UI screens (`OverviewScreen`, `DemandForecastScreen`, `FoodPrepScreen`, `ServiceTrackingScreen`, `RecoveryScreen`, `NgoInboxScreen`, `NgoPickupsScreen`, `NgoHistoryScreen`, `NotificationsScreen`).
- `src/components/recovery/` — Modals for offer creation, safety review, pickup scheduling, and Leaflet map component (`RecoveryMapbox.tsx`).
- `src/lib/business/` — Deterministic demand forecasting engine (`forecast.ts`) and variance logic (`balance.ts`).
- `src/lib/recovery/` — Two-sided offer lifecycle service (`offerService.ts`).
- `src/lib/storage/` — Shared persistence bridges (`serviceTrackingStorage.ts`).
- `src/lib/demoData.ts` — 12-item Indian menu catalogue and 7 Hyderabad recovery partner profiles.
- `supabase/migrations/` — SQL schema migrations for core operations and recovery upgrades.
- `tests/` — Automated Node.js verification test suite (`foodflow-suite.mjs`).

---

## 4. Full Master Documentation

For all architectural diagrams, mathematical equations, API contracts, database DDLs, test reports, judge Q&As, and live demonstration scripts, refer directly to:

👉 [**`FOODFLOW_MASTER_DOCUMENTATION.md`**](../FOODFLOW_MASTER_DOCUMENTATION.md)
