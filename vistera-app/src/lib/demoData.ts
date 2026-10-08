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

export const DEMO_KITCHEN: KitchenProfile = {
  id: 'kt-central-01',
  name: 'FOODFLOW Central Kitchen',
  location: 'Metropolitan Campus — Building C, Level 1',
  shift: 'Lunch Service (11:30 - 14:30)',
  manager: 'Elena Rostova, Culinary Director',
  totalCapacity: 1200,
};

export const INITIAL_NUMERICAL_FORECAST: NumericalForecast = {
  expectedDiners: 800,
  historicalAverage: 756,
  predictedDemand: 742,
  recommendedPreparation: 760,
  bufferServings: 18,
  confidence: 'Medium',
  riskLevel: 'MEDIUM',
  engineVersion: 'v2.4-lightweight-regressor',
  calculatedAt: 'Today, 07:15 AM',
  factors: {
    historicalPattern: 'Mid-week baseline: average 756 diners on Wednesdays across past 8 weeks',
    attendanceTrend: 'Recent 3-day badge check-in indicates -3.8% lower physical campus occupancy',
    menuDemandFactor: 'High-protein grain bowl selection yields a historical 92.4% take-up rate',
    dayOfWeekEffect: 'Wednesday lunch attendance historically exhibits less than 4% variance',
  },
};

export const INITIAL_LLM_EXPLANATION: LLMExplanation = {
  provider: 'Gemini 3.8 Flash',
  summary:
    "Based on recent Wednesday consumption and today's expected attendance, demand is likely to remain slightly below the recent average. The recommendation allows a small buffer while avoiding unnecessary overproduction.",
  detailedReasoning: [
    "Wednesday historical attendance over the last two months consistently stabilizes around 756 meals, with a standard deviation of ±22 servings.",
    "Physical badge-in sensor data from campus entry gates at 07:00 AM indicates ~5% higher remote work preference today compared to Tuesday.",
    "The scheduled menu ('Roasted Herb Chicken with Mediterranean Farro & Steamed Greens') has low spoilage velocity during hot-holding, but batch 2 should be held back until 12:45 PM.",
    "A 18-serving buffer (recommended: 760 vs predicted: 742) strikes the optimal tradeoff between stockout risk (<1.5%) and surplus risk (<3.5%)."
  ],
  operationalRecommendation:
    "Stage initial cook at 650 servings by 11:15 AM. Release secondary finishing batch of 110 servings only after monitoring the 12:15 PM turnstile velocity peak.",
  confidenceRationale:
    "Forecast engine weighted regression combines rolling 60-day shift logs with morning access gate telemetry.",
  bufferAdvice:
    "Maintain standard 2.4% safety buffer (+18 servings). Do not exceed 765 servings to prevent avoidable organic waste."
};

export const INITIAL_CONSUMPTION: ConsumptionRecord = {
  date: 'Today (Shift A — Concluded)',
  mealsPrepared: 760,
  mealsServed: 728,
  remainingFood: 32,
  predictedDemand: 742,
  surplusDetected: 32,
  overproductionPercent: 4.2,
  mismatchLikelyFactors: [
    {
      factor: 'Campus Attendance Drop',
      impact: 'Primary',
      description: 'Afternoon seminar shifted online, reducing foot traffic between 13:00 - 13:45.'
    },
    {
      factor: 'Menu Preference Shift',
      impact: 'Secondary',
      description: 'Hot soup counter experienced higher substitution than the roasted entree.'
    },
    {
      factor: 'Preparation Buffer Residual',
      impact: 'Minor',
      description: '18 buffer servings safely held as intended; 14 servings over-prepped from batch 2.'
    }
  ],
  aiRecommendation:
    'For similar attendance and menu conditions, consider reducing the secondary batch buffer from 18 to 8 servings. Reallocate 10 servings to cold prep buffer.'
};

export const INITIAL_SURPLUS_LISTING: SurplusListing = {
  id: 'SUR-2026-084',
  title: 'Herb-Roasted Chicken & Mediterranean Farro',
  category: 'Cooked Meals',
  servings: 32,
  temperatureCondition: 'Hot Held (≥63°C)',
  preparedTime: '11:15 AM (Today)',
  pickupDeadline: '15:30 PM (Today — Within 2h safe window)',
  kitchenLocation: 'FOODFLOW Central Kitchen — Dock 2B, Loading Bay',
  dietaryTags: ['Halal Compliant', 'Nut-Free', 'High Protein'],
  allergens: ['Wheat / Gluten', 'Celery'],
  notes: 'Panned in thermal cambro food carriers. Temperature logged at 68.4°C at shift wrap. Verified safe for immediate transfer.',
  status: 'organization_viewed',
  statusHistory: [
    { stage: 'listed', label: 'Surplus Listed', timestamp: '14:32 PM', completed: true },
    { stage: 'organization_viewed', label: 'Organization Viewed', timestamp: '14:38 PM', completed: true },
    { stage: 'accepted', label: 'Accepted by Partner', timestamp: 'Pending', completed: false },
    { stage: 'pickup_scheduled', label: 'Pickup Scheduled', timestamp: 'Pending', completed: false },
    { stage: 'collected', label: 'Collected & Transferred', timestamp: 'Pending', completed: false }
  ],
  assignedOrg: 'Feeding Hope Community Center',
};

export const DEMO_ORGANIZATIONS: RecoveryOrganization[] = [
  {
    id: 'org-01',
    name: 'Feeding Hope Community Center',
    verified: true,
    verifiedBadgeText: 'Verified Non-Profit Partner',
    distanceKm: 1.4,
    etaMinutes: 8,
    address: '422 Elmwood Avenue, District 4',
    acceptedFoodTypes: ['Cooked Hot Meals', 'Pans & Trays', 'Fresh Produce'],
    dailyIntakeCapacity: 450,
    currentAvailableCapacity: 120,
    contactPerson: 'Marcus Vance (Logistics)',
    phone: '+1 (555) 349-8812',
    openHours: '08:00 - 18:30 Daily',
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: 'org-02',
    name: 'City Harvest Shelter & Kitchen',
    verified: true,
    verifiedBadgeText: 'Verified Non-Profit Partner',
    distanceKm: 2.1,
    etaMinutes: 12,
    address: '890 Riverside Way, South Port',
    acceptedFoodTypes: ['Cooked Meals', 'Bakery & Bread', 'Soups & Stews'],
    dailyIntakeCapacity: 600,
    currentAvailableCapacity: 85,
    contactPerson: 'Sarah Jenkins (Intake Coord.)',
    phone: '+1 (555) 782-9901',
    openHours: '24 Hours Emergency Intake',
    lat: 37.7810,
    lng: -122.4110
  },
  {
    id: 'org-03',
    name: 'St. Jude Community Pantry',
    verified: true,
    verifiedBadgeText: 'Verified Non-Profit Partner',
    distanceKm: 3.7,
    etaMinutes: 18,
    address: '1504 St. Jude Plaza, West End',
    acceptedFoodTypes: ['Pans & Trays', 'Dry Bakery', 'Packaged Fruit'],
    dailyIntakeCapacity: 300,
    currentAvailableCapacity: 40,
    contactPerson: 'Father Raymond',
    phone: '+1 (555) 420-1178',
    openHours: '10:00 - 17:00 Mon-Sat',
    lat: 37.7650,
    lng: -122.4280
  },
  {
    id: 'org-04',
    name: 'GreenPlate Youth Foundation',
    verified: true,
    verifiedBadgeText: 'Verified Non-Profit Partner',
    distanceKm: 4.8,
    etaMinutes: 24,
    address: '77 Innovation Park, East Campus',
    acceptedFoodTypes: ['Cooked Hot Meals', 'Sandwiches & Salads'],
    dailyIntakeCapacity: 250,
    currentAvailableCapacity: 160,
    contactPerson: 'Amara Chen (Program Lead)',
    phone: '+1 (555) 901-2244',
    openHours: '11:00 - 20:00 Daily',
    lat: 37.7890,
    lng: -122.4010
  }
];

export const DEMO_HISTORY: HistoryRecord[] = [
  { date: 'Oct 02', day: 'Thu', diners: 810, forecast: 750, prepared: 765, actualServed: 748, variance: -2, surplus: 17, recoveryStatus: 'Recovered' },
  { date: 'Oct 03', day: 'Fri', diners: 720, forecast: 670, prepared: 685, actualServed: 668, variance: -2, surplus: 17, recoveryStatus: 'Recovered' },
  { date: 'Oct 04', day: 'Sat', diners: 410, forecast: 380, prepared: 390, actualServed: 385, variance: +5, surplus: 5, recoveryStatus: 'Internal Repurpose' },
  { date: 'Oct 05', day: 'Sun', diners: 430, forecast: 400, prepared: 410, actualServed: 398, variance: -2, surplus: 12, recoveryStatus: 'Recovered' },
  { date: 'Oct 06', day: 'Mon', diners: 840, forecast: 785, prepared: 800, actualServed: 782, variance: -3, surplus: 18, recoveryStatus: 'Recovered' },
  { date: 'Oct 07', day: 'Tue', diners: 825, forecast: 765, prepared: 780, actualServed: 761, variance: -4, surplus: 19, recoveryStatus: 'Recovered' },
  { date: 'Oct 08', day: 'Wed (Today)', diners: 800, forecast: 742, prepared: 760, actualServed: 728, variance: -14, surplus: 32, recoveryStatus: 'Recovered' },
];

export const DEMO_CHART_TIMELINE = [
  { day: 'Mon 06', label: 'Mon', historical: 790, forecast: 785, actual: 782, prepared: 800 },
  { day: 'Tue 07', label: 'Tue', historical: 770, forecast: 765, actual: 761, prepared: 780 },
  { day: 'Wed 08 (Today)', label: 'Today', historical: 756, forecast: 742, actual: 728, prepared: 760, isToday: true },
  { day: 'Thu 09', label: 'Thu', historical: 762, forecast: 755, actual: null, prepared: 770 },
  { day: 'Fri 10', label: 'Fri', historical: 680, forecast: 672, actual: null, prepared: 690 },
  { day: 'Sat 11', label: 'Sat', historical: 405, forecast: 395, actual: null, prepared: 405 },
  { day: 'Sun 12', label: 'Sun', historical: 420, forecast: 412, actual: null, prepared: 420 },
];

export const DEMO_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n-1',
    title: 'Surplus Listing Active',
    message: '32 servings of Herb-Roasted Chicken listed for recovery.',
    timestamp: '14:32 PM',
    type: 'alert',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Organization Viewing Listing',
    message: 'Feeding Hope Community Center opened listing SUR-2026-084.',
    timestamp: '14:38 PM',
    type: 'info',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Shift Consumption Logged',
    message: '728 served vs 760 prepared (32 surplus detected).',
    timestamp: '14:30 PM',
    type: 'success',
    read: true,
  },
];
