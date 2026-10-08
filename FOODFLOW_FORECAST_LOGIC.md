# FOODFLOW — Forecast Engine & Preparation Logic Specification
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*

---

## 1. Core Forecasting Philosophy: Zero Hallucination
FOODFLOW rejects black-box stochastic models and random numbers. Diners and kitchen quantities are calculated using **transparent deterministic statistical modeling** rooted in the facility's own historical shift archive.

Large Language Models (Gemini 3.8 Flash) are strictly decoupled: they provide natural-language staging guidance and explainability to the kitchen manager, but **never calculate numbers**.

---

## 2. Multi-Factor Mathematical Pipeline
```
Historical Shift Archive (30 Days at Deccan Grand Hotel)
      ↓
Comparable Service Baseline (B_meal)
      ↓
Day-of-Week Effect (Δ_day)
      ↓
Weekend Multiplier (Δ_weekend)
      ↓
Special Event Adjustment (Δ_event)
      ↓
Recent 7-Day Rolling Trend (Δ_trend)
      ↓
Unconstrained Prediction (P_raw)
      ↓
Physical Hotel Capacity Safety Bound (C_max = 1000)
      ↓
Final Predicted Diners (P_final = min(P_raw, C_max))
```

### Mathematical Formulation:
1. **Comparable Service Baseline ($B_{\text{meal}}$)**:
   $$B_{\text{meal}} = \frac{1}{N} \sum_{i=1}^{N} \text{actual\_customers}_i \quad \text{for } \text{service\_type} = \text{meal}$$
   *Example*: Deccan Grand Hotel lunch comparable baseline $\approx 710$ diners.

2. **Day-of-Week Adjustment ($\Delta_{\text{day}}$)**:
   $$\text{dayOfWeekEffectPct} = \frac{\overline{D}_{\text{day}} - B_{\text{meal}}}{B_{\text{meal}}} \times 100$$
   *Example*: Saturday lunch exhibits $+4.8\%$ higher historical demand ($\approx +34$ diners).

3. **Recent 7-Day Rolling Trend ($\Delta_{\text{trend}}$)**:
   $$\Delta_{\text{trend}} = \frac{\overline{A}_{\text{last 7}} - \overline{A}_{\text{prev 7}}}{\overline{A}_{\text{prev 7}}} \times 100$$
   Factored in dynamically ($+2.1\% \approx +15$ diners).

4. **Special Event Multiplier ($\Delta_{\text{event}}$)**:
   $$\Delta_{\text{event}} = \left(\frac{\text{Ratio}_{\text{event}}}{\text{Ratio}_{\text{standard}}} - 1\right) \times 100$$
   *Example*: Banqueting conference ($+1.5\% \approx +11$ diners).

5. **Unconstrained Prediction ($P_{\text{raw}}$)**:
   $$P_{\text{raw}} = \text{round}\left( B_{\text{meal}} + \text{Effects} \times \frac{\text{Expected}}{B_{\text{meal}}} \right)$$
   For Standard Lunch with 820 expected attendees: $P_{\text{raw}} = 795$.
   For Benchmark Lunch with 800 expected attendees: $P_{\text{raw}} = 742$.

6. **Capacity Hard Safety Boundary ($C_{\text{max}}$)**:
   $$P_{\text{final}} = \min(P_{\text{raw}}, C_{\text{max}})$$
   Where $C_{\text{max}} = 1000$ (Lunch), $800$ (Breakfast), $900$ (Dinner).
   *Guaranteed constraint*: If an operator enters 1,500 expected diners, the system strictly outputs $1000$ and flags `isCapacityConstrained = true`.

---

## 3. Food Preparation Engine & Culinary Quantities
Forecasting headcount is only half the battle. FOODFLOW converts predicted diners into real kitchen quantities:

### 1. Base Requirement ($Q_{\text{base}}$):
$$Q_{\text{base}} = P_{\text{final}} \times \text{Rate}_{\text{dish}}$$
- **Steamed Sona Masoori Rice**: $795 \times 0.0526\text{ kg} = 41.8\text{ kg}$
- **Tomato Dal / Dal Tadka**: $795 \times 0.0215\text{ L} = 17.2\text{ L}$
- **Andhra Chicken Curry**: $795 \times 0.0385\text{ kg} = 29.4\text{ kg}$
- **Mixed Vegetable Korma**: $795 \times 0.0210\text{ kg} = 15.6\text{ kg}$
- **Fresh Set Curd**: $795 \times 0.0150\text{ L} = 11.4\text{ L}$

### 2. Recommended Preparation ($Q_{\text{prep}}$):
$$Q_{\text{prep}} = Q_{\text{base}} + \text{Safety Buffer (3.0\%)}$$
- Rice: $41.8\text{ kg} + 1.2\text{ kg} = \mathbf{43.0\text{ kg}}$
- Dal Tadka: $17.2\text{ L} + 0.8\text{ L} = \mathbf{18.0\text{ L}}$
- Chicken Curry: $29.4\text{ kg} + 1.6\text{ kg} = \mathbf{31.0\text{ kg}}$

### 3. Two-Stage Batch Staging Concept:
To eliminate overproduction without risking sudden stockouts, preparation is staged:
- **Initial Batch (80–85%)**: Cooked prior to line open (e.g., $36.0\text{ kg}$ Rice).
- **Reserve Batch (15–20%)**: Held in cold/prepped staging (e.g., $7.0\text{ kg}$ Rice).
- **Trigger Rule**: Second batch is cooked only if turnstile check-ins exceed $650$ diners by 13:15 IST.
