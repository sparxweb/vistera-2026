# FOODFLOW — API Integrations & Resilient Architecture
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*

---

## 1. Integration Strategy & Core Principle
FOODFLOW enforces a strict **zero-bloat, high-reliability** integration policy. Every external service has a clear operational use case, resilient server-side error handling, and offline-ready fallbacks.

No unnecessary IoT, random ML, or commercial payment APIs are included.

---

## 2. Service-by-Service Specifications

### 1. Supabase PostgreSQL
- **Purpose**: Relational persistence for hotels, shift archives, forecasts, consumption audits, and pickup dispatches.
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Public endpoint for client connectivity.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe publishable anonymous key.
- **Error Handling & Fallback**:
  - All calls are wrapped in `try/catch` with latency timeouts.
  - If Supabase is unreachable or unconfigured, FOODFLOW seamlessly persists data into a local reactive storage engine. The application **never crashes**.

### 2. Google Gemini 3.8 Flash
- **Purpose**: Operational reasoning copilot providing qualitative staging advice and anomaly diagnostics for kitchen managers.
- **Environment Variable**: `GEMINI_API_KEY`
- **Security Guarantee**:
  - The API key is stored **strictly server-side** and called only within Next.js route handlers (`/api/forecast` and `/api/ai`).
  - Zero server secrets are exposed in the client-side JavaScript bundle.
- **Error Handling & Fallback**:
  - If Gemini encounters rate limits or offline network connectivity, FOODFLOW immediately serves pre-calibrated operational guidance based on the deterministic calculation.
  - The numerical forecast remains 100% operational regardless of AI availability.

### 3. Mapbox GL JS
- **Purpose**: Real-time interactive geospatial visualization of the Hyderabad recovery corridor.
- **Environment Variable**: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- **Error Handling & Fallback**:
  - If the token is invalid or blocked by network policies, FOODFLOW activates a high-contrast geodesic SVG corridor map displaying all shelters and calculated Haversine routes.

### 4. Indian Institutional Calendar & Event Dataset
- **Purpose**: Regional festival multipliers, monsoon alerts, and banqueting shifts.
- **Implementation**: Maintained directly as a verified 30-shift operational dataset in PostgreSQL to avoid brittle external third-party calendar APIs.

---

## 3. API Health & Status Endpoint
The Settings screen provides an **Integrations & API Health** diagnostic card:
- **Supabase**: `Connected` / `Local Fallback`
- **Gemini 3.8 Flash**: `Connected` (Server-side key verified)
- **Mapbox GL JS**: `Connected` / `Geodesic SVG Fallback`
- **Calendar Dataset**: `Using Local Dataset` (30 operating days verified)
