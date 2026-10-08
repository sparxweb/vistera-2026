import { supabase } from './client';
import {
  NumericalForecast,
  LLMExplanation,
  ConsumptionRecord,
  SurplusListing,
  RecoveryOrganization,
  HistoryRecord,
  SurplusListingStatus,
} from '@/types/foodflow';
import {
  INITIAL_NUMERICAL_FORECAST,
  INITIAL_LLM_EXPLANATION,
  INITIAL_CONSUMPTION,
  INITIAL_SURPLUS_LISTING,
  DEMO_ORGANIZATIONS,
  DEMO_HISTORY,
} from '@/lib/demoData';

// Local storage keys for resilient persistence
const STORAGE_KEYS = {
  FORECAST: 'foodflow_forecast',
  EXPLANATION: 'foodflow_explanation',
  CONSUMPTION: 'foodflow_consumption',
  SURPLUS_LISTING: 'foodflow_surplus_listing',
  ORGANIZATIONS: 'foodflow_organizations',
  HISTORY: 'foodflow_history',
  ACTIVE_FORECAST_ID: 'foodflow_active_forecast_id',
};

// Safe helper for localStorage
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[FOODFLOW Storage] Failed to read ${key}:`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[FOODFLOW Storage] Failed to write ${key}:`, e);
  }
}

export interface PersistentState {
  forecast: NumericalForecast;
  explanation: LLMExplanation;
  consumption: ConsumptionRecord;
  surplusListing: SurplusListing;
  organizations: RecoveryOrganization[];
  history: HistoryRecord[];
  activeForecastId: string;
  isSupabaseConnected: boolean;
}

// 1. Initial State Loader (Hydrates from Supabase or localStorage with Demo Fallback)
export async function loadInitialState(): Promise<PersistentState> {
  const localForecast = getLocal<NumericalForecast>(STORAGE_KEYS.FORECAST, INITIAL_NUMERICAL_FORECAST);
  const localExplanation = getLocal<LLMExplanation>(STORAGE_KEYS.EXPLANATION, INITIAL_LLM_EXPLANATION);
  const localConsumption = getLocal<ConsumptionRecord>(STORAGE_KEYS.CONSUMPTION, INITIAL_CONSUMPTION);
  const localListing = getLocal<SurplusListing>(STORAGE_KEYS.SURPLUS_LISTING, INITIAL_SURPLUS_LISTING);
  const localOrgs = getLocal<RecoveryOrganization[]>(STORAGE_KEYS.ORGANIZATIONS, DEMO_ORGANIZATIONS);
  const localHistory = getLocal<HistoryRecord[]>(STORAGE_KEYS.HISTORY, DEMO_HISTORY);
  const localActiveId = getLocal<string>(STORAGE_KEYS.ACTIVE_FORECAST_ID, 'fc-demo-01');

  let activeForecast = localForecast;
  let activeExplanation = localExplanation;
  let activeConsumption = localConsumption;
  let activeForecastId = localActiveId;
  let isConnected = false;

  // Try fetching from Supabase if configured
  if (supabase) {
    try {
      // 1. Fetch latest demand_forecast from Supabase
      const { data: dbForecast, error: fcError } = await supabase
        .from('demand_forecasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!fcError && dbForecast) {
        isConnected = true;
        activeForecast = {
          expectedDiners: dbForecast.expected_diners,
          predictedDiners: dbForecast.predicted_demand,
          historicalAverage: 756,
          predictedDemand: dbForecast.predicted_demand,
          recommendedPreparation: dbForecast.recommended_preparation,
          bufferServings: Math.max(1, dbForecast.recommended_preparation - dbForecast.predicted_demand),
          confidence: 'High',
          riskLevel: dbForecast.operational_risk || 'MEDIUM',
          engineVersion: 'v2.4-deterministic-engine',
          calculatedAt: new Date(dbForecast.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dishes: localForecast?.dishes || [],
          factors: {
            historicalPattern: `${dbForecast.service_meal || 'Lunch'} historical baseline: 756 meals`,
            attendanceTrend: 'Persisted shift record from Supabase',
            menuDemandFactor: `${dbForecast.menu_item || 'Rice + Dal + Chicken'} service`,
            dayOfWeekEffect: 'Shift curve applied',
          },
        };
        activeForecastId = dbForecast.id;
        if (dbForecast.ai_explanation) {
          activeExplanation = {
            ...activeExplanation,
            summary: dbForecast.ai_explanation,
          };
        }
      }

      // 2. Fetch latest daily_consumption from Supabase
      const { data: dbConsumption, error: consError } = await supabase
        .from('daily_consumption')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!consError && dbConsumption) {
        isConnected = true;
        activeConsumption = {
          date: new Date(dbConsumption.recorded_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' (Supabase)',
          predictedDemand: activeForecast.predictedDemand,
          mealsPrepared: dbConsumption.prepared_quantity,
          mealsServed: dbConsumption.served_quantity,
          remainingFood: dbConsumption.remaining_quantity,
          surplusDetected: dbConsumption.remaining_quantity,
          overproductionPercent: dbConsumption.prepared_quantity > 0 
            ? Number(((dbConsumption.remaining_quantity / dbConsumption.prepared_quantity) * 100).toFixed(1))
            : 0,
          mismatchLikelyFactors: INITIAL_CONSUMPTION.mismatchLikelyFactors,
          aiRecommendation: INITIAL_CONSUMPTION.aiRecommendation,
        };
      }

      // 3. Fetch recovery_orgs from Supabase
      const { data: orgsData, error: orgsError } = await supabase
        .from('recovery_orgs')
        .select('*')
        .limit(10);

      if (!orgsError && orgsData && orgsData.length > 0) {
        isConnected = true;
        interface DatabaseRecoveryOrgRow {
          id: string;
          org_name: string;
          verified_status: boolean;
          distance_km: number | string;
          max_capacity_meals: number;
          contact_phone?: string;
          accepted_food_types?: string[];
          availability?: string;
          latitude: number;
          longitude: number;
        }
        // Map database orgs to UI RecoveryOrganization type
        const mappedOrgs: RecoveryOrganization[] = (orgsData as unknown as DatabaseRecoveryOrgRow[]).map((d) => ({
          id: d.id,
          name: d.org_name,
          organizationType: 'NGO Food Relief',
          verified: d.verified_status,
          verifiedBadgeText: d.verified_status ? 'Verified Partner (Demo)' : 'Pending Verification',
          distanceKm: Number(d.distance_km),
          etaMinutes: Math.round(Number(d.distance_km) * 5),
          address: `${d.distance_km} km radial zone`,
          city: 'Hyderabad',
          acceptedFoodTypes: d.accepted_food_types || ['Cooked Hot Meals'],
          dailyIntakeCapacity: d.max_capacity_meals,
          currentAvailableCapacity: Math.round(d.max_capacity_meals * 0.4),
          foodCategoryNeeded: 'Cooked Hot Meals',
          status: 'Accepting',
          sourceType: 'Seeded Demo Partner',
          contactPerson: 'Operations Coordinator',
          phone: d.contact_phone || '+91 98100 00000',
          openHours: d.availability || 'Immediate',
          lat: d.latitude,
          lng: d.longitude,
        }));
        setLocal(STORAGE_KEYS.ORGANIZATIONS, mappedOrgs);
      }
    } catch {
      // PostgREST or network fallback
      isConnected = false;
    }
  }

  return {
    forecast: activeForecast,
    explanation: activeExplanation,
    consumption: activeConsumption,
    surplusListing: localListing,
    organizations: getLocal(STORAGE_KEYS.ORGANIZATIONS, localOrgs),
    history: localHistory,
    activeForecastId: activeForecastId,
    isSupabaseConnected: isConnected,
  };
}

// 2. Persist Demand Forecast
export async function persistDemandForecast(
  forecast: NumericalForecast,
  explanation: LLMExplanation,
  menu: string,
  meal: string = 'Lunch'
): Promise<{ success: boolean; forecastId: string }> {
  const generatedId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString().padStart(12, '0')}`;
  
  // Always update local persistent storage immediately
  setLocal(STORAGE_KEYS.FORECAST, forecast);
  setLocal(STORAGE_KEYS.EXPLANATION, explanation);
  setLocal(STORAGE_KEYS.ACTIVE_FORECAST_ID, generatedId);

  // Sync to history log
  const history = getLocal<HistoryRecord[]>(STORAGE_KEYS.HISTORY, DEMO_HISTORY);
  const newHistoryEntry: HistoryRecord = {
    date: 'Today',
    day: 'Wednesday',
    diners: forecast.expectedDiners,
    forecast: forecast.predictedDemand,
    prepared: forecast.recommendedPreparation,
    actualServed: 0,
    variance: 0,
    surplus: 0,
    recoveryStatus: 'None (Balanced)',
  };
  setLocal(STORAGE_KEYS.HISTORY, [newHistoryEntry, ...history.slice(0, 15)]);

  // Attempt Supabase insert
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('demand_forecasts')
        .insert({
          service_meal: meal,
          menu_item: menu,
          expected_diners: forecast.expectedDiners,
          predicted_demand: forecast.predictedDemand,
          recommended_preparation: forecast.recommendedPreparation,
          operational_risk: forecast.riskLevel,
          ai_explanation: explanation.summary,
        })
        .select('id')
        .single();

      if (!error && data?.id) {
        setLocal(STORAGE_KEYS.ACTIVE_FORECAST_ID, data.id);
        return { success: true, forecastId: data.id };
      }
    } catch (err) {
      console.warn('[FOODFLOW Supabase] Could not persist forecast to remote table, using local cache:', err);
    }
  }

  return { success: true, forecastId: generatedId };
}

// 3. Persist Daily Consumption
export async function persistConsumption(
  record: ConsumptionRecord
): Promise<{ success: boolean }> {
  // Always update local persistent storage
  setLocal(STORAGE_KEYS.CONSUMPTION, record);

  // Update surplus listing default quantity if surplus exists
  if (record.surplusDetected > 0) {
    const listing = getLocal<SurplusListing>(STORAGE_KEYS.SURPLUS_LISTING, INITIAL_SURPLUS_LISTING);
    const updatedListing: SurplusListing = {
      ...listing,
      servings: record.surplusDetected,
      status: 'listed',
      statusHistory: [
        { stage: 'listed', label: 'Surplus Listed', timestamp: 'Just now', completed: true },
        { stage: 'organization_viewed', label: 'Organization Viewed', timestamp: 'Pending', completed: false },
        { stage: 'accepted', label: 'Accepted by Partner', timestamp: 'Pending', completed: false },
        { stage: 'pickup_scheduled', label: 'Pickup Scheduled', timestamp: 'Pending', completed: false },
        { stage: 'collected', label: 'Collected & Transferred', timestamp: 'Pending', completed: false },
      ],
    };
    setLocal(STORAGE_KEYS.SURPLUS_LISTING, updatedListing);
  }

  // Update current history entry
  const history = getLocal<HistoryRecord[]>(STORAGE_KEYS.HISTORY, DEMO_HISTORY);
  if (history.length > 0) {
    const latest = { ...history[0] };
    latest.prepared = record.mealsPrepared;
    latest.actualServed = record.mealsServed;
    latest.variance = record.mealsServed - record.predictedDemand;
    latest.surplus = record.surplusDetected;
    if (record.surplusDetected > 0) {
      latest.recoveryStatus = 'Recovered';
    } else {
      latest.recoveryStatus = 'None (Balanced)';
    }
    setLocal(STORAGE_KEYS.HISTORY, [latest, ...history.slice(1)]);
  }

  // Attempt Supabase insert
  if (supabase) {
    try {
      const activeForecastId = getLocal<string>(STORAGE_KEYS.ACTIVE_FORECAST_ID, '');
      const validUuid = activeForecastId.includes('-') && activeForecastId.length === 36 ? activeForecastId : null;
      
      const balanceStatus = record.surplusDetected > 5 
        ? 'SURPLUS' 
        : record.mealsServed > record.mealsPrepared 
        ? 'SHORTAGE' 
        : 'BALANCED';

      await supabase
        .from('daily_consumption')
        .insert({
          forecast_id: validUuid,
          prepared_quantity: record.mealsPrepared,
          served_quantity: record.mealsServed,
          remaining_quantity: record.remainingFood,
          balance_status: balanceStatus,
        });
    } catch (err) {
      console.warn('[FOODFLOW Supabase] Could not persist consumption to remote table, using local cache:', err);
    }
  }

  return { success: true };
}

// 4. Persist Surplus Listing Creation
export async function persistSurplusListing(
  listing: Partial<SurplusListing>
): Promise<{ success: boolean; listing: SurplusListing }> {
  const current = getLocal<SurplusListing>(STORAGE_KEYS.SURPLUS_LISTING, INITIAL_SURPLUS_LISTING);
  const updated: SurplusListing = {
    ...current,
    ...listing,
    id: `SUR-${Date.now().toString().slice(-4)}`,
    status: 'listed',
    statusHistory: [
      { stage: 'listed', label: 'Surplus Listed', timestamp: 'Just now', completed: true },
      { stage: 'organization_viewed', label: 'Organization Viewed', timestamp: 'Pending', completed: false },
      { stage: 'accepted', label: 'Accepted by Partner', timestamp: 'Pending', completed: false },
      { stage: 'pickup_scheduled', label: 'Pickup Scheduled', timestamp: 'Pending', completed: false },
      { stage: 'collected', label: 'Collected & Transferred', timestamp: 'Pending', completed: false },
    ],
  };

  setLocal(STORAGE_KEYS.SURPLUS_LISTING, updated);

  // Attempt Supabase insert
  if (supabase) {
    try {
      await supabase
        .from('surplus_listings')
        .insert({
          food_description: updated.title,
          quantity_servings: updated.servings,
          expiry_time: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(),
          status: 'ACTIVE',
          pickup_location: updated.kitchenLocation,
        });
    } catch (err) {
      console.warn('[FOODFLOW Supabase] Listing saved to local store:', err);
    }
  }

  return { success: true, listing: updated };
}

// 5. Update Surplus Listing Stage (ACTIVE -> VIEWED -> ACCEPTED -> PICKUP_SCHEDULED -> COLLECTED)
export async function updateSurplusStage(
  stage: SurplusListingStatus,
  assignedOrgName?: string
): Promise<SurplusListing> {
  const listing = getLocal<SurplusListing>(STORAGE_KEYS.SURPLUS_LISTING, INITIAL_SURPLUS_LISTING);
  
  const stageOrder: SurplusListingStatus[] = [
    'listed',
    'organization_viewed',
    'accepted',
    'pickup_scheduled',
    'collected',
  ];

  const targetIndex = stageOrder.indexOf(stage);

  const updatedHistory = listing.statusHistory.map((item, idx) => {
    if (idx <= targetIndex) {
      return {
        ...item,
        completed: true,
        timestamp: item.completed && item.timestamp !== 'Pending' ? item.timestamp : 'Just now',
      };
    }
    return { ...item, completed: false, timestamp: 'Pending' };
  });

  const updatedListing: SurplusListing = {
    ...listing,
    status: stage,
    statusHistory: updatedHistory,
    assignedOrg: assignedOrgName || listing.assignedOrg,
  };

  setLocal(STORAGE_KEYS.SURPLUS_LISTING, updatedListing);

  // Update history record status if collected
  if (stage === 'collected') {
    const history = getLocal<HistoryRecord[]>(STORAGE_KEYS.HISTORY, DEMO_HISTORY);
    if (history.length > 0) {
      const updatedHistoryLog = [...history];
      updatedHistoryLog[0].recoveryStatus = 'Recovered';
      setLocal(STORAGE_KEYS.HISTORY, updatedHistoryLog);
    }
  }

  // Attempt Supabase update
  if (supabase) {
    try {
      const dbStatusMap: Record<SurplusListingStatus, string> = {
        listed: 'ACTIVE',
        organization_viewed: 'VIEWED',
        accepted: 'ACCEPTED',
        pickup_scheduled: 'PICKUP_SCHEDULED',
        collected: 'COLLECTED',
      };
      await supabase
        .from('surplus_listings')
        .update({ status: dbStatusMap[stage], updated_at: new Date().toISOString() })
        .match({ status: 'ACTIVE' });
    } catch (err) {
      console.warn('[FOODFLOW Supabase] Status updated locally:', err);
    }
  }

  return updatedListing;
}

// 6. Reset Demo State (Utility for judges/testers)
export function resetDemoState(): PersistentState {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEYS.FORECAST);
    window.localStorage.removeItem(STORAGE_KEYS.EXPLANATION);
    window.localStorage.removeItem(STORAGE_KEYS.CONSUMPTION);
    window.localStorage.removeItem(STORAGE_KEYS.SURPLUS_LISTING);
    window.localStorage.removeItem(STORAGE_KEYS.HISTORY);
    window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_FORECAST_ID);
  }
  return {
    forecast: INITIAL_NUMERICAL_FORECAST,
    explanation: INITIAL_LLM_EXPLANATION,
    consumption: INITIAL_CONSUMPTION,
    surplusListing: INITIAL_SURPLUS_LISTING,
    organizations: DEMO_ORGANIZATIONS,
    history: DEMO_HISTORY,
    activeForecastId: 'fc-demo-01',
    isSupabaseConnected: false,
  };
}
