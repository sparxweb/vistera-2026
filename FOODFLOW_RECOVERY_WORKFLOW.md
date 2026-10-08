# FOODFLOW — Surplus Recovery & Matchmaking Workflow
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*

---

## 1. Leftover $\neq$ Waste Principle
Remaining food in an institutional kitchen is **not automatically garbage**. FOODFLOW enforces a strict three-tier classification:
1. **Consumed**: Food served and eaten by patrons.
2. **Recoverable Surplus**: Safe, unserved food maintained under strict temperature control ($\ge 63^\circ\text{C}$ hot-held or $\le 4^\circ\text{C}$ chilled) and within the 2-hour window.
3. **Non-Recoverable Waste**: Plate scrapings, contaminated items, or temperature-abused batches.

---

## 2. End-to-End Recovery Sequence
```
1. HOTEL CREATES SURPLUS LISTING
   - Dish: Steamed Sona Masoori Rice (3.2 kg) & Andhra Chicken Curry (2.5 kg)
   - Holding Temp: Hot Held at 67.2°C in insulated SS containers
   - Deadline: 15:30 IST (2 hours from service close)
   - Location: Deccan Grand Hotel — Service Bay Dock 2, Hyderabad
   ↓
2. INTELLIGENT MATCHMAKING ALGORITHM
   - Evaluates: Food Category Need (40 pts) + Haversine Proximity (35 pts) + Intake Capacity (25 pts)
   - Identifies Best Match: Robin Hood Army — Gachibowli Shelter (1.4 km, Capacity: 80 meals)
   ↓
3. GEODESIC MAP & HAVERSINE DISTANCE
   - Calculates exact geodesic distance using Haversine formula from Deccan Grand Hotel (17.4447, 78.3483)
   - Synchronized markers on interactive Mapbox GL JS map
   ↓
4. PARTNER ACCEPTANCE & DISPATCH
   - Shelter reviews notification and confirms acceptance
   - Status transitions to: PICKUP_SCHEDULED
   - Dynamic 4-digit verification OTP generated (e.g., `8924`)
   ↓
5. SECURE HANDOFF & COMPLETED RECOVERY
   - Driver arrives at Service Bay Dock 2
   - Verification of container temperature and OTP
   - Status updated to: COMPLETED / COLLECTED
   - Outcome logged to audit history for future forecast calibration
```

---

## 3. Haversine Distance Formula
All distances are computed from actual GPS coordinates:
$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
Where $R = 6371\text{ km}$.
- Deccan Grand Hotel $\to$ Robin Hood Army Gachibowli: **$1.4\text{ km}$** (~6 mins transit)
- Deccan Grand Hotel $\to$ Feeding India Madhapur: **$4.5\text{ km}$** (~14 mins transit)
- Deccan Grand Hotel $\to$ Annamrita Kondapur: **$2.2\text{ km}$** (~8 mins transit)
