# FOODFLOW — Relational Database Schema & Architecture

**Platform:** Supabase / PostgreSQL  
**Problem Statement:** PS-44 — Cutting Food Waste  
**Hackathon:** VISTERA 2026 (Round 2 MVP Specification)  

---

## 1. Schema Entity Relationship Model

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
                    │ kitchen_id (FK -> kitchens│
                    │ service_date (DATE)       │
                    │ service_meal (TEXT)       │
                    │ menu_item (TEXT)          │
                    │ expected_diners (INT)     │
                    │ predicted_demand (INT)    │
                    │ recommended_prep (INT)    │
                    │ operational_risk (TEXT)   │
                    │ ai_explanation (TEXT)     │
                    │ created_at (TIMESTAMPTZ)  │
                    └─────────────┬─────────────┘
                                  │ 1
                                  │
                                  │ *
                    ┌─────────────▼─────────────┐
                    │    DAILY_CONSUMPTION      │
                    │───────────────────────────│
                    │ id (PK, UUID)             │
                    │ forecast_id (FK -> fc)    │
                    │ kitchen_id (FK -> kitchen)│
                    │ prepared_quantity (INT)   │
                    │ served_quantity (INT)     │
                    │ remaining_quantity (INT)  │
                    │ balance_status (TEXT)     │
                    │ recorded_at (TIMESTAMPTZ) │
                    └─────────────┬─────────────┘
                                  │ 1
                                  │
                                  │ 0..1
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
                    └───────────────────────────┘
```

---

## 2. Table Definitions

### A. `kitchens`
Stores physical institutional dining hall facilities, base seating capacity, and standard safety buffers.
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `name` (TEXT, NOT NULL) — e.g., "Campus Central Dining Hall"
- `total_capacity` (INTEGER, NOT NULL) — Maximum facility diner throughput
- `default_buffer_pct` (NUMERIC(4,2), NOT NULL) — Standard overage margin (e.g. 2.40%)
- `address` (TEXT) — Physical loading bay location
- `created_at` (TIMESTAMPTZ, default `now()`)
- `updated_at` (TIMESTAMPTZ, default `now()`)

### B. `demand_forecasts`
Stores deterministic demand estimates computed before meal service opens.
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `kitchen_id` (UUID, Foreign Key $\to$ `kitchens(id)`)
- `service_date` (DATE, NOT NULL) — Meal date
- `service_meal` (TEXT, NOT NULL) — "Breakfast" | "Lunch" | "Dinner"
- `menu_item` (TEXT, NOT NULL) — Scheduled recipe
- `expected_diners` (INTEGER, NOT NULL) — Campus swipe-in or reservation count
- `predicted_demand` (INTEGER, NOT NULL) — Computed demand headcount
- `recommended_preparation` (INTEGER, NOT NULL) — Demand + safety buffer
- `operational_risk` (TEXT, CHECK IN ('LOW', 'MEDIUM', 'HIGH'))
- `ai_explanation` (TEXT) — Qualitative synthesis from Gemini
- `created_at` (TIMESTAMPTZ, default `now()`)

### C. `daily_consumption`
Stores post-service actual headcount numbers and calculates variance.
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `forecast_id` (UUID, Foreign Key $\to$ `demand_forecasts(id)`)
- `kitchen_id` (UUID, Foreign Key $\to$ `kitchens(id)`)
- `prepared_quantity` (INTEGER, NOT NULL) — Trays cooked
- `served_quantity` (INTEGER, NOT NULL) — Diners served
- `remaining_quantity` (INTEGER, NOT NULL) — Surplus portions ($\max(0, P - S)$)
- `balance_status` (TEXT, CHECK IN ('SURPLUS', 'SHORTAGE', 'BALANCED'))
- `recorded_at` (TIMESTAMPTZ, default `now()`)

### D. `surplus_listings`
Surplus pan dispatches generated when `balance_status = 'SURPLUS'`.
- `id` (UUID, Primary Key)
- `consumption_id` (UUID, Foreign Key $\to$ `daily_consumption(id)`)
- `food_description` (TEXT, NOT NULL)
- `quantity_servings` (INTEGER, NOT NULL)
- `prep_time` (TIMESTAMPTZ)
- `expiry_time` (TIMESTAMPTZ, NOT NULL) — Strict temperature window limit (2 hours)
- `status` (TEXT, CHECK IN ('ACTIVE', 'VIEWED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'COLLECTED'))
- `pickup_location` (TEXT, NOT NULL)

### E. `recovery_orgs`
Verified local NGO partners, community pantries, and shelters.
- `id` (UUID, Primary Key)
- `org_name` (TEXT, NOT NULL)
- `contact_phone` (TEXT)
- `distance_km` (NUMERIC(4,1))
- `max_capacity_meals` (INTEGER)
- `verified_status` (BOOLEAN, default `true`)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `accepted_food_types` (TEXT[])

---

## 3. Database Migration Location
Reproducible SQL migrations are stored in:
- `supabase/migrations/20261008000000_foodflow_core_schema.sql`
- `supabase/migrations/20261008000001_seed_demo_data.sql`

To apply in Supabase CLI or SQL Editor:
```bash
supabase db push
# or execute directly in Supabase Dashboard SQL Editor
```
