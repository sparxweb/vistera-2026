# FOODFLOW — Relational Data Model Specification
**Target Database Engine: Supabase (PostgreSQL 15+)**  
*VISTERA 2026 Hackathon • Problem Statement PS-44: Cutting Food Waste*

---

## 1. Schema Overview
FOODFLOW employs a normalized relational architecture across 9 core tables designed for high auditability, deterministic historical learning, dish-level physical culinary tracking, and end-to-end recovery matching.

```
+--------------------+       +-----------------------+       +------------------------+
|      HOTELS        |<----->|    SERVICE_RECORDS    |       |       FOOD_ITEMS       |
| (Deccan Grand Hyd) |       | (90-day shift archive)|       | (Indian culinary items)|
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
| `latitude` | `DOUBLE PRECISION`| NOT NULL | `17.4447` (Gachibowli, Hyderabad) |
| `longitude` | `DOUBLE PRECISION`| NOT NULL | `78.3483` |
| `is_demo_hotel` | `BOOLEAN` | DEFAULT `true` | Illustrative demo flag |

### 2. `service_records`
90-day operational shift archive (158 records) used for pattern analysis, holdout validation, and historical baseline estimation.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | Primary Key | Record identifier (`DGH-REC-001` to `DGH-REC-158`) |
| `hotel_id` | `TEXT` | NOT NULL | Linked facility (`DGH-HYD-01`) |
| `service_date` | `DATE` | NOT NULL | Calendar date of service |
| `day_of_week` | `TEXT` | NOT NULL | `Monday`, `Tuesday`, etc. |
| `is_weekend` | `BOOLEAN` | NOT NULL | Flag for Saturday / Sunday |
| `meal_type` | `TEXT` | NOT NULL | `Breakfast`, `Lunch`, `Dinner` |
| `service_type` | `TEXT` | NOT NULL | `BREAKFAST`, `LUNCH`, `DINNER` |
| `context` | `TEXT` | NOT NULL | `Standard`, `Exam Week`, `Heavy Rain`, `Weekend / Event` |
| `special_event` | `BOOLEAN` | NOT NULL | Event flag |
| `event_name` | `TEXT` | NULLABLE | Name of conclave, wedding, or festival |
| `expected_customers`| `INTEGER` | NOT NULL | Registrations or expected footfall |
| `actual_customers` | `INTEGER` | NOT NULL | Actual turnstile check-ins |
| `attendance_ratio` | `NUMERIC(5,4)` | NOT NULL | `actual / expected` conversion |
| `food_prepared_kg` | `NUMERIC(6,2)` | NOT NULL | Total food mass prepared |
| `food_served_kg` | `NUMERIC(6,2)` | NOT NULL | Total food consumed |
| `food_remaining_kg`| `NUMERIC(6,2)` | NOT NULL | Net residual food |
| `food_wasted_kg` | `NUMERIC(6,2)` | NOT NULL | Unrecoverable plate waste |

### 3. `food_items`
Standard institutional Indian meal preparation catalog.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | Primary Key | Item slug (`prep-rice`, `prep-dal`, etc.) |
| `name` | `TEXT` | NOT NULL | e.g., `Steamed Sona Masoori Rice` |
| `category` | `TEXT` | NOT NULL | `Staple`, `Dal & Gravy`, `Curry / Protein`, `Dairy`, `Breads` |
| `service_shift` | `TEXT` | NOT NULL | `BREAKFAST`, `LUNCH`, `DINNER`, or `ALL` |
| `unit` | `TEXT` | NOT NULL | Culinary unit (`kg`, `L`, `pieces`) |
| `rate_per_diner` | `NUMERIC(6,4)` | NOT NULL | e.g., `0.0526` kg/diner |
| `rate_source` | `TEXT` | NOT NULL | Learned historical rate vs configured institutional standard |
| `default_buffer_pct`| `NUMERIC(4,2)`| NOT NULL | Item-specific safety buffer (e.g. 3.0% to 5.0%) |
| `decimals` | `INTEGER` | NOT NULL | Operational rounding (0 for pieces, 1 for kg/L) |
| `trigger_advice` | `TEXT` | NOT NULL | Staged batch guidance (e.g. when to cook 15% reserve) |

### 4. `forecasts`
Stored output of the deterministic forecast engine.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Forecast instance identifier |
| `hotel_id` | `TEXT` | NOT NULL | Facility code |
| `service_date` | `DATE` | NOT NULL | Date forecast was generated for |
| `service_meal` | `TEXT` | NOT NULL | Shift meal |
| `expected_diners` | `INTEGER` | NOT NULL | Input registrations |
| `predicted_diners` | `INTEGER` | NOT NULL | Output deterministic demand |
| `comparable_baseline`| `INTEGER`| NOT NULL | Historical average of same shift |
| `day_effect_pct` | `NUMERIC(4,2)` | NOT NULL | Empirical day-of-week multiplier |
| `trend_effect_pct` | `NUMERIC(4,2)` | NOT NULL | Rolling trend multiplier |
| `event_effect_pct` | `NUMERIC(4,2)` | NOT NULL | Calibrated event multiplier |
| `recommended_prep` | `INTEGER` | NOT NULL | Total portion equivalents including buffer |
| `is_capacity_capped`| `BOOLEAN` | NOT NULL | Whether result was clamped to 1000 meals |
| `engine_version` | `TEXT` | NOT NULL | Version tag (`v3.0-indian-statistical-baseline`) |

### 5. `recovery_organizations`
Seeded demo recovery partners across Hyderabad.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | Primary Key | e.g. `org-hyd-01` to `org-hyd-07` |
| `name` | `TEXT` | NOT NULL | e.g. `Robin Hood Army — Gachibowli Chapter` |
| `locality` | `TEXT` | NOT NULL | `Gachibowli`, `Madhapur`, `Mehdipatnam`, `Ameerpet`, `Kukatpally`, `Secunderabad` |
| `source_type` | `TEXT` | NOT NULL | `Seeded Demo Partner` |
| `latitude` | `DOUBLE PRECISION`| NOT NULL | e.g. `17.4410` |
| `longitude` | `DOUBLE PRECISION`| NOT NULL | e.g. `78.3610` |
| `daily_capacity` | `INTEGER` | NOT NULL | Max daily portions accepted |
| `available_capacity`| `INTEGER` | NOT NULL | Unallocated capacity today |
| `accepted_food_types`| `TEXT[]` | NOT NULL | Array of accepted food profiles |
| `contact_person` | `TEXT` | NOT NULL | Lead coordinator |
| `phone` | `TEXT` | NOT NULL | Contact telephone |
| `operating_hours` | `TEXT` | NOT NULL | Daily operating hours |

### 6. `surplus_listings`
Surplus meal batches staged for rescue transfer.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | Primary Key | e.g. `SUR-HYD-2026-042` |
| `title` | `TEXT` | NOT NULL | Descriptive batch summary |
| `servings` | `INTEGER` | NOT NULL | Estimated portion count |
| `quantity_kg` | `NUMERIC(5,2)` | NOT NULL | Measured net weight in kg |
| `temp_condition` | `TEXT` | NOT NULL | e.g. `Hot Held (≥63°C)` |
| `pickup_deadline` | `TEXT` | NOT NULL | Safe window expiration |
| `status` | `TEXT` | NOT NULL | `listed`, `organization_viewed`, `accepted`, `pickup_scheduled`, `collected` |
| `assigned_org` | `TEXT` | NULLABLE | Assigned demo recovery partner |

### 7. `pickups`
Scheduled logistics and delivery verification.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | Primary Key | Unique dispatch identifier |
| `surplus_id` | `TEXT` | References `surplus_listings(id)` | Linked surplus batch |
| `org_id` | `TEXT` | References `recovery_organizations(id)` | Assigned partner |
| `scheduled_time` | `TIMESTAMP WITH TIME ZONE` | NOT NULL | Scheduled pickup time |
| `status` | `TEXT` | NOT NULL | `SCHEDULED`, `DISPATCHED`, `COMPLETED` |
| `verification_otp` | `TEXT` | NOT NULL | 4-digit driver handoff PIN |

---

## 3. Data Integrity & Internal Consistency Rules
1. **Physical Feasibility**: In all records, `food_served` $\le$ `food_prepared`.
2. **Deterministic Reproducibility**: Given identical hotel ID, expected diners, service type, and day of week, the forecast function always returns the exact same prediction.
3. **Hard Capacity Bounding**: Predictions never exceed the hotel's `service_capacity` (1,000 meals).
4. **Coordinate Safety**: Distance calculations verify latitude ($-90 \le \text{lat} \le 90$) and longitude ($-180 \le \text{lon} \le 180$) prior to computing geodesic trigonometry.
