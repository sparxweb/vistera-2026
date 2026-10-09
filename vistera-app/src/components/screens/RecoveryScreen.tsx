'use client';

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Clock, 
  MapPin, 
  Thermometer, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  RotateCw, 
  Calendar,
  AlertCircle,
  Building2,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { 
  FoodRecoveryOffer, 
  AuthUser, 
  ScreenId, 
  FoodUnit, 
  SafetyReviewStatus 
} from '@/types/foodflow';
import { DEMO_HOTEL_USER, DEMO_NGO } from '@/lib/demoData';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import { Modal } from '@/components/ui/Modal';
import { RecoveryLeafletMap } from '@/components/recovery/RecoveryLeafletMap';

interface RecoveryScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentUser?: AuthUser;
  offers: FoodRecoveryOffer[];
  onCreateOffer: (data: {
    foodItem: string;
    dishCategory: string;
    quantity: number;
    unit: FoodUnit;
    servingsEquivalent?: number;
    preparationDateTime: string;
    availableUntil: string;
    pickupDeadline: string;
    storageCondition: 'Hot-holding (≥63°C)' | 'Refrigerated (≤4°C)' | 'Ambient / Dry';
    temperatureLoggedCelsius?: number;
    hotelLocation?: string;
    handlingNotes?: string;
  }) => Promise<void>;
  onSubmitSafetyReview: (offerId: string, review: {
    temperatureVerified: boolean;
    hygieneCheckPassed: boolean;
    packagingFoodGrade: boolean;
    responsibleStaffConfirmation: boolean;
    temperatureLoggedCelsius?: number;
    reviewedBy: string;
    reviewerDesignation: string;
    decision: 'ELIGIBLE_FOR_REVIEWED_PICKUP' | 'REJECTED';
    rejectionReason?: string;
    safetyNotes?: string;
  }) => Promise<void>;
  onConfirmHandover: (offerId: string, temperature?: number) => Promise<void>;
  onRefresh: () => void;
  surplusQuantity?: number;
}

export function RecoveryScreen({
  onNavigate,
  currentUser = DEMO_HOTEL_USER,
  offers,
  onCreateOffer,
  onSubmitSafetyReview,
  onConfirmHandover,
  onRefresh,
  surplusQuantity,
}: RecoveryScreenProps) {
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reviewOffer, setReviewOffer] = useState<FoodRecoveryOffer | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<FoodRecoveryOffer | null>(null);

  // Create form state
  const [foodItem, setFoodItem] = useState('Steamed Sona Masoori Rice & Andhra Chicken Curry');
  const [dishCategory, setDishCategory] = useState('Cooked Meals');
  const [quantity, setQuantity] = useState<number>(surplusQuantity || 5.7);
  const [unit, setUnit] = useState<FoodUnit>('kg');
  const [servingsEquivalent, setServingsEquivalent] = useState<number>(34);
  const [prepDateTime, setPrepDateTime] = useState('Today, 11:45 AM IST');
  const [availableUntil, setAvailableUntil] = useState('Today, 15:30 PM IST');
  const [pickupDeadline, setPickupDeadline] = useState('Today, 15:30 PM IST (Within 2h window)');
  const [storageCondition, setStorageCondition] = useState<'Hot-holding (≥63°C)' | 'Refrigerated (≤4°C)' | 'Ambient / Dry'>('Hot-holding (≥63°C)');
  const [temperatureLogged, setTemperatureLogged] = useState<number>(67.2);
  const [hotelLocation, setHotelLocation] = useState('Deccan Grand Hotel — Service Bay Dock 2, Gachibowli, Hyderabad');
  const [handlingNotes, setHandlingNotes] = useState('Held in insulated food-grade stainless carriers. Temperature logged at wrap.');

  // Safety Review form state
  const [reviewedBy, setReviewedBy] = useState('Chef Arvind Varma');
  const [reviewerDesignation, setReviewerDesignation] = useState('Executive Chef / Food Safety Lead');
  const [reviewTemp, setReviewTemp] = useState<number>(67.0);
  const [tempVerified, setTempVerified] = useState(true);
  const [hygienePassed, setHygienePassed] = useState(true);
  const [packagingCheck, setPackagingCheck] = useState(true);
  const [staffConfirmed, setStaffConfirmed] = useState(true);
  const [reviewDecision, setReviewDecision] = useState<'ELIGIBLE_FOR_REVIEWED_PICKUP' | 'REJECTED'>('ELIGIBLE_FOR_REVIEWED_PICKUP');
  const [rejectionReason, setRejectionReason] = useState('Temperature fell below critical threshold');
  const [reviewNotes, setReviewNotes] = useState('Verified hot-holding temp >63°C. Packed in sanitised stainless carriers.');

  // Loading & error feedback
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handover temp
  const [handoverTemp, setHandoverTemp] = useState<number>(65.8);

  const hotelCoords = currentUser.coordinates || DEMO_HOTEL_USER.coordinates;

  // Handle Offer Creation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!foodItem.trim()) {
      setFormError('Please specify the food item description.');
      return;
    }
    if (quantity <= 0) {
      setFormError('Quantity must be greater than zero.');
      return;
    }
    if (!pickupDeadline.trim()) {
      setFormError('Pickup deadline is required.');
      return;
    }

    setLoading(true);
    try {
      await onCreateOffer({
        foodItem: foodItem.trim(),
        dishCategory,
        quantity: Number(quantity),
        unit,
        servingsEquivalent: Number(servingsEquivalent),
        preparationDateTime: prepDateTime,
        availableUntil,
        pickupDeadline,
        storageCondition,
        temperatureLoggedCelsius: Number(temperatureLogged),
        hotelLocation,
        handlingNotes,
      });

      setShowCreateModal(false);
      setSuccessMsg('Surplus food recovery offer created! It is currently locked behind the food safety review gate.');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  // Handle Safety Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOffer) return;
    setFormError(null);

    if (reviewDecision === 'ELIGIBLE_FOR_REVIEWED_PICKUP' && !staffConfirmed) {
      setFormError('Responsible staff confirmation is required to approve this offer.');
      return;
    }

    setLoading(true);
    try {
      await onSubmitSafetyReview(reviewOffer.id, {
        temperatureVerified: tempVerified,
        hygieneCheckPassed: hygienePassed,
        packagingFoodGrade: packagingCheck,
        responsibleStaffConfirmation: staffConfirmed,
        temperatureLoggedCelsius: Number(reviewTemp),
        reviewedBy,
        reviewerDesignation,
        decision: reviewDecision,
        rejectionReason: reviewDecision === 'REJECTED' ? rejectionReason : undefined,
        safetyNotes: reviewNotes,
      });

      setSuccessMsg(
        reviewDecision === 'ELIGIBLE_FOR_REVIEWED_PICKUP'
          ? `Offer ${reviewOffer.id} approved! It is now published and available to the NGO partner.`
          : `Offer ${reviewOffer.id} rejected. Status marked as DECLINED.`
      );
      setReviewOffer(null);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to complete safety review');
    } finally {
      setLoading(false);
    }
  };

  // Handle Handover confirmation
  const handleHandover = async (offerId: string) => {
    setLoading(true);
    setFormError(null);
    try {
      await onConfirmHandover(offerId, handoverTemp);
      setSuccessMsg(`Food handover confirmed for ${offerId} at dock. Transport vehicle dispatched.`);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to confirm handover');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* 1. CINEMATIC HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded border border-[#D0E7DA]">
              HOTEL SURPLUS DISPATCH • CONNECTED ECOSYSTEM
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737A87]">
              DECCAN GRAND HOTEL (DEMO)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141618]">
            Surplus Food Recovery &amp; Partner Coordination
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-1">
            Publish edible kitchen surplus to authorized recovery partners across Hyderabad under strict temperature holding gates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={onRefresh}
            className="py-2.5 px-3.5 rounded-xl bg-white border border-[#E6E4DC] hover:bg-[#FAF9F5] text-xs font-bold text-[#141618] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#585E68]" />
            <span>Refresh Offers</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (surplusQuantity && surplusQuantity > 0) {
                setQuantity(surplusQuantity);
                setServingsEquivalent(Math.max(1, Math.round(surplusQuantity * 6)));
              }
              setShowCreateModal(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Food Recovery Offer</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg(null)} className="text-emerald-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}
      {formError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{formError}</span>
          </div>
          <button type="button" onClick={() => setFormError(null)} className="text-red-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* 2. SECTION: FOOD SAFETY & PICKUP ELIGIBILITY GATE OVERVIEW */}
      <div className="bg-[#FAF9F5] rounded-2xl border border-[#E6E4DC] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E4DC]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#1B4D36] text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#141618]">
                Food Safety &amp; Pickup Eligibility Gate
              </h2>
              <p className="text-[11px] text-[#585E68]">
                A surplus listing does not become available to NGOs until authorized staff complete required temperature and sensory checks.
              </p>
            </div>
          </div>
          <span className="text-[10px] text-[#737A87] italic self-start sm:self-center">
            * Internal Hotel SOP review. Not a regulatory certification.
          </span>
        </div>

        {/* Pending Reviews list */}
        {offers.filter((o) => o.safetyReview.decision === 'PENDING_REVIEW').length > 0 ? (
          <div className="mt-4 space-y-3">
            <span className="text-xs font-bold text-[#D97706] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Offers Awaiting Hotel Staff Signoff ({offers.filter((o) => o.safetyReview.decision === 'PENDING_REVIEW').length})</span>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {offers.filter((o) => o.safetyReview.decision === 'PENDING_REVIEW').map((offer) => (
                <div key={offer.id} className="p-3.5 rounded-xl bg-white border border-[#FDE68A] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#D97706]">{offer.id}</span>
                    <h4 className="text-xs font-bold text-[#141618]">{offer.foodItem}</h4>
                    <span className="text-[11px] text-[#585E68]">{offer.quantity} {offer.unit} • {offer.preparationDateTime}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewOffer(offer);
                      setReviewTemp(offer.safetyReview.temperatureLoggedCelsius || 66.0);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Perform Safety Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 text-xs text-[#2E7D32] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All current offers have completed the safety review gate.</span>
          </div>
        )}
      </div>

      {/* 3. ACTIVE SURPLUS OFFERS LIST & REAL-TIME TRACKING */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
              Hotel Surplus Recovery Offers ({offers.length})
            </h2>
            <p className="text-xs text-[#585E68]">
              Authoritative records shared with Hyderabad Community Food Support
            </p>
          </div>
          <span className="text-[11px] text-[#737A87]">
            Origin: Deccan Grand Hotel (Gachibowli)
          </span>
        </div>

        <div className="space-y-4">
          {offers.map((offer) => {
            const isEligible = offer.safetyReview.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP';
            const isPending = offer.safetyReview.decision === 'PENDING_REVIEW';
            const isRejected = offer.safetyReview.decision === 'REJECTED';
            const isAccepted = offer.status === 'ACCEPTED';
            const isScheduled = offer.status === 'PICKUP_SCHEDULED';
            const isPickedUp = offer.status === 'PICKED_UP';
            const isCompleted = offer.status === 'COMPLETED';

            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-[#E6E4DC] p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#E6E4DC]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
                        {offer.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isEligible ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        isPending ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        Safety Gate: {offer.safetyReview.decision.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isCompleted ? 'bg-emerald-100 text-emerald-900' :
                        isAccepted || isScheduled || isPickedUp ? 'bg-blue-100 text-blue-900' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        Status: {offer.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#141618] mt-1.5">{offer.foodItem}</h3>
                    <p className="text-xs text-[#585E68]">
                      {offer.quantity} {offer.unit} (~{offer.servingsEquivalent} portions) • Cooked: {offer.preparationDateTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedOffer(offer)}
                      className="py-1.5 px-3 rounded-lg border border-[#E6E4DC] hover:bg-[#FAF9F5] text-xs font-semibold text-[#141618] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Timeline &amp; Audit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status details & NGO response */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Column 1: Holding & Safety */}
                  <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E6E4DC]/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#737A87]">Holding Conditions</span>
                    <div className="font-semibold text-[#141618]">{offer.safetyReview.storageCondition}</div>
                    <div className="text-[11px] text-[#585E68]">
                      Logged Temp: <strong>{offer.safetyReview.temperatureLoggedCelsius || 'N/A'}°C</strong>
                    </div>
                    <div className="text-[10px] text-[#2E7D32] pt-0.5">
                      Reviewer: {offer.safetyReview.reviewedBy}
                    </div>
                  </div>

                  {/* Column 2: Partner Acceptance Status */}
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    offer.acceptedByOrgName ? 'bg-blue-50/50 border-blue-200' : 'bg-[#FAF9F5] border-[#E6E4DC]/60'
                  }`}>
                    <span className="text-[10px] font-bold uppercase text-[#737A87]">Recovery Partner Decision</span>
                    {offer.acceptedByOrgName ? (
                      <div>
                        <div className="font-bold text-[#2563EB] flex items-center gap-1">
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>Accepted by {offer.acceptedByOrgName}</span>
                        </div>
                        <div className="text-[11px] text-[#585E68] mt-0.5">
                          Status: Active recovery coordination
                        </div>
                      </div>
                    ) : offer.status === 'DECLINED' ? (
                      <div>
                        <div className="font-bold text-gray-700">Declined by Partner</div>
                        <div className="text-[11px] text-[#585E68]">Reason: {offer.declineReason || 'Capacity full'}</div>
                      </div>
                    ) : isPending ? (
                      <div className="text-[#D97706] font-semibold">
                        Locked: Pending hotel safety review
                      </div>
                    ) : (
                      <div className="text-[#1B4D36] font-semibold">
                        Awaiting partner review in NGO inbox
                      </div>
                    )}
                  </div>

                  {/* Column 3: Pickup Coordination & Handover */}
                  <div className={`p-3 rounded-xl border space-y-1.5 ${
                    isScheduled || isPickedUp || isCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-[#FAF9F5] border-[#E6E4DC]/60'
                  }`}>
                    <span className="text-[10px] font-bold uppercase text-[#737A87]">Pickup &amp; Dock Handover</span>
                    {isScheduled || isPickedUp || isCompleted ? (
                      <div>
                        <div className="font-bold text-[#141618]">
                          {offer.pickupDetails?.scheduledDateTime || 'Scheduled'}
                        </div>
                        <div className="text-[11px] text-[#585E68]">
                          Vehicle: {offer.pickupDetails?.vehicleType}
                        </div>
                        {isScheduled && (
                          <button
                            type="button"
                            onClick={() => handleHandover(offer.id)}
                            disabled={loading}
                            className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirm Food Handover at Dock</span>
                          </button>
                        )}
                        {isPickedUp && (
                          <div className="text-[10px] text-[#2E7D32] font-bold flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Handed over to driver. In transit to NGO.</span>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="text-[10px] text-[#2E7D32] font-bold flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Recovery completed &amp; distributed.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#737A87]">
                        Pickup scheduling unlocks once partner accepts.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. HYDERABAD RECOVERY GRID DEMO MAP */}
      <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E6E4DC]">
          <div>
            <h3 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
              Hyderabad Recovery Corridor Map
            </h3>
            <p className="text-xs text-[#585E68]">
              Lightweight OpenStreetMap integration showing Deccan Grand Hotel and Hyderabad Community Food Support
            </p>
          </div>
          <span className="text-[11px] text-[#737A87] bg-[#FAF9F5] px-2.5 py-1 rounded-md border border-[#E6E4DC]">
            Approx. straight-line distance: 4.5 km
          </span>
        </div>

        <RecoveryLeafletMap
          kitchenLat={hotelCoords.lat}
          kitchenLng={hotelCoords.lng}
          kitchenName="Deccan Grand Hotel — Hyderabad (Gachibowli)"
          onSelectOrg={() => {}}
          organizations={[
            {
              id: DEMO_NGO.id,
              name: `${DEMO_NGO.name} (Fictional Demo Partner)`,
              organizationType: 'NGO Food Relief',
              verified: true,
              verifiedBadgeText: 'Fictional Demo Partner',
              distanceKm: 4.5,
              etaMinutes: 15,
              address: DEMO_NGO.location,
              city: 'Hyderabad',
              acceptedFoodTypes: ['Cooked Hot Meals', 'Rice', 'Curries'],
              dailyIntakeCapacity: 150,
              currentAvailableCapacity: 90,
              foodCategoryNeeded: 'Cooked Hot Meals',
              status: 'Accepting',
              latitude: DEMO_NGO.coordinates.lat,
              longitude: DEMO_NGO.coordinates.lng,
              lat: DEMO_NGO.coordinates.lat,
              lng: DEMO_NGO.coordinates.lng,
              contactPerson: DEMO_NGO.contactPerson,
              phone: DEMO_NGO.contactPhone,
            },
          ]}
        />
      </div>

      {/* 5. CREATE OFFER MODAL */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Food Recovery Offer"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">
                Food Item Description (from kitchen service records)
              </label>
              <input
                type="text"
                required
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                placeholder="e.g. Steamed Sona Masoori Rice & Andhra Chicken Curry"
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as FoodUnit)}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                >
                  <option value="kg">kg</option>
                  <option value="L">litres (L)</option>
                  <option value="pieces">pieces</option>
                  <option value="portions">portions</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Portions Equivalent</label>
                <input
                  type="number"
                  min="1"
                  value={servingsEquivalent}
                  onChange={(e) => setServingsEquivalent(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Preparation Date &amp; Time</label>
                <input
                  type="text"
                  required
                  value={prepDateTime}
                  onChange={(e) => setPrepDateTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Safe Pickup Deadline</label>
                <input
                  type="text"
                  required
                  value={pickupDeadline}
                  onChange={(e) => setPickupDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Storage / Holding Method</label>
                <select
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value as 'Hot-holding (≥63°C)' | 'Refrigerated (≤4°C)' | 'Ambient / Dry')}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                >
                  <option value="Hot-holding (≥63°C)">Hot-holding (≥63°C)</option>
                  <option value="Refrigerated (≤4°C)">Refrigerated (≤4°C)</option>
                  <option value="Ambient / Dry">Ambient / Dry</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Logged Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperatureLogged}
                  onChange={(e) => setTemperatureLogged(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Hotel Loading Dock Location</label>
              <input
                type="text"
                required
                value={hotelLocation}
                onChange={(e) => setHotelLocation(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Optional Handling Notes</label>
              <textarea
                rows={2}
                value={handlingNotes}
                onChange={(e) => setHandlingNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[11px] text-[#92400E]">
              <strong>Note:</strong> Creating this offer will assign it a persistent unique ID (e.g. <code>FF-SURPLUS-xxxx</code>) and lock it under <strong>PENDING_REVIEW</strong>. It will not be visible for NGO acceptance until authorized safety approval is completed.
            </div>

            <div className="pt-3 border-t border-[#E6E4DC] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="py-2 px-3 rounded-lg border border-[#E6E4DC] text-xs font-semibold text-[#585E68]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 rounded-lg bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold"
              >
                Publish Offer (Pending Safety Gate)
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 6. PERFORM SAFETY REVIEW GATE MODAL */}
      {reviewOffer && (
        <Modal
          isOpen={Boolean(reviewOffer)}
          onClose={() => setReviewOffer(null)}
          title={`Safety Review Gate: ${reviewOffer.id}`}
        >
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E4DC]">
              <span className="text-[10px] font-bold uppercase text-[#737A87]">Item under inspection</span>
              <h4 className="text-sm font-bold text-[#141618]">{reviewOffer.foodItem}</h4>
              <span className="text-[11px] text-[#585E68]">
                Quantity: {reviewOffer.quantity} {reviewOffer.unit} • Prepared: {reviewOffer.preparationDateTime}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Reviewer Name</label>
                <input
                  type="text"
                  required
                  value={reviewedBy}
                  onChange={(e) => setReviewedBy(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#141618] mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={reviewerDesignation}
                  onChange={(e) => setReviewerDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Measured Core Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                required
                value={reviewTemp}
                onChange={(e) => setReviewTemp(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            {/* MANDATORY CHECKBOXES */}
            <div className="space-y-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-[11px] font-bold text-[#141618] block">Mandatory Verification Checklist:</span>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempVerified}
                  onChange={(e) => setTempVerified(e.target.checked)}
                  className="rounded text-[#1B4D36]"
                />
                <span>Temperature reading logged &ge;63°C (hot-holding) or &le;4°C (chilled)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hygienePassed}
                  onChange={(e) => setHygienePassed(e.target.checked)}
                  className="rounded text-[#1B4D36]"
                />
                <span>Sensory and visual hygiene inspection passed with zero signs of degradation</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={packagingCheck}
                  onChange={(e) => setPackagingCheck(e.target.checked)}
                  className="rounded text-[#1B4D36]"
                />
                <span>Food packaged in sanitized, food-grade thermal stainless steel containers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1B4D36]">
                <input
                  type="checkbox"
                  checked={staffConfirmed}
                  onChange={(e) => setStaffConfirmed(e.target.checked)}
                  className="rounded text-[#1B4D36]"
                />
                <span>I confirm as authorized hotel staff that this food is eligible for recovery</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Decision</label>
              <select
                value={reviewDecision}
                onChange={(e) => setReviewDecision(e.target.value as 'ELIGIBLE_FOR_REVIEWED_PICKUP' | 'REJECTED')}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs font-bold"
              >
                <option value="ELIGIBLE_FOR_REVIEWED_PICKUP">APPROVE: ELIGIBLE_FOR_REVIEWED_PICKUP</option>
                <option value="REJECTED">REJECT: Unsafe or Failed Criteria</option>
              </select>
            </div>

            {reviewDecision === 'REJECTED' && (
              <div>
                <label className="block text-[11px] font-bold text-red-700 mb-1">Rejection Reason</label>
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-red-300 bg-red-50 text-xs"
                />
              </div>
            )}

            <div className="pt-3 border-t border-[#E6E4DC] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewOffer(null)}
                className="py-2 px-3 rounded-lg border border-[#E6E4DC] text-xs font-semibold text-[#585E68]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-4 rounded-lg text-white text-xs font-bold ${
                  reviewDecision === 'ELIGIBLE_FOR_REVIEWED_PICKUP'
                    ? 'bg-[#1B4D36] hover:bg-[#16402D]'
                    : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                Submit Safety Determination
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 7. AUDIT & TIMELINE MODAL */}
      {selectedOffer && (
        <Modal
          isOpen={Boolean(selectedOffer)}
          onClose={() => setSelectedOffer(null)}
          title={`Audit Log & Timeline: ${selectedOffer.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E4DC]">
              <h4 className="font-bold text-[#141618]">{selectedOffer.foodItem}</h4>
              <p className="text-[#585E68] text-[11px] mt-0.5">
                {selectedOffer.quantity} {selectedOffer.unit} • {selectedOffer.hotelLocation}
              </p>
            </div>

            {/* Safety details */}
            <div className="p-3 rounded-xl border border-[#D0E7DA] bg-[#EAF4EE]/30 space-y-1">
              <span className="font-bold text-[#1B4D36] block">Food Safety Gate Record:</span>
              <div>Status: <strong>{selectedOffer.safetyReview.decision}</strong></div>
              <div>Reviewed By: {selectedOffer.safetyReview.reviewedBy} ({selectedOffer.safetyReview.reviewerDesignation})</div>
              <div>Timestamp: {selectedOffer.safetyReview.reviewedAt}</div>
              <div>Notes: {selectedOffer.safetyReview.safetyNotes || 'None'}</div>
            </div>

            {/* Timeline */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737A87] block mb-2">
                Action Sequence
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

            <div className="pt-3 border-t border-[#E6E4DC] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="py-2 px-4 rounded-lg bg-[#141618] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
