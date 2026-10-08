'use client';

import React from 'react';
import { 
  RotateCw, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
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
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
              CONTINUOUS LEARNING • STEP 06
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            LEARN FROM EVERY SERVICE
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Every shift outcome recalibrates next week&apos;s demand baseline automatically.
          </p>
        </div>

        <div className="text-[10px] font-mono uppercase bg-[#E8EFEA] text-[#0E382B] px-3 py-1 rounded-full border border-[#C5DACD] self-start sm:self-auto font-semibold">
          FEEDBACK LOOP ACTIVE
        </div>
      </div>

      {/* TOP 3 SUMMARY PILLARS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Forecast Accuracy */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
            Forecast Accuracy
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0E382B] mt-1">
            96.8%
          </div>
          <p className="text-xs text-[#5C6658] mt-1">
            Mean average precision on rolling 30-day shift predictions
          </p>
        </div>

        {/* Surplus Trends */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
            Surplus Trends
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706] mt-1">
            28 avg
          </div>
          <p className="text-xs text-[#5C6658] mt-1">
            Servings surplus per shift • 88% routed to community partners
          </p>
        </div>

        {/* Shortage Events */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
            Shortage Events
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0E382B] mt-1">
            0 events
          </div>
          <p className="text-xs text-[#5C6658] mt-1">
            Zero dining turnstile stockouts recorded this month
          </p>
        </div>
      </div>

      {/* CLEAN SERVICE LOG TABLE */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E5E5DE] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0E382B]">
              Shift History Log
            </h3>
            <p className="text-xs text-[#5C6658]">
              Comparison of predicted demand, kitchen staging, and recovery outcome
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#7D8878]">
            {history.length} records logged
          </span>
        </div>

        {/* DESKTOP TABLE: 7 COLUMNS ONLY */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBFBF9] border-b border-[#E5E5DE] text-[10px] font-bold uppercase tracking-wider text-[#7D8878]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Menu</th>
                <th className="py-3 px-4 text-center">Predicted</th>
                <th className="py-3 px-4 text-center">Prepared</th>
                <th className="py-3 px-4 text-center">Served</th>
                <th className="py-3 px-4 text-center">Result</th>
                <th className="py-3 px-4 text-right">Recovery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5DE]">
              {history.map((row, idx) => {
                const surplusVal = Math.max(0, row.prepared - row.actualServed);
                const isMatch = surplusVal === 0 && row.actualServed <= row.prepared;

                return (
                  <tr key={idx} className="hover:bg-[#FBFBF9] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0E382B]">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-4 text-[#5C6658]">
                      {row.day === 'Wed' ? 'Rice + Dal + Chicken' : row.day === 'Tue' ? 'Roasted Chicken Farro' : 'Lentil Dahl & Rice'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0E382B]">
                      {row.forecast}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#5C6658]">
                      {row.prepared}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-[#0E382B]">
                      {row.actualServed}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {surplusVal > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                          +{surplusVal} surplus
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8EFEA] text-[#0E382B] border border-[#C5DACD]">
                          Balanced
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-[#5C6658]">
                      {row.recoveryStatus === 'Recovered' ? (
                        <span className="text-[#0E382B] font-semibold">
                          {row.surplus > 0 ? `${row.surplus} pans recovered` : 'Recovered'}
                        </span>
                      ) : (
                        <span className="text-[#7D8878]">{row.recoveryStatus}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS: Converts rows into cards on small screens */}
        <div className="md:hidden divide-y divide-[#E5E5DE]">
          {history.map((row, idx) => {
            const surplusVal = Math.max(0, row.prepared - row.actualServed);

            return (
              <div key={idx} className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0E382B]">{row.date} ({row.day})</span>
                  {surplusVal > 0 ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
                      +{surplusVal} surplus
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8EFEA] text-[#0E382B]">
                      Balanced
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 text-center bg-[#FBFBF9] rounded-xl border border-[#E5E5DE]">
                  <div>
                    <span className="text-[10px] text-[#7D8878] block">Predicted</span>
                    <span className="font-bold text-[#0E382B]">{row.forecast}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7D8878] block">Prepared</span>
                    <span className="font-bold text-[#5C6658]">{row.prepared}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7D8878] block">Served</span>
                    <span className="font-bold text-[#0E382B]">{row.actualServed}</span>
                  </div>
                </div>

                {row.recoveryStatus === 'Recovered' && (
                  <div className="text-[11px] text-[#0E382B] font-semibold flex items-center justify-between">
                    <span>Recovery:</span>
                    <span>{row.surplus > 0 ? `${row.surplus} pans recovered` : 'Recovered'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
