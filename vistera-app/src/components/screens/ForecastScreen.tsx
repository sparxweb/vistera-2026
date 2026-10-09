'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Utensils, 
  Calculator, 
  X 
} from 'lucide-react';

import { NumericalForecast, LLMExplanation, DishPreparationItem, ForecastCalculationBreakdown } from '@/types/foodflow';
import { INITIAL_NUMERICAL_FORECAST, INITIAL_LLM_EXPLANATION, DEMO_HOTEL } from '@/lib/demoData';
import { calculateDemandForecast } from '@/lib/forecast/engine';
import { RiskIndicator } from '@/components/ui/RiskIndicator';
import { ScreenId } from '@/components/layout/Header';
import { AIKitchenInsightsCard } from '@/components/ui/AIKitchenInsightsCard';

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

  // Step 3: Day of Week
  const [dayOfWeek, setDayOfWeek] = useState<string>('Saturday');

  // Step 4: Special Event
  const [specialEvent, setSpecialEvent] = useState<string>('None');

  // Step 5: Menu
  const [selectedMenu] = useState('Steamed Rice + Dal Tadka + Andhra Chicken + Veg Korma + Curd');

  // Step 6: Context
  const [contextSignal, setContextSignal] = useState<'Standard' | 'Exam Week' | 'Heavy Weather' | 'Weekend / Event'>('Standard');

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(true);
  const [showCalcModal, setShowCalcModal] = useState(false);
  
  // Forecast & calculation breakdown
  const [forecast, setForecast] = useState<NumericalForecast>(INITIAL_NUMERICAL_FORECAST);
  const [explanation, setExplanation] = useState<LLMExplanation>(INITIAL_LLM_EXPLANATION);
  const [calcBreakdown, setCalcBreakdown] = useState<ForecastCalculationBreakdown>(() => {
    const init = calculateDemandForecast({ expectedDiners: 820, serviceMeal: 'Lunch', dayOfWeek: 'Saturday' });
    return init.calculationBreakdown;
  });

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
          dayOfWeek,
          specialEvent: specialEvent !== 'None' ? specialEvent : undefined,
          menu: selectedMenu,
          context: contextSignal,
          defaultBufferPct,
          hotelCapacity: DEMO_HOTEL.serviceCapacity,
        }),
      });

      const data = await res.json();

      if (data.success && data.forecast) {
        setForecast(data.forecast);
        if (data.calculationBreakdown) {
          setCalcBreakdown(data.calculationBreakdown);
        } else {
          const localCalc = calculateDemandForecast({
            expectedDiners,
            serviceMeal: mealType,
            dayOfWeek,
            specialEvent: specialEvent !== 'None' ? specialEvent : undefined,
            context: contextSignal,
            defaultBufferPct,
            hotelCapacity: DEMO_HOTEL.serviceCapacity,
          });
          setCalcBreakdown(localCalc.calculationBreakdown);
        }

        if (data.aiExplanation) {
          setExplanation(data.aiExplanation);
        }
        setHasCalculated(true);

        if (onForecastGenerated) {
          onForecastGenerated(data.forecast, data.aiExplanation, selectedMenu);
        }
      } else {
        // Deterministic client fallback if offline
        const localCalc = calculateDemandForecast({
          expectedDiners,
          serviceMeal: mealType,
          dayOfWeek,
          specialEvent: specialEvent !== 'None' ? specialEvent : undefined,
          context: contextSignal,
          defaultBufferPct,
          hotelCapacity: DEMO_HOTEL.serviceCapacity,
        });
        const fallbackForecast: NumericalForecast = {
          ...localCalc.numericalForecast,
          forecastId: `DGH-FC-${Date.now().toString().slice(-6)}`,
          serviceDate: new Date().toISOString().split('T')[0],
          serviceMeal: mealType,
        };
        setForecast(fallbackForecast);
        setCalcBreakdown(localCalc.calculationBreakdown);
        setHasCalculated(true);
        if (onForecastGenerated) {
          onForecastGenerated(fallbackForecast, explanation, selectedMenu);
        }
      }
    } catch {
      // Deterministic calculation guaranteed even without API
      const localCalc = calculateDemandForecast({
        expectedDiners,
        serviceMeal: mealType,
        dayOfWeek,
        specialEvent: specialEvent !== 'None' ? specialEvent : undefined,
        context: contextSignal,
        defaultBufferPct,
        hotelCapacity: DEMO_HOTEL.serviceCapacity,
      });
      const fallbackForecast: NumericalForecast = {
        ...localCalc.numericalForecast,
        forecastId: `DGH-FC-${Date.now().toString().slice(-6)}`,
        serviceDate: new Date().toISOString().split('T')[0],
        serviceMeal: mealType,
      };
      setForecast(fallbackForecast);
      setCalcBreakdown(localCalc.calculationBreakdown);
      setHasCalculated(true);
      if (onForecastGenerated) {
        onForecastGenerated(fallbackForecast, explanation, selectedMenu);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const dishesList: DishPreparationItem[] = forecast.dishes || INITIAL_NUMERICAL_FORECAST.dishes || [];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#E6E4DC] space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full border border-[#D0E7DA]">
            DEMAND ESTIMATION • STEP 01
          </span>
          <span className="text-[11px] text-[#737A87]">
            FACILITY: <strong>{DEMO_HOTEL.name}</strong> • MAX CAPACITY: {DEMO_HOTEL.serviceCapacity} MEALS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
          Predict Demand. Prevent Overproduction.
        </h1>
        <p className="text-xs sm:text-sm text-[#585E68]">
          Deterministic statistical demand modeling for Indian institutional dining. Calculates exact dish quantities in kg, litres, and pieces with two-stage batch cooking recommendations.
        </p>
      </div>

      {/* INPUT CONFIGURATION CARD */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Expected Diners Input */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#141618] uppercase tracking-wider block">
              Expected Diners
            </label>
            <input
              type="number"
              min="1"
              max="2000"
              value={dinersInputStr}
              onChange={(e) => handleDinersChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E6E4DC] text-sm font-bold bg-[#FAF9F5] text-[#141618] focus:outline-none focus:ring-2 focus:ring-[#1B4D36]"
              placeholder="e.g. 820"
            />
            <span className="text-[10px] text-[#737A87] block">Turnstile / Bookings</span>
          </div>

          {/* Service Meal */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#141618] uppercase tracking-wider block">
              Service Shift
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as 'Breakfast' | 'Lunch' | 'Dinner')}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E6E4DC] text-xs font-bold bg-[#FAF9F5] text-[#141618] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] cursor-pointer"
            >
              <option value="Breakfast">Breakfast (800 cap)</option>
              <option value="Lunch">Lunch (1000 cap)</option>
              <option value="Dinner">Dinner (900 cap)</option>
            </select>
            <span className="text-[10px] text-[#737A87] block">Historical shift baseline</span>
          </div>

          {/* Day of Week */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#141618] uppercase tracking-wider block">
              Day of Week
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E6E4DC] text-xs font-bold bg-[#FAF9F5] text-[#141618] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] cursor-pointer"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday (Weekend Peak)</option>
              <option value="Sunday">Sunday (Weekend Shift)</option>
            </select>
            <span className="text-[10px] text-[#737A87] block">Empirical day variance</span>
          </div>

          {/* Special Event / Festival */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#141618] uppercase tracking-wider block">
              Special Event
            </label>
            <select
              value={specialEvent}
              onChange={(e) => setSpecialEvent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E6E4DC] text-xs font-bold bg-[#FAF9F5] text-[#141618] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] cursor-pointer"
            >
              <option value="None">None (Regular Service)</option>
              <option value="Banqueting Event">Banqueting Conference (+1.5%)</option>
              <option value="Festival Buffet">Festival / Regional Feast</option>
              <option value="Monsoon Alert">Heavy Monsoon Alert (-8%)</option>
            </select>
            <span className="text-[10px] text-[#737A87] block">Multipliers checked</span>
          </div>

          {/* Context / Signal */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold text-[#141618] uppercase tracking-wider block">
              Operation Mode
            </label>
            <select
              value={contextSignal}
              onChange={(e) => setContextSignal(e.target.value as 'Standard' | 'Exam Week' | 'Heavy Weather' | 'Weekend / Event')}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E6E4DC] text-xs font-bold bg-[#FAF9F5] text-[#141618] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] cursor-pointer"
            >
              <option value="Standard">Standard Shift</option>
              <option value="Weekend / Event">Weekend / Event</option>
              <option value="Heavy Weather">Severe Weather</option>
              <option value="Exam Week">Restricted Hours</option>
            </select>
            <span className="text-[10px] text-[#737A87] block">Historical filter</span>
          </div>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {validationError}
          </div>
        )}

        {/* PRIMARY RUN BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F0EFEB]">
          <div className="text-xs text-[#737A87]">
            Empirical baseline: <strong>30 historical shifts</strong> • Hard Bound: <strong>{DEMO_HOTEL.serviceCapacity} meals</strong>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3 bg-[#1B4D36] hover:bg-[#16402D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EFEB]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                  <span className="text-xs font-mono font-bold text-[#1B4D36] uppercase tracking-wider">
                    TODAY&apos;S PREPARATION PLAN • {mealType.toUpperCase()} ({dayOfWeek.toUpperCase()})
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#141618]">
                    {forecast.predictedDiners || forecast.predictedDemand} Predicted Diners
                  </span>
                  
                  {/* View Calculation Button */}
                  <button
                    type="button"
                    onClick={() => setShowCalcModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EAF4EE] text-[#1B4D36] hover:bg-[#DDF0E4] border border-[#D0E7DA] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>View Calculation Breakdown</span>
                  </button>
                </div>
                <p className="text-xs text-[#737A87] mt-1">
                  Calculated from {expectedDiners} registered patrons using Deccan Grand Hotel historical data.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <RiskIndicator riskLevel={forecast.riskLevel} />
              </div>
            </div>

            {/* DISH-LEVEL PREPARATION TABLE (kg, L, pieces) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#141618] uppercase tracking-wider">
                    Recommended Preparation by Dish (Real Quantities)
                  </h3>
                  <p className="text-[11px] text-[#737A87]">
                    Base Requirement = Predicted Diners × Historical Dish Rate + 3% Controlled Safety Buffer
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA] font-bold">
                  SAFETY BUFFER: 3.0%
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E6E4DC] rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E6E4DC] text-[#737A87] font-mono text-[10px] uppercase">
                      <th className="py-3 px-4">Dish Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-right">Predicted Demand</th>
                      <th className="py-3 px-3 text-right">Safety Buffer</th>
                      <th className="py-3 px-3 text-right">Recommended Prep</th>
                      <th className="py-3 px-4">Two-Stage Batch Staging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EFEB]">
                    {dishesList.map((d) => (
                      <tr key={d.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#141618]">
                          {d.dishName}
                          <span className="block text-[10px] text-[#737A87] font-normal font-mono">
                            Consumption Rate: {d.consumptionRatePerDiner} {d.unit}/diner
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-[#585E68]">
                          {d.category}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#585E68]">
                          {d.predictedDemand} {d.unit}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-[#C6682F] font-semibold">
                          +{d.safetyBuffer} {d.unit}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-sm font-extrabold text-[#1B4D36]">
                          {d.recommendedPreparation} {d.unit}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#141618]">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-[#1B4D36]">
                              Initial Batch (80–85%): {d.batchStaging.initialBatch} {d.unit}
                            </span>
                            <span className="text-[#737A87]">|</span>
                            <span className="text-[#C6682F] font-semibold">
                              Reserve (15–20%): {d.batchStaging.reserveBatch} {d.unit}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#737A87] block line-clamp-1">
                            Trigger: {d.batchStaging.triggerCondition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI KITCHEN INSIGHTS CARD (STRICT USER-FACING CONTRACT) */}
            <AIKitchenInsightsCard
              insights={forecast.aiInsights || {
                summary: explanation.summary,
                key_factors: explanation.keyFactors || explanation.detailedReasoning || [
                  `Historical comparable baseline for ${mealType.toLowerCase()} shift`,
                  `Day-of-week attendance curve applied to bookings`,
                  `Hotel service capacity bound strictly satisfied`,
                ],
                recommendations: explanation.recommendations || [
                  `Stage 85% initial batch for dining room opening`,
                  `Hold 15% reserve in temperature-safe staging`,
                  `Fire reserve batch upon mid-shift turnout verification`,
                ],
                caveats: explanation.caveats || ['Weather or corporate banqueting shifts may alter attendance.'],
                isFallback: explanation.isFallback,
              }}
              provider={explanation.provider}
            />

            {/* NEXT WORKFLOW ACTION */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F0EFEB]">
              <span className="text-xs text-[#737A87]">
                Preparation targets synced to kitchen prep boards and local database.
              </span>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('preparation')}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1B4D36] hover:bg-[#16402D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Food Preparation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EXPLAINABLE CALCULATION MODAL */}
      {/* ============================================================== */}
      {showCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E6E4DC] max-w-xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#F0EFEB]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#EAF4EE] text-[#1B4D36]">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141618]">
                    Deterministic Forecast Calculation
                  </h3>
                  <p className="text-xs text-[#737A87]">
                    Deccan Grand Hotel Archive • Closed-Form Statistical Engine
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCalcModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#FAF9F5] text-[#737A87] hover:text-[#141618] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formula Architecture Flow */}
            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] text-xs font-mono text-[#1B4D36]">
              Historical Data &rarr; Baseline ({calcBreakdown.comparableBaseline}) &rarr; Day ({calcBreakdown.dayOfWeekEffectPct}%) &rarr; Trend ({calcBreakdown.recentTrendPct}%) &rarr; Cap Check &rarr; <strong>{calcBreakdown.finalPredictedDiners} Diners</strong>
            </div>

            {/* Detailed Component Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F2]">
                <div>
                  <span className="font-bold text-[#141618]">1. Comparable Shift Baseline</span>
                  <span className="block text-[11px] text-[#737A87]">Average of historical {mealType.toLowerCase()} actual diners</span>
                </div>
                <span className="font-mono font-bold text-sm text-[#141618]">{calcBreakdown.comparableBaseline}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F2]">
                <div>
                  <span className="font-bold text-[#141618]">2. Day-of-Week Effect ({dayOfWeek})</span>
                  <span className="block text-[11px] text-[#737A87]">Historical variance for this specific weekday/weekend</span>
                </div>
                <span className={`font-mono font-bold text-sm ${calcBreakdown.dayOfWeekEffectPct >= 0 ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                  {calcBreakdown.dayOfWeekEffectPct >= 0 ? '+' : ''}{calcBreakdown.dayOfWeekEffectPct}% ({calcBreakdown.dayOfWeekEffectDiners >= 0 ? '+' : ''}{calcBreakdown.dayOfWeekEffectDiners})
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F2]">
                <div>
                  <span className="font-bold text-[#141618]">3. Recent 7-Day Rolling Trend</span>
                  <span className="block text-[11px] text-[#737A87]">Week-over-week dynamic patron momentum</span>
                </div>
                <span className={`font-mono font-bold text-sm ${calcBreakdown.recentTrendPct >= 0 ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                  {calcBreakdown.recentTrendPct >= 0 ? '+' : ''}{calcBreakdown.recentTrendPct}% ({calcBreakdown.recentTrendDiners >= 0 ? '+' : ''}{calcBreakdown.recentTrendDiners})
                </span>
              </div>

              {calcBreakdown.specialEventEffectPct !== 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F2]">
                  <div>
                    <span className="font-bold text-[#141618]">4. Special Event Adjustment</span>
                    <span className="block text-[11px] text-[#737A87]">{specialEvent} multiplier</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#2E7D32]">
                    +{calcBreakdown.specialEventEffectPct}% (+{calcBreakdown.specialEventEffectDiners})
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F2]">
                <div>
                  <span className="font-bold text-[#141618]">5. Unconstrained Model Result</span>
                  <span className="block text-[11px] text-[#737A87]">Headcount before physical facility capacity boundary</span>
                </div>
                <span className="font-mono font-bold text-sm text-[#141618]">{calcBreakdown.unconstrainedPrediction}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#EAF4EE] border border-[#D0E7DA]">
                <div>
                  <span className="font-bold text-[#1B4D36]">6. Capacity Safety Boundary</span>
                  <span className="block text-[11px] text-[#1B4D36]/80">Configured hotel limit: {calcBreakdown.hotelCapacityLimit} meals</span>
                </div>
                <span className="font-bold text-xs text-[#2E7D32]">
                  {calcBreakdown.isCapacityConstrained ? 'Capped at Limit' : 'Within Limits ✓'}
                </span>
              </div>
            </div>

            {/* Final Result Card */}
            <div className="p-4 rounded-2xl bg-[#1B4D36] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A8D5BA] font-bold block">
                  Final Deterministic Output
                </span>
                <span className="text-2xl font-extrabold">{calcBreakdown.finalPredictedDiners} Predicted Diners</span>
              </div>
              <div className="text-right text-[11px] text-[#D0E7DA]">
                <div>Buffer: +3.0%</div>
                <div>Batch 1 Target: ~84%</div>
              </div>
            </div>

            <div className="text-[11px] text-[#737A87] italic">
              Notice: The prediction is calculated strictly with closed-form deterministic arithmetic from stored Deccan Grand Hotel service records. Gemini 3.8 Flash provides qualitative operational language only.
            </div>

            <button
              type="button"
              onClick={() => setShowCalcModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#141618] hover:bg-[#2C3035] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close Calculation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
