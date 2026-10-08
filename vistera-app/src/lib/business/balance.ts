/**
 * FOODFLOW Consumption Balance & Operational Health Evaluator
 * Problem Statement: PS-44 — Cutting Food Waste
 * Hackathon: VISTERA 2026 (Elimination Round Specification)
 *
 * Operational Distinction:
 * LEFTOVER != WASTE. Unserved, hot-held food is recoverable surplus ONLY IF
 * maintained under verified temperature safety (≥63°C hot-held or ≤4°C chilled)
 * within the strict 2-hour post-service safety window. Otherwise, eligibility requires confirmation.
 * Shortages are explicitly tracked as deficits and never hidden or clamped to zero.
 */

import { DishConsumptionItem, FoodUnit } from '@/types/foodflow';

export type BalanceStatus = 
  | 'BALANCED' 
  | 'SURPLUS RISK' 
  | 'SHORTAGE RISK' 
  | 'SURPLUS' 
  | 'SHORTAGE'
  | 'WASTE';

export interface DishEvaluationInput {
  dishName: string;
  preparedQuantity: number;
  servedQuantity: number;
  unit: FoodUnit;
  isExpiredOrSpoiled?: boolean;
  isTemperatureVerified?: boolean;
}

export interface BalanceEvaluationInput {
  preparedQuantity: number;
  servedQuantity: number;
  balanceThreshold?: number; // tolerance within which service is balanced (default: 5)
  dishes?: DishEvaluationInput[];
  predictedDiners?: number;
  actualDiners?: number;
}

export interface BalanceEvaluationOutput {
  remainingQuantity: number; // raw difference: positive = surplus, negative = shortage deficit
  surplusQuantity: number; // positive surplus amount (0 if shortage)
  shortageQuantity: number; // positive shortage deficit (0 if surplus)
  balanceStatus: BalanceStatus;
  varianceDelta: number; // prepared - served
  isSurplus: boolean;
  isShortage: boolean;
  isBalanced: boolean;
  statusLabel: string;
  recommendedAction: string;
  dishEvaluations: DishConsumptionItem[];
  wasteAnalysis: string;
}

export function evaluateConsumptionBalance(input: BalanceEvaluationInput): BalanceEvaluationOutput {
  const { 
    preparedQuantity, 
    servedQuantity, 
    balanceThreshold = 5,
    dishes = [],
    predictedDiners,
    actualDiners,
  } = input;

  // Validate non-negative numbers
  const safePrepared = Math.max(0, Number(preparedQuantity) || 0);
  const safeServed = Math.max(0, Number(servedQuantity) || 0);

  const rawDelta = safePrepared - safeServed;
  const remainingQuantity = rawDelta; // Signed: positive = surplus, negative = shortage deficit

  const surplusQuantity = rawDelta > 0 ? rawDelta : 0;
  const shortageQuantity = rawDelta < 0 ? Math.abs(rawDelta) : 0;

  let balanceStatus: BalanceStatus = 'BALANCED';

  if (safeServed > safePrepared) {
    balanceStatus = 'SHORTAGE';
  } else if (surplusQuantity > balanceThreshold) {
    balanceStatus = 'SURPLUS';
  } else {
    balanceStatus = 'BALANCED';
  }

  const isSurplus = balanceStatus === 'SURPLUS';
  const isShortage = balanceStatus === 'SHORTAGE';
  const isBalanced = balanceStatus === 'BALANCED';

  // Evaluate dish-level breakdown
  const dishEvaluations: DishConsumptionItem[] = dishes.map((d) => {
    const diff = Number((d.preparedQuantity - d.servedQuantity).toFixed(1));
    let dishStatus: BalanceStatus = 'BALANCED';

    if (d.isExpiredOrSpoiled) {
      dishStatus = 'WASTE';
    } else if (d.servedQuantity > d.preparedQuantity) {
      dishStatus = 'SHORTAGE RISK';
    } else if (diff > (d.unit === 'pieces' ? 15 : 1.0)) {
      dishStatus = 'SURPLUS';
    } else {
      dishStatus = 'BALANCED';
    }

    return {
      dishName: d.dishName,
      unit: d.unit,
      preparedQuantity: d.preparedQuantity,
      servedQuantity: d.servedQuantity,
      remainingQuantity: diff, // Signed difference
      status: dishStatus,
      isRecoverable: dishStatus === 'SURPLUS' && !d.isExpiredOrSpoiled,
      recoverySafetyConfirmed: Boolean(d.isTemperatureVerified),
    };
  });

  // Meaningful Waste vs Variance Cause Analysis
  let wasteAnalysis = '';
  if (predictedDiners && actualDiners) {
    const dinerDiff = actualDiners - predictedDiners;
    if (dinerDiff < -15) {
      wasteAnalysis = `Turnout was lower than forecast by ${Math.abs(dinerDiff)} diners. Preparation exceeded actual consumption, resulting in ${surplusQuantity} surplus servings. Eligibility requires confirmation before donor handoff.`;
    } else if (dinerDiff > 15) {
      wasteAnalysis = `Turnout exceeded forecast by ${dinerDiff} diners. Turnstile rush caused a deficit of ${shortageQuantity} servings.`;
    } else {
      wasteAnalysis = `Attendance closely matched forecast (variance: ${dinerDiff >= 0 ? '+' : ''}${dinerDiff} diners). Buffer held within operational target.`;
    }
  } else {
    wasteAnalysis = isSurplus
      ? `Preparation exceeded service consumption by ${surplusQuantity} servings (${safePrepared > 0 ? ((surplusQuantity / safePrepared) * 100).toFixed(1) : 0}% overage). Unserved food requires temperature confirmation before rescue transfer.`
      : isShortage
        ? `Service experienced an unfulfilled shortage of ${shortageQuantity} servings.`
        : `Service concluded in near-perfect balance with zero avoidable waste.`;
  }

  let statusLabel = 'Balanced Service';
  let recommendedAction = 'Shift balanced. No recovery action needed.';

  if (isSurplus) {
    statusLabel = 'Surplus Available (Eligibility Confirmation Required)';
    recommendedAction = `${surplusQuantity} surplus servings available. Verify holding temperature (≥63°C) and transfer to local demo partners before 2-hour window closes.`;
  } else if (isShortage) {
    statusLabel = `Shortage Deficit (${shortageQuantity} Servings)`;
    recommendedAction = `Service experienced a ${shortageQuantity} serving deficit. Review booking attendance surges in history.`;
  }

  return {
    remainingQuantity,
    surplusQuantity,
    shortageQuantity,
    balanceStatus,
    varianceDelta: rawDelta,
    isSurplus,
    isShortage,
    isBalanced,
    statusLabel,
    recommendedAction,
    dishEvaluations,
    wasteAnalysis,
  };
}

export interface ServiceBalanceInput {
  preparedServings: number;
  servedServings: number;
  balanceThreshold?: number;
  tempHoldingVerified?: boolean;
}

export interface ServiceBalanceOutput {
  remainingServings: number;
  surplusServings: number;
  shortageServings: number;
  balanceStatus: 'SURPLUS' | 'SHORTAGE' | 'BALANCED';
  isShortage: boolean;
  isSurplus: boolean;
  notes: string;
  recoveryEligibility: {
    status: 'eligible' | 'requires_confirmation' | 'not_eligible';
    isEligibleForRecovery: boolean;
    reason: string;
  };
}

export function calculateServiceBalance(input: ServiceBalanceInput): ServiceBalanceOutput {
  const diff = input.preparedServings - input.servedServings;
  const isSurplus = diff > (input.balanceThreshold ?? 0);
  const isShortage = diff < 0;
  const balanceStatus = isShortage ? 'SHORTAGE' : isSurplus ? 'SURPLUS' : 'BALANCED';

  let recoveryStatus: 'eligible' | 'requires_confirmation' | 'not_eligible' = 'not_eligible';
  let recoveryReason = 'No surplus food available for donation.';

  if (isSurplus) {
    if (input.tempHoldingVerified) {
      recoveryStatus = 'eligible';
      recoveryReason = 'Surplus verified at ≥63°C holding temperature within 2-hour window.';
    } else {
      recoveryStatus = 'requires_confirmation';
      recoveryReason = 'Eligibility requires confirmation of temperature holding history before donation handoff.';
    }
  }

  return {
    remainingServings: diff,
    surplusServings: isSurplus ? diff : 0,
    shortageServings: isShortage ? Math.abs(diff) : 0,
    balanceStatus,
    isShortage,
    isSurplus,
    notes: isShortage
      ? `Kitchen shortage of ${Math.abs(diff)} servings recorded.`
      : isSurplus
        ? `${diff} servings remaining surplus.`
        : 'Service balanced.',
    recoveryEligibility: {
      status: recoveryStatus,
      isEligibleForRecovery: recoveryStatus === 'eligible',
      reason: recoveryReason,
    },
  };
}

export function calculateDishBalance(
  dishName: string,
  preparedQuantity: number,
  servedQuantity: number,
  unit: FoodUnit = 'kg',
  isTemperatureVerified: boolean = false
): DishConsumptionItem {
  const diff = Number((preparedQuantity - servedQuantity).toFixed(1));
  let status: BalanceStatus = 'BALANCED';
  if (diff < 0) {
    status = 'SHORTAGE';
  } else if (diff > (unit === 'pieces' ? 10 : 0.5)) {
    status = 'SURPLUS';
  }

  return {
    dishName,
    unit,
    preparedQuantity,
    servedQuantity,
    remainingQuantity: diff,
    status,
    isRecoverable: status === 'SURPLUS',
    recoverySafetyConfirmed: isTemperatureVerified,
  };
}

