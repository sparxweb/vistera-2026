# FOODFLOW — Complete Implementation Specification
**AI-Powered Food Waste Prevention & Surplus Recovery Platform**  
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Tagline: “Predict. Prevent. Recover.”*

---

## 1. Executive Summary & Problem Addressed
Institutional canteens, hotels, and banqueting facilities across India routinely face the dual challenge of overproduction and severe food waste while vulnerable communities suffer food insecurity nearby. Simple linear formulas fail because attendance is non-linear, influenced by weekdays vs. weekends, calendar events, weather, and dish-specific consumption behavior.

**FOODFLOW** solves this through a dual-engine architecture:
1. **Deterministic Statistical Demand & Food Prep Engine**: Closed-form mathematical forecast calculated from 30 operating days of historical shift records at **Deccan Grand Hotel — Hyderabad** (Capacity: 1000 meals/service).
2. **Geodesic Surplus Recovery Corridor**: Real-time identification of recoverable surplus, automated shelf-life tracking, and Haversine proximity matching to local Hyderabad shelters and community kitchens with complete pickup dispatching.

---

## 2. Target Facility Profile & Authentication Flow
- **Demo Facility**: **Deccan Grand Hotel — Hyderabad**
  - **Facility ID**: `DGH-HYD-01`
  - **Location**: Banjara Hills / Gachibowli Corridor, Hyderabad, Telangana, India
  - **Facility Type**: Large Hotel & Banqueting Facility
  - **Shift Meal Capacity**: 1000 meals/service (Hard safety upper bound)
  - **Service Capacity Breakdown**: Breakfast: 800 | Lunch: 1000 | Dinner: 900
  - **Average Daily Patrons**: ~2,250 across 3 daily shifts
  - **Operating Schedule**: All 7 Days (Monday – Sunday)
  - **Disclaimer**: *Clearly labeled illustrative demo hotel dataset; not presented as a commercial client endorsement.*
- **Fast Demo Authentication**:
  - The login interface provides **Facility ID & Password** credentials alongside a 1-click **“Continue with Demo Hotel”** fast-login action for evaluators and judges.
  - Zero secrets or sensitive credentials are ever exposed in client-side bundles.

---

## 3. Core Architectural Modules Implemented
```
HOTEL (Deccan Grand Hotel)
   ↓
HISTORICAL SERVICE DATA (30-Day Illustrative Archive)
   ↓
PATTERN ANALYSIS ENGINE (Day-of-Week, Weekend %, Trend, Meal Ratios)
   ↓
FORECAST ENGINE (Comparable Baseline + Adjustments → Capacity Bounds)
   ↓
EXPECTED DINERS (e.g., 820) → PREDICTED DINERS (795)
   ↓
FOOD PREPARATION ENGINE (Base Requirement + 3.0% Safety Buffer)
   ↓
TWO-STAGE BATCH STAGING (80–85% Initial Cook + 15–20% Reserve Trigger)
   ↓
LIVE SERVICE & CONSUMPTION TRACKING (Prepared vs Served vs Remaining)
   ↓
SURPLUS & RESCUE CLASSIFICATION (Recoverable vs Non-recoverable Waste)
   ↓
HAVERSINE GEODESIC MATCHING (Food Type + Quantity + Distance Fit)
   ↓
INTERACTIVE MAPBOX GL JS MAP (Synchronized Markers & Route Directs)
   ↓
PARTNER ACCEPTANCE & PICKUP SCHEDULE (ACTIVE → SCHEDULED → COMPLETED)
   ↓
CLOSED-LOOP AUDIT RECORD (Variance feedback into future shift logs)
```

---

## 4. Key Screens & User Interface
1. **Demo Login (`LoginScreen.tsx`)**:
   - Facility ID & Password inputs.
   - Dedicated "Continue with Demo Hotel" fast-access card for hackathon judges.
2. **Control Center (`DashboardScreen.tsx`)**:
   - Hotel Profile card displaying Deccan Grand Hotel attributes, location, and capacity breakdown.
   - Live service monitoring table with dish-level Recommended, Prepared, Served, Remaining, and Waste status.
   - Real-time surplus alert banner linking to immediate recovery.
3. **Demand Forecast (`ForecastScreen.tsx`)**:
   - Interactive configuration: expected turnstile check-ins, service meal (Breakfast/Lunch/Dinner), day of week, special event, and operating mode.
   - **"View Calculation" Modal**: Detailed mathematical breakdown showing Baseline ($710$) + Day Effect ($+4.8\%$) + Trend ($+2.1\%$) + Event ($0\%$) $\to$ Capacity Cap ($1000$) $\to \mathbf{795\text{ Diners}}$.
   - Dish-level preparation table in physical culinary units (`kg`, `L`, `pieces`).
   - Two-stage batch cooking instructions (Initial batch 80–85%, Reserve 15–20% with explicit trigger conditions).
4. **Historical Archive (`HistoryScreen.tsx`)**:
   - 30 comprehensive operational shift records covering Breakfast, Lunch, Dinner, weekdays, weekends, and festivals.
5. **Pattern Analysis (`AnalysisScreen.tsx`)**:
   - Day-of-week averages (Mon–Sun) with variance from mean.
   - Weekday vs. Weekend variance card.
   - Breakfast vs. Lunch vs. Dinner consumption index and typical waste %.
   - Rolling 7-day trend momentum.
   - Dynamic natural-language explanations calculated strictly from stored data.
6. **Surplus Recovery (`RecoveryScreen.tsx`)**:
   - Dish-level surplus packaging, thermal condition, holding temp, and pickup deadline.
   - Multi-stage lifecycle tracker (`ACTIVE` $\to$ `VIEWED` $\to$ `ACCEPTED` $\to$ `PICKUP_SCHEDULED` $\to$ `COLLECTED`).
7. **Recovery Map & Matchmaking (`OrganizationsScreen.tsx`)**:
   - Real interactive Mapbox GL JS map with fallback to high-contrast SVG GIS view.
   - Synchronized organization directory with calculated Haversine geodesic distances.
   - Intelligent match ranking (Best Match badge based on food category, proximity, and intake capacity).
   - Dispatch modal scheduling pickups with secure OTP generation.
8. **Settings & API Health (`SettingsScreen.tsx`)**:
   - Real-time status cards for Supabase, Gemini 3.8 Flash, Mapbox GL JS, and Local Calendar Dataset.
   - Zero exposed secrets; clear connectivity indicators.
