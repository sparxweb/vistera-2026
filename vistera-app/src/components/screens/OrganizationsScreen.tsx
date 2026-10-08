'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Phone
} from 'lucide-react';
import { RecoveryOrganization } from '@/types/foodflow';
import { DEMO_ORGANIZATIONS } from '@/lib/demoData';
import { MapPanel } from '@/components/ui/MapPanel';
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
              RECOVERY PARTNERS • STEP 05
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0E382B]">
            Verified Recovery Partners
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6658] mt-0.5">
            Select a verified local community kitchen or pantry to schedule immediate surplus pickup.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5E5DE] text-xs self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Partners' },
            { id: 'cooked', label: 'Cooked Meals' },
            { id: 'bakery', label: 'Bakery' },
            { id: 'produce', label: 'Produce' },
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

      {/* 2-COLUMN LAYOUT: Left Organization List / Right Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Clean Organization List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
              {filteredOrgs.length} Verified Partners Nearby
            </span>
            <span className="text-[10px] font-mono text-[#7D8878]">
              RADIUS: &lt; 5.0 KM
            </span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredOrgs.map((org) => {
              const isSelected = selectedOrg.id === org.id;

              return (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-150 relative space-y-3 ${
                    isSelected
                      ? 'bg-white border-[#0E382B] shadow-[0_4px_20px_rgba(14,56,43,0.08)] ring-1 ring-[#0E382B]'
                      : 'bg-[#FBFBF9] border-[#E5E5DE] hover:bg-white hover:border-[#C5DACD]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
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

                  {/* Badges: Capacity & Food Type */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="bg-white text-[#0E382B] font-semibold px-2 py-0.5 rounded border border-[#E5E5DE]">
                      Capacity: {org.currentAvailableCapacity} servings
                    </span>
                    {org.acceptedFoodTypes.map((t, idx) => (
                      <span key={idx} className="bg-white text-[#5C6658] px-2 py-0.5 rounded border border-[#E5E5DE]">
                        {t}
                      </span>
                    ))}
                    <span className="text-[#10B981] font-semibold text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* Primary Action Button: ONE Primary Action */}
                  <div className="pt-2 border-t border-[#E5E5DE] flex items-center justify-between">
                    <span className="text-[11px] text-[#7D8878]">
                      ETA: ~{org.etaMinutes} mins
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectForDispatch(org);
                      }}
                      className="px-4 py-2 bg-[#0E382B] hover:bg-[#164E3D] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Accept & Schedule Pickup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Live Map + Partner Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <MapPanel
            organizations={organizations}
            selectedOrgId={selectedOrg.id}
            onSelectOrg={(org) => setSelectedOrg(org)}
          />

          {/* Selected Organization Detail Card */}
          <div className="bg-white rounded-2xl border border-[#E5E5DE] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DE]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0E382B]" />
                <h3 className="text-xs font-bold text-[#0E382B] uppercase tracking-wider">
                  Partner Verification & Contact
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#0E382B] bg-[#E8EFEA] px-2 py-0.5 rounded font-semibold">
                COMMUNITY VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
                <span className="text-[10px] text-[#7D8878] uppercase block">Coordinator</span>
                <span className="font-bold text-[#0E382B] block">{selectedOrg.contactPerson}</span>
                <span className="text-[11px] text-[#5C6658] flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {selectedOrg.phone}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
                <span className="text-[10px] text-[#7D8878] uppercase block">Receiving Hours</span>
                <span className="font-bold text-[#0E382B] block">{selectedOrg.openHours}</span>
                <span className="text-[11px] text-[#5C6658]">Hot-dock available</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A]">
                <span className="text-[10px] text-[#B45309] uppercase block font-semibold">Dispatch Window</span>
                <span className="font-bold text-[#D97706] block">~{selectedOrg.etaMinutes} mins pickup</span>
                <span className="text-[11px] text-[#B45309]">Safe temp window</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISPATCH CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(dispatchModalOrg)}
        onClose={() => setDispatchModalOrg(null)}
        title="Schedule Surplus Pickup"
      >
        <div className="space-y-4 text-xs text-[#4A5548]">
          <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#7D8878]">Partner Organization:</span>
              <strong className="text-[#0E382B]">{dispatchModalOrg?.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7D8878]">Surplus Quantity:</span>
              <strong className="text-[#0E382B]">32 servings (Hot Cambro Insulated)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7D8878]">Transit Distance:</span>
              <strong className="text-[#0E382B]">{dispatchModalOrg?.distanceKm} km (~{dispatchModalOrg?.etaMinutes} mins)</strong>
            </div>
          </div>

          {dispatchConfirmed ? (
            <div className="p-4 rounded-xl bg-[#E8EFEA] text-[#0E382B] border border-[#C5DACD] flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#10B981]" />
              <span>Pickup scheduled! Notification dispatched to courier. Redirecting to recovery timeline...</span>
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
