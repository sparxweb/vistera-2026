# FOODFLOW — Complete System Architecture
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Audit Timestamp: October 9, 2026*

---

## 1. System Architecture Diagram

```mermaid
graph TD
    subgraph Browser ["Client Presentation Tier (Browser / React 19)"]
        UI["Tailwind Operations UI<br/>(Warm White / Charcoal / Green)"]
        Nav["7 Structured Screens:<br/>1. Overview<br/>2. Demand Forecast<br/>3. Food Preparation<br/>4. Service Tracking<br/>5. Food Recovery<br/>6. History & Accuracy<br/>7. Integrations & Settings"]
        Map["Leaflet + OpenStreetMap<br/>(7 Hyderabad Demo Partners)"]
        LocalStore["Local Fallback Storage<br/>(localStorage Engine)"]
    end

    subgraph ServerRoutes ["Next.js Server Tier (Route Handlers)"]
        APIForecast["POST /api/forecast"]
        APIConsumption["POST /api/consumption"]
        APIAI["POST /api/ai"]
    end

    subgraph LogicTier ["Domain & Calculation Engines"]
        Engine["Demand Forecasting Engine<br/>(Statistical Time-Series)"]
        PrepCalc["Preparation Calculator<br/>(12 Indian Dishes / Staged 85-15)"]
        BalanceEngine["Consumption & Waste Balance<br/>(Surplus vs Shortage Classification)"]
        HaversineEngine["Haversine Geodesic Distance Engine<br/>(Hyderabad Coordinate Grid)"]
        AIRouter["AI Provider Router<br/>(src/lib/ai/router.ts)"]
    end

    subgraph Persistence ["Persistence Layer"]
        SupabaseClient["Supabase Client<br/>(src/lib/supabase/client.ts)"]
        SupabaseDB[("Supabase PostgreSQL DB<br/>(Migration Ready)")]
    end

    subgraph ExternalAI ["External AI Services (Server-Side Only)"]
        Gemini["Google Gemini 3.8 Flash<br/>(@google/genai)"]
        NVIDIA["NVIDIA Nemotron NIM<br/>(openai SDK Fallback)"]
    end

    %% Client Interactions
    UI --> Nav
    Nav --> Map
    Nav --> LocalStore

    %% Frontend to Server Handlers
    Nav -->|Calculate Plan| APIForecast
    Nav -->|Log Actuals| APIConsumption
    Nav -->|Ask Guidance| APIAI

    %% Server to Engines
    APIForecast --> Engine
    APIForecast --> PrepCalc
    APIConsumption --> BalanceEngine
    Map --> HaversineEngine

    %% AI Integration
    APIForecast --> AIRouter
    APIAI --> AIRouter
    AIRouter -->|Primary| Gemini
    AIRouter -->|Fallback on Error| NVIDIA

    %% Persistence Flow
    APIForecast --> SupabaseClient
    APIConsumption --> SupabaseClient
    LocalStore -.->|Sync when connected| SupabaseClient
    SupabaseClient -->|TCP / REST| SupabaseDB
```

---

## 2. Component Descriptions

### 2.1 Presentation Tier
- **Framework**: Next.js 16.4.0 (Turbopack) and React 19.
- **Design Tokens**: Warm white (`#FAFAF9`), dark charcoal (`stone-900`), restrained emerald (`emerald-700`).
- **GIS Component**: Leaflet + OpenStreetMap running purely client-side via dynamic import (`next/dynamic` with `ssr: false`).

### 2.2 Server Tier
- **Isolates Secrets**: Credentials (`GEMINI_API_KEY`, `NVIDIA_API_KEY`) remain strictly on the server.
- **Deterministic Math First**: Numerical forecasting and culinary batch calculations run directly on server CPUs using pure TypeScript arithmetic before requesting qualitative AI summaries.

### 2.3 Persistence Tier
- **Dual-Storage Strategy**: Reads and writes through `src/lib/supabase/service.ts`, falling back gracefully to `localStorage` if remote database tables have not been created.
