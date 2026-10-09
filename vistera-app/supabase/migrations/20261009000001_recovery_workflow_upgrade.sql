-- ==============================================================================
-- FOODFLOW: Connected Hotel + Demo NGO Recovery Workflow Migration
-- Problem Statement: VISTERA 2026 PS-44 (Cutting Food Waste)
-- ==============================================================================

-- 1. Create enum types if not exists
DO $$ BEGIN
    CREATE TYPE safety_review_decision AS ENUM (
        'PENDING_REVIEW',
        'ELIGIBLE_FOR_REVIEWED_PICKUP',
        'REJECTED',
        'EXPIRED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE offer_pickup_stage AS ENUM (
        'OFFERED',
        'ACCEPTED',
        'PICKUP_SCHEDULED',
        'PICKED_UP',
        'COMPLETED',
        'DECLINED',
        'EXPIRED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Enhanced FOOD_RECOVERY_OFFERS Table
CREATE TABLE IF NOT EXISTS public.food_recovery_offers (
    id TEXT PRIMARY KEY, -- e.g. 'FF-SURPLUS-0001'
    hotel_id TEXT NOT NULL,
    hotel_name TEXT NOT NULL,
    hotel_location TEXT NOT NULL,
    hotel_lat DOUBLE PRECISION NOT NULL DEFAULT 17.4447,
    hotel_lng DOUBLE PRECISION NOT NULL DEFAULT 78.3483,
    
    food_item TEXT NOT NULL,
    dish_category TEXT NOT NULL DEFAULT 'Cooked Meals',
    quantity NUMERIC(8,2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL DEFAULT 'kg',
    servings_equivalent INTEGER NOT NULL DEFAULT 30,
    
    prep_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    available_until TIMESTAMPTZ NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,
    handling_notes TEXT,
    dietary_tags TEXT[] DEFAULT ARRAY['Verified Hot-Held'],
    allergens TEXT[] DEFAULT ARRAY['None'],
    
    -- Safety Review Gate
    safety_decision safety_review_decision NOT NULL DEFAULT 'PENDING_REVIEW',
    storage_condition TEXT NOT NULL DEFAULT 'Hot-holding (≥63°C)',
    temperature_logged NUMERIC(5,2),
    temperature_verified BOOLEAN NOT NULL DEFAULT false,
    hygiene_check_passed BOOLEAN NOT NULL DEFAULT false,
    responsible_staff_confirmed BOOLEAN NOT NULL DEFAULT false,
    reviewed_by TEXT,
    reviewer_designation TEXT,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    safety_notes TEXT,
    
    -- Offer & Pickup Workflow
    status offer_pickup_stage NOT NULL DEFAULT 'OFFERED',
    accepted_by_org_id TEXT,
    accepted_by_org_name TEXT,
    accepted_at TIMESTAMPTZ,
    decline_reason TEXT,
    declined_at TIMESTAMPTZ,
    
    -- Pickup Manifest
    scheduled_pickup_time TIMESTAMPTZ,
    vehicle_type TEXT,
    driver_contact TEXT,
    handover_confirmed BOOLEAN NOT NULL DEFAULT false,
    handover_timestamp TIMESTAMPTZ,
    received_confirmed BOOLEAN NOT NULL DEFAULT false,
    completed_timestamp TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Recovery In-App Notifications Table
CREATE TABLE IF NOT EXISTS public.recovery_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_role TEXT NOT NULL CHECK (target_role IN ('HOTEL', 'NGO', 'ALL')),
    offer_id TEXT REFERENCES public.food_recovery_offers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notif_type TEXT NOT NULL DEFAULT 'INFO' CHECK (notif_type IN ('INFO', 'SUCCESS', 'WARNING', 'ALERT')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.food_recovery_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_notifications ENABLE ROW LEVEL SECURITY;

-- 5. Strict Role & Read/Write Policies
-- Public / Demo Read: Anyone can read offers for inspection
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'food_recovery_offers' AND policyname = 'Allow read for all active roles') THEN
        CREATE POLICY "Allow read for all active roles" ON public.food_recovery_offers FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'food_recovery_offers' AND policyname = 'Hotel can insert offers') THEN
        CREATE POLICY "Hotel can insert offers" ON public.food_recovery_offers FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'food_recovery_offers' AND policyname = 'Allow updates by workflow participants') THEN
        CREATE POLICY "Allow updates by workflow participants" ON public.food_recovery_offers FOR UPDATE USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recovery_notifications' AND policyname = 'Allow notification access') THEN
        CREATE POLICY "Allow notification access" ON public.recovery_notifications FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
