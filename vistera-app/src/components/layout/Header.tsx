'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Menu, 
  X, 
  Settings, 
  ChevronDown, 
  TrendingUp, 
  UtensilsCrossed, 
  BarChart3, 
  History, 
  Truck, 
  Users2, 
  Cpu, 
  ArrowRight,
  Building2
} from 'lucide-react';
export type ScreenId =
  | 'overview'
  | 'login'
  | 'dashboard'
  | 'forecast'
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
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  const opsDropdownRef = useRef<HTMLDivElement>(null);
  const recDropdownRef = useRef<HTMLDivElement>(null);

  const isLanding = activeScreen === 'overview';

  // Scroll detection for cinematic smooth navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (opsDropdownRef.current && !opsDropdownRef.current.contains(e.target as Node)) {
        setOperationsOpen(false);
      }
      if (recDropdownRef.current && !recDropdownRef.current.contains(e.target as Node)) {
        setRecoveryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOperationsActive = ['forecast', 'consumption', 'analysis', 'history'].includes(activeScreen);
  const isRecoveryActive = ['recovery', 'organizations'].includes(activeScreen);

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
            /* KITCHEN APPLICATION NAVBAR */
            <nav className="hidden md:flex items-center gap-1.5">
              {/* 1. Overview / Command Center */}
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'dashboard'
                    ? 'bg-[#1B4D36] text-white shadow-xs'
                    : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                }`}
              >
                Control Center
              </button>

              {/* 2. Operations Menu Dropdown */}
              <div className="relative" ref={opsDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOperationsOpen(!operationsOpen);
                    setRecoveryOpen(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isOperationsActive
                      ? 'bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]'
                      : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                  }`}
                >
                  <span>Operations</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${operationsOpen ? 'rotate-180' : ''}`} />
                </button>

                {operationsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E6E4DC] p-2 shadow-[0_12px_32px_rgba(20,22,24,0.08)] z-50 animate-in fade-in duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('forecast');
                        setOperationsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F7F2] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#EAF4EE] text-[#1B4D36] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#141618]">Demand Forecast</div>
                        <div className="text-[11px] text-[#737A87]">Predict today&apos;s meal demand</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('consumption');
                        setOperationsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F7F2] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FCF2EB] text-[#C6682F] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#141618]">Consumption Log</div>
                        <div className="text-[11px] text-[#737A87]">Track served & detect surplus</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('analysis');
                        setOperationsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F7F2] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F0EFEB] text-[#585E68] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#141618]">Mismatch Analysis</div>
                        <div className="text-[11px] text-[#737A87]">Evaluate likely factors & advice</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('history');
                        setOperationsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F7F2] transition-colors flex items-start gap-3 cursor-pointer group border-t border-[#F0EFEB] mt-1 pt-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F4F3ED] text-[#141618] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <History className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#141618]">Continuous Learning</div>
                        <div className="text-[11px] text-[#737A87]">Past shifts & feedback log</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Recovery Menu Dropdown */}
              <div className="relative" ref={recDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryOpen(!recoveryOpen);
                    setOperationsOpen(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isRecoveryActive
                      ? 'bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA]'
                      : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F4F3ED]'
                  }`}
                >
                  <span>Recovery</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${recoveryOpen ? 'rotate-180' : ''}`} />
                </button>

                {recoveryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E6E4DC] p-2 shadow-[0_12px_32px_rgba(20,22,24,0.08)] z-50 animate-in fade-in duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('recovery');
                        setRecoveryOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F7F2] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#EAF4EE] text-[#1B4D36] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#141618]">Surplus Listings</div>
                        <div className="text-[11px] text-[#737A87]">Manage active donations & pipeline</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('organizations');
                        setRecoveryOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F7F2] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FCF2EB] text-[#C6682F] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Users2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#141618]">Recovery Partners & Map</div>
                        <div className="text-[11px] text-[#737A87]">Verified shelters & live routing</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Architecture Link */}
              <button
                type="button"
                onClick={() => onNavigate('architecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScreen === 'architecture'
                    ? 'bg-[#141618] text-white'
                    : 'text-[#737A87] hover:text-[#141618]'
                }`}
              >
                AI Pipeline
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
            {/* Workspace Section */}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A929E] mb-2">
                WORKSPACE
              </div>
              <div className="space-y-1">
                {[
                  { id: 'dashboard' as ScreenId, label: 'Control Center', icon: BarChart3 },
                  { id: 'forecast' as ScreenId, label: 'Demand Forecast', icon: TrendingUp },
                  { id: 'consumption' as ScreenId, label: 'Consumption Log', icon: UtensilsCrossed },
                  { id: 'analysis' as ScreenId, label: 'Mismatch Analysis', icon: BarChart3 },
                  { id: 'history' as ScreenId, label: 'Continuous Learning', icon: History },
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

            {/* Recovery Section */}
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A929E] mb-2">
                RECOVERY & LOGISTICS
              </div>
              <div className="space-y-1">
                {[
                  { id: 'recovery' as ScreenId, label: 'Surplus Listings', icon: Truck },
                  { id: 'organizations' as ScreenId, label: 'Recovery Partners & Map', icon: Users2 },
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
                SYSTEM
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
                  <span>AI Architecture</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeScreen === 'settings' ? 'bg-[#1B4D36] text-white' : 'text-[#141618] hover:bg-[#F4F3ED]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Facility Settings</span>
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
