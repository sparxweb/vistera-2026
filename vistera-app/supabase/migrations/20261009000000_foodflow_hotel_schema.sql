-- ==============================================================================
-- FOODFLOW: Master Hotel Relational Schema (VISTERA 2026 PS-44)
-- Facility: Deccan Grand Hotel — Hyderabad (1000 Capacity)
-- Master Target Tables:
-- 1. hotels
-- 2. service_records
-- 3. food_items
-- 4. food_consumption
-- 5. forecasts
-- 6. preparation_recommendations
-- 7. recovery_organizations
-- 8. surplus
-- 9. pickups
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. HOTELS TABLE
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id TEXT UNIQUE NOT NULL DEFAULT 'DGH-HYD-01',
    hotel_name TEXT NOT NULL DEFAULT 'Deccan Grand Hotel — Hyderabad',
    hotel_type TEXT NOT NULL DEFAULT 'Large Hotel & Banqueting Facility',
    location TEXT NOT NULL DEFAULT 'Banjara Hills / Gachibowli Corridor, Hyderabad',
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    state TEXT NOT NULL DEFAULT 'Telangana, India',
    service_capacity INTEGER NOT NULL DEFAULT 1000,
    breakfast_capacity INTEGER NOT NULL DEFAULT 800,
    lunch_capacity INTEGER NOT NULL DEFAULT 1000,
    dinner_capacity INTEGER NOT NULL DEFAULT 900,
    operating_days TEXT NOT NULL DEFAULT 'All 7 Days (Monday – Sunday)',
    default_buffer_pct NUMERIC(4,2) NOT NULL DEFAULT 3.00,
    latitude DOUBLE PRECISION NOT NULL DEFAULT 17.4447,
    longitude DOUBLE PRECISION NOT NULL DEFAULT 78.3483,
    is_demo_hotel BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SERVICE_RECORDS TABLE (30-day historical operational dataset)
CREATE TABLE IF NOT EXISTS public.service_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('BREAKFAST', 'LUNCH', 'DINNER')),
    day_of_week TEXT NOT NULL,
    is_weekend BOOLEAN NOT NULL DEFAULT false,
    expected_customers INTEGER NOT NULL,
    actual_customers INTEGER NOT NULL,
    attendance_ratio NUMERIC(5,4) NOT NULL,
    special_event BOOLEAN NOT NULL DEFAULT false,
    event_name TEXT,
    food_prepared NUMERIC(8,2) NOT NULL,
    food_served NUMERIC(8,2) NOT NULL,
    food_remaining NUMERIC(8,2) NOT NULL,
    food_wasted NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FOOD_ITEMS TABLE (Indian culinary dish catalogue)
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Staple', 'Dal & Gravy', 'Curry / Protein', 'Side', 'Dairy')),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'L', 'pieces')),
    historical_consumption_per_diner NUMERIC(6,4) NOT NULL,
    default_initial_batch_ratio NUMERIC(4,2) NOT NULL DEFAULT 0.84,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. FORECASTS TABLE
CREATE TABLE IF NOT EXISTS public.forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    service_type TEXT NOT NULL CHECK (service_type IN ('BREAKFAST', 'LUNCH', 'DINNER')),
    day_of_week TEXT NOT NULL,
    is_weekend BOOLEAN NOT NULL DEFAULT false,
    expected_diners INTEGER NOT NULL,
    comparable_baseline INTEGER NOT NULL,
    day_of_week_effect_pct NUMERIC(5,2) NOT NULL,
    weekend_effect_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    special_event_effect_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    recent_trend_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    unconstrained_prediction INTEGER NOT NULL,
    capacity_limit INTEGER NOT NULL DEFAULT 1000,
    is_capacity_constrained BOOLEAN NOT NULL DEFAULT false,
    final_predicted_diners INTEGER NOT NULL,
    operational_risk TEXT NOT NULL DEFAULT 'LOW' CHECK (operational_risk IN ('LOW', 'MEDIUM', 'HIGH')),
    gemini_explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PREPARATION_RECOMMENDATIONS TABLE (Dish-level batch planning)
CREATE TABLE IF NOT EXISTS public.preparation_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES public.forecasts(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE SET NULL,
    dish_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    base_requirement NUMERIC(8,2) NOT NULL,
    safety_buffer NUMERIC(8,2) NOT NULL,
    recommended_quantity NUMERIC(8,2) NOT NULL,
    initial_batch NUMERIC(8,2) NOT NULL,
    reserve_batch NUMERIC(8,2) NOT NULL,
    trigger_condition TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FOOD_CONSUMPTION TABLE (Actual service recording & variance)
CREATE TABLE IF NOT EXISTS public.food_consumption (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID REFERENCES public.forecasts(id) ON DELETE SET NULL,
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    actual_diners INTEGER NOT NULL,
    prediction_error INTEGER NOT NULL,
    total_prepared NUMERIC(8,2) NOT NULL,
    total_served NUMERIC(8,2) NOT NULL,
    total_remaining NUMERIC(8,2) NOT NULL,
    recoverable_surplus NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    non_recoverable_waste NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    balance_status TEXT NOT NULL DEFAULT 'SURPLUS' CHECK (balance_status IN ('SURPLUS', 'SHORTAGE', 'BALANCED')),
    recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 7. RECOVERY_ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.recovery_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name TEXT NOT NULL,
    org_type TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    distance_km NUMERIC(5,2) NOT NULL,
    food_category_needed TEXT NOT NULL,
    intake_capacity_meals INTEGER NOT NULL DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'Accepting' CHECK (status IN ('Accepting', 'On Standby', 'Capacity Full')),
    source_type TEXT NOT NULL DEFAULT 'DEMO_SEED' CHECK (source_type IN ('DEMO_SEED', 'PUBLIC_SOURCE', 'VERIFIED_PARTNER')),
    verification_status TEXT NOT NULL DEFAULT 'Seeded Demo Partner',
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SURPLUS TABLE
CREATE TABLE IF NOT EXISTS public.surplus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
    food_item TEXT NOT NULL,
    quantity NUMERIC(8,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    prepared_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    available_until TIMESTAMPTZ NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,
    pickup_location TEXT NOT NULL,
    storage_handling_status TEXT NOT NULL DEFAULT 'Hot Held (≥63°C)',
    eligibility_status TEXT NOT NULL DEFAULT 'ELIGIBLE_FOR_RECOVERY',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'VIEWED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'COMPLETED', 'EXPIRED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. PICKUPS TABLE
CREATE TABLE IF NOT EXISTS public.pickups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surplus_id UUID REFERENCES public.surplus(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.recovery_organizations(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMPTZ NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,
    pickup_status TEXT NOT NULL DEFAULT 'PICKUP_SCHEDULED' CHECK (pickup_status IN ('PENDING', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED')),
    otp_code TEXT NOT NULL DEFAULT '8924',
    contact_phone TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_service_records_hotel_date ON public.service_records (hotel_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_forecasts_hotel_date ON public.forecasts (hotel_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_surplus_active ON public.surplus (status);
CREATE INDEX IF NOT EXISTS idx_recovery_orgs_geo ON public.recovery_organizations (latitude, longitude);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preparation_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surplus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Allow public read service_records" ON public.service_records FOR SELECT USING (true);
CREATE POLICY "Allow public read food_items" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Allow public read forecasts" ON public.forecasts FOR SELECT USING (true);
CREATE POLICY "Allow public insert forecasts" ON public.forecasts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read food_consumption" ON public.food_consumption FOR SELECT USING (true);
CREATE POLICY "Allow public insert food_consumption" ON public.food_consumption FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read recovery_organizations" ON public.recovery_organizations FOR SELECT USING (true);
CREATE POLICY "Allow public read surplus" ON public.surplus FOR SELECT USING (true);
CREATE POLICY "Allow public insert surplus" ON public.surplus FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update surplus" ON public.surplus FOR UPDATE USING (true);
CREATE POLICY "Allow public read pickups" ON public.pickups FOR SELECT USING (true);
CREATE POLICY "Allow public insert pickups" ON public.pickups FOR INSERT WITH CHECK (true);
