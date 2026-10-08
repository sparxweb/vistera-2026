'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Scale, 
  RotateCcw,
  Info,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { ConsumptionRecord } from '@/types/foodflow';
import { INITIAL_CONSUMPTION } from '@/lib/demoData';
import { ScreenId } from '@/components/layout/Header';

interface ConsumptionScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onUpdateConsumption?: (record: ConsumptionRecord) => void;
  predicted?: number;
  initialPrepared?: number;
  initialServed?: number;
}

export function ConsumptionScreen({ 
  onNavigate, 
  onUpdateConsumption,
  predicted = 742,
  initialPrepared = 760,
  initialServed = 728,
}: ConsumptionScreenProps) {
  const [prepared, setPrepared] = useState(initialPrepared);
  const [served, setServed] = useState(initialServed);

  // Auto-calculated fields
  const remaining = Math.max(0, prepared - served);
  const varianceDelta = served - predicted; // -14
  const isSurplus = remaining > 0;
  const isShortage = served > prepared;

  const handleApply = (newP: number, newS: number) => {
    setPrepared(newP);
    setServed(newS);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B85720] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#F2D7C2]">
              MODULE 02 • SHIFT WRAP & ACTUALS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            What actually happened?
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Log shift consumption numbers to compare with numerical predictions and attribute mismatch factors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleApply(760, 728)}
          className="p-1.5 rounded-lg border border-[#E6E4DC] text-[#737A87] hover:text-[#141618] hover:bg-[#FAF9F5] transition-colors self-start sm:self-auto"
          title="Reset to demo baseline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Input Actuals vs Comparison Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input / Update Section (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
            <h3 className="text-sm font-bold text-[#141618]">
              Shift Consumption Entry
            </h3>
            <span className="text-[10px] font-mono text-[#8A929E]">
              SHIFT A WRAP
            </span>
          </div>

          <div className="space-y-4">
            {/* Field 1: Meals Prepared */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-[#141618]">
                  Meals Prepared
                </label>
                <span className="text-[#B85720] font-mono font-bold">
                  {prepared} servings
                </span>
              </div>
              <input
                type="number"
                value={prepared}
                onChange={(e) => setPrepared(Number(e.target.value))}
                className="w-full text-sm p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
              <span className="text-[10px] text-[#8A929E] mt-0.5 block">
                Total trays cooked and staged on the hot-line
              </span>
            </div>

            {/* Field 2: Meals Served */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-[#141618]">
                  Meals Served
                </label>
                <span className="text-[#141618] font-mono font-bold">
                  {served} servings
                </span>
              </div>
              <input
                type="number"
                value={served}
                onChange={(e) => setServed(Number(e.target.value))}
                className="w-full text-sm p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
              <span className="text-[10px] text-[#8A929E] mt-0.5 block">
                POS verified register transactions during service window
              </span>
            </div>

            {/* Field 3: Remaining Food (Auto-calculated) */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#EAE8E0]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-[#737A87]">
                  Remaining Food (Surplus Pans)
                </span>
                <span className="font-mono text-base font-extrabold text-[#B85720]">
                  {remaining} servings
                </span>
              </div>
              <p className="text-[11px] text-[#6F7682]">
                {isShortage
                  ? `Shortage: Served (${served}) exceeded Prepared (${prepared}) by ${served - prepared} servings`
                  : `Formula: Prepared (${prepared}) - Served (${served}) = ${remaining} servings`}
              </p>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="pt-2 border-t border-[#F0EFEB]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A929E] block mb-2">
              Simulation Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleApply(760, 728)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAF0E6] hover:bg-[#F2D7C2] text-[#B85720] font-medium transition-colors text-center"
              >
                Surplus (32)
              </button>
              <button
                type="button"
                onClick={() => handleApply(760, 755)}
                className="px-2.5 py-1.5 rounded-lg bg-[#EAF4EE] hover:bg-[#CCE3D5] text-[#1B4D36] font-medium transition-colors text-center"
              >
                Balanced (5)
              </button>
              <button
                type="button"
                onClick={() => handleApply(760, 795)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FEF2F2] hover:bg-[#FCA5A5] text-[#DC2626] font-medium transition-colors text-center"
              >
                Shortage (795)
              </button>
              <button
                type="button"
                onClick={() => handleApply(730, 730)}
                className="px-2.5 py-1.5 rounded-lg bg-[#F4F3ED] hover:bg-[#EAE8E0] text-[#141618] transition-colors text-center"
              >
                Zero-Waste (0)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Automated Surplus / Shortage / Balanced Banners & Comparison Visualization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Automatic Banner 1: SHORTAGE RISK */}
          {isShortage && (
            <div className="p-5 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#DC2626] flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626]">
                      SHORTAGE RISK
                    </span>
                    <span className="text-[10px] font-semibold bg-white text-[#DC2626] px-2 py-0.5 rounded-full border border-[#FCA5A5]">
                      Kitchen Deficit
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#141618] mt-0.5">
                    {served - prepared} meal deficit detected
                  </h3>
                  <p className="text-xs text-[#991B1B] mt-0.5">
                    Turnstile rush exceeded staged production. Urgent batch replenishment required to avoid service stockouts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('forecast')}
                className="px-4 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Adjust Next Buffer</span>
              </button>
            </div>
          )}

          {/* Automatic Banner 2: BALANCED / LOW SURPLUS */}
          {!isShortage && remaining > 0 && remaining <= 10 && (
            <div className="p-5 rounded-2xl bg-[#EAF4EE] border border-[#CCE3D5] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#1B4D36] flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B4D36]">
                      BALANCED / LOW SURPLUS
                    </span>
                    <span className="text-[10px] font-semibold bg-white text-[#1B4D36] px-2 py-0.5 rounded-full border border-[#CCE3D5]">
                      Near-Zero Waste
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#141618] mt-0.5">
                    {remaining} servings buffer remaining
                  </h3>
                  <p className="text-xs text-[#2C5E45] mt-0.5">
                    Nominal operational margin. Optimal equilibrium between service reliability and zero organic waste.
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 bg-white text-[#1B4D36] text-xs font-semibold rounded-xl border border-[#CCE3D5] shrink-0">
                Optimal Alignment
              </div>
            </div>
          )}

          {/* Automatic Banner 3: SURPLUS DETECTED (Eligible for Recovery Transfer) */}
          {!isShortage && remaining > 10 && (
            <div className="p-5 rounded-2xl bg-[#FCF2EB] border border-[#F7DAC8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#B85720] flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B85720]">
                      SURPLUS DETECTED
                    </span>
                    <span className="text-[10px] font-semibold bg-white text-[#B85720] px-2 py-0.2 rounded-full border border-[#F7DAC8]">
                      Eligible Recovery
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#141618] mt-0.5">
                    {remaining} servings available for transfer
                  </h3>
                  <p className="text-xs text-[#8C4212] mt-0.5">
                    Within temperature guidelines. Safe transfer window closes in 1 hour 45 minutes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('recovery')}
                className="px-4 py-2.5 bg-[#B85720] hover:bg-[#9E4615] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Truck className="w-4 h-4" />
                <span>Dispatch to Recovery</span>
              </button>
            </div>
          )}

          {/* Comparison Visualization: PREDICTED vs ACTUAL vs PREPARED */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-7 shadow-[0_2px_16px_rgba(20,22,24,0.03)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
              <h3 className="text-base font-bold text-[#141618]">
                Three-Pillar Demand Alignment
              </h3>
              <span className="text-xs text-[#737A87]">
                Variance: <strong className="text-[#141618]">{varianceDelta} servings</strong> (Actual vs Predicted)
              </span>
            </div>

            {/* Visual Comparative Bars */}
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
                    style={{ width: `${(predicted / 800) * 100}%` }}
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
                    style={{ width: `${(served / 800) * 100}%` }}
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
                <span className="font-bold text-[#141618]">
                  {Math.abs(varianceDelta)} servings ({((Math.abs(varianceDelta) / Math.max(1, predicted)) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
                <span className="text-[10px] text-[#8A929E] block uppercase">
                  {isShortage ? 'Kitchen Deficit' : 'Overproduction'}
                </span>
                <span className={`font-bold ${isShortage ? 'text-[#DC2626]' : 'text-[#B85720]'}`}>
                  {isShortage
                    ? `-${served - prepared} servings`
                    : prepared > 0
                    ? `${(((prepared - served) / prepared) * 100).toFixed(1)}%`
                    : '0.0%'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
                <span className="text-[10px] text-[#8A929E] block uppercase">Recovery Rate</span>
                <span className={`font-bold ${isShortage || remaining === 0 ? 'text-[#737A87]' : 'text-[#1B4D36]'}`}>
                  {isShortage || remaining === 0 ? '0% (No Surplus)' : '100% Eligible'}
                </span>
              </div>
            </div>
          </div>

          {/* WASTE / MISMATCH ANALYSIS */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
                  Waste / Mismatch Analysis
                </h4>
                <p className="text-[11px] text-[#737A87]">
                  Attribution modeling identifying probabilistic variance factors
                </p>
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase text-[#B85720] bg-[#FAF0E6] px-2 py-0.5 rounded">
                Likely Factors Only
              </span>
            </div>

            {/* Important Wording: Likely Factors */}
            <div className="space-y-2.5">
              {[
                {
                  title: 'Campus Attendance Drop',
                  impact: 'Primary Factor',
                  desc: 'Afternoon academic seminar switched to virtual format; entry turnstile velocity dropped 8.2% after 13:00.',
                },
                {
                  title: 'Menu Preference Variation',
                  impact: 'Secondary Factor',
                  desc: 'Unseasonably rainy morning increased vegetable broth selection over the planned chicken farro entree.',
                },
                {
                  title: 'Preparation Buffer Residual',
                  impact: 'Structural Margin',
                  desc: 'The +18 serving safety buffer safely prevented lunch line stockouts but remained unconsumed at 14:15.',
                },
              ].map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#141618]">
                      {factor.title}
                    </span>
                    <span className="text-[10px] font-medium text-[#737A87] bg-white px-2 py-0.5 rounded border border-[#E6E4DC]">
                      {factor.impact}
                    </span>
                  </div>
                  <p className="text-[#525866] text-[11px] leading-relaxed">
                    {factor.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-4 rounded-xl bg-[#EAF4EE] border border-[#CCE3D5] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#1B4D36] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini Next-Shift Recommendation</span>
              </div>
              <p className="text-[#2C5E45] italic leading-relaxed">
                &ldquo;For similar attendance and menu conditions, consider reducing the preparation buffer from +18 to +8 servings. Reallocate 10 servings to cold salad assembly which carries lower spoilage penalty.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
