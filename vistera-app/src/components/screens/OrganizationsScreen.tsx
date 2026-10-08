'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Phone
} from 'lucide-react';
import { RecoveryOrganization } from '@/types/foodflow';
import { DEMO_ORGANIZATIONS } from '@/lib/demoData';
import { RecoveryMapbox } from '@/components/recovery/RecoveryMapbox';
import { Modal } from '@/components/ui/Modal';
import { ScreenId } from '@/components/layout/Header';

interface OrganizationsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  organizations?: RecoveryOrganization[];
  onAcceptOrg?: (org: RecoveryOrganization) => void;
}

export function OrganizationsScreen({ 
  onNavigate, 
  organizations: propOrgs,
  onAcceptOrg,
}: OrganizationsScreenProps) {
  const organizations = propOrgs && propOrgs.length > 0 ? propOrgs : DEMO_ORGANIZATIONS;
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || '');
  const selectedOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];
  const setSelectedOrg = (org: RecoveryOrganization) => setSelectedOrgId(org.id);

  const [filterType, setFilterType] = useState<string>('all');
  const [dispatchModalOrg, setDispatchModalOrg] = useState<RecoveryOrganization | null>(null);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  const filteredOrgs = organizations.filter((org) => {
    if (filterType === 'all') return true;
    return org.acceptedFoodTypes.some((t) => t.toLowerCase().includes(filterType.toLowerCase()));
  });

  const handleSelectForDispatch = (org: RecoveryOrganization) => {
    setDispatchModalOrg(org);
    setDispatchConfirmed(false);
  };

  const handleConfirmDispatch = () => {
    setDispatchConfirmed(true);
    if (dispatchModalOrg && onAcceptOrg) {
      onAcceptOrg(dispatchModalOrg);
    }
    setTimeout(() => {
      setDispatchModalOrg(null);
      setDispatchConfirmed(false);
      onNavigate('recovery');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5DE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
              RECOVERY MAP • STEP 05
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Food Recovery Map — Hyderabad
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Geodesic proximity routing for College Hostel Canteen to nearby community rescue centers across Gachibowli, Madhapur & Kondapur.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5E5DE] text-xs self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Partners' },
            { id: 'cooked', label: 'Cooked Meals' },
            { id: 'rice', label: 'Rice & Dal' },
            { id: 'veg', label: 'Vegetarian' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#0E382B] text-white'
                  : 'text-[#5C6658] hover:text-[#0E382B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE MAPBOX GL JS MAP WITH HYDERABAD COORDINATES */}
      <RecoveryMapbox
        organizations={filteredOrgs}
        selectedOrgId={selectedOrg.id}
        onSelectOrg={(org) => setSelectedOrg(org)}
        onSchedulePickup={(org) => handleSelectForDispatch(org)}
        kitchenLat={17.4447}
        kitchenLng={78.3483}
        kitchenName="College Hostel Dining Hall (Gachibowli, Hyderabad)"
      />

      {/* PARTNER DIRECTORY CARDS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
            {filteredOrgs.length} Demo Recovery Partners in Hyderabad Corridor
          </span>
          <span className="text-[10px] font-mono text-[#7D8878]">
            HAVERSINE DISTANCE • GACHIBOWLI CENTER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrgs.map((org) => {
            const isSelected = selectedOrg.id === org.id;

            return (
              <div
                key={org.id}
                onClick={() => setSelectedOrg(org)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-150 space-y-3 ${
                  isSelected
                    ? 'bg-white border-[#0E382B] shadow-md ring-1 ring-[#0E382B]'
                    : 'bg-[#FBFBF9] border-[#E5E5DE] hover:bg-white hover:border-[#C5DACD]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#E8EFEA] px-2 py-0.5 rounded border border-[#C5DACD]">
                        {org.sourceType}
                      </span>
                      <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                        {org.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0E382B]">
                      {org.name}
                    </h4>
                    <p className="text-[11px] text-[#5C6658] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#0E382B] shrink-0" />
                      <span>{org.address}</span>
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#0E382B] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD] shrink-0">
                    {org.distanceKm} km
                  </span>
                </div>

                {/* Capacity & Needs */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="bg-white text-[#0E382B] font-semibold px-2 py-0.5 rounded border border-[#E5E5DE]">
                    Avail. Capacity: {org.currentAvailableCapacity} meals
                  </span>
                  <span className="bg-white text-[#5C6658] px-2 py-0.5 rounded border border-[#E5E5DE]">
                    Need: {org.foodCategoryNeeded}
                  </span>
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-[#E5E5DE] flex items-center justify-between">
                  <span className="text-[11px] text-[#7D8878] flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{org.phone}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectForDispatch(org);
                    }}
                    className="px-4 py-2 bg-[#0E382B] hover:bg-[#164E3D] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Schedule Pickup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISPATCH CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(dispatchModalOrg)}
        onClose={() => setDispatchModalOrg(null)}
        title="Schedule Surplus Rescue Transfer"
      >
        <div className="space-y-4 text-xs text-[#4A5548]">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#7D8878]">Partner Organization:</span>
              <strong className="text-[#0E382B]">{dispatchModalOrg?.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7D8878]">Staged Surplus Food:</span>
              <strong className="text-[#0E382B]">3.2 kg Rice + 2.5 kg Chicken Curry + 1.8 L Dal</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7D8878]">Transit Distance:</span>
              <strong className="text-[#0E382B]">{dispatchModalOrg?.distanceKm} km (~{dispatchModalOrg?.etaMinutes} mins)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7D8878]">Pickup Location:</span>
              <span className="text-[#0E382B]">Hostel Dining Hall — Loading Bay Dock 2, Gachibowli</span>
            </div>
          </div>

          {dispatchConfirmed ? (
            <div className="p-4 rounded-xl bg-[#E8EFEA] text-[#0E382B] border border-[#C5DACD] flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#10B981]" />
              <span>Pickup scheduled successfully! Handoff manifest dispatched. Redirecting to recovery timeline...</span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5DE]">
              <button
                type="button"
                onClick={() => setDispatchModalOrg(null)}
                className="px-4 py-2 text-xs text-[#5C6658] hover:text-[#0E382B]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-5 py-2.5 bg-[#0E382B] hover:bg-[#164E3D] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Confirm Pickup Schedule
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
