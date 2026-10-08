import {
  KitchenProfile,
  NumericalForecast,
  LLMExplanation,
  ConsumptionRecord,
  SurplusListing,
  RecoveryOrganization,
  HistoryRecord,
  SystemNotification,
} from '@/types/foodflow';
import { calculateHaversineDistance } from '@/lib/geo/distance';

export const DEMO_KITCHEN: KitchenProfile = {
  id: 'kt-hyd-hostel-01',
  name: 'College Hostel Dining Hall',
  location: 'Central Campus — Gachibowli, Hyderabad',
  city: 'Hyderabad',
  shift: 'Lunch Service (12:00 - 14:30 IST)',
  manager: 'Rajesh Nair, Chief Catering Warden',
  totalCapacity: 1000,
  latitude: 17.4447,
  longitude: 78.3483,
  defaultBufferPct: 3.0,
};

export const INITIAL_NUMERICAL_FORECAST: NumericalForecast = {
  expectedDiners: 820,
  predictedDiners: 795,
  historicalAverage: 790,
  predictedDemand: 795,
  recommendedPreparation: 819,
  bufferServings: 24,
  confidence: 'High',
  riskLevel: 'LOW',
  engineVersion: 'v3.0-indian-statistical-baseline',
  calculatedAt: 'Today, 07:30 AM IST',
  dishes: [
    {
      id: 'DISH-1',
      dishName: 'Steamed Sona Masoori Rice',
      category: 'Staple',
      unit: 'kg',
      consumptionRatePerDiner: 0.0526,
      predictedDemand: 41.8,
      safetyBuffer: 1.2,
      recommendedPreparation: 43.0,
      batchStaging: {
        initialBatch: 36.0,
        reserveBatch: 7.0,
        triggerCondition: 'Cook second batch (7 kg) if 12:45 PM turnstile count crosses 640 diners.',
      },
      explanation: 'Recent comparable lunch services consumed ~0.0526 kg/diner. FOODFLOW applies 3% safety buffer (+1.2 kg) to mitigate peak shortages.',
    },
    {
      id: 'DISH-2',
      dishName: 'Tomato Dal / Dal Tadka',
      category: 'Dal & Gravy',
      unit: 'L',
      consumptionRatePerDiner: 0.0215,
      predictedDemand: 17.2,
      safetyBuffer: 0.8,
      recommendedPreparation: 18.0,
      batchStaging: {
        initialBatch: 15.0,
        reserveBatch: 3.0,
        triggerCondition: 'Stage 15 L hot-held in Bain-marie; keep 3 L finishing reserve.',
      },
      explanation: 'Historical dal consumption rate is ~0.0215 L/diner. Staging 18 L total ensures smooth ladle velocity through rush.',
    },
    {
      id: 'DISH-3',
      dishName: 'Andhra Chicken Curry',
      category: 'Curry / Protein',
      unit: 'kg',
      consumptionRatePerDiner: 0.0385,
      predictedDemand: 29.4,
      safetyBuffer: 1.6,
      recommendedPreparation: 31.0,
      batchStaging: {
        initialBatch: 25.0,
        reserveBatch: 6.0,
        triggerCondition: 'Cook 25 kg primary batch; simmer 6 kg reserve after monitoring first 45 min non-veg uptake.',
      },
      explanation: 'Historical take-up rate for chicken entree is ~0.0385 kg/diner. Staggered batching avoids over-stewing residual chicken pieces.',
    },
    {
      id: 'DISH-4',
      dishName: 'Mixed Vegetable Korma',
      category: 'Curry / Protein',
      unit: 'kg',
      consumptionRatePerDiner: 0.0210,
      predictedDemand: 15.6,
      safetyBuffer: 0.9,
      recommendedPreparation: 16.5,
      batchStaging: {
        initialBatch: 14.0,
        reserveBatch: 2.5,
        triggerCondition: 'Simmer 14 kg primary; keep 2.5 kg cold-prepped for rapid finish if vegetarian attendance spikes.',
      },
      explanation: 'Vegetarian entree rate averages ~0.0210 kg/diner. Safety buffer of 0.9 kg prevents vegetarian counter stockout.',
    },
    {
      id: 'DISH-5',
      dishName: 'Fresh Set Curd',
      category: 'Dairy',
      unit: 'L',
      consumptionRatePerDiner: 0.0150,
      predictedDemand: 11.4,
      safetyBuffer: 0.6,
      recommendedPreparation: 12.0,
      batchStaging: {
        initialBatch: 10.5,
        reserveBatch: 1.5,
        triggerCondition: 'Hold chilled in refrigerated dispensers; replenish in 1.5 L steel buckets.',
      },
      explanation: 'Consistent curd consumption of ~0.015 L/diner on warm afternoon services.',
    },
  ],
  factors: {
    historicalPattern: 'Lunch rolling baseline from 25 comparable shifts (~790 diners)',
    attendanceTrend: 'Historical attendance conversion: 96.9% (Standard shift)',
    menuDemandFactor: 'Steamed Rice + Dal + Chicken/Veg + Curd: empirical dish rates in real units (kg/L)',
    dayOfWeekEffect: 'Two-stage batch staging active: ~84% initial cook, reserve held for demand trigger',
  },
};

export const INITIAL_LLM_EXPLANATION: LLMExplanation = {
  provider: 'Gemini 3.8 Flash',
  summary:
    'Expected attendance of 820 indicates an adjusted demand of 795 diners based on recent 96.9% turnout patterns. Two-stage batch cooking is strongly recommended to protect fresh entree quality.',
  detailedReasoning: [
    'Historical Wednesday attendance across the last 3 weeks consistently stabilizes between 775 and 805 meals with low variance (±18 diners).',
    'Weather in Gachibowli is clear (32°C); standard academic day footfall is expected without meteorological disruptions.',
    'Rice and Dal have stable holding profiles, but Chicken Curry should be split 80/20 to preserve tender texture and avoid over-holding.',
    'Recommended preparation targets: 43.0 kg Rice, 18.0 L Dal, 31.0 kg Chicken Curry, 16.5 kg Veg Curry, and 12.0 L Curd.'
  ],
  operationalRecommendation:
    'Stage primary batches (36 kg Rice, 25 kg Chicken Curry) by 11:45 AM. Hold secondary reserves until observing turnstile arrival velocity at 12:45 PM.',
  confidenceRationale:
    'Statistical demand baseline calculated across 25 comparable historical lunch shifts at the Hyderabad Hostel Canteen.',
  bufferAdvice:
    'Maintain a controlled 3% safety margin across all counters. Do not exceed 43 kg Rice to prevent avoidable end-of-shift organic surplus.'
};

export const INITIAL_CONSUMPTION: ConsumptionRecord = {
  date: 'Today (Lunch Shift — Concluded)',
  mealsPrepared: 819,
  mealsServed: 785,
  remainingFood: 34,
  predictedDemand: 795,
  surplusDetected: 34,
  overproductionPercent: 4.1,
  attendanceVariance: -10,
  wasteAnalysis: 'Actual diners (785) fell slightly short of predicted (795) by 10 attendees. Overproduction buffer was safely held in thermal pans with zero spoilage. 3.2 kg Rice and 2.5 kg Chicken Curry remain in prime condition for immediate rescue transfer.',
  dishes: [
    {
      dishName: 'Steamed Sona Masoori Rice',
      unit: 'kg',
      preparedQuantity: 43.0,
      servedQuantity: 39.8,
      remainingQuantity: 3.2,
      status: 'SURPLUS',
      isRecoverable: true,
    },
    {
      dishName: 'Tomato Dal / Dal Tadka',
      unit: 'L',
      preparedQuantity: 18.0,
      servedQuantity: 16.2,
      remainingQuantity: 1.8,
      status: 'SURPLUS',
      isRecoverable: true,
    },
    {
      dishName: 'Andhra Chicken Curry',
      unit: 'kg',
      preparedQuantity: 31.0,
      servedQuantity: 28.5,
      remainingQuantity: 2.5,
      status: 'SURPLUS',
      isRecoverable: true,
    },
    {
      dishName: 'Mixed Vegetable Korma',
      unit: 'kg',
      preparedQuantity: 16.5,
      servedQuantity: 15.4,
      remainingQuantity: 1.1,
      status: 'BALANCED',
      isRecoverable: false,
    },
    {
      dishName: 'Fresh Set Curd',
      unit: 'L',
      preparedQuantity: 12.0,
      servedQuantity: 11.2,
      remainingQuantity: 0.8,
      status: 'BALANCED',
      isRecoverable: false,
    },
  ],
  mismatchLikelyFactors: [
    {
      factor: 'Afternoon Seminar Relocation',
      impact: 'Primary',
      description: 'Senior engineering cohort attended an external symposium at Hitec City, reducing late-session dining crowd.'
    },
    {
      factor: 'Controlled Staging Residual',
      impact: 'Secondary',
      description: 'Reserve batch held as intended without burning or contamination.'
    },
    {
      factor: 'Curd & Korma High Tray Clearance',
      impact: 'Minor',
      description: 'Curd and vegetable counters cleared nearly 100% of prepared quantities.'
    }
  ],
  aiRecommendation:
    'For tomorrow\'s lunch under similar registrations, maintain the 80/20 batch staging protocol. The 3.2 kg Rice and 2.5 kg Chicken Curry are within the safe 2-hour hot-hold window and should be routed immediately via the Recovery Map.'
};

export const INITIAL_SURPLUS_LISTING: SurplusListing = {
  id: 'SUR-HYD-2026-042',
  title: 'Steamed Sona Masoori Rice & Andhra Chicken Curry',
  category: 'Cooked Meals',
  servings: 34,
  quantity: 5.7,
  unit: 'kg',
  dishItems: [
    { dishName: 'Steamed Sona Masoori Rice', quantity: 3.2, unit: 'kg' },
    { dishName: 'Andhra Chicken Curry', quantity: 2.5, unit: 'kg' },
    { dishName: 'Tomato Dal / Dal Tadka', quantity: 1.8, unit: 'L' },
  ],
  temperatureCondition: 'Hot Held (≥63°C)',
  preparedTime: '11:45 AM (Today)',
  pickupDeadline: '15:30 PM (Within 2h safe window)',
  kitchenLocation: 'College Hostel Dining Hall — Loading Bay Dock 2, Gachibowli, Hyderabad',
  dietaryTags: ['Halal Compliant', 'Nut-Free', 'High Protein'],
  allergens: ['None'],
  notes: 'Panned in thermal insulated SS carriers. Temperature logged at 67.2°C at shift wrap. Verified safe for immediate transfer.',
  status: 'organization_viewed',
  statusHistory: [
    { stage: 'listed', label: 'Surplus Listed', timestamp: '14:32 PM', completed: true },
    { stage: 'organization_viewed', label: 'Partner Viewed', timestamp: '14:38 PM', completed: true },
    { stage: 'accepted', label: 'Accepted by Partner', timestamp: 'Pending', completed: false },
    { stage: 'pickup_scheduled', label: 'Pickup Scheduled', timestamp: 'Pending', completed: false },
    { stage: 'collected', label: 'Collected & Dispatched', timestamp: 'Pending', completed: false }
  ],
  assignedOrg: 'Robin Hood Army — Gachibowli Chapter',
};

// Realistic Seeded Hyderabad Recovery Partners (Real coordinates relative to Gachibowli 17.4447, 78.3483)
const KITCHEN_LAT = 17.4447;
const KITCHEN_LNG = 78.3483;

export const DEMO_ORGANIZATIONS: RecoveryOrganization[] = [
  {
    id: 'org-hyd-01',
    name: 'Robin Hood Army — Gachibowli Chapter',
    organizationType: 'Volunteer Food Rescue Network',
    verified: true,
    verifiedBadgeText: 'Demo Recovery Partner',
    distanceKm: calculateHaversineDistance(KITCHEN_LAT, KITCHEN_LNG, 17.4410, 78.3610),
    etaMinutes: 10,
    address: 'Near Bio-Diversity Park, Gachibowli, Hyderabad, Telangana 500032',
    city: 'Hyderabad',
    acceptedFoodTypes: ['Cooked Hot Meals (Rice & Curries)', 'Insulated Pans', 'Breads & Roti'],
    dailyIntakeCapacity: 250,
    currentAvailableCapacity: 90,
    foodCategoryNeeded: 'Cooked Hot Meals (Lunch / Dinner)',
    status: 'Accepting',
    sourceType: 'Seeded Demo Partner',
    contactPerson: 'Siddharth Rao (Hyderabad Lead)',
    phone: '+91 98490 12345',
    openHours: '09:00 - 21:00 Daily',
    lat: 17.4410,
    lng: 78.3610,
  },
  {
    id: 'org-hyd-02',
    name: 'Feeding India by Zomato — Madhapur Hub',
    organizationType: 'Food Recovery & Distribution Hub',
    verified: true,
    verifiedBadgeText: 'Demo Recovery Partner',
    distanceKm: calculateHaversineDistance(KITCHEN_LAT, KITCHEN_LNG, 17.4485, 78.3790),
    etaMinutes: 14,
    address: 'Plot 18, Phase 2, Hitec City, Madhapur, Hyderabad, Telangana 500081',
    city: 'Hyderabad',
    acceptedFoodTypes: ['Cooked Meals', 'Dal & Curries', 'Breakfast Items'],
    dailyIntakeCapacity: 400,
    currentAvailableCapacity: 140,
    foodCategoryNeeded: 'Rice, Dal, Stews & Gravies',
    status: 'Accepting',
    sourceType: 'Seeded Demo Partner',
    contactPerson: 'Pooja Reddy (Dispatch Coordinator)',
    phone: '+91 97000 54321',
    openHours: '08:00 - 22:00 Daily',
    lat: 17.4485,
    lng: 78.3790,
  },
  {
    id: 'org-hyd-03',
    name: 'Annamrita Foundation — Kondapur Kitchen Hub',
    organizationType: 'Institutional Community Kitchen',
    verified: true,
    verifiedBadgeText: 'Demo Recovery Partner',
    distanceKm: calculateHaversineDistance(KITCHEN_LAT, KITCHEN_LNG, 17.4620, 78.3605),
    etaMinutes: 16,
    address: 'Survey 44, Near RTO Office, Kondapur, Hyderabad, Telangana 500084',
    city: 'Hyderabad',
    acceptedFoodTypes: ['Cooked Vegetarian Meals', 'Steamed Rice', 'Dal & Sambar'],
    dailyIntakeCapacity: 600,
    currentAvailableCapacity: 200,
    foodCategoryNeeded: 'Vegetarian Cooked Food',
    status: 'Accepting',
    sourceType: 'Seeded Demo Partner',
    contactPerson: 'Venkatacharyulu K. (Kitchen Superintendent)',
    phone: '+91 94400 98765',
    openHours: '06:00 - 19:30 Daily',
    lat: 17.4620,
    lng: 78.3605,
  },
  {
    id: 'org-hyd-04',
    name: 'Aasara Food Bank & Community Shelter',
    organizationType: 'Emergency Food Bank & Night Shelter',
    verified: true,
    verifiedBadgeText: 'Demo Recovery Partner',
    distanceKm: calculateHaversineDistance(KITCHEN_LAT, KITCHEN_LNG, 17.4045, 78.4110),
    etaMinutes: 24,
    address: 'MCH Community Hall, Tolichowki, Hyderabad, Telangana 500008',
    city: 'Hyderabad',
    acceptedFoodTypes: ['Cooked Hot Meals', 'Dry Bakery', 'Surplus Rice & Dal'],
    dailyIntakeCapacity: 180,
    currentAvailableCapacity: 60,
    foodCategoryNeeded: 'Cooked Meals for Evening Shelter',
    status: 'Accepting',
    sourceType: 'Seeded Demo Partner',
    contactPerson: 'Mohammad Farooq (Shelter Warden)',
    phone: '+91 98850 77665',
    openHours: '12:00 - 23:00 Daily',
    lat: 17.4045,
    lng: 78.4110,
  },
];

export const DEMO_HISTORY: HistoryRecord[] = [
  { date: 'Oct 02', day: 'Thu', diners: 810, forecast: 785, prepared: 805, actualServed: 792, variance: +7, surplus: 13, recoveryStatus: 'Recovered' },
  { date: 'Oct 03', day: 'Fri', diners: 840, forecast: 815, prepared: 835, actualServed: 820, variance: +5, surplus: 15, recoveryStatus: 'Recovered' },
  { date: 'Oct 04', day: 'Sat', diners: 720, forecast: 690, prepared: 710, actualServed: 695, variance: +5, surplus: 15, recoveryStatus: 'Internal Repurpose' },
  { date: 'Oct 05', day: 'Sun', diners: 650, forecast: 620, prepared: 635, actualServed: 625, variance: +5, surplus: 10, recoveryStatus: 'Recovered' },
  { date: 'Oct 06', day: 'Mon', diners: 800, forecast: 775, prepared: 795, actualServed: 780, variance: +5, surplus: 15, recoveryStatus: 'Recovered' },
  { date: 'Oct 07', day: 'Tue', diners: 815, forecast: 790, prepared: 810, actualServed: 795, variance: +5, surplus: 15, recoveryStatus: 'Recovered' },
  { date: 'Oct 08', day: 'Wed (Today)', diners: 820, forecast: 795, prepared: 819, actualServed: 785, variance: -10, surplus: 34, recoveryStatus: 'Recovered' },
];

export const DEMO_CHART_TIMELINE = [
  { day: 'Mon 06', label: 'Mon', historical: 790, forecast: 775, actual: 780, prepared: 795 },
  { day: 'Tue 07', label: 'Tue', historical: 800, forecast: 790, actual: 795, prepared: 810 },
  { day: 'Wed 08 (Today)', label: 'Today', historical: 790, forecast: 795, actual: 785, prepared: 819, isToday: true },
  { day: 'Thu 09', label: 'Thu', historical: 810, forecast: 800, actual: null, prepared: 820 },
  { day: 'Fri 10', label: 'Fri', historical: 830, forecast: 820, actual: null, prepared: 840 },
  { day: 'Sat 11', label: 'Sat', historical: 700, forecast: 685, actual: null, prepared: 705 },
  { day: 'Sun 12', label: 'Sun', historical: 640, forecast: 625, actual: null, prepared: 640 },
];

export const DEMO_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n-1',
    title: 'Surplus Listing Active (Hyderabad)',
    message: '3.2 kg Rice & 2.5 kg Chicken Curry staged for rescue dispatch.',
    timestamp: '14:32 PM IST',
    type: 'alert',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Partner Viewing Listing',
    message: 'Robin Hood Army (Gachibowli) opened listing SUR-HYD-2026-042.',
    timestamp: '14:38 PM IST',
    type: 'info',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Shift Consumption Logged',
    message: '785 served vs 819 prepared (34 surplus portion equivalents detected).',
    timestamp: '14:30 PM IST',
    type: 'success',
    read: true,
  },
];
