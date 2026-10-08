'use client';

import React, { useState } from 'react';
import { Building2, ShieldCheck, ArrowRight, KeyRound, Sparkles, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { DEMO_HOTEL } from '@/lib/demoData';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateLanding?: () => void;
}

export function LoginScreen({ onLoginSuccess, onNavigateLanding }: LoginScreenProps) {
  const [facilityId, setFacilityId] = useState('DGH-HYD-01');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId.trim()) {
      setError('Please provide a valid Hotel / Facility ID');
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  const handleDemoLogin = () => {
    setFacilityId('DGH-HYD-01');
    setPassword('demo-access-2026');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 250);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF4EE] border border-[#D0E7DA] text-xs font-semibold text-[#1B4D36] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Operational Portal • VISTERA 2026 PS-44</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141618]">
            Sign In to FOODFLOW
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#585E68]">
            AI-Powered Food Waste Prevention &amp; Surplus Recovery Platform
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="rounded-2xl border-2 border-[#1B4D36]/20 bg-gradient-to-br from-[#EAF4EE]/70 to-[#F4F3ED] p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#1B4D36] text-white shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1B4D36]">Judges &amp; Evaluators</span>
                <span className="px-2 py-0.5 rounded-full bg-[#1B4D36]/10 text-[10px] font-bold text-[#1B4D36]">Fast Access</span>
              </div>
              <h3 className="text-sm font-bold text-[#141618] mt-1">{DEMO_HOTEL.hotelName}</h3>
              <p className="text-xs text-[#585E68] mt-0.5">
                {DEMO_HOTEL.location} • Large Institutional Hotel ({DEMO_HOTEL.serviceCapacity} meals/service)
              </p>
              <p className="text-[11px] text-[#737A87] italic mt-1">
                Notice: Illustrative demo hotel dataset. Not a commercial customer endorsement.
              </p>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Continue with Demo Hotel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Standard Facility Credentials Card */}
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB] mb-5">
            <span className="text-xs font-bold text-[#141618] uppercase tracking-wider">Facility Credentials</span>
            <span className="text-[11px] text-[#737A87] flex items-center gap-1">
              <Lock className="w-3 h-3" /> Secure B2B Login
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label htmlFor="facility-id" className="block text-xs font-bold text-[#141618] mb-1.5">
                Hotel / Facility ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737A87]">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="facility-id"
                  name="facilityId"
                  type="text"
                  required
                  value={facilityId}
                  onChange={(e) => setFacilityId(e.target.value)}
                  placeholder="e.g. DGH-HYD-01"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6E4DC] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] bg-[#FDFDFD]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#141618] mb-1.5">
                Password / Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737A87]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter facility password"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6E4DC] focus:outline-none focus:ring-2 focus:ring-[#1B4D36] bg-[#FDFDFD]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#141618] hover:bg-[#2C3035] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <span>Sign In to Facility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#F0EFEB] flex items-center justify-between text-[11px] text-[#737A87]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              Role: Canteen / Operations Manager
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
