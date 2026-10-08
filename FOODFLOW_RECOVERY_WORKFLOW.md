# FOODFLOW — Surplus Recovery & Matchmaking Workflow
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Tagline: “Predict. Prevent. Recover.”*

---

## 1. Leftover $\neq$ Waste Principle
Remaining food in an institutional kitchen is **not automatically garbage**. FOODFLOW enforces a strict three-tier classification:
1. **Consumed**: Food served and eaten by patrons.
2. **Recoverable Surplus**: Safe, unserved food maintained under strict temperature control ($\ge 63^\circ\text{C}$ hot-held or $\le 4^\circ\text{C}$ chilled) and within the 2-hour window.
3. **Non-Recoverable Waste**: Plate scrapings, contaminated items, or temperature-abused batches.

---

## 2. Hyderabad Demo Recovery Network (7 Seeded Partners)
All recovery organizations in the demo are **clearly identified as illustrative synthetic partners** operating in the Hyderabad metropolitan region:

> **Banner in Application**:  
> `Hyderabad Demo Recovery Network — Illustrative Data • Seeded Demo Partners`

| Partner Name | Locality | Coordinates [Lat, Lng] | Straight-Line Distance | Food Needs | Intake Capacity | Status Badge |
| :--- | :--- | :---: | :---: | :--- | :---: | :--- |
| **Robin Hood Army — Gachibowli** | Gachibowli | `[17.4401, 78.3610]` | **1.4 km** | Rice, Dal, Cooked Meals | 80 meals | Seeded Demo Partner |
| **Feeding India — Madhapur Hub** | Madhapur | `[17.4483, 78.3915]` | **4.5 km** | Curries, Rotis, Rice | 120 meals | Seeded Demo Partner |
| **Annamrita — Kondapur Kitchen** | Kondapur | `[17.4622, 78.3568]` | **2.2 km** | Rice, Khichdi, Sambar | 150 meals | Seeded Demo Partner |
| **HYD Youth Brigade — Mehdipatnam** | Mehdipatnam | `[17.3916, 78.4420]` | **9.2 km** | Dry Ration, Cooked Meals | 90 meals | Seeded Demo Partner |
| **Telangana Food Bank — Ameerpet** | Ameerpet | `[17.4375, 78.4482]` | **11.8 km** | Cooked Meals, Curries | 200 meals | Seeded Demo Partner |
| **Akshaya Patra — Kukatpally Depot** | Kukatpally | `[17.4849, 78.4138]` | **8.1 km** | Bulk Grains, Rice, Dal | 300 meals | Seeded Demo Partner |
| **Secunderabad Railway Shelter** | Secunderabad | `[17.4399, 78.5017]` | **15.6 km** | Packed Boxes, Rotis | 110 meals | Seeded Demo Partner |

*Origin Point*: **Deccan Grand Hotel — Hyderabad** at `[17.4447, 78.3483]` (Financial District / Gachibowli).

---

## 3. Geodesic Haversine Distance Calculation
All distances are computed from actual GPS coordinates using the Haversine spherical formula:

$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$

Where $R = 6371\text{ km}$ (Earth radius), $\phi$ is latitude in radians, and $\lambda$ is longitude in radians.

### Error Handling & Safeguard:
- If either the hotel or partner coordinates are `null`, `undefined`, or outside valid coordinate ranges ($\pm 90^\circ$ lat, $\pm 180^\circ$ lng), the system strictly returns:
  `"Distance unavailable"`
- Distances are explicitly labeled in the UI as **"Approximate straight-line distance"** (not driving routes).

---

## 4. End-to-End Recovery & Dispatch Lifecycle
```
1. HOTEL CREATES SURPLUS LISTING
   - Dish: Steamed Sona Masoori Rice (3.2 kg) & Andhra Chicken Curry (2.5 kg)
   - Holding Temp: Hot Held at 67.2°C in insulated food-grade containers
   - Availability Window: 13:30 IST to 15:30 IST (Strict 2-hour safety window)
   - Location: Deccan Grand Hotel — Service Bay Dock 2
   - Status: ACTIVE / LISTED
   ↓
2. MULTI-FACTOR MATCHMAKING ALGORITHM
   - Food Compatibility Score (40 pts): Verifies vegetarian/non-vegetarian preferences.
   - Proximity Score (35 pts): Inversely proportional to Haversine distance (decay factor).
   - Capacity Score (25 pts): Verifies partner can absorb the listed quantity.
   - Match identified: Robin Hood Army — Gachibowli (95% Match Score)
   ↓
3. SELECTION & PARTNER NOTIFICATION
   - Manager reviews partner profile and selects organization.
   - Listing status transitions to: VIEWED / NOTIFIED
   ↓
4. SIMULATED PARTNER ACCEPTANCE
   - Partner reviews notification and confirms acceptance.
   - Listing status transitions to: ACCEPTED
   ↓
5. DISPATCH & SCHEDULED PICKUP
   - Driver dispatch scheduled with estimated arrival window.
   - Dynamic 4-digit verification OTP generated (e.g., `8924`).
   - Listing status transitions to: PICKUP_SCHEDULED
   ↓
6. PHYSICAL HANDOFF & COMPLETED RECOVERY
   - Driver arrives at Service Bay Dock 2.
   - Kitchen supervisor verifies OTP and logs container temperature.
   - Listing status transitions to: COMPLETED / COLLECTED
   - Outcome logged to historical database for future forecast calibration.
```

---

## 5. Persistence Guarantee
- When Supabase is configured and connected, all surplus listings, status transitions, and pickup records are stored in the `surplus` and `pickups` relational tables.
- In offline or unconfigured demonstration mode, state transitions are maintained reactively in local browser memory with clear labels (`Demo Active - Simulated Dispatch`). Refreshing preserves the active session state.
