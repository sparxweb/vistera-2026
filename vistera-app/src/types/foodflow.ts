export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface KitchenProfile {
  id: string;
  name: string;
  location: string;
  shift: string;
  manager: string;
  totalCapacity: number;
}

export interface NumericalForecast {
  expectedDiners: number;
  historicalAverage: number;
  predictedDemand: number;
  recommendedPreparation: number;
  bufferServings: number;
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  engineVersion: string;
  calculatedAt: string;
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

export interface ConsumptionRecord {
  date: string;
  mealsPrepared: number;
  mealsServed: number;
  remainingFood: number;
  predictedDemand: number;
  surplusDetected: number;
  overproductionPercent: number;
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
  verified: boolean;
  verifiedBadgeText: string;
  distanceKm: number;
  etaMinutes: number;
  address: string;
  acceptedFoodTypes: string[];
  dailyIntakeCapacity: number;
  currentAvailableCapacity: number;
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
