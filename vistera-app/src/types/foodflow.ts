import { AIKitchenInsights } from '@/lib/ai/cleaner';

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
  forecastId?: string;
  hotelId?: string;
  hotelName?: string;
  serviceDate?: string;
  serviceMeal?: 'Breakfast' | 'Lunch' | 'Dinner' | string;
  safetyBufferPct?: number;
  expectedDiners: number;
  predictedDiners: number;
  historicalAverage: number;
  predictedDemand: number; // total portions equivalent
  recommendedPreparation: number; // total portions equivalent
  bufferServings: number;
  defaultBufferPct?: number;
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  engineVersion: string;
  calculatedAt: string;
  dishes: DishPreparationItem[];
  calculationBreakdown?: ForecastCalculationBreakdown;
  aiInsights?: AIKitchenInsights;
  factors: {
    historicalPattern: string;
    attendanceTrend: string;
    menuDemandFactor: string;
    dayOfWeekEffect: string;
  };
}

export interface LLMExplanation {
  provider: string;
  summary: string;
  detailedReasoning: string[];
  operationalRecommendation: string;
  confidenceRationale: string;
  bufferAdvice: string;
  keyFactors?: string[];
  recommendations?: string[];
  caveats?: string[];
  isFallback?: boolean;
}

export interface DishConsumptionItem {
  dishName: string;
  unit: FoodUnit;
  preparedQuantity: number;
  servedQuantity: number;
  remainingQuantity: number;
  status: 'BALANCED' | 'SURPLUS RISK' | 'SHORTAGE RISK' | 'SURPLUS' | 'SHORTAGE' | 'WASTE';
  isRecoverable: boolean;
  recoverySafetyConfirmed?: boolean;
}

export interface ConsumptionRecord {
  id?: string;
  forecastId?: string;
  serviceDate?: string;
  serviceMeal?: string;
  date: string;
  mealsPrepared: number;
  mealsServed: number;
  actualDiners?: number;
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
  category: 'Cooked Meals' | 'Bakery & Bread' | 'Salads & Cold Plates' | 'Soups & Stews' | string;
  servings: number;
  quantity?: number;
  unit?: FoodUnit;
  preparedAt?: string;
  preparedTime?: string;
  expiresAt?: string;
  pickupDeadline?: string;
  storageCondition?: 'Hot-holding (≥63°C)' | 'Refrigerated (≤4°C)' | 'Ambient / Dry' | string;
  temperatureCondition?: string;
  temperatureLoggedCelsius?: number;
  pickupLocation?: string;
  kitchenLocation?: string;
  dishItems?: Array<{ dishName: string; quantity: number; unit: string }>;
  dietaryTags?: string[];
  allergens?: string[];
  notes?: string;
  assignedOrg?: string;
  status: SurplusListingStatus;
  statusHistory: {
    stage: SurplusListingStatus;
    label: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface RecoveryOrganization {
  id: string;
  name: string;
  organizationType: 'NGO Food Relief' | 'Community Shelter' | 'Youth Home' | 'Night Shelter' | string;
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
  status: 'Accepting' | 'Full Today' | 'On Route';
  contactPhone?: string;
  phone?: string;
  contactPerson?: string;
  operatingHours?: string;
  openHours?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  sourceType?: string;
  isBestMatch?: boolean;
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
  recoveryStatus: 'Recovered' | 'None (Zero Waste)' | 'None (Balanced)' | 'Pending Verification' | 'Internal Repurpose' | string;
  verified?: boolean;
}

export interface SystemNotification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS' | 'info' | 'warning' | 'alert' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface PatternAnalysisOutput {
  dayOfWeekAverages: {
    day: string;
    averageDiners: number;
    sampleSize: number;
    typicalWastagePct?: number;
    averageConsumptionRateKg?: number;
    varianceVsMeanPct?: number;
  }[];
  mealAverages: {
    meal: ServiceType;
    averageDiners: number;
    sampleSize: number;
    typicalWastagePct?: number;
    averageConsumptionRateKg?: number;
  }[];
  weekdayAverage: number;
  weekendAverage: number;
  weekdayVsWeekendPct: number;
  recent7DayTrendPct?: number;
  recentTrendDirection?: string;
  specialEventMultiplier?: number;
  confidenceScore?: number;
  confidenceLabel?: string;
  totalHistoricalRecords?: number;
  dateRangeCovered?: string;
  notes?: string;
}

export interface ForecastCalculationBreakdown {
  serviceType: ServiceType;
  expectedCustomers: number;
  comparableBaseline: number;
  dayOfWeek: string;
  dayOfWeekEffectPct: number;
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
  hotelCapacityLimit: number;
  isCapacityConstrained: boolean;
  finalPredictedDiners: number;
}

export interface MatchScoreResult {
  score: number;
  foodTypeScore: number;
  proximityScore: number;
  capacityScore: number;
  distanceKm: number;
  foodCategoryMatch: boolean;
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

export interface ForecastValidationMetrics {
  totalRecordsEvaluated: number;
  trainRecordCount: number;
  holdoutRecordCount: number;
  evaluationWindow: string;
  modelMAE: number;
  baselineMAE: number;
  modelMAPE: number;
  baselineMAPE: number;
  improvementPct: number;
  holdoutComparison: {
    serviceDate: string;
    meal: ServiceType;
    actualDiners: number;
    predictedDiners: number;
    baselineDiners: number;
    modelError: number;
    baselineError: number;
  }[];
  explanation: string;
}
