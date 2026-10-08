'use client';

import React from 'react';
import { 
  Users, 
  TrendingUp, 
  UtensilsCrossed, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Building2, 
  PlusCircle, 
  FileEdit, 
  Truck,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Clock
} from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { ForecastChart } from '@/components/ui/ForecastChart';
import { InsightCard } from '@/components/ui/InsightCard';
import { RiskIndicator } from '@/components/ui/RiskIndicator';
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
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              {DEMO_KITCHEN.name}
            </span>
            <span className="text-xs text-[#737A87]">
              • {DEMO_KITCHEN.shift}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Good morning, Kitchen Manager.
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Today&apos;s demand and food-flow overview.
          </p>
        </div>

        {/* Status / Quick Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-lg border border-[#E6E4DC] text-xs flex items-center gap-2 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#1B4D36]" />
            <span className="text-[#141618] font-medium">14:45 PM • Shift Wrap</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('forecast')}
            className="px-3.5 py-1.5 bg-[#141618] hover:bg-[#1B4D36] text-white text-xs font-medium rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Run New Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="EXPECTED DINERS"
          value={forecast.expectedDiners}
          unit="diners"
          subtext="Campus swipe-in + reserved guest count"
          icon={<Users className="w-4 h-4" />}
          badge={{ text: 'Badge Log', variant: 'neutral' }}
        />

        <KpiCard
          label="PREDICTED DEMAND"
          value={forecast.predictedDemand}
          unit="servings"
          subtext="Calculated by Statistical ML Regressor"
          icon={<TrendingUp className="w-4 h-4" />}
          badge={{ text: 'FORECAST ENGINE', variant: 'green' }}
          highlight
          accentColor="green"
        />

        <KpiCard
          label="RECOMMENDED PREPARATION"
          value={forecast.recommendedPreparation}
          unit="servings"
          subtext={`Includes +${forecast.bufferServings} safety margin`}
          icon={<UtensilsCrossed className="w-4 h-4" />}
          badge={{ text: '+2.4% Buffer', variant: 'amber' }}
          accentColor="amber"
        />

        <KpiCard
          label="SURPLUS DETECTED"
          value={consumption.surplusDetected}
          unit="servings"
          subtext="Eligible for immediate recovery transfer"
          icon={<AlertTriangle className="w-4 h-4" />}
          badge={{ text: 'Active Recovery', variant: 'amber' }}
        />
      </div>

      {/* Main Hero Card: FORECAST ENGINE SUMMARY */}
      <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-7 shadow-[0_2px_16px_rgba(20,22,24,0.03)] relative overflow-hidden">
        {/* Subtle accent header line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B4D36] via-[#2A7251] to-[#C6682F]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F0EFEB]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1B4D36] text-white px-2 py-0.5 rounded">
                FORECAST ENGINE
              </span>
              <span className="text-xs text-[#737A87]">
                Model: {forecast.engineVersion} • {forecast.calculatedAt}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141618]">
              Automated Mid-Week Demand Projection
            </h2>
            <p className="text-xs text-[#6F7682]">
              Strictly bounded statistical time-series computation based on 60-day historical logs.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-[#8A929E] block">
                Model Confidence
              </span>
              <span className="text-sm font-bold text-[#141618]">
                {forecast.confidence} (±18 servings std dev)
              </span>
            </div>
            <RiskIndicator level={forecast.riskLevel} />
          </div>
        </div>

        {/* Number Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#EAE8E0]">
            <span className="text-[10px] font-semibold uppercase text-[#737A87] block mb-1">
              Expected Diners
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#141618]">
              {forecast.expectedDiners}
            </div>
            <span className="text-[11px] text-[#8A929E] mt-0.5 block">
              Registered total
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#EAE8E0]">
            <span className="text-[10px] font-semibold uppercase text-[#737A87] block mb-1">
              Historical Average
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#525866]">
              {forecast.historicalAverage}
            </div>
            <span className="text-[11px] text-[#8A929E] mt-0.5 block">
              Wednesday baseline
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#EAF4EE] border border-[#CCE3D5]">
            <span className="text-[10px] font-semibold uppercase text-[#1B4D36] block mb-1">
              Forecast Engine Output
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#1B4D36]">
              {forecast.predictedDemand}
            </div>
            <span className="text-[11px] text-[#2C5E45] mt-0.5 block font-medium">
              Predicted demand
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FCF2EB] border border-[#F7DAC8]">
            <span className="text-[10px] font-semibold uppercase text-[#B85720] block mb-1">
              Recommended Preparation
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#B85720]">
              {forecast.recommendedPreparation}
            </div>
            <span className="text-[11px] text-[#8C4212] mt-0.5 block font-medium">
              +{forecast.bufferServings} safety margin
            </span>
          </div>
        </div>

        {/* Non-LLM Mathematical Guarantee Notice */}
        <div className="pt-2 text-[11px] text-[#8A929E] flex items-center justify-between">
          <span>* Labeled explicitly as FORECAST ENGINE — not generated by generative language models.</span>
          <span className="font-mono text-[10px]">VERIFIED BOUNDS</span>
        </div>
      </div>

      {/* Forecast Visualization Chart */}
      <ForecastChart />

      {/* AI Insight Panel (Powered by Gemini) */}
      <InsightCard
        explanation={explanation}
        onAdjust={() => onNavigate('forecast')}
      />

      {/* Quick Operational Actions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#141618]">
            Operational Workflow Quick Actions
          </h3>
          <span className="text-xs text-[#737A87]">
            Direct handoff to pipeline modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Generate Forecast */}
          <button
            type="button"
            onClick={() => onNavigate('forecast')}
            className="text-left p-5 rounded-xl border border-[#E6E4DC] bg-white hover:bg-[#FAF9F5] hover:border-[#141618] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#EAF4EE] text-[#1B4D36] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#141618] group-hover:text-[#1B4D36]">
                Generate Forecast
              </h4>
              <p className="text-xs text-[#6F7682] mt-1 leading-relaxed">
                Adjust expected diner counts, select upcoming recipes, and simulate demand with ML regressors.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4D36] mt-4 pt-3 border-t border-[#F0EFEB]">
              <span>Configure Forecast Parameters</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 2: Update Consumption */}
          <button
            type="button"
            onClick={() => onNavigate('consumption')}
            className="text-left p-5 rounded-xl border border-[#E6E4DC] bg-white hover:bg-[#FAF9F5] hover:border-[#141618] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#FAF0E6] text-[#B85720] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileEdit className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#141618] group-hover:text-[#B85720]">
                Update Consumption
              </h4>
              <p className="text-xs text-[#6F7682] mt-1 leading-relaxed">
                Record actual meals served, detect leftover trays, and trigger automated Gemini mismatch analysis.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B85720] mt-4 pt-3 border-t border-[#F0EFEB]">
              <span>Log Shift Actuals (728 served)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 3: List Surplus */}
          <button
            type="button"
            onClick={() => onNavigate('recovery')}
            className="text-left p-5 rounded-xl border border-[#E6E4DC] bg-white hover:bg-[#FAF9F5] hover:border-[#141618] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#F0EFEB] text-[#141618] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#141618]">
                List Surplus
              </h4>
              <p className="text-xs text-[#6F7682] mt-1 leading-relaxed">
                Publish active 32-serving pan listing to nearby verified non-profit pantries within the 2-hour window.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#141618] mt-4 pt-3 border-t border-[#F0EFEB]">
              <span>Manage Active Recovery (32 pans)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
