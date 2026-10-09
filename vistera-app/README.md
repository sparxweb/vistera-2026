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

# Run full automated verification suite (68 tests)
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

## 2. Directory Structure

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

## 3. Full Master Documentation

For all architectural diagrams, mathematical equations, API contracts, database DDLs, test reports, judge Q&As, and live demonstration scripts, refer directly to:

👉 [**`FOODFLOW_MASTER_DOCUMENTATION.md`**](../FOODFLOW_MASTER_DOCUMENTATION.md)
