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

export type ScreenId =
  | 'overview'
  | 'login'
  | 'dashboard'
  | 'forecast'
  | 'preparation'
  | 'consumption'
  | 'analysis'
  | 'recovery'
  | 'organizations'
  | 'history'
  | 'architecture'
  | 'settings'
  | 'ngo_inbox'
  | 'ngo_pickups'
  | 'ngo_history'
  | 'notifications';

export type UserRole = 'HOTEL' | 'NGO';

export interface AuthUser {
  role: UserRole;
  id: string;
  name: string;
  facilityId?: string;
  orgId?: string;
  dataStatus: 'DEMO' | 'FICTIONAL DEMO PARTNER';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPerson?: string;
  contactPhone?: string;
}

export type SafetyReviewStatus = 
  | 'PENDING_REVIEW'
  | 'ELIGIBLE_FOR_REVIEWED_PICKUP'
  | 'REJECTED'
  | 'EXPIRED';

export type OfferPickupStatus = 
  | 'OFFERED'
  | 'ACCEPTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'COMPLETED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface FoodSafetyReview {
  preparationTime: string;
  storageCondition: 'Hot-holding (≥63°C)' | 'Refrigerated (≤4°C)' | 'Ambient / Dry';
  temperatureLoggedCelsius?: number;
  temperatureVerified: boolean;
  hygieneCheckPassed: boolean;
  packagingFoodGrade: boolean;
  responsibleStaffConfirmation: boolean;
  reviewedBy: string;
  reviewerDesignation: string;
  reviewedAt: string;
  decision: SafetyReviewStatus;
  rejectionReason?: string;
  safetyNotes?: string;
  policyNotes?: string;
}

export interface OfferTimelineEvent {
  stage: OfferPickupStatus | 'SAFETY_APPROVED' | 'SAFETY_REJECTED';
  label: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export interface FoodRecoveryOffer {
  id: string; // e.g. "FF-SURPLUS-0001"
  hotelId: string;
  hotelName: string;
  hotelLocation: string;
  hotelCoordinates: {
    lat: number;
    lng: number;
  };
  
  foodItem: string;
  dishCategory: string;
  quantity: number;
  unit: FoodUnit;
  servingsEquivalent: number;
  
  preparationDateTime: string;
  availableUntil: string;
  pickupDeadline: string;
  handlingNotes?: string;
  dietaryTags?: string[];
  allergens?: string[];
  
  // Safety Review Gate
  safetyReview: FoodSafetyReview;
  
  // Workflow Status
  status: OfferPickupStatus;
  
  // NGO Acceptance / Decline details
  acceptedByOrgId?: string;
  acceptedByOrgName?: string;
  acceptedAt?: string;
  declineReason?: string;
  declinedAt?: string;
  
  // Pickup Details
  pickupDetails?: {
    scheduledDateTime?: string;
    vehicleType?: string;
    driverContact?: string;
    temperatureAtPickupCelsius?: number;
    handoverConfirmedByHotel?: boolean;
    handoverTimestamp?: string;
    receivedConfirmedByNgo?: boolean;
    completionTimestamp?: string;
    notes?: string;
  };
  
  // Activity Timeline
  timeline: OfferTimelineEvent[];
  
  createdAt: string;
  updatedAt: string;
}

export interface FoodRecoveryNotification {
  id: string;
  targetRole: 'HOTEL' | 'NGO' | 'ALL';
  offerId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
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
