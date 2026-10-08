-- ==============================================================================
-- FOODFLOW: Core Relational Database Schema
-- Platform: Supabase / PostgreSQL
-- Problem: VISTERA 2026 PS-44 — Cutting Food Waste
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. KITCHENS TABLE
CREATE TABLE IF NOT EXISTS public.kitchens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    total_capacity INTEGER NOT NULL DEFAULT 1200,
    default_buffer_pct NUMERIC(4,2) NOT NULL DEFAULT 2.40,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. DEMAND_FORECASTS TABLE
CREATE TABLE IF NOT EXISTS public.demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kitchen_id UUID REFERENCES public.kitchens(id) ON DELETE CASCADE,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    service_meal TEXT NOT NULL DEFAULT 'Lunch',
    menu_item TEXT NOT NULL,
    expected_diners INTEGER NOT NULL,
    predicted_demand INTEGER NOT NULL,
    recommended_preparation INTEGER NOT NULL,
    operational_risk TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (operational_risk IN ('LOW', 'MEDIUM', 'HIGH')),
    ai_explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DAILY_CONSUMPTION TABLE
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

-- 4. SURPLUS_LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.surplus_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumption_id UUID REFERENCES public.daily_consumption(id) ON DELETE SET NULL,
    food_description TEXT NOT NULL,
    quantity_servings INTEGER NOT NULL,
    prep_time TIMESTAMPTZ DEFAULT now(),
    expiry_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'VIEWED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'COLLECTED')),
    pickup_location TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. RECOVERY_ORGS TABLE
CREATE TABLE IF NOT EXISTS public.recovery_orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name TEXT NOT NULL,
    contact_phone TEXT,
    distance_km NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    max_capacity_meals INTEGER NOT NULL DEFAULT 100,
    verified_status BOOLEAN NOT NULL DEFAULT true,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accepted_food_types TEXT[] DEFAULT ARRAY['Cooked Hot Meals'],
    availability TEXT DEFAULT 'Immediate',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PICKUP_RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.pickup_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.surplus_listings(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.recovery_orgs(id) ON DELETE CASCADE,
    accepted_at TIMESTAMPTZ DEFAULT now(),
    scheduled_pickup TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    outcome_status TEXT NOT NULL DEFAULT 'ACCEPTED' CHECK (outcome_status IN ('ACCEPTED', 'PICKUP_SCHEDULED', 'COLLECTED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_forecasts_kitchen_date ON public.demand_forecasts (kitchen_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_consumption_kitchen ON public.daily_consumption (kitchen_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_surplus_status ON public.surplus_listings (status);
CREATE INDEX IF NOT EXISTS idx_orgs_distance ON public.recovery_orgs (distance_km);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surplus_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_records ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for Hackathon Demo Mode
DO $$
BEGIN
    -- kitchens
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kitchens' AND policyname = 'Public Access for Hackathon Demo') THEN
        CREATE POLICY "Public Access for Hackathon Demo" ON public.kitchens FOR ALL USING (true) WITH CHECK (true);
    END IF;
    -- demand_forecasts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'demand_forecasts' AND policyname = 'Public Access for Forecasts') THEN
        CREATE POLICY "Public Access for Forecasts" ON public.demand_forecasts FOR ALL USING (true) WITH CHECK (true);
    END IF;
    -- daily_consumption
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_consumption' AND policyname = 'Public Access for Consumption') THEN
        CREATE POLICY "Public Access for Consumption" ON public.daily_consumption FOR ALL USING (true) WITH CHECK (true);
    END IF;
    -- surplus_listings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'surplus_listings' AND policyname = 'Public Access for Surplus') THEN
        CREATE POLICY "Public Access for Surplus" ON public.surplus_listings FOR ALL USING (true) WITH CHECK (true);
    END IF;
    -- recovery_orgs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recovery_orgs' AND policyname = 'Public Access for Orgs') THEN
        CREATE POLICY "Public Access for Orgs" ON public.recovery_orgs FOR ALL USING (true) WITH CHECK (true);
    END IF;
    -- pickup_records
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pickup_records' AND policyname = 'Public Access for Pickups') THEN
        CREATE POLICY "Public Access for Pickups" ON public.pickup_records FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
