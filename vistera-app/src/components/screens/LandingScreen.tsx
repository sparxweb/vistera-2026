'use client';

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Snowflake,
  Cpu,
  ChevronRight,
  Database
} from 'lucide-react';
import { Timeline } from '@/components/ui/Timeline';
import { ScreenId } from '@/components/layout/Header';

interface LandingScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export function LandingScreen({ onNavigate }: LandingScreenProps) {
  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E6E4DC] text-xs font-mono text-[#585E68]">
              <span className="w-2 h-2 rounded-full bg-[#1B4D36] animate-pulse" />
              <span>PS-44 • Cutting Institutional Food Waste</span>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-[#1B4D36]">
                FOODFLOW • Predict. Prevent. Recover.
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#141618] leading-[1.08]">
                Cook for the demand.
                <br />
                <span className="text-[#1B4D36]">Not for the guess.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#525866] max-w-xl font-normal leading-relaxed pt-2">
                FOODFLOW helps institutional kitchens forecast demand, reduce avoidable overproduction, and responsibly recover eligible surplus through a closed-loop data architecture.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 bg-[#141618] hover:bg-[#1B4D36] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <span>Open Kitchen Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('architecture')}
                className="px-5 py-3.5 bg-white hover:bg-[#F4F3ED] text-[#141618] border border-[#E6E4DC] rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-4 h-4 text-[#8A929E]" />
              </button>
            </div>

            {/* Core Principle Badge */}
            <div className="pt-4 border-t border-[#F0EFEB] flex items-center gap-6 text-xs text-[#6F7682]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />
                <span>Deterministic ML Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />
                <span>Gemini Cognitive Rationale</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />
                <span>Zero Hallucination Claims</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic Abstract Food Flow Visualization (No Robots!) */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-b from-[#F5F4EE] to-[#EBE9E1] rounded-3xl p-6 border border-[#E6E4DC] shadow-[0_12px_40px_rgba(20,22,24,0.06)] overflow-hidden flex flex-col justify-between">
              {/* Top Status */}
              <div className="flex items-center justify-between text-xs z-10">
                <span className="font-mono text-[11px] font-bold text-[#141618]">
                  DYNAMIC FLOW HARMONIC
                </span>
                <span className="text-[10px] font-semibold uppercase bg-white/90 px-2 py-0.5 rounded-full border border-[#D4D1C6] text-[#1B4D36]">
                  742 Servings Equilibrium
                </span>
              </div>

              {/* Abstract Visual Nodes & Harmonic Flow Lines */}
              <div className="relative my-auto w-full h-56 flex items-center justify-center">
                <svg viewBox="0 0 300 240" className="w-full h-full">
                  <defs>
                    <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8A929E" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#1B4D36" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#C6682F" stopOpacity="0.6" />
                    </linearGradient>

                    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1B4D36" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#1B4D36" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Concentric balance rings */}
                  <circle cx="150" cy="120" r="90" fill="url(#sunGlow)" />
                  <circle cx="150" cy="120" r="75" fill="none" stroke="#E0DDCF" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="150" cy="120" r="45" fill="none" stroke="#1B4D36" strokeWidth="1.5" strokeOpacity="0.4" />

                  {/* Flow trajectory curves */}
                  <path
                    d="M 20 180 C 80 180, 100 80, 150 120 C 200 160, 220 60, 280 60"
                    fill="none"
                    stroke="url(#flowGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Node 1: Historical Influx */}
                  <g className="cursor-pointer">
                    <circle cx="50" cy="170" r="14" fill="#FFFFFF" stroke="#8A929E" strokeWidth="2" />
                    <text x="50" y="174" textAnchor="middle" fontSize="9" fontWeight="600" fill="#141618">DB</text>
                    <text x="50" y="198" textAnchor="middle" fontSize="8" fill="#737A87">Historical Log</text>
                  </g>

                  {/* Node 2: Center Predictive Nucleus */}
                  <g className="cursor-pointer">
                    <circle cx="150" cy="120" r="22" fill="#1B4D36" stroke="#FFFFFF" strokeWidth="3" />
                    <text x="150" y="124" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">742</text>
                    <text x="150" y="156" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#1B4D36">FORECAST</text>
                  </g>

                  {/* Node 3: Staged Preparation */}
                  <g className="cursor-pointer">
                    <circle cx="210" cy="90" r="12" fill="#FFFFFF" stroke="#C6682F" strokeWidth="2" />
                    <text x="210" y="93" textAnchor="middle" fontSize="8" fontWeight="600" fill="#B85720">760</text>
                    <text x="210" y="114" textAnchor="middle" fontSize="8" fill="#8C4212">Buffer (+18)</text>
                  </g>

                  {/* Node 4: Recovery Outflow */}
                  <g className="cursor-pointer">
                    <circle cx="270" cy="65" r="10" fill="#FFFFFF" stroke="#141618" strokeWidth="1.5" />
                    <text x="270" y="68" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#141618">NGO</text>
                    <text x="270" y="88" textAnchor="middle" fontSize="8" fill="#737A87">Recovery</text>
                  </g>
                </svg>
              </div>

              {/* Bottom Metrics Pill */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-[#E6E4DC] flex items-center justify-between text-xs z-10">
                <div>
                  <span className="text-[10px] text-[#8A929E] uppercase block">Avoidable Waste</span>
                  <span className="font-semibold text-[#1B4D36]">-48.2% Reduction</span>
                </div>
                <div className="h-6 w-[1px] bg-[#EAE8E0]" />
                <div>
                  <span className="text-[10px] text-[#8A929E] uppercase block">Service Reliability</span>
                  <span className="font-semibold text-[#141618]">99.1% Non-Stockout</span>
                </div>
                <div className="h-6 w-[1px] bg-[#EAE8E0]" />
                <div>
                  <span className="text-[10px] text-[#8A929E] uppercase block">Recovery Speed</span>
                  <span className="font-semibold text-[#B85720]">&lt; 45 min Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — THE PROBLEM */}
      <section className="relative">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B85720] bg-[#FAF0E6] px-2.5 py-1 rounded-full border border-[#F2D7C2]">
            THE INSTITUTIONAL DILEMMA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141618]">
            &ldquo;Every kitchen is balancing two risks.&rdquo;
          </h2>
          <p className="text-sm text-[#6F7682]">
            Without reliable forecasting, institutional dining managers are trapped between wasteful excess and kitchen stockout crises.
          </p>
        </div>

        {/* Two Balancing Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Overproduction Panel */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6E4DC] shadow-[0_2px_16px_rgba(20,22,24,0.02)] relative group hover:border-[#F6D0C9] transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B92B27]">
                RISK 01
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FDF0ED] text-[#B92B27] flex items-center justify-center font-bold text-xs">
                +Δ
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#141618] mb-3">
              OVERPRODUCTION
            </h3>

            <div className="space-y-2.5 text-xs text-[#525866]">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B92B27]" />
                <span>Too much prepared under fearful assumptions</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B92B27]" />
                <span>Large volumes of unserved perishable leftovers</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B92B27]" />
                <span>Avoidable organic waste sent to landfill</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B92B27]" />
                <span>Lost ingredient costs, labor, and energy</span>
              </div>
            </div>
          </div>

          {/* Underproduction Panel */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6E4DC] shadow-[0_2px_16px_rgba(20,22,24,0.02)] relative group hover:border-[#F7DAC8] transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B85720]">
                RISK 02
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FCF2EB] text-[#B85720] flex items-center justify-center font-bold text-xs">
                -Δ
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#141618] mb-3">
              UNDERPRODUCTION
            </h3>

            <div className="space-y-2.5 text-xs text-[#525866]">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B85720]" />
                <span>Too little prepared from aggressive cutbacks</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B85720]" />
                <span>Kitchen shortage mid-service during peak turnstile rush</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B85720]" />
                <span>Poor meal availability for students and staff</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B85720]" />
                <span>Severe diner dissatisfaction and operational complaints</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Golden Mean Statement */}
        <div className="mt-8 p-5 bg-[#FAF9F5] rounded-xl border border-[#E6E4DC] text-center max-w-xl mx-auto flex items-center justify-center gap-3">
          <Scale className="w-5 h-5 text-[#1B4D36] shrink-0" />
          <p className="text-sm font-semibold text-[#141618]">
            FOODFLOW helps kitchens find the balance.
          </p>
        </div>
      </section>

      {/* SECTION — HOW FOODFLOW WORKS (HORIZONTAL TIMELINE) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-1 rounded-full border border-[#D0E7DA]">
              THE 7-STAGE CLOSED LOOP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618] mt-2">
              How FOODFLOW Operates
            </h2>
          </div>
          <p className="text-xs text-[#6F7682] max-w-sm">
            Hover over any stage to inspect the underlying system owner and operational handoff.
          </p>
        </div>

        <Timeline onSelectStage={(idx) => {}} />
      </section>

      {/* SECTION — QUICK JUMP TO ALL 7 OPERATIONAL SCREENS */}
      <section className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,22,24,0.02)]">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB] mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#141618]">
              Explore Prototype Screens
            </h3>
            <p className="text-xs text-[#6F7682] mt-0.5">
              Every workflow step is fully navigable with interactive prototype state and demo data.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#8A929E]">
            PROTOTYPE v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'dashboard' as ScreenId, title: '01. Command Center', desc: 'Active shift KPI summary, demand chart, and Gemini insight' },
            { id: 'forecast' as ScreenId, title: '02. Demand Forecast', desc: 'Predictive parameter generator with confidence & factor analysis' },
            { id: 'consumption' as ScreenId, title: '03. Consumption & Analysis', desc: 'Actuals input, mismatch attribution, and delta recommendations' },
            { id: 'recovery' as ScreenId, title: '04. Surplus Recovery', desc: 'Pan listing creation and dispatch status tracking timeline' },
            { id: 'organizations' as ScreenId, title: '05. Organizations & Map', desc: 'Verified local NGO partners and vector logistics map' },
            { id: 'history' as ScreenId, title: '06. History & Learning', desc: 'Closed-loop data feedback and model accuracy improvements' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="text-left p-4 rounded-xl border border-[#E8E6DE] bg-[#FAF9F5] hover:bg-white hover:border-[#141618] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#141618] group-hover:text-[#1B4D36]">
                  {item.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8A929E] group-hover:text-[#1B4D36] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-[#6F7682] leading-relaxed">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
