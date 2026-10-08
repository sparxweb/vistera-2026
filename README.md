# FOODFLOW — AI-Powered Food Waste Prevention & Surplus Recovery Platform

> **Predict. Prevent. Recover.**  
> **Event:** VISTERA 2026  
> **Problem Statement:** PS-44 — Cutting Food Waste  
> **Milestone:** Round 2 Working MVP

---

## Quick Navigation

- **Application Directory:** [`/vistera-app`](./vistera-app)
- **Round 2 Official Report:** [`ROUND2_IMPLEMENTATION_REPORT.md`](./ROUND2_IMPLEMENTATION_REPORT.md)
- **Technical Architecture:** [`/vistera-app/ARCHITECTURE.md`](./vistera-app/ARCHITECTURE.md)
- **Database Schema:** [`/vistera-app/DATABASE.md`](./vistera-app/DATABASE.md)
- **Round 2 Progress Report:** [`/vistera-app/ROUND2_PROGRESS.md`](./vistera-app/ROUND2_PROGRESS.md)
- **Database Migrations:** [`/vistera-app/supabase/migrations`](./vistera-app/supabase/migrations)

---

## Round 2 Working Vertical Slice

FOODFLOW has completed its core operational closed loop calibrated for institutional dining halls (Campus Central Dining Hall, Hyderabad, 1000 capacity):

$$\mathbf{FORECAST} \longrightarrow \mathbf{PREPARE} \longrightarrow \mathbf{MONITOR} \longrightarrow \mathbf{DETECT} \longrightarrow \mathbf{RECOVER}$$

### Key Capabilities Delivered:
- **Real Culinary Units:** Multi-dish planning in physical quantities (`kg`, `L`, `pieces`) replacing abstract units.
- **Data-Driven Forecast Engine:** Empirical attendance regression from 25 shift records and Two-Stage Batch Staging (Initial Cook 84% + Reserve 16%).
- **Leftover $\neq$ Waste Distinction:** Unserved food at safe temperatures is preserved as rescue surplus, isolating true kitchen waste.
- **Interactive Mapbox GL JS Spatial Logistics:** Real geodesic distance routing across Hyderabad recovery corridor with direct pickup scheduling modal.
- **Decoupled AI Copilot:** Google Gemini 3.8 Flash qualitative reasoning strictly isolated from deterministic calculations.

### Running the Application Locally
```bash
cd vistera-app
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to experience the live application.

