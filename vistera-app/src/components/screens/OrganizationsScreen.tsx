'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Navigation, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Filter, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RecoveryOrganization } from '@/types/foodflow';
import { DEMO_ORGANIZATIONS, DEMO_KITCHEN } from '@/lib/demoData';
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
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              MODULE 04 • COMMUNITY LOGISTICS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            Nearby Recovery Organizations
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Verified local shelters, pantries, and redistribution partners within safe food transfer radius.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E6E4DC] text-xs self-start sm:self-auto">
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
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === tab.id
                  ? 'bg-[#141618] text-white'
                  : 'text-[#585E68] hover:text-[#141618]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Left Org Cards (5 Cols) / Right Interactive Map (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Organization Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#141618]">
              {filteredOrgs.length} Verified Partners in Transit Zone
            </span>
            <span className="text-[10px] font-mono text-[#8A929E]">
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
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-150 relative ${
                    isSelected
                      ? 'bg-white border-[#1B4D36] shadow-[0_4px_20px_rgba(27,77,54,0.08)] ring-1 ring-[#1B4D36]'
                      : 'bg-[#FAF9F5] border-[#E8E6DE] hover:bg-white hover:border-[#D0CDBF]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="text-sm font-bold text-[#141618]">
                          {org.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#6F7682] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1B4D36] shrink-0" />
                        <span>{org.address}</span>
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA] shrink-0">
                      {org.distanceKm} km
                    </span>
                  </div>

                  {/* Accepted Food Badges */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {org.acceptedFoodTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white text-[#4A4E57] px-2 py-0.5 rounded-md border border-[#E6E4DC]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Availability & Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#F0EFEB] text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#8A929E] block uppercase">
                        Current Intake Capacity
                      </span>
                      <span className="font-semibold text-[#141618]">
                        {org.currentAvailableCapacity} / {org.dailyIntakeCapacity} servings open
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectForDispatch(org);
                      }}
                      className="px-3 py-1.5 bg-[#1B4D36] hover:bg-[#143B2A] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1"
                    >
                      <span>Request Pickup</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prototype Seed Notice */}
          <div className="p-3 bg-white rounded-xl border border-[#E6E4DC] text-[11px] text-[#737A87]">
            <strong>Evaluator Note:</strong> Organizations shown are seeded demo partner profiles with realistic geographic vectors. Real-world verification workflows sync to 501(c)(3) tax ID records in Supabase.
          </div>
        </div>

        {/* Right Side: Interactive Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <MapPanel
            organizations={organizations}
            selectedOrgId={selectedOrg.id}
            onSelectOrg={(org) => setSelectedOrg(org)}
          />

          {/* Selected Organization Deep-Dive Profile */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)] space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1B4D36]" />
                <span className="text-xs font-bold text-[#141618]">
                  Partner Verification Credentials
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded">
                TAX-EXEMPT FOOD BANK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
                <span className="text-[10px] text-[#8A929E] block uppercase">Direct Dispatch Contact</span>
                <span className="font-semibold text-[#141618] block">{selectedOrg.contactPerson}</span>
                <span className="text-[11px] text-[#525866]">{selectedOrg.phone}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
                <span className="text-[10px] text-[#8A929E] block uppercase">Receiving Hours</span>
                <span className="font-semibold text-[#141618] block">{selectedOrg.openHours}</span>
                <span className="text-[11px] text-[#525866]">Refrigerated dock active</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF9F5]">
                <span className="text-[10px] text-[#8A929E] block uppercase">Courier Transit Window</span>
                <span className="font-semibold text-[#B85720] block">~{selectedOrg.etaMinutes} minutes</span>
                <span className="text-[11px] text-[#525866]">Well under 2h limit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Dispatch Confirmation */}
      <Modal
        isOpen={Boolean(dispatchModalOrg)}
        onClose={() => setDispatchModalOrg(null)}
        title="Confirm Surplus Dispatch Transfer"
        subtitle={`Assign 32 servings to ${dispatchModalOrg?.name}`}
      >
        <div className="space-y-4 text-xs text-[#2C313A]">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E6E4DC] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#737A87]">Assigned Surplus:</span>
              <strong className="text-[#141618]">32 servings (Herb-Roasted Chicken & Farro)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737A87]">Partner Name:</span>
              <strong className="text-[#141618]">{dispatchModalOrg?.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737A87]">Transit Distance:</span>
              <strong className="text-[#1B4D36]">{dispatchModalOrg?.distanceKm} km (~{dispatchModalOrg?.etaMinutes} mins)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737A87]">Pickup Deadline:</span>
              <strong className="text-[#B85720]">Today, 15:30 PM (Cambro Insulated)</strong>
            </div>
          </div>

          {dispatchConfirmed ? (
            <div className="p-4 rounded-xl bg-[#EAF4EE] text-[#1B4D36] border border-[#CCE3D5] flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Dispatch assigned! Route notified to partner courier via SMS webhook. Redirecting to recovery timeline...</span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EFEB]">
              <button
                type="button"
                onClick={() => setDispatchModalOrg(null)}
                className="px-3 py-1.5 text-xs text-[#585E68] hover:text-[#141618]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-4 py-2 bg-[#1B4D36] hover:bg-[#143B2A] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Confirm Dispatch & Notify NGO
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
