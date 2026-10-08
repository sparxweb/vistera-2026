'use client';

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Lightbulb
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
  predicted = 795, 
  served = 785, 
  prepared = 819 
}: AnalysisScreenProps) {
  const remaining = Math.max(0, prepared - served); // 34
  const variance = served - predicted; // -10

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#E5E5DE]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
            OPERATIONAL LEARNING • STEP 03
          </span>
          <span className="text-[10px] font-mono text-[#5C6658]">
            FACILITY: College Hostel Dining Hall, Hyderabad
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
          WHAT HAPPENED TODAY?
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
          Understanding the variance between demand forecast, batch food staging, and actual consumption.
        </p>
      </div>

      {/* 01. WHAT HAPPENED? (4 Clean Numbers) */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D8878] block">
          01 • WHAT HAPPENED TODAY?
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Predicted Turnout
            </span>
            <div className="text-3xl font-extrabold text-[#0E382B] mt-1">
              {predicted}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Empirical forecast
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Prepared Target
            </span>
            <div className="text-3xl font-extrabold text-[#0E382B] mt-1">
              {prepared}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Cooked in 2 batches
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Actual Diners
            </span>
            <div className="text-3xl font-extrabold text-[#0E382B] mt-1">
              {served}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Turnstile check-ins
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
              Remaining Food
            </span>
            <div className="text-3xl font-extrabold text-[#D97706] mt-1">
              {remaining}
            </div>
            <span className="text-[10px] text-[#B45309] mt-0.5 block">
              3.2 kg Rice + 2.5 kg Chicken
            </span>
          </div>
        </div>

        <div className="text-xs text-[#5C6658] pt-2">
          Turnstile variance: <strong className="text-[#0E382B]">{variance >= 0 ? `+${variance}` : variance} diners</strong> compared to the historical regression forecast.
        </div>
      </div>

      {/* 02. DISH-LEVEL VARIANCE BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D8878] block">
          02 • DISH-LEVEL CONSUMPTION BREAKDOWN
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#7D8878] block">Steamed Sona Masoori Rice</span>
            <div className="text-xl font-bold text-[#0E382B]">3.2 kg remaining</div>
            <span className="text-[11px] text-[#5C6658] block">Prepared: 43.0 kg • Served: 39.8 kg</span>
            <span className="text-[10px] text-[#10B981] font-semibold block">Recoverable surplus</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#7D8878] block">Andhra Chicken Curry</span>
            <div className="text-xl font-bold text-[#0E382B]">2.5 kg remaining</div>
            <span className="text-[11px] text-[#5C6658] block">Prepared: 31.0 kg • Served: 28.5 kg</span>
            <span className="text-[10px] text-[#10B981] font-semibold block">Recoverable surplus</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#7D8878] block">Tomato Dal / Dal Tadka</span>
            <div className="text-xl font-bold text-[#0E382B]">1.8 L remaining</div>
            <span className="text-[11px] text-[#5C6658] block">Prepared: 18.0 L • Served: 16.2 L</span>
            <span className="text-[10px] text-[#10B981] font-semibold block">Recoverable surplus</span>
          </div>
        </div>
      </div>

      {/* 03. WHY DID IT HAPPEN? */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0E382B]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B]">
            03 • WHY DID IT HAPPEN?
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0E382B]">1. Afternoon Seminar Attendance Relocation</span>
              <span className="text-[10px] font-mono text-[#D97706] font-semibold bg-[#FEF3C7] px-2 py-0.5 rounded">PRIMARY DRIVER</span>
            </div>
            <p className="text-[#5C6658]">
              A senior engineering cohort departed early for an industry symposium in Hitec City, reducing late-hour dining hall check-ins by approximately 10 attendees.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0E382B]">2. Two-Stage Batch Buffer Held Smoothly</span>
              <span className="text-[10px] font-mono text-[#10B981] font-semibold bg-[#E8EFEA] px-2 py-0.5 rounded">INTENDED OPERATION</span>
            </div>
            <p className="text-[#5C6658]">
              The initial cook satisfied peak rush smoothly. The 16% secondary batch remained uncontaminated in thermal food pans with zero burning or wastage.
            </p>
          </div>
        </div>
      </div>

      {/* 04. WHAT TO DO NEXT SHIFT? */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#D97706]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B]">
            04 • WHAT TO DO NEXT SHIFT?
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#E8EFEA] text-[#0E382B] text-xs leading-relaxed space-y-2 border border-[#C5DACD]">
          <p className="font-medium">
            &ldquo;For tomorrow&apos;s lunch service, maintain the standard 84/16 batch staging ratio. Stagger the second chicken curry batch until after 12:45 PM turnstile verification. Route today&apos;s 3.2 kg Rice and 2.5 kg Chicken Curry to nearby Gachibowli partners before the 2-hour window expires.&rdquo;
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('recovery')}
            className="w-full sm:w-auto px-6 py-3 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Surplus Recovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
