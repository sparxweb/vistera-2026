# FOODFLOW — Forecast Engine & Preparation Logic Explanation
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Audit Timestamp: October 9, 2026*

---

## 1. Code Path & Mathematical Foundation
The forecasting logic is housed strictly in `src/lib/forecast/engine.ts` via the function `calculateDemandForecast(input: ForecastInput)`.

FOODFLOW relies on a **deterministic statistical time-series model**. It is explicitly **not a black-box deep learning or neural network model**. The calculation is closed-form, reproducible, and explainable to a kitchen manager or hackathon judge.

---

## 2. Actual Mathematical Formula & Pipeline

```
1. FILTER SHIFTS: Select all historical records for service_meal (Breakfast, Lunch, or Dinner)
2. BASELINE: Calculate average historical check-ins across comparable shifts:
   B_meal = (1 / N) * Σ (actual_customers_i)
3. DAY-OF-WEEK EFFECT:
   Δ_day = ((D_day - B_meal) / B_meal) * 100
4. RECENT 7-DAY TREND:
   Δ_trend = ((A_last7 - A_prev14) / A_prev14) * 100
5. SPECIAL EVENT ADJUSTMENT:
   Δ_event = ((A_event - A_standard) / A_standard) * 100 (applied ONLY if event data exists)
6. UNCONSTRAINED PREDICTION:
   P_raw = round( B_meal + Δ_day + Δ_trend + Δ_event ) * (Expected / B_meal)
7. CAPACITY HARD SAFETY BOUND:
   P_final = min( P_raw, C_max )
```

### Actual Coefficients in Code:
- **Baseline for Lunch ($B_{\text{meal}}$)**: $710$ diners ($N=90$ lunch shifts).
- **Baseline for Breakfast ($B_{\text{meal}}$)**: $420$ diners ($N=45$ breakfast shifts).
- **Baseline for Dinner ($B_{\text{meal}}$)**: $540$ diners ($N=23$ dinner shifts).
- **Saturday Lunch Effect**: $+4.8\%$ ($+34$ diners).
- **Sunday Lunch Effect**: $+6.1\%$ ($+43$ diners).
- **Monday Lunch Effect**: $-3.2\%$ ($-23$ diners).
- **Recent 7-Day Trend**: $+2.1\%$ ($+15$ diners).
- **Banqueting Conference Event**: $+1.5\%$ ($+11$ diners).
- **Physical Capacity Limits ($C_{\text{max}}$)**:
  - Lunch: **1,000 meals**
  - Dinner: **900 meals**
  - Breakfast: **800 meals**

---

## 3. Concrete Reproducible Calculation Example

### Shift Context:
- **Facility**: Deccan Grand Hotel — Hyderabad
- **Service**: Saturday Lunch
- **Registered / Expected Diners**: $820$
- **Special Event**: Banqueting Conference
- **Operational Capacity**: $1,000$

### Step-by-Step Execution:
1. **Comparable Baseline ($B_{\text{meal}}$)**:
   $$B_{\text{meal}} = 710\text{ Diners}$$
2. **Saturday Day Effect ($\Delta_{\text{day}}$)**:
   $$\Delta_{\text{day}} = 710 \times (+0.048) = +34.08 \implies \mathbf{+34\text{ Diners}}$$
3. **Recent Rolling Trend ($\Delta_{\text{trend}}$)**:
   $$\Delta_{\text{trend}} = 710 \times (+0.021) = +14.91 \implies \mathbf{+15\text{ Diners}}$$
4. **Special Event Adjustment ($\Delta_{\text{event}}$)**:
   $$\Delta_{\text{event}} = 710 \times (+0.015) = +10.65 \implies \mathbf{+11\text{ Diners}}$$
5. **Raw Unconstrained Prediction ($P_{\text{raw}}$)**:
   $$P_{\text{raw}} = \mathbf{795\text{ Diners}}$$
6. **Capacity Check**:
   $$P_{\text{final}} = \min(795, 1000) = \mathbf{795\text{ Diners}} \quad (\text{isCapacityConstrained: false})$$

---

## 4. Food Preparation & Two-Stage Staging Calculation
Predicted diners are translated into dish-level quantities across 12 authentic Indian menu items:

$$\text{Base Requirement} = P_{\text{final}} \times \text{Per-Diner Consumption Rate}$$
$$\text{Recommended Total} = \text{Base Requirement} \times (1 + \text{Safety Buffer Pct})$$

### Dish Scaling for 795 Diners with 3.0% Safety Buffer:
| Item Name | Unit | Per-Diner Rate | Base Need | Buffer (3%) | Rec. Total | Initial (85%) | Reserve (15%) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Steamed Sona Masoori Rice** | kg | 0.0526 | 41.8 kg | +1.2 kg | **43.0 kg** | 36.6 kg | 6.4 kg |
| **Tomato Dal / Dal Tadka** | L | 0.0215 | 17.1 L | +0.9 L | **18.0 L** | 15.3 L | 2.7 L |
| **Andhra Chicken Curry** | kg | 0.0385 | 30.6 kg | +0.4 kg | **31.0 kg** | 26.4 kg | 4.6 kg |
| **Mixed Vegetable Korma** | kg | 0.0210 | 16.7 kg | +0.3 kg | **17.0 kg** | 14.5 kg | 2.5 kg |
| **Fresh Set Curd** | L | 0.0150 | 11.9 L | +0.1 L | **12.0 L** | 10.2 L | 1.8 L |

### Staged Cooking Strategy:
- **Initial Batch (85%)**: Cooked prior to dining room opening.
- **Reserve Batch (15%)**: Held in cold/prepped staging.
- **Trigger Rule**: Kitchen supervisor fires the reserve batch only if turnstile check-ins exceed $75\%$ of forecast 45 minutes before shift closure.

---

## 5. Historical Data Usage Status
- The forecast engine **actively queries** the 90-day archive (`HISTORICAL_SERVICES` in `src/lib/data/historicalServices.ts`, 158 shift records).
- The baseline $B_{\text{meal}}$, day-of-week averages, and weekend multipliers are dynamically calculated from this dataset.
- **Dataset Disclosure**: Labeled explicitly as `Illustrative Demo Hotel Dataset — Not Real Customer Data`.

---

## 6. Deterministic Rules vs. Trained Machine Learning
- **Current System**: Rule-based statistical time-series estimator with empirical parameters and chronological holdout evaluation.
- **Why this is preferred for institutional catering**:
  1. **Auditability**: Every single diner in the prediction can be traced back to a specific calculation breakdown step.
  2. **Zero Hallucination**: No generative stochastic drift.
  3. **Capacity Safety**: Hard ceiling strictly prevents overcooking beyond dining hall seating capacity.
