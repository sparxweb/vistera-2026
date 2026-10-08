# FOODFLOW — Judge Q&A (Current Verified State)
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Audit Timestamp: October 9, 2026*

---

### 1. What have you built so far?
We have built an end-to-end working institutional food operations platform with 7 structured screens (Overview, Demand Forecast, Food Preparation, Service Tracking, Food Recovery, History & Accuracy, Settings). It models the full closed loop: historical hotel baseline $\to$ deterministic diner prediction $\to$ staged food preparation $\to$ post-service actuals tracking $\to$ surplus recovery matching $\to$ historical feedback calibration.

### 2. What database are you using?
The application is architected for Supabase PostgreSQL. SQL migrations are written and `.env.local` contains Supabase credentials. In our empirical test, the remote Supabase project is reachable, but table migrations have not yet been run against the remote database. Therefore, the application currently operates on its built-in local fallback storage (`localStorage`), which provides complete offline persistence across sessions.

### 3. How does the frontend connect to the backend?
The React 19 frontend makes HTTP `POST` requests to Next.js App Router server routes (`/api/forecast`, `/api/consumption`, `/api/ai`). In addition, client-side state is synchronized via `src/lib/supabase/service.ts`.

### 4. How does the backend connect to the database?
The Next.js backend uses the official Supabase JavaScript client (`@supabase/supabase-js`) initialized with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Database calls are wrapped in `try/catch` blocks with automatic local storage fallback.

### 5. Which database tables exist?
The schema defines six relational tables: `kitchens`, `demand_forecasts`, `daily_consumption`, `surplus_listings`, `recovery_orgs`, and `pickup_records`. They exist as migration-ready SQL scripts in `supabase/migrations/`, but have not yet been executed in the remote Supabase project.

### 6. How is customer demand currently calculated?
Customer demand is calculated using a deterministic statistical time-series model. For a selected meal (Breakfast, Lunch, Dinner), it calculates the historical comparable baseline ($B_{\text{meal}}$), adds day-of-week variances ($\Delta_{\text{day}}$), applies rolling 7-day trends ($\Delta_{\text{trend}}$), adds event multipliers only when historical records exist, and enforces physical kitchen capacity limits ($C_{\text{max}} = 1000$).

### 7. Does the current prediction use historical hotel data?
Yes. The forecasting engine actively queries our 90-day archive of 158 shift records (`HISTORICAL_SERVICES` in `src/lib/data/historicalServices.ts`) to compute shift-specific baselines, day-of-week effects, and sample counts $N$. The dataset is explicitly labeled: *"Illustrative Demo Hotel Dataset — Not Real Customer Data"*.

### 8. Is this a trained ML model?
No. It is a deterministic statistical rule and time-series estimator. We do not claim to have trained a deep learning or neural network model. This approach was chosen intentionally for institutional catering because it is 100% auditable, reproducible, and immune to stochastic AI hallucinations.

### 9. What is Gemini used for?
Google Gemini 3.8 Flash is used exclusively as a qualitative chef copilot. It explains why a forecast fluctuates, suggests kitchen staging guidelines, and provides temperature holding advice. Gemini **never calculates numbers, headcount, food weights, or distances**.

### 10. Is NVIDIA used?
Yes. In `src/lib/ai/router.ts`, NVIDIA Nemotron (`nvidia/nemotron-3.5-lightning-30b-a3b` via NVIDIA NIM) is configured as the automated fallback for Gemini. We tested this connection, and the NVIDIA endpoint responded successfully.

### 11. How is the preparation quantity calculated?
We multiply predicted diners by calibrated per-diner consumption rates across 12 authentic Indian menu items (in `kg`, `L`, and `pieces`) and add a configured 3.0% safety buffer. Preparation is then partitioned into an **85% initial batch** cooked for opening and a **15% reserve batch** fired only if mid-service check-in triggers are met.

### 12. How does the hotel connect to organizations?
When excess food is logged post-service, the hotel creates a surplus listing with portion counts and holding temperatures. The system ranks local recovery partners using a 100-point match score based on dietary compatibility (40 pts), geodesic proximity (35 pts), and available capacity (25 pts).

### 13. Is the organization directory live or demo?
It is an illustrative demo directory consisting of 7 seeded demonstration partners in key Hyderabad localities (Gachibowli, Madhapur, Kondapur, Mehdipatnam, Ameerpet, Kukatpally, Secunderabad). All entries are labeled: *"Seeded Demo Partner (Illustrative)"*.

### 14. Is a real map API connected?
Yes. We use Leaflet with OpenStreetMap tiles. This is a real, functional, interactive GIS map that requires **$0.00 and zero API tokens**, eliminating any dependency on paid Mapbox or Google Maps billing accounts.

### 15. What is currently verified?
- Full UI and 7 operational screens.
- Deterministic forecast engine and calculation breakdown modal.
- 12-item Indian culinary preparation calculator with 85/15 batch staging.
- 90-day historical dataset (158 shifts) and chronological holdout validation (52.3% MAE reduction).
- Leaflet + OpenStreetMap Hyderabad recovery grid with 7 partners.
- Haversine straight-line distance calculation and safe coordinate fallbacks.
- Automated master test suite (21/21 passed).
- Next.js Turbopack build and TypeScript type-check (0 errors).
- Server-side NVIDIA NIM API connectivity.

### 16. What remains incomplete?
- Remote Supabase database migration execution.
- Live telemetry from hotel Property Management Systems (PMS) or turnstiles.
- Real-time road traffic routing (we currently use straight-line Haversine).
- Live third-party NGO dispatch webhook integration.

### 17. What are the next development priorities?
1. Execute SQL migrations on the remote Supabase project to enable cloud PostgreSQL persistence.
2. Integrate real-time road driving matrix APIs (e.g., OSRM) for Hyderabad traffic routing.
3. Integrate WhatsApp/SMS dispatch notifications with digital proof-of-delivery QR signatures.
4. Onboard pilot institutional kitchens for real turnstile data collection.
