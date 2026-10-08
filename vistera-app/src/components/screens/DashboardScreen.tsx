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
      {/* 01. GREETING & SHIFT CONTEXT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
              {DEMO_KITCHEN.name}
            </span>
            <span className="text-xs text-[#5C6658]">
              • {DEMO_KITCHEN.shift}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Good morning, Kitchen Manager.
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Wednesday Lunch • Campus Central Dining Hall
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-lg border border-[#E5E5DE] text-xs flex items-center gap-2 text-[#5C6658]">
            <Clock className="w-3.5 h-3.5 text-[#0E382B]" />
            <span className="font-medium text-[#0E382B]">14:45 PM • Active Service</span>
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
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-[0_4px_24px_rgba(14,56,43,0.04)] relative overflow-hidden">
        {/* Subtle accent indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5DE]">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7D8878] block">
              OPERATIONAL STATUS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0E382B] mt-0.5">
              Today&apos;s Service
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFEA] text-xs font-bold text-[#0E382B] border border-[#C5DACD]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>SERVICE STATUS: ON TRACK</span>
          </div>
        </div>

        {/* Core Metric Hierarchy */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Expected Diners
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">
              {forecast.expectedDiners}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Badge log total
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Predicted Meals
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">
              {forecast.predictedDemand}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Forecast engine
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Recommended Prep
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">
              {forecast.recommendedPreparation}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              +{forecast.bufferServings} safety margin
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
              {isSurplus ? 'Current Surplus' : isShortage ? 'Shortage Delta' : 'Status Balance'}
            </span>
            <div className={`text-2xl sm:text-3xl font-bold mt-1 ${
              isSurplus ? 'text-[#D97706]' : isShortage ? 'text-[#DC2626]' : 'text-[#0E382B]'
            }`}>
              {isSurplus ? currentSurplus : isShortage ? Math.abs(consumption.mealsServed - consumption.mealsPrepared) : '0'}
            </div>
            <span className={`text-[10px] mt-0.5 block ${
              isSurplus ? 'text-[#B45309]' : isShortage ? 'text-[#B91C1C]' : 'text-[#0E382B]'
            }`}>
              {isSurplus ? 'Eligible for recovery' : isShortage ? 'Meals under demand' : 'Perfect match'}
            </span>
          </div>
        </div>

        {/* Primary Action Banner: ONE Primary Action */}
        <div className="p-5 rounded-2xl bg-[#F4F4EE] border border-[#E5E5DE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#0E382B] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>{isSurplus ? 'POTENTIAL SURPLUS DETECTED' : 'SERVICE READY FOR UPDATES'}</span>
            </div>
            <p className="text-xs text-[#5C6658] mt-0.5">
              {isSurplus
                ? `${currentSurplus} servings available. Route to verified local partners before the hot-holding window closes.`
                : 'Log actual heads served or review operational variance.'}
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

      {/* 03. SECONDARY INFORMATION: ONE CLEAN CHART (Demand vs Actual) */}
      <div className="space-y-2">
        <ForecastChart />
      </div>

      {/* 04. AI OPERATIONAL INSIGHT (Contextual Reasoning) */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E5DE] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2 py-0.5 rounded border border-[#C5DACD]">
              AI INSIGHT
            </span>
            <span className="text-xs font-semibold text-[#0E382B]">
              Gemini Operational Reasoning
            </span>
          </div>
          <p className="text-xs text-[#5C6658] leading-relaxed max-w-2xl">
            {explanation.summary || 'Wednesday lunch shows high predictability. Recommended preparation includes a modest 2.4% safety buffer.'}
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

      {/* 05. RECENT ACTIVITY (3–5 Timeline Rows) */}
      <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DE]">
          <h3 className="text-sm font-bold text-[#0E382B] uppercase tracking-wider">
            Recent Activity
          </h3>
          <span className="text-xs text-[#7D8878]">
            Today&apos;s Service Timeline
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="font-semibold text-[#0E382B]">Forecast Generated</span>
              <span className="text-[#5C6658] hidden sm:inline">• Predicted 742 meals (±18 servings)</span>
            </div>
            <span className="text-[11px] font-mono text-[#7D8878]">09:30 AM</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="font-semibold text-[#0E382B]">Preparation Staged</span>
              <span className="text-[#5C6658] hidden sm:inline">• 760 meals prepared across 2 batches</span>
            </div>
            <span className="text-[11px] font-mono text-[#7D8878]">11:15 AM</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="font-semibold text-[#0E382B]">Consumption Recorded</span>
              <span className="text-[#5C6658] hidden sm:inline">• 728 turnstile check-ins logged</span>
            </div>
            <span className="text-[11px] font-mono text-[#7D8878]">14:30 PM</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span className="font-semibold text-[#B45309]">Surplus Detected</span>
              <span className="text-[#92400E] hidden sm:inline">• 32 unserved portions flagged for recovery</span>
            </div>
            <span className="text-[11px] font-mono text-[#B45309]">14:45 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
