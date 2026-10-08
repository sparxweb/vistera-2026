import { NextRequest, NextResponse } from 'next/server';
import { evaluateConsumptionBalance } from '@/lib/business/balance';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const preparedQuantity = Number(body?.preparedQuantity);
    const servedQuantity = Number(body?.servedQuantity);

    if (isNaN(preparedQuantity) || isNaN(servedQuantity) || preparedQuantity < 0 || servedQuantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Prepared and served quantities must be valid non-negative numbers.' },
        { status: 400 }
      );
    }

    const forecastId = body?.forecastId || null;

    // 1. Evaluate Balance & Remaining Food
    const balance = evaluateConsumptionBalance({
      preparedQuantity,
      servedQuantity,
      balanceThreshold: 5,
    });

    // 2. Database Persistence (Supabase PostgreSQL)
    let consumptionId = crypto.randomUUID();
    if (supabase) {
      try {
        const validForecastUuid =
          typeof forecastId === 'string' && forecastId.length === 36 && forecastId.includes('-')
            ? forecastId
            : null;

        const { data, error } = await supabase
          .from('daily_consumption')
          .insert({
            forecast_id: validForecastUuid,
            prepared_quantity: preparedQuantity,
            served_quantity: servedQuantity,
            remaining_quantity: balance.remainingQuantity,
            balance_status: balance.balanceStatus,
          })
          .select('id')
          .single();

        if (!error && data?.id) {
          consumptionId = data.id;
        }
      } catch (dbErr) {
        console.warn('[FOODFLOW Supabase] Could not insert to remote daily_consumption table:', dbErr);
      }
    }

    latestCachedConsumption = {
      consumptionId,
      preparedQuantity,
      servedQuantity,
      remainingQuantity: balance.remainingQuantity,
      balanceStatus: balance.balanceStatus,
      varianceDelta: balance.varianceDelta,
      isSurplus: balance.isSurplus,
      isShortage: balance.isShortage,
      isBalanced: balance.isBalanced,
      statusLabel: balance.statusLabel,
      recommendedAction: balance.recommendedAction,
      recordedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      ...latestCachedConsumption,
    });
  } catch (error) {
    console.error('Consumption API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error evaluating consumption.' },
      { status: 500 }
    );
  }
}

let latestCachedConsumption: Record<string, unknown> | null = null;

export async function GET() {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('daily_consumption')
          .select('*')
          .order('recorded_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({
            success: true,
            source: 'supabase',
            consumption: data,
          });
        }
      } catch (dbErr) {
        console.warn('[FOODFLOW Supabase] GET consumption error:', dbErr);
      }
    }

    if (latestCachedConsumption) {
      return NextResponse.json({
        success: true,
        source: 'memory_cache',
        consumption: latestCachedConsumption,
      });
    }

    return NextResponse.json({
      success: true,
      source: 'baseline',
      consumption: {
        consumptionId: '00000000-0000-4000-8000-000000000002',
        preparedQuantity: 760,
        servedQuantity: 728,
        remainingQuantity: 32,
        balanceStatus: 'SURPLUS',
        isSurplus: true,
      },
    });
  } catch (err) {
    console.error('GET /api/consumption error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal error retrieving consumption.' },
      { status: 500 }
    );
  }
}
