'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Bell, 
  CheckCircle2,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { ScreenId } from '@/components/layout/Header';
import { DEMO_KITCHEN } from '@/lib/demoData';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [kitchenName, setKitchenName] = useState(DEMO_KITCHEN.name);
  const [maxCapacity, setMaxCapacity] = useState(DEMO_KITCHEN.totalCapacity);
  const [bufferPercent, setBufferPercent] = useState(2.4);
  const [llmProvider, setLlmProvider] = useState<'gemini' | 'nemotron'>('gemini');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              MODULE 06 • FACILITY CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Kitchen & Model Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Configure institutional dining limits, safety buffer thresholds, and LLM reasoning providers.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF4EE] border border-[#CCE3D5] text-[#1B4D36] text-xs font-semibold animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Kitchen Details */}
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-4">
          <h3 className="text-sm font-bold text-[#141618] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1B4D36]" />
            Dining Hall Facility Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#141618] mb-1">
                Facility Name
              </label>
              <input
                type="text"
                value={kitchenName}
                onChange={(e) => setKitchenName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141618] mb-1">
                Shift Capacity (Seats / Shift)
              </label>
              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Predictive Engine & Buffer Thresholds */}
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-4">
          <h3 className="text-sm font-bold text-[#141618] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1B4D36]" />
            Forecast Engine Parameters
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-[#141618]">
                  Default Safety Buffer Percentage
                </label>
                <span className="font-mono font-bold text-[#1B4D36]">
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
                className="w-full accent-[#1B4D36] cursor-pointer"
              />
              <span className="text-[10px] text-[#8A929E] block">
                Safety margin added to ML predictions to safeguard service non-stockout SLA without creating excess surplus.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: AI Cognitive Engine */}
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-4">
          <h3 className="text-sm font-bold text-[#141618] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1B4D36]" />
            Cognitive Explanation Provider
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div 
              onClick={() => setLlmProvider('gemini')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                llmProvider === 'gemini'
                  ? 'bg-[#EAF4EE] border-[#1B4D36] shadow-sm'
                  : 'bg-[#FAF9F5] border-[#E8E6DE] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#141618]">Google Gemini 3.8 Flash</span>
                {llmProvider === 'gemini' && <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />}
              </div>
              <p className="text-[11px] text-[#585E68]">
                Primary natural-language reasoning provider for contextual breakdown and temperature mitigation advice.
              </p>
            </div>

            <div 
              onClick={() => setLlmProvider('nemotron')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                llmProvider === 'nemotron'
                  ? 'bg-[#EAF4EE] border-[#1B4D36] shadow-sm'
                  : 'bg-[#FAF9F5] border-[#E8E6DE] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#141618]">NVIDIA Nemotron 30B</span>
                {llmProvider === 'nemotron' && <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />}
              </div>
              <p className="text-[11px] text-[#585E68]">
                Secondary fallback reasoning provider routed through NVIDIA NIM integration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-[#585E68] hover:text-[#141618]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#141618] hover:bg-[#1B4D36] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Save Facility Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
