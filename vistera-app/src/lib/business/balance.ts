/**
 * FOODFLOW Consumption Balance & Operational Health Evaluator
 * Problem Statement: PS-44 — Cutting Food Waste
 * Hackathon: VISTERA 2026 (Round 2 MVP Specification)
 *
 * Operational Distinction:
 * LEFTOVER != WASTE. Unserved, hot-held food is recoverable surplus if staged
 * within safety windows. Only contaminated or expired food is logged as waste.
 */

import { DishConsumptionItem, FoodUnit } from '@/types/foodflow';

export type BalanceStatus = 
  | 'BALANCED' 
  | 'SURPLUS RISK' 
  | 'SHORTAGE RISK' 
  | 'SURPLUS' 
  | 'WASTE';

export interface DishEvaluationInput {
  dishName: string;
  preparedQuantity: number;
  servedQuantity: number;
  unit: FoodUnit;
  isExpiredOrSpoiled?: boolean;
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
  remainingQuantity: number;
  balanceStatus: 'SURPLUS' | 'SHORTAGE' | 'BALANCED' | 'SURPLUS RISK' | 'WASTE';
  varianceDelta: number; // positive = unserved surplus, negative = shortage
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

  const rawDelta = preparedQuantity - servedQuantity;
  const remainingQuantity = Math.max(0, rawDelta);

  let balanceStatus: 'SURPLUS' | 'SHORTAGE' | 'BALANCED' | 'SURPLUS RISK' | 'WASTE' = 'BALANCED';

  if (servedQuantity > preparedQuantity) {
    balanceStatus = 'SHORTAGE';
  } else if (remainingQuantity > balanceThreshold) {
    balanceStatus = 'SURPLUS';
  } else {
    balanceStatus = 'BALANCED';
  }

  const isSurplus = balanceStatus === 'SURPLUS';
  const isShortage = balanceStatus === 'SHORTAGE';
  const isBalanced = balanceStatus === 'BALANCED';

  // Evaluate dish-level breakdown
  const dishEvaluations: DishConsumptionItem[] = dishes.map((d) => {
    const diff = d.preparedQuantity - d.servedQuantity;
    const rem = Math.max(0, Number(diff.toFixed(1)));
    let dishStatus: BalanceStatus = 'BALANCED';

    if (d.isExpiredOrSpoiled) {
      dishStatus = 'WASTE';
    } else if (d.servedQuantity > d.preparedQuantity) {
      dishStatus = 'SHORTAGE RISK';
    } else if (rem > (d.unit === 'pieces' ? 15 : 1.0)) {
      dishStatus = 'SURPLUS';
    } else {
      dishStatus = 'BALANCED';
    }

    return {
      dishName: d.dishName,
      unit: d.unit,
      preparedQuantity: d.preparedQuantity,
      servedQuantity: d.servedQuantity,
      remainingQuantity: rem,
      status: dishStatus,
      isRecoverable: dishStatus === 'SURPLUS' && !d.isExpiredOrSpoiled,
    };
  });

  // Meaningful Waste vs Variance Cause Analysis
  let wasteAnalysis = '';
  if (predictedDiners && actualDiners) {
    const dinerDiff = actualDiners - predictedDiners;
    if (dinerDiff < -15) {
      wasteAnalysis = `Turnout was lower than forecast by ${Math.abs(dinerDiff)} diners. Preparation exceeded actual consumption, resulting in ${remainingQuantity} remaining servings. For the next comparable service, stage ~80% in the initial batch and release the second batch only after early attendance verification.`;
    } else if (dinerDiff > 15) {
      wasteAnalysis = `Turnout exceeded forecast by ${dinerDiff} diners. Turnstile rush strained batch reserves, requiring rapid finishing cook to prevent line stockout.`;
    } else {
      wasteAnalysis = `Attendance closely matched forecast (variance: ${dinerDiff >= 0 ? '+' : ''}${dinerDiff} diners). Buffer held smoothly within operational target.`;
    }
  } else {
    wasteAnalysis = isSurplus
      ? `Preparation exceeded service consumption by ${remainingQuantity} servings (${rawDelta > 0 ? ((remainingQuantity / preparedQuantity) * 100).toFixed(1) : 0}% overage). Eligible for dispatch to recovery partners.`
      : isShortage
        ? `Service experienced an unfulfilled deficit of ${Math.abs(rawDelta)} servings.`
        : `Service concluded in near-perfect balance with zero avoidable waste.`;
  }

  let statusLabel = 'Balanced Service';
  let recommendedAction = 'Shift balanced. No recovery action needed.';

  if (isSurplus) {
    statusLabel = 'Recoverable Surplus Available';
    recommendedAction = `${remainingQuantity} servings (${dishEvaluations.length > 0 ? dishEvaluations.map((d) => `${d.remainingQuantity} ${d.unit} ${d.dishName}`).join(', ') : 'safe pans'}) available. Transfer to verified local partners before the 2-hour hot-hold window closes.`;
  } else if (isShortage) {
    const shortageAmount = servedQuantity - preparedQuantity;
    statusLabel = 'Shortage Risk Detected';
    recommendedAction = `Service experienced a ${shortageAmount} serving deficit. Review attendance surge factors in analysis.`;
  }

  return {
    remainingQuantity,
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
