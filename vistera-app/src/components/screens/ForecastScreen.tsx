'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles,
  Info,
  Utensils
} from 'lucide-react';

import { NumericalForecast, LLMExplanation, DishPreparationItem } from '@/types/foodflow';
import { INITIAL_NUMERICAL_FORECAST, INITIAL_LLM_EXPLANATION, DEMO_KITCHEN } from '@/lib/demoData';
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
  const [expectedDiners, setExpectedDiners] = useState<number>(820);
  const [dinersInputStr, setDinersInputStr] = useState<string>('820');

  // Step 2: Meal
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Lunch');

  // Step 3: Menu
  const [selectedMenu, setSelectedMenu] = useState('Steamed Rice + Dal Tadka + Andhra Chicken + Veg Korma + Curd');

  // Step 4: Context
  const [contextSignal, setContextSignal] = useState<'Standard' | 'Exam Week' | 'Heavy Weather' | 'Weekend / Event'>('Standard');

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

  const handleGenerate = async () => {
    if (!expectedDiners || expectedDiners <= 0 || isNaN(expectedDiners)) {
      setValidationError('Please enter a valid positive number of expected diners.');
      return;
    }
    setValidationError(null);
    setIsGenerating(true);

    const savedBufferPct = typeof window !== 'undefined' ? window.localStorage.getItem('foodflow_buffer_pct') : null;
    const defaultBufferPct = savedBufferPct && !isNaN(Number(savedBufferPct)) ? Number(savedBufferPct) / 100 : 0.03;

    try {
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expectedDiners,
          serviceMeal: mealType,
          menu: selectedMenu,
          context: contextSignal,
          defaultBufferPct,
        }),
      });

      const data = await res.json();

      if (data.success && data.forecast) {
        setForecast(data.forecast);
        if (data.aiExplanation) {
          setExplanation(data.aiExplanation);
        }
        setHasCalculated(true);

        if (onForecastGenerated) {
          onForecastGenerated(data.forecast, data.aiExplanation, selectedMenu);
        }
      } else {
        setValidationError(data.error || 'Failed to generate forecast.');
      }
    } catch {
      setValidationError('Network error communicating with forecasting engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const dishesList: DishPreparationItem[] = forecast.dishes || INITIAL_NUMERICAL_FORECAST.dishes || [];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#E5E5DE] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
            DEMAND ESTIMATION • STEP 01
          </span>
          <span className="text-[10px] font-mono text-[#5C6658]">
            FACILITY: {DEMO_KITCHEN.name} ({DEMO_KITCHEN.city})
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0E382B]">
          Predict Demand. Prevent Overproduction.
        </h1>
        <p className="text-sm text-[#5C6658]">
          Deterministic statistical demand modeling for Indian institutional dining. Calculates exact dish quantities in kg, litres, and pieces with two-stage batch cooking recommendations.
        </p>
      </div>

      {/* INPUT CONFIGURATION CARD */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Expected Diners Input */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#0E382B] uppercase tracking-wider block">
              Expected Diners
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={5000}
                value={dinersInputStr}
                onChange={(e) => handleDinersChange(e.target.value)}
                placeholder="e.g. 820"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold bg-[#FBFBF9] focus:outline-none focus:ring-1 focus:ring-[#0E382B] ${
                  validationError ? 'border-[#EF4444]' : 'border-[#E5E5DE]'
                }`}
              />
              <span className="absolute right-3 top-3.5 text-xs text-[#7D8878] font-mono">
                pax
              </span>
            </div>
            {validationError && (
              <span className="text-[11px] text-[#EF4444] block">
                {validationError}
              </span>
            )}
          </div>

          {/* Meal Type */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#0E382B] uppercase tracking-wider block">
              Meal Service
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#FBFBF9] p-1 rounded-xl border border-[#E5E5DE]">
              {(['Breakfast', 'Lunch', 'Dinner'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMealType(m);
                    if (m === 'Breakfast') setSelectedMenu('Idli + Vada + Sambar + Coconut Chutney');
                    else if (m === 'Dinner') setSelectedMenu('Hyderabadi Chicken Biryani + Veg Biryani + Raitha');
                    else setSelectedMenu('Steamed Rice + Dal Tadka + Andhra Chicken + Veg Korma + Curd');
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mealType === m
                      ? 'bg-[#0E382B] text-white shadow-xs'
                      : 'text-[#5C6658] hover:text-[#0E382B]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Scheduled Menu */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#0E382B] uppercase tracking-wider block">
              Menu Template
            </label>
            <input
              type="text"
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-[#E5E5DE] text-xs font-medium bg-[#FBFBF9] text-[#0E382B] truncate focus:outline-none"
              title={selectedMenu}
            />
          </div>

          {/* Context / Signal */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#0E382B] uppercase tracking-wider block">
              Context Modifier
            </label>
            <select
              value={contextSignal}
              onChange={(e) => setContextSignal(e.target.value as 'Standard' | 'Exam Week' | 'Heavy Weather' | 'Weekend / Event')}
              className="w-full px-3 py-3 rounded-xl border border-[#E5E5DE] text-xs font-semibold bg-[#FBFBF9] text-[#0E382B] focus:outline-none cursor-pointer"
            >
              <option value="Standard">Standard Academic Day</option>
              <option value="Exam Week">Exam Week (-8% conversion)</option>
              <option value="Heavy Weather">Heavy Monsoon (-8% footfall)</option>
              <option value="Weekend / Event">Weekend / Campus Event</option>
            </select>
          </div>
        </div>

        {/* PRIMARY RUN BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E5DE]">
          <div className="text-xs text-[#5C6658]">
            Regression baseline: <strong>25 historical services</strong> • Capacity: 1000 diners
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <span>Calculating Demand...</span>
            ) : (
              <>
                <Utensils className="w-4 h-4" />
                <span>Calculate Preparation Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TODAY'S PREPARATION PLAN RESULT */}
      {hasCalculated && (
        <div className="space-y-6">
          {/* Top Level Summary Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5DE]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-mono font-bold text-[#0E382B] uppercase tracking-wider">
                    TODAY&apos;S PREPARATION PLAN • {mealType.toUpperCase()}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0E382B]">
                  {forecast.predictedDiners || forecast.predictedDemand} Predicted Diners
                </div>
                <p className="text-xs text-[#5C6658] mt-1">
                  From {expectedDiners} registered diners based on recent empirical turnout conversion (~96.9%).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <RiskIndicator riskLevel={forecast.riskLevel} />
              </div>
            </div>

            {/* DISH-LEVEL PREPARATION TABLE (kg, L, pieces) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
                  Recommended Preparation by Dish (Real Quantities)
                </h3>
                <span className="text-[10px] font-mono text-[#7D8878]">
                  SAFETY BUFFER: 3.0%
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E5E5DE] rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FBFBF9] border-b border-[#E5E5DE] text-[#7D8878] font-mono text-[10px] uppercase">
                      <th className="py-3 px-4">Dish Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-right">Predicted Demand</th>
                      <th className="py-3 px-3 text-right">Safety Buffer</th>
                      <th className="py-3 px-3 text-right">Recommended Prep</th>
                      <th className="py-3 px-4">Two-Stage Batch Staging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5DE]">
                    {dishesList.map((d) => (
                      <tr key={d.id} className="hover:bg-[#FBFBF9]/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0E382B]">
                          {d.dishName}
                          <span className="block text-[10px] text-[#7D8878] font-normal font-mono">
                            Rate: {d.consumptionRatePerDiner} {d.unit}/diner
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-[#5C6658]">
                          {d.category}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#5C6658]">
                          {d.predictedDemand} {d.unit}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-[#D97706] font-semibold">
                          +{d.safetyBuffer} {d.unit}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-sm font-extrabold text-[#0E382B]">
                          {d.recommendedPreparation} {d.unit}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#4A5548]">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-[#0E382B]">
                              Stage 1: {d.batchStaging.initialBatch} {d.unit}
                            </span>
                            <span className="text-[#7D8878]">|</span>
                            <span className="text-[#D97706] font-medium">
                              Reserve: {d.batchStaging.reserveBatch} {d.unit}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#7D8878] block line-clamp-1">
                            {d.batchStaging.triggerCondition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EXPLAINABILITY CARD */}
            <div className="p-5 rounded-2xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0E382B]" />
                <h4 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
                  Explainable Calculation Breakdown
                </h4>
              </div>
              <p className="text-xs text-[#5C6658] leading-relaxed">
                FOODFLOW applies an attendance conversion of <strong>{(forecast.predictedDiners / (expectedDiners || 1) * 100).toFixed(1)}%</strong> ({forecast.predictedDiners} predicted attendees) calibrated from 25 comparable lunch shifts at the Hyderabad Hostel Canteen. Dish preparation targets are calculated as <code>Predicted Diners × Historical Dish Rate + 3% Safety Buffer</code>, with two-stage cooking to prevent cold hot-hold degradation.
              </p>
            </div>

            {/* GEMINI OPERATIONAL INSIGHT (DECOUPLED QUALITATIVE COPILOT) */}
            <div className="p-5 rounded-2xl bg-[#E8EFEA] border border-[#C5DACD] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#10B981]" />
                  <span className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
                    Kitchen Reasoning Copilot ({explanation.provider})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] font-semibold">
                  QUALITATIVE STAGING ADVICE
                </span>
              </div>
              <p className="text-xs text-[#0E382B] leading-relaxed font-medium">
                {explanation.summary}
              </p>
              <div className="text-[11px] text-[#335C49] pt-1">
                <strong>Staging Directive:</strong> {explanation.operationalRecommendation}
              </div>
            </div>

            {/* NEXT WORKFLOW ACTION */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E5DE]">
              <span className="text-xs text-[#5C6658]">
                Preparation targets synced to kitchen prep boards and local database.
              </span>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('consumption')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Monitor Consumption</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
