-- ==============================================================================
-- FOODFLOW: Controlled Seed Demo Dataset
-- Problem: VISTERA 2026 PS-44 — Cutting Food Waste
-- Note: All records are strictly illustrative demo data for hackathon evaluation.
-- ==============================================================================

-- 1. SEED KITCHEN
INSERT INTO public.kitchens (id, name, total_capacity, default_buffer_pct, address)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'FOODFLOW Central Kitchen',
    1200,
    2.40,
    'Metropolitan Campus — Building C, Level 1'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    total_capacity = EXCLUDED.total_capacity;

-- 2. SEED RECOVERY ORGANIZATIONS (Demo Partners)
INSERT INTO public.recovery_orgs (id, org_name, contact_phone, distance_km, max_capacity_meals, verified_status, latitude, longitude, accepted_food_types, availability)
VALUES 
    (
        'e1111111-1111-4111-8111-111111111111',
        'Feeding Hope Community Center',
        '+91 98101 23456',
        1.4,
        120,
        true,
        28.5355,
        77.3910,
        ARRAY['Cooked Hot Meals', 'Pans & Trays', 'Fresh Produce'],
        'Immediate (within 30 mins)'
    ),
    (
        'e2222222-2222-4222-8222-222222222222',
        'Second Harvest Food Mission',
        '+91 98102 34567',
        2.1,
        85,
        true,
        28.5420,
        77.3820,
        ARRAY['Hot Prepared Meals', 'Bread & Bakery', 'Chilled Foods'],
        'Within 45 mins'
    ),
    (
        'e3333333-3333-4333-8333-333333333333',
        'City Shelter Relief Network',
        '+91 98103 45678',
        3.7,
        150,
        true,
        28.5210,
        77.3750,
        ARRAY['Cooked Bulk Rice & Curries', 'Sealed Portions'],
        'Evening Service (16:00 - 20:00)'
    ),
    (
        'e4444444-4444-4444-8444-444444444444',
        'Compassion Dining Collective',
        '+91 98104 56789',
        4.8,
        60,
        true,
        28.5300,
        77.4120,
        ARRAY['Vegetarian Hot Meals', 'Soup & Stews'],
        'On-call (1h notice)'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. SEED BENCHMARK DEMAND FORECAST (800 Diners -> 742 Predicted -> 760 Recommended)
INSERT INTO public.demand_forecasts (id, kitchen_id, service_date, service_meal, menu_item, expected_diners, predicted_demand, recommended_preparation, operational_risk, ai_explanation)
VALUES (
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    CURRENT_DATE,
    'Lunch',
    'Rice + Dal + Chicken',
    800,
    742,
    760,
    'MEDIUM',
    'Demand is expected to remain slightly below the recent Wednesday average. A small preparation buffer (+18 servings) is recommended to prevent stockouts while mitigating overproduction risk.'
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED BENCHMARK DAILY CONSUMPTION (760 Prepared -> 728 Served -> 32 Remaining Surplus)
INSERT INTO public.daily_consumption (id, forecast_id, kitchen_id, prepared_quantity, served_quantity, remaining_quantity, balance_status, recorded_at)
VALUES (
    'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    760,
    728,
    32,
    'SURPLUS',
    now()
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED BENCHMARK SURPLUS LISTING
INSERT INTO public.surplus_listings (id, consumption_id, food_description, quantity_servings, prep_time, expiry_time, status, pickup_location)
VALUES (
    'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    'Rice + Dal (Hot-Held Cambro Containers)',
    32,
    now() - interval '1 hour',
    now() + interval '2 hours 30 minutes',
    'ACTIVE',
    'FOODFLOW Central Kitchen — Dock 2B, Loading Bay'
)
ON CONFLICT (id) DO NOTHING;
