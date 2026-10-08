import React from 'react';
import Image from 'next/image';
import { ScreenId } from '@/components/layout/Header';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
  isSupabaseConnected?: boolean;
  onResetDemo?: () => void;
}

export function Footer({ onNavigate, isSupabaseConnected, onResetDemo }: FooterProps) {
  return (
    <footer className="w-full bg-[#F4F4EE] border-t border-[#E5E5DE] py-12 text-xs text-[#5C6658] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#E5E5DE]">
          {/* Brand mark & Tagline */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            >
              <div className="relative h-9 w-28 overflow-hidden rounded">
                <Image
                  src="/foodflow-logo.jpeg"
                  alt="FOODFLOW"
                  fill
                  sizes="112px"
                  className="object-contain object-left mix-blend-multiply"
                />
              </div>
            </button>
            <p className="text-xs text-[#4A5548] max-w-sm leading-relaxed">
              Predict demand. Prevent overproduction. Responsibly recover eligible surplus.
            </p>
            <div className="text-[11px] font-mono text-[#7D8878] tracking-wider uppercase">
              VISTERA 2026 • PS-44 CUTTING FOOD WASTE
            </div>
          </div>

          {/* Minimal Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="text-[#4A5548] hover:text-[#0E382B] transition-colors"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="text-[#4A5548] hover:text-[#0E382B] transition-colors"
            >
              Kitchen Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('forecast')}
              className="text-[#4A5548] hover:text-[#0E382B] transition-colors"
            >
              Operations
            </button>
            <button
              type="button"
              onClick={() => onNavigate('recovery')}
              className="text-[#4A5548] hover:text-[#0E382B] transition-colors"
            >
              Surplus Recovery
            </button>
            <button
              type="button"
              onClick={() => onNavigate('organizations')}
              className="text-[#4A5548] hover:text-[#0E382B] transition-colors"
            >
              Live Map
            </button>
            <button
              type="button"
              onClick={() => onNavigate('architecture')}
              className="text-[#0E382B] font-semibold hover:underline transition-colors"
            >
              AI & Architecture
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7D8878]">
          <div className="flex items-center gap-3">
            <span>
              FOODFLOW © 2026. Predict. Prevent. Recover.
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded-full border border-[#E5E5DE] bg-white text-[#5C6658]">
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-[#10B981]' : 'bg-[#D97706]'}`} />
              {isSupabaseConnected ? 'Supabase Connected' : 'Client Fallback Cache'}
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            {onResetDemo && (
              <button
                type="button"
                onClick={onResetDemo}
                className="text-[10px] text-[#7D8878] hover:text-[#0E382B] underline cursor-pointer"
                title="Reset local state to default demo values"
              >
                Reset Demo
              </button>
            )}
            <span>
              Hackathon MVP • Supabase + Leaflet + Gemini Intelligence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
