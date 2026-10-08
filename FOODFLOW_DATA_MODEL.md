# FOODFLOW — Relational Data Model Specification
**Target Database Engine: Supabase (PostgreSQL 15+)**  
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*

---

## 1. Schema Overview
FOODFLOW employs a normalized relational architecture across 9 core tables designed for high auditability, deterministic historical learning, dish-level physical culinary tracking, and end-to-end recovery matching.

```
+--------------------+       +-----------------------+       +------------------------+
|      HOTELS        |<----->|    SERVICE_RECORDS    |       |       FOOD_ITEMS       |
| (Deccan Grand Hyd) |       | (30-day shift archive)|       | (Indian culinary items)|
+--------------------+       +-----------------------+       +------------------------+
         |                                                                |
         v                                                                v
+--------------------+       +-----------------------+       +------------------------+
|     FORECASTS      |------>|     PREPARATION_      |<------+ (base rate, safety buf,|
| (baseline + delta) |       |   RECOMMENDATIONS     |       |  batch 1 & reserve)    |
+--------------------+       +-----------------------+       +------------------------+
         |
         v
+--------------------+       +-----------------------+       +------------------------+
|  FOOD_CONSUMPTION  |------>|        SURPLUS        |------>|        PICKUPS         |
| (actuals, variance)|       |  (recoverable batches)|       | (scheduled dispatch)   |
+--------------------+       +-----------------------+       +------------------------+
                                         ^                                |
                                         |                                v
                             +-----------------------+       +------------------------+
                             |     RECOVERY_ORGS     |<------+ (partner organization, |
                             | (shelters & charities)|       |  driver, OTP verify)   |
                             +-----------------------+       +------------------------+
```

---

## 2. Table Definitions

### 1. `hotels`
Stores hotel and kitchen configuration, capacity limits, and operating coordinates.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique hotel identifier |
| `facility_id` | `TEXT` | UNIQUE, NOT NULL | Operational facility code (`DGH-HYD-01`) |
| `hotel_name` | `TEXT` | NOT NULL | `Deccan Grand Hotel — Hyderabad` |
| `hotel_type` | `TEXT` | NOT NULL | `Large Hotel & Banqueting Facility` |
| `service_capacity`| `INTEGER` | NOT NULL | Hard shift safety capacity limit (`1000`) |
| `breakfast_capacity`| `INTEGER`| NOT NULL | Morning service capacity (`800`) |
| `lunch_capacity` | `INTEGER` | NOT NULL | Afternoon service capacity (`1000`) |
| `dinner_capacity` | `INTEGER`| NOT NULL | Evening service capacity (`900`) |
| `operating_days` | `TEXT` | NOT NULL | `All 7 Days (Monday – Sunday)` |
| `default_buffer_pct`| `NUMERIC(4,2)`| NOT NULL | Default safety buffer (`3.00%`) |
| `latitude` | `DOUBLE PRECISION`| NOT NULL | `17.4447` |
| `longitude` | `DOUBLE PRECISION`| NOT NULL | `78.3483` |
| `is_demo_hotel` | `BOOLEAN` | DEFAULT `true` | Illustrative demo flag |

### 2. `service_records`
30-day illustrative operational shift archive used for pattern analysis and forecast baselines.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key | Record identifier |
| `hotel_id` | `UUID` | Foreign Key $\to$ `hotels(id)` | Associated facility |
| `service_date` | `DATE` | NOT NULL | Shift date |
| `service_type` | `TEXT` | NOT NULL | `BREAKFAST`, `LUNCH`, or `DINNER` |
| `day_of_week` | `TEXT` | NOT NULL | `Monday` through `Sunday` |
| `is_weekend` | `BOOLEAN`| NOT NULL | `true` for Saturday and Sunday |
| `expected_customers`| `INTEGER`| NOT NULL | Bookings and registered diners |
| `actual_customers`| `INTEGER` | NOT NULL | Physical turnstile check-ins |
| `attendance_ratio` | `NUMERIC(5,4)`| NOT NULL | `actual / expected` conversion |
| `special_event` | `BOOLEAN`| DEFAULT `false` | Conference or festival flag |
| `food_prepared` | `NUMERIC(8,2)`| NOT NULL | Total meal equivalents cooked |
| `food_served` | `NUMERIC(8,2)`| NOT NULL | Total meal equivalents consumed |
| `food_remaining`| `NUMERIC(8,2)`| NOT NULL | Total food left at end of shift |
| `food_wasted` | `NUMERIC(8,2)`| NOT NULL | Only non-recoverable portion |

### 3. `food_items`
Culinary catalogue with empirical per-diner consumption rates.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key | Item identifier |
| `item_name` | `TEXT` | NOT NULL | e.g., `Steamed Sona Masoori Rice` |
| `category` | `TEXT` | NOT NULL | `Staple`, `Dal & Gravy`, `Curry / Protein`, `Dairy` |
| `unit` | `TEXT` | NOT NULL | Physical culinary unit (`kg`, `L`, `pieces`) |
| `historical_consumption_per_diner` | `NUMERIC(6,4)` | NOT NULL | e.g. `0.0526 kg/diner` |
| `default_initial_batch_ratio` | `NUMERIC(4,2)` | NOT NULL | Staged batch ratio (`0.84` / 84%) |

### 4. `forecasts`
Immutable snapshot of deterministic demand predictions.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key | Forecast snapshot identifier |
| `comparable_baseline` | `INTEGER` | NOT NULL | Historical comparable average ($710$) |
| `day_of_week_effect_pct` | `NUMERIC(5,2)` | NOT NULL | Specific day empirical delta ($+4.8\%$) |
| `weekend_effect_pct` | `NUMERIC(5,2)` | NOT NULL | Weekend multiplier ($+1.3\%$) |
| `recent_trend_pct` | `NUMERIC(5,2)` | NOT NULL | Week-over-week momentum ($+2.1\%$) |
| `unconstrained_prediction`| `INTEGER` | NOT NULL | Raw calculated head count ($795$) |
| `capacity_limit` | `INTEGER` | NOT NULL | Physical hotel bound ($1000$) |
| `is_capacity_constrained` | `BOOLEAN` | NOT NULL | Flag if capped at facility limit |
| `final_predicted_diners` | `INTEGER` | NOT NULL | Final bounded prediction |
| `gemini_explanation` | `TEXT` | NULLABLE | Qualitative manager staging narrative |

### 5. `preparation_recommendations`
Physical batch-staged cooking plans for each dish item.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `forecast_id` | `UUID` | Foreign Key $\to$ `forecasts(id)` | Parent forecast |
| `dish_name` | `TEXT` | NOT NULL | Recipe title |
| `unit` | `TEXT` | NOT NULL | `kg`, `L`, `pieces` |
| `base_requirement` | `NUMERIC(8,2)` | NOT NULL | $Predicted \times Rate$ |
| `safety_buffer` | `NUMERIC(8,2)` | NOT NULL | Controlled buffer ($+3.0\%$) |
| `recommended_quantity` | `NUMERIC(8,2)` | NOT NULL | Base + Buffer |
| `initial_batch` | `NUMERIC(8,2)` | NOT NULL | Stage 1 line open target ($84\%$) |
| `reserve_batch` | `NUMERIC(8,2)` | NOT NULL | Stage 2 finishing reserve ($16\%$) |
| `trigger_condition` | `TEXT` | NOT NULL | Operational release rule |

### 6. `food_consumption`
Service audit capturing actual consumption and surplus vs. waste split.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `actual_diners` | `INTEGER` | NOT NULL | Physical turnstile count |
| `prediction_error` | `INTEGER` | NOT NULL | $Actual - Predicted$ |
| `total_prepared` | `NUMERIC(8,2)` | NOT NULL | Cooked volume |
| `total_served` | `NUMERIC(8,2)` | NOT NULL | Consumed volume |
| `total_remaining` | `NUMERIC(8,2)` | NOT NULL | Unserved food |
| `recoverable_surplus` | `NUMERIC(8,2)` | NOT NULL | Verified safe for donation |
| `non_recoverable_waste` | `NUMERIC(8,2)` | NOT NULL | Plate scrapings / compromised food |

### 7. `recovery_organizations`
Directory of verified community rescue partners in the Hyderabad corridor.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key | Organization identifier |
| `org_name` | `TEXT` | NOT NULL | Partner shelter name |
| `latitude` / `longitude` | `DOUBLE PRECISION`| NOT NULL | Geodesic coordinates |
| `distance_km` | `NUMERIC(5,2)` | NOT NULL | Calculated Haversine distance |
| `intake_capacity_meals` | `INTEGER` | NOT NULL | Daily intake quota |
| `source_type` | `TEXT` | NOT NULL | `DEMO_SEED` (Displayed: "Seeded Demo Partner") |

### 8. `surplus` & 9. `pickups`
Manages the donation lifecycle from listing through OTP-verified handoff.
- Status progression: `ACTIVE` $\to$ `VIEWED` $\to$ `ACCEPTED` $\to$ `PICKUP_SCHEDULED` $\to$ `COMPLETED`.
