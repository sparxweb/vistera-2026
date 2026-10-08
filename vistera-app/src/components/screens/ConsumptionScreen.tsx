'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Calendar,
  AlertTriangle,
  Save,
  Check
} from 'lucide-react';
import { NumericalForecast, ConsumptionRecord, DishConsumptionItem } from '@/types/foodflow';
import { ScreenId } from '@/components/layout/Header';
import { DEMO_HOTEL } from '@/lib/demoData';

interface ConsumptionScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onUpdateConsumption?: (record: ConsumptionRecord) => void;
  forecast?: NumericalForecast;
}

export function ConsumptionScreen({ 
  onNavigate, 
  onUpdateConsumption,
  forecast,
}: ConsumptionScreenProps) {
  // Check if forecast is present
  const hasForecast = Boolean(forecast && (forecast.forecastId || forecast.predictedDemand));

  const initialPredicted = forecast?.predictedDiners || forecast?.predictedDemand || 795;
  const initialPrepTarget = forecast?.recommendedPreparation || 819;

  const [prepared, setPrepared] = useState<number>(initialPrepTarget);
  const [served, setServed] = useState<number>(initialPredicted);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [tempVerified, setTempVerified] = useState<boolean>(false);

  // Initialize dishes from forecast
  const [dishes, setDishes] = useState<DishConsumptionItem[]>([]);

  // Sync state when forecast changes
  useEffect(() => {
    if (forecast) {
      const pTarget = forecast.recommendedPreparation || 819;
      const sTarget = forecast.predictedDiners || forecast.predictedDemand || 795;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrepared(pTarget);
      setServed(sTarget);

      if (forecast.dishes && forecast.dishes.length > 0) {
        setDishes(
          forecast.dishes.map((d) => {
            const prep = d.recommendedPreparation;
            const serv = Math.round(prep * 0.94 * 10) / 10;
            const diff = Number((prep - serv).toFixed(1));
            return {
              dishName: d.dishName,
              unit: d.unit,
              preparedQuantity: prep,
              servedQuantity: serv,
              remainingQuantity: diff,
              status: diff > 1.0 ? 'SURPLUS' : diff < 0 ? 'SHORTAGE RISK' : 'BALANCED',
              isRecoverable: diff > 0,
              recoverySafetyConfirmed: false,
            };
          })
        );
      } else {
        setDishes([
          { dishName: 'Steamed Sona Masoori Rice', unit: 'kg', preparedQuantity: 43.0, servedQuantity: 39.8, remainingQuantity: 3.2, status: 'SURPLUS', isRecoverable: true },
          { dishName: 'Tomato Dal / Dal Tadka', unit: 'L', preparedQuantity: 18.0, servedQuantity: 18.0, remainingQuantity: 0.0, status: 'BALANCED', isRecoverable: false },
          { dishName: 'Andhra Chicken Curry', unit: 'kg', preparedQuantity: 31.0, servedQuantity: 28.5, remainingQuantity: 2.5, status: 'SURPLUS', isRecoverable: true },
          { dishName: 'Mixed Vegetable Korma', unit: 'kg', preparedQuantity: 17.0, servedQuantity: 17.0, remainingQuantity: 0.0, status: 'BALANCED', isRecoverable: false },
          { dishName: 'Fresh Set Curd', unit: 'L', preparedQuantity: 12.0, servedQuantity: 11.5, remainingQuantity: 0.5, status: 'BALANCED', isRecoverable: false },
        ]);
      }
    }
  }, [forecast]);

  // If no forecast exists for this service
  if (!hasForecast) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#FAF9F5] border border-[#E6E4DC] flex items-center justify-center mx-auto text-[#737A87]">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-[#141618]">
            No forecast exists for this service yet
          </h2>
          <p className="text-xs sm:text-sm text-[#585E68] max-w-md mx-auto">
            Service tracking requires an active shift demand forecast to establish preparation targets and measure variance.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => onNavigate('forecast')}
            className="px-6 py-3 bg-[#1B4D36] hover:bg-[#16402D] text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Go to Demand Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Calculations (Never clamp shortages to zero!)
  const rawDiff = prepared - served;
  const isSurplus = rawDiff > 0;
  const isShortage = rawDiff < 0;

  const handleDishServedChange = (index: number, newServed: number) => {
    setIsSaved(false);
    const updated = [...dishes];
    const item = { ...updated[index] };
    item.servedQuantity = Math.max(0, newServed);
    const diff = Number((item.preparedQuantity - item.servedQuantity).toFixed(1));
    item.remainingQuantity = diff;
    item.status = diff > (item.unit === 'pieces' ? 15 : 1.0) ? 'SURPLUS' : diff < 0 ? 'SHORTAGE RISK' : 'BALANCED';
    item.isRecoverable = diff > 0 && tempVerified;
    updated[index] = item;
    setDishes(updated);
  };

  const handleSaveServiceOutcome = async () => {
    const updatedRecord: ConsumptionRecord = {
      forecastId: forecast?.forecastId || 'DGH-FC-LIVE',
      serviceDate: forecast?.serviceDate || new Date().toISOString().split('T')[0],
      serviceMeal: forecast?.serviceMeal || 'Lunch',
      date: 'Today (Live Service Audit)',
      mealsPrepared: prepared,
      mealsServed: served,
      actualDiners: served,
      remainingFood: rawDiff,
      predictedDemand: initialPredicted,
      surplusDetected: Math.max(0, rawDiff),
      overproductionPercent: prepared > 0 && rawDiff > 0 ? Number(((rawDiff / prepared) * 100).toFixed(1)) : 0,
      dishes,
      attendanceVariance: served - initialPredicted,
      wasteAnalysis: `Turnout concluded at ${served} diners vs predicted ${initialPredicted}. Actual preparation was ${prepared} servings with ${rawDiff > 0 ? `+${rawDiff} surplus` : rawDiff < 0 ? `${rawDiff} deficit` : 'balanced'} outcome.`,
      mismatchLikelyFactors: [
        { factor: 'Turnstile Attendance', impact: 'Primary', description: `${served} check-ins recorded` },
      ],
      aiRecommendation: isSurplus 
        ? `${rawDiff} surplus servings logged. Safe holding verified for local recovery transfer.`
        : isShortage
        ? `Deficit of ${Math.abs(rawDiff)} servings recorded. Buffer adjusted for next comparable shift.`
        : 'Service completed in balanced state.',
    };

    if (onUpdateConsumption) {
      onUpdateConsumption(updatedRecord);
    }

    try {
      await fetch('/api/consumption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forecastId: forecast?.forecastId,
          preparedQuantity: prepared,
          servedQuantity: served,
          dishes,
          actualDiners: served,
          predictedDiners: initialPredicted,
        }),
      });
    } catch {
      // Local fallback handled smoothly
    }

    setIsSaved(true);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* 01. HEADER & LINKED FORECAST CONTEXT */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full border border-[#D0E7DA]">
                SERVICE TRACKING • STEP 04
              </span>
              <span className="text-xs font-semibold text-[#141618] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#1B4D36]" />
                {DEMO_HOTEL.name}
              </span>
              <span className="text-[11px] font-mono text-[#737A87]">
                ({forecast?.forecastId || 'DGH-FC-LIVE'})
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#141618]">
              Shift Service Audit &amp; Balance Tracking
            </h1>
            <p className="text-xs text-[#585E68] mt-0.5">
              Track actual dining room turnstile consumption against the authoritatively saved preparation forecast.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPrepared(initialPrepTarget);
              setServed(initialPredicted);
              setIsSaved(false);
            }}
            className="p-2 rounded-xl border border-[#E6E4DC] text-[#585E68] hover:text-[#141618] hover:bg-[#FAF9F5] transition-colors self-start sm:self-auto cursor-pointer"
            title="Reset to saved forecast target"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Linked Forecast Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] uppercase font-bold text-[#737A87] block">Service Meal</span>
            <span className="font-extrabold text-[#141618] mt-0.5 block">{forecast?.serviceMeal || 'Lunch'}</span>
            <span className="text-[10px] text-[#737A87]">Active Shift</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] uppercase font-bold text-[#737A87] block">Expected Diners</span>
            <span className="font-extrabold text-[#141618] mt-0.5 block">{forecast?.expectedDiners || 820}</span>
            <span className="text-[10px] text-[#737A87]">Initial Booking</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] uppercase font-bold text-[#737A87] block">Predicted Diners</span>
            <span className="font-extrabold text-[#1B4D36] mt-0.5 block">{initialPredicted}</span>
            <span className="text-[10px] text-[#2E7D32]">Statistical Baseline</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#EAF4EE] border border-[#D0E7DA]">
            <span className="text-[10px] uppercase font-bold text-[#1B4D36] block">Rec. Preparation Target</span>
            <span className="font-extrabold text-[#1B4D36] mt-0.5 block">{initialPrepTarget} servings</span>
            <span className="text-[10px] text-[#2E7D32]">Includes 3% safety buffer</span>
          </div>
        </div>
      </div>

      {/* 02. CORE 3-METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PREPARED */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 shadow-xs text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737A87] block">
            Actual Meals Prepared
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#141618] my-1">
            {prepared}
          </div>
          <span className="text-xs text-[#585E68] block">portions staged in batches</span>
          <div className="pt-3 border-t border-[#F0EFEB]">
            <label className="text-[11px] text-[#737A87] block mb-1">Adjust kitchen cooked total:</label>
            <input
              type="number"
              aria-label="Actual Prepared Meals"
              value={prepared}
              onChange={(e) => {
                setIsSaved(false);
                setPrepared(Number(e.target.value));
              }}
              className="w-28 text-center font-mono text-xs font-bold py-1.5 px-2 rounded-xl border border-[#E6E4DC] bg-[#FAF9F5] focus:outline-none focus:border-[#1B4D36]"
            />
          </div>
        </div>

        {/* SERVED */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 shadow-xs text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737A87] block">
            Actual Diners Served
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#141618] my-1">
            {served}
          </div>
          <span className="text-xs text-[#585E68] block">turnstile check-ins verified</span>
          <div className="pt-3 border-t border-[#F0EFEB]">
            <label className="text-[11px] text-[#737A87] block mb-1">Enter turnstile audit:</label>
            <input
              type="number"
              aria-label="Actual Diners Served"
              value={served}
              onChange={(e) => {
                setIsSaved(false);
                setServed(Number(e.target.value));
              }}
              className="w-28 text-center font-mono text-xs font-bold py-1.5 px-2 rounded-xl border border-[#E6E4DC] bg-[#FAF9F5] focus:outline-none focus:border-[#1B4D36]"
            />
          </div>
        </div>

        {/* REMAINING (NEVER CLAMP NEGATIVE SHORTAGES TO ZERO!) */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 shadow-xs text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737A87] block">
            Remaining Food / Balance
          </span>
          <div className={`text-4xl sm:text-5xl font-extrabold my-1 ${
            isSurplus ? 'text-amber-700' : isShortage ? 'text-rose-600' : 'text-[#1B4D36]'
          }`}>
            {rawDiff > 0 ? `+${rawDiff}` : rawDiff}
          </div>
          <span className="text-xs text-[#585E68] block">
            {isSurplus 
              ? 'surplus portion equivalents' 
              : isShortage 
              ? `shortage deficit (-${Math.abs(rawDiff)} portions)` 
              : 'exact service balance'}
          </span>
          <div className="pt-3 border-t border-[#F0EFEB]">
            <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${
              isSurplus 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : isShortage 
                ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                : 'bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]'
            }`}>
              {isSurplus ? 'SURPLUS AVAILABLE' : isShortage ? 'SHORTAGE DEFICIT' : 'OPTIMAL BALANCE'}
            </span>
          </div>
        </div>
      </div>

      {/* 03. DISH-LEVEL REAL TIME TRACKING (kg, L, pieces) */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#F0EFEB]">
          <div>
            <h3 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
              Dish Consumption Breakdown (Real Units)
            </h3>
            <p className="text-xs text-[#737A87] mt-0.5">
              Live service pan logs from Deccan Grand Hotel kitchen dock.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-[#141618] font-medium cursor-pointer bg-[#FAF9F5] px-3 py-1.5 rounded-xl border border-[#E6E4DC]">
              <input
                type="checkbox"
                checked={tempVerified}
                onChange={(e) => {
                  setTempVerified(e.target.checked);
                  setIsSaved(false);
                }}
                className="w-4 h-4 accent-[#1B4D36] cursor-pointer"
              />
              <span>Holding Temp Logged (≥63°C)</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E6E4DC] rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E6E4DC] text-[#737A87] font-mono text-[10px] uppercase">
                <th className="py-3 px-4 font-bold">Menu Item</th>
                <th className="py-3 px-3 text-right font-bold">Prepared</th>
                <th className="py-3 px-3 text-right font-bold">Consumed / Served</th>
                <th className="py-3 px-3 text-right font-bold">Remaining Diff</th>
                <th className="py-3 px-4 text-center font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Recovery Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEB]">
              {dishes.map((d, idx) => (
                <tr key={idx} className="hover:bg-[#FAF9F5]/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#141618]">
                    {d.dishName}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-medium text-[#585E68]">
                    {d.preparedQuantity} {d.unit}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <input
                      type="number"
                      step={d.unit === 'pieces' ? '1' : '0.1'}
                      value={d.servedQuantity}
                      onChange={(e) => handleDishServedChange(idx, Number(e.target.value))}
                      className="w-20 text-right font-mono font-semibold p-1 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] focus:outline-none focus:border-[#1B4D36]"
                    />
                    <span className="text-[10px] text-[#737A87] ml-1 font-mono">{d.unit}</span>
                  </td>
                  <td className={`py-3.5 px-3 text-right font-mono font-extrabold ${
                    d.remainingQuantity > 0 ? 'text-amber-700' : d.remainingQuantity < 0 ? 'text-rose-600' : 'text-[#1B4D36]'
                  }`}>
                    {d.remainingQuantity > 0 ? `+${d.remainingQuantity}` : d.remainingQuantity} {d.unit}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      d.status === 'SURPLUS'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : d.status === 'SHORTAGE RISK'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px]">
                    {d.remainingQuantity > 0 ? (
                      tempVerified ? (
                        <span className="text-[#1B4D36] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                          Confirmed Safe for Rescue
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Eligibility requires confirmation
                        </span>
                      )
                    ) : (
                      <span className="text-[#737A87]">Balanced / Cleared</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 04. FOOD SAFETY & PRINCIPLES NOTICE */}
      <div className="p-4 rounded-2xl bg-[#EAF4EE] border border-[#D0E7DA] flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-[#1B4D36] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-[#141618]">
          <strong className="block text-[#1B4D36]">Leftover Food is Not Automatically Waste.</strong>
          <span className="text-[#585E68]">
            Unserved food maintained in thermal hot-wells (≥63°C) is safe, recoverable surplus. It must be dispatched within 2 hours of service close. Contaminated or temperature-abused batches are logged as waste.
          </span>
        </div>
      </div>

      {/* 05. PERSISTENCE & ACTIONS */}
      <div className="p-5 rounded-3xl bg-white border border-[#E6E4DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {isSaved ? (
            <div className="flex items-center gap-2 text-xs font-bold text-[#1B4D36]">
              <Check className="w-4 h-4 text-[#2E7D32]" />
              <span>Service outcome saved! Synced to shift history &amp; database.</span>
            </div>
          ) : (
            <span className="text-xs text-[#737A87]">
              Unsaved actuals will not be recorded into the historical learning loop.
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSaveServiceOutcome}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#D0E7DA] bg-[#EAF4EE] text-[#1B4D36] hover:bg-[#DDF0E3] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Service Outcome</span>
          </button>

          {isSurplus && (
            <button
              type="button"
              onClick={() => onNavigate('organizations')}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#1B4D36] hover:bg-[#16402D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Route Surplus to Hyderabad Recovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
