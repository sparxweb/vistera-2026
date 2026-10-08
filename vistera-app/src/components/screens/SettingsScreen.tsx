'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  MapPin,
  Save
} from 'lucide-react';
import { ScreenId } from '@/components/layout/Header';
import { DEMO_KITCHEN } from '@/lib/demoData';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  // 1. Facility
  const [facilityName, setFacilityName] = useState(DEMO_KITCHEN.name);
  const [capacity, setCapacity] = useState(DEMO_KITCHEN.totalCapacity);
  const [location, setLocation] = useState('Building 4, Central Campus, Dock 2B');

  // 2. Operations
  const [bufferPercent, setBufferPercent] = useState(2.4);
  const [serviceDefaultMeal, setServiceDefaultMeal] = useState('Lunch');
  const [defaultShiftTime, setDefaultShiftTime] = useState('11:30 AM – 14:30 PM');

  // 3. AI & Security
  const [aiProvider, setAiProvider] = useState<'gemini' | 'nemotron'>('gemini');
  const [apiStatus, setApiStatus] = useState('Connected • Latency 142ms');
  const [securityStatus, setSecurityStatus] = useState('Supabase RLS Active • Encrypted');

  const [savedNotice, setSavedNotice] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPct = window.localStorage.getItem('foodflow_buffer_pct');
      if (savedPct && !isNaN(Number(savedPct))) {
        setBufferPercent(Number(savedPct));
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('foodflow_buffer_pct', String(bufferPercent));
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
              CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Manage dining facility parameters, operational buffer margins, and AI security.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8EFEA] border border-[#C5DACD] text-[#0E382B] text-xs font-semibold animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: FACILITY */}
        <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5DE]">
            <Building2 className="w-4 h-4 text-[#0E382B]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B]">
              01 • FACILITY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#7D8878] font-bold uppercase tracking-wider text-[10px] mb-1">
                Facility Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] font-semibold focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[#7D8878] font-bold uppercase tracking-wider text-[10px] mb-1">
                Seating / Dining Capacity
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] font-semibold focus:outline-none focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#7D8878] font-bold uppercase tracking-wider text-[10px] mb-1">
                Dock & Loading Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] font-semibold focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: OPERATIONS */}
        <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5DE]">
            <Sliders className="w-4 h-4 text-[#0E382B]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B]">
              02 • OPERATIONS
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#7D8878] font-bold uppercase tracking-wider text-[10px]">
                  Safety Buffer Margin
                </label>
                <span className="font-mono font-bold text-[#0E382B]">
                  +{bufferPercent}% (~{Math.round(742 * (bufferPercent / 100))} servings)
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={bufferPercent}
                onChange={(e) => setBufferPercent(Number(e.target.value))}
                className="w-full accent-[#0E382B] cursor-pointer"
              />
              <span className="text-[11px] text-[#5C6658] mt-1 block">
                Recommended 2.4% buffer balances non-stockout resilience with food waste reduction targets.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#7D8878] font-bold uppercase tracking-wider text-[10px] mb-1">
                  Default Service Meal
                </label>
                <select
                  value={serviceDefaultMeal}
                  onChange={(e) => setServiceDefaultMeal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] font-semibold focus:outline-none"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-[#7D8878] font-bold uppercase tracking-wider text-[10px] mb-1">
                  Standard Shift Window
                </label>
                <input
                  type="text"
                  value={defaultShiftTime}
                  onChange={(e) => setDefaultShiftTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: AI & SECURITY */}
        <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5DE]">
            <ShieldCheck className="w-4 h-4 text-[#0E382B]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0E382B]">
              03 • AI & SECURITY
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#7D8878] font-bold uppercase tracking-wider text-[10px] mb-2">
                Qualitative Reasoning Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAiProvider('gemini')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    aiProvider === 'gemini'
                      ? 'bg-[#E8EFEA] border-[#0E382B] shadow-sm'
                      : 'bg-[#FBFBF9] border-[#E5E5DE] text-[#5C6658]'
                  }`}
                >
                  <div className="font-bold text-[#0E382B]">Gemini 3.8 Flash</div>
                  <div className="text-[10px] text-[#5C6658] mt-0.5">Google Cloud Generative AI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAiProvider('nemotron')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    aiProvider === 'nemotron'
                      ? 'bg-[#E8EFEA] border-[#0E382B] shadow-sm'
                      : 'bg-[#FBFBF9] border-[#E5E5DE] text-[#5C6658]'
                  }`}
                >
                  <div className="font-bold text-[#0E382B]">NVIDIA Nemotron</div>
                  <div className="text-[10px] text-[#5C6658] mt-0.5">OpenAI Compatible Endpoint</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
                <span className="text-[10px] text-[#7D8878] uppercase font-bold block mb-1">
                  API Status
                </span>
                <span className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  {apiStatus}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
                <span className="text-[10px] text-[#7D8878] uppercase font-bold block mb-1">
                  Security Status
                </span>
                <span className="text-xs font-bold text-[#0E382B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  {securityStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY SAVE BUTTON */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
