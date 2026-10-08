# FOODFLOW — Elimination Round Judge Q&A Defense

**Project:** FOODFLOW  
**Tagline:** Predict. Prevent. Recover.  
**Problem Statement:** PS-44 — Cutting Food Waste  
**Facility Context:** Deccan Grand Hotel — Hyderabad (Illustrative Demonstration Facility)

---

### 1. What problem are you solving?
Institutional kitchens (hotel banquets, university hostels, corporate canteens) regularly overproduce by 15–30% because predicting real diner attendance is difficult. Excess food is frequently wasted while local shelters face immediate meal shortages. FOODFLOW closes this operational gap through a continuous loop: **Historical hotel baseline &rarr; Deterministic diner prediction &rarr; Calibrated food preparation &rarr; Real service tracking &rarr; Surplus detection &rarr; Direct Hyderabad recovery matching**.

---

### 2. Where does your data come from?
For this hackathon demonstration, data comes from a curated **90-day illustrative historical dataset** modeled specifically on the **Deccan Grand Hotel — Hyderabad** (`DGH-HYD-01`). It contains 158 distinct service shifts across Breakfast, Lunch, and Dinner with recorded registrations, actual turnstile attendance, prepared quantities, consumed quantities, leftovers, and local events. All generated demo data is strictly labeled: **"Illustrative Demo Hotel Dataset — Not Real Customer Data"**. In production, this data feeds from hotel Property Management Systems (PMS) or hostel turnstile biometric logs.

---

### 3. What database do you use?
FOODFLOW is architected for **Supabase PostgreSQL** (`forecasts`, `consumption_records`, `surplus_listings`, `recovery_organizations`, `service_history`). When active Supabase credentials are configured in `.env.local`, records persist to the cloud. In offline demonstration mode, FOODFLOW uses an internal localStorage fallback so the entire closed-loop workflow remains functional and testable without network barriers.

---

### 4. How does customer prediction work?
Prediction uses an explainable, closed-form deterministic statistical engine—**not a black-box deep neural network**.
$$\text{Prediction} = \min\Big(\text{Hotel Capacity},\; \text{Historical Baseline} \times \big(1 + \Delta_{\text{DayOfWeek}}\big) \times \big(1 + \Delta_{\text{RecentTrend}}\big) \times \big(1 + \Delta_{\text{Event}}\big)\Big)$$
- It retrieves comparable historical shifts for that specific meal (Breakfast, Lunch, Dinner).
- Computes empirical day-of-week adjustments (e.g., Saturday lunch footfall variance).
- Applies a rolling trend factor based on recent week-over-week velocity.
- Strictly clamps the prediction to the facility's hard physical capacity (1,000 meals).
- The exact breakdown and arithmetic steps are visible in the "View Calculation" modal.

---

### 5. How do you validate prediction quality?
We utilize a **chronological holdout validation protocol**:
- **Estimation Set:** Earlier 65% of records (Days 1–60) establish historical baselines.
- **Holdout Test Set:** Later 35% of records (Days 61–90) evaluate out-of-sample prediction error.
- **Metric:** Mean Absolute Error (MAE) and Mean Absolute Percentage Error (MAPE).
- **Result:** FOODFLOW achieves a **Model MAE of 6.7 to 14.2 diners**, compared to **29.8 diners** for the naive historical meal baseline, demonstrating a **~52% error reduction** on unseen out-of-sample data.

---

### 6. How do you calculate food quantities?
Food preparation is calculated using calibrated consumption rates per diner for authentic Indian menu items:
$$\text{Base Requirement} = \text{Predicted Diners} \times \text{Per-Diner Consumption Rate}$$
$$\text{Recommended Total} = \text{Base Requirement} \times (1 + \text{Safety Buffer Pct})$$
$$\text{Initial Batch} = \text{Total} \times 85\%, \quad \text{Reserve Batch} = \text{Total} \times 15\%$$
Units are tracked in appropriate culinary metrics (`kg` for rice/curry, `L` for dal/sambar/curd, `pieces` for idli/dosa/roti). Two-stage batching holds the 15% reserve until dining room velocity is observed mid-service.

---

### 7. What does Gemini do?
Gemini 3.8 Flash acts exclusively as a **qualitative operational assistant**. It:
1. Summarizes why turnout may fluctuate based on registered calendar context.
2. Formulates practical chef recommendations (e.g., holding chicken curry in batches to prevent over-stewing).
3. Interprets service mismatches.
**Crucially, Gemini is never the source of truth for numerical forecasts, food weights, distances, or database records.** All numbers are calculated deterministically on the server.

---

### 8. How does the hotel connect to organizations?
When excess food is logged at service completion, FOODFLOW automatically generates a surplus listing with portion equivalents, storage temperature, safe consumption window, and dietary attributes. A multi-factor match score ranks local partners based on food-type compatibility (40 pts), geodesic proximity (35 pts), and available daily intake capacity (25 pts).

---

### 9. Where do organization data and locations come from?
The demonstration directory consists of **7 seeded demo partners** with real Hyderabad coordinates representing key community zones:
- **Gachibowli:** Robin Hood Army Chapter (`17.4410, 78.3610`)
- **Madhapur / Hitec City:** Feeding India Hub (`17.4485, 78.3790`)
- **Kondapur:** Annamrita Foundation Kitchen (`17.4620, 78.3605`)
- **Mehdipatnam:** Community Relief Kitchen (`17.3916, 78.4418`)
- **Ameerpet:** Food Support Network (`17.4375, 78.4482`)
- **Kukatpally:** Relief & Shelter Society (`17.4947, 78.3996`)
- **Secunderabad:** Railway Shelter Foundation (`17.4399, 78.5018`)
All partners are clearly labeled: **"Seeded Demo Partner (Illustrative)"**.

---

### 10. How is distance calculated?
Distance is calculated using the spherical **Haversine great-circle formula** between Deccan Grand Hotel (`17.4447, 78.3483`) and partner coordinates. The UI explicitly discloses the result as an **approximate straight-line distance**, not road driving distance. If coordinates are invalid or missing, it safely outputs `"Distance unavailable"` without throwing an unhandled exception.

---

### 11. What happens if an API fails?
FOODFLOW is engineered for **graceful degradation**:
- **If Gemini fails or is unconfigured:** The forecast engine continues to calculate deterministic diner numbers and food preparation targets flawlessly; an informative fallback guidance notice is displayed.
- **If Supabase is disconnected:** State seamlessly falls back to resilient local storage; cloud status is labeled `"Demo Data (Local Fallback)"`.
- **If Leaflet map tiles are offline:** The application renders an interactive GIS fallback card view with identical coordinate synchronization and partner dispatch options.

---

### 12. What are the limitations?
1. The 90-day dataset is synthetic demo data tailored to an illustrative hotel; it reflects institutional dynamics but is not production telemetry.
2. Haversine distance measures geodesic straight lines; real-world routing requires traffic-aware road routing APIs.
3. The partner acceptance and pickup actions in this build are simulated workflows, not real-time NGO push notifications.

---

### 13. What makes the closed-loop workflow useful?
Most software only predicts *or* lists surplus. FOODFLOW connects both ends into a continuous learning cycle:
$$\text{Forecast} \longrightarrow \text{Staged Prep} \longrightarrow \text{Service Tracking} \longrightarrow \text{Surplus Rescue} \longrightarrow \text{Historical Calibration}$$
Every day's actual turnout and leftover data feeds back into the historical dataset, making tomorrow's baseline more accurate and continuously driving down avoidable waste.

---

### 14. What would you improve in production?
1. Integrate bidirectional webhook APIs with commercial hotel PMS (Opera, Protel) and university turnstile RFID/biometric gates.
2. Partner with verified food safety auditors to log IoT thermal probes in real time on food dispatch containers.
3. Upgrade straight-line Haversine to real-time OSRM (Open Source Routing Machine) or Google Maps Distance Matrix for Hyderabad traffic routing.
4. Deploy WhatsApp Business / SMS API for instant recovery partner dispatch alerts and tamper-proof QR code proof-of-delivery handoffs.
