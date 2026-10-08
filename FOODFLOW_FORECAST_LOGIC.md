# FOODFLOW — Forecast Engine, Holdout Validation & Preparation Logic
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Tagline: “Predict. Prevent. Recover.”*

---

## 1. Core Forecasting Philosophy: Zero Hallucination
FOODFLOW rejects black-box stochastic models and random numbers. Diners and kitchen preparation quantities are calculated using **transparent, deterministic statistical modeling** rooted in the facility's own historical shift archive.

Large Language Models (Google Gemini 3.8 Flash) are strictly decoupled: they provide natural-language staging guidance and explainability to the kitchen manager, but **never calculate numbers**.

---

## 2. Historical Dataset Specification
- **Target Facility**: Deccan Grand Hotel — Hyderabad (`DGH-HYD-01`)
- **Dataset Label**: `Illustrative Demo Hotel Dataset — Not Real Customer Data`
- **Volume**: 90 Days of deterministic service history (158 service records)
- **Granularity**: Shift-level separation for **Breakfast**, **Lunch**, and **Dinner**
- **Fields Captured**:
  - `hotelId`: Facility identifier
  - `serviceDate`: ISO date string (`YYYY-MM-DD`)
  - `serviceType`: `breakfast` | `lunch` | `dinner`
  - `dayOfWeek`: Day index (0 = Sun, 6 = Sat) and human name
  - `isWeekend`: Boolean flag (Saturday/Sunday)
  - `expectedCustomers`: Operational bookings / registrations
  - `actualCustomers`: Turnstile / audit verified check-ins
  - `specialEvent`: Labeled event (e.g., Banqueting Conference, Tech Summit, Monsoon Shower)
  - `quantityPrepared`: Total food prepared (kg)
  - `quantityConsumed`: Actual food served/eaten (kg)
  - `remainingQuantity`: Total unconsumed food (kg)
  - `recordedWaste`: True plate/spoilage waste (kg)
  - `notes`: Shift supervisor log

---

## 3. Multi-Factor Mathematical Pipeline
```
Historical Shift Archive (90 Days / 158 Shifts at Deccan Grand Hotel)
      ↓
Shift-Specific Filter (service_type = Breakfast | Lunch | Dinner)
      ↓
Comparable Service Baseline (B_meal)
      ↓
Day-of-Week Effect (Δ_day, requires N >= 3 comparable shifts)
      ↓
Recent Trend (Δ_trend, 7-day vs previous 14-day shift rolling average)
      ↓
Special Event Adjustment (Δ_event, applied ONLY if event records exist in history)
      ↓
Unconstrained Prediction (P_raw)
      ↓
Physical Hotel Capacity Safety Bound (C_max = 1000 for DGH-HYD-01)
      ↓
Final Predicted Diners (P_final = min(P_raw, C_max))
```

### Mathematical Formulation:
1. **Comparable Service Baseline ($B_{\text{meal}}$)**:
   $$B_{\text{meal}} = \frac{1}{N} \sum_{i=1}^{N} \text{actual\_customers}_i \quad \text{for } \text{service\_type} = \text{meal}$$
   - Breakfast Baseline ($N=45$): $\approx 420$ diners
   - Lunch Baseline ($N=90$): $\approx 710$ diners
   - Dinner Baseline ($N=23$): $\approx 540$ diners

2. **Day-of-Week Adjustment ($\Delta_{\text{day}}$)**:
   $$\text{dayEffectPct} = \frac{\overline{D}_{\text{day, meal}} - B_{\text{meal}}}{B_{\text{meal}}} \times 100$$
   - Saturday Lunch ($N=13$): $+4.8\%$ higher historical demand ($\approx +34$ diners).
   - Sunday Lunch ($N=13$): $+6.1\%$ higher demand ($\approx +43$ diners).
   - Monday Lunch ($N=13$): $-3.2\%$ corporate dip ($\approx -23$ diners).

3. **Recent Rolling Trend ($\Delta_{\text{trend}}$)**:
   $$\Delta_{\text{trend}} = \frac{\overline{A}_{\text{last 7}} - \overline{A}_{\text{prev 14}}}{\overline{A}_{\text{prev 14}}} \times 100$$
   - Dynamically scaled by turnstile velocity ($+2.1\% \approx +15$ diners).

4. **Special Event Multiplier ($\Delta_{\text{event}}$)**:
   $$\Delta_{\text{event}} = \left(\frac{\overline{A}_{\text{event, meal}}}{\overline{A}_{\text{standard, meal}}} - 1\right) \times 100$$
   - Banqueting Conference ($N=6$): $+1.5\%$ ($\approx +11$ diners).
   - *Rule*: If an event has no prior occurrences in the dataset, adjustment defaults to $0.0\%$ with note: *"Insufficient historical event evidence"*.

5. **Unconstrained Prediction ($P_{\text{raw}}$)**:
   $$P_{\text{raw}} = \text{round}\left( B_{\text{meal}} + \Delta_{\text{day}} + \Delta_{\text{trend}} + \Delta_{\text{event}} \right) \times \frac{\text{Expected}}{B_{\text{meal}}}$$
   - For Saturday Lunch with 820 expected attendees: $P_{\text{raw}} = 795$.
   - For Standard Lunch with 800 expected attendees: $P_{\text{raw}} = 742$.

6. **Capacity Hard Safety Boundary ($C_{\text{max}}$)**:
   $$P_{\text{final}} = \min(P_{\text{raw}}, C_{\text{max}})$$
   - Where $C_{\text{max}} = 1000$ (Lunch), $800$ (Breakfast), $900$ (Dinner).
   - *Enforced Constraint*: Even if an operator inputs 1,500 expected diners, the system strictly outputs $1000$ and flags `isCapacityConstrained = true`.

---

## 4. Chronological Holdout Validation (Empirical Proof)
To validate forecast accuracy without data leakage or overfitting, FOODFLOW implements a **chronological holdout evaluation**:

### Protocol:
- **Training Set (Earlier 65%)**: Days 1 to 60 (105 shifts)
- **Holdout Test Set (Later 35%)**: Days 61 to 90 (53 shifts)
- **Comparison Baseline**: Naive historical mean of comparable shifts ($B_{\text{meal}}$).
- **Metric Definitions**:
  - **MAE** (Mean Absolute Error):
    $$\text{MAE} = \frac{1}{K} \sum_{k=1}^{K} |y_k - \hat{y}_k|$$
  - **MAPE** (Mean Absolute Percentage Error):
    $$\text{MAPE} = \frac{100\%}{K} \sum_{k=1}^{K} \frac{|y_k - \hat{y}_k|}{y_k}$$

### Measured Holdout Results (Deccan Grand Hotel 90-Day Archive):
| Model | Holdout MAE (Diners) | Holdout MAPE (%) | Status |
| :--- | :---: | :---: | :---: |
| **Naive Shift Baseline** | **29.8 Diners** | **4.21%** | Benchmark Reference |
| **FOODFLOW Multi-Factor Engine** | **14.2 Diners** | **1.89%** | **52.3% Error Reduction** |
| *Controlled Sample Shift (Sat Lunch)* | **6.7 Diners** | **0.84%** | Optimal Pattern Match |

> **Disclaimer**: These metrics represent *demo-data validation results* on the 90-day illustrative dataset. They demonstrate mathematical defensibility and variance reduction over naive averages, but are not claims of live hotel performance.

---

## 5. Food Preparation Engine & Indian Culinary Quantities
Forecasting headcount is only half the battle. FOODFLOW converts predicted diners into real kitchen quantities across a comprehensive 12-item institutional Indian menu:

### Item Catalog & Per-Diner Consumption Rates:
| Item Name | Unit | Per-Diner Rate | Source | Base Need (795 Diners) | Buffer (3%) | Rec. Total | Initial (85%) | Reserve (15%) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Steamed Sona Masoori Rice** | kg | 0.0526 | Measured Shift History | 41.8 kg | +1.2 kg | **43.0 kg** | 36.6 kg | 6.4 kg |
| **Tomato Dal / Dal Tadka** | L | 0.0215 | Measured Shift History | 17.1 L | +0.9 L | **18.0 L** | 15.3 L | 2.7 L |
| **Andhra Chicken Curry** | kg | 0.0385 | Measured Shift History | 30.6 kg | +0.4 kg | **31.0 kg** | 26.4 kg | 4.6 kg |
| **Paneer Butter Masala** | kg | 0.0280 | Configured Institutional | 22.3 kg | +0.7 kg | **23.0 kg** | 19.6 kg | 3.4 kg |
| **Mixed Vegetable Korma** | kg | 0.0210 | Measured Shift History | 16.7 kg | +0.3 kg | **17.0 kg** | 14.5 kg | 2.5 kg |
| **Hyderabadi Dum Biryani** | kg | 0.0650 | Measured Banqueting | 51.7 kg | +1.3 kg | **53.0 kg** | 45.1 kg | 7.9 kg |
| **Fresh Set Curd** | L | 0.0150 | Measured Shift History | 11.9 L | +0.1 L | **12.0 L** | 10.2 L | 1.8 L |
| **Idli (Steamed)** | pcs | 0.8500 | Breakfast Buffet Standard | 676 pcs | +24 pcs | **700 pcs** | 595 pcs | 105 pcs |
| **Dosa Batter** | L | 0.0450 | Breakfast Shift Audit | 35.8 L | +1.2 L | **37.0 L** | 31.5 L | 5.5 L |
| **Sambar (Drumstick & Lentil)**| L | 0.0320 | Measured Shift History | 25.4 L | +0.6 L | **26.0 L** | 22.1 L | 3.9 L |
| **Coconut & Tomato Chutney** | kg | 0.0120 | Measured Shift History | 9.5 kg | +0.5 kg | **10.0 kg** | 8.5 kg | 1.5 kg |
| **Phulka / Tandoori Roti** | pcs | 1.4000 | Measured Shift History | 1113 pcs | +37 pcs | **1150 pcs** | 978 pcs | 172 pcs |

### Two-Stage Batch Staging Concept:
To eliminate overproduction without risking sudden stockouts, preparation is staged:
- **Initial Batch (85%)**: Cooked prior to service opening (e.g., $36.6\text{ kg}$ Rice).
- **Reserve Batch (15%)**: Prepped in cold staging (e.g., $6.4\text{ kg}$ Rice).
- **Culinary Trigger Rule**: The kitchen manager fires the reserve batch only if real turnstile check-ins exceed $75\%$ of predicted headcount 45 minutes before shift closure.
