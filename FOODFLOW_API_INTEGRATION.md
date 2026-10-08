# FOODFLOW — API Integrations & Resilient Architecture
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Tagline: “Predict. Prevent. Recover.”*

---

## 1. Integration Philosophy & Resilience Principles
FOODFLOW enforces a strict **zero-bloat, high-reliability** integration policy. Every external service has a clear operational use case, resilient server-side error handling, and offline-ready fallbacks.

No unnecessary IoT, random ML, or commercial payment APIs are included.

```
+-----------------------------------------------------------------------------------+
|                              Next.js Frontend (React 19)                         |
|  - 7 Structured Operational Screens (Warm White, Dark Charcoal, Restrained Green) |
|  - Leaflet + OpenStreetMap (Interactive Hyderabad Recovery Network)              |
+-----------------------------------------------------------------------------------+
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      /api/forecast & /api/consumption                     /api/ai
    (Deterministic Calculation & Storage)       (Server-Side Gemini 3.8 Flash)
                   │                                           │
         ┌─────────┴─────────┐                       ┌─────────┴─────────┐
         ▼                   ▼                       ▼                   ▼
    Supabase DB       Local Offline Cache      Google Gemini API    Pre-Calibrated
    (PostgreSQL)      (LocalStorage/RAM)       (Natural Language)   Rule Fallback
```

---

## 2. Service-by-Service Specifications

### 1. Leaflet + OpenStreetMap (Primary GIS Engine)
- **Purpose**: Zero-cost, privacy-friendly, interactive geospatial visualization of the Hyderabad recovery corridor.
- **Dependency**: `leaflet` & `react-leaflet`
- **Cost**: **$0.00 / Zero Token Required** (No Mapbox or Google Maps billing account needed).
- **Tile Source**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Attribution**: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
- **Error Handling & Fallback**:
  - Dynamically imported on the client (`next/dynamic` with `ssr: false`) to avoid server-side `window is not defined` errors.
  - If network access to OSM tiles is blocked or offline, markers and Haversine distances remain 100% interactive and functional on top of coordinate grid geometry.
- **Coverage**: Center coordinate `[17.4447, 78.3483]` (Deccan Grand Hotel, Gachibowli, Hyderabad) with 7 seeded partners across Gachibowli, Madhapur, Kondapur, Mehdipatnam, Ameerpet, Kukatpally, and Secunderabad.

### 2. Supabase PostgreSQL
- **Purpose**: Relational persistence for hotels, 90-day shift archives, forecasts, food preparation recommendations, consumption audits, and pickup dispatches.
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Public endpoint for client connectivity.
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Safe publishable anonymous key.
- **Error Handling & Fallback**:
  - All calls are wrapped in `try/catch` with 3-second latency timeouts.
  - If Supabase is unreachable or unconfigured, FOODFLOW seamlessly persists data into a local reactive storage engine. The application **never crashes**.
  - All UI elements display clear status badges: `Connected (Supabase PostgreSQL)` or `Local Operational Storage (Demo Active)`.

### 3. Google Gemini 3.8 Flash
- **Purpose**: Operational reasoning copilot providing qualitative staging advice and anomaly diagnostics for kitchen managers.
- **Environment Variable**: `GEMINI_API_KEY` (Stored server-side only).
- **Security Guarantee**:
  - The API key is stored **strictly server-side** and called only within Next.js route handlers (`/api/forecast` and `/api/ai`).
  - Zero server secrets are exposed in the client-side JavaScript bundle.
- **Non-Hallucination Guardrails**:
  - Gemini receives computed metrics (Baseline, Headcount, Initial Batch kg, Reserve Batch kg) as input.
  - The system prompt explicitly forbids inventing numbers, changing meal counts, or hallucinating NGO details.
- **Error Handling & Fallback**:
  - If Gemini encounters rate limits (HTTP 429), quota exhaustion, or offline network connectivity, FOODFLOW immediately serves pre-calibrated operational guidance based on the deterministic calculation.
  - The numerical forecast and preparation totals remain 100% operational regardless of AI availability.

### 4. Optional: Mapbox GL JS (Secondary Geospatial Engine)
- **Environment Variable**: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- **Role**: Preserved as an optional enhancement if an operator prefers vector styles, but Leaflet + OSM is the default out-of-the-box engine.

---

## 3. Server Route Handlers (Next.js App Router)

### 1. `/api/forecast` (POST)
- **Input**:
  ```json
  {
    "hotelId": "DGH-HYD-01",
    "serviceDate": "2026-10-10",
    "serviceType": "lunch",
    "expectedDiners": 820,
    "specialEvent": "Banqueting Conference"
  }
  ```
- **Execution**: Computes deterministic demand forecast and preparation recommendations, saves to database if connected, requests Gemini explanation.
- **Output**:
  ```json
  {
    "forecast": {
      "predictedCustomers": 795,
      "historicalBaseline": 710,
      "dayOfWeekEffect": 34,
      "trendEffect": 15,
      "eventEffect": 11,
      "isCapacityConstrained": false,
      "calculationBreakdown": { ... }
    },
    "prepRecommendations": [ ... ],
    "explanation": "..."
  }
  ```

### 2. `/api/ai` (POST)
- **Input**: `{ "prompt": "...", "context": { ... } }`
- **Output**: `{ "text": "...", "provider": "gemini-3.8-flash" | "fallback" }`

### 3. `/api/consumption` (POST)
- **Input**: Actual service audit (`actualCustomers`, `preparedKg`, `consumedKg`, `wasteKg`).
- **Execution**: Calculates variance, records shift to historical archive, updates learning loop for future predictions.

---

## 4. API & Integration Health Diagnostic Card
The **Integrations & Settings** screen provides a real-time status matrix:
- **Database Connection**: `Connected (Supabase)` or `Local Operational Storage (Active)`
- **AI Copilot (Gemini)**: `Connected (Server-side Verified)` or `Offline Rule Fallback`
- **Hyderabad Recovery Map**: `Leaflet + OpenStreetMap (Active, Zero Token Required)`
- **Historical Service Archive**: `90 Days / 158 Shifts (Deccan Grand Hotel Archive Verified)`
