# FOODFLOW System Architecture
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*

---

## 1. High-Level System Architecture

```
+-------------------------------------------------------------------------------+
|                                CLIENT APPLICATION                             |
|  Next.js 16 (React 19) • Tailwind CSS • Mapbox GL JS • Lucide Icons           |
|                                                                               |
|  [Demo Login]     [Dashboard & Profile]    [Forecast & "View Calculation"]   |
|  [Live Monitor]   [Pattern Analysis]       [Recovery & Haversine Proximity]  |
+-------------------------------------------------------------------------------+
                                    |
                          REST & JSON Payloads
                                    v
+-------------------------------------------------------------------------------+
|                            NEXT.JS SERVER RUNTIME                             |
|                                                                               |
|  /api/forecast              /api/consumption              /api/ai             |
|  - Validates inputs         - Logs meal check-ins         - Gemini 3.8 Flash  |
|  - Calls engine             - Surplus vs waste split      - Qualitative text  |
|  - Capacity bounds          - Audit snapshots             - Strict no-math    |
+-------------------------------------------------------------------------------+
         |                                                 |
         v                                                 v
+------------------------------------+   +------------------------------------+
|   DETERMINISTIC FORECAST ENGINE    |   |     PERSISTENCE & GEODATA LAYER    |
|                                    |   |                                    |
|  - 30-Day Historical Archive       |   |  - Supabase PostgreSQL 15          |
|  - Baseline + Day + Trend + Event  |   |  - 9 Relational Master Tables      |
|  - Physical Capacity Limits        |   |  - Haversine Geodesic Distance     |
|  - Dish kg / L / piece quantities  |   |  - Offline-ready Local Storage     |
|  - Two-Stage Staged Batching       |   |                                    |
+------------------------------------+   +------------------------------------+
```

---

## 2. Technology Stack
- **Framework**: Next.js 16.4.0 with Turbopack (App Router)
- **UI Library**: React 19, Vanilla Tailwind CSS, Lucide React
- **Forecasting**: Deterministic TypeScript Mathematical Engine (`src/lib/forecast/engine.ts`)
- **Geospatial**: Mapbox GL JS (`src/components/recovery/RecoveryMapbox.tsx`) + Haversine Geodesic Formula (`src/lib/geo/distance.ts`)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) policies
- **AI Copilot**: Google Gemini 3.8 Flash (Server-side via `@google/genai` or secure fetch)
