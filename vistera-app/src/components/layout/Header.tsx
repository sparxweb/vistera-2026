'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Menu, 
  X, 
  Settings, 
  TrendingUp, 
  UtensilsCrossed, 
  BarChart3, 
  History, 
  Truck, 
  Cpu, 
  ArrowRight,
  Building2,
  Layers
} from 'lucide-react';
export type ScreenId =
  | 'overview'
  | 'login'
  | 'dashboard'
  | 'forecast'
  | 'preparation'
  | 'consumption'
  | 'analysis'
  | 'recovery'
  | 'organizations'
  | 'history'
  | 'architecture'
  | 'settings';

interface HeaderProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export function Header({ activeScreen, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = activeScreen === 'overview';

  // Scroll detection for cinematic smooth navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled || !isLanding
          ? 'bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E6E4DC] shadow-[0_2px_12px_rgba(20,22,24,0.03)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* LEFT: Official Brand Logo Asset */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="flex items-center gap-2 group transition-opacity hover:opacity-90 cursor-pointer"
              aria-label="FOODFLOW Home"
            >
              <div className="relative h-8 sm:h-9 w-32 sm:w-36 flex items-center">
                <Image
                  src="/foodflow-logo.jpeg"
                  alt="FOODFLOW"
                  width={280}
                  height={75}
                  priority
                  className="h-full w-auto object-contain mix-blend-multiply"
                />
              </div>
            </button>

            {/* Shift Context Indicator (Only when in Kitchen App) */}
            {!isLanding && (
              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E6E4DC] text-xs">
                <span className="w-2 h-2 rounded-full bg-[#1B4D36] animate-pulse" />
                <span className="font-semibold text-[#141618]">Central Kitchen</span>
                <span className="text-[#8A929E]">•</span>
                <span className="text-[#585E68]">Lunch Shift Active</span>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* CENTER: Context-Aware Navigation */}
          {/* ============================================================== */}
          {isLanding ? (
            /* PUBLIC LANDING NAVBAR */
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#problem"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#585E68] hover:text-[#141618] transition-colors"
              >
                The Problem
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#585E68] hover:text-[#141618] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#workflow"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#585E68] hover:text-[#141618] transition-colors"
              >
                7-Stage Loop
              </a>
            </nav>
          ) : (
            /* KITCHEN APPLICATION NAVBAR (7 B2B OPERATIONAL SECTIONS) */
            <nav className="hidden xl:flex items-center gap-1">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'dashboard'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
                title="Overview & 4 Core Operational Answers"
              >
                1. Overview
              </button>

              <button
                type="button"
                onClick={() => onNavigate('forecast')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'forecast'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
                title="Demand Forecast & Explainable Calculation"
              >
                2. Demand Forecast
              </button>

              <button
                type="button"
                onClick={() => onNavigate('preparation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'preparation'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
                title="Food Preparation & Batch Staging Calculator"
              >
                3. Food Preparation
              </button>

              <button
                type="button"
                onClick={() => onNavigate('consumption')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'consumption'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
                title="Actual Service Tracking & Remaining Food"
              >
                4. Service Tracking
              </button>

              <button
                type="button"
                onClick={() => onNavigate('organizations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'recovery' || activeScreen === 'organizations'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
                title="Hyderabad Recovery Grid & Partner Matching"
              >
                5. Food Recovery
              </button>

              <button
                type="button"
                onClick={() => onNavigate('history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'history' || activeScreen === 'analysis'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
                title="90-Day Archive & Chronological Holdout Validation"
              >
                6. History & Accuracy
              </button>

              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'settings'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
                title="Integrations, Supabase Health & Parameters"
              >
                7. Integrations & Settings
              </button>
            </nav>
          )}

          {/* ============================================================== */}
          {/* RIGHT: Primary Action / Settings Dock */}
          {/* ============================================================== */}
          <div className="flex items-center gap-2.5">
            {isLanding ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 rounded-xl border border-[#E6E4DC] text-xs font-semibold text-[#141618] hover:bg-[#FAF9F5] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#1B4D36]" />
                  <span>Demo Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#0E382B] hover:bg-[#164E3D] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D0E7DA] bg-[#EAF4EE] text-xs font-semibold text-[#1B4D36] hover:bg-[#D8EADB] transition-colors cursor-pointer"
                  title="Facility: Deccan Grand Hotel (Click to switch)"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="max-w-[130px] truncate">Deccan Grand Hotel</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('settings')}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    activeScreen === 'settings'
                      ? 'bg-[#1B4D36] text-white border-[#1B4D36]'
                      : 'border-[#E6E4DC] text-[#585E68] hover:text-[#141618] hover:bg-[#FAF9F5]'
                  }`}
                  title="Facility Settings & API Health"
                  aria-label="Facility Settings & API Health"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('overview')}
                  className="hidden sm:inline-flex text-xs font-semibold text-[#737A87] hover:text-[#141618] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Exit
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-[#E6E4DC] text-[#141618] hover:bg-[#FAF9F5] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE FULL-HEIGHT SLIDING DRAWER */}
      {/* ============================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-18 bg-[#FBFBFA] z-50 border-t border-[#E6E4DC] p-6 overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="space-y-6 max-w-sm mx-auto">
            {/* Main Operational Sections */}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A929E] mb-2">
                HOSPITALITY OPERATIONS (7 SECTIONS)
              </div>
              <div className="space-y-1">
                {[
                  { id: 'dashboard' as ScreenId, label: '1. Overview', icon: BarChart3 },
                  { id: 'forecast' as ScreenId, label: '2. Demand Forecast', icon: TrendingUp },
                  { id: 'preparation' as ScreenId, label: '3. Food Preparation', icon: UtensilsCrossed },
                  { id: 'consumption' as ScreenId, label: '4. Service Tracking', icon: Layers },
                  { id: 'organizations' as ScreenId, label: '5. Food Recovery (Map)', icon: Truck },
                  { id: 'history' as ScreenId, label: '6. History & Accuracy', icon: History },
                  { id: 'settings' as ScreenId, label: '7. Integrations & Settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                        activeScreen === item.id ? 'bg-[#1B4D36] text-white' : 'text-[#141618] hover:bg-[#F4F3ED]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Section */}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A929E] mb-2">
                SYSTEM & SESSIONS
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('architecture');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeScreen === 'architecture' ? 'bg-[#1B4D36] text-white' : 'text-[#141618] hover:bg-[#F4F3ED]'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>AI Architecture & Logic</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('overview');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#737A87] hover:bg-[#F4F3ED] transition-colors"
                >
                  Exit to Landing Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
