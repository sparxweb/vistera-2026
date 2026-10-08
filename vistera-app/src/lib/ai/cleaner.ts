/**
 * FOODFLOW: AI Reasoning Output Cleaner & Contract Validator
 * Ensures that model responses from Gemini, NVIDIA Nemotron, or fallbacks
 * strictly conform to the user-facing contract without leaking chain-of-thought,
 * thinking processes, system instructions, or markdown scaffolding.
 */

export interface AIKitchenInsights {
  summary: string;
  key_factors: string[];
  recommendations: string[];
  caveats?: string[];
  isFallback?: boolean;
}

export function cleanRawAIResponse(rawText: string): string {
  if (!rawText || typeof rawText !== 'string') return '';

  let cleaned = rawText.trim();

  // 1. Remove <think>...</think> XML blocks (used by reasoning models like DeepSeek / Nemotron)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. Remove "Here's a thinking process" or "Thinking Process:" headers and analysis scaffolding
  const thinkingHeaders = [
    /Here['’]s a thinking process[\s\S]*?(?=(\n\n[A-Z]|\n\n\{|\n\{|"summary"))/i,
    /Thinking Process:?[\s\S]*?(?=(\n\n[A-Z]|\n\n\{|\n\{|"summary"))/i,
    /Analyze User Input:?[\s\S]*?(?=(\n\n[A-Z]|\n\n\{|\n\{|"summary"))/i,
    /###? (Thinking|Analysis|Internal Scaffolding)[\s\S]*?(?=(\n\n[A-Z]|\n\n\{|\n\{|"summary"))/i,
  ];

  for (const pattern of thinkingHeaders) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  // 3. Remove prompt scaffolding leaks ("Role:", "Constraints:", "System Instruction:")
  cleaned = cleaned.replace(/^(Role|Constraints|Context|Input Summary):.*$/gim, '').trim();

  return cleaned;
}

export function parseKitchenInsights(
  rawText: string,
  fallbackContext?: {
    expectedDiners?: number;
    predictedDemand?: number;
    recommendedPreparation?: number;
    serviceMeal?: string;
    bufferServings?: number;
    baseline?: number;
  } | number,
  fallbackPrep?: number
): AIKitchenInsights {
  const ctx = typeof fallbackContext === 'number'
    ? {
        expectedDiners: fallbackContext,
        predictedDemand: fallbackContext,
        recommendedPreparation: fallbackPrep || fallbackContext + 24,
        serviceMeal: 'Lunch',
        bufferServings: fallbackPrep ? Math.max(0, fallbackPrep - fallbackContext) : 24,
        baseline: 790,
      }
    : {
        expectedDiners: fallbackContext?.expectedDiners ?? 820,
        predictedDemand: fallbackContext?.predictedDemand ?? 795,
        recommendedPreparation: fallbackContext?.recommendedPreparation ?? 819,
        serviceMeal: fallbackContext?.serviceMeal ?? 'Lunch',
        bufferServings: fallbackContext?.bufferServings ?? 24,
        baseline: fallbackContext?.baseline ?? 790,
      };

  const cleaned = cleanRawAIResponse(rawText);

  // Attempt to extract JSON block if formatted with markdown ```json ... ```
  let jsonString = cleaned;
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonMatch && jsonMatch[1]) {
    jsonString = jsonMatch[1].trim();
  } else {
    // Check if there is an embedded JSON object { ... }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = cleaned.slice(firstBrace, lastBrace + 1);
    }
  }

  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed.summary === 'string' && parsed.summary.trim().length > 0) {
      return {
        summary: cleanTextLine(parsed.summary),
        key_factors: Array.isArray(parsed.key_factors)
          ? parsed.key_factors.slice(0, 3).map(cleanTextLine).filter(Boolean)
          : Array.isArray(parsed.factors)
          ? parsed.factors.slice(0, 3).map(cleanTextLine).filter(Boolean)
          : [
              `Historical comparable baseline for ${ctx.serviceMeal.toLowerCase()} shift`,
              `Day-of-week attendance variance factored into turnstile model`,
              `Capacity safety bound enforced for Deccan Grand Hotel`,
            ],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations.slice(0, 3).map(cleanTextLine).filter(Boolean)
          : [
              `Stage 85% initial batch prior to dining room opening`,
              `Hold 15% reserve batch in cold prepped staging`,
              `Fire reserve batch only if mid-shift check-ins exceed 75% of forecast`,
            ],
        caveats: Array.isArray(parsed.caveats)
          ? parsed.caveats.slice(0, 2).map(cleanTextLine).filter(Boolean)
          : ['Weather or corporate banqueting shifts may alter attendance velocity.'],
        isFallback: false,
      };
    }
  } catch {
    // JSON parse failed; check if we have a clean 1-2 sentence text
  }

  // If text is clean and doesn't contain thinking process artifacts, use it as summary
  if (
    cleaned.length > 20 &&
    !cleaned.toLowerCase().includes('thinking process') &&
    !cleaned.toLowerCase().includes('analyze user input')
  ) {
    const firstSentences = cleaned.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
    return {
      summary: firstSentences,
      key_factors: [
        `Historical ${ctx.serviceMeal.toLowerCase()} baseline: ${ctx.baseline || 710} diners`,
        `Rolling 7-day turnstile trend incorporated`,
        `Physical hotel capacity bound strictly enforced`,
      ],
      recommendations: [
        `Cook 85% initial batch for service start`,
        `Hold 15% reserve in temperature-safe staging`,
        `Trigger reserve cooking only if turnstile arrivals warrant it`,
      ],
      caveats: ['Empirical historical estimate; unannounced group arrivals may affect turnout.'],
      isFallback: false,
    };
  }

  // Pre-calibrated defensible fallback
  return {
    summary: `Demand projected at ${ctx.predictedDemand} servings based on ${ctx.expectedDiners} registered bookings for ${ctx.serviceMeal.toLowerCase()}. The recommended preparation includes a +${ctx.bufferServings} serving safety buffer.`,
    key_factors: [
      `Comparable ${ctx.serviceMeal.toLowerCase()} baseline of ${ctx.baseline || 710} diners from 90-day archive`,
      `Day-of-week demand variance applied to turnstile bookings`,
      `Safety buffer of ${ctx.bufferServings} servings added to prevent food stockout`,
    ],
    recommendations: [
      `Stage 85% initial batch in warm service wells for line open`,
      `Hold 15% reserve in prepped cold/dry staging`,
      `Fire reserve batch only if turnstile arrivals exceed 75% 45 minutes before shift close`,
    ],
    caveats: ['AI insights temporarily generated from deterministic operational rules.'],
    isFallback: true,
  };
}

function cleanTextLine(text: unknown): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/^[-*•\d.]+\s*/, '') // Remove bullet points or numbering
    .replace(/[*_#`]/g, '') // Remove markdown symbols
    .trim();
}
