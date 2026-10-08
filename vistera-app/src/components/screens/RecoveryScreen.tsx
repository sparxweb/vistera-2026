'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  PlusCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Thermometer, 
  ChevronRight,
  RotateCw,
  Building2,
  Calendar
} from 'lucide-react';
import { SurplusListing, SurplusListingStatus } from '@/types/foodflow';
import { INITIAL_SURPLUS_LISTING, DEMO_KITCHEN } from '@/lib/demoData';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ScreenId } from '@/components/layout/Header';

interface RecoveryScreenProps {
  onNavigate: (screen: ScreenId) => void;
  listing?: SurplusListing;
  onUpdateListing?: (listing: SurplusListing) => void;
  surplusQuantity?: number;
}

export function RecoveryScreen({ 
  onNavigate, 
  listing: propListing,
  onUpdateListing,
  surplusQuantity,
}: RecoveryScreenProps) {
  const [internalListing, setInternalListing] = useState<SurplusListing | null>(null);
  const listing = propListing || internalListing || INITIAL_SURPLUS_LISTING;
  const setListing = (updated: SurplusListing) => {
    setInternalListing(updated);
    if (onUpdateListing) {
      onUpdateListing(updated);
    }
  };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form fields for new listing
  const [newFood, setNewFood] = useState('Herb-Roasted Chicken & Mediterranean Farro');
  const [newQuantity, setNewQuantity] = useState(surplusQuantity || propListing?.servings || 32);
  const [newPrepTime, setNewPrepTime] = useState('11:15 AM');
  const [newDeadline, setNewDeadline] = useState('15:30 PM (Within 2h)');
  const [newLocation, setNewLocation] = useState('FOODFLOW Central Kitchen — Dock 2B, Loading Bay');
  const [newNotes, setNewNotes] = useState('Panned in thermal cambro food carriers. Temp 68.4°C.');

  const stages: { stage: SurplusListingStatus; label: string; desc: string }[] = [
    { stage: 'listed', label: 'Surplus Listed', desc: 'Published to verified recovery NGO dispatch' },
    { stage: 'organization_viewed', label: 'Organization Viewed', desc: 'Feeding Hope Community Center opened listing' },
    { stage: 'accepted', label: 'Accepted by Partner', desc: 'Non-profit claimed all 32 pans' },
    { stage: 'pickup_scheduled', label: 'Pickup Scheduled', desc: 'Volunteer refrigerated courier en route' },
    { stage: 'collected', label: 'Collected & Transferred', desc: 'Chain of custody signed & logged in DB' },
  ];

  const getStageIndex = (status: SurplusListingStatus) => {
    return stages.findIndex((s) => s.stage === status);
  };

  const currentStageIndex = getStageIndex(listing.status);

  // Advance simulation step
  const handleAdvanceStatus = () => {
    const nextIdx = (currentStageIndex + 1) % stages.length;
    const nextStage = stages[nextIdx].stage;
    const updated = {
      ...listing,
      status: nextStage,
    };
    setListing(updated);
    if (onUpdateListing) {
      onUpdateListing(updated);
    }
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SurplusListing = {
      id: `SUR-${Date.now().toString().slice(-4)}`,
      title: newFood,
      category: 'Cooked Meals',
      servings: Number(newQuantity),
      temperatureCondition: 'Hot Held (≥63°C)',
      preparedTime: newPrepTime,
      pickupDeadline: newDeadline,
      kitchenLocation: newLocation,
      dietaryTags: ['Verified Hot-Held', 'Nut-Free'],
      allergens: ['Wheat / Gluten'],
      notes: newNotes,
      status: 'listed',
      statusHistory: [
        { stage: 'listed', label: 'Surplus Listed', timestamp: 'Just now', completed: true },
        { stage: 'organization_viewed', label: 'Organization Viewed', timestamp: 'Pending', completed: false },
        { stage: 'accepted', label: 'Accepted by Partner', timestamp: 'Pending', completed: false },
        { stage: 'pickup_scheduled', label: 'Pickup Scheduled', timestamp: 'Pending', completed: false },
        { stage: 'collected', label: 'Collected', timestamp: 'Pending', completed: false },
      ],
      assignedOrg: 'Feeding Hope Community Center',
    };

    setListing(created);
    if (onUpdateListing) {
      onUpdateListing(created);
    }
    setShowCreateModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              MODULE 03 • SURPLUS DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Recover eligible surplus.
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Connect eligible kitchen pans to local verified recovery organizations before temperature safe windows expire.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#1B4D36] hover:bg-[#143B2A] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Surplus Listing</span>
          </button>
        </div>
      </div>

      {/* Hero Status: 32 Servings Available */}
      <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-7 shadow-[0_2px_16px_rgba(20,22,24,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6682F] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B85720]">
              ACTIVE RECOVERY PIPELINE
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#141618]">
              {listing.servings} servings
            </span>
            <span className="text-sm font-semibold text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-1 rounded-full border border-[#D0E7DA]">
              Available & Safe
            </span>
          </div>
          <p className="text-xs text-[#525866] max-w-xl">
            {listing.title} • Logged at 68.4°C hot-held in Cambro insulated pans. Safe recovery window expires at {listing.pickupDeadline}.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('organizations')}
            className="px-4 py-2.5 bg-white border border-[#E6E4DC] hover:bg-[#FAF9F5] text-[#141618] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-[#1B4D36]" />
            <span>View 4 Verified NGOs</span>
          </button>

          <button
            type="button"
            onClick={handleAdvanceStatus}
            className="px-4 py-2.5 bg-[#141618] hover:bg-[#1B4D36] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            title="Step through demo lifecycle"
          >
            <RotateCw className="w-4 h-4" />
            <span>Simulate Step: Advance Status</span>
          </button>
        </div>
      </div>

      {/* LISTING ACTIVE — Detailed Status Timeline */}
      <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-8 shadow-[0_2px_16px_rgba(20,22,24,0.02)] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#141618] text-white px-2 py-0.5 rounded">
                LISTING ACTIVE
              </span>
              <span className="text-xs font-mono text-[#737A87]">
                ID: {listing.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#141618] mt-1">
              Surplus Transfer Lifecycle Timeline
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737A87]">Assigned Partner:</span>
            <span className="text-xs font-semibold text-[#141618] bg-[#FAF9F5] px-2.5 py-1 rounded border border-[#E6E4DC]">
              {listing.assignedOrg}
            </span>
          </div>
        </div>

        {/* Stepper Timeline Visual */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {stages.map((st, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={st.stage}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#EAF4EE] border-[#1B4D36] shadow-sm'
                      : isCompleted
                      ? 'bg-[#FAF9F5] border-[#D0E7DA]'
                      : 'bg-white border-[#EAE8E0] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#737A87]">
                      0{idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-[#8A929E]" />
                    )}
                  </div>

                  <h5 className="text-xs font-bold text-[#141618]">
                    {st.label}
                  </h5>
                  <p className="text-[11px] text-[#525866] mt-1 leading-snug">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Listing Spec Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#F0EFEB] text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] text-[#8A929E] uppercase block mb-1">
              Food Item & Category
            </span>
            <span className="font-semibold text-[#141618] block">
              {listing.title}
            </span>
            <span className="text-[11px] text-[#525866] mt-0.5 block">
              Category: {listing.category}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] text-[#8A929E] uppercase block mb-1">
              Temperature & Condition
            </span>
            <span className="font-semibold text-[#1B4D36] flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" />
              {listing.temperatureCondition}
            </span>
            <span className="text-[11px] text-[#525866] mt-0.5 block">
              Logged at 68.4°C at shift wrap
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] text-[#8A929E] uppercase block mb-1">
              Safe Pickup Window
            </span>
            <span className="font-semibold text-[#B85720] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Before {listing.pickupDeadline}
            </span>
            <span className="text-[11px] text-[#525866] mt-0.5 block">
              Prepared at {listing.preparedTime}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DE]">
            <span className="text-[10px] text-[#8A929E] uppercase block mb-1">
              Dispatch Location
            </span>
            <span className="font-semibold text-[#141618] flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#1B4D36]" />
              Dock 2B, Loading Bay
            </span>
            <span className="text-[11px] text-[#525866] mt-0.5 block truncate">
              {DEMO_KITCHEN.name}
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Create Surplus Listing */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Surplus Listing"
        subtitle="Publish unserved prepared pans to verified community recovery partners"
      >
        <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#141618] mb-1">
              Food Item Description
            </label>
            <input
              type="text"
              required
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              placeholder="e.g. Herb-Roasted Chicken & Farro"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#141618] mb-1">
                Servings Available
              </label>
              <input
                type="number"
                min="1"
                required
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#141618] mb-1">
                Prepared Time
              </label>
              <input
                type="text"
                required
                value={newPrepTime}
                onChange={(e) => setNewPrepTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#141618] mb-1">
                Pickup Safe Deadline
              </label>
              <input
                type="text"
                required
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#141618] mb-1">
                Kitchen Loading Location
              </label>
              <input
                type="text"
                required
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#141618] mb-1">
              Handling Notes & Temperature Log
            </label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E6E4DC] bg-[#FAF9F5] text-[#141618] focus:border-[#1B4D36] focus:outline-none"
              placeholder="e.g. Held in Cambro boxes above 65°C."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EFEB]">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-3 py-1.5 text-xs text-[#585E68] hover:text-[#141618]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1B4D36] hover:bg-[#143B2A] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Publish Active Listing
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
