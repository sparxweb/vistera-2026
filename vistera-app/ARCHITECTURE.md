# FOODFLOW — System Architecture Specification

**Project:** FOODFLOW  
**Hackathon:** VISTERA 2026 • Problem Statement PS-44  
**Date:** October 2026  
**Status:** Round 2 Working MVP Architecture  

---

## 1. High-Level System Architecture

FOODFLOW operates on a layered, modular architecture that separates deterministic business logic from qualitative AI reasoning.

```
+--------------------------------------------------------------------------+
|                        CLIENT INTERFACE LAYER                            |
|  Next.js 16 (React 19) • Tailwind CSS • Lucide Icons • HTML5 / CSS3     |
|                                                                          |
|  - Kitchen Dashboard (Control Center)                                    |
|  - Guided Forecast Workflow                                              |
|  - Consumption & Variance Monitor                                        |
|  - Surplus Recovery & Verified Partner Logistics                         |
+--------------------------------------------------------------------------+
                                    │
                                    ▼ HTTP / JSON
+--------------------------------------------------------------------------+
|                         APPLICATION API LAYER                            |
|                   Next.js App Router API Handlers                        |
|                                                                          |
|   POST /api/forecast        POST /api/consumption       POST /api/ai     |
+--------------------------------------------------------------------------+
          │                                  │                   │
          ▼                                  ▼                   │
+-----------------------+          +-------------------+         │
|  FORECASTING ENGINE   |          |  DECISION ENGINE  |         │
| Deterministic ML      |          | Balance & Surplus |         │
| Regressor             |          | Detection Rules   |         │
| (src/lib/forecast/)   |          | (src/lib/business)|         │
+-----------------------+          +-------------------+         │
          │                                  │                   │
          │ Numerical Results                │ Verified Metrics  ▼
          ├──────────────────────────────────┴─────────────>+--------------------+
          │                                                 |   GEMINI COPILOT   |
          │                                                 | Qualitative AI     |
          │                                                 | Reasoning Only     |
          ▼                                                 +--------------------+
+------------------------------------------------------+             │
|                    PERSISTENCE LAYER                 |<────────────┘
|  Supabase PostgreSQL Database (with Local Fallback)  |
|                                                      |
|  - kitchens                   - menu_items           |
|  - service_records            - historical_consump   |
|  - demand_forecasts           - prep_recommendations |
|  - daily_consumption          - surplus_listings     |
|  - recovery_orgs              - pickup_records       |
+------------------------------------------------------+
```

---

## 2. Core Functional Stages (Round 2 Vertical Slice)

### Stage 1: FORECAST (Predict Demand & Multi-Dish Quantities)
- **Input:** Expected registered diners (e.g. 820), meal shift (Lunch), scheduled menu, campus context factor (Sunny / Regular weekday).
- **Engine:** `src/lib/forecast/engine.ts` calculates predicted attendance using historical conversion rates (mean 96.95% on Thursdays $\to$ 795 diners) plus empirical dish consumption rates ($\text{kg/diner}$, $\text{L/diner}$, $\text{pieces/diner}$).
- **Output:** Predicted headcount (795), dish-level preparation totals in physical culinary units (43.0 kg Rice, 18.0 L Dal, 31.0 kg Chicken Curry, 16.5 kg Veg Curry, 12.0 L Curd).
- **Decoupling Guarantee:** Generative AI is NEVER permitted to generate numerical predictions. Gemini 3.8 Flash acts strictly as an operational copilot for qualitative shift context.

### Stage 2: PREPARE (Two-Stage Batch Staging)
- **Two-Stage Batch Splitting:** Kitchen prepares 84% during Initial Cook (e.g. 36.1 kg Rice) and stages 16% in Reserve Staging (e.g. 6.9 kg Rice).
- **Staging Trigger:** The reserve batch is fired at 1:15 PM only if turnstile swipe-ins exceed 80% of expected capacity. If turnout is sluggish, un-cooked reserve ingredients remain untouched in dry storage / cold walk-in, eliminating overproduction before cooking occurs.

### Stage 3: MONITOR (Track Multi-Dish Service)
- **Tracking:** Kitchen supervisors record actual headcount and tray weights at service wrap.
- **Metrics Tracked:** Quantities prepared, quantities served, unserved pan leftovers, and service variances across all dishes.

### Stage 4: DETECT & RECOVER (Surplus vs. Waste Distinction)
- **Logic:** `src/lib/business/balance.ts` evaluates leftover food held at safe temperatures ($\ge 63^\circ\text{C}$):
  $$\text{Leftover} \neq \text{Waste}$$
  - **Recoverable Surplus:** Wholesome, untouched food in hot-holding pans is packaged into food-grade carriers for verified NGO rescue.
  - **Spoiled / Expired / Scrap:** Only unsafe food is classified as organic kitchen waste.
- **Spatial Logistics (Mapbox GL JS + Haversine Engine):** `src/lib/geo/distance.ts` computes true geodesic distances from the Hyderabad dining hall dock to verified partners (Robin Hood Army Gachibowli 2.8 km, Feeding India Madhapur 4.6 km, Annamrita Kondapur 3.4 km, Aasara Tolichowki 6.2 km) with direct pickup booking and OTP handover.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js App Router | 16.4.0 | Server-rendered pages, API routes, Turbopack |
| **Language** | TypeScript | 5.8 | Strict type safety and compilation verification |
| **Styling** | Vanilla CSS + Tailwind | 4.x | Warm Ivory / Deep Emerald design tokens |
| **Database** | Supabase / PostgreSQL | 15+ | 10-table Indian operations schema, RLS policies |
| **AI Copilot** | Google Gemini API | 3.8 Flash | Contextual operational reasoning and explanations |
| **GIS & Maps** | Mapbox GL JS | 3.10 | Interactive vector maps, Hyderabad corridor, partner markers |
| **Distance Engine**| Geodesic Haversine | Pure TS | Accurate spherical earth distance in kilometers |
| **Icons** | Lucide React | 0.468 | Cohesive visual icon grammar |

---

## 4. Security & Compliance Standard
- **Zero Exposed Secrets:** `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are kept strictly in server-side environment variables and never leaked to the browser bundle. Client uses publishable Mapbox token only.
- **Row Level Security (RLS):** Enabled across all Supabase PostgreSQL tables.
- **Responsible AI Disclaimer:** All qualitative outputs are explicitly labeled *"AI INSIGHT — DECISION SUPPORT ONLY"* with zero unfounded food safety or waste-reduction claims.

