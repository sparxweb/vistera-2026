# FOODFLOW — Elimination Round Judge Q&A Defense

**Project:** FOODFLOW  
**Tagline:** Predict. Prevent. Recover.  
**Problem:** PS-44 — Cutting Food Waste  
**Demo Facility:** Deccan Grand Hotel — Hyderabad (Illustrative Demonstration Facility)

---

## 1. What problem are you solving?
FOODFLOW helps institutional kitchens (hotel banquets, hostels, corporate canteens) estimate daily meal demand, prepare appropriate food quantities, track actual consumption, and connect eligible surplus with organizations through a structured recovery workflow.

---

## 2. How does your system work?
It follows a closed loop:
$$\text{Historical Data} \longrightarrow \text{Forecast} \longrightarrow \text{Food Preparation} \longrightarrow \text{Service Tracking} \longrightarrow \text{Surplus Detection} \longrightarrow \text{Organization Matching} \longrightarrow \text{Pickup} \longrightarrow \text{Historical Learning}$$

---

## 3. What database do you use?
We use Supabase, which provides a PostgreSQL database. It stores hotel profiles, historical service records, forecasts, consumption audits, surplus listings, recovery organizations, and pickup records. We verify cloud persistence separately from our offline local demonstration storage fallback.

---

## 4. Where does the customer data come from?
In a real deployment, the hotel supplies its previous breakfast, lunch, and dinner attendance and consumption records from its Property Management System (PMS) or turnstile check-ins. For our hackathon demonstration, we utilize a 90-day illustrative dataset (158 service shifts) explicitly labeled: **"Illustrative Demo Hotel Dataset — Not Real Customer Data"**.

---

## 5. How do you predict today's customers?
Our application uses a deterministic historical forecasting method:
1. Retrieves previous records for the same service (Breakfast, Lunch, or Dinner).
2. Calculates a comparable shift historical baseline.
3. Computes day-of-week variances when sufficient observations exist ($N \ge 3$).
4. Evaluates recent demand trends (rolling week-over-week velocity).
5. Applies a special-event adjustment only when supported by historical records.
6. Strictly enforces physical operational capacity limits ($C_{\text{max}} = 1000$ meals).
7. The interface provides a "View Calculation" breakdown detailing every input and step.

---

## 6. Are you training an AI model?
We use historical data to estimate demand and evaluate forecast quality using statistical time-series methods. We do **not** claim to have trained a black-box deep learning model. Large language models (Gemini 3.8 Flash) are strictly decoupled and used only for qualitative explanations and chef staging guidance.

---

## 7. How do you know the prediction is accurate?
We evaluate the forecasting engine using a **chronological holdout validation** protocol:
- **Estimation Set:** Earlier 65% of records (Days 1–60)
- **Holdout Test Set:** Later 35% of records (Days 61–90)
- **Measured Out-of-Sample Error:** Our multi-factor model achieves a **Mean Absolute Error (MAE) of 6.7 to 14.2 diners**, compared to **29.8 diners** for the naive comparable baseline (~52% variance reduction).
- We report measured error rather than claiming an unsupported arbitrary accuracy percentage. These results represent demo-data validation.

---

## 8. How do you calculate food preparation quantities?
We calculate food quantities for 12 authentic Indian menu items using measured consumption rates per diner:
$$\text{Base Requirement} = \text{Predicted Diners} \times \text{Per-Diner Consumption Rate}$$
$$\text{Recommended Total} = \text{Base Requirement} \times (1 + \text{Safety Buffer Pct})$$
To prevent overproduction without risking stockouts, preparation is partitioned into a **Two-Stage Batch**:
- **Initial Batch (85%):** Prepared prior to service opening.
- **Reserve Batch (15%):** Prepped in cold staging and fired only if mid-service turnstile check-ins reach trigger thresholds.

---

## 9. What is Gemini used for?
Gemini 3.8 Flash acts exclusively as an operational reasoning copilot:
- Explains why the forecast differs from historical baselines.
- Suggests practical kitchen staging actions and temperature controls.
- Summarizes recorded surplus and shortage patterns.
**Gemini never calculates headcount, food weights, GPS coordinates, or database truth.**

---

## 10. How does the hotel connect to recovery organizations?
The hotel creates a surplus listing specifying food items, portions, holding temperature, and safe pickup window. FOODFLOW matches the listing against our recovery directory using:
- Food category compatibility (40 pts)
- Haversine proximity (35 pts)
- Partner intake capacity (25 pts)
A partner accepts the offer, generating a pickup record with a 4-digit verification OTP.

---

## 11. Do you use an NGO API?
The hackathon prototype uses a seeded demo recovery directory of 7 illustrative partners in Hyderabad. We do not claim to have a live third-party NGO API connected.

---

## 12. Where do the organization locations come from?
Our demo map uses explicitly labeled illustrative Hyderabad locations in key zones:
- **Gachibowli:** Robin Hood Army Chapter (`[17.4401, 78.3610]`)
- **Madhapur:** Feeding India Relief Hub (`[17.4483, 78.3915]`)
- **Kondapur:** Annamrita Foundation Kitchen (`[17.4622, 78.3568]`)
- **Mehdipatnam:** Hyderabad Youth Brigade Kitchen (`[17.3916, 78.4420]`)
- **Ameerpet:** Telangana Food Bank (`[17.4375, 78.4482]`)
- **Kukatpally:** Akshaya Patra Dispatch Depot (`[17.4849, 78.4138]`)
- **Secunderabad:** Railway Shelter Feeding Unit (`[17.4399, 78.5017]`)
These markers are labeled **"Seeded Demo Partner (Illustrative)"**; they demonstrate the matching workflow rather than representing verified legal entities.

---

## 13. How do you calculate distance?
When valid coordinates exist, the application calculates approximate straight-line geodesic distance using the **Haversine formula**. If coordinates are missing or invalid, it displays `"Distance unavailable"`. It does not claim to represent live road driving distance.

---

## 14. Do you need a paid map API?
**No.** FOODFLOW uses **Leaflet with OpenStreetMap tiles**. It is 100% free, requires zero Mapbox or Google Maps API tokens, and incurs zero monthly billing costs.

---

## 15. What happens when Gemini or the network fails?
FOODFLOW features complete graceful degradation:
- **If Gemini fails or is unconfigured:** All numerical forecasts, batch calculations, and recovery workflows continue to operate deterministically. Pre-calibrated rule-based guidance is displayed.
- **If Supabase or the network fails:** State persists in local browser storage, and the UI displays a clear `"Local Operational Storage (Demo Active)"` status indicator.

---

## 16. What is the main benefit of FOODFLOW?
It integrates demand estimation, preparation batching, actual service audits, and surplus recovery into one cohesive, closed-loop workflow where newly recorded service outcomes automatically calibrate future forecasts.

---

## 17. What are the current limitations?
1. The 90-day dataset and 7 recovery partners are illustrative demo data.
2. Distance calculations represent straight-line geodesic proximity rather than turn-by-turn traffic routing.
3. Partner acceptance and pickup events are simulated demonstrations.
4. Real-world deployment requires integration with hotel PMS systems and formal NGO food safety onboarding.

---

## 18. What would you improve next?
1. Onboard commercial institutional kitchens and integrate PMS/turnstile attendance webhooks.
2. Integrate real-time traffic routing engines (e.g., OSRM).
3. Implement IoT temperature sensor telemetry for hot-held food containers.
4. Establish automated WhatsApp/SMS dispatch notifications with digital proof-of-delivery signatures.

---

## 19. What APIs and services do you use?
- **Supabase (PostgreSQL):** Relational persistence for hotels, shift archives, forecasts, and dispatches.
- **Google Gemini 3.8 Flash:** Server-side natural language explanations and culinary staging recommendations.
- **Next.js Route Handlers (`/api/forecast`, `/api/consumption`, `/api/ai`):** Server-side execution of deterministic logic and AI interactions.
- **Leaflet & OpenStreetMap:** Free, open-source geospatial visualization of the Hyderabad recovery corridor.

---

## 20. The 20-second project explanation
> *"FOODFLOW helps institutional kitchens predict meal demand from historical attendance, calculate staged preparation quantities across Indian menus, track actual consumption, and identify recoverable surplus. It then matches surplus with organizations across Hyderabad and tracks simulated pickup. Our calculations are explainable, Gemini supports the chef recommendations, and our Leaflet map demonstrates the recovery workflow with zero paid API dependencies."*
