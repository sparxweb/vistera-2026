/**
 * FOODFLOW: Smart Waste Insights & Prevention Alerts Engine
 * Problem Statement: VISTERA 2026 PS-44 — Cutting Food Waste
 * Facility Target: Deccan Grand Hotel — Hyderabad (1,000 Capacity Institutional Dining)
 *
 * Deterministic mathematical pattern evaluator identifying recurring surplus,
 * shortages, and consumption rate adjustments from genuine saved operational records.
 * Strictly separates empirical metrics from generative hallucinations.
 */

import { HistoricalServiceRecord, HistoricalDishRecord } from '@/lib/data/historicalServices';

export interface DishWastePattern {
  dishName: string;
  category: string;
  unit: string;
  shiftsAnalyzed: number;
  totalPrepared: number;
  totalServed: number;
  totalSurplus: number;
  totalWaste: number;
  avgPreparedPerShift: number;
  avgServedPerShift: number;
  avgSurplusPerShift: number;
  surplusRatePct: number; // (totalSurplus / totalPrepared) * 100
  surplusFrequencyPct: number; // % of shifts with surplus > 0.3 unit
  shortageFrequencyPct: number; // % of shifts where served >= prepared or deficit
  trend: 'STABLE' | 'DECREASING' | 'INCREASING';
  recommendedPerDinerAdjustment?: {
    currentRate: number;
    suggestedRate: number;
    potentialSavingsKgPer100Diners: number;
    reason: string;
    action: string;
  };
}

export interface WasteAlertItem {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  dishName?: string;
  mealType?: string;
  metric: string;
  reason: string;
  action: string;
}

export interface SmartWasteInsightsOutput {
  insufficientData: boolean;
  minRecordsRequired: number;
  recordsAnalyzed: number;
  dateRangeCovered?: string;
  totalRecordedPrepared: number;
  totalRecordedServed: number;
  totalRecordedSurplus: number;
  totalRecordedWaste: number;
  overallSurplusRatePct: number;
  topSurplusDishes: DishWastePattern[];
  highestSurplusMeal: { meal: string; surplusKg: number; ratePct: number } | null;
  highestSurplusDay: { day: string; surplusKg: number; ratePct: number } | null;
  historicalTrend: {
    earlierWindowAvgSurplus: number;
    recentWindowAvgSurplus: number;
    changePct: number;
    status: 'IMPROVING' | 'WORSENING' | 'STABLE';
    description: string;
  } | null;
  activeAlerts: WasteAlertItem[];
  dishPatterns: DishWastePattern[];
  explanation: string;
}

/**
 * Evaluates operational records to detect recurring waste patterns and generate actionable prevention alerts.
 * Minimum of 3 records required to avoid statistical bias or fabricated assumptions.
 */
export function calculateSmartWasteInsights(
  records: HistoricalServiceRecord[] = []
): SmartWasteInsightsOutput {
  const MIN_RECORDS = 3;

  if (!records || records.length < MIN_RECORDS) {
    return {
      insufficientData: true,
      minRecordsRequired: MIN_RECORDS,
      recordsAnalyzed: records?.length || 0,
      totalRecordedPrepared: 0,
      totalRecordedServed: 0,
      totalRecordedSurplus: 0,
      totalRecordedWaste: 0,
      overallSurplusRatePct: 0,
      topSurplusDishes: [],
      highestSurplusMeal: null,
      highestSurplusDay: null,
      historicalTrend: null,
      activeAlerts: [],
      dishPatterns: [],
      explanation: `Insufficient operational records (${records?.length || 0} / ${MIN_RECORDS} minimum). At least 3 recorded service shifts are required to identify recurring consumption patterns without statistical fabrication.`,
    };
  }

  // 1. Shift-Level Totals
  let totalPrepared = 0;
  let totalServed = 0;
  let totalSurplus = 0;
  let totalWaste = 0;

  const mealMap: Record<string, { prepared: number; served: number; surplus: number; count: number }> = {};
  const dayMap: Record<string, { prepared: number; served: number; surplus: number; count: number }> = {};
  const dishMap: Record<string, {
    dishName: string;
    category: string;
    unit: string;
    shiftsAnalyzed: number;
    totalPrepared: number;
    totalServed: number;
    totalSurplus: number;
    totalWaste: number;
    surplusShifts: number;
    shortageShifts: number;
    perDinerRates: number[];
  }> = {};

  records.forEach((rec) => {
    const p = Math.max(0, Number(rec.foodPrepared) || 0);
    const s = Math.max(0, Number(rec.foodServed) || 0);
    const rem = Math.max(0, Number(rec.foodRemaining) || (p - s));
    const w = Math.max(0, Number(rec.foodWasted) || 0);

    totalPrepared += p;
    totalServed += s;
    totalSurplus += rem;
    totalWaste += w;

    // Meal Aggregation
    const meal = rec.mealType || (rec.serviceType ? String(rec.serviceType) : 'Lunch');
    if (!mealMap[meal]) {
      mealMap[meal] = { prepared: 0, served: 0, surplus: 0, count: 0 };
    }
    mealMap[meal].prepared += p;
    mealMap[meal].served += s;
    mealMap[meal].surplus += rem;
    mealMap[meal].count += 1;

    // Day of Week Aggregation
    const day = rec.dayOfWeek || 'Unknown';
    if (!dayMap[day]) {
      dayMap[day] = { prepared: 0, served: 0, surplus: 0, count: 0 };
    }
    dayMap[day].prepared += p;
    dayMap[day].served += s;
    dayMap[day].surplus += rem;
    dayMap[day].count += 1;

    // Dish-Level Aggregation
    if (Array.isArray(rec.dishes) && rec.dishes.length > 0) {
      rec.dishes.forEach((d: HistoricalDishRecord) => {
        const dName = d.dishName || 'Standard Item';
        const dPrep = Math.max(0, Number(d.preparedQuantity) || 0);
        const dServ = Math.max(0, Number(d.servedQuantity) || 0);
        const dLeft = Math.max(0, Number(d.leftoverQuantity) || (dPrep - dServ));
        const dW = Math.max(0, Number(d.wasteQuantity) || 0);
        const dUnit = d.unit || 'kg';
        const dCat = d.category || 'General';

        if (!dishMap[dName]) {
          dishMap[dName] = {
            dishName: dName,
            category: dCat,
            unit: dUnit,
            shiftsAnalyzed: 0,
            totalPrepared: 0,
            totalServed: 0,
            totalSurplus: 0,
            totalWaste: 0,
            surplusShifts: 0,
            shortageShifts: 0,
            perDinerRates: [],
          };
        }

        const entry = dishMap[dName];
        entry.shiftsAnalyzed += 1;
        entry.totalPrepared += dPrep;
        entry.totalServed += dServ;
        entry.totalSurplus += dLeft;
        entry.totalWaste += dW;
        if (dLeft > 0.25) entry.surplusShifts += 1;
        if (dPrep <= dServ || dLeft <= 0) entry.shortageShifts += 1;
        if (d.perDinerRate && d.perDinerRate > 0) {
          entry.perDinerRates.push(d.perDinerRate);
        }
      });
    }
  });

  const overallSurplusRatePct = totalPrepared > 0
    ? Number(((totalSurplus / totalPrepared) * 100).toFixed(2))
    : 0;

  // 2. Compute Dish-Level Patterns & Tuning Recommendations
  const dishPatterns: DishWastePattern[] = Object.values(dishMap).map((d) => {
    const avgPrep = Number((d.totalPrepared / (d.shiftsAnalyzed || 1)).toFixed(2));
    const avgServ = Number((d.totalServed / (d.shiftsAnalyzed || 1)).toFixed(2));
    const avgSurplus = Number((d.totalSurplus / (d.shiftsAnalyzed || 1)).toFixed(2));
    const surplusRatePct = d.totalPrepared > 0
      ? Number(((d.totalSurplus / d.totalPrepared) * 100).toFixed(1))
      : 0;
    const surplusFrequencyPct = Number(((d.surplusShifts / (d.shiftsAnalyzed || 1)) * 100).toFixed(1));
    const shortageFrequencyPct = Number(((d.shortageShifts / (d.shiftsAnalyzed || 1)) * 100).toFixed(1));

    // Per-Diner Rate Adjustment Recommendation
    let recommendedPerDinerAdjustment: DishWastePattern['recommendedPerDinerAdjustment'] = undefined;
    const avgCurrentRate = d.perDinerRates.length > 0
      ? d.perDinerRates.reduce((a, b) => a + b, 0) / d.perDinerRates.length
      : (avgServ / 800);

    // If consistent surplus > 2.0% across 5+ shifts, calculate genuine consumed rate
    if (surplusRatePct >= 2.0 && d.shiftsAnalyzed >= 5 && avgCurrentRate > 0) {
      const consumptionEfficiency = d.totalServed / (d.totalPrepared || 1);
      const suggestedRate = Number((avgCurrentRate * consumptionEfficiency).toFixed(4));
      const diffPerDiner = avgCurrentRate - suggestedRate;
      const potentialSavingsKgPer100Diners = Number((diffPerDiner * 100).toFixed(2));

      recommendedPerDinerAdjustment = {
        currentRate: Number(avgCurrentRate.toFixed(4)),
        suggestedRate,
        potentialSavingsKgPer100Diners,
        reason: `Recorded recurring surplus of ${avgSurplus.toFixed(1)} ${d.unit}/shift (${surplusRatePct}% surplus rate across ${d.shiftsAnalyzed} shifts) shows preparation index exceeds true guest consumption.`,
        action: `Tune per-diner prep rate from ${avgCurrentRate.toFixed(4)} to ${suggestedRate.toFixed(4)} ${d.unit}, saving ~${potentialSavingsKgPer100Diners} ${d.unit} per 100 diners.`,
      };
    }

    return {
      dishName: d.dishName,
      category: d.category,
      unit: d.unit,
      shiftsAnalyzed: d.shiftsAnalyzed,
      totalPrepared: Number(d.totalPrepared.toFixed(1)),
      totalServed: Number(d.totalServed.toFixed(1)),
      totalSurplus: Number(d.totalSurplus.toFixed(1)),
      totalWaste: Number(d.totalWaste.toFixed(1)),
      avgPreparedPerShift: avgPrep,
      avgServedPerShift: avgServ,
      avgSurplusPerShift: avgSurplus,
      surplusRatePct,
      surplusFrequencyPct,
      shortageFrequencyPct,
      trend: (surplusRatePct > 3.5 ? 'INCREASING' : surplusRatePct < 1.0 ? 'DECREASING' : 'STABLE') as 'STABLE' | 'DECREASING' | 'INCREASING',
      recommendedPerDinerAdjustment,
    };
  }).sort((a, b) => b.totalSurplus - a.totalSurplus);

  // 3. Highest Surplus Meal & Day
  let highestSurplusMeal: { meal: string; surplusKg: number; ratePct: number } | null = null;
  let maxMealSurplus = -1;
  for (const [meal, data] of Object.entries(mealMap)) {
    if (data.surplus > maxMealSurplus) {
      maxMealSurplus = data.surplus;
      highestSurplusMeal = {
        meal,
        surplusKg: Number(data.surplus.toFixed(1)),
        ratePct: data.prepared > 0 ? Number(((data.surplus / data.prepared) * 100).toFixed(1)) : 0,
      };
    }
  }

  let highestSurplusDay: { day: string; surplusKg: number; ratePct: number } | null = null;
  let maxDaySurplus = -1;
  for (const [day, data] of Object.entries(dayMap)) {
    if (data.surplus > maxDaySurplus) {
      maxDaySurplus = data.surplus;
      highestSurplusDay = {
        day,
        surplusKg: Number(data.surplus.toFixed(1)),
        ratePct: data.prepared > 0 ? Number(((data.surplus / data.prepared) * 100).toFixed(1)) : 0,
      };
    }
  }

  // 4. Chronological Trend (Earlier Half vs Recent Half)
  let historicalTrend: SmartWasteInsightsOutput['historicalTrend'] = null;
  if (records.length >= 6) {
    const half = Math.floor(records.length / 2);
    const earlierSlice = records.slice(0, half);
    const recentSlice = records.slice(half);

    const earlierSurplusSum = earlierSlice.reduce((sum, r) => sum + (r.foodRemaining || Math.max(0, r.foodPrepared - r.foodServed)), 0);
    const recentSurplusSum = recentSlice.reduce((sum, r) => sum + (r.foodRemaining || Math.max(0, r.foodPrepared - r.foodServed)), 0);

    const earlierAvg = earlierSurplusSum / (earlierSlice.length || 1);
    const recentAvg = recentSurplusSum / (recentSlice.length || 1);

    const changePct = earlierAvg > 0
      ? Number((((recentAvg - earlierAvg) / earlierAvg) * 100).toFixed(1))
      : 0;

    const status = changePct <= -3.0 ? 'IMPROVING' : changePct >= 3.0 ? 'WORSENING' : 'STABLE';
    const description = status === 'IMPROVING'
      ? `Average surplus decreased by ${Math.abs(changePct)}% from earlier window (${earlierAvg.toFixed(1)} kg/shift) to recent window (${recentAvg.toFixed(1)} kg/shift).`
      : status === 'WORSENING'
      ? `Average surplus increased by ${changePct}% from earlier window (${earlierAvg.toFixed(1)} kg/shift) to recent window (${recentAvg.toFixed(1)} kg/shift).`
      : `Surplus volume is stable across operating windows (${recentAvg.toFixed(1)} kg/shift recent vs ${earlierAvg.toFixed(1)} kg/shift baseline).`;

    historicalTrend = {
      earlierWindowAvgSurplus: Number(earlierAvg.toFixed(1)),
      recentWindowAvgSurplus: Number(recentAvg.toFixed(1)),
      changePct,
      status,
      description,
    };
  }

  // 5. Active Prevention Alerts
  const activeAlerts: WasteAlertItem[] = [];

  // Alert for top surplus dish
  const topSurplusDish = dishPatterns[0];
  if (topSurplusDish && topSurplusDish.surplusRatePct >= 2.0) {
    activeAlerts.push({
      id: `ALERT-SURPLUS-${topSurplusDish.dishName.replace(/\s+/g, '-').toUpperCase()}`,
      severity: topSurplusDish.surplusRatePct >= 3.0 ? 'HIGH' : 'MEDIUM',
      title: `Chronic Surplus Pattern: ${topSurplusDish.dishName}`,
      dishName: topSurplusDish.dishName,
      metric: `${topSurplusDish.avgSurplusPerShift} ${topSurplusDish.unit}/shift average surplus (${topSurplusDish.surplusRatePct}%)`,
      reason: `Recorded in ${topSurplusDish.surplusFrequencyPct}% of ${topSurplusDish.shiftsAnalyzed} service shifts. Total excess over period: ${topSurplusDish.totalSurplus.toFixed(1)} ${topSurplusDish.unit}.`,
      action: topSurplusDish.recommendedPerDinerAdjustment?.action || `Stage 80% of total requirement in initial morning prep; hold 20% in reserve buffer until turnstile peak is observed.`,
    });
  }

  // Alert for second surplus dish if distinct
  const secondSurplusDish = dishPatterns[1];
  if (secondSurplusDish && secondSurplusDish.surplusRatePct >= 2.0 && secondSurplusDish.dishName !== topSurplusDish?.dishName) {
    activeAlerts.push({
      id: `ALERT-SURPLUS-${secondSurplusDish.dishName.replace(/\s+/g, '-').toUpperCase()}`,
      severity: 'MEDIUM',
      title: `Surplus Frequency Alert: ${secondSurplusDish.dishName}`,
      dishName: secondSurplusDish.dishName,
      metric: `${secondSurplusDish.avgSurplusPerShift} ${secondSurplusDish.unit}/shift (${secondSurplusDish.surplusRatePct}%)`,
      reason: `Surplus detected in ${secondSurplusDish.surplusFrequencyPct}% of shifts. Cumulative remaining food: ${secondSurplusDish.totalSurplus.toFixed(1)} ${secondSurplusDish.unit}.`,
      action: secondSurplusDish.recommendedPerDinerAdjustment?.action || `Verify kitchen portioning scoops and align batch replenishment schedule.`,
    });
  }

  // Alert for shortage frequency if any
  const shortageDish = dishPatterns.find((d) => d.shortageFrequencyPct >= 5.0);
  if (shortageDish) {
    activeAlerts.push({
      id: `ALERT-SHORTAGE-${shortageDish.dishName.replace(/\s+/g, '-').toUpperCase()}`,
      severity: 'HIGH',
      title: `Shortage Depletion Risk: ${shortageDish.dishName}`,
      dishName: shortageDish.dishName,
      metric: `${shortageDish.shortageFrequencyPct}% of shifts reached zero-buffer or depletion`,
      reason: `Guest consumption velocity periodically outpaces initial line staging during high turnstile rushes.`,
      action: `Increase initial batch staging from 85% to 90% or raise shift safety buffer by +2.0%.`,
    });
  }

  // Meal Pattern Alert
  if (highestSurplusMeal && highestSurplusMeal.ratePct > 3.0) {
    activeAlerts.push({
      id: `ALERT-MEAL-${highestSurplusMeal.meal.toUpperCase()}`,
      severity: 'INFO',
      title: `Service Meal Variance: ${highestSurplusMeal.meal}`,
      mealType: highestSurplusMeal.meal,
      metric: `${highestSurplusMeal.surplusKg} kg cumulative surplus (${highestSurplusMeal.ratePct}% of prep)`,
      reason: `${highestSurplusMeal.meal} shifts experience higher attendance elasticity compared to other services.`,
      action: `Ensure the 15% batch reserve rule is strictly enforced before 13:00 PM turnstile verification.`,
    });
  }

  const startDate = records[0]?.serviceDate;
  const endDate = records[records.length - 1]?.serviceDate;
  const dateRangeCovered = startDate && endDate ? `${startDate} to ${endDate}` : undefined;

  return {
    insufficientData: false,
    minRecordsRequired: MIN_RECORDS,
    recordsAnalyzed: records.length,
    dateRangeCovered,
    totalRecordedPrepared: Number(totalPrepared.toFixed(1)),
    totalRecordedServed: Number(totalServed.toFixed(1)),
    totalRecordedSurplus: Number(totalSurplus.toFixed(1)),
    totalRecordedWaste: Number(totalWaste.toFixed(1)),
    overallSurplusRatePct,
    topSurplusDishes: dishPatterns.slice(0, 5),
    highestSurplusMeal,
    highestSurplusDay,
    historicalTrend,
    activeAlerts,
    dishPatterns,
    explanation: `Analysis of ${records.length} operational shifts identifies an overall surplus rate of ${overallSurplusRatePct}%. ${activeAlerts.length} actionable prevention alerts generated based strictly on stored service outcomes.`,
  };
}
