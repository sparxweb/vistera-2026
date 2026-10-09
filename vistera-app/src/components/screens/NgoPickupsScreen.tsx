'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  RotateCw,
  Calendar,
  Building2
} from 'lucide-react';
import { FoodRecoveryOffer, AuthUser, ScreenId } from '@/types/foodflow';
import { DEMO_NGO } from '@/lib/demoData';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import { Modal } from '@/components/ui/Modal';

interface NgoPickupsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentUser?: AuthUser;
  offers: FoodRecoveryOffer[];
  onSchedulePickup: (offerId: string, details: { scheduledDateTime: string; vehicleType: string; driverContact: string; notes?: string }) => Promise<void>;
  onCompletePickup: (offerId: string) => Promise<void>;
  onRefresh: () => void;
}

export function NgoPickupsScreen({
  onNavigate,
  currentUser = DEMO_NGO,
  offers,
  onSchedulePickup,
  onCompletePickup,
  onRefresh,
}: NgoPickupsScreenProps) {
  const [selectedOffer, setSelectedOffer] = useState<FoodRecoveryOffer | null>(null);
  const [scheduleModalOffer, setScheduleModalOffer] = useState<FoodRecoveryOffer | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('Today, 15:45 PM IST');
  const [vehicleType, setVehicleType] = useState('Insulated Van (AP-09-XX-4421)');
  const [driverContact, setDriverContact] = useState('Raju (Driver) • +91 98491 88321');
  const [notes, setNotes] = useState('Stainless steel thermal insulated crates ready.');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const activePickups = offers.filter(
    (o) => o.status === 'ACCEPTED' || o.status === 'PICKUP_SCHEDULED' || o.status === 'PICKED_UP'
  );
  const completedPickups = offers.filter((o) => o.status === 'COMPLETED');

  const ngoCoords = currentUser.coordinates || DEMO_NGO.coordinates;

  const handleConfirmSchedule = async () => {
    if (!scheduleModalOffer) return;
    setLoading(true);
    setMsg(null);
    try {
      await onSchedulePickup(scheduleModalOffer.id, {
        scheduledDateTime,
        vehicleType,
        driverContact,
        notes,
      });
      setMsg(`Pickup scheduled for ${scheduleModalOffer.id}!`);
      setScheduleModalOffer(null);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Scheduling failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCompletion = async (offerId: string) => {
    setLoading(true);
    setMsg(null);
    try {
      await onCompletePickup(offerId);
      setMsg(`Recovery run for ${offerId} marked completed!`);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Completion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded border border-[#FDE68A]">
            RECOVERY COORDINATION &amp; PICKUPS
          </span>
          <h1 className="text-2xl font-extrabold text-[#141618] mt-1">
            Pickup Manifests &amp; Dispatch Tracking
          </h1>
          <p className="text-xs text-[#585E68] mt-0.5">
            Coordinate collection windows with Deccan Grand Hotel service bays across Hyderabad.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="py-2 px-3 rounded-xl bg-white border border-[#E6E4DC] hover:bg-[#FAF9F5] text-xs font-bold text-[#141618] flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#585E68]" />
          <span>Refresh Tracking</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
          <button type="button" onClick={() => setMsg(null)} className="text-emerald-700 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* ACTIVE PICKUP MANIFESTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
            Active Pickups in Progress ({activePickups.length})
          </h2>
          <span className="text-[11px] text-[#737A87]">Updated across shared store</span>
        </div>

        {activePickups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-8 text-center">
            <Truck className="w-8 h-8 text-[#A0A7B5] mx-auto mb-2" />
            <p className="text-xs text-[#585E68]">
              No active pickups in progress. Accept an eligible offer from the Recovery Inbox to schedule collection.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('ngo_inbox')}
              className="mt-3 py-2 px-4 rounded-xl bg-[#92400E] text-white text-xs font-bold hover:bg-[#78350F] transition-all cursor-pointer"
            >
              Go to Recovery Inbox
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePickups.map((offer) => {
              const distance = formatStraightLineDistance(
                ngoCoords.lat,
                ngoCoords.lng,
                offer.hotelCoordinates.lat,
                offer.hotelCoordinates.lng
              );
              const isAccepted = offer.status === 'ACCEPTED';
              const isScheduled = offer.status === 'PICKUP_SCHEDULED';
              const isHandedOver = offer.status === 'PICKED_UP';

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
                        {offer.id}
                      </span>
                      <h3 className="text-sm font-bold text-[#141618] mt-1">{offer.foodItem}</h3>
                      <p className="text-xs text-[#585E68]">{offer.hotelName}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isHandedOver ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      isScheduled ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {offer.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF9F5] p-3 rounded-xl border border-[#E6E4DC]/60">
                    <div>
                      <span className="text-[10px] text-[#737A87] block font-semibold">Quantity</span>
                      <span className="font-bold text-[#141618]">{offer.quantity} {offer.unit}</span>
                      <span className="text-[10px] text-[#585E68] block">~{offer.servingsEquivalent} portions</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#737A87] block font-semibold">Location / Proximity</span>
                      <span className="font-bold text-[#141618] truncate block">{offer.hotelLocation}</span>
                      <span className="text-[10px] text-[#2E7D32] block font-semibold">{distance}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#E6E4DC]/60">
                      <span className="text-[10px] text-[#737A87] block font-semibold">Pickup Window / Schedule</span>
                      <span className="font-semibold text-[#141618]">
                        {offer.pickupDetails?.scheduledDateTime || 'Awaiting scheduling'}
                      </span>
                      {offer.pickupDetails?.driverContact && (
                        <span className="text-[10px] text-[#585E68] block">
                          Driver: {offer.pickupDetails.driverContact} ({offer.pickupDetails.vehicleType})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dock Handover Status */}
                  <div className="p-2.5 rounded-xl border text-xs flex items-center justify-between bg-gray-50 border-gray-200">
                    <span className="text-[#585E68]">Hotel Dock Handover:</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      offer.pickupDetails?.handoverConfirmedByHotel ? 'text-[#2E7D32]' : 'text-[#D97706]'
                    }`}>
                      {offer.pickupDetails?.handoverConfirmedByHotel ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over
                        </>
                      ) : (
                        'Awaiting Arrival at Dock'
                      )}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    {isAccepted && (
                      <button
                        type="button"
                        onClick={() => {
                          setScheduleModalOffer(offer);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Recovery Vehicle</span>
                      </button>
                    )}

                    {(isScheduled || isHandedOver) && (
                      <button
                        type="button"
                        onClick={() => handleConfirmCompletion(offer.id)}
                        disabled={loading}
                        className="w-full py-2 px-3 rounded-xl bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-75"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Receipt &amp; Complete Run</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COMPLETED PICKUPS SUMMARY */}
      {completedPickups.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-[#E6E4DC]">
          <h2 className="text-sm font-bold text-[#141618] uppercase tracking-wider">
            Completed Recovery Logs ({completedPickups.length})
          </h2>
          <div className="bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden">
            <div className="divide-y divide-[#E6E4DC]">
              {completedPickups.map((offer) => (
                <div key={offer.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1B4D36]">{offer.id}</span>
                      <span className="font-bold text-[#141618]">{offer.foodItem}</span>
                    </div>
                    <span className="text-[#585E68] text-[11px] block mt-0.5">
                      {offer.quantity} {offer.unit} (~{offer.servingsEquivalent} portions) from {offer.hotelName}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    COMPLETED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {scheduleModalOffer && (
        <Modal
          isOpen={Boolean(scheduleModalOffer)}
          onClose={() => setScheduleModalOffer(null)}
          title={`Schedule Pickup: ${scheduleModalOffer.id}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#585E68]">
              Coordinate pickup time and vehicle information with <strong>{scheduleModalOffer.hotelName}</strong> loading dock.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Estimated Pickup Time</label>
              <input
                type="text"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Vehicle Type / Plate</label>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Driver Name &amp; Phone</label>
              <input
                type="text"
                value={driverContact}
                onChange={(e) => setDriverContact(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#141618] mb-1">Handling / Equipment Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E6E4DC] bg-white text-xs"
              />
            </div>

            <div className="pt-3 border-t border-[#E6E4DC] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setScheduleModalOffer(null)}
                className="py-2 px-3 rounded-lg border border-[#E6E4DC] text-xs font-semibold text-[#585E68]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                disabled={loading}
                className="py-2 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold"
              >
                Confirm Pickup Schedule
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
