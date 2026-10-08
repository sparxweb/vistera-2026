'use client';

import React from 'react';
import { 
  RotateCw, 
  TrendingUp, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Sparkles,
  BarChart2,
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { DEMO_HISTORY } from '@/lib/demoData';
import { ScreenId } from '@/components/layout/Header';
import { HistoryRecord } from '@/types/foodflow';

interface HistoryScreenProps {
  onNavigate: (screen: ScreenId) => void;
  history?: HistoryRecord[];
}

export function HistoryScreen({ onNavigate, history: propHistory }: HistoryScreenProps) {
  const history = propHistory && propHistory.length > 0 ? propHistory : DEMO_HISTORY;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              MODULE 05 • CLOSED LOOP RECALIBRATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            FOODFLOW is always learning.
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Every shift variance is fed back into Supabase PostgreSQL to continuously tighten predictive boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase bg-[#FAF0E6] text-[#B85720] px-2.5 py-1 rounded-full border border-[#F2D7C2]">
            DEMO DATA LAYER
          </span>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737A87]">
              Average Shift Deviation
            </span>
            <span className="text-[10px] font-mono text-[#8A929E]">DEMO DATA</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#141618]">±18</span>
            <span className="text-xs font-semibold text-[#525866]">servings / shift</span>
          </div>
          <p className="text-[11px] text-[#6F7682] mt-1">
            Rolling 30-day mean absolute error against actual consumption
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737A87]">
              Accuracy Drift Trend
            </span>
            <span className="text-[10px] font-mono text-[#8A929E]">DEMO DATA</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#1B4D36]">+4.2%</span>
            <span className="text-xs font-semibold text-[#1B4D36]">tighter margin</span>
          </div>
          <p className="text-[11px] text-[#6F7682] mt-1">
            Variance reduction since incorporating badge turnstile sensor stream
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737A87]">
              Non-Stockout Service Level
            </span>
            <span className="text-[10px] font-mono text-[#8A929E]">DEMO DATA</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#141618]">99.1%</span>
            <span className="text-xs font-semibold text-[#1B4D36]">reliability</span>
          </div>
          <p className="text-[11px] text-[#6F7682] mt-1">
            Zero mid-service food shortages recorded during peak hours
          </p>
        </div>
      </div>

      {/* FORECAST HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-[#E6E4DC] shadow-[0_2px_16px_rgba(20,22,24,0.02)] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#F0EFEB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#141618]">
              Forecast History & Operational Variance Log
            </h3>
            <p className="text-xs text-[#6F7682] mt-0.5">
              Historical comparisons of numerical forecasts versus actual served counts
            </p>
          </div>

          <div className="text-xs text-[#8A929E] font-mono">
            PERSISTED IN SUPABASE / POSTGRESQL
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-[#EAE8E0] text-[10px] font-semibold uppercase tracking-wider text-[#737A87]">
              <tr>
                <th className="py-3 px-4">Date / Day</th>
                <th className="py-3 px-4">Diners Logged</th>
                <th className="py-3 px-4">Engine Forecast</th>
                <th className="py-3 px-4">Prepared (Buffer)</th>
                <th className="py-3 px-4">Actual Served</th>
                <th className="py-3 px-4">Difference</th>
                <th className="py-3 px-4">Surplus Result</th>
                <th className="py-3 px-4">Recovery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEB]">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#141618]">
                    {row.date} ({row.day})
                  </td>
                  <td className="py-3 px-4 text-[#585E68]">
                    {row.diners}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#1B4D36]">
                    {row.forecast}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#B85720]">
                    {row.prepared}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#141618]">
                    {row.actualServed}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">
                    <span className={row.variance >= 0 ? 'text-[#1B4D36]' : 'text-[#B85720]'}>
                      {row.variance > 0 ? `+${row.variance}` : row.variance}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#141618]">
                    {row.surplus} servings
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      row.recoveryStatus === 'Recovered'
                        ? 'bg-[#EBF5EF] text-[#1B4D36] border-[#D0E7DA]'
                        : 'bg-[#FAF9F5] text-[#585E68] border-[#E2E0D8]'
                    }`}>
                      {row.recoveryStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Closed-Loop Visual Learning Cycle */}
      <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-8 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              CLOSED FEEDBACK CYCLE
            </span>
            <h3 className="text-lg font-bold text-[#141618] mt-1">
              Autonomous Recalibration Cycle
            </h3>
          </div>
          <span className="text-xs text-[#737A87]">
            Delta variance feeds back into statistical weights
          </span>
        </div>

        {/* 5-Stage Cyclic Loop */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] font-mono font-bold text-[#1B4D36] block mb-1">01</span>
            <h4 className="text-xs font-bold text-[#141618]">FORECAST</h4>
            <p className="text-[11px] text-[#6F7682] mt-1">
              742 servings projected
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] font-mono font-bold text-[#141618] block mb-1">02</span>
            <h4 className="text-xs font-bold text-[#141618]">ACTUAL</h4>
            <p className="text-[11px] text-[#6F7682] mt-1">
              728 served recorded
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] font-mono font-bold text-[#B85720] block mb-1">03</span>
            <h4 className="text-xs font-bold text-[#141618]">OUTCOME</h4>
            <p className="text-[11px] text-[#6F7682] mt-1">
              32 surplus recovered
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] font-mono font-bold text-[#141618] block mb-1">04</span>
            <h4 className="text-xs font-bold text-[#141618]">HISTORICAL DATA</h4>
            <p className="text-[11px] text-[#6F7682] mt-1">
              Logged to PostgreSQL
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#EAF4EE] border border-[#CCE3D5]">
            <span className="text-[10px] font-mono font-bold text-[#1B4D36] block mb-1">05</span>
            <h4 className="text-xs font-bold text-[#1B4D36]">NEXT FORECAST</h4>
            <p className="text-[11px] text-[#2C5E45] mt-1 font-medium">
              Weights adjusted
            </p>
          </div>
        </div>

        {/* Large Editorial Statement */}
        <div className="pt-6 border-t border-[#F0EFEB] text-center">
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#141618]">
            &ldquo;Every meal becomes a data point for the next decision.&rdquo;
          </p>
          <p className="text-xs text-[#6F7682] mt-2 max-w-lg mx-auto">
            FOODFLOW turns institutional food production from a cycle of recurring guesswork into an evolving, high-precision operations system.
          </p>
        </div>
      </div>
    </div>
  );
}
