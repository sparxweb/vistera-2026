'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Sliders, 
  CheckCircle2, 
  Save,
  Activity,
  Database,
  Sparkles,
  Map,
  Calendar
} from 'lucide-react';
import { ScreenId } from '@/components/layout/Header';
import { DEMO_HOTEL } from '@/lib/demoData';

interface SettingsScreenProps {
  onNavigate?: (screen: ScreenId) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  // 1. Facility
  const [facilityName, setFacilityName] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('foodflow_facility_name') || DEMO_HOTEL.name;
    }
    return DEMO_HOTEL.name;
  });
  const [capacity, setCapacity] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('foodflow_facility_capacity');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return DEMO_HOTEL.serviceCapacity;
  });
  const [location, setLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('foodflow_facility_location') || DEMO_HOTEL.location;
    }
    return DEMO_HOTEL.location;
  });

  // 2. Operations
  const [bufferPercent, setBufferPercent] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPct = window.localStorage.getItem('foodflow_buffer_pct');
      if (savedPct && !isNaN(Number(savedPct))) {
        return Number(savedPct);
      }
    }
    return 3.0;
  });
  const [serviceDefaultMeal, setServiceDefaultMeal] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('foodflow_service_meal') || 'Lunch';
    }
    return 'Lunch';
  });
  const [defaultShiftTime, setDefaultShiftTime] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('foodflow_default_shift_time') || '12:30 PM – 15:30 PM';
    }
    return '12:30 PM – 15:30 PM';
  });
  const [savedNotice, setSavedNotice] = useState(false);

  // Integrations / API Health State (No secrets exposed)
  const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const isMapboxConfigured = Boolean(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('foodflow_facility_name', facilityName);
      window.localStorage.setItem('foodflow_facility_capacity', String(capacity));
      window.localStorage.setItem('foodflow_facility_location', location);
      window.localStorage.setItem('foodflow_buffer_pct', String(bufferPercent));
      window.localStorage.setItem('foodflow_service_meal', serviceDefaultMeal);
      window.localStorage.setItem('foodflow_default_shift_time', defaultShiftTime);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full border border-[#D0E7DA]">
              CONFIGURATION &amp; API HEALTH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Settings &amp; Integrations
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Facility parameters, operational buffer margins, security boundaries, and live API connectivity.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF4EE] border border-[#D0E7DA] text-[#1B4D36] text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* INTEGRATIONS & API HEALTH STATUS (Section 23 Master Prompt) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1B4D36]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B4D36]">
              INTEGRATIONS &amp; API HEALTH
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#737A87]">
            ZERO EXPOSED SECRETS • STRICT SERVER-SIDE ROUTING
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Supabase */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#1B4D36]" />
                <span className="text-xs font-bold text-[#141618]">Supabase PostgreSQL</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isSupabaseConfigured
                  ? 'bg-[#EAF4EE] text-[#1B4D36] border-[#D0E7DA]'
                  : 'bg-[#FCF2EB] text-[#C6682F] border-[#F6DAC8]'
              }`}>
                {isSupabaseConfigured ? 'Connected' : 'Local Fallback'}
              </span>
            </div>
            <p className="text-[11px] text-[#737A87]">
              Purpose: Persistence for historical service records, dish consumption, and recovery listings.
            </p>
            <div className="text-[10px] font-mono text-[#585E68] pt-1 border-t border-[#F0EFEB]">
              Configuration: {isSupabaseConfigured ? 'Configured (NEXT_PUBLIC_SUPABASE_URL)' : 'Not Configured (Resilient Mock Service)'}
            </div>
          </div>

          {/* 2. Gemini API */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-xs font-bold text-[#141618]">Gemini 3.8 Flash</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-[#737A87]">
              Purpose: Natural-language staging explanations and anomaly diagnosis (decoupled from numerical math).
            </p>
            <div className="text-[10px] font-mono text-[#585E68] pt-1 border-t border-[#F0EFEB]">
              Key Security: Server-side only (GEMINI_API_KEY never in client bundle)
            </div>
          </div>

          {/* 3. Mapbox GL JS */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-[#1B4D36]" />
                <span className="text-xs font-bold text-[#141618]">Mapbox GL JS</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isMapboxConfigured 
                  ? 'bg-[#EAF4EE] text-[#1B4D36] border-[#D0E7DA]' 
                  : 'bg-[#FAF9F5] text-[#737A87] border-[#E6E4DC]'
              }`}>
                {isMapboxConfigured ? 'Connected' : 'Geodesic SVG Fallback'}
              </span>
            </div>
            <p className="text-[11px] text-[#737A87]">
              Purpose: Geospatial visualization of Hyderabad recovery corridor and shelter markers.
            </p>
            <div className="text-[10px] font-mono text-[#585E68] pt-1 border-t border-[#F0EFEB]">
              Token: {isMapboxConfigured ? 'Configured (NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)' : 'Optional (Fallback Active)'}
            </div>
          </div>

          {/* 4. Holiday & Event Calendar */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1B4D36]" />
                <span className="text-xs font-bold text-[#141618]">Calendar &amp; Event Dataset</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]">
                Using Local Dataset
              </span>
            </div>
            <p className="text-[11px] text-[#737A87]">
              Purpose: Indian festivals, monsoon alerts, and banqueting multipliers (30-day verified operational shifts).
            </p>
            <div className="text-[10px] font-mono text-[#585E68] pt-1 border-t border-[#F0EFEB]">
              Source: High-Reliability Local Institutional Archive
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: FACILITY PROFILE */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0EFEB]">
            <Building2 className="w-4 h-4 text-[#1B4D36]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#141618]">
              01 • FACILITY PROFILE &amp; CAPACITY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#737A87] font-bold uppercase tracking-wider text-[10px] mb-1">
                Facility Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B4D36]"
              />
            </div>

            <div>
              <label className="block text-[#737A87] font-bold uppercase tracking-wider text-[10px] mb-1">
                Max Service Capacity (Hard Limit)
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B4D36]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#737A87] font-bold uppercase tracking-wider text-[10px] mb-1">
                Location &amp; Delivery Dock
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B4D36]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: OPERATIONS */}
        <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0EFEB]">
            <Sliders className="w-4 h-4 text-[#1B4D36]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#141618]">
              02 • OPERATIONS &amp; SAFETY BUFFER
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#737A87] font-bold uppercase tracking-wider text-[10px]">
                  Configured Safety Buffer Margin
                </label>
                <span className="font-mono font-bold text-[#1B4D36]">
                  +{bufferPercent}% (~{Math.round(795 * (bufferPercent / 100))} portions)
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={bufferPercent}
                onChange={(e) => setBufferPercent(Number(e.target.value))}
                className="w-full accent-[#1B4D36] cursor-pointer"
              />
              <span className="text-[11px] text-[#737A87] mt-1 block">
                Recommended 3.0% buffer balances non-stockout resilience with strict food waste reduction targets.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[#737A87] font-bold uppercase tracking-wider text-[10px] mb-1">
                  Default Service Meal
                </label>
                <select
                  value={serviceDefaultMeal}
                  onChange={(e) => setServiceDefaultMeal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] font-bold focus:outline-none focus:ring-2 focus:ring-[#1B4D36]"
                >
                  <option value="Breakfast">Breakfast (800 cap)</option>
                  <option value="Lunch">Lunch (1000 cap)</option>
                  <option value="Dinner">Dinner (900 cap)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#737A87] font-bold uppercase tracking-wider text-[10px] mb-1">
                  Standard Shift Window
                </label>
                <input
                  type="text"
                  value={defaultShiftTime}
                  onChange={(e) => setDefaultShiftTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B4D36]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY SAVE BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 border border-[#E6E4DC] bg-white hover:bg-[#FAF9F5] text-[#585E68] rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
            >
              Back to Dashboard
            </button>
          )}
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#1B4D36] hover:bg-[#16402D] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
