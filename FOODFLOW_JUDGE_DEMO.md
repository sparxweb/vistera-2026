# FOODFLOW — Judge & Evaluator 2-Minute Demo Script
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Tagline: “Predict. Prevent. Recover.”*

---

## 🎯 Evaluator Walkthrough (Exact Recommended Sequence)

### STEP 1: Fast Demo Login (0:00 - 0:15)
1. Open the FOODFLOW application in your browser.
2. In the navigation bar or hero banner, click **"Continue with Demo Hotel"**.
3. **What to tell the judge**:
   > *"We immediately land in the operational control center of Deccan Grand Hotel — Hyderabad, an illustrative 1000-seat hospitality facility."*

---

### STEP 2: Section 1 — Overview (0:15 - 0:35)
1. Review the **4 Core Operational Questions** prominently displayed at the top:
   - **Expected Customers Today?** $\to$ **795 diners** (vs 820 bookings, High Reliability based on 90-day archive)
   - **Food To Prepare?** $\to$ **105.0 kg** across 5 core lunch dishes
   - **Risk of Shortage or Surplus?** $\to$ **Balanced** (Low risk, protected by 3.0% safety buffer)
   - **Recoverable Surplus Attention?** $\to$ **5.7 kg** safe surplus staged from prior service
2. Click **"View Calculation Details"** directly from the card to jump into the calculation breakdown.

---

### STEP 3: Section 2 — Demand Forecast (0:35 - 0:55)
1. In the **Demand Forecast** screen, inspect the input controls:
   - Service: **Lunch**
   - Expected Registrations: **820**
   - Special Event: **Banqueting Conference**
2. Click the prominent **[ View Calculation Breakdown ]** button:
   - **Show the judges the transparent math**:
     - Comparable Lunch Baseline ($B_{\text{meal}}$): **710 diners** ($N=90$ shifts)
     - Saturday Historical Effect ($\Delta_{\text{day}}$): **+4.8%** (+34 diners)
     - 7-Day Rolling Trend ($\Delta_{\text{trend}}$): **+2.1%** (+15 diners)
     - Special Event Adjustment ($\Delta_{\text{event}}$): **+1.5%** (+11 diners)
     - Capacity Check: $\min(795, 1000) = \mathbf{795\text{ Diners}}$ (Within Limits ✓)
3. **What to tell the judge**:
   > *"No black-box hallucinations. Gemini does not invent numbers. Headcount is calculated deterministically from 90 days of shift records, and bounded by physical kitchen capacity."*

---

### STEP 4: Section 3 — Food Preparation Calculator (0:55 - 1:15)
1. Navigate to **Food Preparation** in the top navigation.
2. Inspect the **12-Item Institutional Indian Menu**:
   - Steamed Rice (kg), Dal Tadka (L), Andhra Chicken Curry (kg), Paneer Butter Masala (kg), Hyderabadi Dum Biryani (kg), Fresh Set Curd (L), Idli (pcs), Dosa (L), Sambar (L), Chutney (kg), Phulka Roti (pcs).
3. Point out the **Staged Cooking Strategy**:
   - **Initial Batch (85%)**: Cooked prior to line open (e.g., 36.6 kg Rice).
   - **Reserve Batch (15%)**: Kept in cold staging (e.g., 6.4 kg Rice).
   - **Culinary Trigger**: Only fired if turnstile check-ins exceed 75% of forecast 45 minutes before shift closure.
4. **What to tell the judge**:
   > *"Staged cooking is how we eliminate the final 15% of food waste without risking a food stockout."*

---

### STEP 5: Section 4 — Service Tracking (1:15 - 1:30)
1. Navigate to **Service Tracking**.
2. Show the post-service audit entry:
   - Actual Diners: **788** (Forecast was 795, error of only 7 diners / 0.88%).
   - Prepared vs Consumed breakdown.
   - Remaining Food: **5.7 kg** classified strictly as **Recoverable Surplus** (hot-held at $67.2^\circ\text{C}$).
3. Click **"Save Actual Shift to Database"**:
   - Demonstrates the closed learning loop: **Forecast $\to$ Prepare $\to$ Track $\to$ Save to History $\to$ Better Next Forecast**.

---

### STEP 6: Section 5 — Food Recovery & Hyderabad Leaflet Map (1:30 - 1:50)
1. Navigate to **Food Recovery**.
2. Point out the active donation listing: **5.7 kg Rice & Chicken Curry** (Dock 2, 2-hour window).
3. Inspect the **Interactive Hyderabad Recovery Map**:
   - Built on **Leaflet + OpenStreetMap** (zero-token, $0.00 cost, zero billing lock-in).
   - Centered on Deccan Grand Hotel (`[17.4447, 78.3483]`).
   - 7 Seeded Hyderabad Demo Partners (Gachibowli, Madhapur, Kondapur, Mehdipatnam, Ameerpet, Kukatpally, Secunderabad).
   - True straight-line **Haversine distances** (e.g., 1.4 km, 2.2 km, 4.5 km).
4. Point out the **Best Match**: Robin Hood Army — Gachibowli (95% score).
5. Click **"Schedule Pickup"**:
   - Show simulated dispatch transition to `PICKUP_SCHEDULED` with verification OTP `8924`.

---

### STEP 7: Section 6 & 7 — History, Accuracy & Settings (1:50 - 2:00)
1. Navigate to **History & Accuracy**:
   - **Chronological Holdout Validation Card**: Train (Days 1–60) vs Holdout Test (Days 61–90).
   - Model MAE: **14.2 diners** vs Baseline MAE: **29.8 diners** (**52.3% error reduction**).
   - Mon–Sun empirical averages with exact sample sizes $N$ computed from the database.
2. Navigate to **Integrations & Settings**:
   - Show the API Health Diagnostic: Supabase, Gemini 3.8 Flash, Leaflet OSM, 90-day archive.
3. Finish:
   > *"FOODFLOW delivers a closed-loop institutional food management system: Predict demand, Prevent kitchen overproduction, and Recover surplus safely across Hyderabad."*

---

## 🏆 Key Defensible Answers for Judges
- **"Where do predictions come from?"**  
  Deterministic closed-form arithmetic combining comparable shift baselines, day-of-week variances, and 7-day rolling trends from Deccan Grand Hotel records.
- **"What does Gemini do?"**  
  Gemini provides qualitative manager explanations only. Numbers are calculated 100% deterministically. If AI is offline, the entire platform still functions flawlessly.
- **"How is distance calculated?"**  
  Using the exact mathematical Haversine spherical formula from actual Hyderabad GPS coordinates.
- **"What map engine do you use?"**  
  Leaflet with OpenStreetMap tiles. It requires zero API tokens, runs 100% free, and eliminates dependency on paid Mapbox or Google Maps billing accounts.
- **"Is food waste eliminated?"**  
  Overproduction is minimized via two-stage batch staging, and unavoidable remaining food is safely recovered before spoilage.
