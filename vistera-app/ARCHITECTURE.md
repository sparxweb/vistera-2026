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
|  - kitchens                                          |
|  - demand_forecasts                                  |
|  - daily_consumption                                 |
|  - surplus_listings                                  |
|  - recovery_orgs                                     |
+------------------------------------------------------+
```

---

## 2. Core Functional Stages (Round 2 Vertical Slice)

### Stage 1: FORECAST (Predict Demand)
- **Input:** Expected registered diners, meal type, scheduled menu, and campus context factor.
- **Engine:** `src/lib/forecast/engine.ts` calculates predicted demand using statistical conversion rates and context multipliers.
- **Output:** Predicted headcount (e.g. 742), safety buffer (+18), and recommended preparation quantity (760).
- **Decoupling Guarantee:** Generative AI is NEVER permitted to generate numerical predictions.

### Stage 2: PREPARE (Batch Staging)
- **Safety Margin:** Dynamic buffer calculation (default 2.426%) ensures the kitchen maintains $>98\%$ non-stockout probability without over-committing raw food trays.
- **Staging Advice:** Recommends holding secondary batches until active lunch service headcount trends are observed.

### Stage 3: MONITOR (Track Service)
- **Tracking:** Kitchen staff records actual turnstile headcounts or POS register totals at shift wrap.
- **Metrics Tracked:** Prepared meals (760), served meals (728), and difference (-14 from prediction).

### Stage 4: DETECT (Surplus / Shortage Identification)
- **Logic:** `src/lib/business/balance.ts` evaluates:
  $$\text{Remaining} = \text{Prepared} - \text{Served}$$
  - $\text{Remaining} > 5 \implies \mathbf{SURPLUS}$
  - $\text{Served} > \text{Prepared} \implies \mathbf{SHORTAGE}$
  - $|\text{Delta}| \le 5 \implies \mathbf{BALANCED}$
- **Action:** If surplus is detected, a recovery listing is generated and flagged for immediate dispatch.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js App Router | 16.4.0 | Server-rendered pages, API routes, Turbopack |
| **Language** | TypeScript | 5.x | Strict type safety and compilation verification |
| **Styling** | Vanilla CSS + Tailwind | 3.4 | Warm Ivory / Deep Emerald design tokens |
| **Database** | Supabase / PostgreSQL | 15+ | Relational schema, RLS policies, indexing |
| **AI Copilot** | Google Gemini API | 3.8 Flash | Contextual operational reasoning and explanations |
| **Maps** | Leaflet / OpenStreetMap | 1.9.4 | Verified partner spatial visualization with fallback |
| **Icons** | Lucide React | 0.468 | Cohesive visual icon grammar |

---

## 4. Security & Compliance Standard
- **Zero Exposed Secrets:** `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are kept strictly in server-side environment variables and never leaked to the browser bundle.
- **Row Level Security (RLS):** Enabled across all Supabase PostgreSQL tables.
- **Responsible AI Disclaimer:** All qualitative outputs are explicitly labeled *"AI INSIGHT — DECISION SUPPORT ONLY"* with zero unfounded food safety or waste-reduction claims.
