'use client';

import React, { useState } from 'react';
import { 
  Inbox, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Thermometer, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  AlertCircle, 
  RotateCw,
  Sparkles,
  Info,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { 
  FoodRecoveryOffer, 
  AuthUser, 
  ScreenId 
} from '@/types/foodflow';
import { DEMO_NGO } from '@/lib/demoData';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import { Modal } from '@/components/ui/Modal';

interface NgoInboxScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentUser?: AuthUser;
  offers: FoodRecoveryOffer[];
  onAcceptOffer: (offerId: string) => Promise<void>;
  onDeclineOffer: (offerId: string, reason: string) => Promise<void>;
  onSchedulePickup: (offerId: string, details: { scheduledDateTime: string; vehicleType: string; driverContact: string; notes?: string }) => Promise<void>;
  onCompletePickup: (offerId: string) => Promise<void>;
  onRefresh: () => void;
  isRemote?: boolean;
}

export function NgoInboxScreen({
  onNavigate,
  currentUser = DEMO_NGO,
  offers,
  onAcceptOffer,
  onDeclineOffer,
  onSchedulePickup,
  onCompletePickup,
  onRefresh,
  isRemote = false,
}: NgoInboxScreenProps) {
  const [selectedOffer, setSelectedOffer] = useState<FoodRecoveryOffer | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [declineReason, setDeclineReason] = useState<string>('Capacity full for this shift');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Pickup scheduling state
  const [pickupDate, setPickupDate] = useState('Today, 15:45 PM IST');
  const [vehicleType, setVehicleType] = useState('Insulated Van (AP-09-XX-4421)');
  const [driverContact, setDriverContact] = useState('Raju (Driver) • +91 98491 88321');
  const [pickupNotes, setPickupNotes] = useState('Bringing thermal stainless crates for direct pan transfer.');

  const ngoCoords = currentUser.coordinates || DEMO_NGO.coordinates;

  // Filter offers
  const filteredOffers = offers.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'eligible') return o.safetyReview.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP' && o.status === 'OFFERED';
    if (filter === 'pending_review') return o.safetyReview.decision === 'PENDING_REVIEW';
    if (filter === 'accepted') return o.status === 'ACCEPTED';
    if (filter === 'scheduled') return o.status === 'PICKUP_SCHEDULED';
    if (filter === 'completed') return o.status === 'COMPLETED';
    if (filter === 'declined') return o.status === 'DECLINED' || o.safetyReview.decision === 'REJECTED';
    return true;
  });

  const eligibleCount = offers.filter((o) => o.safetyReview.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP' && o.status === 'OFFERED').length;
  const pendingReviewCount = offers.filter((o) => o.safetyReview.decision === 'PENDING_REVIEW').length;
  const inProgressCount = offers.filter((o) => o.status === 'ACCEPTED' || o.status === 'PICKUP_SCHEDULED' || o.status === 'PICKED_UP').length;
  const completedCount = offers.filter((o) => o.status === 'COMPLETED').length;

  const handleAccept = async (offer: FoodRecoveryOffer) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await onAcceptOffer(offer.id);
      setActionSuccess(`Offer ${offer.id} accepted successfully! Ready to schedule pickup.`);
      // Update selected offer view
      const updated = offers.find((o) => o.id === offer.id);
      if (updated) setSelectedOffer(updated);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to accept offer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDecline = async () => {
    if (!selectedOffer) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await onDeclineOffer(selectedOffer.id, declineReason);
      setShowDeclineModal(false);
      setActionSuccess(`Offer ${selectedOffer.id} declined.`);
      setSelectedOffer(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to decline offer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSchedule = async (offer: FoodRecoveryOffer) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await onSchedulePickup(offer.id, {
        scheduledDateTime: pickupDate,
        vehicleType,
        driverContact,
        notes: pickupNotes,
      });
      setActionSuccess(`Pickup scheduled for ${pickupDate}!`);
      const updated = offers.find((o) => o.id === offer.id);
      if (updated) setSelectedOffer(updated);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to schedule pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (offer: FoodRecoveryOffer) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await onCompletePickup(offer.id);
      setActionSuccess(`Recovery run for ${offer.id} completed and recorded!`);
      const updated = offers.find((o) => o.id === offer.id);
      if (updated) setSelectedOffer(updated);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to complete recovery');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & FICTIONAL PARTNER DISCLAIMER */}
      <div className="bg-gradient-to-r from-[#FEF3C7]/60 via-[#FAF9F5] to-[#EAF4EE]/60 rounded-2xl border border-[#FDE68A] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-[#D97706] text-white text-[10px] font-bold">
                NGO RECOVERY INBOX
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[10px] font-bold">
                FICTIONAL DEMO PARTNER
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#141618]">
              {currentUser.name}
            </h1>
            <p className="text-xs text-[#585E68] mt-0.5">
              {currentUser.location} • Authorized Food Rescue Coordination Portal
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              type="button"
              onClick={onRefresh}
              className="py-2 px-3 rounded-xl bg-white border border-[#E6E4DC] hover:bg-[#F9F9F8] text-xs font-bold text-[#141618] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#585E68]" />
              <span>Refresh Inbox</span>
            </button>
            <span className="text-[11px] text-[#737A87] bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#E6E4DC]">
              {isRemote ? 'Supabase Sync' : 'Shared Demo Store'}
            </span>
          </div>
        </div>

        {/* Fictional Disclaimer Callout */}
        <div className="mt-3.5 pt-3 border-t border-[#FDE68A]/60 flex items-start gap-2 text-[11px] text-[#92400E]">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#D97706]" />
          <span>
            <strong>Fictional Demonstration Partner:</strong> &ldquo;Hyderabad Community Food Support&rdquo; is an illustrative demo profile created for the VISTERA 2026 hackathon. Both the hotel and NGO views read from the same authoritative data layer.
          </span>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-emerald-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}
      {actionError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button type="button" onClick={() => setActionError(null)} className="text-red-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* 2. STAT COUNTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-[#E6E4DC] p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-[#737A87]">Eligible to Accept</span>
          <div className="text-2xl font-extrabold text-[#1B4D36] mt-1">{eligibleCount}</div>
          <span className="text-[10px] text-[#585E68]">Safety review passed</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E6E4DC] p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-[#737A87]">Awaiting Hotel Review</span>
          <div className="text-2xl font-extrabold text-[#D97706] mt-1">{pendingReviewCount}</div>
          <span className="text-[10px] text-[#585E68]">Gate locked by hotel</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E6E4DC] p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-[#737A87]">Accepted / In Transit</span>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1">{inProgressCount}</div>
          <span className="text-[10px] text-[#585E68]">Active pickup workflow</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E6E4DC] p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-[#737A87]">Completed Runs</span>
          <div className="text-2xl font-extrabold text-[#141618] mt-1">{completedCount}</div>
          <span className="text-[10px] text-[#585E68]">Safely redistributed</span>
        </div>
      </div>

      {/* 3. FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#E6E4DC]">
        {[
          { id: 'all', label: `All Offers (${offers.length})` },
          { id: 'eligible', label: `Eligible for Pickup (${eligibleCount})` },
          { id: 'pending_review', label: `Awaiting Safety Review (${pendingReviewCount})` },
          { id: 'accepted', label: 'Accepted by Us' },
          { id: 'scheduled', label: 'Scheduled Pickups' },
          { id: 'completed', label: 'Completed' },
          { id: 'declined', label: 'Declined / Rejected' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === t.id
                ? 'bg-[#141618] text-white shadow-xs'
                : 'text-[#585E68] hover:text-[#141618] hover:bg-[#F0EFEB]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 4. OFFERS LIST */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-12 text-center">
          <Inbox className="w-10 h-10 text-[#A0A7B5] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#141618]">No offers match this filter</h3>
          <p className="text-xs text-[#585E68] mt-1">
            New offers published by hotel kitchens will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOffers.map((offer) => {
            const isEligible = offer.safetyReview.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP';
            const isPendingReview = offer.safetyReview.decision === 'PENDING_REVIEW';
            const isRejected = offer.safetyReview.decision === 'REJECTED';
            const isAccepted = offer.status === 'ACCEPTED';
            const isScheduled = offer.status === 'PICKUP_SCHEDULED';
            const isCompleted = offer.status === 'COMPLETED';
            const isDeclined = offer.status === 'DECLINED';

            const straightLineDist = formatStraightLineDistance(
              ngoCoords.lat,
              ngoCoords.lng,
              offer.hotelCoordinates.lat,
              offer.hotelCoordinates.lng
            );

            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-xs hover:border-[#D0E7DA] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
                        {offer.id}
                      </span>

                      {/* Safety Review Status Badge */}
                      {isEligible && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full border border-[#D0E7DA]">
                          <ShieldCheck className="w-3 h-3 text-[#2E7D32]" />
                          <span>Safety Review: APPROVED</span>
                        </span>
                      )}
                      {isPendingReview && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
                          <ShieldAlert className="w-3 h-3 text-[#D97706]" />
                          <span>Pending Hotel Safety Review</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>Safety Gate: REJECTED</span>
                        </span>
                      )}

                      {/* Workflow Status Badge */}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        offer.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        offer.status === 'ACCEPTED' || offer.status === 'PICKUP_SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        offer.status === 'DECLINED' ? 'bg-gray-100 text-gray-700' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Stage: {offer.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Food Title & Hotel */}
                    <div>
                      <h3 className="text-base font-bold text-[#141618]">{offer.foodItem}</h3>
                      <p className="text-xs text-[#585E68] mt-0.5 flex items-center gap-1">
                        <span>Offered by <strong>{offer.hotelName}</strong></span>
                        <span>•</span>
                        <MapPin className="w-3 h-3 text-[#737A87]" />
                        <span>{straightLineDist}</span>
                      </p>
                    </div>

                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E6E4DC]/60">
                        <span className="text-[10px] text-[#737A87] block font-semibold">Available Quantity</span>
                        <span className="font-bold text-[#141618]">{offer.quantity} {offer.unit}</span>
                        <span className="text-[10px] text-[#585E68] block">~{offer.servingsEquivalent} portions</span>
                      </div>
                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E6E4DC]/60">
                        <span className="text-[10px] text-[#737A87] block font-semibold">Prep Time</span>
                        <span className="font-bold text-[#141618]">{offer.preparationDateTime}</span>
                        <span className="text-[10px] text-[#585E68] block">{offer.safetyReview.storageCondition}</span>
                      </div>
                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E6E4DC]/60">
                        <span className="text-[10px] text-[#737A87] block font-semibold">Pickup Deadline</span>
                        <span className="font-bold text-[#D97706]">{offer.pickupDeadline}</span>
                        <span className="text-[10px] text-[#585E68] block">Safe holding window</span>
                      </div>
                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E6E4DC]/60">
                        <span className="text-[10px] text-[#737A87] block font-semibold">Verified Temp</span>
                        <span className="font-bold text-[#141618]">
                          {offer.safetyReview.temperatureLoggedCelsius ? `${offer.safetyReview.temperatureLoggedCelsius}°C` : 'Logged'}
                        </span>
                        <span className="text-[10px] text-[#2E7D32] block font-semibold">
                          {offer.safetyReview.temperatureVerified ? 'Verified' : 'Awaiting check'}
                        </span>
                      </div>
                    </div>

                    {/* Warning if pending review */}
                    {isPendingReview && (
                      <div className="p-2.5 rounded-xl bg-[#FEF3C7]/60 border border-[#FDE68A] text-xs text-[#92400E] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
                        <span>
                          <strong>Pending safety review — not yet available for acceptance.</strong> Hotel kitchen supervisor must verify temperature and sensory checks before this offer can be claimed.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 md:min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => setSelectedOffer(offer)}
                      className="py-2 px-3 rounded-xl border border-[#E6E4DC] hover:bg-[#FAF9F5] text-xs font-bold text-[#141618] flex items-center gap-1 transition-all cursor-pointer w-full justify-center"
                    >
                      <span>Full Details &amp; Log</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Accept/Decline if in OFFERED state */}
                    {offer.status === 'OFFERED' && isEligible && (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => handleAccept(offer)}
                          disabled={actionLoading}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-75 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Offer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOffer(offer);
                            setShowDeclineModal(true);
                          }}
                          disabled={actionLoading}
                          className="py-2 px-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-75"
                          title="Decline Offer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Disabled Accept button if Pending Review */}
                    {offer.status === 'OFFERED' && !isEligible && (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2 px-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed border border-gray-200 flex items-center justify-center gap-1"
                        title="Cannot accept: Ineligible until hotel completes safety review."
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Acceptance Locked</span>
                      </button>
                    )}

                    {/* Schedule button if ACCEPTED */}
                    {isAccepted && (
                      <button
                        type="button"
                        onClick={() => setSelectedOffer(offer)}
                        className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Schedule Pickup</span>
                      </button>
                    )}

                    {/* Complete button if PICKED_UP or SCHEDULED */}
                    {(isScheduled || offer.status === 'PICKED_UP') && (
                      <button
                        type="button"
                        onClick={() => handleComplete(offer)}
                        disabled={actionLoading}
                        className="w-full py-2 px-3 rounded-xl bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Delivery</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. OFFER DETAIL & ACTION MODAL */}
      {selectedOffer && (
        <Modal
          isOpen={Boolean(selectedOffer)}
          onClose={() => setSelectedOffer(null)}
          title={`Offer Details: ${selectedOffer.id}`}
        >
          <div className="space-y-5 text-xs">
            {/* Header Summary */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E6E4DC] flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87]">
                  {selectedOffer.dishCategory} • {selectedOffer.hotelName}
                </span>
                <h3 className="text-base font-extrabold text-[#141618] mt-0.5">{selectedOffer.foodItem}</h3>
                <p className="text-xs text-[#585E68] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#737A87]" />
                  <span>{selectedOffer.hotelLocation}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-[#1B4D36] block">
                  {selectedOffer.quantity} {selectedOffer.unit}
                </span>
                <span className="text-[10px] text-[#585E68]">~{selectedOffer.servingsEquivalent} Portions</span>
              </div>
            </div>

            {/* FOOD SAFETY & PICKUP ELIGIBILITY GATE SECTION */}
            <div className="p-4 rounded-xl border border-[#D0E7DA] bg-[#EAF4EE]/40 space-y-3">
              <div className="flex items-center justify-between border-b border-[#D0E7DA] pb-2">
                <div className="flex items-center gap-1.5 font-bold text-[#1B4D36]">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Food Safety &amp; Pickup Eligibility Gate</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedOffer.safetyReview.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP'
                    ? 'bg-[#1B4D36] text-white'
                    : selectedOffer.safetyReview.decision === 'PENDING_REVIEW'
                    ? 'bg-[#D97706] text-white'
                    : 'bg-red-700 text-white'
                }`}>
                  {selectedOffer.safetyReview.decision}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#737A87] block text-[10px]">Holding Method:</span>
                  <span className="font-semibold text-[#141618]">{selectedOffer.safetyReview.storageCondition}</span>
                </div>
                <div>
                  <span className="text-[#737A87] block text-[10px]">Logged Temperature:</span>
                  <span className="font-semibold text-[#141618]">
                    {selectedOffer.safetyReview.temperatureLoggedCelsius ? `${selectedOffer.safetyReview.temperatureLoggedCelsius}°C` : 'Not recorded'}
                  </span>
                </div>
                <div>
                  <span className="text-[#737A87] block text-[10px]">Reviewed By:</span>
                  <span className="font-semibold text-[#141618]">
                    {selectedOffer.safetyReview.reviewedBy} ({selectedOffer.safetyReview.reviewerDesignation})
                  </span>
                </div>
                <div>
                  <span className="text-[#737A87] block text-[10px]">Review Timestamp:</span>
                  <span className="font-semibold text-[#141618]">{selectedOffer.safetyReview.reviewedAt}</span>
                </div>
              </div>

              {selectedOffer.safetyReview.safetyNotes && (
                <div className="p-2 rounded-lg bg-white/70 border border-[#D0E7DA] text-[11px] text-[#585E68]">
                  <strong>Safety Notes:</strong> {selectedOffer.safetyReview.safetyNotes}
                </div>
              )}

              {/* Policy notice disclosure */}
              <p className="text-[10px] text-[#737A87] italic">
                * Limitation Notice: Internal hotel SOP validation only. Does not claim official regulatory certification.
              </p>
            </div>

            {/* PICKUP SCHEDULING FORM IF ACCEPTED */}
            {selectedOffer.status === 'ACCEPTED' && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Truck className="w-4 h-4 text-blue-700" />
                  <span>Coordinate Recovery Vehicle Pickup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#141618] mb-1">Estimated Pickup Time</label>
                    <input
                      type="text"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#141618] mb-1">Vehicle / Reg No</label>
                    <input
                      type="text"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#141618] mb-1">Driver Contact &amp; Name</label>
                    <input
                      type="text"
                      value={driverContact}
                      onChange={(e) => setDriverContact(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSchedule(selectedOffer)}
                  disabled={actionLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Confirm Pickup Schedule</span>
                </button>
              </div>
            )}

            {/* TIMELINE */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737A87] block mb-2">
                Authoritative Activity Timeline
              </span>
              <div className="space-y-2 border-l-2 border-[#D0E7DA] ml-2 pl-3">
                {selectedOffer.timeline.map((item, idx) => (
                  <div key={idx} className="relative pb-2">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#1B4D36]" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141618]">{item.label}</span>
                      <span className="text-[10px] text-[#737A87]">{item.timestamp}</span>
                    </div>
                    <span className="text-[11px] text-[#585E68] block">By: {item.actor}</span>
                    {item.details && (
                      <p className="text-[11px] text-[#737A87] mt-0.5">{item.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-3 border-t border-[#E6E4DC] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="py-2 px-3 rounded-lg border border-[#E6E4DC] text-xs font-semibold text-[#585E68] hover:bg-[#FAF9F5]"
              >
                Close
              </button>

              {selectedOffer.status === 'OFFERED' && selectedOffer.safetyReview.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeclineModal(true)}
                    disabled={actionLoading}
                    className="py-2 px-3 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAccept(selectedOffer)}
                    disabled={actionLoading}
                    className="py-2 px-4 rounded-lg bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Offer</span>
                  </button>
                </div>
              )}

              {selectedOffer.status === 'OFFERED' && selectedOffer.safetyReview.decision !== 'ELIGIBLE_FOR_REVIEWED_PICKUP' && (
                <span className="text-xs text-[#D97706] font-bold">
                  Awaiting Hotel Safety Signoff
                </span>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* 6. DECLINE CONFIRMATION MODAL */}
      {showDeclineModal && (
        <Modal
          isOpen={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
          title="Decline Recovery Offer"
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#585E68]">
              Please select a reason for declining offer <strong>{selectedOffer?.id}</strong>. This feedback is recorded in the shared log for hotel visibility.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Decline Reason</label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              >
                <option value="Capacity full for this shift">Capacity full for this shift</option>
                <option value="Cold/hot storage unavailable on route">Cold/hot storage unavailable on route</option>
                <option value="Transport/driver unavailable before deadline">Transport/driver unavailable before deadline</option>
                <option value="Dietary category not aligned with current shelter needs">Dietary category not aligned with current shelter needs</option>
                <option value="Other logistical constraint">Other logistical constraint</option>
              </select>
            </div>

            <div className="pt-3 border-t border-[#E6E4DC] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="py-2 px-3 rounded-lg border border-[#E6E4DC] text-xs font-semibold text-[#585E68]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={actionLoading}
                className="py-2 px-4 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
