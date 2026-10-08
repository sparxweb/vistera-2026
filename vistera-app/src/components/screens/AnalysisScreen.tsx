'use client';

import React from 'react';
import { 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  Scale, 
  RotateCcw,
  Info,
  ShieldCheck,
  AlertTriangle,
  Truck,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { ScreenId } from '@/components/layout/Header';

interface AnalysisScreenProps {
  onNavigate: (screen: ScreenId) => void;
  predicted?: number;
  served?: number;
  prepared?: number;
}

export function AnalysisScreen({ 
  onNavigate, 
  predicted = 742, 
  served = 728, 
  prepared = 760 
}: AnalysisScreenProps) {
  const difference = served - predicted; // -14
  const surplus = Math.max(0, prepared - served); // 32
  const isSurplus = surplus > 0;
  const isShortage = served > prepared;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              MODULE 02B • ATTRIBUTION & FACTOR ANALYSIS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Waste / Mismatch Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Identify likely operational factors driving delta variances between predicted demand, kitchen staging, and actual turnstile consumption.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('consumption')}
            className="px-3 py-1.5 rounded-lg border border-[#E6E4DC] text-xs font-semibold text-[#141618] hover:bg-[#FAF9F5] transition-colors"
          >
            Edit Shift Actuals
          </button>
          <button
            type="button"
            onClick={() => onNavigate('recovery')}
            className="px-3.5 py-1.5 rounded-lg bg-[#B85720] hover:bg-[#9E4615] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Recover 32 Servings</span>
          </button>
        </div>
      </div>

      {/* 4 Key Pillar Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E6E4DC] shadow-[0_2px_12px_rgba(20,22,24,0.02)]">
          <span className="text-[10px] font-semibold uppercase text-[#737A87] block mb-1">
            Predicted Demand
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1B4D36]">
            {predicted}
          </div>
          <span className="text-[11px] text-[#2C5E45] mt-0.5 block font-medium">
            Forecast Engine output
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E6E4DC] shadow-[0_2px_12px_rgba(20,22,24,0.02)]">
          <span className="text-[10px] font-semibold uppercase text-[#737A87] block mb-1">
            Actual Consumption
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#141618]">
            {served}
          </div>
          <span className="text-[11px] text-[#585E68] mt-0.5 block">
            Turnstile + register count
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E6E4DC] shadow-[0_2px_12px_rgba(20,22,24,0.02)]">
          <span className="text-[10px] font-semibold uppercase text-[#737A87] block mb-1">
            Prepared Quantity
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#B85720]">
            {prepared}
          </div>
          <span className="text-[11px] text-[#8C4212] mt-0.5 block font-medium">
            Hot-line staged trays
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#FCF2EB] border border-[#F7DAC8] shadow-[0_2px_12px_rgba(20,22,24,0.02)]">
          <span className="text-[10px] font-semibold uppercase text-[#B85720] block mb-1">
            Surplus Status
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#B85720]">
            {surplus}
          </div>
          <span className="text-[11px] text-[#8C4212] mt-0.5 block font-medium">
            {isSurplus ? '32 servings surplus' : 'Zero surplus'}
          </span>
        </div>
      </div>

      {/* Grid: Visual Alignment Comparison & Factors Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Three-Pillar Comparative Bars (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-7 shadow-[0_2px_16px_rgba(20,22,24,0.03)] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
            <h3 className="text-base font-bold text-[#141618]">
              Three-Pillar Demand Alignment
            </h3>
            <span className="text-xs text-[#737A87]">
              Difference: <strong className="text-[#141618]">{difference} servings</strong> (Actual vs Predicted)
            </span>
          </div>

          <div className="space-y-4">
            {/* Bar 1: Predicted */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#1B4D36]">
                  PREDICTED DEMAND (Forecast Engine)
                </span>
                <span className="font-mono font-bold text-[#1B4D36]">
                  {predicted} servings
                </span>
              </div>
              <div className="w-full h-7 bg-[#FAF9F5] rounded-lg p-1 border border-[#E8E6DE]">
                <div
                  className="h-full bg-[#1B4D36] rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                  style={{ width: `${Math.min(100, (predicted / 800) * 100)}%` }}
                >
                  {predicted}
                </div>
              </div>
            </div>

            {/* Bar 2: Actual Served */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#141618]">
                  ACTUAL CONSUMPTION (Turnstile + POS)
                </span>
                <span className="font-mono font-bold text-[#141618]">
                  {served} servings
                </span>
              </div>
              <div className="w-full h-7 bg-[#FAF9F5] rounded-lg p-1 border border-[#E8E6DE]">
                <div
                  className="h-full bg-[#141618] rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                  style={{ width: `${Math.min(100, (served / 800) * 100)}%` }}
                >
                  {served}
                </div>
              </div>
            </div>

            {/* Bar 3: Prepared */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#B85720]">
                  PREPARED AMOUNT (With Buffer)
                </span>
                <span className="font-mono font-bold text-[#B85720]">
                  {prepared} servings
                </span>
              </div>
              <div className="w-full h-7 bg-[#FAF9F5] rounded-lg p-1 border border-[#E8E6DE]">
                <div
                  className="h-full bg-[#C6682F] rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                  style={{ width: `${Math.min(100, (prepared / 800) * 100)}%` }}
                >
                  {prepared}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#F0EFEB] text-center text-xs">
            <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
              <span className="text-[10px] text-[#8A929E] block uppercase">Forecast Error</span>
              <span className="font-bold text-[#141618]">{Math.abs(difference)} servings (1.8%)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
              <span className="text-[10px] text-[#8A929E] block uppercase">Overproduction</span>
              <span className="font-bold text-[#B85720]">{(((prepared - served) / prepared) * 100).toFixed(1)}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
              <span className="text-[10px] text-[#8A929E] block uppercase">Recovery Rate</span>
              <span className="font-bold text-[#1B4D36]">100% Eligible</span>
            </div>
          </div>
        </div>

        {/* Right Side: Waste / Mismatch Analysis Likely Factors & Recommendation (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-7 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#141618] uppercase tracking-wider">
                  Waste / Mismatch Analysis
                </h3>
                <p className="text-xs text-[#737A87]">
                  Attribution modeling identifying probabilistic variance factors
                </p>
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase text-[#B85720] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#F2D7C2]">
                Likely Factors Only
              </span>
            </div>

            {/* Crucial Wording: Likely Factors (Not claiming AI absolute certainty) */}
            <div className="space-y-3">
              {[
                {
                  title: 'Attendance lower than expected',
                  impact: 'Primary Factor',
                  badgeColor: 'text-[#B85720] bg-[#FAF0E6]',
                  desc: 'Afternoon academic seminar switched to virtual format; entry turnstile velocity dropped 8.2% after 13:00.',
                },
                {
                  title: 'Menu demand variation',
                  impact: 'Secondary Factor',
                  badgeColor: 'text-[#585E68] bg-[#F4F3ED]',
                  desc: 'Unseasonably rainy morning increased vegetable broth selection over the planned chicken farro entree.',
                },
                {
                  title: 'Preparation buffer',
                  impact: 'Structural Margin',
                  badgeColor: 'text-[#1B4D36] bg-[#EAF4EE]',
                  desc: 'The +18 serving safety buffer safely prevented lunch line stockouts but remained unconsumed at 14:15.',
                },
              ].map((factor, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#141618]">
                      {factor.title}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${factor.badgeColor}`}>
                      {factor.impact}
                    </span>
                  </div>
                  <p className="text-[#525866] text-xs leading-relaxed">
                    {factor.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Gemini Recommendation Panel */}
            <div className="p-4 rounded-xl bg-[#EAF4EE] border border-[#CCE3D5] text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-[#1B4D36] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Next-Shift Recommendation (Gemini 3.8 Flash)</span>
              </div>
              <p className="text-[#2C5E45] italic leading-relaxed text-xs">
                &ldquo;For similar attendance and menu conditions, consider reducing the preparation buffer from +18 to +8 servings. Reallocate 10 servings to cold salad assembly which carries lower spoilage penalty.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
