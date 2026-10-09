'use client';

import React from 'react';
import { 
  History, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  Leaf, 
  Users,
  ShieldCheck
} from 'lucide-react';
import { FoodRecoveryOffer, AuthUser, ScreenId } from '@/types/foodflow';
import { DEMO_NGO } from '@/lib/demoData';

interface NgoHistoryScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentUser?: AuthUser;
  offers: FoodRecoveryOffer[];
}

export function NgoHistoryScreen({
  onNavigate,
  currentUser = DEMO_NGO,
  offers,
}: NgoHistoryScreenProps) {
  const completedOffers = offers.filter((o) => o.status === 'COMPLETED');
  const totalMeals = completedOffers.reduce((sum, o) => sum + (o.servingsEquivalent || 0), 0);
  const totalKg = completedOffers.reduce((sum, o) => sum + (o.unit === 'kg' ? o.quantity : o.quantity * 0.8), 0);
  const co2AvoidedKg = Math.round(totalKg * 2.5);

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="pb-4 border-b border-[#E6E4DC]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded border border-[#FDE68A]">
            IMPACT &amp; RESCUE AUDIT LEDGER
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87]">
            FICTIONAL DEMO PARTNER
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#141618]">
          Activity History &amp; Community Distribution Ledger
        </h1>
        <p className="text-xs text-[#585E68] mt-0.5">
          Auditable log of rescued institutional meals transferred from Deccan Grand Hotel across Hyderabad.
        </p>
      </div>

      {/* IMPACT METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#1B4D36]">
            <span className="text-[11px] font-bold uppercase text-[#737A87]">Total Meals Rescued</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#141618] mt-1">{totalMeals}</div>
          <span className="text-[10px] text-[#2E7D32] font-semibold">100% Verified Safe Meals</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#D97706]">
            <span className="text-[11px] font-bold uppercase text-[#737A87]">Food Volume Diverted</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#141618] mt-1">{totalKg.toFixed(1)} kg</div>
          <span className="text-[10px] text-[#585E68]">Cooked entrees &amp; staples</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase text-[#737A87]">CO₂e Emissions Avoided</span>
            <Leaf className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#141618] mt-1">{co2AvoidedKg} kg</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Methane diversion factor</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#2563EB]">
            <span className="text-[11px] font-bold uppercase text-[#737A87]">Safety Compliance</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#141618] mt-1">100%</div>
          <span className="text-[10px] text-[#585E68]">Hot-hold temp &gt;63°C verified</span>
        </div>
      </div>

      {/* CHRONOLOGICAL EVENT STREAM */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
          All Recorded Offer Events ({offers.length} Offers)
        </h2>

        <div className="bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden">
          <div className="divide-y divide-[#E6E4DC]">
            {offers.map((offer) => (
              <div key={offer.id} className="p-4 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
                      {offer.id}
                    </span>
                    <span className="font-bold text-[#141618]">{offer.foodItem}</span>
                    <span className="text-[11px] text-[#585E68]">({offer.quantity} {offer.unit})</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full self-start ${
                    offer.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    offer.status === 'ACCEPTED' || offer.status === 'PICKUP_SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    offer.status === 'DECLINED' ? 'bg-gray-100 text-gray-700' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {offer.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-[#585E68] flex flex-wrap items-center gap-3">
                  <span>From: <strong>{offer.hotelName}</strong></span>
                  <span>•</span>
                  <span>Safety: <strong>{offer.safetyReview.decision}</strong></span>
                  <span>•</span>
                  <span>Created: {new Date(offer.createdAt).toLocaleDateString()}</span>
                  {offer.declineReason && (
                    <>
                      <span>•</span>
                      <span className="text-red-700 font-semibold">Decline Reason: {offer.declineReason}</span>
                    </>
                  )}
                </div>

                {/* Sub-timeline */}
                <div className="pt-2 pl-3 border-l-2 border-[#E6E4DC] space-y-1">
                  {offer.timeline.map((t, idx) => (
                    <div key={idx} className="text-[10px] text-[#737A87]">
                      <span className="font-semibold text-[#141618]">{t.label}</span> — {t.timestamp} by {t.actor}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
