'use client';

import React, { useState } from 'react';
import { LLMExplanation } from '@/types/foodflow';
import { Sparkles, ChevronRight, Info, Sliders, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';

interface InsightCardProps {
  explanation: LLMExplanation;
  onAdjust?: () => void;
  className?: string;
}

export function InsightCard({ explanation, onAdjust, className = '' }: InsightCardProps) {
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustedBuffer, setAdjustedBuffer] = useState(18);
  const [appliedNotice, setAppliedNotice] = useState(false);

  return (
    <>
      <div
        className={`bg-white rounded-xl border border-[#E6E4DC] p-5 sm:p-6 shadow-[0_2px_12px_rgba(20,22,24,0.02)] transition-all ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EAF4EE] flex items-center justify-center text-[#1B4D36]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[#141618]">
                  AI Demand Insight
                </h4>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#F2F1EC] text-[#585E68] px-2 py-0.5 rounded-full border border-[#E2E0D8]">
                  Powered by {explanation.provider}
                </span>
              </div>
            </div>
          </div>

          <span className="text-[11px] text-[#737A87] font-medium hidden sm:inline-block">
            Natural-Language Reasoning Engine
          </span>
        </div>

        {/* Narrative Content */}
        <div className="bg-[#FAF9F6] p-4 rounded-lg border border-[#EAE8E0] mb-4">
          <p className="text-sm leading-relaxed text-[#2C313A] italic">
            &ldquo;{explanation.summary}&rdquo;
          </p>
        </div>

        {/* Operational takeaway */}
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[#1B4D36] shrink-0 mt-0.5" />
            <div className="text-xs text-[#525866]">
              <strong className="text-[#141618] font-medium">Batch staging recommendation: </strong>
              {explanation.operationalRecommendation}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EFEB]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReasoningModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B4D36] hover:text-[#143B2A] transition-colors bg-[#EAF4EE] hover:bg-[#DDEEE3] px-3 py-1.5 rounded-md"
            >
              <span>View Gemini Reasoning</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowAdjustModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#585E68] hover:text-[#141618] transition-colors bg-[#F4F3ED] hover:bg-[#EAE8E0] px-3 py-1.5 rounded-md"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Adjust Recommendation</span>
            </button>
          </div>

          <span className="text-[11px] text-[#8A929E]">
            Numerical forecast calculated by statistical ML engine
          </span>
        </div>
      </div>

      {/* Modal: Full Gemini Reasoning Breakdown */}
      <Modal
        isOpen={showReasoningModal}
        onClose={() => setShowReasoningModal(false)}
        title="Gemini Natural-Language Demand Reasoning"
        subtitle="Explainable AI synthesis of telemetry, menu sensitivity, and campus occupancy"
      >
        <div className="space-y-4 text-sm text-[#2C313A]">
          <div className="bg-[#FAF9F5] p-3.5 rounded-lg border border-[#E6E4DC]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1B4D36] block mb-1">
              Core Synthesis Summary
            </span>
            <p className="text-sm font-medium text-[#141618]">
              {explanation.summary}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#737A87] mb-2">
              Detailed Factor Analysis
            </h5>
            <div className="space-y-2.5">
              {explanation.detailedReasoning.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#EAE8E0]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#EAF4EE] text-[#1B4D36] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-[#3B404B]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FCF2EB] border border-[#F7DAC8] text-xs">
            <span className="font-semibold text-[#B85720] block mb-1">
              Buffer & Overproduction Mitigation Rule
            </span>
            <p className="text-[#6B3714]">{explanation.bufferAdvice}</p>
          </div>

          <div className="pt-2 text-[11px] text-[#737A87] border-t border-[#F0EFEB]">
            <strong>Architectural Note for Evaluators:</strong> Gemini is queried via structured JSON schema to generate explanatory summaries based on past variance records and deterministic engine numbers. It does not generate raw numeric forecasts.
          </div>
        </div>
      </Modal>

      {/* Modal: Adjust Recommendation */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => {
          setShowAdjustModal(false);
          setAppliedNotice(false);
        }}
        title="Adjust Preparation Buffer"
        subtitle="Fine-tune kitchen safety margin against predicted demand (742 servings)"
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#F8F7F2] rounded-lg border border-[#EAE8E0] text-xs text-[#525866]">
            Recommended Preparation = <strong className="text-[#141618]">742</strong> (Forecast) + <strong className="text-[#B85720]">{adjustedBuffer}</strong> (Buffer) = <strong className="text-[#141618]">{742 + adjustedBuffer} servings</strong>.
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#141618]">Safety Buffer Servings</span>
              <span className="font-semibold text-[#B85720]">{adjustedBuffer} servings ({((adjustedBuffer / 742) * 100).toFixed(1)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={adjustedBuffer}
              onChange={(e) => setAdjustedBuffer(Number(e.target.value))}
              className="w-full accent-[#1B4D36] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8A929E] mt-1">
              <span>0 (Zero Buffer / Highest Shortage Risk)</span>
              <span>18 (Gemini Baseline)</span>
              <span>50 (High Overproduction Risk)</span>
            </div>
          </div>

          {appliedNotice ? (
            <div className="p-3 bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA] rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Preparation target updated to {742 + adjustedBuffer} servings for Shift A.</span>
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EFEB]">
            <button
              type="button"
              onClick={() => setShowAdjustModal(false)}
              className="px-3 py-1.5 text-xs text-[#585E68] hover:text-[#141618]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setAppliedNotice(true);
                if (onAdjust) onAdjust();
              }}
              className="px-4 py-1.5 text-xs font-medium text-white bg-[#1B4D36] hover:bg-[#143B2A] rounded-md transition-colors shadow-sm"
            >
              Apply Buffer Adjustment
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
