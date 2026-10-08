'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  PlusCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Thermometer, 
  ArrowRight,
  RotateCw,
  Building2,
  AlertCircle
} from 'lucide-react';
import { SurplusListing, SurplusListingStatus } from '@/types/foodflow';
import { INITIAL_SURPLUS_LISTING } from '@/lib/demoData';
import { Modal } from '@/components/ui/Modal';
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

  // Form fields for new listing
  const [newFood, setNewFood] = useState('Herb-Roasted Chicken & Mediterranean Farro');
  const [newQuantity, setNewQuantity] = useState(surplusQuantity || propListing?.servings || 32);
  const [newPrepTime, setNewPrepTime] = useState('11:15 AM');
  const [newDeadline, setNewDeadline] = useState('15:30 PM (Within 2h)');
  const [newLocation, setNewLocation] = useState('Central Dining Hall — Dock 2B, Loading Bay');
  const [newNotes, setNewNotes] = useState('Panned in thermal Cambro food carriers. Temp 68.4°C.');

  const stages: { stage: SurplusListingStatus; label: string }[] = [
    { stage: 'listed', label: 'ACTIVE' },
    { stage: 'organization_viewed', label: 'VIEWED' },
    { stage: 'accepted', label: 'ACCEPTED' },
    { stage: 'pickup_scheduled', label: 'PICKUP SCHEDULED' },
    { stage: 'collected', label: 'COLLECTED' },
  ];

  const getStageIndex = (status: SurplusListingStatus) => {
    const idx = stages.findIndex((s) => s.stage === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStageIndex = getStageIndex(listing.status);

  const handleAdvanceStatus = () => {
    const nextIdx = (currentStageIndex + 1) % stages.length;
    const nextStage = stages[nextIdx].stage;
    const updated = {
      ...listing,
      status: nextStage,
    };
    setListing(updated);
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
        { stage: 'listed', label: 'ACTIVE', timestamp: 'Just now', completed: true },
        { stage: 'organization_viewed', label: 'VIEWED', timestamp: 'Pending', completed: false },
        { stage: 'accepted', label: 'ACCEPTED', timestamp: 'Pending', completed: false },
        { stage: 'pickup_scheduled', label: 'PICKUP SCHEDULED', timestamp: 'Pending', completed: false },
        { stage: 'collected', label: 'COLLECTED', timestamp: 'Pending', completed: false },
      ],
      assignedOrg: 'Feeding Hope Community Center',
    };

    setListing(created);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* HEADER: CINEMATIC WASTE-TO-IMPACT */}
      <div className="pb-4 border-b border-[#E5E5DE] space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded border border-[#FDE68A]">
          SURPLUS ROUTING • STEP 04
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0E382B]">
          &ldquo;Don&apos;t let today&apos;s surplus become tomorrow&apos;s waste.&rdquo;
        </h1>
        <p className="text-sm text-[#5C6658]">
          Route safe, unserved meal pans to verified local rescue organizations within temperature safety windows.
        </p>
      </div>

      {/* PRIMARY SURPLUS DISPATCH CARD */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#0E382B] uppercase tracking-wider">
                READY FOR RESCUE
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#0E382B] mt-1">
              {listing.servings || surplusQuantity || 32} servings available
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] text-xs font-semibold hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Listing</span>
            </button>
          </div>
        </div>

        {/* METADATA GRID: Clean single composition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] uppercase font-bold text-[#7D8878] block mb-1">
              Food Details
            </span>
            <div className="font-bold text-[#0E382B] text-sm">
              {listing.title}
            </div>
            <span className="text-[11px] text-[#5C6658] mt-0.5 block">
              Category: {listing.category}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] uppercase font-bold text-[#7D8878] block mb-1">
              Preparation Time
            </span>
            <div className="font-bold text-[#0E382B] text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0E382B]" />
              {listing.preparedTime}
            </div>
            <span className="text-[11px] text-[#5C6658] mt-0.5 block">
              Cooked today & staged hot
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A]">
            <span className="text-[10px] uppercase font-bold text-[#B45309] block mb-1">
              Pickup Deadline
            </span>
            <div className="font-bold text-[#D97706] text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              {listing.pickupDeadline}
            </div>
            <span className="text-[11px] text-[#B45309] mt-0.5 block">
              Safe window (≤ 2 hours)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
            <span className="text-[10px] uppercase font-bold text-[#7D8878] block mb-1">
              Handling State
            </span>
            <div className="font-bold text-[#0E382B] text-sm flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-[#0E382B]" />
              {listing.temperatureCondition}
            </div>
            <span className="text-[11px] text-[#5C6658] mt-0.5 block">
              Cambro thermal food carriers
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] sm:col-span-2">
            <span className="text-[10px] uppercase font-bold text-[#7D8878] block mb-1">
              Location
            </span>
            <div className="font-bold text-[#0E382B] text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0E382B]" />
              {listing.kitchenLocation}
            </div>
            <span className="text-[11px] text-[#5C6658] mt-0.5 block">
              Direct loading bay dock access for transport vans
            </span>
          </div>
        </div>

        {/* PRIMARY CTA: ONE Main Action Button */}
        <div className="pt-4 border-t border-[#E5E5DE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#5C6658]">
            4 verified recovery partners active within 5 km radius.
          </div>

          <button
            type="button"
            onClick={() => onNavigate('organizations')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Find Recovery Partner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RECOVERY TIMELINE (Clean Horizontal Progress Timeline) */}
      <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DE]">
          <div>
            <h3 className="text-sm font-bold text-[#0E382B] uppercase tracking-wider">
              RECOVERY TIMELINE
            </h3>
            <span className="text-xs text-[#5C6658]">
              Current status: <strong className="text-[#0E382B]">{stages[currentStageIndex].label}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdvanceStatus}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] hover:bg-white text-xs font-semibold text-[#0E382B] transition-colors flex items-center gap-1 cursor-pointer"
            title="Advance stage for demo simulation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Advance Step</span>
          </button>
        </div>

        {/* Horizontal Stepper Progress */}
        <div className="relative py-2">
          {/* Connector Line */}
          <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 bg-[#E5E5DE] -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
            {stages.map((st, idx) => {
              const isDone = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={st.stage}
                  className={`p-3 rounded-xl border text-center transition-all flex sm:flex-col items-center justify-between sm:justify-center gap-2 ${
                    isCurrent
                      ? 'bg-[#E8EFEA] border-[#0E382B] shadow-sm'
                      : isDone
                        ? 'bg-white border-[#C5DACD] text-[#0E382B]'
                        : 'bg-[#FBFBF9] border-[#E5E5DE] text-[#7D8878] opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent 
                      ? 'bg-[#0E382B] text-white' 
                      : isDone 
                        ? 'bg-[#10B981] text-white' 
                        : 'bg-[#E5E5DE] text-[#7D8878]'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span className="text-[11px] font-bold tracking-tight">
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CREATE LISTING MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Surplus Listing"
      >
        <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#7D8878] font-medium mb-1">
              Food Name & Recipe
            </label>
            <input
              type="text"
              required
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#7D8878] font-medium mb-1">
                Servings Available
              </label>
              <input
                type="number"
                required
                min={1}
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#7D8878] font-medium mb-1">
                Pickup Deadline
              </label>
              <input
                type="text"
                required
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#7D8878] font-medium mb-1">
              Kitchen Bay Location
            </label>
            <input
              type="text"
              required
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E5E5DE] bg-[#FBFBF9] text-[#0E382B] focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E5DE]">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-lg border border-[#E5E5DE] text-[#5C6658] hover:bg-[#F4F4EE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0E382B] hover:bg-[#164E3D] text-white font-semibold"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
