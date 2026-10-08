'use client';

import React from 'react';
import { 
  Users, 
  Database, 
  Cpu, 
  Sparkles, 
  UtensilsCrossed, 
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function ArchitectureDiagram() {
  return (
    <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,22,24,0.03)]">
      {/* Title & Core Architectural Rule */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F0EFEB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded-full border border-[#D0E7DA]">
              SYSTEM TOPOLOGY & EVALUATOR GUIDE
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#141618] mt-1.5">
            Strict Separation: Forecast Engine vs. Natural-Language LLM
          </h3>
          <p className="text-xs text-[#6F7682] mt-1 max-w-2xl leading-relaxed">
            FOODFLOW avoids generative hallucination by decoupling deterministic numerical modeling (time-series regression) from cognitive pattern synthesis (Gemini API).
          </p>
        </div>

        <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E6E4DC] shrink-0 text-right">
          <span className="text-[10px] font-semibold text-[#8A929E] uppercase tracking-wider block">
            PS-44 Protocol Compliance
          </span>
          <span className="text-xs font-bold text-[#141618] flex items-center gap-1 justify-end">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D36]" />
            Zero Fake Claims Standard
          </span>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 sm:gap-2 my-8 items-stretch relative">
        {/* Node 1: Input */}
        <div className="bg-[#FAF9F5] rounded-xl p-4 border border-[#E8E6DE] flex flex-col justify-between relative group hover:border-[#141618] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#737A87]">01</span>
              <Users className="w-4 h-4 text-[#141618]" />
            </div>
            <h4 className="text-xs font-bold text-[#141618]">USER INPUT</h4>
            <p className="text-[11px] text-[#6F7682] mt-1">
              Expected diners, event flags, meal shift, menu selection.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#EAE8E0] text-[10px] font-mono text-[#141618] bg-white p-1.5 rounded">
            diners = 800
          </div>
        </div>

        {/* Node 2: Database */}
        <div className="bg-[#FAF9F5] rounded-xl p-4 border border-[#E8E6DE] flex flex-col justify-between relative group hover:border-[#141618] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#737A87]">02</span>
              <Database className="w-4 h-4 text-[#141618]" />
            </div>
            <h4 className="text-xs font-bold text-[#141618]">HISTORICAL DB</h4>
            <p className="text-[11px] text-[#6F7682] mt-1">
              Supabase / PostgreSQL stores 60-day shift attendance & waste.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#EAE8E0] text-[10px] font-mono text-[#585E68] bg-white p-1.5 rounded">
            Wed avg: 756
          </div>
        </div>

        {/* Node 3: Forecasting Engine */}
        <div className="bg-[#EAF4EE] rounded-xl p-4 border border-[#CCE3D5] flex flex-col justify-between relative group hover:border-[#1B4D36] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#1B4D36]">03</span>
              <Cpu className="w-4 h-4 text-[#1B4D36]" />
            </div>
            <h4 className="text-xs font-bold text-[#1B4D36]">FORECAST ENGINE</h4>
            <p className="text-[11px] text-[#2C5E45] mt-1">
              Statistical regressor computes bounded demand estimate.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#CCE3D5] text-[10px] font-mono font-bold text-[#1B4D36] bg-white p-1.5 rounded shadow-sm">
            Demand: 742 meals
          </div>
        </div>

        {/* Node 4: LLM Explanation */}
        <div className="bg-[#F8F4FF] rounded-xl p-4 border border-[#E5D7FA] flex flex-col justify-between relative group hover:border-[#7C3AED] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#6D28D9]">04</span>
              <Sparkles className="w-4 h-4 text-[#6D28D9]" />
            </div>
            <h4 className="text-xs font-bold text-[#6D28D9]">LLM REASONING</h4>
            <p className="text-[11px] text-[#5B21B6] mt-1">
              Gemini synthesizes context, sensor drift, and operational rationale.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5D7FA] text-[10px] text-[#4C1D95] bg-white p-1.5 rounded italic">
            &ldquo;Mid-week trend reflects -3.8% gate variance...&rdquo;
          </div>
        </div>

        {/* Node 5: Kitchen Prep Recommendation */}
        <div className="bg-[#FCF2EB] rounded-xl p-4 border border-[#F7DAC8] flex flex-col justify-between relative group hover:border-[#C6682F] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#B85720]">05</span>
              <UtensilsCrossed className="w-4 h-4 text-[#B85720]" />
            </div>
            <h4 className="text-xs font-bold text-[#B85720]">PREPARATION</h4>
            <p className="text-[11px] text-[#8C4212] mt-1">
              Forecast + safety margin establishes batch staging ceiling.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F7DAC8] text-[10px] font-mono font-bold text-[#B85720] bg-white p-1.5 rounded shadow-sm">
            Target: 760 (+18 buf)
          </div>
        </div>

        {/* Node 6: Closed Loop Learning */}
        <div className="bg-[#FAF9F5] rounded-xl p-4 border border-[#E8E6DE] flex flex-col justify-between relative group hover:border-[#141618] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#737A87]">06</span>
              <CheckCircle2 className="w-4 h-4 text-[#141618]" />
            </div>
            <h4 className="text-xs font-bold text-[#141618]">CLOSED LOOP</h4>
            <p className="text-[11px] text-[#6F7682] mt-1">
              Actual served logged to Supabase to recalibrate future weights.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#EAE8E0] text-[10px] font-mono text-[#141618] bg-white p-1.5 rounded">
            Delta feedback loop
          </div>
        </div>
      </div>

      {/* Comparison Rules: Never vs Instead */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#F0EFEB]">
        {/* Anti-Pattern */}
        <div className="p-4 rounded-xl bg-[#FDF2F0] border border-[#F6D0C9]">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-[#B92B27]" />
            <span className="text-xs font-bold text-[#B92B27] uppercase tracking-wider">
              INCORRECT (NEVER IN FOODFLOW)
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#F6D0C9] text-xs font-mono text-[#8C1D18] mb-2">
            &ldquo;Gemini predicted 742 meals for today&rdquo;
          </div>
          <p className="text-[11px] text-[#7A2724] leading-relaxed">
            LLMs cannot provide bounded mathematical guarantees. Treating generative models as primary numerical forecasters causes dangerous stockouts and erratic food preparation.
          </p>
        </div>

        {/* Correct Pattern */}
        <div className="p-4 rounded-xl bg-[#EAF4EE] border border-[#CCE3D5]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />
            <span className="text-xs font-bold text-[#1B4D36] uppercase tracking-wider">
              CORRECT (FOODFLOW ARCHITECTURE)
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-[#CCE3D5] text-xs space-y-1 mb-2">
            <div className="font-mono text-[11px] text-[#1B4D36]">
              <strong>FORECAST ENGINE:</strong> Predicted demand: 742 servings
            </div>
            <div className="italic text-[11px] text-[#525866]">
              <strong>AI INSIGHT (GEMINI):</strong> &ldquo;Based on recent Wednesday consumption and today&apos;s expected attendance, demand is likely to remain below the recent average.&rdquo;
            </div>
          </div>
          <p className="text-[11px] text-[#2C5E45] leading-relaxed">
            Exact mathematical precision for the numbers, human-level semantic reasoning for operational explanation and dynamic safety margins.
          </p>
        </div>
      </div>
    </div>
  );
}
