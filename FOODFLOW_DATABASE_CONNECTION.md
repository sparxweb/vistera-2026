# FOODFLOW — Database Architecture & Connection Audit
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Audit Timestamp: October 9, 2026*

---

## 1. Database Architecture & Engine
FOODFLOW is architected for **Supabase PostgreSQL** as its primary cloud relational persistence engine, backed by an **offline-ready local fallback storage engine (`localStorage`)**.

```
+---------------------------------------------------------------------------------+
|                               Browser Client (React 19)                         |
|  - Manages session state, UI forms, and interactive views                       |
+---------------------------------------------------------------------------------+
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      Next.js Route Handlers                        Client Data Service
      (/api/forecast, /api/consumption)             (src/lib/supabase/service.ts)
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼
                             Supabase Client Instance
                            (src/lib/supabase/client.ts)
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
         Supabase PostgreSQL DB                     Local Fallback Storage
         (Remote Cloud Instance)                    (Browser LocalStorage / RAM)
         Status: Endpoint Reachable                 Status: ACTIVE & TESTED
         Schema: Tables Not Created (PGRST205)      Full State Retained On Refresh
```

---

## 2. Table Definitions & Entity Relationship Model

The relational schema is authored in `vistera-app/supabase/migrations/20261008000000_foodflow_core_schema.sql`:

```
                    ┌───────────────────────────┐
                    │         KITCHENS          │
                    │───────────────────────────│
                    │ id (PK, UUID)             │
                    │ name (TEXT)               │
                    │ total_capacity (INT)      │
                    │ default_buffer_pct (NUM)  │
                    │ address (TEXT)            │
                    │ created_at (TIMESTAMPTZ)  │
                    └─────────────┬─────────────┘
                                  │ 1
                                  │
                                  │ *
                    ┌─────────────▼─────────────┐
                    │     DEMAND_FORECASTS      │
                    │───────────────────────────│
                    │ id (PK, UUID)             │
                    │ kitchen_id (FK -> kitchens)
                    │ service_date (DATE)       │
                    │ service_meal (TEXT)       │
                    │ menu_item (TEXT)          │
                    │ expected_diners (INT)     │
                    │ predicted_demand (INT)    │
                    │ recommended_preparation   │
                    │ operational_risk (TEXT)   │
                    │ ai_explanation (TEXT)     │
                    │ created_at (TIMESTAMPTZ)  │
                    └─────────────┬─────────────┘
                                  │ 1
                                  │
                                  │ *
                    ┌─────────────▼─────────────┐
                    │     DAILY_CONSUMPTION     │
                    │───────────────────────────│
                    │ id (PK, UUID)             │
                    │ forecast_id (FK -> fc)    │
                    │ kitchen_id (FK -> kit)    │
                    │ prepared_quantity (INT)   │
                    │ served_quantity (INT)     │
                    │ remaining_quantity (INT)  │
                    │ balance_status (TEXT)     │
                    │ recorded_at (TIMESTAMPTZ) │
                    └─────────────┬─────────────┘
                                  │ 1
                                  │
                                  │ *
                    ┌─────────────▼─────────────┐
                    │     SURPLUS_LISTINGS      │
                    │───────────────────────────│
                    │ id (PK, UUID)             │
                    │ consumption_id (FK)       │
                    │ food_description (TEXT)   │
                    │ quantity_servings (INT)   │
                    │ prep_time (TIMESTAMPTZ)   │
                    │ expiry_time (TIMESTAMPTZ) │
                    │ status (TEXT)             │
                    │ pickup_location (TEXT)    │
                    │ created_at (TIMESTAMPTZ)  │
                    └─────────────┬─────────────┘
                                  │ 1
                                  │
                                  │ *
┌───────────────────────────┐     │
│       RECOVERY_ORGS       │     │
│───────────────────────────│     │
│ id (PK, UUID)             │     │
│ org_name (TEXT)           │     │
│ contact_phone (TEXT)      │     │
│ distance_km (NUMERIC)     │     │
│ max_capacity_meals (INT)  │     │
│ verified_status (BOOLEAN) │     │
│ latitude (DOUBLE)         │     │
│ longitude (DOUBLE)        │     │
│ accepted_food_types (ARR) │     │
│ availability (TEXT)       │     │
│ created_at (TIMESTAMPTZ)  │     │
└─────────────┬─────────────┘     │
              │ 1                 │
              │                   │
              │ *                 │
┌─────────────▼───────────────────▼─────────────┐
│                 PICKUP_RECORDS                │
│───────────────────────────────────────────────│
│ id (PK, UUID)                                 │
│ listing_id (FK -> surplus_listings)           │
│ org_id (FK -> recovery_orgs)                  │
│ accepted_at (TIMESTAMPTZ)                     │
│ scheduled_pickup (TIMESTAMPTZ)                │
│ completed_at (TIMESTAMPTZ)                    │
│ outcome_status (TEXT)                         │
│ created_at (TIMESTAMPTZ)                      │
└───────────────────────────────────────────────┘
```

---

## 3. Migration & Remote Verification Audit

To ensure complete honesty, we distinguish between four distinct database states:
- **A. SQL schema defined in source code:** `YES` (`20261008000000_foodflow_core_schema.sql`).
- **B. Migration ready to execute:** `YES` (Valid PostgreSQL DDL with RLS and indexes).
- **C. Migration executed against remote Supabase project:** `NO` (Schema has not been pushed to the remote instance).
- **D. Remote read/write tested successfully:** `NO` (Remote database responds with `PGRST205`).

### Empirical Test Result (Executed October 9, 2026):
```
Testing Supabase Endpoint: https://<project-ref>.supabase.co
Query: supabase.from('kitchens').select('*').limit(1)
Result: FAILED - Could not find the table 'public.kitchens' in the schema cache (code: PGRST205)
```

### Explanation of Status:
The Supabase URL and Publishable Key configured in `.env.local` connect to an active, valid Supabase project. However, the database tables have not yet been created in that remote project via the Supabase dashboard or CLI migration command. 

---

## 4. Local Fallback Persistence Behavior
FOODFLOW's data layer (`src/lib/supabase/service.ts`) was specifically built with a resilient dual-mode strategy:
1. When calling `loadInitialState()`, `persistForecast()`, `persistConsumption()`, or `persistSurplusListing()`, the application first writes to/reads from `localStorage`.
2. It then attempts an asynchronous call to Supabase.
3. If Supabase fails (due to network disconnection or unapplied schema tables), the error is caught cleanly with `console.warn`, and the application continues to run on local persistent storage.
4. **Result:** All forecasts, post-service shift audits, surplus listings, and pickup status updates **survive full page reloads and browser restarts**.

---

## 5. Required Environment Variables
For Supabase connectivity:
```bash
# Public API Gateway URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Safe Publishable Anonymous Key (Client & Server)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

### Security & Access Control:
- The `SUPABASE_SERVICE_ROLE_KEY` is **NOT exposed** to the client.
- The SQL schema explicitly enables **Row Level Security (RLS)** on all six tables:
  ```sql
  ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.daily_consumption ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.surplus_listings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.recovery_orgs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.pickup_records ENABLE ROW LEVEL SECURITY;
  ```
- Permissive policies allow public read/write in Hackathon Demo Mode without leaking administrative privileges.
