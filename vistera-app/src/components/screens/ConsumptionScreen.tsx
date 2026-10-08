'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  RotateCcw,
  Scale,
  AlertTriangle,
  CheckCircle2,
  TrendingDown
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

  const remaining = Math.max(0, prepared - served);
  const isSurplus = prepared > served;
  const isShortage = served > prepared;
  const isBalanced = prepared === served;

  const handleUpdate = (newP: number, newS: number) => {
    setPrepared(newP);
    setServed(newS);
    if (onUpdateConsumption) {
      onUpdateConsumption({
        ...INITIAL_CONSUMPTION,
        mealsPrepared: newP,
        mealsServed: newS,
        remainingFood: Math.max(0, newP - newS),
        surplusDetected: Math.max(0, newP - newS),
        overproductionPercent: newP > 0 ? Number(((Math.max(0, newP - newS) / newP) * 100).toFixed(1)) : 0,
      });
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
              GUIDED WORKFLOW • STEP 02
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            MONITOR SERVICE
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Track meals prepared vs. served to detect surplus or shortage immediately.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleUpdate(760, 728)}
          className="p-2 rounded-lg border border-[#E5E5DE] text-[#5C6658] hover:text-[#0E382B] hover:bg-[#F4F4EE] transition-colors self-start sm:self-auto cursor-pointer"
          title="Reset to default baseline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* CORE 3-METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PREPARED */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D8878] block">
            PREPARED
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#0E382B] my-2">
            {prepared}
          </div>
          <span className="text-xs text-[#5C6658] block">servings cooked</span>
          <div className="mt-4 pt-3 border-t border-[#E5E5DE]">
            <input
              type="number"
              aria-label="Meals Prepared"
              value={prepared}
              onChange={(e) => handleUpdate(Number(e.target.value), served)}
              className="w-24 text-center font-mono text-xs font-semibold p-1 rounded border border-[#E5E5DE] bg-[#FBFBF9] focus:outline-none"
            />
          </div>
        </div>

        {/* SERVED */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D8878] block">
            SERVED
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#0E382B] my-2">
            {served}
          </div>
          <span className="text-xs text-[#5C6658] block">diners checked in</span>
          <div className="mt-4 pt-3 border-t border-[#E5E5DE]">
            <input
              type="number"
              aria-label="Meals Served"
              value={served}
              onChange={(e) => handleUpdate(prepared, Number(e.target.value))}
              className="w-24 text-center font-mono text-xs font-semibold p-1 rounded border border-[#E5E5DE] bg-[#FBFBF9] focus:outline-none"
            />
          </div>
        </div>

        {/* REMAINING */}
        <div className={`rounded-2xl border p-6 shadow-sm text-center ${
          isSurplus 
            ? 'bg-[#FEF3C7] border-[#FDE68A]' 
            : isShortage 
              ? 'bg-[#FEE2E2] border-[#FCA5A5]' 
              : 'bg-[#E8EFEA] border-[#C5DACD]'
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider block ${
            isSurplus ? 'text-[#B45309]' : isShortage ? 'text-[#B91C1C]' : 'text-[#0E382B]'
          }`}>
            REMAINING
          </span>
          <div className={`text-4xl sm:text-5xl font-extrabold my-2 ${
            isSurplus ? 'text-[#D97706]' : isShortage ? 'text-[#DC2626]' : 'text-[#0E382B]'
          }`}>
            {isSurplus ? remaining : isShortage ? Math.abs(served - prepared) : 0}
          </div>
          <span className={`text-xs font-semibold block ${
            isSurplus ? 'text-[#B45309]' : isShortage ? 'text-[#B91C1C]' : 'text-[#0E382B]'
          }`}>
            {isSurplus ? 'servings surplus' : isShortage ? 'shortage servings' : 'perfect balance'}
          </span>
        </div>
      </div>

      {/* LARGE VISUAL BALANCE INDICATOR & STATUS */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-8 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#7D8878]">
            <span>SERVICE RATIO</span>
            <span>{Math.round((served / Math.max(1, prepared)) * 100)}% CONSUMED</span>
          </div>

          {/* Clean Visual Progress Bar */}
          <div className="h-4 w-full bg-[#F4F4EE] rounded-full overflow-hidden p-0.5 border border-[#E5E5DE] flex">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isShortage ? 'bg-[#DC2626]' : 'bg-[#0E382B]'
              }`}
              style={{ width: `${Math.min(100, (served / Math.max(1, prepared)) * 100)}%` }}
            />
            {isSurplus && (
              <div 
                className="h-full bg-[#D97706] rounded-r-full transition-all duration-300 opacity-80"
                style={{ width: `${Math.min(100, (remaining / prepared) * 100)}%` }}
              />
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#5C6658]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0E382B]" />
              <span>Served: {served}</span>
            </div>
            {isSurplus && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]" />
                <span>Surplus: {remaining}</span>
              </div>
            )}
            {isShortage && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]" />
                <span>Shortage: {served - prepared}</span>
              </div>
            )}
          </div>
        </div>

        {/* STATUS BANNER WITH ONE PRIMARY CTA */}
        {isSurplus && (
          <div className="p-6 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#B45309]">
                  POTENTIAL SURPLUS
                </h3>
              </div>
              <p className="text-xs text-[#92400E] mt-1">
                {remaining} servings remaining in safe food pans. Eligible for immediate recovery routing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('recovery')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Route to Recovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {isShortage && (
          <div className="p-6 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#B91C1C]">
                  SHORTAGE RISK
                </h3>
              </div>
              <p className="text-xs text-[#991B1B] mt-1">
                Turnstiles recorded {served - prepared} meals above staged preparation capacity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('analysis')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Review Shortage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {isBalanced && (
          <div className="p-6 rounded-2xl bg-[#E8EFEA] border border-[#C5DACD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0E382B]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E382B]">
                  BALANCED SERVICE
                </h3>
              </div>
              <p className="text-xs text-[#164E3D] mt-1">
                Prepared quantity matched diner demand exactly. Zero food waste detected.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('analysis')}
              className="w-full sm:w-auto px-5 py-3 bg-white text-[#0E382B] border border-[#C5DACD] hover:bg-[#F4F4EE] rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              <span>View Analysis</span>
            </button>
          </div>
        )}
      </div>

      {/* QUICK PRESETS (Simulate for Hackathon Judges) */}
      <div className="bg-[#F4F4EE] rounded-2xl p-4 border border-[#E5E5DE] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-[#5C6658] font-medium">Quick Demo States:</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleUpdate(760, 728)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5DE] text-[#0E382B] font-semibold hover:border-[#0E382B] transition-colors cursor-pointer"
          >
            Surplus (32 meals)
          </button>
          <button
            type="button"
            onClick={() => handleUpdate(740, 765)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5DE] text-[#DC2626] font-semibold hover:border-[#DC2626] transition-colors cursor-pointer"
          >
            Shortage (25 meals)
          </button>
          <button
            type="button"
            onClick={() => handleUpdate(750, 750)}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5DE] text-[#0E382B] font-semibold hover:border-[#0E382B] transition-colors cursor-pointer"
          >
            Exact Balance
          </button>
        </div>
      </div>
    </div>
  );
}
