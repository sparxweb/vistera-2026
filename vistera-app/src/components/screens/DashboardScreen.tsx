'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Building2, 
  MapPin, 
  Calendar, 
  TrendingUp
} from 'lucide-react';
import { ForecastChart } from '@/components/ui/ForecastChart';
import { 
  DEMO_HOTEL, 
  INITIAL_NUMERICAL_FORECAST, 
  INITIAL_LLM_EXPLANATION, 
  INITIAL_CONSUMPTION 
} from '@/lib/demoData';
import { ScreenId } from '@/components/layout/Header';
import { ServiceType } from '@/types/foodflow';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  forecast?: typeof INITIAL_NUMERICAL_FORECAST;
  explanation?: typeof INITIAL_LLM_EXPLANATION;
  consumption?: typeof INITIAL_CONSUMPTION;
}

export function DashboardScreen({
  onNavigate,
  forecast = INITIAL_NUMERICAL_FORECAST,
  explanation = INITIAL_LLM_EXPLANATION,
  consumption = INITIAL_CONSUMPTION,
}: DashboardScreenProps) {
  const [selectedService, setSelectedService] = useState<ServiceType>('LUNCH');
  
  const currentSurplus = consumption.surplusDetected ?? Math.max(0, consumption.mealsPrepared - consumption.mealsServed);
  const isSurplus = currentSurplus > 0;
  const isShortage = consumption.mealsServed > consumption.mealsPrepared;

  // Illustrative dish tracking for today's service
  const todayDishes = [
    { name: 'Steamed Sona Masoori Rice', unit: 'kg', recommended: 43.0, prepared: 43.0, served: 39.8, remaining: 3.2, waste: 0.4, status: 'Recoverable Surplus' },
    { name: 'Tomato Dal / Dal Tadka', unit: 'L', recommended: 18.0, prepared: 18.0, served: 18.0, remaining: 0.0, waste: 0.0, status: 'Optimal Balance' },
    { name: 'Andhra Chicken Curry', unit: 'kg', recommended: 31.0, prepared: 31.0, served: 28.5, remaining: 2.5, waste: 0.3, status: 'Recoverable Surplus' },
    { name: 'Mixed Vegetable Korma', unit: 'kg', recommended: 16.5, prepared: 16.5, served: 16.5, remaining: 0.0, waste: 0.0, status: 'Optimal Balance' },
    { name: 'Fresh Set Curd', unit: 'L', recommended: 12.0, prepared: 12.0, served: 11.5, remaining: 0.5, waste: 0.0, status: 'Held Cold' },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* 01. HOTEL PROFILE CARD */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F0EFEB]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4EE] text-[#1B4D36] font-mono text-[11px] font-bold border border-[#D0E7DA]">
                  {DEMO_HOTEL.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F5] text-[#585E68] text-[11px] font-semibold border border-[#E6E4DC]">
                  {DEMO_HOTEL.type}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                  Illustrative Demo Hotel
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#141618]">
                {DEMO_HOTEL.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#737A87] mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1B4D36]" />
                  {DEMO_HOTEL.location}, {DEMO_HOTEL.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#1B4D36]" />
                  {DEMO_HOTEL.operatingDays}
                </span>
                <span>•</span>
                <span className="font-medium text-[#141618]">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('forecast')}
              className="px-4 py-2 bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Run Service Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Capacity & Throughput Configuration Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5">
          <div className="p-3.5 rounded-2xl bg-[#F8F7F2] border border-[#E6E4DC]/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
              Max Meal Capacity
            </span>
            <div className="text-xl font-bold text-[#141618] mt-0.5">
              {DEMO_HOTEL.totalCapacity} <span className="text-xs font-medium text-[#737A87]">meals/shift</span>
            </div>
            <span className="text-[10px] text-[#2E7D32] font-semibold mt-0.5 block">Safety Hard Bound</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F7F2] border border-[#E6E4DC]/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
              Breakfast Cap
            </span>
            <div className="text-xl font-bold text-[#141618] mt-0.5">
              {DEMO_HOTEL.breakfastCapacity} <span className="text-xs font-medium text-[#737A87]">diners</span>
            </div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">07:00 – 10:30 IST</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EAF4EE] border border-[#D0E7DA]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D36] block">
              Lunch Cap (Active)
            </span>
            <div className="text-xl font-bold text-[#1B4D36] mt-0.5">
              {DEMO_HOTEL.lunchCapacity} <span className="text-xs font-medium text-[#1B4D36]/80">diners</span>
            </div>
            <span className="text-[10px] text-[#2E7D32] font-semibold mt-0.5 block">12:30 – 15:30 IST</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F7F2] border border-[#E6E4DC]/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
              Dinner Cap
            </span>
            <div className="text-xl font-bold text-[#141618] mt-0.5">
              {DEMO_HOTEL.dinnerCapacity} <span className="text-xs font-medium text-[#737A87]">diners</span>
            </div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">19:30 – 23:00 IST</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-[#F8F7F2] border border-[#E6E4DC]/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
              Avg Daily Patrons
            </span>
            <div className="text-xl font-bold text-[#141618] mt-0.5">
              {DEMO_HOTEL.averageDailyCustomers} <span className="text-xs font-medium text-[#737A87]">diners/day</span>
            </div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">Across 3 daily services</span>
          </div>
        </div>
      </div>

      {/* 02. TODAY'S SERVICE DASHBOARD */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EFEB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#737A87]">
                LIVE SERVICE TRACKER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#141618] mt-0.5">
              Today&apos;s Service Operations
            </h2>
          </div>

          {/* Service Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#F4F3ED] border border-[#E6E4DC]">
            {(['BREAKFAST', 'LUNCH', 'DINNER'] as ServiceType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedService(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedService === type
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618]'
                }`}
              >
                {type === 'BREAKFAST' ? 'Breakfast' : type === 'LUNCH' ? 'Lunch (Active)' : 'Dinner'}
              </button>
            ))}
          </div>
        </div>

        {/* Core Metric Hierarchy */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
              Expected Diners
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#141618] mt-1">
              {forecast.expectedDiners}
            </div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">
              Bookings &amp; swipe turnstile
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
              Predicted Turnout
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1B4D36] mt-1">
              {forecast.predictedDiners || forecast.predictedDemand}
            </div>
            <span className="text-[10px] text-[#2E7D32] font-semibold mt-0.5 block">
              Deterministic 30-day baseline
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87] block">
              Recommended Prep
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#141618] mt-1">
              {forecast.recommendedPreparation}
            </div>
            <span className="text-[10px] text-[#737A87] mt-0.5 block">
              +{forecast.bufferServings} controlled buffer
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isSurplus 
              ? 'bg-[#FEF9F0] border-[#F8E0B5]' 
              : isShortage 
                ? 'bg-red-50 border-red-200' 
                : 'bg-[#EAF4EE] border-[#D0E7DA]'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isSurplus ? 'text-[#C6682F]' : isShortage ? 'text-red-700' : 'text-[#1B4D36]'
            }`}>
              {isSurplus ? 'Recoverable Surplus' : isShortage ? 'Kitchen Shortage' : 'Balance Status'}
            </span>
            <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${
              isSurplus ? 'text-[#C6682F]' : isShortage ? 'text-red-600' : 'text-[#1B4D36]'
            }`}>
              {isSurplus ? currentSurplus : isShortage ? Math.abs(consumption.mealsServed - consumption.mealsPrepared) : '0'}
            </div>
            <span className={`text-[10px] font-medium mt-0.5 block ${
              isSurplus ? 'text-[#C6682F]' : isShortage ? 'text-red-700' : 'text-[#1B4D36]'
            }`}>
              {isSurplus ? 'Safe for immediate donation' : isShortage ? 'Under production' : 'In optimal balance'}
            </span>
          </div>
        </div>

        {/* Dish Preparation & Consumption Table */}
        <div className="border border-[#E6E4DC] rounded-2xl overflow-hidden">
          <div className="bg-[#F8F7F2] px-4 py-3 border-b border-[#E6E4DC] flex items-center justify-between">
            <span className="text-xs font-bold text-[#141618]">Today&apos;s Menu Preparation &amp; Real-Time Consumption</span>
            <span className="text-[11px] text-[#737A87]">Two-stage batching enabled (84% initial, 16% reserve)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F0EFEB] bg-[#FAF9F5] text-[#737A87] font-semibold">
                  <th className="py-2.5 px-4">Food Item</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Recommended</th>
                  <th className="py-2.5 px-3">Prepared</th>
                  <th className="py-2.5 px-3">Served</th>
                  <th className="py-2.5 px-3">Remaining</th>
                  <th className="py-2.5 px-3">Waste</th>
                  <th className="py-2.5 px-4">Recovery Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEB]">
                {todayDishes.map((dish, idx) => (
                  <tr key={idx} className="hover:bg-[#FDFDFD]">
                    <td className="py-3 px-4 font-bold text-[#141618]">{dish.name}</td>
                    <td className="py-3 px-3 text-[#737A87] font-mono">{dish.unit}</td>
                    <td className="py-3 px-3 font-semibold text-[#141618]">{dish.recommended}</td>
                    <td className="py-3 px-3 text-[#141618]">{dish.prepared}</td>
                    <td className="py-3 px-3 text-[#2E7D32] font-semibold">{dish.served}</td>
                    <td className="py-3 px-3 font-bold text-[#C6682F]">{dish.remaining}</td>
                    <td className="py-3 px-3 text-[#737A87]">{dish.waste}</td>
                    <td className="py-3 px-4">
                      {dish.status === 'Recoverable Surplus' ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#FCF2EB] text-[#C6682F] font-bold text-[10px] border border-[#F6DAC8]">
                          Recoverable Surplus
                        </span>
                      ) : dish.status === 'Optimal Balance' ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF4EE] text-[#1B4D36] font-bold text-[10px] border border-[#D0E7DA]">
                          Consumed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#585E68] text-[10px] border border-[#E6E4DC]">
                          Held Cold
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Callout */}
        <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C6682F] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#141618]">
                {isSurplus ? '5.7 kg Total Recoverable Food Ready for Pickup' : 'Service In Optimal Production Balance'}
              </div>
              <p className="text-[11px] text-[#737A87] mt-0.5">
                {isSurplus 
                  ? 'Rice and chicken curry staged in warmers. Match with verified local partners in Gachibowli.'
                  : 'Remaining food is within controlled threshold. No excess overproduction detected.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('consumption')}
              className="px-3.5 py-2 border border-[#E6E4DC] hover:bg-white text-xs font-bold text-[#141618] rounded-xl transition-colors cursor-pointer"
            >
              Update Consumption
            </button>
            <button
              type="button"
              onClick={() => onNavigate('recovery')}
              className="px-4 py-2 bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Recover Surplus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 03. HONEST BASELINE METRICS & FORECAST CHART */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EFEB]">
          <div>
            <h3 className="text-xs font-bold text-[#141618] uppercase tracking-wider">
              30-Day Historical Headcount &amp; Attendance Trend
            </h3>
            <span className="text-[11px] text-[#737A87]">
              Empirical historical actuals vs predicted turnstile volume at Deccan Grand Hotel.
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-1 rounded-full border border-[#D0E7DA] font-bold">
            ILLUSTRATIVE DEMO HOTEL DATASET • 30 DAYS
          </div>
        </div>
        <ForecastChart />
      </div>

      {/* 04. AI OPERATIONAL COPILOT (Contextual Reasoning) */}
      <div className="p-5 rounded-3xl bg-white border border-[#E6E4DC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded-full border border-[#D0E7DA]">
              AI COPILOT
            </span>
            <span className="text-xs font-bold text-[#141618]">
              Gemini 3.8 Flash Operational Reasoning
            </span>
          </div>
          <p className="text-xs text-[#585E68] leading-relaxed max-w-2xl">
            {explanation.summary || 'Wednesday lunch shows high predictability. Recommended preparation includes a modest 3% safety buffer with two-stage batch cooking.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('analysis')}
          className="px-4 py-2 bg-white text-[#141618] border border-[#E6E4DC] hover:bg-[#FAF9F5] rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
        >
          View Pattern Analysis
        </button>
      </div>
    </div>
  );
}
