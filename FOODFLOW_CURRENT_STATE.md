# FOODFLOW — Current Project State & Technical Audit
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Tagline: “Predict. Prevent. Recover.”*  
*Audit Timestamp: October 9, 2026*

---

## 1. Project Purpose
FOODFLOW is an institutional food waste prevention and surplus recovery platform engineered for high-volume commercial kitchens (hotel banquets, university hostels, hospital dining, corporate canteens). 

It solves the dual problem of institutional overproduction (cooking 15–30% too much food due to volatile attendance) and community food insecurity by connecting the complete operational lifecycle:
$$\text{Historical Shift Data} \longrightarrow \text{Diner Prediction} \longrightarrow \text{Staged Food Preparation} \longrightarrow \text{Service Tracking} \longrightarrow \text{Surplus Classification} \longrightarrow \text{Recovery Matching} \longrightarrow \text{Pickup Scheduling} \longrightarrow \text{Historical Learning}$$

---

## 2. Actual Confirmed Technology Stack
Based strictly on inspected repository source code and dependency manifests (`package.json`):

| Technology | Role | Status in Code | Runtime / Verification State |
| :--- | :--- | :---: | :--- |
| **Next.js 16.4.0 (Turbopack)** | Full-Stack Application Framework | Found | **VERIFIED** — Compiles and builds successfully (`next build`) |
| **React 19.0.0** | Frontend UI Library | Found | **VERIFIED** — Renders all 7 operational screens |
| **TypeScript 5.x** | Static Type Safety | Found | **VERIFIED** — `tsc --noEmit` passes with 0 errors |
| **Tailwind CSS 3.4.17** | Styling System | Found | **VERIFIED** — Clean B2B palette (warm white, dark charcoal, restrained green) |
| **Lucide React** | UI Icons | Found | **VERIFIED** — Used consistently across all screens |
| **Leaflet & React-Leaflet** | Interactive Mapping | Found | **VERIFIED** — Operates on OpenStreetMap tiles with zero API keys required |
| **Supabase Client (`@supabase/ssr`, `@supabase/supabase-js`)** | Database Connectivity | Found | **CONFIGURED & TESTED** — Connected to project endpoint; migrations ready in SQL but unexecuted remotely |
| **Google Gemini (`@google/genai`)** | Primary AI Copilot | Found | **CONFIGURED** — Called server-side in `/api/forecast` and `/api/ai` for qualitative chef advice |
| **NVIDIA Nemotron (`openai` SDK)** | Secondary AI Fallback | Found | **VERIFIED WORKING** — Successfully responds via NVIDIA NIM endpoint |
| **Node.js Test Runner / TSX** | Automated Testing | Found | **VERIFIED** — 21/21 master tests pass (100%) |

---

## 3. Existing & Working Features

### 3.1 7 Clean, Defensible Operational Screens
1. **Overview Screen**: Explicitly answers the four core operational questions at a glance:
   - Expected customers today? (**795 diners**)
   - Food to prepare? (**105.0 kg** across 5 lunch items)
   - Risk of shortage/surplus? (**Balanced / Low risk**)
   - Recoverable surplus requiring attention? (**5.7 kg** unserved surplus)
   Includes direct button to inspect the underlying calculation arithmetic.
2. **Demand Forecast Screen**: Input controls for meal type, expected registrations, operational context, and a prominent **"View Calculation Breakdown"** modal showing baseline, day effect %, trend %, and capacity safety bounds.
3. **Food Preparation Calculator**: Dedicated Indian kitchen scaling across 12 dishes (Rice, Dal, Chicken Curry, Paneer, Veg Korma, Dum Biryani, Curd, Idli, Dosa, Sambar, Chutney, Roti) in `kg`, `L`, and `pieces`, partitioned into **85% initial batch** and **15% reserve batch**.
4. **Service Tracking Screen**: Post-service audit logging actual diners, prepared vs consumed amounts, leftovers, and surplus/waste classification.
5. **Food Recovery Screen**: Interactive Leaflet + OpenStreetMap Hyderabad recovery grid with 7 seeded partners and a 5-stage dispatch flow (`listed` $\to$ `viewed` $\to$ `accepted` $\to$ `scheduled` $\to$ `collected`).
6. **History & Accuracy Screen**: Complete 90-day archive table (158 shifts), Mon–Sun empirical averages with sample sizes $N$, and chronological holdout validation metrics (MAE / MAPE).
7. **Integrations & Settings Screen**: Live diagnostic status card showing database connection, AI engine status, and map provider status without exposing secrets.

### 3.2 90-Day Illustrative Historical Dataset
- 158 shift records covering Breakfast, Lunch, and Dinner.
- Explicit disclosure label: `Illustrative Demo Hotel Dataset — Not Real Customer Data`.
- Clean internal consistency: zero negative diners, zero food served exceeding prepared food.

### 3.3 Chronological Holdout Validation
- Partitioned into Days 1–60 (training/estimation) and Days 61–90 (holdout evaluation).
- Achieves **14.2 diners MAE** vs **29.8 diners naive baseline MAE** (**52.3% error reduction**).

---

## 4. Incomplete Features & Honest Gaps
1. **Remote Supabase Migrations Unapplied**: While SQL migration files are written and `.env.local` contains Supabase credentials, running queries against the remote project returns `PGRST205: table public.kitchens not found`. The application operates on its tested local fallback storage (`localStorage`), not remote PostgreSQL.
2. **No Hardware PMS / Biometric Integration**: The system does not interface with live Oracle Opera / Protel PMS or physical turnstile RFID gates. Data is input via web forms.
3. **Straight-Line vs Road Traffic Distances**: Distances between Deccan Grand Hotel and recovery partners are computed using the spherical Haversine formula (approximate straight line), not live turn-by-turn road navigation or traffic APIs.
4. **Simulated NGO Dispatch**: Partner acceptance and driver dispatch workflows are demonstrated via local simulation and verification OTPs; no live NGO API is connected.

---

## 5. Actual Database State
- **Defined Schema (SQL)**: `kitchens`, `demand_forecasts`, `daily_consumption`, `surplus_listings`, `recovery_orgs`, `pickup_records`.
- **Remote Execution State**: **MIGRATION READY BUT NOT EXECUTED REMOTELY**.
- **Active Operational State**: **Local Fallback Storage Engine (`localStorage`)** with full CRUD persistence across page refreshes.

---

## 6. Actual API Routes
- `POST /api/forecast`: Validates inputs, calculates deterministic demand forecast, requests qualitative Gemini/NVIDIA explanation, returns calculation breakdown.
- `POST /api/consumption`: Validates prepared and served amounts, classifies surplus/shortage/balanced, updates historical learning loop.
- `POST /api/ai`: Server-side proxy for qualitative chef copilot explanations with Gemini-to-NVIDIA fallback.

---

## 7. Current Prediction Method
- **Mathematical Nature**: Deterministic closed-form statistical time-series calculation.
- **Formula**:
  $$\text{Prediction} = \min\Big(C_{\text{max}},\; \text{round}\big(B_{\text{meal}} + \Delta_{\text{day}} + \Delta_{\text{trend}} + \Delta_{\text{event}}\big) \times \frac{\text{Expected}}{B_{\text{meal}}}\Big)$$
- **Nature of AI**: Gemini and NVIDIA are **never used to compute numbers**. They provide natural language explanations and kitchen staging advice only.

---

## 8. Recovery Workflow
- **Map Provider**: Leaflet with OpenStreetMap tiles ($0.00 cost, zero API tokens required).
- **Directory**: 7 seeded demo partners across key Hyderabad localities (Gachibowli, Madhapur, Kondapur, Mehdipatnam, Ameerpet, Kukatpally, Secunderabad).
- **Scoring**: Food Category Need (40 pts) + Haversine Proximity (35 pts) + Available Capacity (25 pts).
- **Lifecycle**: 5-stage simulated progression (`listed` $\to$ `viewed` $\to$ `accepted` $\to$ `pickup_scheduled` $\to$ `collected`) with 4-digit OTP.

---

## 9. Known Limitations
- The 90-day archive represents synthetic demo records, not telemetry from a real commercial hotel.
- Holdout validation metrics demonstrate mathematical defensibility on synthetic data, not verified real-world operational accuracy.
- External cloud persistence requires running the Supabase SQL migration against the remote database.
