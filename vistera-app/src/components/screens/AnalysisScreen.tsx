'use client';

import React, { useMemo } from 'react';
import { 
  ArrowRight, 
  Lightbulb,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { ScreenId } from '@/components/layout/Header';
import { calculatePatternAnalysis } from '@/lib/data/historicalServices';
import { DEMO_HOTEL } from '@/lib/demoData';

interface AnalysisScreenProps {
  onNavigate: (screen: ScreenId) => void;
  predicted?: number;
  served?: number;
  prepared?: number;
}

export function AnalysisScreen({ 
  onNavigate, 
  predicted = 795, 
  served = 785, 
  prepared = 819 
}: AnalysisScreenProps) {
  const remaining = Math.max(0, prepared - served); // 34
  const variance = served - predicted; // -10

  const patterns = useMemo(() => calculatePatternAnalysis(), []);

  // Dynamically constructed natural language insight from stored calculations
  const saturdayData = patterns.dayOfWeekAverages.find((d) => d.day === 'Saturday');
  const saturdayVariance = saturdayData ? saturdayData.varianceVsMeanPct : 4.8;
  const satExplanation = `Lunch demand on Saturdays has historically been ${saturdayVariance >= 0 ? `${saturdayVariance}% higher` : `${Math.abs(saturdayVariance)}% lower`} than the hotel's overall service average, driven by banqueting check-ins and weekend leisure turnover.`;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#E6E4DC] space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full border border-[#D0E7DA]">
            PATTERN ANALYSIS • STATISTICAL INTELLIGENCE
          </span>
          <span className="text-[11px] text-[#737A87]">
            ARCHIVE: <strong>{DEMO_HOTEL.name}</strong> • {patterns.dateRangeCovered}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
          Historical Consumption &amp; Pattern Analysis
        </h1>
        <p className="text-xs sm:text-sm text-[#585E68]">
          Transparent empirical learning derived from 30 operating days at Deccan Grand Hotel. All insights are calculated directly from stored service records.
        </p>
      </div>

      {/* 01. DAY-OF-WEEK ATTENDANCE PROFILE (Mon - Sun) */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EFEB]">
          <div>
            <h3 className="text-xs font-bold text-[#141618] uppercase tracking-wider">
              A • Day-of-Week Attendance Profile (Monday – Sunday)
            </h3>
            <span className="text-[11px] text-[#737A87]">
              Empirical average check-in volume per operating day across all 30 shifts.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full border border-[#D0E7DA]">
              {patterns.totalHistoricalRecords} Services Analyzed
            </span>
          </div>
        </div>

        {/* Day-of-Week Grid / Visual Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
          {patterns.dayOfWeekAverages.map((dayData) => {
            const isHighest = dayData.day === 'Saturday';
            const isWeekend = dayData.day === 'Saturday' || dayData.day === 'Sunday';
            return (
              <div 
                key={dayData.day} 
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isHighest 
                    ? 'bg-[#EAF4EE] border-[#1B4D36]/30 shadow-xs ring-1 ring-[#1B4D36]/20' 
                    : isWeekend
                      ? 'bg-[#FAF9F5] border-[#E6E4DC]'
                      : 'bg-white border-[#E6E4DC]'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isHighest ? 'text-[#1B4D36]' : 'text-[#737A87]'
                }`}>
                  {dayData.day.slice(0, 3)}
                </span>
                <div className="text-lg font-extrabold text-[#141618] mt-1">
                  {dayData.averageDiners}
                </div>
                <span className="text-[10px] text-[#737A87] block">avg diners</span>
                <div className="mt-2 pt-2 border-t border-[#F0EFEB]">
                  <span className={`text-[10px] font-bold ${
                    dayData.varianceVsMeanPct >= 0 ? 'text-[#2E7D32]' : 'text-[#737A87]'
                  }`}>
                    {dayData.varianceVsMeanPct >= 0 ? `+${dayData.varianceVsMeanPct}%` : `${dayData.varianceVsMeanPct}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empirical Explanation Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] text-xs text-[#141618] flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-[#C6682F] shrink-0 mt-0.5" />
          <div>
            <strong>Calculated Empirical Pattern: </strong>
            <span>{satExplanation}</span>
          </div>
        </div>
      </div>

      {/* 02. WEEKDAY VS WEEKEND & RECENT 7-DAY TREND */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* B. Weekday vs Weekend */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-5 shadow-xs space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
            B • Weekday vs Weekend Split
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#585E68]">Weekday Average:</span>
              <span className="font-bold text-[#141618]">{patterns.weekdayAverage} diners</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#585E68]">Weekend Average:</span>
              <span className="font-bold text-[#1B4D36]">{patterns.weekendAverage} diners</span>
            </div>
            <div className="pt-2 border-t border-[#F0EFEB] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#141618]">Weekend Net Variance:</span>
              <span className="text-xs font-bold text-[#2E7D32]">
                {patterns.weekdayVsWeekendPct >= 0 ? `+${patterns.weekdayVsWeekendPct}%` : `${patterns.weekdayVsWeekendPct}%`}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#737A87]">
            Weekend banquets and leisure buffet patronage consistently outperform weekday footfall by ~{patterns.weekdayVsWeekendPct}%.
          </p>
        </div>

        {/* D. Recent 7-Day Trend */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-5 shadow-xs space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
            D • Recent 7-Day Momentum
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#585E68]">Trend Direction:</span>
              <span className="font-bold text-[#2E7D32] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {patterns.recentTrendDirection}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#585E68]">Rolling 7-Day Delta:</span>
              <span className="font-bold text-[#141618]">
                {patterns.recent7DayTrendPct >= 0 ? `+${patterns.recent7DayTrendPct}%` : `${patterns.recent7DayTrendPct}%`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#F0EFEB] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#141618]">Dynamic Adjustment:</span>
              <span className="text-xs font-bold text-[#1B4D36]">Active in Forecast</span>
            </div>
          </div>
          <p className="text-[11px] text-[#737A87]">
            Week-over-week velocity is factored into the daily baseline to avoid lagging behind sudden seasonal surges.
          </p>
        </div>

        {/* E & F. Special Event Multiplier & Confidence */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-5 shadow-xs space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
            E &amp; F • Special Event &amp; Confidence
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#585E68]">Event Multiplier:</span>
              <span className="font-bold text-[#141618]">{patterns.specialEventMultiplier}x</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#585E68]">Prediction Reliability:</span>
              <span className="font-bold text-[#2E7D32]">{patterns.confidenceLabel} ({patterns.confidenceScore}%)</span>
            </div>
            <div className="pt-2 border-t border-[#F0EFEB] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#141618]">Archive Sufficiency:</span>
              <span className="text-xs font-bold text-[#1B4D36]">30 Shifts (Sufficient)</span>
            </div>
          </div>
          <p className="text-[11px] text-[#737A87]">
            Empirical historical evidence verifies high confidence for regular breakfast, lunch, and dinner services.
          </p>
        </div>
      </div>

      {/* 03. MEAL COMPARISON (Breakfast vs Lunch vs Dinner) */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-[#F0EFEB] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#141618] uppercase tracking-wider">
              C • Shift Meal Comparison (Breakfast vs Lunch vs Dinner)
            </h3>
            <span className="text-[11px] text-[#737A87]">
              Consumption density and average waste percentage by meal service.
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-1 rounded-full border border-[#D0E7DA]">
            INDIAN HOSPITALITY ARCHIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {patterns.mealAverages.map((m) => (
            <div key={m.meal} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141618]">{m.meal}</span>
                <span className="text-[10px] text-[#737A87] font-mono">
                  {m.meal === 'BREAKFAST' ? '07:00 - 10:30' : m.meal === 'LUNCH' ? '12:30 - 15:30' : '19:30 - 23:00'}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-[#141618]">
                {m.averageDiners} <span className="text-xs font-medium text-[#737A87]">avg diners</span>
              </div>
              <div className="text-xs text-[#585E68] pt-1 border-t border-[#F0EFEB] space-y-1">
                <div className="flex justify-between">
                  <span>Consumption Index:</span>
                  <span className="font-semibold text-[#141618]">{m.averageConsumptionRateKg} kg/person</span>
                </div>
                <div className="flex justify-between">
                  <span>Typical Waste Level:</span>
                  <span className="font-semibold text-[#2E7D32]">{m.typicalWastagePct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 04. TODAY'S SHIFT VARIANCE & LEARNING LOOP */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
          <div>
            <h3 className="text-xs font-bold text-[#141618] uppercase tracking-wider">
              Today&apos;s Service Variance &amp; Closed-Loop Learning
            </h3>
            <span className="text-[11px] text-[#737A87]">
              Comparison between deterministic prediction ({predicted}), prepared target ({prepared}), and actual turnout ({served}).
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#2E7D32] bg-[#EAF4EE] px-2.5 py-1 rounded-full border border-[#D0E7DA] font-bold">
            CLOSED-LOOP ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] font-bold uppercase text-[#737A87] block">Predicted Turnout</span>
            <div className="text-2xl font-extrabold text-[#141618] mt-1">{predicted}</div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">Statistical forecast</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] font-bold uppercase text-[#737A87] block">Prepared Target</span>
            <div className="text-2xl font-extrabold text-[#141618] mt-1">{prepared}</div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">2-stage batching</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] font-bold uppercase text-[#737A87] block">Actual Turnout</span>
            <div className="text-2xl font-extrabold text-[#2E7D32] mt-1">{served}</div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">Turnstile swipes</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCF2EB] border border-[#F6DAC8]">
            <span className="text-[10px] font-bold uppercase text-[#C6682F] block">Recoverable Surplus</span>
            <div className="text-2xl font-extrabold text-[#C6682F] mt-1">{remaining}</div>
            <span className="text-[10px] text-[#C6682F] mt-0.5 block">3.2 kg Rice + 2.5 kg Chicken</span>
          </div>
        </div>

        {/* Explainability Callout */}
        <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <div className="text-xs text-[#585E68]">
              <strong>Prediction Accuracy: 98.7%</strong> (Variance: {variance > 0 ? `+${variance}` : variance} diners). 
              The two-stage batch staging prevented 15 kg of secondary overproduction.
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('recovery')}
            className="px-4 py-2 bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Proceed to Surplus Recovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
