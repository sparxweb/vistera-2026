'use client';

import React from 'react';
import { ScreenId } from '@/components/layout/Header';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-[#FAF9F5] border-t border-[#E6E4DC] py-12 text-xs text-[#6F7682] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#141618] text-white font-mono font-bold text-xs flex items-center justify-center">
                FF
              </div>
              <span className="font-bold tracking-tight text-sm text-[#141618]">
                FOODFLOW
              </span>
            </div>
            <p className="text-xs text-[#525866] max-w-sm leading-relaxed">
              AI-Powered Food Waste Prevention & Surplus Recovery Platform for institutional dining halls, hostels, and canteens.
            </p>
            <div className="text-[11px] font-mono text-[#8A929E]">
              PROBLEM PS-44 • 36-HOUR NATIONAL HACKATHON PROTOTYPE
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] font-semibold text-[#141618] uppercase tracking-wider block">
              Application Modules
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                01. Overview
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                02. Command Center
              </button>
              <button
                type="button"
                onClick={() => onNavigate('forecast')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                03. Demand Forecast
              </button>
              <button
                type="button"
                onClick={() => onNavigate('consumption')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                04. Consumption Log
              </button>
              <button
                type="button"
                onClick={() => onNavigate('analysis')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                05. Mismatch Analysis
              </button>
              <button
                type="button"
                onClick={() => onNavigate('recovery')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                06. Surplus Recovery
              </button>
              <button
                type="button"
                onClick={() => onNavigate('organizations')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                07. Verified Map
              </button>
              <button
                type="button"
                onClick={() => onNavigate('history')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                08. Model History
              </button>
              <button
                type="button"
                onClick={() => onNavigate('architecture')}
                className="text-left text-[#1B4D36] font-semibold hover:underline transition-colors"
              >
                09. AI Architecture
              </button>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="text-left text-[#585E68] hover:text-[#141618] transition-colors"
              >
                10. Facility Settings
              </button>
            </div>
          </div>

          {/* Col 3: Principles & Zero Fake AI Standard */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-[11px] font-semibold text-[#141618] uppercase tracking-wider block">
              Architectural Standard
            </span>
            <p className="text-[11px] text-[#525866] leading-relaxed">
              Strict separation between statistical time-series forecasting (numerical numbers) and Gemini LLM (qualitative reasoning).
            </p>
            <div className="pt-2 text-[10px] text-[#8A929E]">
              DEMO DATA LAYER ACTIVE • ZERO UNBOUNDED CLAIMS
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EAE8E0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>
            FOODFLOW Platform © 2026. Predict. Prevent. Recover.
          </span>
          <span className="font-mono text-[#8A929E]">
            Next.js + TypeScript + Gemini 3.8 Flash + Supabase Ready
          </span>
        </div>
      </div>
    </footer>
  );
}
