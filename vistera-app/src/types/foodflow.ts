export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type FoodUnit = 'kg' | 'L' | 'pieces' | 'portions';

export type ServiceType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface HotelProfile {
  id: string;
  name: string;
  hotelName?: string;
  type: string;
  location: string;
  city: string;
  state: string;
  shift: string;
  manager: string;
  totalCapacity: number;
  serviceCapacity?: number;
  averageDailyCustomers: number;
  breakfastCapacity: number;
  lunchCapacity: number;
  dinnerCapacity: number;
  operatingDays: string;
  isDemoHotel: boolean;
  latitude: number;
  longitude: number;
  defaultBufferPct: number;
}

export type KitchenProfile = HotelProfile;


export interface DishPreparationItem {
  id: string;
  dishName: string;
  category: 'Staple' | 'Dal & Gravy' | 'Curry / Protein' | 'Side' | 'Dairy';
  unit: FoodUnit;
  consumptionRatePerDiner: number;
  predictedDemand: number;
  safetyBuffer: number;
  recommendedPreparation: number;
  batchStaging: {
    initialBatch: number;
    reserveBatch: number;
    triggerCondition: string;
  };
  explanation: string;
}

export interface NumericalForecast {
  expectedDiners: number;
  predictedDiners: number;
  historicalAverage: number;
  predictedDemand: number; // total portions equivalent
  recommendedPreparation: number; // total portions equivalent
  bufferServings: number;
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  engineVersion: string;
  calculatedAt: string;
  dishes: DishPreparationItem[];
  factors: {
    historicalPattern: string;
    attendanceTrend: string;
    menuDemandFactor: string;
    dayOfWeekEffect: string;
  };
}

export interface LLMExplanation {
  provider: 'Gemini 3.8 Flash' | 'Gemini 2.5 Flash';
  summary: string;
  detailedReasoning: string[];
  operationalRecommendation: string;
  confidenceRationale: string;
  bufferAdvice: string;
}

export interface DishConsumptionItem {
  dishName: string;
  unit: FoodUnit;
  preparedQuantity: number;
  servedQuantity: number;
  remainingQuantity: number;
  status: 'BALANCED' | 'SURPLUS RISK' | 'SHORTAGE RISK' | 'SURPLUS' | 'WASTE';
  isRecoverable: boolean;
}

export interface ConsumptionRecord {
  date: string;
  mealsPrepared: number;
  mealsServed: number;
  remainingFood: number;
  predictedDemand: number;
  surplusDetected: number;
  overproductionPercent: number;
  dishes?: DishConsumptionItem[];
  attendanceVariance?: number;
  wasteAnalysis?: string;
  mismatchLikelyFactors: {
    factor: string;
    impact: 'Primary' | 'Secondary' | 'Minor';
    description: string;
  }[];
  aiRecommendation: string;
}

export type SurplusListingStatus = 
  | 'listed'
  | 'organization_viewed'
  | 'accepted'
  | 'pickup_scheduled'
  | 'collected';

export interface SurplusListing {
  id: string;
  title: string;
  category: 'Cooked Meals' | 'Bakery & Bread' | 'Salads & Cold Plates' | 'Soups & Stews';
  servings: number;
  unit?: FoodUnit;
  quantity?: number;
  dishItems?: {
    dishName: string;
    quantity: number;
    unit: FoodUnit;
  }[];
  temperatureCondition: 'Hot Held (≥63°C)' | 'Chilled (≤4°C)' | 'Ambient (Dry)';
  preparedTime: string;
  pickupDeadline: string;
  kitchenLocation: string;
  dietaryTags: string[];
  allergens: string[];
  notes: string;
  status: SurplusListingStatus;
  statusHistory: {
    stage: SurplusListingStatus;
    label: string;
    timestamp: string;
    completed: boolean;
  }[];
  assignedOrg?: string;
  assignedDriver?: string;
}

export interface RecoveryOrganization {
  id: string;
  name: string;
  organizationType: string;
  verified: boolean;
  verifiedBadgeText: string;
  distanceKm: number;
  etaMinutes: number;
  address: string;
  city: string;
  acceptedFoodTypes: string[];
  dailyIntakeCapacity: number;
  currentAvailableCapacity: number;
  foodCategoryNeeded: string;
  status: 'Accepting' | 'On Standby' | 'Capacity Full';
  sourceType: 'Seeded Demo Partner' | 'Verified Public Source';
  contactPerson: string;
  phone: string;
  openHours: string;
  lat: number;
  lng: number;
}

export interface HistoryRecord {
  date: string;
  day: string;
  diners: number;
  forecast: number;
  prepared: number;
  actualServed: number;
  variance: number;
  surplus: number;
  recoveryStatus: 'Recovered' | 'Internal Repurpose' | 'None (Zero Waste)' | 'None (Balanced)';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

export interface ForecastCalculationBreakdown {
  serviceType: ServiceType;
  expectedCustomers: number;
  comparableBaseline: number; // baseline from comparable historical shifts
  dayOfWeek: string;
  dayOfWeekEffectPct: number; // e.g. +4.8%
  dayOfWeekEffectDiners: number;
  isWeekend: boolean;
  weekendEffectPct: number;
  weekendEffectDiners: number;
  specialEvent?: string;
  specialEventEffectPct: number;
  specialEventEffectDiners: number;
  recentTrendPct: number;
  recentTrendDiners: number;
  unconstrainedPrediction: number;
  hotelCapacityLimit: number; // 1000
  isCapacityConstrained: boolean;
  finalPredictedDiners: number;
}

export interface PatternAnalysisOutput {
  dayOfWeekAverages: {
    day: string;
    averageDiners: number;
    sampleSize: number;
    varianceVsMeanPct: number;
  }[];
  weekdayAverage: number;
  weekendAverage: number;
  weekdayVsWeekendPct: number;
  mealAverages: {
    meal: ServiceType;
    averageDiners: number;
    averageConsumptionRateKg: number;
    typicalWastagePct: number;
  }[];
  recent7DayTrendPct: number;
  recentTrendDirection: 'Upward' | 'Stable' | 'Downward';
  specialEventMultiplier: number;
  confidenceScore: number; // 0 - 100
  confidenceLabel: ConfidenceLevel;
  totalHistoricalRecords: number;
  dateRangeCovered: string;
}

export interface OrganizationMatchRecommendation {
  organization: RecoveryOrganization;
  matchScore: number; // 0 - 100
  distanceKm: number;
  foodTypeFit: boolean;
  capacityFit: boolean;
  matchReasons: string[];
}

export interface PickupRecord {
  id: string;
  surplusId: string;
  organizationId: string;
  organizationName: string;
  foodDescription: string;
  quantityDisplay: string;
  scheduledTime: string;
  pickupDeadline: string;
  status: 'PENDING' | 'PICKUP_SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  otpCode: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  completedAt?: string;
}

