'use client';

import React from 'react';
import { 
  ArrowRight, 
  Scale, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  UtensilsCrossed,
  Truck,
  Leaf,
  Users,
  Building2,
  DollarSign
} from 'lucide-react';
import { Timeline } from '@/components/ui/Timeline';
import { ScreenId } from '@/components/layout/Header';

interface LandingScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export function LandingScreen({ onNavigate }: LandingScreenProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 02. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Cinematic Editorial Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4EE] border border-[#E5E5DE] text-xs font-mono text-[#5C6658]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>PS-44 • Cutting Institutional Food Waste</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0E382B] leading-[1.08]">
                Cook for the demand.
                <br />
                <span className="text-[#164E3D]">Not for the guess.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#5C6658] max-w-xl font-normal leading-relaxed">
                FOODFLOW helps institutional kitchens predict demand, prepare smarter, monitor consumption, and responsibly recover eligible surplus.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
              >
                <span>Open Kitchen Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="px-5 py-3.5 bg-white hover:bg-[#F4F4EE] text-[#0E382B] border border-[#E5E5DE] rounded-xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-4 h-4 text-[#8A929E]" />
              </button>
            </div>

            {/* Subtext Guarantees */}
            <div className="pt-4 border-t border-[#E5E5DE] flex flex-wrap items-center gap-6 text-xs text-[#5C6658]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>Deterministic Demand Forecasting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>Zero Hallucinated Numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>Verified Local Partner Recovery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Operational Visual Surface */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-b from-[#F4F4EE] to-[#EBEBE3] rounded-3xl p-6 border border-[#E5E5DE] shadow-[0_12px_40px_rgba(14,56,43,0.06)] overflow-hidden flex flex-col justify-between">
              {/* Top Status */}
              <div className="flex items-center justify-between text-xs z-10">
                <span className="font-mono text-[11px] font-bold text-[#0E382B] tracking-wider uppercase">
                  ACTIVE SHIFT STATUS
                </span>
                <span className="text-[10px] font-semibold uppercase bg-white/90 px-2 py-0.5 rounded-full border border-[#D5D5CA] text-[#0E382B]">
                  LUNCH SERVICE
                </span>
              </div>

              {/* Central Flow Nodes SVG */}
              <div className="relative my-auto w-full h-56 flex items-center justify-center">
                <svg viewBox="0 0 300 240" className="w-full h-full">
                  <defs>
                    <linearGradient id="foodFlowGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7D8878" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#0E382B" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
                    </linearGradient>

                    <radialGradient id="softAura" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0E382B" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0E382B" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <circle cx="150" cy="120" r="90" fill="url(#softAura)" />
                  <circle cx="150" cy="120" r="75" fill="none" stroke="#D5D5CA" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="150" cy="120" r="45" fill="none" stroke="#0E382B" strokeWidth="1.5" strokeOpacity="0.3" />

                  {/* Flow trajectory */}
                  <path
                    d="M 20 180 C 80 180, 100 80, 150 120 C 200 160, 220 60, 280 60"
                    fill="none"
                    stroke="url(#foodFlowGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Node 1: Historical Log */}
                  <g>
                    <circle cx="50" cy="170" r="14" fill="#FFFFFF" stroke="#7D8878" strokeWidth="2" />
                    <text x="50" y="174" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0E382B">LOG</text>
                    <text x="50" y="198" textAnchor="middle" fontSize="8" fill="#5C6658">History</text>
                  </g>

                  {/* Node 2: Forecast Demand */}
                  <g>
                    <circle cx="150" cy="120" r="22" fill="#0E382B" stroke="#FFFFFF" strokeWidth="3" />
                    <text x="150" y="124" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">742</text>
                    <text x="150" y="156" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#0E382B">PREDICTED</text>
                  </g>

                  {/* Node 3: Prepared Staging */}
                  <g>
                    <circle cx="210" cy="90" r="12" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
                    <text x="210" y="93" textAnchor="middle" fontSize="8" fontWeight="600" fill="#D97706">760</text>
                    <text x="210" y="114" textAnchor="middle" fontSize="8" fill="#5C6658">Prepared</text>
                  </g>

                  {/* Node 4: Recovery Route */}
                  <g>
                    <circle cx="270" cy="65" r="10" fill="#FFFFFF" stroke="#0E382B" strokeWidth="1.5" />
                    <text x="270" y="68" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0E382B">NGO</text>
                    <text x="270" y="88" textAnchor="middle" fontSize="8" fill="#5C6658">Recovery</text>
                  </g>
                </svg>
              </div>

              {/* Bottom Operational Pill */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-[#E5E5DE] flex items-center justify-between text-xs z-10">
                <div>
                  <span className="text-[10px] text-[#7D8878] uppercase block">Predicted</span>
                  <span className="font-bold text-[#0E382B]">742 meals</span>
                </div>
                <div className="h-6 w-[1px] bg-[#E5E5DE]" />
                <div>
                  <span className="text-[10px] text-[#7D8878] uppercase block">Recommended Prep</span>
                  <span className="font-bold text-[#0E382B]">760 meals</span>
                </div>
                <div className="h-6 w-[1px] bg-[#E5E5DE]" />
                <div>
                  <span className="text-[10px] text-[#7D8878] uppercase block">Eligible Surplus</span>
                  <span className="font-bold text-[#D97706]">32 meals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. THE PROBLEM */}
      <section id="the-problem" className="relative scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FDE68A]">
            THE INSTITUTIONAL DILEMMA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0E382B]">
            Every kitchen is solving the same uncertainty.
          </h2>
          <p className="text-sm text-[#5C6658]">
            Without reliable forecasting, institutional dining operations are torn between wasteful excess and kitchen shortages.
          </p>
        </div>

        {/* Two Visual States */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative max-w-4xl mx-auto">
          {/* TOO MUCH */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DE] shadow-sm relative group hover:border-[#FCA5A5] transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                STATE 01
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#FEE2E2] text-[#DC2626]">
                TOO MUCH
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0E382B] mb-4">
              Overproduction
            </h3>

            <div className="space-y-3 text-xs text-[#5C6658]">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FBFBF9]">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                <span><strong>Overproduction:</strong> Too much food prepared on gut feeling.</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FBFBF9]">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                <span><strong>Food wasted:</strong> Trays of unserved meals left after service.</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FBFBF9]">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                <span><strong>Cost lost:</strong> Wasted budget on raw ingredients and prep energy.</span>
              </div>
            </div>
          </div>

          {/* TOO LITTLE */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DE] shadow-sm relative group hover:border-[#FDE68A] transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                STATE 02
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#FEF3C7] text-[#D97706]">
                TOO LITTLE
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0E382B] mb-4">
              Shortage
            </h3>

            <div className="space-y-3 text-xs text-[#5C6658]">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FBFBF9]">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <span><strong>Shortage:</strong> Severe cutbacks lead to empty pans mid-rush.</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FBFBF9]">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <span><strong>Diners disappointed:</strong> Students and staff miss out on meals.</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FBFBF9]">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <span><strong>Kitchen under pressure:</strong> Emergency prep disrupts crew workflow.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Balance Statement */}
        <div className="mt-8 p-4 bg-[#F4F4EE] rounded-xl border border-[#E5E5DE] text-center max-w-xl mx-auto flex items-center justify-center gap-3">
          <Scale className="w-5 h-5 text-[#0E382B] shrink-0" />
          <p className="text-sm font-semibold text-[#0E382B]">
            FOODFLOW helps kitchens find the balance.
          </p>
        </div>
      </section>

      {/* 04. PRODUCT EXPLANATION — 3 CONCEPTS */}
      <section className="relative">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-3 py-1 rounded-full border border-[#C5DACD]">
            THE FOUNDATION
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Three steps. Complete clarity.
          </h2>
          <p className="text-sm text-[#5C6658]">
            Simple on the surface, powered by reliable engineering underneath.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* 01 PREDICT */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5DE] shadow-sm space-y-4 hover:border-[#0E382B] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#7D8878]">01</span>
              <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] text-[#0E382B] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#0E382B]">PREDICT</h3>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Know expected demand ahead of time using historical attendance patterns and context factors.
            </p>
          </div>

          {/* 02 DECIDE */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5DE] shadow-sm space-y-4 hover:border-[#0E382B] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#7D8878]">02</span>
              <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] text-[#0E382B] flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#0E382B]">DECIDE</h3>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Recommend how much to prepare with smart batch staging and a safe buffer margin.
            </p>
          </div>

          {/* 03 RECOVER */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5DE] shadow-sm space-y-4 hover:border-[#0E382B] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#7D8878]">03</span>
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#0E382B]">RECOVER</h3>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Route eligible, unserved surplus responsibly to verified local food recovery partners.
            </p>
          </div>
        </div>
      </section>

      {/* 05. THE 7-STAGE CLOSED LOOP */}
      <section id="how-it-works" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-3 py-1 rounded-full border border-[#C5DACD]">
              OPERATIONAL CYCLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B] mt-2">
              The 7-Stage Continuous Loop
            </h2>
          </div>
          <p className="text-xs text-[#5C6658] max-w-sm">
            Hover over any stage to view the operational responsibility and handoff.
          </p>
        </div>

        <Timeline onSelectStage={() => {}} />
      </section>

      {/* 06. PRODUCT PREVIEW — CINEMATIC DASHBOARD CARD */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-3 py-1 rounded-full border border-[#C5DACD]">
            LIVE INTERFACE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Kitchen Control Center
          </h2>
          <p className="text-xs text-[#5C6658]">
            One unified status view. One clear next action. No clutter.
          </p>
        </div>

        {/* Dashboard Preview Surface */}
        <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-10 shadow-[0_16px_48px_rgba(14,56,43,0.06)] max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5DE]">
            <div>
              <div className="text-xs font-mono text-[#7D8878] uppercase">WEDNESDAY LUNCH SERVICE</div>
              <h3 className="text-xl font-bold text-[#0E382B] mt-0.5">Campus Central Dining Hall</h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8EFEA] text-xs font-bold text-[#0E382B]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>SERVICE STATUS: ON TRACK</span>
            </div>
          </div>

          {/* Key Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8">
            <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
              <div className="text-xs text-[#7D8878]">Predicted Demand</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">742</div>
              <div className="text-[10px] text-[#5C6658] mt-0.5">Statistical forecast</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
              <div className="text-xs text-[#7D8878]">Recommended Prep</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">760</div>
              <div className="text-[10px] text-[#5C6658] mt-0.5">+18 safety buffer</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
              <div className="text-xs text-[#7D8878]">Meals Served</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#0E382B] mt-1">728</div>
              <div className="text-[10px] text-[#5C6658] mt-0.5">Turnstile headcounts</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A]">
              <div className="text-xs text-[#D97706] font-semibold">Current Surplus</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#D97706] mt-1">32</div>
              <div className="text-[10px] text-[#B45309] mt-0.5">Eligible for recovery</div>
            </div>
          </div>

          {/* Single Primary Action Banner */}
          <div className="p-5 rounded-2xl bg-[#F4F4EE] border border-[#E5E5DE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
                POTENTIAL SURPLUS DETECTED
              </div>
              <div className="text-xs text-[#5C6658] mt-0.5">
                32 unserved servings ready for immediate dispatch before safe time limit expires.
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('recovery')}
              className="px-5 py-2.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Review Surplus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 07. RECOVERY SPOTLIGHT */}
      <section className="bg-white rounded-3xl border border-[#E5E5DE] p-8 sm:p-12 max-w-4xl mx-auto shadow-sm">
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FDE68A]">
            CIRCULAR RECOVERY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            &ldquo;Don&apos;t let today&apos;s surplus become tomorrow&apos;s waste.&rdquo;
          </h2>
          <p className="text-sm text-[#5C6658] max-w-2xl leading-relaxed">
            When unexpected meal surplus occurs, FOODFLOW helps kitchen staff package, categorize, and dispatch hot or cold trays to verified food rescue organizations and community kitchens within safe time windows.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('recovery')}
              className="px-6 py-3 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Surplus Recovery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('organizations')}
              className="px-5 py-3 bg-white text-[#0E382B] border border-[#E5E5DE] hover:bg-[#F4F4EE] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              View Verified Partner Map
            </button>
          </div>
        </div>
      </section>

      {/* 08. IMPACT PILLARS */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-3 py-1 rounded-full border border-[#C5DACD]">
            REAL-WORLD VALUE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Built for Sustainable Dining Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5DE] shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#0E382B] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0E382B]">Economic</h3>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Curbs procurement budget waste by aligning prep orders tightly with genuine diner headcount patterns.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5DE] shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#0E382B] flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0E382B]">Environmental</h3>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Prevents edible prepared food from decomposing in landfills and producing methane emissions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5DE] shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#0E382B] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0E382B]">Operational</h3>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Removes morning guesswork for head chefs through structured batch staging and clear safety buffers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5DE] shadow-sm space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0E382B]">Social</h3>
            <p className="text-xs text-[#5C6658] leading-relaxed">
              Channels safe surplus directly to local charities and shelters before food safety windows expire.
            </p>
          </div>
        </div>
      </section>

      {/* 09. FINAL CTA */}
      <section className="bg-gradient-to-br from-[#0E382B] to-[#164E3D] rounded-3xl p-8 sm:p-14 text-white text-center max-w-4xl mx-auto shadow-lg space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Cook smarter. Waste less.
        </h2>
        <p className="text-sm sm:text-base text-[#D0E7DA] max-w-lg mx-auto leading-relaxed">
          Experience the complete closed-loop food waste prevention system built for institutional scale.
        </p>
        <div>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 bg-white text-[#0E382B] hover:bg-[#F4F4EE] rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Open Kitchen Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
