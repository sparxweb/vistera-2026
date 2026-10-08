# FOODFLOW — API Integrations & Server Routes Audit
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*  
*Audit Timestamp: October 9, 2026*

---

## 1. Overview of Server-Side Architecture
FOODFLOW routes all sensitive external interactions and calculations through Next.js App Router route handlers. This isolates credentials from the client bundle and guarantees that failure in an external third-party API never breaks the user interface.

```
+-----------------------------------------------------------------------------------+
|                              Next.js Frontend (React 19)                         |
+-----------------------------------------------------------------------------------+
       │                                     │                               │
       │ POST                                │ POST                          │ POST
       ▼                                     ▼                               ▼
/api/forecast                         /api/consumption                    /api/ai
(Headcount + Prep Engine)             (Shift Actuals & Balance)           (Chef Copilot Router)
       │                                     │                               │
       ├─ Deterministic Forecast             ├─ Variance Calculation         ├─ Google Gemini 3.8
       ├─ 12-Item Prep Calculator            ├─ Surplus Classification       └─ NVIDIA Nemotron
       ├─ Supabase Insert (Attempt)          ├─ Supabase Insert (Attempt)         (Auto Fallback)
       └─ AI Explanation (Router)            └─ History Calibration
```

---

## 2. Server API Route Specifications

### 2.1 `POST /api/forecast`
- **Purpose**: Generates a deterministic diner prediction and dish-level preparation quantities based on shift parameters.
- **Request Format (JSON)**:
  ```json
  {
    "expectedDiners": 820,
    "serviceDate": "2026-10-10",
    "serviceMeal": "Lunch",
    "dayOfWeek": "Saturday",
    "specialEvent": "Banqueting Conference",
    "hotelCapacity": 1000,
    "menuItem": "Rice + Dal + Chicken",
    "defaultBufferPct": 0.03
  }
  ```
- **Validation**: Ensures `expectedDiners` is a positive number $> 0$; rejects non-numeric inputs with HTTP 400.
- **Internal Execution**:
  1. Calls `calculateDemandForecast()` in `src/lib/forecast/engine.ts`.
  2. Constructs prompt for AI explanation copilot and invokes `askAI()` in `src/lib/ai/router.ts`.
  3. Attempts insertion into Supabase `demand_forecasts` table.
  4. Caches forecast in server memory.
- **Response Format (JSON)**:
  ```json
  {
    "success": true,
    "forecastId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "predictedDiners": 795,
    "predictedDemand": 795,
    "recommendedPreparation": 819,
    "bufferServings": 24,
    "operationalRisk": "LOW",
    "dishes": [ ... ],
    "calculationBreakdown": { ... },
    "aiExplanation": { "summary": "...", "operationalRecommendation": "..." }
  }
  ```
- **Side Effects**: Caches latest forecast; attempts Supabase insert.
- **Error Behavior**: Returns HTTP 500 on unhandled error; gracefully substitutes deterministic text if Gemini/NVIDIA is offline.

### 2.2 `POST /api/consumption`
- **Purpose**: Audits post-service dining results, evaluates food waste, and classifies surplus.
- **Request Format (JSON)**:
  ```json
  {
    "forecastId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "preparedQuantity": 819,
    "servedQuantity": 788,
    "actualDiners": 788,
    "predictedDiners": 795
  }
  ```
- **Validation**: Enforces non-negative numbers for `preparedQuantity` and `servedQuantity`.
- **Internal Execution**:
  1. Calls `evaluateConsumptionBalance()` in `src/lib/business/balance.ts`.
  2. Computes variance delta, remaining quantity, and status (`SURPLUS`, `BALANCED`, `SHORTAGE`).
  3. Attempts insertion into Supabase `daily_consumption` table.
- **Response Format (JSON)**:
  ```json
  {
    "success": true,
    "consumptionId": "uuid",
    "remainingQuantity": 31,
    "balanceStatus": "SURPLUS",
    "isSurplus": true,
    "recommendedAction": "Initiate food rescue listing."
  }
  ```

### 2.3 `POST /api/ai`
- **Purpose**: General reasoning copilot for kitchen managers.
- **Request Format (JSON)**:
  ```json
  {
    "prompt": "Explain why Saturday lunch demand has +4.8% variance.",
    "provider": "gemini"
  }
  ```
- **Internal Execution**: Calls `askAI()` in `src/lib/ai/router.ts`.
- **Response Format (JSON)**:
  ```json
  {
    "success": true,
    "answer": "Saturday lunch demand experiences increased corporate leisure turnout...",
    "provider": "gemini"
  }
  ```

---

## 3. AI Providers: Gemini & NVIDIA Integration

### 3.1 Primary: Google Gemini 3.8 Flash
- **SDK**: `@google/genai`
- **Environment Variables**: `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-3.8-flash`
- **Implementation File**: `src/lib/ai/gemini.ts`
- **Strict Role**: Qualitative chef operational advice. **Never calculates numbers, headcount, or distances.**

### 3.2 Secondary Fallback: NVIDIA Nemotron
- **SDK**: `openai` (configured with NVIDIA NIM baseURL)
- **Base URL**: `https://integrate.api.nvidia.com/v1`
- **Model**: `nvidia/nemotron-3.5-lightning-30b-a3b`
- **Environment Variable**: `NVIDIA_API_KEY`
- **Implementation File**: `src/lib/ai/nvidia.ts`
- **Router Logic (`src/lib/ai/router.ts`)**:
  ```typescript
  export async function askAI(prompt: string, provider: AIProvider = "gemini"): Promise<string> {
    if (provider === "nvidia") return askNvidia(prompt);
    try {
      return await askGemini(prompt);
    } catch (error) {
      console.error("Gemini failed, switching to NVIDIA:", error);
      return askNvidia(prompt);
    }
  }
  ```
- **Empirical Test Result**: **VERIFIED & WORKING**. An automated probe sent to NVIDIA NIM returned a valid completion successfully.

---

## 4. Integration Verification Summary Matrix

| Service / API | Configured in Env | Referenced in Code | Runtime Tested | Status |
| :--- | :---: | :---: | :---: | :--- |
| **Supabase PostgreSQL** | `YES` | `YES` | `TESTED` | **CONFIGURED ONLY** (Endpoint connects, but remote tables unmigrated) |
| **Google Gemini API** | `YES` | `YES` | `TESTED` | **CONFIGURED** (Server-side route active; fallback engaged) |
| **NVIDIA NIM API** | `YES` | `YES` | `TESTED` | **VERIFIED WORKING** (Successfully responds from endpoint) |
| **Leaflet OpenStreetMap** | `N/A (Free)` | `YES` | `TESTED` | **VERIFIED WORKING** (Zero tokens required; interactive map rendered) |
| **Mapbox GL JS** | `OPTIONAL` | `YES` | `N/A` | **PRESERVED AS SECONDARY FALLBACK** (Leaflet is primary) |
