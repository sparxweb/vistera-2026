# FOODFLOW — Judge & Evaluator 2-Minute Demo Script
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Tagline: “Predict. Prevent. Recover.”*

---

## 🎯 Evaluator Walkthrough (Exact Recommended Sequence)

### STEP 1: Fast Demo Login (0:00 - 0:15)
1. Open the FOODFLOW web application.
2. In the navbar or hero, click **"Demo Login"** or select **"Continue with Demo Hotel"**.
3. Notice: Fast access enters **Deccan Grand Hotel — Hyderabad** (`DGH-HYD-01`) immediately without requiring judges to enter credentials.

### STEP 2: Hotel Profile & Control Center (0:15 - 0:35)
1. Inspect the **Hotel Profile Card**:
   - Facility: Deccan Grand Hotel — Hyderabad
   - Type: Large Hotel & Banqueting Facility
   - Max Service Capacity: 1000 meals/service (Strict Safety Bound)
   - Breakdown: Breakfast (800), Lunch (1000), Dinner (900)
2. Toggle the **Service Switcher** (Breakfast, Lunch, Dinner).
3. Review **Today's Lunch Operations**:
   - Registered Diners: 820
   - Predicted Turnout: 795
   - Staged Prep Target: 819
   - Recoverable Surplus: 5.7 kg (3.2 kg Rice + 2.5 kg Chicken Curry)

### STEP 3: Demand Forecast & "View Calculation" (0:35 - 1:05)
1. Navigate to **Demand Forecast**.
2. Select **Saturday Lunch** with 820 expected diners.
3. Click **"Calculate Preparation Plan"**.
4. Click the prominent **[ View Calculation Breakdown ]** button:
   - **Show Judges the Math**:
     - Comparable Lunch Baseline: $710$ diners
     - Saturday Historical Effect: $+4.8\%$ ($+34$ diners)
     - 7-Day Trend: $+2.1\%$ ($+15$ diners)
     - Capacity Cap Check: $\min(795, 1000) = \mathbf{795\text{ Diners}}$ (Within Limits ✓)
5. Review the **Dish Preparation Table**:
   - Steamed Rice: 43.0 kg (Initial Batch: 36.0 kg, Reserve: 7.0 kg)
   - Dal Tadka: 18.0 L (Initial Batch: 15.0 L, Reserve: 3.0 L)
   - Andhra Chicken Curry: 31.0 kg (Initial Batch: 25.0 kg, Reserve: 6.0 kg)
   - *Highlight*: Staged cooking prevents 15–20% overproduction without risking stockouts!

### STEP 4: 30-Day Historical Archive & Pattern Analysis (1:05 - 1:25)
1. Navigate to **Pattern Analysis**:
   - Day-of-Week averages (Mon–Sun).
   - Weekday vs. Weekend delta card ($+10.5\%$).
   - Dynamic natural-language explanation derived directly from stored data.
2. Navigate to **Continuous Learning**:
   - Show the 30-day illustrative operational archive.

### STEP 5: Surplus Recovery, Haversine Map & Dispatch (1:25 - 2:00)
1. Navigate to **Surplus Recovery**:
   - Show active donation listing: 5.7 kg hot-held rice and chicken curry.
2. Navigate to **Recovery Map**:
   - Show the interactive Mapbox map centered on Deccan Grand Hotel (Gachibowli, Hyderabad).
   - Show nearby seeded partners with exact calculated Haversine distances ($1.4\text{ km}$, $2.2\text{ km}$, $4.5\text{ km}$).
   - Point out the **Best Match** badge on Robin Hood Army Gachibowli ($95\text{ pts}$).
3. Click **"Schedule Pickup"**:
   - Confirm dispatch manifest and show status updating to `PICKUP_SCHEDULED`.
   - Point out the closed-loop audit logging back into the database.

---

## 🏆 Key Defensible Answers for Judges
- **"Where do predictions come from?"**  
  Deterministic closed-form arithmetic combining comparable shift baselines, day-of-week variances, and 7-day rolling trends from Deccan Grand Hotel records.
- **"What does Gemini do?"**  
  Gemini provides qualitative manager explanations only. Numbers are calculated 100% deterministically. If AI is offline, the entire platform still functions flawlessly.
- **"How is distance calculated?"**  
  Using the exact mathematical Haversine spherical formula from actual Hyderabad GPS coordinates.
- **"Is food waste eliminated?"**  
  Overproduction is minimized via two-stage batch staging, and unavoidable remaining food is safely recovered before spoilage.
