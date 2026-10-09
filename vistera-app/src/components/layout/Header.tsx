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
  Building2,
  Layers,
  LogOut,
  HeartHandshake,
  Inbox,
  Calendar,
  Bell,
  ArrowLeftRight
} from 'lucide-react';
import { AuthUser, UserRole } from '@/types/foodflow';

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
  | 'settings'
  | 'ngo_inbox'
  | 'ngo_pickups'
  | 'ngo_history'
  | 'notifications';

interface HeaderProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  currentUser?: AuthUser;
  onSwitchRole?: (targetRole: UserRole) => void;
  unreadNotifCount?: number;
  onOpenNotifications?: () => void;
}

const HOTEL_NAV_ITEMS: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Overview', icon: BarChart3 },
  { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
  { id: 'preparation', label: 'Food Preparation', icon: UtensilsCrossed },
  { id: 'consumption', label: 'Service Tracking', icon: Layers },
  { id: 'recovery', label: 'Surplus Recovery', icon: Truck },
  { id: 'history', label: 'History & Accuracy', icon: History },
  { id: 'settings', label: 'Integrations & Settings', icon: Settings },
];

const NGO_NAV_ITEMS: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'ngo_inbox', label: 'Recovery Inbox', icon: Inbox },
  { id: 'ngo_pickups', label: 'Pickup Schedule', icon: Calendar },
  { id: 'ngo_history', label: 'Activity History', icon: History },
  { id: 'notifications', label: 'In-App Alerts', icon: Bell },
];

export function Header({ 
  activeScreen, 
  onNavigate,
  currentUser,
  onSwitchRole,
  unreadNotifCount = 0,
  onOpenNotifications,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = activeScreen === 'overview' || activeScreen === 'login';
  const role: UserRole = currentUser?.role || 'HOTEL';
  const isNgo = role === 'NGO';

  const navItems = isNgo ? NGO_NAV_ITEMS : HOTEL_NAV_ITEMS;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: ScreenId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const isNavActive = (id: ScreenId) => {
    if (id === 'dashboard') return activeScreen === 'dashboard';
    if (id === 'recovery') return activeScreen === 'recovery' || activeScreen === 'organizations';
    if (id === 'history') return activeScreen === 'history' || activeScreen === 'analysis';
    return activeScreen === id;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 h-16 ${
        isScrolled || !isLanding
          ? 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E6E4DC] shadow-[0_1px_4px_rgba(20,22,24,0.03)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full gap-4">
          
          {/* ============================================================== */}
          {/* LEFT: Logo & Role Context Badge                                */}
          {/* ============================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick(isNgo ? 'ngo_inbox' : 'dashboard')}
              className="flex items-center gap-2 group transition-opacity hover:opacity-90 cursor-pointer"
              aria-label="FOODFLOW Operations Home"
            >
              <div className="relative h-8 w-28 sm:w-32 flex items-center">
                <Image
                  src="/foodflow-logo.jpeg"
                  alt="FOODFLOW"
                  width={240}
                  height={65}
                  priority
                  className="h-full w-auto object-contain mix-blend-multiply"
                />
              </div>
            </button>

            {!isLanding && (
              <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#E6E4DC] text-[11px]">
                {isNgo ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-semibold">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Demo Partner • Hyderabad Community Food Support</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EAF4EE] border border-[#D0E7DA] text-[#1B4D36] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D36] animate-pulse" />
                    <span>Deccan Grand Hotel • Gachibowli</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* CENTER: Navigation Links (Role Filtered)                       */}
          {/* ============================================================== */}
          {isLanding ? (
            <nav className="hidden lg:flex items-center gap-7">
              <a
                href="#problem"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#585E68] hover:text-[#141618] transition-colors whitespace-nowrap"
              >
                The Problem
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#585E68] hover:text-[#141618] transition-colors whitespace-nowrap"
              >
                How It Works
              </a>
              <a
                href="#workflow"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#585E68] hover:text-[#141618] transition-colors whitespace-nowrap"
              >
                7-Stage Loop
              </a>
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {navItems.map((item) => {
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? isNgo
                          ? 'bg-[#92400E] text-white shadow-xs'
                          : 'bg-[#1B4D36] text-white shadow-xs'
                        : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F0EFEB]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* ============================================================== */}
          {/* RIGHT: Role Switcher, Notifications, Settings & Exit           */}
          {/* ============================================================== */}
          <div className="flex items-center gap-2 shrink-0">
            {isLanding ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="px-3 py-1.5 rounded-lg border border-[#E6E4DC] text-xs font-semibold text-[#141618] hover:bg-[#F7F6F0] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#1B4D36]" />
                  <span>Demo Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick(isNgo ? 'ngo_inbox' : 'dashboard')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Open Platform</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* 1-CLICK ROLE SWITCHER (For Evaluators) */}
                {onSwitchRole && (
                  <button
                    type="button"
                    onClick={() => onSwitchRole(isNgo ? 'HOTEL' : 'NGO')}
                    className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      isNgo
                        ? 'border-[#1B4D36]/40 bg-[#EAF4EE] text-[#1B4D36] hover:bg-[#D5EADB]'
                        : 'border-[#D97706]/40 bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A]'
                    }`}
                    title={isNgo ? 'Switch perspective to Hotel Kitchen' : 'Switch perspective to NGO Recovery Partner'}
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>{isNgo ? 'Switch to Hotel' : 'Switch to NGO'}</span>
                  </button>
                )}

                {/* Notifications Bell */}
                <button
                  type="button"
                  onClick={onOpenNotifications || (() => handleNavClick('notifications'))}
                  className="relative p-1.5 rounded-lg border border-[#E6E4DC] text-[#585E68] hover:text-[#141618] hover:bg-[#F7F6F0] transition-colors cursor-pointer"
                  title="In-App Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D97706] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Role Badge Indicator */}
                <div
                  className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border whitespace-nowrap ${
                    isNgo
                      ? 'border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]'
                      : 'border-[#D0E7DA] bg-[#EAF4EE] text-[#1B4D36]'
                  }`}
                  title={isNgo ? 'Role: NGO (Fictional Demo Partner)' : 'Role: HOTEL (Demo Facility)'}
                >
                  {isNgo ? <HeartHandshake className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                  <span className="max-w-[130px] truncate">{isNgo ? 'NGO Demo' : 'Hotel Demo'}</span>
                </div>

                {/* Settings Icon (Hotel Only) */}
                {!isNgo && (
                  <button
                    type="button"
                    onClick={() => handleNavClick('settings')}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      activeScreen === 'settings'
                        ? 'bg-[#1B4D36] text-white border-[#1B4D36]'
                        : 'border-[#E6E4DC] text-[#585E68] hover:text-[#141618] hover:bg-[#F7F6F0]'
                    }`}
                    title="System Integrations & Settings"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}

                {/* Exit Action */}
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="text-xs font-semibold text-[#737A87] hover:text-[#141618] px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  title="Switch or Exit Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-[#E6E4DC] text-[#141618] hover:bg-[#F7F6F0] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE SLIDING NAVIGATION DRAWER                               */}
      {/* ============================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#FAF9F5] z-50 border-b border-[#E6E4DC] shadow-lg p-5 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E4DC]">
              <div className="flex items-center gap-2">
                {isNgo ? <HeartHandshake className="w-4 h-4 text-[#92400E]" /> : <Building2 className="w-4 h-4 text-[#1B4D36]" />}
                <span className="text-xs font-bold text-[#141618]">
                  {isNgo ? 'Hyderabad Community Food Support' : 'Deccan Grand Hotel — Hyderabad'}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${isNgo ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200'}`}>
                {isNgo ? 'NGO Demo' : 'Hotel Demo'}
              </span>
            </div>

            {onSwitchRole && (
              <button
                type="button"
                onClick={() => {
                  onSwitchRole(isNgo ? 'HOTEL' : 'NGO');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#FAF9F5] border border-[#E6E4DC] flex items-center justify-center gap-2 text-[#141618]"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Switch to {isNgo ? 'Hotel Operations' : 'NGO Recovery Partner'}</span>
              </button>
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A929E] block px-2 mb-1">
                SECTIONS
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                      active 
                        ? isNgo ? 'bg-[#92400E] text-white' : 'bg-[#1B4D36] text-white' 
                        : 'text-[#141618] hover:bg-[#F0EFEB]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E6E4DC] flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="text-xs font-semibold text-[#737A87] hover:text-[#141618] py-1.5 px-2 rounded flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign In / Switch</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#1B4D36] py-1.5 px-3 rounded-lg bg-[#EAF4EE]"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
