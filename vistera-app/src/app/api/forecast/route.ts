import { NextRequest, NextResponse } from 'next/server';
import { calculateDemandForecast } from '@/lib/forecast/engine';
import { supabase } from '@/lib/supabase/client';
import { askAI } from '@/lib/ai/router';
import { parseKitchenInsights } from '@/lib/ai/cleaner';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const expectedDiners = Number(body?.expectedDiners);
    if (!expectedDiners || isNaN(expectedDiners) || expectedDiners <= 0) {
      return NextResponse.json(
        { success: false, error: 'Expected diners must be a positive integer greater than 0.' },
        { status: 400 }
      );
    }

    const serviceDate = body?.serviceDate || new Date().toISOString().split('T')[0];
    const serviceMeal = body?.serviceMeal || 'Lunch';
    const dayOfWeek = body?.dayOfWeek || undefined;
    const specialEvent = body?.specialEvent || undefined;
    const hotelCapacity = body?.hotelCapacity !== undefined ? Number(body.hotelCapacity) : undefined;
    const menuItem = body?.menuItem || body?.menu || 'Rice + Dal + Chicken';
    const context = body?.context || 'Standard';

    const rawBuffer = body?.defaultBufferPct !== undefined ? Number(body.defaultBufferPct) : undefined;
    const defaultBufferPct = rawBuffer !== undefined && !isNaN(rawBuffer) && rawBuffer > 0
      ? (rawBuffer > 1 ? rawBuffer / 100 : rawBuffer)
      : undefined;

    // 1. Deterministic Calculation (Strictly non-generative closed-form math)
    const calculation = calculateDemandForecast({
      expectedDiners,
      serviceDate,
      serviceMeal,
      dayOfWeek,
      specialEvent,
      hotelCapacity,
      menuItem,
      context,
      defaultBufferPct,
    });

    // 2. Qualitative AI Explanation (Strict JSON Output Contract)
    const fallbackContext = {
      expectedDiners,
      predictedDemand: calculation.predictedDemand,
      recommendedPreparation: calculation.recommendedPreparation,
      serviceMeal,
      bufferServings: calculation.bufferServings,
      baseline: calculation.calculationBreakdown?.comparableBaseline || 710,
    };

    let kitchenInsights = parseKitchenInsights('', fallbackContext);

    try {
      const prompt = `You are the FOODFLOW kitchen reasoning copilot for Deccan Grand Hotel, Hyderabad.
Service: ${serviceMeal}
Date: ${serviceDate}
Menu: ${menuItem}
Registered Diners: ${expectedDiners}
Context: ${context}
Engine Predicted Demand: ${calculation.predictedDemand} servings
Recommended Preparation: ${calculation.recommendedPreparation} servings (+${calculation.bufferServings} buffer servings)
Operational Risk: ${calculation.operationalRisk}

Output a strictly valid JSON object with these exact keys:
{
  "summary": "A concise 1-2 sentence explanation of the forecast rationale and attendance factors.",
  "key_factors": ["Factor 1 from historical shift data", "Factor 2 regarding attendance pattern", "Factor 3 regarding capacity or event"],
  "recommendations": ["Practical kitchen action 1 for batch staging (e.g. 85% initial batch)", "Practical action 2 for reserve staging", "Practical action 3 for turnstile trigger"],
  "caveats": ["One operational caveat regarding external variability"]
}
Do NOT calculate new numbers. Return JSON ONLY without preamble, chain-of-thought, or markdown code blocks.`;

      const rawAiResponse = await askAI(prompt, 'gemini');
      kitchenInsights = parseKitchenInsights(rawAiResponse, fallbackContext);
    } catch (aiErr) {
      console.warn('[FOODFLOW AI] AI explanation offline or unconfigured, using deterministic rationale:', aiErr);
    }

    const aiExplanationText = kitchenInsights.summary;

    // 3. Database Persistence (Supabase PostgreSQL)
    let forecastId = `DGH-FC-${Date.now().toString().slice(-6)}`;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('demand_forecasts')
          .insert({
            service_meal: serviceMeal,
            menu_item: menuItem,
            expected_diners: expectedDiners,
            predicted_demand: calculation.predictedDemand,
            recommended_preparation: calculation.recommendedPreparation,
            operational_risk: calculation.operationalRisk,
            ai_explanation: aiExplanationText,
          })
          .select('id')
          .single();

        if (!error && data?.id) {
          forecastId = data.id;
        }
      } catch (dbErr) {
        console.warn('[FOODFLOW Supabase] Could not insert to remote demand_forecasts table:', dbErr);
      }
    }

    // Cache latest generated forecast
    const finalExplanation = {
      provider: 'Gemini 3.8 Flash' as const,
      summary: kitchenInsights.summary,
      keyFactors: kitchenInsights.key_factors,
      recommendations: kitchenInsights.recommendations,
      caveats: kitchenInsights.caveats,
      detailedReasoning: kitchenInsights.key_factors,
      operationalRecommendation: kitchenInsights.recommendations[0] || 'Stage 85% for line open. Hold remaining in hot reserve.',
      confidenceRationale: `Statistical demand baseline calculated across 90-day historical shift records for Deccan Grand Hotel.`,
      bufferAdvice: `Keep safety buffer at ${defaultBufferPct ? (defaultBufferPct * 100).toFixed(1) : '3.0'}% to prevent overproduction.`,
      isFallback: kitchenInsights.isFallback,
    };

    latestCachedForecast = {
      forecastId,
      hotelId: 'DGH-HYD-01',
      serviceDate,
      serviceMeal,
      expectedDiners,
      predictedDiners: calculation.predictedDiners,
      predictedDemand: calculation.predictedDemand,
      recommendedPreparation: calculation.recommendedPreparation,
      bufferServings: calculation.bufferServings,
      defaultBufferPct: defaultBufferPct ?? 0.03,
      operationalRisk: calculation.operationalRisk,
      confidence: calculation.confidence,
      dishes: calculation.dishes,
      calculationBreakdown: calculation.calculationBreakdown,
      factors: calculation.numericalForecast.factors,
      aiInsights: kitchenInsights,
      aiExplanation: finalExplanation,
      forecast: {
        ...calculation.numericalForecast,
        forecastId,
        hotelId: 'DGH-HYD-01',
        serviceDate,
        serviceMeal,
        dishes: calculation.dishes,
        calculationBreakdown: calculation.calculationBreakdown,
      },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      ...latestCachedForecast,
    });
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error generating forecast.' },
      { status: 500 }
    );
  }
}

let latestCachedForecast: Record<string, unknown> | null = null;

export async function GET() {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('demand_forecasts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({
            success: true,
            source: 'supabase',
            forecast: data,
          });
        }
      } catch (dbErr) {
        console.warn('[FOODFLOW Supabase] GET forecast error:', dbErr);
      }
    }

    if (latestCachedForecast) {
      return NextResponse.json({
        success: true,
        source: 'memory_cache',
        forecast: latestCachedForecast,
      });
    }

    return NextResponse.json({
      success: true,
      source: 'baseline',
      forecast: {
        forecastId: 'DGH-FC-892401',
        hotelId: 'DGH-HYD-01',
        serviceDate: new Date().toISOString().split('T')[0],
        serviceMeal: 'Lunch',
        expectedDiners: 820,
        predictedDiners: 795,
        predictedDemand: 795,
        recommendedPreparation: 819,
        bufferServings: 24,
        operationalRisk: 'LOW',
      },
    });
  } catch (err) {
    console.error('GET /api/forecast error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal error retrieving forecast.' },
      { status: 500 }
    );
  }
}
