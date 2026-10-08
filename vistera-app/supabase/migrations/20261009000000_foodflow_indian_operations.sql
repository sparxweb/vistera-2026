-- ==============================================================================
-- FOODFLOW: Expanded Relational Schema for Indian Institutional Operations
-- Platform: Supabase / PostgreSQL (RFC 4122 v4 UUIDs)
-- Problem: VISTERA 2026 PS-44 — Cutting Food Waste
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. KITCHENS TABLE (Expanded with Geolocation & Facility Type)
CREATE TABLE IF NOT EXISTS public.kitchens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    facility_type TEXT NOT NULL DEFAULT 'College Hostel Dining Hall',
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    address TEXT,
    latitude DOUBLE PRECISION NOT NULL DEFAULT 17.4447,
    longitude DOUBLE PRECISION NOT NULL DEFAULT 78.3483,
    capacity INTEGER NOT NULL DEFAULT 1000,
    default_buffer_pct NUMERIC(4,2) NOT NULL DEFAULT 3.00,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MENU_ITEMS TABLE (Dishes with Real Kitchen Units)
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Staple', 'Dal & Gravy', 'Curry / Protein', 'Side', 'Dairy')),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'L', 'pieces', 'portions')),
    default_serving_size NUMERIC(6,4) NOT NULL, -- e.g. 0.0526 kg/diner for rice
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SERVICE_RECORDS TABLE (Historical & Active Shifts)
CREATE TABLE IF NOT EXISTS public.service_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner')),
    expected_diners INTEGER NOT NULL,
    actual_diners INTEGER,
    context TEXT NOT NULL DEFAULT 'Standard' CHECK (context IN ('Standard', 'Exam Week', 'Heavy Rain', 'Weekend / Event')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. HISTORICAL_CONSUMPTION TABLE (Dish-Level Service Outcomes)
CREATE TABLE IF NOT EXISTS public.historical_consumption (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_record_id UUID REFERENCES public.service_records(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    prepared_quantity NUMERIC(8,2) NOT NULL,
    served_quantity NUMERIC(8,2) NOT NULL,
    leftover_quantity NUMERIC(8,2) NOT NULL,
    waste_quantity NUMERIC(8,2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 5. DEMAND_FORECASTS TABLE (Deterministic Statistical Predictions)
CREATE TABLE IF NOT EXISTS public.demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    service_meal TEXT NOT NULL DEFAULT 'Lunch',
    menu_item TEXT NOT NULL,
    expected_diners INTEGER NOT NULL,
    predicted_demand INTEGER NOT NULL,
    recommended_preparation INTEGER NOT NULL,
    operational_risk TEXT NOT NULL DEFAULT 'LOW' CHECK (operational_risk IN ('LOW', 'MEDIUM', 'HIGH')),
    ai_explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PREPARATION_RECOMMENDATIONS TABLE (Dish-Level Prep Plans & Batch Staging)
CREATE TABLE IF NOT EXISTS public.preparation_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES public.demand_forecasts(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    predicted_quantity NUMERIC(8,2) NOT NULL,
    buffer_quantity NUMERIC(8,2) NOT NULL,
    recommended_quantity NUMERIC(8,2) NOT NULL,
    initial_batch_quantity NUMERIC(8,2) NOT NULL,
    reserve_batch_quantity NUMERIC(8,2) NOT NULL,
    batch_trigger_condition TEXT,
    unit TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. DAILY_CONSUMPTION TABLE (Real-Time Service Logging)
CREATE TABLE IF NOT EXISTS public.daily_consumption (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES public.demand_forecasts(id) ON DELETE SET NULL,
    kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
    prepared_quantity INTEGER NOT NULL,
    served_quantity INTEGER NOT NULL,
    remaining_quantity INTEGER NOT NULL,
    balance_status TEXT NOT NULL DEFAULT 'SURPLUS' CHECK (balance_status IN ('SURPLUS', 'SHORTAGE', 'BALANCED')),
    recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SURPLUS_LISTINGS TABLE (Rescue Dispatches in kg/L)
CREATE TABLE IF NOT EXISTS public.surplus_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
    consumption_id UUID REFERENCES public.daily_consumption(id) ON DELETE SET NULL,
    food_description TEXT NOT NULL,
    quantity NUMERIC(8,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    quantity_servings INTEGER NOT NULL,
    prep_time TIMESTAMPTZ DEFAULT now(),
    pickup_deadline TIMESTAMPTZ NOT NULL,
    storage_state TEXT NOT NULL DEFAULT 'Hot Held (≥63°C)',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'VIEWED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'COLLECTED')),
    pickup_location TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. RECOVERY_ORGS TABLE (Seeded Demo Partners with Hyderabad Geolocation)
CREATE TABLE IF NOT EXISTS public.recovery_orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name TEXT NOT NULL,
    organization_type TEXT NOT NULL DEFAULT 'Volunteer Food Rescue Network',
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    address TEXT NOT NULL,
    contact_phone TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    daily_capacity_meals INTEGER NOT NULL DEFAULT 250,
    current_capacity_meals INTEGER NOT NULL DEFAULT 90,
    food_category_needed TEXT NOT NULL DEFAULT 'Cooked Hot Meals',
    status TEXT NOT NULL DEFAULT 'Accepting' CHECK (status IN ('Accepting', 'On Standby', 'Capacity Full')),
    source_type TEXT NOT NULL DEFAULT 'Seeded Demo Partner',
    verified_status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. PICKUP_RECORDS TABLE (Rescue Handoff Manifests)
CREATE TABLE IF NOT EXISTS public.pickup_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surplus_listing_id UUID REFERENCES public.surplus_listings(id) ON DELETE CASCADE,
    recovery_org_id UUID REFERENCES public.recovery_orgs(id) ON DELETE CASCADE,
    scheduled_pickup TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'ACCEPTED' CHECK (status IN ('ACCEPTED', 'PICKUP_SCHEDULED', 'COLLECTED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preparation_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surplus_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_records ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies for Hackathon Demonstration
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kitchens' AND policyname = 'Public Access for Kitchens') THEN
        CREATE POLICY "Public Access for Kitchens" ON public.kitchens FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'menu_items' AND policyname = 'Public Access for Menu Items') THEN
        CREATE POLICY "Public Access for Menu Items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_records' AND policyname = 'Public Access for Service Records') THEN
        CREATE POLICY "Public Access for Service Records" ON public.service_records FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'historical_consumption' AND policyname = 'Public Access for Historical Consumption') THEN
        CREATE POLICY "Public Access for Historical Consumption" ON public.historical_consumption FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'demand_forecasts' AND policyname = 'Public Access for Forecasts') THEN
        CREATE POLICY "Public Access for Forecasts" ON public.demand_forecasts FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'preparation_recommendations' AND policyname = 'Public Access for Prep Recs') THEN
        CREATE POLICY "Public Access for Prep Recs" ON public.preparation_recommendations FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_consumption' AND policyname = 'Public Access for Consumption') THEN
        CREATE POLICY "Public Access for Consumption" ON public.daily_consumption FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'surplus_listings' AND policyname = 'Public Access for Surplus') THEN
        CREATE POLICY "Public Access for Surplus" ON public.surplus_listings FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recovery_orgs' AND policyname = 'Public Access for Orgs') THEN
        CREATE POLICY "Public Access for Orgs" ON public.recovery_orgs FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pickup_records' AND policyname = 'Public Access for Pickups') THEN
        CREATE POLICY "Public Access for Pickups" ON public.pickup_records FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
