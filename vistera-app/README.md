# FOODFLOW — AI-Powered Food Waste Prevention & Surplus Recovery Platform

> **Predict. Prevent. Recover.**  
> **Hackathon:** VISTERA 2026 • **Problem Statement:** PS-44 — Cutting Food Waste  
> **Milestone:** Round 2 Working MVP

---

## 1. What is FOODFLOW?

**FOODFLOW** is an intelligent operational control platform built for institutional dining halls, campus canteens, and enterprise catering facilities. It helps kitchen operations managers:
1. **Predict** genuine diner demand before cooking starts.
2. **Prevent** avoidable overproduction through safe batch-staging buffers.
3. **Monitor** actual diner turnstile headcounts during active service.
4. **Detect** leftover surplus or shortage risks in real-time.
5. **Recover** unserved, food-safe meals by routing them directly to verified local community pantries and shelters.

---

## 2. Round 2 Objective: Working Vertical Slice

In accordance with the VISTERA 2026 Round 2 mandate, this repository delivers a **real, working, demonstrable foundation** calibrated to an institutional dining facility (Campus Central Dining Hall, Hyderabad, Capacity: 1000 diners):

$$\mathbf{FORECAST} \longrightarrow \mathbf{PREPARE} \longrightarrow \mathbf{MONITOR} \longrightarrow \mathbf{DETECT} \longrightarrow \mathbf{RECOVER}$$

### Working Features:
- **Empirical Historical Dataset (`src/lib/data/historicalServices.ts`):** 25 empirical shift records for Hyderabad dining (Lunch, Breakfast, Dinner) capturing realistic diner turnout, weather conditions, and per-diner consumption rates.
- **Data-Driven Multi-Dish Forecast Engine (`src/lib/forecast/engine.ts`):** Calculates expected attendance (e.g. 820 expected $\to$ 795 predicted) and outputs real physical food preparation quantities (43.0 kg Rice, 18.0 L Dal, 31.0 kg Chicken Curry, 16.5 kg Veg Curry, 12.0 L Curd).
- **Two-Stage Batch Staging:** Splits preparation into Initial Cook (84%) and Reserve Staging (16% fired only if 1:15 PM turnstiles cross 80%), preventing avoidable kitchen overproduction.
- **Leftover $\neq$ Waste Evaluator (`src/lib/business/balance.ts`):** Distinguishes unserved safe hot-holding food ($\ge 63^\circ\text{C}$) as high-value recoverable surplus while isolating true scrap/waste.
- **RESTful APIs (`/api/forecast`, `/api/consumption`, `/api/ai`):** Backed by Supabase PostgreSQL persistence with client-side dual-layer offline fallback.
- **Interactive Spatial Recovery Corridor (Mapbox GL JS + Haversine Engine):** Live vector map of Hyderabad recovery partners (Gachibowli, Madhapur, Kondapur, Tolichowki) with real geodesic distance calculations and direct pickup scheduling modal.

---

## 3. Technology Stack

- **Frontend:** Next.js 16 (React 19), Tailwind CSS v4, Lucide React
- **Backend / APIs:** Next.js App Router API Routes (`/api/forecast`, `/api/consumption`, `/api/ai`)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) & 10-table Indian operations migration
- **Forecasting:** Deterministic Empirical Baseline Regressor
- **AI Reasoning:** Google Gemini 3.8 Flash (Qualitative Explanations Only, strictly decoupled from math)
- **Spatial Logistics:** Mapbox GL JS 3.10 with Haversine Geodesic Distance Engine and resilient GIS card fallback

---

## 4. Quick Start & How to Run

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/sparxweb/vistera-2026.git
cd vistera-2026/vistera-app
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your credentials (optional; deterministic math, historical data, and GIS card fallback activate automatically if keys are absent):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 5. Recommended Judge Demonstration (60–90 Seconds)

1. **Landing Page:** Open [http://localhost:3000](http://localhost:3000). Inspect the official brand mark, headline (*"Cook for the demand. Not for the guess."*), and 7-stage closed loop.
2. **Open Dashboard:** Click `[ Open Kitchen Dashboard ]`. View Campus Central Dining Hall (Hyderabad), 1000-diner capacity, Two-Stage Batch Staging active status, and dish variance metrics.
3. **Run Forecast:** Click `[ Run Forecast ]` or select **Operations $\to$ Demand Forecast**.
   - Select Meal: `Lunch (12:30 - 14:30)`. Enter `820` expected diners, Context: `Sunny / Regular`.
   - Click `[ Generate Forecast ]`.
   - Observe deterministic output: **795 Predicted Diners**, dish plan in physical units (**43.0 kg Rice, 18.0 L Dal, 31.0 kg Chicken Curry, 16.5 kg Veg Curry, 12.0 L Curd**), and **Two-Stage Batch Staging** recommendation (Initial 84% cook + Reserve 16% staging).
4. **Record Consumption:** Click `[ Record Consumption ]`.
   - View dish-level consumption inputs (Prepared, Served, Unserved Leftovers).
   - Notice the prominent **"Leftover $\neq$ Waste"** operational banner.
   - Click `[ Evaluate Service Balance ]`.
   - Automatically detects unserved surplus and flags **RECOVERABLE SURPLUS DETECTED**.
5. **Route to Recovery:** Click `[ Route to Recovery ]`.
   - Inspect the active surplus manifest (**3.2 kg Rice, 2.5 kg Chicken Curry, 1.8 L Dal**) at Hyderabad loading dock.
6. **Assign Partner via Mapbox:** Click `[ View Map & Partners ]`.
   - View the interactive Mapbox GL JS map centered on Hyderabad.
   - Click on verified NGO pins (Robin Hood Army Gachibowli 2.8 km, Feeding India Madhapur 4.6 km).
   - Click `[ Schedule Pickup ]` to launch the dispatch modal with OTP verification.
7. **Refresh Test:** Press `F5` / reload. Notice the dashboard and operational state remain fully persisted!

---

## 6. Repository Artifacts

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Complete component topology, data flow, and Mapbox integration
- [`DATABASE.md`](./DATABASE.md) — Relational schema, 10 Indian operations tables, and migration guide
- [`ROUND2_PROGRESS.md`](./ROUND2_PROGRESS.md) — Verification matrix and roadmap
- [`supabase/migrations/`](./supabase/migrations/) — Reproducible PostgreSQL migrations (including `20261009000000_foodflow_indian_operations.sql`)
- [`.env.example`](./.env.example) — Safe placeholder configuration

---

## 7. License & Credits

Built for **VISTERA 2026** • Problem Statement PS-44.  
FOODFLOW Platform © 2026. Predict. Prevent. Recover.

