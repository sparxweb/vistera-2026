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

In accordance with the VISTERA 2026 Round 2 mandate, this repository delivers a **real, working, demonstrable foundation**:

$$\mathbf{FORECAST} \longrightarrow \mathbf{PREPARE} \longrightarrow \mathbf{MONITOR} \longrightarrow \mathbf{DETECT}$$

### Working Features:
- **Deterministic Demand Engine (`src/lib/forecast/engine.ts`):** Calculates expected servings and recommended preparation bounds without hallucinated numbers.
- **RESTful Forecast API (`POST /api/forecast`):** Generates numerical projections, integrates Gemini 3.8 Flash for qualitative batch advice, and persists records to Supabase.
- **Consumption Balance Evaluator (`src/lib/business/balance.ts`):** Calculates remaining meals and dynamically flags `SURPLUS`, `SHORTAGE`, or `BALANCED` states.
- **Consumption API (`POST /api/consumption`):** Ingests actual service numbers and writes to PostgreSQL.
- **Kitchen Control Center UI:** Redesigned with single primary CTAs and calm hierarchy.
- **Dual-Layer Persistence:** Client fallback cache preserves shift data across full browser page reloads.

---

## 3. Technology Stack

- **Frontend:** Next.js 16 (React 19), Tailwind CSS, Lucide React
- **Backend / APIs:** Next.js App Router API Routes (`/api/forecast`, `/api/consumption`, `/api/ai`)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Forecasting:** Deterministic Statistical Time-Series Regressor
- **AI Reasoning:** Google Gemini 3.8 Flash (Qualitative Explanations Only)
- **Spatial Logistics:** Leaflet + OpenStreetMap with Vector Grid Fallback

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
Add your credentials (optional, local storage and deterministic fallback activate automatically if keys are absent):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
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
2. **Open Dashboard:** Click `[ Open Kitchen Dashboard ]`. View Today's Service hero card and the Demand Horizon chart.
3. **Run Forecast:** Click `[ Run Forecast ]` or select **Operations $\to$ Demand Forecast**.
   - Enter `800` expected diners, meal `Lunch`, context `None`.
   - Click `[ Generate Forecast ]`.
   - Observe deterministic output: **742 Predicted**, **760 Recommended Preparation**, **Medium Risk**, with separated Gemini AI insight.
4. **Record Consumption:** Click `[ Record Consumption ]`.
   - Enter Prepared = `760`, Served = `728`.
   - The visual balance indicator automatically detects **32 servings remaining** and flags **POTENTIAL SURPLUS DETECTED**.
5. **Route to Recovery:** Click `[ Route to Recovery ]`.
   - Inspect the active 32-serving recovery card and 5-stage progress timeline (*ACTIVE $\to$ VIEWED $\to$ ACCEPTED $\to$ PICKUP SCHEDULED $\to$ COLLECTED*).
6. **Assign Partner:** Click `[ Find Recovery Partner ]` to view the live Leaflet map and schedule a pickup.
7. **Refresh Test:** Press `F5` / reload. Notice the dashboard and analysis values remain fully persisted!

---

## 6. Repository Artifacts

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Complete component topology and data flow
- [`DATABASE.md`](./DATABASE.md) — Relational schema, tables, and foreign keys
- [`ROUND2_PROGRESS.md`](./ROUND2_PROGRESS.md) — Verification matrix and roadmap
- [`supabase/migrations/`](./supabase/migrations/) — Reproducible PostgreSQL migrations
- [`.env.example`](./.env.example) — Safe placeholder configuration

---

## 7. License & Credits

Built for **VISTERA 2026** • Problem Statement PS-44.  
FOODFLOW Platform © 2026. Predict. Prevent. Recover.
