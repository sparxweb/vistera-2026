'use client';

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Truck
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
  const remaining = Math.max(0, prepared - served); // 32
  const variance = served - predicted; // -14

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#E5E5DE]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
            OPERATIONAL LEARNING • STEP 03
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
          WHAT HAPPENED TODAY?
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
          Understanding the variance between demand forecast, food staging, and actual consumption.
        </p>
      </div>

      {/* 01. WHAT HAPPENED? (4 Clean Numbers) */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D8878] block">
          01 • WHAT HAPPENED?
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Predicted
            </span>
            <div className="text-3xl font-extrabold text-[#0E382B] mt-1">
              {predicted}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Forecasting engine
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Prepared
            </span>
            <div className="text-3xl font-extrabold text-[#0E382B] mt-1">
              {prepared}
            </div>
            <span className="text-[10px] text-[#5C6658] mt-0.5 block">
              Cooked hot trays
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Served
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
              Remaining
            </span>
            <div className="text-3xl font-extrabold text-[#D97706] mt-1">
              {remaining}
            </div>
            <span className="text-[10px] text-[#B45309] mt-0.5 block">
              Eligible surplus pans
            </span>
          </div>
        </div>

        <div className="text-xs text-[#5C6658] pt-2">
          Service closed with a <strong>{Math.abs(variance)} serving delta</strong> between prediction and actual turnstiles.
        </div>
      </div>

      {/* 02. WHY DID THIS HAPPEN? (Carefully worded likely contributing factors) */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0E382B]" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#0E382B]">
            02 • WHY DID THIS HAPPEN?
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Likely Contributing Factor 01
            </span>
            <h4 className="text-xs font-bold text-[#0E382B]">
              Exam Week Schedule Shift
            </h4>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Engineering midterms scheduled between 13:00 and 15:00 caused earlier, briefer dining turnstile waves than regular Wednesday averages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Likely Contributing Factor 02
            </span>
            <h4 className="text-xs font-bold text-[#0E382B]">
              Heavy Morning Rainfall
            </h4>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Overcast weather slightly reduced pedestrian cross-campus movement between academic halls and the central dining canteen.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
              Likely Contributing Factor 03
            </span>
            <h4 className="text-xs font-bold text-[#0E382B]">
              Conservative Staging Buffer
            </h4>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Kitchen staff staged the entire +18 safety margin at initial line opening rather than staggering the second batch.
            </p>
          </div>
        </div>
      </div>

      {/* 03. WHAT SHOULD WE CHANGE? (One clear recommendation) */}
      <div className="bg-[#E8EFEA] rounded-3xl border border-[#C5DACD] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#0E382B]" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#0E382B]">
            03 • WHAT SHOULD WE CHANGE?
          </h2>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#C5DACD] space-y-2">
          <h4 className="text-sm font-bold text-[#0E382B]">
            Recommendation for next Wednesday service:
          </h4>
          <p className="text-xs sm:text-sm text-[#4A5548] leading-relaxed">
            &ldquo;Consider a smaller safety buffer for similar Wednesday lunch services, and hold the secondary batch in reserve until 45 minutes into active rush.&rdquo;
          </p>
        </div>

        {/* PRIMARY CTA: ONE Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('recovery')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Recovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
