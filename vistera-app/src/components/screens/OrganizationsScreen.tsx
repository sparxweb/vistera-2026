'use client';

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Award
} from 'lucide-react';
import { RecoveryOrganization } from '@/types/foodflow';
import { DEMO_ORGANIZATIONS, DEMO_HOTEL } from '@/lib/demoData';
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
  const baseOrganizations = propOrgs && propOrgs.length > 0 ? propOrgs : DEMO_ORGANIZATIONS;

  const [selectedOrgId, setSelectedOrgId] = useState<string>(baseOrganizations[0]?.id || '');
  const [filterType, setFilterType] = useState<string>('all');
  const [dispatchModalOrg, setDispatchModalOrg] = useState<RecoveryOrganization | null>(null);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  // Intelligent matching calculation (Food Type + Distance + Capacity fit)
  const scoredOrganizations = useMemo(() => {
    const list = baseOrganizations.map((org) => {
      let score = 0;
      // Food fit (Needs cooked meals or rice)
      const foodNeed = org.foodCategoryNeeded?.toLowerCase() || '';
      if (foodNeed.includes('cooked') || foodNeed.includes('rice') || foodNeed.includes('staple')) {
        score += 40;
      } else {
        score += 20;
      }

      // Distance proximity (<3.5 km = 35 pts, <6 km = 25 pts, else 15 pts)
      if (org.distanceKm < 3.5) {
        score += 35;
      } else if (org.distanceKm < 6.0) {
        score += 25;
      } else {
        score += 15;
      }

      // Capacity fit (Able to take >= 30 portions)
      if (org.currentAvailableCapacity >= 40) {
        score += 25;
      } else if (org.currentAvailableCapacity >= 20) {
        score += 20;
      } else {
        score += 10;
      }

      return {
        ...org,
        matchScore: score,
        isBestMatch: false,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return list.map((org, idx) => ({
      ...org,
      isBestMatch: idx === 0,
    }));
  }, [baseOrganizations]);

  const filteredOrgs = scoredOrganizations.filter((org) => {
    if (filterType === 'all') return true;
    return org.acceptedFoodTypes.some((t) => t.toLowerCase().includes(filterType.toLowerCase()));
  });

  const selectedOrg = filteredOrgs.find((o) => o.id === selectedOrgId) || filteredOrgs[0] || scoredOrganizations[0];
  const setSelectedOrg = (org: RecoveryOrganization) => setSelectedOrgId(org.id);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-full border border-[#D0E7DA]">
              RECOVERY MAP &amp; PARTNERS • STEP 05
            </span>
            <span className="text-[11px] text-[#737A87]">
              FACILITY: <strong>{DEMO_HOTEL.name}</strong> (Lat: {DEMO_HOTEL.latitude}, Lng: {DEMO_HOTEL.longitude})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Food Recovery Map &amp; Matchmaking — Hyderabad
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Geodesic Haversine proximity routing from Deccan Grand Hotel to community rescue centers across Gachibowli, Madhapur &amp; Kondapur.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E6E4DC] text-xs self-start sm:self-auto">
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
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#1B4D36] text-white shadow-xs'
                  : 'text-[#585E68] hover:text-[#141618]'
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
        kitchenLat={DEMO_HOTEL.latitude}
        kitchenLng={DEMO_HOTEL.longitude}
        kitchenName={DEMO_HOTEL.name}
      />

      {/* PARTNER DIRECTORY CARDS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#141618] uppercase tracking-wider">
            {filteredOrgs.length} Seeded Demo Recovery Partners in Hyderabad Corridor
          </span>
          <span className="text-[10px] font-mono text-[#737A87]">
            HAVERSINE DISTANCE • GACHIBOWLI / BANJARA HILLS CORRIDOR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrgs.map((org) => {
            const isSelected = selectedOrg.id === org.id;

            return (
              <div
                key={org.id}
                onClick={() => setSelectedOrg(org)}
                className={`cursor-pointer rounded-3xl p-5 border transition-all duration-150 space-y-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#1B4D36] shadow-sm ring-1 ring-[#1B4D36]'
                    : 'bg-[#FAF9F5] border-[#E6E4DC] hover:bg-white hover:border-[#D0E7DA]'
                }`}
              >
                {org.isBestMatch && (
                  <div className="absolute top-0 right-0 bg-[#1B4D36] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-xs">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>Best Match ({org.matchScore} pts)</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 pr-20">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded-full border border-[#D0E7DA]">
                        {org.sourceType}
                      </span>
                      <span className="text-[10px] font-bold text-[#C6682F] bg-[#FCF2EB] px-2 py-0.5 rounded-full border border-[#F6DAC8]">
                        {org.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#141618]">
                      {org.name}
                    </h4>
                    <p className="text-[11px] text-[#737A87] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#1B4D36] shrink-0" />
                      <span>{org.address}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-mono font-bold text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded-lg border border-[#D0E7DA]">
                    {org.distanceKm} km away (~{org.etaMinutes} mins)
                  </span>

                  <span className="text-[11px] text-[#737A87]">
                    Haversine Geodesic Fit
                  </span>
                </div>

                {/* Capacity & Needs */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="bg-white text-[#141618] font-semibold px-2 py-0.5 rounded-lg border border-[#E6E4DC]">
                    Capacity: {org.currentAvailableCapacity} meals
                  </span>
                  <span className="bg-white text-[#585E68] px-2 py-0.5 rounded-lg border border-[#E6E4DC]">
                    Need: {org.foodCategoryNeeded}
                  </span>
                  <span className="bg-[#EAF4EE] text-[#1B4D36] font-semibold px-2 py-0.5 rounded-lg border border-[#D0E7DA]">
                    Match: {org.matchScore}%
                  </span>
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-[#F0EFEB] flex items-center justify-between">
                  <span className="text-[11px] text-[#737A87] flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{org.phone}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectForDispatch(org);
                    }}
                    className="px-4 py-2 bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
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
        <div className="space-y-4 text-xs text-[#141618]">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#737A87]">Partner Organization:</span>
              <strong className="text-[#141618]">{dispatchModalOrg?.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737A87]">Staged Surplus Food:</span>
              <strong className="text-[#1B4D36]">3.2 kg Rice + 2.5 kg Chicken Curry + 1.8 L Dal</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737A87]">Transit Distance:</span>
              <strong className="text-[#141618]">{dispatchModalOrg?.distanceKm} km (~{dispatchModalOrg?.etaMinutes} mins)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737A87]">Pickup Location:</span>
              <span className="text-[#141618]">{DEMO_HOTEL.name} — Service Bay Dock 2</span>
            </div>
          </div>

          {dispatchConfirmed ? (
            <div className="p-4 rounded-2xl bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA] flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2E7D32]" />
              <span>Pickup scheduled! Status updated to PICKUP_SCHEDULED. Redirecting to surplus tracker...</span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EFEB]">
              <button
                type="button"
                onClick={() => setDispatchModalOrg(null)}
                className="px-4 py-2 text-xs font-semibold text-[#585E68] hover:text-[#141618] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-5 py-2.5 bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
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
