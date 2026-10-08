'use client';

import React from 'react';
import { 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { ForecastChart } from '@/components/ui/ForecastChart';
import { 
  DEMO_KITCHEN, 
  INITIAL_NUMERICAL_FORECAST, 
  INITIAL_LLM_EXPLANATION, 
  INITIAL_CONSUMPTION 
} from '@/lib/demoData';
import { ScreenId } from '@/components/layout/Header';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  forecast?: typeof INITIAL_NUMERICAL_FORECAST;
  explanation?: typeof INITIAL_LLM_EXPLANATION;
  consumption?: typeof INITIAL_CONSUMPTION;
}

export function DashboardScreen({
  onNavigate,
  forecast = INITIAL_NUMERICAL_FORECAST,
  explanation = INITIAL_LLM_EXPLANATION,
  consumption = INITIAL_CONSUMPTION,
}: DashboardScreenProps) {
  const currentSurplus = consumption.surplusDetected ?? Math.max(0, consumption.mealsPrepared - consumption.mealsServed);
  const isSurplus = currentSurplus > 0;
  const isShortage = consumption.mealsServed > consumption.mealsPrepared;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* 01. GREETING & FACILITY CONTEXT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
              {DEMO_KITCHEN.name}
            </span>
            <span className="text-xs text-[#5C6658]">
              • {DEMO_KITCHEN.city} • {DEMO_KITCHEN.shift}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Kitchen Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Real-time demand forecasting, batch staging, and surplus rescue corridor for institutional catering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-lg border border-[#E5E5DE] text-xs flex items-center gap-2 text-[#5C6658]">
            <Clock className="w-3.5 h-3.5 text-[#0E382B]" />
            <span className="font-medium text-[#0E382B]">Active Lunch Service</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('forecast')}
            className="px-4 py-1.5 bg-[#0E382B] hover:bg-[#164E3D] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Run Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 02. PRIMARY DASHBOARD CARD: TODAY'S SERVICE */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-[0_4px_24px_rgba(14,56,43,0.04)] relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5DE]">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7D8878] block">
              OPERATIONAL STATUS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] mt-0.5">
              Today&apos;s Lunch Service
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFEA] text-xs font-bold text-[#0E382B] border border-[#C5DACD]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>TWO-STAGE BATCHING ACTIVE</span>
          </div>
        </div>

        {/* Core Metric Hierarchy */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Registered Diners
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">
              {forecast.expectedDiners}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Hostel swipe log
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Predicted Turnout
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">
              {forecast.predictedDiners || forecast.predictedDemand}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              ~96.9% historical ratio
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Staged Prep Target
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">
              {forecast.recommendedPreparation}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              +3% safety margin
            </span>
          </div>

          <div className={`p-4 rounded-xl border ${
            isSurplus 
              ? 'bg-[#FEF3C7] border-[#FDE68A]' 
              : isShortage 
                ? 'bg-[#FEE2E2] border-[#FCA5A5]' 
                : 'bg-[#E8EFEA] border-[#C5DACD]'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isSurplus ? 'text-[#B45309]' : isShortage ? 'text-[#B91C1C]' : 'text-[#0E382B]'
            }`}>
              {isSurplus ? 'Recoverable Surplus' : isShortage ? 'Shortage Deficit' : 'Status Balance'}
            </span>
            <div className={`text-2xl sm:text-3xl font-bold mt-1 ${
              isSurplus ? 'text-[#D97706]' : isShortage ? 'text-[#DC2626]' : 'text-[#0E382B]'
            }`}>
              {isSurplus ? currentSurplus : isShortage ? Math.abs(consumption.mealsServed - consumption.mealsPrepared) : '0'}
            </div>
            <span className={`text-[10px] mt-0.5 block ${
              isSurplus ? 'text-[#B45309]' : isShortage ? 'text-[#B91C1C]' : 'text-[#0E382B]'
            }`}>
              {isSurplus ? '3.2 kg Rice + 2.5 kg Chicken' : isShortage ? 'Under production' : 'In balance'}
            </span>
          </div>
        </div>

        {/* Primary Action Banner */}
        <div className="p-5 rounded-2xl bg-[#F4F4EE] border border-[#E5E5DE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#0E382B] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>{isSurplus ? 'RESCUE ROUTING ACTIVE (HYDERABAD)' : 'SERVICE READY FOR UPDATES'}</span>
            </div>
            <p className="text-xs text-[#5C6658] mt-0.5">
              {isSurplus
                ? `3.2 kg Rice & 2.5 kg Chicken Curry staged hot. Route to nearby partners in Gachibowli / Madhapur before the 2-hour window expires.`
                : 'Log actual meals served or review dish consumption variance.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isSurplus ? (
              <button
                type="button"
                onClick={() => onNavigate('recovery')}
                className="px-5 py-2.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Review Surplus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('consumption')}
                className="px-5 py-2.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Record Consumption</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 03. HONEST BASELINE METRICS & FORECAST CHART */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5E5DE]">
          <div>
            <h3 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
              Weekly Service Headcount Trends
            </h3>
            <span className="text-[11px] text-[#5C6658]">
              Comparison of predicted demand, actual check-ins, and prepared targets.
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#0E382B] bg-[#E8EFEA] px-2.5 py-1 rounded-full border border-[#C5DACD]">
            BASELINE MODEL • 25 HISTORICAL SHIFTS
          </div>
        </div>
        <ForecastChart />
      </div>

      {/* 04. AI OPERATIONAL INSIGHT (Contextual Reasoning) */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E5DE] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2 py-0.5 rounded border border-[#C5DACD]">
              AI COPILOT
            </span>
            <span className="text-xs font-semibold text-[#0E382B]">
              Gemini 3.8 Flash Operational Reasoning
            </span>
          </div>
          <p className="text-xs text-[#5C6658] leading-relaxed max-w-2xl">
            {explanation.summary || 'Wednesday lunch shows high predictability. Recommended preparation includes a modest 3% safety buffer with two-stage batch cooking.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('analysis')}
          className="px-4 py-2 bg-white text-[#0E382B] border border-[#E5E5DE] hover:bg-[#F4F4EE] rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer"
        >
          View Full Analysis
        </button>
      </div>
    </div>
  );
}
