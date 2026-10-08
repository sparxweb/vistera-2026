'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Utensils, 
  Sparkles, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Cpu, 
  Layers,
  ArrowRight
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
  // Input parameters
  const [selectedDate, setSelectedDate] = useState('2026-10-08');
  const [expectedDiners, setExpectedDiners] = useState<number>(800);
  const [dinersInputStr, setDinersInputStr] = useState<string>('800');
  const [selectedMenu, setSelectedMenu] = useState('Rice + Dal + Chicken');
  const [dayType, setDayType] = useState<string>('Wednesday');
  const [hasEvent, setHasEvent] = useState(false);
  const [attendanceTrend, setAttendanceTrend] = useState(0); // percent (0% = neutral mid-week baseline)
  const [historicalBaseline, setHistoricalBaseline] = useState(756);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Simulation / generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [forecast, setForecast] = useState<NumericalForecast>(INITIAL_NUMERICAL_FORECAST);
  const [explanation, setExplanation] = useState<LLMExplanation>(INITIAL_LLM_EXPLANATION);
  const [reasoningExpanded, setReasoningExpanded] = useState(true);
  const [generationCount, setGenerationCount] = useState(1);

  const handleDinersChange = (valStr: string) => {
    setDinersInputStr(valStr);
    const parsed = parseInt(valStr, 10);
    if (isNaN(parsed) || valStr.trim() === '') {
      setExpectedDiners(0);
      setValidationError('Expected diners is required and cannot be empty.');
    } else if (parsed <= 0) {
      setExpectedDiners(parsed);
      setValidationError('Expected diners must be a positive integer greater than 0.');
    } else if (parsed > 10000) {
      setExpectedDiners(parsed);
      setValidationError('Expected diners cannot exceed facility maximum of 10,000.');
    } else {
      setExpectedDiners(parsed);
      setValidationError(null);
    }
  };

  const handleGenerate = () => {
    if (!expectedDiners || expectedDiners <= 0 || isNaN(expectedDiners)) {
      setValidationError('Please enter a valid positive number of expected diners (> 0).');
      return;
    }
    if (!selectedDate) {
      setValidationError('Please specify a valid service date.');
      return;
    }
    if (!selectedMenu) {
      setValidationError('Please select a primary scheduled recipe.');
      return;
    }

    setValidationError(null);
    setIsGenerating(true);

    setTimeout(() => {
      // Deterministic Forecast Engine calculation
      // Wednesday baseline: 800 diners * 0.9275 = 742 predicted servings
      const baseRate = 0.9275;
      const eventReserve = hasEvent ? 25 : 0;
      const trendAdjustment = (attendanceTrend / 100) * expectedDiners * 0.3;
      const calculatedDemand = Math.max(
        1,
        Math.round(expectedDiners * baseRate + eventReserve + trendAdjustment)
      );
      // Safety buffer: 2.426% yields +18 servings on 742 baseline -> 760 recommended preparation
      const buffer = Math.max(1, Math.round(calculatedDemand * 0.02426));
      const recommendedPrep = calculatedDemand + buffer;

      const newForecast: NumericalForecast = {
        expectedDiners,
        historicalAverage: historicalBaseline,
        predictedDemand: calculatedDemand,
        recommendedPreparation: recommendedPrep,
        bufferServings: buffer,
        confidence: expectedDiners > 1500 ? 'Low' : 'Medium',
        riskLevel: Math.abs(calculatedDemand - historicalBaseline) > 60 ? 'HIGH' : 'MEDIUM',
        engineVersion: 'v2.4-lightweight-regressor',
        calculatedAt: 'Just now',
        factors: {
          historicalPattern: `Mid-week baseline: ${historicalBaseline} average on similar ${dayType}s`,
          attendanceTrend: `Badge sensor trend: ${attendanceTrend > 0 ? '+' : ''}${attendanceTrend.toFixed(1)}% variance vs 14-day median`,
          menuDemandFactor: `${selectedMenu} yields a historical 91-94% tray consumption affinity`,
          dayOfWeekEffect: `${dayType} service profiles exhibit typical attendance stabilization`,
        },
      };

      const newExplanation: LLMExplanation = {
        provider: 'Gemini 3.8 Flash',
        summary: `Demand is expected to remain slightly below the recent ${dayType} average. A small preparation buffer is recommended to prevent stockouts while preventing overproduction.`,
        detailedReasoning: [
          `Historical consumption curves on comparable ${dayType} shifts average ${historicalBaseline} meals.`,
          `Attendance velocity adjusts the expected yield based on morning turnstile telemetry.`,
          `Selected recipe (${selectedMenu}) has high ingredient stability; recommend holding the second batch until 45 minutes into service.`,
          `Operational buffer of ${buffer} servings maintains safety margin below the 3.5% overproduction waste threshold.`
        ],
        operationalRecommendation: `Stage ${calculatedDemand - 90} servings for initial line open. Hold remaining ${90 + buffer} servings in hot reserve pending attendance peak.`,
        confidenceRationale: `Statistical regression weighted against rolling 60-day shift logs.`,
        bufferAdvice: `Keep safety buffer under ${buffer + 5} servings to maintain strict zero-landfill compliance.`
      };

      setForecast(newForecast);
      setExplanation(newExplanation);
      setIsGenerating(false);
      setGenerationCount((c) => c + 1);

      if (onForecastGenerated) {
        onForecastGenerated(newForecast, newExplanation, selectedMenu);
      }
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              MODULE 01 • DEMAND ESTIMATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Demand Forecast
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Configure shift operational parameters to generate deterministic servings bounds and Gemini explanations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#737A87]">
            Active Run: #{generationCount}
          </span>
          <button
            type="button"
            onClick={() => {
              setExpectedDiners(800);
              setDinersInputStr('800');
              setAttendanceTrend(0);
              setHasEvent(false);
              setSelectedMenu('Rice + Dal + Chicken');
              setDayType('Wednesday');
              setValidationError(null);
            }}
            className="p-1.5 rounded-lg border border-[#E6E4DC] text-[#737A87] hover:text-[#141618] hover:bg-[#FAF9F5] transition-colors"
            title="Reset parameters to defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Left Input Configuration / Right Forecast Engine Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parameter Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
            <h3 className="text-sm font-bold text-[#141618] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#1B4D36]" />
              Operational Parameters
            </h3>
            <span className="text-[10px] font-mono text-[#8A929E]">
              INPUTS → ENGINE
            </span>
          </div>

          {/* Validation Alert Banner */}
          {validationError && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Invalid Operational Input</span>
                <span>{validationError}</span>
              </div>
            </div>
          )}

          {/* Date & Shift */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#737A87] mb-1">
                Service Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (e.target.value) setValidationError(null);
                }}
                className="w-full text-xs p-2 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#737A87] mb-1">
                Day Profile
              </label>
              <select
                value={dayType}
                onChange={(e) => setDayType(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              >
                <option value="Wednesday">Wednesday (Mid-Week Peak)</option>
                <option value="Monday">Monday (Start of Week)</option>
                <option value="Tuesday">Tuesday (Regular)</option>
                <option value="Thursday">Thursday (Regular)</option>
                <option value="Friday">Friday (Pre-Weekend Shift)</option>
                <option value="Weekend">Weekend (Sat-Sun)</option>
              </select>
            </div>
          </div>

          {/* Expected Diners: Number Input + Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#141618]">
                Expected Diners
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  aria-label="Expected Diners Input"
                  value={dinersInputStr}
                  onChange={(e) => handleDinersChange(e.target.value)}
                  className="w-24 text-right font-mono text-xs font-bold p-1 rounded-md border border-[#E6E4DC] bg-[#FAF9F5] text-[#1B4D36] focus:border-[#1B4D36] focus:outline-none"
                />
                <span className="text-[10px] text-[#737A87]">diners</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={Math.max(0, Math.min(2000, expectedDiners))}
              onChange={(e) => handleDinersChange(e.target.value)}
              className="w-full accent-[#1B4D36] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8A929E]">
              <span>0 (Edge Test)</span>
              <span>800 (Wednesday Median)</span>
              <span>2000 (Facility Max)</span>
            </div>
          </div>

          {/* Menu Selection */}
          <div>
            <label className="block text-[11px] font-medium text-[#737A87] mb-1">
              Primary Scheduled Menu
            </label>
            <select
              value={selectedMenu}
              onChange={(e) => {
                setSelectedMenu(e.target.value);
                if (e.target.value) setValidationError(null);
              }}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
            >
              <option value="Rice + Dal + Chicken">Rice + Dal + Chicken (Canteen Classic)</option>
              <option value="Herb-Roasted Chicken & Farro">Herb-Roasted Chicken & Mediterranean Farro</option>
              <option value="Lentil Dahl & Basmati Rice">Lentil Dahl, Spinach & Cumin Rice (Vegan)</option>
              <option value="Beef Bolognese Pasta">Beef Bolognese & Penne Rigate</option>
              <option value="Quinoa Harvest Bowl">Quinoa Harvest Bowl with Roasted Vegetables</option>
            </select>
          </div>

          {/* Recent Attendance Trend Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[#525866]">
                Badge Entry Velocity Trend
              </label>
              <span className={`font-mono text-xs font-semibold ${attendanceTrend >= 0 ? 'text-[#1B4D36]' : 'text-[#B85720]'}`}>
                {attendanceTrend > 0 ? '+' : ''}{attendanceTrend.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={attendanceTrend}
              onChange={(e) => setAttendanceTrend(Number(e.target.value))}
              className="w-full accent-[#141618] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8A929E]">
              <span>-15% (Bad weather / Remote)</span>
              <span>0% (Neutral)</span>
              <span>+15% (Peak surge)</span>
            </div>
          </div>

          {/* Special Event / Holiday Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <div>
              <span className="text-xs font-semibold text-[#141618] block">
                Campus Seminar / VIP Event Flag
              </span>
              <span className="text-[10px] text-[#737A87]">
                Adds simulated catering reserve (+25 servings)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHasEvent(!hasEvent)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                hasEvent ? 'bg-[#1B4D36]' : 'bg-[#D4D1C6]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  hasEvent ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-[#141618] hover:bg-[#1B4D36] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Running Regressor & Synthesizing Reasoning...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-[#C6682F]" />
                <span>Generate Forecast</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: Cinematic Result Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Card: FORECAST ENGINE */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-7 shadow-[0_2px_16px_rgba(20,22,24,0.03)] relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
                  FORECAST ENGINE
                </span>
                <h3 className="text-lg font-bold text-[#141618] mt-1">
                  Demand Projection Output
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737A87]">Operational Risk:</span>
                <RiskIndicator level={forecast.riskLevel} />
              </div>
            </div>

            {/* Massive Hero Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {/* Box 1: Forecast Demand */}
              <div className="p-6 rounded-2xl bg-[#EAF4EE] border border-[#CCE3D5] text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1B4D36] block mb-1">
                  FORECAST ENGINE
                </span>
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1B4D36] my-1">
                  {forecast.predictedDemand}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A7251]">
                  SERVINGS
                </span>
                <p className="text-[11px] text-[#525866] mt-2">
                  Expected consumption based on {expectedDiners} registered diners
                </p>
              </div>

              {/* Box 2: Recommended Preparation */}
              <div className="p-6 rounded-2xl bg-[#FCF2EB] border border-[#F7DAC8] text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B85720] block mb-1">
                  RECOMMENDED PREPARATION
                </span>
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#B85720] my-1">
                  {forecast.recommendedPreparation}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C4212]">
                  SERVINGS
                </span>
                <p className="text-[11px] text-[#525866] mt-2">
                  Includes +{forecast.bufferServings} serving safety buffer margin
                </p>
              </div>
            </div>

            {/* Non-Gemini Clarity Indicator */}
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE8E0] text-[11px] text-[#585E68] flex items-center justify-between">
              <span>* Produced by deterministic statistical regressor model: {forecast.engineVersion}</span>
              <span className="font-mono text-[10px] text-[#1B4D36]">BOUNDED VALUES</span>
            </div>
          </div>

          {/* Section: WHY? (Factor Breakdown) */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
              <h4 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
                WHY? — Factor Breakdown
              </h4>
              <span className="text-xs text-[#737A87]">
                Key Influencing Vectors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#EAE8E0]">
                <span className="font-semibold text-[#141618] block mb-1">
                  Historical Pattern
                </span>
                <p className="text-[#585E68] text-[11px] leading-relaxed">
                  {forecast.factors.historicalPattern}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#EAE8E0]">
                <span className="font-semibold text-[#141618] block mb-1">
                  Attendance Trend
                </span>
                <p className="text-[#585E68] text-[11px] leading-relaxed">
                  {forecast.factors.attendanceTrend}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#EAE8E0]">
                <span className="font-semibold text-[#141618] block mb-1">
                  Menu Demand
                </span>
                <p className="text-[#585E68] text-[11px] leading-relaxed">
                  {forecast.factors.menuDemandFactor}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#EAE8E0]">
                <span className="font-semibold text-[#141618] block mb-1">
                  Day-of-Week Behavior
                </span>
                <p className="text-[#585E68] text-[11px] leading-relaxed">
                  {forecast.factors.dayOfWeekEffect}
                </p>
              </div>
            </div>
          </div>

          {/* AI INSIGHT: Gemini Natural-Language Synthesis */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#F8F4FF] text-[#6D28D9] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#141618]">
                    AI Insight
                  </h4>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#F2F1EC] text-[#585E68] px-2 py-0.5 rounded-full border border-[#E2E0D8]">
                  Powered by {explanation.provider}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setReasoningExpanded(!reasoningExpanded)}
                className="text-xs text-[#1B4D36] hover:underline flex items-center gap-1"
              >
                <span>{reasoningExpanded ? 'Hide' : 'Expand'} Reasoning</span>
                {reasoningExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#EAE8E0]">
              <p className="text-xs sm:text-sm text-[#2C313A] italic leading-relaxed">
                &ldquo;{explanation.summary}&rdquo;
              </p>
            </div>

            {reasoningExpanded && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A929E] block">
                  Detailed Operational Rationale
                </span>
                {explanation.detailedReasoning.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white border border-[#EAE8E0] text-xs text-[#373C44] flex items-start gap-2.5"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#EAF4EE] text-[#1B4D36] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            )}

            {onNavigate && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('consumption')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1B4D36] hover:bg-[#143B2A] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Consumption Monitoring ({forecast.recommendedPreparation} servings)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
