'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Layers,
  Info,
  Clock,
  Settings
} from 'lucide-react';
import { SystemNotification } from '@/types/foodflow';
import { DEMO_NOTIFICATIONS, DEMO_KITCHEN } from '@/lib/demoData';

export type ScreenId = 
  | 'overview' 
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
  unreadCount?: number;
}

export function Header({ activeScreen, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>(DEMO_NOTIFICATIONS);
  const [kitchenSelectorOpen, setKitchenSelectorOpen] = useState(false);
  const [selectedKitchen, setSelectedKitchen] = useState(DEMO_KITCHEN.name);

  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'dashboard', label: 'Command Center' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'consumption', label: 'Consumption' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'recovery', label: 'Recovery' },
    { id: 'organizations', label: 'Organizations' },
    { id: 'history', label: 'History' },
    { id: 'architecture', label: 'AI Architecture' },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#E6E4DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#141618] flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider group-hover:bg-[#1B4D36] transition-colors shadow-sm">
                FF
              </div>
              <div>
                <span className="font-bold tracking-tight text-base sm:text-lg text-[#141618]">
                  FOODFLOW
                </span>
                <span className="text-[10px] text-[#737A87] font-medium tracking-wide block uppercase">
                  Predict • Prevent • Recover
                </span>
              </div>
            </button>

            {/* DEMO DATA badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0E6] border border-[#F2D7C2] text-[#B85720] text-[10px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6682F]" />
              DEMO DATA LAYER
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#141618] text-white shadow-xs font-semibold'
                      : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F2F0E8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Notifications, Kitchen Selector, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-[#585E68] hover:text-[#141618] hover:bg-[#F2F0E8] transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C6682F]" />
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl border border-[#E6E4DC] shadow-[0_12px_32px_rgba(20,22,24,0.12)] p-4 z-50 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#141618]">
                        Operational Alerts
                      </span>
                      {unreadNotifications > 0 && (
                        <span className="text-[10px] font-semibold bg-[#FAF0E6] text-[#B85720] px-1.5 py-0.2 rounded-full">
                          {unreadNotifications} new
                        </span>
                      )}
                    </div>
                    {unreadNotifications > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] text-[#1B4D36] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-lg border text-xs transition-colors ${
                          item.read
                            ? 'bg-white border-[#F0EFEB] opacity-75'
                            : 'bg-[#FAF9F5] border-[#E8E6DE]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#141618]">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-[#8A929E]">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#585E68] mt-1 leading-snug">
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#F0EFEB] text-center">
                    <span className="text-[10px] text-[#8A929E]">
                      Live alerts synced to Supabase event stream
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Kitchen Selector Dropdown */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setKitchenSelectorOpen(!kitchenSelectorOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E6E4DC] bg-white text-xs text-[#141618] hover:border-[#D0CDBF] transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-[#1B4D36]" />
                <span className="font-medium max-w-[130px] truncate">
                  {selectedKitchen}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8A929E]" />
              </button>

              {kitchenSelectorOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-[#E6E4DC] shadow-[0_12px_32px_rgba(20,22,24,0.12)] p-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#8A929E] uppercase tracking-wider">
                    Institutional Facilities
                  </div>
                  {[
                    'FOODFLOW Central Kitchen',
                    'North Campus Dining Commons',
                    'West Wing Executive Bistro',
                  ].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setSelectedKitchen(k);
                        setKitchenSelectorOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedKitchen === k
                          ? 'bg-[#EAF4EE] text-[#1B4D36] font-semibold'
                          : 'text-[#373C44] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      <span>{k}</span>
                      {selectedKitchen === k && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D36]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E6E4DC]">
              <div className="w-7 h-7 rounded-full bg-[#1B4D36] text-white flex items-center justify-center text-xs font-bold">
                ER
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-semibold text-[#141618] block leading-none">
                  Elena Rostova
                </span>
                <span className="text-[10px] text-[#737A87]">
                  Culinary Director
                </span>
              </div>
            </div>

            {/* Settings Quick Access Button */}
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-lg transition-colors ${
                activeScreen === 'settings'
                  ? 'bg-[#141618] text-white shadow-xs'
                  : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F2F0E8]'
              }`}
              aria-label="Facility Settings"
              title="Facility & Model Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#585E68] hover:text-[#141618] hover:bg-[#F2F0E8] xl:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E6E4DC] bg-[#FBFBFA] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between py-1 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A929E]">
              Navigation
            </span>
            <span className="text-[10px] bg-[#FAF0E6] text-[#B85720] px-2 py-0.5 rounded font-mono">
              DEMO MODE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#141618] text-white font-semibold'
                      : 'bg-white border border-[#E6E4DC] text-[#373C44] hover:bg-[#F2F0E8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#EAE7DD] flex items-center justify-between text-xs text-[#6F7682]">
            <span>Active Shift: Lunch (11:30 - 14:30)</span>
            <span className="font-mono text-[10px]">v2.4-PROTOTYPE</span>
          </div>
        </div>
      )}
    </header>
  );
}
