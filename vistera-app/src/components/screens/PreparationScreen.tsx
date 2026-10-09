'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChefHat, 
  AlertCircle, 
  FileSpreadsheet,
  ArrowRight,
  Info
} from 'lucide-react';
import { ScreenId } from '@/components/layout/Header';
import { ServiceType, NumericalForecast } from '@/types/foodflow';

interface PreparationScreenProps {
  onNavigate: (screen: ScreenId) => void;
  predictedDiners?: number;
  initialService?: ServiceType;
  forecast?: NumericalForecast;
}

export interface CulinaryItemSpec {
  id: string;
  name: string;
  category: 'Staple' | 'Dal & Gravy' | 'Curry / Protein' | 'Dairy' | 'Breakfast / Tiffin' | 'Breads';
  service: 'ALL' | 'BREAKFAST' | 'LUNCH' | 'DINNER';
  unit: 'kg' | 'L' | 'pieces';
  ratePerDiner: number;
  rateSource: 'Learned (90-day historical average)' | 'Configured institutional standard' | 'Fallback estimated rate';
  defaultBufferPct: number;
  decimals: number;
  triggerAdvice: string;
}

const INDIAN_CULINARY_CATALOG: CulinaryItemSpec[] = [
  {
    id: 'prep-rice',
    name: 'Steamed Sona Masoori Rice',
    category: 'Staple',
    service: 'LUNCH',
    unit: 'kg',
    ratePerDiner: 0.0526,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 3.0,
    decimals: 1,
    triggerAdvice: 'Cook 85% initial batch by 11:45 AM. Hold 15% reserve dry grains; boil if 12:45 PM turnstile exceeds 650 diners.',
  },
  {
    id: 'prep-dal',
    name: 'Tomato Dal / Dal Tadka',
    category: 'Dal & Gravy',
    service: 'LUNCH',
    unit: 'L',
    ratePerDiner: 0.0215,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 3.0,
    decimals: 1,
    triggerAdvice: 'Stage 85% hot-held in Bain-marie at ≥65°C; keep 15% finishing reserve for 13:15 PM second seating rush.',
  },
  {
    id: 'prep-chicken',
    name: 'Andhra Chicken Curry',
    category: 'Curry / Protein',
    service: 'LUNCH',
    unit: 'kg',
    ratePerDiner: 0.0385,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 5.0,
    decimals: 1,
    triggerAdvice: 'Cook primary batch (85%); hold reserve gravy and par-cooked chicken pieces. Finish only if non-veg tray depletes >70% in first 40 min.',
  },
  {
    id: 'prep-paneer',
    name: 'Paneer Butter Masala',
    category: 'Curry / Protein',
    service: 'LUNCH',
    unit: 'kg',
    ratePerDiner: 0.0240,
    rateSource: 'Configured institutional standard',
    defaultBufferPct: 4.0,
    decimals: 1,
    triggerAdvice: 'Hold paneer cubes in warm salted water; finish gravy in 2 batches to avoid rubbery paneer texture.',
  },
  {
    id: 'prep-veg-korma',
    name: 'Mixed Vegetable Korma',
    category: 'Curry / Protein',
    service: 'LUNCH',
    unit: 'kg',
    ratePerDiner: 0.0210,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 4.0,
    decimals: 1,
    triggerAdvice: 'Steam vegetables separately; combine with cashew poppy gravy just prior to counter presentation.',
  },
  {
    id: 'prep-biryani',
    name: 'Hyderabadi Chicken Dum Biryani',
    category: 'Staple',
    service: 'DINNER',
    unit: 'kg',
    ratePerDiner: 0.1450,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 5.0,
    decimals: 1,
    triggerAdvice: 'Seal 2 Handis (80% / 20%). Break seal on second Handi only when first reaches 15 remaining servings.',
  },
  {
    id: 'prep-curd',
    name: 'Fresh Set Curd',
    category: 'Dairy',
    service: 'LUNCH',
    unit: 'L',
    ratePerDiner: 0.0150,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 2.0,
    decimals: 1,
    triggerAdvice: 'Keep chilled in insulated dairy canisters. Transfer to serving counter in 2-litre batches.',
  },
  {
    id: 'prep-idli',
    name: 'Steamed Rice & Urad Idli',
    category: 'Breakfast / Tiffin',
    service: 'BREAKFAST',
    unit: 'pieces',
    ratePerDiner: 2.50,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 4.0,
    decimals: 0,
    triggerAdvice: 'Run continuous steamers in 12-tray batches. Hold fermented batter ready in chilling room for on-demand steam.',
  },
  {
    id: 'prep-dosa',
    name: 'Crisp Masala & Plain Dosa',
    category: 'Breakfast / Tiffin',
    service: 'BREAKFAST',
    unit: 'pieces',
    ratePerDiner: 1.25,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 3.0,
    decimals: 0,
    triggerAdvice: 'Live counter prep on cast-iron griddles. Adjust batter replenishment rate based on live counter queue length.',
  },
  {
    id: 'prep-sambar',
    name: 'South Indian Drumstick Sambar',
    category: 'Dal & Gravy',
    service: 'BREAKFAST',
    unit: 'L',
    ratePerDiner: 0.0320,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 3.0,
    decimals: 1,
    triggerAdvice: 'Prepare base stock early; perform final mustard curry leaf tadka in 2 separate rounds.',
  },
  {
    id: 'prep-chutney',
    name: 'Fresh Coconut & Roasted Chana Chutney',
    category: 'Dal & Gravy',
    service: 'BREAKFAST',
    unit: 'L',
    ratePerDiner: 0.0180,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 3.0,
    decimals: 1,
    triggerAdvice: 'Grind in small fresh batches. Keep cold-held below 8°C to prevent coconut souring.',
  },
  {
    id: 'prep-roti',
    name: 'Phulka / Tandoori Roti',
    category: 'Breads',
    service: 'DINNER',
    unit: 'pieces',
    ratePerDiner: 2.20,
    rateSource: 'Learned (90-day historical average)',
    defaultBufferPct: 4.0,
    decimals: 0,
    triggerAdvice: 'Portion dough balls in advance. Keep rolled rotis under damp muslin cloth; bake fresh during dining peak.',
  },
];

export function PreparationScreen({
  onNavigate,
  predictedDiners: propDiners = 795,
  initialService = 'LUNCH',
  forecast,
}: PreparationScreenProps) {
  const effectiveDiners = forecast?.predictedDiners || forecast?.predictedDemand || propDiners;
  const effectiveService = (forecast?.serviceMeal?.toUpperCase() as ServiceType) || initialService;

  const [service, setService] = useState<ServiceType>(effectiveService);
  const [diners, setDiners] = useState<number>(effectiveDiners);
  const [bufferPct, setBufferPct] = useState<number>(forecast?.safetyBufferPct || 4.0);
  const [initialBatchPct, setInitialBatchPct] = useState<number>(85); // 85% initial, 15% reserve
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Synchronize when forecast or propDiners updates
  React.useEffect(() => {
    const updatedDiners = forecast?.predictedDiners || forecast?.predictedDemand || propDiners;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiners(updatedDiners);
    if (forecast?.serviceMeal) {
      setService(forecast.serviceMeal.toUpperCase() as ServiceType);
    }
    if (forecast?.safetyBufferPct) {
      setBufferPct(forecast.safetyBufferPct);
    }
  }, [forecast, propDiners]);

  // Filter items matching service (or show all if selected)
  const filteredCatalog = useMemo(() => {
    return INDIAN_CULINARY_CATALOG.filter((item) => {
      const serviceMatch = item.service === 'ALL' || item.service === service || service === 'LUNCH';
      const catMatch = selectedCategory === 'ALL' || item.category === selectedCategory;
      return serviceMatch && catMatch;
    });
  }, [service, selectedCategory]);

  // Rounding helper
  const roundValue = (val: number, decimals: number) => {
    if (decimals === 0) return Math.ceil(val);
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* 01. HEADER & OPERATIONAL CONTEXT */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F0EFEB]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA] flex items-center justify-center shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4EE] text-[#1B4D36] font-mono text-[11px] font-bold border border-[#D0E7DA]">
                  STAGED CULINARY PRODUCTION
                </span>
                {forecast?.forecastId && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#585E68] text-[10px] font-mono font-bold border border-[#E6E4DC]">
                    FORECAST ID: {forecast.forecastId}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                  Decision-Support Recommendations
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#141618]">
                Food Preparation Calculator — Institutional Catering
              </h1>
              <p className="text-xs text-[#737A87] mt-1">
                Converts historical customer demand into calibrated preparation targets, safety buffers, and two-stage batch allocations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('consumption')}
              className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#F0EFEB] text-[#141618] border border-[#E6E4DC] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Service Tracking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
          {/* Service Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#585E68] uppercase tracking-wider block mb-1.5">
              Service Shift
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#E6E4DC]">
              {(['BREAKFAST', 'LUNCH', 'DINNER'] as ServiceType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setService(s)}
                  className={`py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    service === s
                      ? 'bg-[#1B4D36] text-white shadow-xs'
                      : 'text-[#585E68] hover:text-[#141618]'
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Predicted Diners Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#585E68] uppercase tracking-wider">
                Predicted Diners (N)
              </label>
              <span className="text-[10px] text-[#1B4D36] font-bold font-mono">From Forecast</span>
            </div>
            <input
              type="number"
              min="50"
              max="2000"
              step="5"
              value={diners}
              onChange={(e) => setDiners(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E6E4DC] rounded-xl text-sm font-bold text-[#141618] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4D36]"
            />
          </div>

          {/* Safety Buffer % Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#585E68] uppercase tracking-wider">
                Safety Buffer
              </label>
              <span className="text-xs font-bold text-[#1B4D36] font-mono">+{bufferPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={bufferPct}
              onChange={(e) => setBufferPct(parseFloat(e.target.value))}
              className="w-full accent-[#1B4D36] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#737A87] mt-1">
              <span>0% (Tight)</span>
              <span>+5% (Standard)</span>
              <span>+10% (High Event)</span>
            </div>
          </div>

          {/* Staging Split Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#585E68] uppercase tracking-wider">
                Batch Staging Split
              </label>
              <span className="text-xs font-bold text-[#C6682F] font-mono">
                {initialBatchPct}% / {100 - initialBatchPct}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              step="5"
              value={initialBatchPct}
              onChange={(e) => setInitialBatchPct(parseInt(e.target.value))}
              className="w-full accent-[#C6682F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#737A87] mt-1">
              <span>Initial: {initialBatchPct}%</span>
              <span>Reserve: {100 - initialBatchPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 02. EXPLAINER CALLOUT: FORMULA VERIFICATION */}
      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-[#1B4D36] shrink-0" />
          <span className="text-[#585E68]">
            <strong className="text-[#141618]">Explainable Formula:</strong> Base Quantity = {diners} diners × Per-Diner Rate. Recommended Total = Base × (1 + {bufferPct}% buffer). Initial Batch = Total × {initialBatchPct}%, Reserve Batch = Total × {100 - initialBatchPct}%.
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#737A87] shrink-0">
          ROUNDED TO OPERATIONAL DECIMALS
        </div>
      </div>

      {/* 03. PRODUCTION RECOMMENDATIONS TABLE */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#F0EFEB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#141618]">
              Indian Meal Preparation Targets ({filteredCatalog.length} Items)
            </h2>
            <p className="text-xs text-[#737A87] mt-0.5">
              Service: <strong className="text-[#1B4D36]">{service}</strong> • Target Attendees: <strong className="text-[#141618]">{diners} diners</strong>
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'Staple', 'Dal & Gravy', 'Curry / Protein', 'Dairy', 'Breakfast / Tiffin', 'Breads'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1B4D36] text-white'
                    : 'bg-[#FAF9F5] text-[#585E68] hover:bg-[#F0EFEB] border border-[#E6E4DC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E6E4DC] text-[#737A87] font-semibold text-[11px]">
                <th className="py-3 px-4">Menu Item & Category</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-3">Consumption Rate</th>
                <th className="py-3 px-3 text-right">Base Need</th>
                <th className="py-3 px-3 text-right font-bold text-[#1B4D36]">Recommended Total</th>
                <th className="py-3 px-4 text-center">Batch Staging</th>
                <th className="py-3 px-4">Culinary Trigger Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEB]">
              {filteredCatalog.map((item) => {
                const baseQty = diners * item.ratePerDiner;
                const recTotal = baseQty * (1 + bufferPct / 100);
                const roundedTotal = roundValue(recTotal, item.decimals);
                const initialBatch = roundValue(roundedTotal * (initialBatchPct / 100), item.decimals);
                const reserveBatch = roundValue(roundedTotal - initialBatch, item.decimals);

                return (
                  <tr key={item.id} className="hover:bg-[#FBFBFA] transition-colors">
                    {/* Item Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-[#141618] text-sm">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF9F5] text-[#585E68] border border-[#E6E4DC] font-semibold">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-[#737A87]">
                          Shift: {item.service}
                        </span>
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-1 rounded-md bg-[#FAF9F5] font-mono font-bold text-[#141618] border border-[#E6E4DC]">
                        {item.unit}
                      </span>
                    </td>

                    {/* Consumption Rate */}
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-bold text-[#141618]">
                        {item.ratePerDiner} {item.unit}/diner
                      </div>
                      <div className="text-[10px] text-[#737A87] truncate max-w-[140px]" title={item.rateSource}>
                        {item.rateSource}
                      </div>
                    </td>

                    {/* Base Requirement */}
                    <td className="py-3.5 px-3 text-right font-mono text-[#585E68]">
                      {roundValue(baseQty, item.decimals)} {item.unit}
                    </td>

                    {/* Recommended Total (+Buffer) */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-mono text-sm font-extrabold text-[#1B4D36]">
                        {roundedTotal} {item.unit}
                      </div>
                      <span className="text-[10px] text-[#1B4D36] font-semibold">
                        +{bufferPct}% buffer
                      </span>
                    </td>

                    {/* Batch Staging */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold">
                        <span className="px-2 py-1 rounded-lg bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]" title="Primary batch cooked before service">
                          {initialBatch} {item.unit} ({initialBatchPct}%)
                        </span>
                        <span className="text-[#737A87]">+</span>
                        <span className="px-2 py-1 rounded-lg bg-[#FCF1E9] text-[#C6682F] border border-[#F6DAC8]" title="Held as reserve finishing batch">
                          {reserveBatch} {item.unit} ({100 - initialBatchPct}%)
                        </span>
                      </div>
                      <div className="text-[10px] text-[#737A87] mt-0.5">
                        Initial Batch + Reserve Batch
                      </div>
                    </td>

                    {/* Culinary Trigger Guidance */}
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <p className="text-[11px] text-[#585E68] leading-relaxed">
                        {item.triggerAdvice}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E6E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#585E68]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              These recommendations provide decision support for kitchen superintendents. They do not constitute an automated guarantee against service shortages.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                alert(`Kitchen Prep Sheet for ${diners} diners (${service}) ready for kitchen dispatch printing.`);
              }}
              className="px-3.5 py-2 bg-[#EAF4EE] hover:bg-[#DDF0E3] text-[#1B4D36] border border-[#D0E7DA] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Print Production Ticket</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('consumption')}
              className="px-4 py-2 bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Service Tracking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
