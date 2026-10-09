'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  HeartHandshake,
  Users
} from 'lucide-react';
import { DEMO_HOTEL, DEMO_HOTEL_USER, DEMO_NGO } from '@/lib/demoData';
import { AuthUser, UserRole } from '@/types/foodflow';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateLanding?: () => void;
}

export function LoginScreen({ onLoginSuccess, onNavigateLanding }: LoginScreenProps) {
  const [facilityId, setFacilityId] = useState('DGH-HYD-01');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('HOTEL');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId.trim()) {
      setError('Please provide a valid Account ID');
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (selectedRole === 'NGO') {
        onLoginSuccess(DEMO_NGO);
      } else {
        onLoginSuccess(DEMO_HOTEL_USER);
      }
    }, 300);
  };

  const handleDemoHotelLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(DEMO_HOTEL_USER);
    }, 200);
  };

  const handleDemoNgoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(DEMO_NGO);
    }, 200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF4EE] border border-[#D0E7DA] text-xs font-semibold text-[#1B4D36] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Connected Recovery Ecosystem • VISTERA 2026 PS-44</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Sign In to FOODFLOW
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#585E68]">
            Connected Two-Sided Platform for Hotel Kitchens &amp; Community Food Recovery Partners
          </p>
        </div>

        {/* SECTION 1: TWO FAST DEMO ENTRY OPTIONS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737A87]">
              Judges &amp; Evaluators • 1-Click Demo Profiles
            </span>
            <span className="text-[10px] text-[#2E7D32] bg-[#EAF4EE] px-2 py-0.5 rounded-full font-bold">
              Shared Real-Time Store
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. HOTEL DEMO CARD */}
            <div className="rounded-2xl border-2 border-[#1B4D36]/25 bg-gradient-to-br from-[#EAF4EE]/70 to-[#FAF9F5] p-5 shadow-xs flex flex-col justify-between hover:border-[#1B4D36]/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#1B4D36] text-white shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#1B4D36] text-white text-[10px] font-bold">
                      ROLE: HOTEL
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#1B4D36]/10 text-[#1B4D36] text-[10px] font-bold">
                      DEMO
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#141618]">{DEMO_HOTEL.name}</h3>
                <p className="text-xs text-[#585E68] mt-1 line-clamp-2">
                  {DEMO_HOTEL.location} • Large Institutional Hotel ({DEMO_HOTEL.serviceCapacity} meals/service).
                </p>
                <div className="mt-2 text-[10px] text-[#737A87] bg-white/70 p-2 rounded-lg border border-[#E6E4DC]/60">
                  <span className="font-semibold text-[#141618]">Features:</span> Forecast demand, log surplus, review food safety, and dispatch approved recovery offers.
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoHotelLogin}
                disabled={loading}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enter as Demo Hotel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. NGO DEMO CARD */}
            <div className="rounded-2xl border-2 border-[#D97706]/30 bg-gradient-to-br from-[#FEF3C7]/40 to-[#FAF9F5] p-5 shadow-xs flex flex-col justify-between hover:border-[#D97706]/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#D97706] text-white shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#D97706] text-white text-[10px] font-bold">
                      ROLE: NGO
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold border border-[#FDE68A]">
                      FICTIONAL DEMO PARTNER
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#141618]">{DEMO_NGO.name}</h3>
                <p className="text-xs text-[#585E68] mt-1 line-clamp-2">
                  {DEMO_NGO.location} • Volunteer Food Rescue Network.
                </p>
                <div className="mt-2 text-[10px] text-[#92400E] bg-[#FEF3C7]/60 p-2 rounded-lg border border-[#FDE68A]/80">
                  <span className="font-semibold text-[#78350F]">Notice:</span> Fictional partner for hackathon evaluation. Receives offers, reviews safety gate, and schedules pickups.
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoNgoLogin}
                disabled={loading}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Enter as Demo NGO Partner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: STANDARD CREDENTIALS CARD */}
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB] mb-4">
            <span className="text-xs font-bold text-[#141618] uppercase tracking-wider">
              Credential Sign In
            </span>
            <span className="text-[11px] text-[#737A87] flex items-center gap-1">
              <Lock className="w-3 h-3" /> Role-Based Access Control
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('HOTEL');
                  setFacilityId('DGH-HYD-01');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  selectedRole === 'HOTEL'
                    ? 'border-[#1B4D36] bg-[#EAF4EE] text-[#1B4D36]'
                    : 'border-[#E6E4DC] bg-white text-[#737A87] hover:bg-[#F9F9F8]'
                }`}
              >
                🏨 Hotel Operations
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('NGO');
                  setFacilityId('HCFS-HYD-01');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  selectedRole === 'NGO'
                    ? 'border-[#D97706] bg-[#FEF3C7] text-[#92400E]'
                    : 'border-[#E6E4DC] bg-white text-[#737A87] hover:bg-[#F9F9F8]'
                }`}
              >
                🤝 NGO Food Partner
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="facility-id" className="block text-xs font-bold text-[#141618] mb-1">
                  {selectedRole === 'HOTEL' ? 'Facility / Hotel ID' : 'NGO Partner ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737A87]">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="facility-id"
                    name="facilityId"
                    type="text"
                    required
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value)}
                    placeholder="Enter ID"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6E4DC] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] bg-[#FDFDFD]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-[#141618] mb-1">
                  Access Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737A87]">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access Key"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6E4DC] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] bg-[#FDFDFD]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#141618] hover:bg-[#2C3035] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <span>Sign In as {selectedRole === 'HOTEL' ? 'Hotel Facility' : 'Demo NGO'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-[#F0EFEB] flex items-center justify-between text-[11px] text-[#737A87]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              Isolated role dashboards &amp; permissions
            </span>
            {onNavigateLanding && (
              <button
                type="button"
                onClick={onNavigateLanding}
                className="hover:text-[#141618] font-medium underline cursor-pointer"
              >
                Back to Overview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
