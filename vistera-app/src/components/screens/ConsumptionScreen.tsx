'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { ConsumptionRecord, DishConsumptionItem } from '@/types/foodflow';
import { INITIAL_CONSUMPTION } from '@/lib/demoData';
import { ScreenId } from '@/components/layout/Header';

interface ConsumptionScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onUpdateConsumption?: (record: ConsumptionRecord) => void;
  predicted?: number;
  initialPrepared?: number;
  initialServed?: number;
}

export function ConsumptionScreen({ 
  onNavigate, 
  onUpdateConsumption,
  predicted = 795,
  initialPrepared = 819,
  initialServed = 785,
}: ConsumptionScreenProps) {
  const [prepared, setPrepared] = useState(initialPrepared);
  const [served, setServed] = useState(initialServed);

  // Dish-level state
  const [dishes, setDishes] = useState<DishConsumptionItem[]>(
    INITIAL_CONSUMPTION.dishes || [
      { dishName: 'Steamed Sona Masoori Rice', unit: 'kg', preparedQuantity: 43.0, servedQuantity: 39.8, remainingQuantity: 3.2, status: 'SURPLUS', isRecoverable: true },
      { dishName: 'Tomato Dal / Dal Tadka', unit: 'L', preparedQuantity: 18.0, servedQuantity: 16.2, remainingQuantity: 1.8, status: 'SURPLUS', isRecoverable: true },
      { dishName: 'Andhra Chicken Curry', unit: 'kg', preparedQuantity: 31.0, servedQuantity: 28.5, remainingQuantity: 2.5, status: 'SURPLUS', isRecoverable: true },
      { dishName: 'Mixed Vegetable Korma', unit: 'kg', preparedQuantity: 16.5, servedQuantity: 15.4, remainingQuantity: 1.1, status: 'BALANCED', isRecoverable: false },
      { dishName: 'Fresh Set Curd', unit: 'L', preparedQuantity: 12.0, servedQuantity: 11.2, remainingQuantity: 0.8, status: 'BALANCED', isRecoverable: false },
    ]
  );

  const remaining = Math.max(0, prepared - served);
  const isSurplus = prepared > served;
  const isShortage = served > prepared;


  const handleDishServedChange = (index: number, newServed: number) => {
    const updated = [...dishes];
    const item = { ...updated[index] };
    item.servedQuantity = newServed;
    const diff = item.preparedQuantity - newServed;
    item.remainingQuantity = Math.max(0, Number(diff.toFixed(1)));
    item.status = diff > (item.unit === 'pieces' ? 15 : 1.0) ? 'SURPLUS' : diff < 0 ? 'SHORTAGE RISK' : 'BALANCED';
    item.isRecoverable = item.status === 'SURPLUS';
    updated[index] = item;
    setDishes(updated);

    // Update overall totals
    const totalRemPortions = Math.max(0, Math.round(updated.reduce((sum, d) => sum + (d.remainingQuantity * (d.unit === 'kg' ? 10 : 8)), 0)));
    handleUpdate(prepared, Math.max(0, prepared - totalRemPortions), updated);
  };

  const handleUpdate = async (newP: number, newS: number, currentDishes = dishes) => {
    setPrepared(newP);
    setServed(newS);

    const rem = Math.max(0, newP - newS);
    const updatedRecord: ConsumptionRecord = {
      ...INITIAL_CONSUMPTION,
      predictedDemand: predicted,
      mealsPrepared: newP,
      mealsServed: newS,
      remainingFood: rem,
      surplusDetected: rem,
      overproductionPercent: newP > 0 ? Number(((rem / newP) * 100).toFixed(1)) : 0,
      dishes: currentDishes,
      attendanceVariance: newS - predicted,
      wasteAnalysis: `Actual attendance (${newS} diners) vs predicted (${predicted}). Variance: ${newS - predicted >= 0 ? '+' : ''}${newS - predicted} diners. Remaining unserved quantities in thermal pans are safe for recovery routing.`,
    };

    if (onUpdateConsumption) {
      onUpdateConsumption(updatedRecord);
    }

    try {
      await fetch('/api/consumption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preparedQuantity: newP,
          servedQuantity: newS,
          dishes: currentDishes,
        }),
      });
    } catch {
      // Local state updated; API route is optional/fallback
    }

  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
              MONITOR SERVICE • STEP 02
            </span>
            <span className="text-[10px] font-mono text-[#5C6658]">
              FACILITY: College Hostel Dining Hall (Hyderabad)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Shift Consumption & Surplus Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Track actual meals served against kitchen preparation targets to detect surplus, shortages, and batch residuals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPrepared(819);
            setServed(785);
            setDishes(INITIAL_CONSUMPTION.dishes || []);
            handleUpdate(819, 785);
          }}
          className="p-2 rounded-lg border border-[#E5E5DE] text-[#5C6658] hover:text-[#0E382B] hover:bg-[#F4F4EE] transition-colors self-start sm:self-auto cursor-pointer"
          title="Reset to default baseline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* CORE 3-METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PREPARED */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D8878] block">
            PREPARED TARGET
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#0E382B] my-2">
            {prepared}
          </div>
          <span className="text-xs text-[#5C6658] block">portions staged in batches</span>
          <div className="mt-4 pt-3 border-t border-[#E5E5DE]">
            <input
              type="number"
              aria-label="Meals Prepared"
              value={prepared}
              onChange={(e) => handleUpdate(Number(e.target.value), served)}
              className="w-24 text-center font-mono text-xs font-semibold p-1 rounded border border-[#E5E5DE] bg-[#FBFBF9] focus:outline-none"
            />
          </div>
        </div>

        {/* SERVED */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D8878] block">
            ACTUAL SERVED
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#0E382B] my-2">
            {served}
          </div>
          <span className="text-xs text-[#5C6658] block">diners checked in</span>
          <div className="mt-4 pt-3 border-t border-[#E5E5DE]">
            <input
              type="number"
              aria-label="Meals Served"
              value={served}
              onChange={(e) => handleUpdate(prepared, Number(e.target.value))}
              className="w-24 text-center font-mono text-xs font-semibold p-1 rounded border border-[#E5E5DE] bg-[#FBFBF9] focus:outline-none"
            />
          </div>
        </div>

        {/* REMAINING */}
        <div className="bg-white rounded-2xl border border-[#E5E5DE] p-6 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D8878] block">
            REMAINING FOOD
          </span>
          <div className={`text-4xl sm:text-5xl font-extrabold my-2 ${
            isSurplus ? 'text-[#D97706]' : isShortage ? 'text-[#DC2626]' : 'text-[#10B981]'
          }`}>
            {remaining}
          </div>
          <span className="text-xs text-[#5C6658] block">
            {isSurplus ? 'surplus portion equivalents' : isShortage ? 'shortage deficit' : 'perfect balance'}
          </span>
          <div className="mt-4 pt-3 border-t border-[#E5E5DE]">
            <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
              isSurplus 
                ? 'bg-[#FEF3C7] text-[#B45309]' 
                : isShortage 
                  ? 'bg-[#FEE2E2] text-[#DC2626]' 
                  : 'bg-[#E8EFEA] text-[#0E382B]'
            }`}>
              {isSurplus ? 'SURPLUS' : isShortage ? 'SHORTAGE' : 'BALANCED'}
            </span>
          </div>
        </div>
      </div>

      {/* DISH-LEVEL REAL TIME TRACKING (kg, L, pieces) */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DE]">
          <div>
            <h3 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
              Dish Consumption Breakdown (Real Quantities)
            </h3>
            <p className="text-xs text-[#5C6658] mt-0.5">
              Live service pan logs from Central Dining Hall, Hyderabad.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#10B981] bg-[#E8EFEA] px-2.5 py-0.5 rounded font-semibold">
            HOT-HOLDING VERIFIED (≥63°C)
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E5E5DE] rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FBFBF9] border-b border-[#E5E5DE] text-[#7D8878] font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Menu Item</th>
                <th className="py-3 px-3 text-right">Prepared</th>
                <th className="py-3 px-3 text-right">Served</th>
                <th className="py-3 px-3 text-right">Remaining</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Recovery Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5DE]">
              {dishes.map((d, idx) => (
                <tr key={idx} className="hover:bg-[#FBFBF9]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0E382B]">
                    {d.dishName}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-medium text-[#5C6658]">
                    {d.preparedQuantity} {d.unit}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <input
                      type="number"
                      step={d.unit === 'pieces' ? '1' : '0.1'}
                      value={d.servedQuantity}
                      onChange={(e) => handleDishServedChange(idx, Number(e.target.value))}
                      className="w-20 text-right font-mono font-semibold p-1 rounded border border-[#E5E5DE] bg-[#FBFBF9] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#7D8878] ml-1 font-mono">{d.unit}</span>
                  </td>
                  <td className={`py-3.5 px-3 text-right font-mono font-extrabold ${
                    d.remainingQuantity > 0 ? 'text-[#D97706]' : 'text-[#0E382B]'
                  }`}>
                    {d.remainingQuantity} {d.unit}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.status === 'SURPLUS'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : d.status === 'SHORTAGE RISK'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#E8EFEA] text-[#0E382B]'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px]">
                    {d.isRecoverable ? (
                      <span className="text-[#10B981] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Safe for Rescue Routing
                      </span>
                    ) : (
                      <span className="text-[#7D8878]">
                        Cleared / In-Tolerance
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONCEPTUAL CLARITY: LEFTOVER != WASTE */}
      <div className="p-5 rounded-2xl bg-[#E8EFEA] border border-[#C5DACD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
          <div className="text-[#0E382B]">
            <strong className="block font-bold">Leftover Food is Not Waste.</strong>
            <span>
              Unserved portions kept in thermal holding carriers (≥63°C) are high-grade recoverable food. Route immediately to local partners before the 2-hour window expires.
            </span>
          </div>
        </div>
      </div>

      {/* VARIANCE CAUSE ANALYSIS */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#0E382B]" />
          <h4 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
            Shift Variance & Cause Analysis
          </h4>
        </div>
        <p className="text-xs text-[#5C6658] leading-relaxed">
          Predicted attendance was <strong>{predicted} diners</strong> while actual turnstile check-ins concluded at <strong>{served} diners</strong> (variance: {served - predicted >= 0 ? '+' : ''}{served - predicted} attendees). Staged preparations yielded <strong>3.2 kg Rice, 1.8 L Dal, and 2.5 kg Chicken Curry</strong> in residual reserve.
        </p>
      </div>

      {/* PRIMARY CTA: ROUTE TO RECOVERY MAP */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#5C6658]">
          {isSurplus ? 'Surplus flagged for immediate dispatch.' : 'Kitchen service monitoring active.'}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('recovery')}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Route Surplus to Recovery Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
