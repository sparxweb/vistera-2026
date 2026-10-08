/**
 * FOODFLOW Consumption Balance & Surplus/Shortage Detection Engine
 * Problem Statement: PS-44 — Cutting Food Waste
 * Hackathon: VISTERA 2026 (Round 2 MVP)
 */

export type BalanceStatus = 'SURPLUS' | 'SHORTAGE' | 'BALANCED';

export interface BalanceEvaluationInput {
  preparedQuantity: number;
  servedQuantity: number;
  balanceThreshold?: number; // threshold within which service is considered balanced (default: 5)
}

export interface BalanceEvaluationOutput {
  remainingQuantity: number;
  balanceStatus: BalanceStatus;
  varianceDelta: number; // positive = excess unserved, negative = shortage
  isSurplus: boolean;
  isShortage: boolean;
  isBalanced: boolean;
  statusLabel: string;
  recommendedAction: string;
}

export function evaluateConsumptionBalance(input: BalanceEvaluationInput): BalanceEvaluationOutput {
  const { preparedQuantity, servedQuantity, balanceThreshold = 5 } = input;

  const rawDelta = preparedQuantity - servedQuantity;
  const remainingQuantity = Math.max(0, rawDelta);

  let balanceStatus: BalanceStatus = 'BALANCED';

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

  let statusLabel = 'Balanced Service';
  let recommendedAction = 'Shift balanced. No recovery action needed.';

  if (isSurplus) {
    statusLabel = 'Potential Surplus Detected';
    recommendedAction = `${remainingQuantity} servings available. Route to verified local recovery partners before hot-holding safe window closes.`;
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
  };
}
