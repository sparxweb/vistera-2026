# FOODFLOW — Surplus Recovery & Matchmaking Connection
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Audit Timestamp: October 9, 2026*

---

## 1. Hotel-to-Surplus Workflow
When an institutional dining shift concludes, FOODFLOW facilitates a structured recovery workflow:

```
[ Dining Room Closes ]
         │
         ▼
[ Service Tracking Audit ] ──> Remaining food evaluated:
                               ├─ Consumed: Food served and eaten
                               ├─ Waste: Contaminated / plate scrapings
                               └─ Recoverable Surplus: Unserved food held in temperature safe zone
         │
         ▼
[ Create Surplus Listing ] ──> Food type, quantity, holding temp (e.g. 67.2°C), safe window (2 hrs)
         │
         ▼
[ Matchmaking Engine ] ──> Evaluates 7 Hyderabad Seeded Partners
         │
         ▼
[ Partner Selection ] ──> Best Match identified (Score: 95%)
         │
         ▼
[ Simulated Dispatch ] ──> Status: PICKUP_SCHEDULED (4-digit OTP: 8924 generated)
         │
         ▼
[ Physical Transfer ] ──> Status: COLLECTED (Handoff logged back to shift history)
```

---

## 2. Organization Data Source
- **Origin**: Seeded demonstration dataset in `src/lib/demoData.ts` and `src/lib/data/historicalServices.ts`.
- **Entity Nature**: Illustrative synthetic NGO partners based on recognizable Hyderabad geographic hubs.
- **Labeling in Application**:
  > `Hyderabad Demo Recovery Network — Illustrative Data • Seeded Demo Partners`
- **Partner Localities**:
  1. **Robin Hood Army — Gachibowli** (`[17.4401, 78.3610]`, 1.4 km)
  2. **Feeding India — Madhapur Relief Hub** (`[17.4483, 78.3915]`, 4.5 km)
  3. **Annamrita — Kondapur Kitchen** (`[17.4622, 78.3568]`, 2.2 km)
  4. **Hyderabad Youth Brigade — Mehdipatnam** (`[17.3916, 78.4420]`, 9.2 km)
  5. **Telangana Food Bank — Ameerpet Center** (`[17.4375, 78.4482]`, 11.8 km)
  6. **Akshaya Patra Dispatch — Kukatpally Depot** (`[17.4849, 78.4138]`, 8.1 km)
  7. **Secunderabad Railway Shelter Feeding Unit** (`[17.4399, 78.5017]`, 15.6 km)

---

## 3. Matchmaking Scoring Algorithm
Matching is calculated deterministically across three operational dimensions:

$$\text{Match Score} = \text{Food Compatibility (40 pts)} + \text{Proximity Score (35 pts)} + \text{Capacity Fit (25 pts)}$$

1. **Food Category Need (40 pts)**: Matches dietary category (Cooked Hot Meals, Rice & Dal, Curries).
2. **Proximity Score (35 pts)**: Inverse logarithmic decay based on calculated Haversine straight-line distance.
3. **Capacity Fit (25 pts)**: Ensures listed surplus quantity does not exceed partner's available daily intake capacity.

---

## 4. Map Implementation & Geodesic Distance Engine
- **Map Library**: `leaflet` & `react-leaflet` in `src/components/recovery/RecoveryLeafletMap.tsx`.
- **Tile Source**: OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Cost / Billing**: **$0.00 / Zero Tokens Required** (Runs completely independent of Mapbox or Google Maps paid APIs).
- **Distance Formula**: Haversine spherical trigonometric calculation:
  $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
  Where $R = 6371\text{ km}$.
- **Safe Fallback**: If coordinates are missing, `NaN`, or out of bounds, the engine outputs `"Distance unavailable"` without throwing an unhandled exception.

---

## 5. Demo vs. Real Integrations
- **Demo / Prototype State**: Uses internal recovery directory, simulated partner acceptance, and local browser state persistence.
- **Production Roadmap**: Real-world deployment will integrate with formal NGO food safety registries, FSSAI surplus transfer guidelines, and WhatsApp / SMS driver notifications.
