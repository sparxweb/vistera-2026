'use client';

import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { AIKitchenInsights } from '@/lib/ai/cleaner';

interface AIKitchenInsightsCardProps {
  insights?: AIKitchenInsights | null;
  provider?: string;
  isUnavailable?: boolean;
  className?: string;
}

export function AIKitchenInsightsCard({
  insights,
  provider = 'Gemini 3.8 Flash',
  isUnavailable = false,
  className = '',
}: AIKitchenInsightsCardProps) {
  if (isUnavailable || !insights) {
    return (
      <div className={`p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] text-xs text-[#585E68] ${className}`}>
        <div className="flex items-center gap-2 mb-1.5 text-stone-700 font-semibold">
          <Sparkles className="w-4 h-4 text-[#1B4D36]" />
          <span>AI Kitchen Insights</span>
        </div>
        <p className="text-stone-600">
          AI insights are temporarily unavailable. Your forecast and preparation calculations are still available.
        </p>
      </div>
    );
  }

  const { summary, key_factors = [], recommendations = [], caveats = [], isFallback } = insights;

  return (
    <div
      className={`bg-white rounded-3xl border border-[#E6E4DC] p-6 shadow-xs space-y-5 transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#F0EFEB]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#141618]">
                AI Kitchen Insights
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]">
                {provider}
              </span>
            </div>
            <span className="text-[11px] text-[#737A87]">
              Qualitative operational staging advice &amp; rationale
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#2E7D32] bg-[#F4F9F5] px-2.5 py-1 rounded-full border border-[#D0E7DA] font-semibold self-start sm:self-auto">
          {isFallback ? 'DETERMINISTIC FALLBACK RULES' : 'QUALITATIVE COPILOT ACTIVE'}
        </span>
      </div>

      {/* 1. Concise Summary */}
      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EAE8E0]">
        <p className="text-xs sm:text-sm text-[#141618] leading-relaxed font-medium">
          {summary}
        </p>
      </div>

      {/* 2. Key Factors & Actionable Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Factors */}
        {key_factors.length > 0 && (
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E6E4DC]/80">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#737A87]">
              <Lightbulb className="w-3.5 h-3.5 text-[#B85720]" />
              <span>Evidence-Supported Factors</span>
            </div>
            <ul className="space-y-2">
              {key_factors.slice(0, 3).map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#585E68]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D36] shrink-0 mt-1.5" />
                  <span className="leading-snug">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actionable Kitchen Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E6E4DC]/80">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1B4D36]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D36]" />
              <span>Recommended Kitchen Actions</span>
            </div>
            <ul className="space-y-2">
              {recommendations.slice(0, 3).map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#141618] font-medium">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1B4D36] shrink-0 mt-0.5" />
                  <span className="leading-snug">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. Optional Caveat / Quality Warning */}
      {caveats && caveats.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Operational Notice:</strong> {caveats[0]}
          </span>
        </div>
      )}

      {/* Footer Note */}
      <div className="pt-1 text-[11px] text-[#8A929E] border-t border-[#F0EFEB] flex flex-wrap items-center justify-between gap-2">
        <span>Headcount &amp; food weights are calculated 100% deterministically by statistical engine.</span>
        <span>Deccan Grand Hotel Operations</span>
      </div>
    </div>
  );
}
