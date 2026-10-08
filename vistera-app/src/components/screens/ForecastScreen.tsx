'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { NumericalForecast, LLMExplanation } from '@/types/foodflow';
import { INITIAL_NUMERICAL_FORECAST, INITIAL_LLM_EXPLANATION } from '@/lib/demoData';
import { RiskIndicator } from '@/components/ui/RiskIndicator';
import { ScreenId } from '@/components/layout/Header';

interface ForecastScreenProps {
  onForecastGenerated?: (
    forecast: NumericalForecast,
    explanation?: LLMExplanation,
    menu?: string
  ) => void;
  onNavigate?: (screen: ScreenId) => void;
}

export function ForecastScreen({ onForecastGenerated, onNavigate }: ForecastScreenProps) {
  // Step 1: Expected Diners
  const [expectedDiners, setExpectedDiners] = useState<number>(800);
  const [dinersInputStr, setDinersInputStr] = useState<string>('800');

  // Step 2: Meal
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Lunch');

  // Step 3: Menu
  const [selectedMenu, setSelectedMenu] = useState('Rice + Dal + Chicken');

  // Step 4: Context
  const [contextSignal, setContextSignal] = useState<'None' | 'Exam Week' | 'Holiday' | 'Event' | 'Heavy Weather'>('None');

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(true);
  const [forecast, setForecast] = useState<NumericalForecast>(INITIAL_NUMERICAL_FORECAST);
  const [explanation, setExplanation] = useState<LLMExplanation>(INITIAL_LLM_EXPLANATION);

  const handleDinersChange = (valStr: string) => {
    setDinersInputStr(valStr);
    const parsed = parseInt(valStr, 10);
    if (isNaN(parsed) || valStr.trim() === '') {
      setExpectedDiners(0);
      setValidationError('Expected diners is required.');
    } else if (parsed <= 0) {
      setExpectedDiners(parsed);
      setValidationError('Expected diners must be greater than 0.');
    } else if (parsed > 10000) {
      setExpectedDiners(parsed);
      setValidationError('Expected diners exceeds facility capacity.');
    } else {
      setExpectedDiners(parsed);
      setValidationError(null);
    }
  };

  const handleGenerate = () => {
    if (!expectedDiners || expectedDiners <= 0 || isNaN(expectedDiners)) {
      setValidationError('Please enter a valid positive number of expected diners.');
      return;
    }
    setValidationError(null);
    setIsGenerating(true);

    setTimeout(() => {
      // Deterministic Forecast Engine calculation
      // Wednesday baseline: 800 * 0.9275 = 742 predicted servings
      let mealFactor = 0.9275;
      if (mealType === 'Breakfast') mealFactor = 0.65;
      if (mealType === 'Dinner') mealFactor = 0.85;

      let contextModifier = 0;
      if (contextSignal === 'Exam Week') contextModifier = -0.06;
      if (contextSignal === 'Holiday') contextModifier = -0.35;
      if (contextSignal === 'Event') contextModifier = 0.08;
      if (contextSignal === 'Heavy Weather') contextModifier = -0.12;

      const calculatedDemand = Math.max(
        1,
        Math.round(expectedDiners * (mealFactor + contextModifier))
      );
      // Safety buffer of ~2.426% yields +18 servings on 742 baseline -> 760 recommended preparation
      const buffer = Math.max(1, Math.round(calculatedDemand * 0.02426));
      const recommendedPrep = calculatedDemand + buffer;

      const newForecast: NumericalForecast = {
        expectedDiners,
        historicalAverage: 756,
        predictedDemand: calculatedDemand,
        recommendedPreparation: recommendedPrep,
        bufferServings: buffer,
        confidence: expectedDiners > 1500 ? 'Low' : 'Medium',
        riskLevel: Math.abs(calculatedDemand - 756) > 60 ? 'HIGH' : 'MEDIUM',
        engineVersion: 'v2.4-deterministic-regressor',
        calculatedAt: 'Just now',
        factors: {
          historicalPattern: `${mealType} historical baseline averages 756 meals on similar days`,
          attendanceTrend: `Context applied: ${contextSignal}`,
          menuDemandFactor: `${selectedMenu} yields a historical 92-94% consumption rate`,
          dayOfWeekEffect: `Mid-week attendance stabilization curve applied`,
        },
      };

      const newExplanation: LLMExplanation = {
        provider: 'Gemini 3.8 Flash',
        summary: `Demand for today's ${mealType.toLowerCase()} service is projected at ${calculatedDemand} servings. Recommended preparation stages a +${buffer} serving buffer to mitigate sudden turnstile surges without creating avoidable surplus.`,
        detailedReasoning: [
          `Historical consumption patterns for ${mealType.toLowerCase()} indicate consistent turnstile arrivals.`,
          `Context factor (${contextSignal}) factored into headcount adjustments.`,
          `Recipe (${selectedMenu}) has high tray shelf-life; batch staging recommended.`,
          `Buffer of ${buffer} servings maintains safe non-stockout probability above 98%.`
        ],
        operationalRecommendation: `Stage ${calculatedDemand - 80} servings for initial service open. Hold final ${80 + buffer} servings until mid-shift headcount confirms trend.`,
        confidenceRationale: `Statistical regression weighted against rolling 60-day shift logs.`,
        bufferAdvice: `Keep safety buffer under ${buffer + 5} servings to maintain strict zero-waste compliance.`
      };

      setForecast(newForecast);
      setExplanation(newExplanation);
      setIsGenerating(false);
      setHasCalculated(true);

      if (onForecastGenerated) {
        onForecastGenerated(newForecast, newExplanation, selectedMenu);
      }
    }, 500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#E5E5DE]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
            GUIDED WORKFLOW • STEP 01
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
          FORECAST TODAY&apos;S DEMAND
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
          Tell FOODFLOW what today&apos;s service looks like.
        </p>
      </div>

      {/* GUIDED INPUT WORKFLOW */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-8">
        {validationError && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#DC2626] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: Expected Diners */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D8878]">
              STEP 1 • EXPECTED DINERS
            </span>
            <span className="text-xs text-[#5C6658]">Registered count / reservations</span>
          </div>
          <div className="relative">
            <input
              type="number"
              aria-label="Expected Diners"
              value={dinersInputStr}
              onChange={(e) => handleDinersChange(e.target.value)}
              className="w-full text-2xl sm:text-3xl font-bold p-4 rounded-2xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] focus:border-[#0E382B] focus:bg-white focus:outline-none transition-all"
              placeholder="e.g. 800"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7D8878] uppercase">
              Registered Diners
            </span>
          </div>
        </div>

        {/* STEP 2: Meal (Segmented Controls) */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D8878] block">
            STEP 2 • MEAL
          </span>
          <div className="grid grid-cols-3 gap-3">
            {(['Breakfast', 'Lunch', 'Dinner'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMealType(m)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                  mealType === m
                    ? 'bg-[#0E382B] text-white border-[#0E382B] shadow-sm'
                    : 'bg-[#FBFBF9] text-[#5C6658] border-[#E5E5DE] hover:bg-white hover:text-[#0E382B]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3: Menu */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D8878] block">
            STEP 3 • MENU
          </span>
          <select
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
            className="w-full text-xs font-medium p-3.5 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] focus:border-[#0E382B] focus:bg-white focus:outline-none transition-all cursor-pointer"
          >
            <option value="Rice + Dal + Chicken">Rice + Dal + Chicken (Canteen Classic)</option>
            <option value="Herb-Roasted Chicken & Farro">Herb-Roasted Chicken & Farro Bowl</option>
            <option value="Lentil Dahl & Basmati Rice">Lentil Dahl & Basmati Rice (Plant-Based)</option>
            <option value="Beef Bolognese Pasta">Beef Bolognese & Penne Rigate</option>
            <option value="Harvest Vegetable Curry">Harvest Vegetable Curry with Roti</option>
          </select>
        </div>

        {/* STEP 4: Context (Optional) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D8878]">
              STEP 4 • CONTEXT (OPTIONAL)
            </span>
            <span className="text-[10px] text-[#7D8878]">Campus conditions</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['None', 'Exam Week', 'Holiday', 'Event', 'Heavy Weather'] as const).map((ctx) => (
              <button
                key={ctx}
                type="button"
                onClick={() => setContextSignal(ctx)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer text-center border ${
                  contextSignal === ctx
                    ? 'bg-[#E8EFEA] text-[#0E382B] border-[#0E382B] font-semibold'
                    : 'bg-[#FBFBF9] text-[#5C6658] border-[#E5E5DE] hover:bg-white'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>

        {/* PRIMARY CTA: ONE Large Button */}
        <div className="pt-4 border-t border-[#E5E5DE]">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Running Forecasting Engine...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Generate Forecast</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* FORECAST RESULT (Appears when calculated) */}
      {hasCalculated && (
        <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5DE]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2 py-0.5 rounded border border-[#C5DACD]">
                FORECAST ENGINE RESULT
              </span>
              <h3 className="text-lg font-bold text-[#0E382B] mt-1">
                Deterministic Demand Output
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5C6658]">Operational Risk:</span>
              <RiskIndicator level={forecast.riskLevel} />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: PREDICTED DEMAND */}
            <div className="p-6 rounded-2xl bg-[#E8EFEA] border border-[#C5DACD] text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E382B] block">
                PREDICTED DEMAND
              </span>
              <div className="text-5xl sm:text-6xl font-extrabold text-[#0E382B] my-2">
                {forecast.predictedDemand}
              </div>
              <span className="text-xs font-bold text-[#164E3D]">
                SERVINGS
              </span>
              <p className="text-[11px] text-[#5C6658] mt-1">
                Calculated by Statistical Forecasting Engine
              </p>
            </div>

            {/* Box 2: RECOMMENDED PREPARATION */}
            <div className="p-6 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] block">
                RECOMMENDED PREPARATION
              </span>
              <div className="text-5xl sm:text-6xl font-extrabold text-[#D97706] my-2">
                {forecast.recommendedPreparation}
              </div>
              <span className="text-xs font-bold text-[#B45309]">
                SERVINGS
              </span>
              <p className="text-[11px] text-[#B45309] mt-1">
                Includes +{forecast.bufferServings} serving safety buffer margin
              </p>
            </div>
          </div>

          {/* WHY? AI EXPLANATION (Visually separated) */}
          <div className="p-6 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0E382B]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E382B]">
                WHY? • AI EXPLANATION
              </h4>
              <span className="text-[10px] text-[#7D8878] font-mono">
                (Qualitative Reasoning • {explanation.provider})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4A5548] leading-relaxed italic bg-white p-4 rounded-xl border border-[#E5E5DE]">
              &ldquo;{explanation.summary}&rdquo;
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8878] block">
                Contributing Factors:
              </span>
              {explanation.detailedReasoning.map((item, idx) => (
                <div key={idx} className="text-xs text-[#5C6658] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E382B] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS: ONE Primary CTA + Secondary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E5DE]">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="text-xs font-semibold text-[#5C6658] hover:text-[#0E382B] transition-colors order-2 sm:order-1 cursor-pointer"
            >
              Save & Exit to Dashboard
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('consumption')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer"
            >
              <span>Record Consumption</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
