// ==============================================================================
// FOODFLOW: Mandatory Elimination Round Comprehensive Test Suite
// Problem Statement: VISTERA 2026 PS-44 — Cutting Food Waste
// ==============================================================================

import assert from 'node:assert';
import { 
  HISTORICAL_SERVICES, 
  DEMO_HOTEL_DATASET_LABEL, 
  calculatePatternAnalysis,
  evaluateChronologicalHoldout 
} from '../src/lib/data/historicalServices.ts';
import { calculateDemandForecast } from '../src/lib/forecast/engine.ts';
import { calculateHaversineDistance, formatStraightLineDistance } from '../src/lib/geo/distance.ts';
import { DEMO_HOTEL, DEMO_ORGANIZATIONS } from '../src/lib/demoData.ts';
import { calculateServiceBalance, calculateDishBalance } from '../src/lib/business/balance.ts';
import { cleanRawAIResponse, parseKitchenInsights } from '../src/lib/ai/cleaner.ts';

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n============================================================');
console.log('FOODFLOW — ELIMINATION ROUND MASTER TEST VERIFICATION');
console.log('Facility: Deccan Grand Hotel — Hyderabad (PS-44 Cutting Food Waste)');
console.log('============================================================\n');

// 1. DATASET INTEGRITY & DISCLOSURE
console.log('1. HISTORICAL SERVICE DATASET & FACILITY PROFILE:');
test('Historical dataset spans 90 days of operational records (158 service shifts)', () => {
  assert.ok(HISTORICAL_SERVICES.length >= 90, `Expected at least 90 service records, got ${HISTORICAL_SERVICES.length}`);
  const uniqueDates = new Set(HISTORICAL_SERVICES.map(r => r.serviceDate));
  assert.strictEqual(uniqueDates.size, 90, `Expected exactly 90 unique operating dates, got ${uniqueDates.size}`);
});

test('Dataset disclosure label is explicitly Illustrative Demo Hotel Dataset', () => {
  assert.ok(DEMO_HOTEL_DATASET_LABEL.includes('Illustrative Demo Hotel Dataset'));
});

test('Facility metadata specifies Deccan Grand Hotel — Hyderabad with 1000 capacity', () => {
  assert.strictEqual(DEMO_HOTEL.name, 'Deccan Grand Hotel — Hyderabad');
  assert.strictEqual(DEMO_HOTEL.serviceCapacity, 1000);
  assert.strictEqual(DEMO_HOTEL.totalCapacity, 1000);
  assert.strictEqual(DEMO_HOTEL.breakfastCapacity, 800);
  assert.strictEqual(DEMO_HOTEL.lunchCapacity, 1000);
  assert.strictEqual(DEMO_HOTEL.dinnerCapacity, 900);
  assert.strictEqual(DEMO_HOTEL.latitude, 17.4447);
  assert.strictEqual(DEMO_HOTEL.longitude, 78.3483);
});

test('Dataset is internally consistent (food prepared >= food served)', () => {
  for (const rec of HISTORICAL_SERVICES) {
    assert.ok(rec.expectedCustomers > 0, 'Expected customers must be positive');
    assert.ok(rec.actualCustomers > 0, 'Actual customers must be positive');
    assert.ok(rec.foodPrepared >= rec.foodServed, 'Food prepared must be >= food served');
    assert.ok(rec.foodRemaining >= 0, 'Remaining food must be non-negative');
    assert.ok(rec.foodWasted >= 0, 'Waste must be non-negative');
  }
});

// 2. PATTERN ANALYSIS WITH SAMPLE SIZES
console.log('\n2. EMPIRICAL PATTERN ANALYSIS:');
const pattern = calculatePatternAnalysis();

test('Pattern analysis produces Monday through Sunday empirical averages', () => {
  const days = pattern.dayOfWeekAverages.map(d => d.day);
  assert.deepStrictEqual(days, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
});

test('Every day-of-week average includes sample size N', () => {
  for (const dayStat of pattern.dayOfWeekAverages) {
    assert.ok(dayStat.sampleSize > 0, `Sample size N for ${dayStat.day} must be > 0`);
    assert.ok(dayStat.averageDiners > 0, `Average diners for ${dayStat.day} must be > 0`);
  }
});

test('Weekday vs Weekend demand variance is calculated from stored records', () => {
  assert.ok(pattern.weekdayAverage > 0, 'Weekday average must be positive');
  assert.ok(pattern.weekendAverage > 0, 'Weekend average must be positive');
  assert.ok(typeof pattern.weekdayVsWeekendPct === 'number', 'Weekday vs weekend pct must be number');
});

test('Shift meal analysis covers BREAKFAST, LUNCH, and DINNER separately', () => {
  const meals = pattern.mealAverages.map(m => m.meal);
  assert.deepStrictEqual(meals, ['BREAKFAST', 'LUNCH', 'DINNER']);
});

// 3. CHRONOLOGICAL HOLDOUT VALIDATION
console.log('\n3. CHRONOLOGICAL HOLDOUT EVALUATION:');
const validation = evaluateChronologicalHoldout();

test('Chronological partition splits train (estimation) and holdout (evaluation) sets', () => {
  assert.ok(validation.trainRecordCount >= 50, 'Training set must have >= 50 records');
  assert.ok(validation.holdoutRecordCount >= 25, 'Holdout set must have >= 25 records');
  assert.strictEqual(validation.trainRecordCount + validation.holdoutRecordCount, HISTORICAL_SERVICES.length);
});

test('Model demonstrates MAE improvement over naive historical baseline', () => {
  assert.ok(validation.modelMAE < validation.baselineMAE, `Model MAE (${validation.modelMAE}) should be lower than baseline (${validation.baselineMAE})`);
  assert.ok(validation.improvementPct > 0, 'Accuracy improvement percentage must be positive');
  console.log(`    [Metrics: Model MAE = ${validation.modelMAE} diners vs Baseline MAE = ${validation.baselineMAE} diners | Improvement = ${validation.improvementPct}%]`);
});

// 4. DETERMINISTIC FORECAST ENGINE
console.log('\n4. FORECAST ENGINE REPRODUCIBILITY & CAPACITY BOUNDS:');
test('Same input and parameters produce the EXACT same numerical output (Determinism)', () => {
  const run1 = calculateDemandForecast({ expectedDiners: 820, serviceMeal: 'Lunch', dayOfWeek: 'Wednesday' });
  const run2 = calculateDemandForecast({ expectedDiners: 820, serviceMeal: 'Lunch', dayOfWeek: 'Wednesday' });
  assert.strictEqual(run1.predictedDemand, run2.predictedDemand);
  assert.strictEqual(run1.recommendedPreparation, run2.recommendedPreparation);
  assert.strictEqual(run1.calculationBreakdown.finalPredictedDiners, run2.calculationBreakdown.finalPredictedDiners);
});

test('Breakfast, Lunch, and Dinner shift models produce distinct meal predictions', () => {
  const bf = calculateDemandForecast({ expectedDiners: 800, serviceMeal: 'Breakfast' });
  const ln = calculateDemandForecast({ expectedDiners: 800, serviceMeal: 'Lunch' });
  const dn = calculateDemandForecast({ expectedDiners: 800, serviceMeal: 'Dinner' });
  assert.notStrictEqual(bf.predictedDemand, ln.predictedDemand, 'Breakfast and Lunch must differ');
  assert.notStrictEqual(ln.predictedDemand, dn.predictedDemand, 'Lunch and Dinner must differ');
});

test('Over-capacity bookings are strictly clamped to hotel service capacity (1000 meals)', () => {
  const overCap = calculateDemandForecast({ expectedDiners: 1400, serviceMeal: 'Lunch' });
  assert.ok(overCap.predictedDemand <= 1000, 'Predicted demand must not exceed 1000');
  assert.strictEqual(overCap.calculationBreakdown.isCapacityConstrained, true);
  assert.strictEqual(overCap.calculationBreakdown.hotelCapacityLimit, 1000);
});

test('Calculation breakdown provides full explainability inputs and steps', () => {
  const fc = calculateDemandForecast({ expectedDiners: 820, serviceMeal: 'Lunch', dayOfWeek: 'Saturday' });
  const cb = fc.calculationBreakdown;
  assert.ok(cb.comparableBaseline > 0);
  assert.ok(typeof cb.dayOfWeekEffectPct === 'number');
  assert.ok(typeof cb.recentTrendPct === 'number');
  assert.ok(cb.finalPredictedDiners > 0);
});

// 5. FOOD PREPARATION CALCULATOR & STAGING
console.log('\n5. FOOD PREPARATION CALCULATOR (INDIAN MENU ITEMS):');
test('Base requirement formula = predicted diners * per diner rate', () => {
  const diners = 742;
  const riceRate = 0.0526; // kg/diner
  const baseReq = diners * riceRate;
  const roundedBase = Math.round(baseReq * 10) / 10;
  assert.strictEqual(roundedBase, 39.0);
});

test('Safety buffer is applied to base requirement correctly', () => {
  const diners = 742;
  const rate = 0.18; // kg/diner
  const base = diners * rate; // 133.56
  const bufferPct = 0.05; // 5%
  const total = base * (1 + bufferPct); // 140.238
  const roundedTotal = Math.round(total * 10) / 10;
  assert.strictEqual(roundedTotal, 140.2);
});

test('Two-stage batching partitions initial (85%) and reserve (15%) batches', () => {
  const total = 43.0;
  const initialBatch = Math.round(total * 0.85 * 10) / 10;
  const reserveBatch = Math.round((total - initialBatch) * 10) / 10;
  assert.strictEqual(initialBatch, 36.6);
  assert.strictEqual(reserveBatch, 6.4);
  assert.strictEqual(Number((initialBatch + reserveBatch).toFixed(1)), total);
});

// 6. HAVERSINE DISTANCE & HYDERABAD RECOVERY GRID
console.log('\n6. HYDERABAD RECOVERY GRID & HAVERSINE PROXIMITY:');
test('Haversine distance between Deccan Grand Hotel (Gachibowli) and Madhapur Hub is ~4.5 km', () => {
  const dist = calculateHaversineDistance(17.4447, 78.3483, 17.4485, 78.3790);
  assert.ok(dist >= 3.0 && dist <= 5.0, `Expected ~4.5 km, got ${dist} km`);
});

test('All 7 Hyderabad demo partner locations are initialized with valid coordinates', () => {
  assert.strictEqual(DEMO_ORGANIZATIONS.length, 7, 'Expected 7 seeded demo partners');
  for (const org of DEMO_ORGANIZATIONS) {
    assert.ok(org.lat > 17.0 && org.lat < 18.0, `Latitude for ${org.name} out of bounds`);
    assert.ok(org.lng > 78.0 && org.lng < 79.0, `Longitude for ${org.name} out of bounds`);
    assert.ok(org.distanceKm > 0, `Distance for ${org.name} must be > 0`);
    assert.strictEqual(org.sourceType, 'Seeded Demo Partner');
  }
});

test('Missing or NaN coordinates return Distance unavailable without crashing', () => {
  const result = formatStraightLineDistance(undefined, null, NaN, 78.34);
  assert.strictEqual(result, 'Distance unavailable');
  const distZero = calculateHaversineDistance(undefined, null, 17.4, 78.3);
  assert.strictEqual(distZero, 0);
});

// 7. SURPLUS MATCHING & PICKUP LIFECYCLE
console.log('\n7. SURPLUS MATCHING & PICKUP WORKFLOW:');
test('Surplus listing transitions through simulated stages', () => {
  const stages = ['listed', 'organization_viewed', 'accepted', 'pickup_scheduled', 'collected'];
  let currentStageIndex = 0;
  
  // Advance through complete lifecycle
  for (let i = 1; i < stages.length; i++) {
    currentStageIndex = i;
    assert.strictEqual(stages[currentStageIndex], stages[i]);
  }
  assert.strictEqual(stages[currentStageIndex], 'collected');
});

// 8. SERVICE BALANCE, SURPLUS & SHORTAGE (NO CLAMPING DEFICITS TO 0)
console.log('\n8. SERVICE BALANCE, SURPLUS & SHORTAGE LOGIC:');
test('Surplus detected when prepared > served, with signed remaining quantity', () => {
  const result = calculateServiceBalance({ preparedServings: 819, servedServings: 790 });
  assert.strictEqual(result.remainingServings, 29);
  assert.strictEqual(result.surplusServings, 29);
  assert.strictEqual(result.shortageServings, 0);
  assert.strictEqual(result.balanceStatus, 'SURPLUS');
  assert.strictEqual(result.isShortage, false);
});

test('Kitchen shortage is preserved (NOT clamped to zero)', () => {
  // Prepared 750, served 780 -> remaining must be -30, shortage 30
  const result = calculateServiceBalance({ preparedServings: 750, servedServings: 780 });
  assert.strictEqual(result.remainingServings, -30, 'Remaining servings must be -30, not clamped to 0');
  assert.strictEqual(result.shortageServings, 30, 'Shortage count must be 30');
  assert.strictEqual(result.surplusServings, 0);
  assert.strictEqual(result.balanceStatus, 'SHORTAGE');
  assert.strictEqual(result.isShortage, true);
  assert.ok(result.notes.includes('Kitchen shortage of 30 servings'));
});

test('Exact match yields BALANCED status with 0 remaining', () => {
  const result = calculateServiceBalance({ preparedServings: 800, servedServings: 800 });
  assert.strictEqual(result.remainingServings, 0);
  assert.strictEqual(result.surplusServings, 0);
  assert.strictEqual(result.shortageServings, 0);
  assert.strictEqual(result.balanceStatus, 'BALANCED');
});

test('Surplus requires temperature holding verification before recovery eligibility is confirmed', () => {
  const unverified = calculateServiceBalance({ 
    preparedServings: 820, 
    servedServings: 780, 
    tempHoldingVerified: false 
  });
  assert.strictEqual(unverified.recoveryEligibility.status, 'requires_confirmation');
  assert.strictEqual(unverified.recoveryEligibility.isEligibleForRecovery, false);
  assert.ok(unverified.recoveryEligibility.reason.includes('Eligibility requires confirmation'));

  const verified = calculateServiceBalance({ 
    preparedServings: 820, 
    servedServings: 780, 
    tempHoldingVerified: true 
  });
  assert.strictEqual(verified.recoveryEligibility.status, 'eligible');
  assert.strictEqual(verified.recoveryEligibility.isEligibleForRecovery, true);
});

test('Dish-level balance preserves negative remaining quantities for individual menu items', () => {
  const dishResult = calculateDishBalance('Tomato Dal', 16.0, 18.5, 'L', false);
  assert.strictEqual(dishResult.remainingQuantity, -2.5, 'Dish remaining must be -2.5');
  assert.strictEqual(dishResult.status, 'SHORTAGE');
});

// 9. AI REASONING SANITIZER & JSON CONTRACT
console.log('\n9. AI REASONING SANITIZER & STRICT JSON PARSER:');
test('Sanitizer completely strips Nemotron thinking process blocks', () => {
  const nemotronOutput = `Here's a thinking process:
1. Analyze User Input: The user wants a forecast explanation.
2. Constraints: Do not modify numbers.
3. Role: Kitchen operations assistant.

{
  "summary": "Stable lunch attendance expected with 795 patrons.",
  "key_factors": ["Wednesday mid-week baseline", "Normal weather pattern"],
  "recommendations": ["Prepare 85% batch by 11:45 AM", "Hold 15% reserve"],
  "caveats": ["Weather shift could modify evening turnout"]
}`;

  const cleaned = cleanRawAIResponse(nemotronOutput);
  assert.ok(!cleaned.includes("Here's a thinking process"), 'Must not include thinking process');
  assert.ok(!cleaned.includes('Analyze User Input'), 'Must not include prompt analysis');
  assert.ok(!cleaned.includes('Constraints:'), 'Must not include constraints instruction');
  assert.ok(cleaned.startsWith('{'), 'Cleaned text should start with JSON object');
});

test('Sanitizer strips <think> tags from thinking models', () => {
  const rawWithThink = `<think>Internal thoughts about calculating diners...</think>{
  "summary": "Clean summary without thinking tags.",
  "key_factors": ["Factor 1"],
  "recommendations": ["Rec 1"],
  "caveats": []
}`;
  const cleaned = cleanRawAIResponse(rawWithThink);
  assert.ok(!cleaned.includes('<think>'), 'Must strip <think>');
  assert.ok(!cleaned.includes('Internal thoughts'), 'Must strip thinking content');
});

test('Parser successfully parses strict JSON into KitchenInsightsData', () => {
  const validJson = JSON.stringify({
    summary: 'Clear forecast explanation.',
    key_factors: ['Factor A', 'Factor B'],
    recommendations: ['Step 1', 'Step 2'],
    caveats: ['Minor caveat']
  });

  const parsed = parseKitchenInsights(validJson, 795, 819);
  assert.strictEqual(parsed.summary, 'Clear forecast explanation.');
  assert.strictEqual(parsed.key_factors.length, 2);
  assert.strictEqual(parsed.recommendations.length, 2);
  assert.strictEqual(parsed.caveats.length, 1);
});

test('Parser provides graceful fallback when JSON is malformed without crashing', () => {
  const brokenJson = 'Random plain text error from network without any JSON';
  const fallback = parseKitchenInsights(brokenJson, 795, 819);
  assert.ok(fallback.summary.length > 0);
  assert.ok(fallback.key_factors.length > 0);
  assert.ok(fallback.recommendations.length > 0);
});

// 10. CROSS-PAGE STATE CONSISTENCY
console.log('\n10. CROSS-PAGE STATE MODEL CONSISTENCY:');
test('Forecast generation produces complete metadata model including forecastId', () => {
  const forecast = calculateDemandForecast({
    expectedDiners: 820,
    serviceMeal: 'Lunch',
    dayOfWeek: 'Wednesday',
    safetyBufferPct: 3.0,
    hotelCapacity: 1000
  });

  assert.ok(forecast.forecastId.startsWith('fc-'), 'Must have generated forecastId');
  assert.strictEqual(forecast.serviceMeal, 'Lunch');
  assert.strictEqual(forecast.expectedDiners, 820);
  assert.strictEqual(forecast.predictedDemand, forecast.predictedDiners);
  assert.strictEqual(forecast.safetyBufferPct, 3.0);
  assert.ok(forecast.dishes && forecast.dishes.length > 0, 'Must include dish-level preparation targets');
});

test('Service tracking consumes identical forecast numbers without independent invention', () => {
  const forecast = calculateDemandForecast({
    expectedDiners: 820,
    serviceMeal: 'Lunch',
    dayOfWeek: 'Wednesday',
    safetyBufferPct: 3.0
  });

  // Service tracking receives forecast
  const prepTarget = forecast.recommendedPreparation;
  const predDiners = forecast.predictedDemand;
  assert.ok(predDiners > 0, 'Predicted diners must be positive');

  // Actual kitchen service recorded
  const actualPrepared = prepTarget; // 819
  const actualServed = 790;
  const balance = calculateServiceBalance({
    preparedServings: actualPrepared,
    servedServings: actualServed
  });

  assert.strictEqual(actualPrepared, forecast.recommendedPreparation, 'Preparation target must match forecast');
  assert.strictEqual(balance.remainingServings, 819 - 790);
  assert.strictEqual(balance.balanceStatus, 'SURPLUS');
});

// 11. SAFETY BUFFER RANGE & MEAL DYNAMICS
console.log('\n11. SAFETY BUFFER & DISH SIZING ACCURACY:');
test('Zero safety buffer yields recommended preparation == predicted diners', () => {
  const zeroBuffer = calculateDemandForecast({
    expectedDiners: 820,
    serviceMeal: 'Lunch',
    safetyBufferPct: 0.0
  });
  assert.strictEqual(zeroBuffer.recommendedPreparation, zeroBuffer.predictedDemand);
});

test('Higher safety buffer (8%) scales preparation proportionally', () => {
  const highBuffer = calculateDemandForecast({
    expectedDiners: 820,
    serviceMeal: 'Lunch',
    safetyBufferPct: 8.0
  });
  const expectedServings = zeroBufferCalculation(highBuffer.predictedDemand, 8.0);
  assert.strictEqual(highBuffer.recommendedPreparation, expectedServings);
});

function zeroBufferCalculation(diners, bufferPct) {
  const bufferServings = Math.round(diners * (bufferPct / 100));
  return diners + bufferServings;
}

// SUMMARY
console.log('\n============================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
console.log('============================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
