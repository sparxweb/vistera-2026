'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RecoveryOrganization } from '@/types/foodflow';
import { 
  MapPin, 
  Navigation, 
  AlertCircle,
  ShieldCheck,
  Truck
} from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RecoveryMapboxProps {
  organizations: RecoveryOrganization[];
  selectedOrgId?: string;
  onSelectOrg: (org: RecoveryOrganization) => void;
  onSchedulePickup?: (org: RecoveryOrganization) => void;
  kitchenLat?: number;
  kitchenLng?: number;
  kitchenName?: string;
}

export function RecoveryMapbox({
  organizations,
  selectedOrgId,
  onSelectOrg,
  onSchedulePickup,
  kitchenLat = 17.4447,
  kitchenLng = 78.3483,
  kitchenName = 'College Hostel Dining Hall (Hyderabad)',
}: RecoveryMapboxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';


  useEffect(() => {
    let isMounted = true;

    async function initializeMap() {
      if (!mapContainer.current) return;

      // If token is missing, activate graceful fallback without crashing
      if (!token) {
        if (isMounted) {
          setMapError('Mapbox access token not configured in NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN. Displaying interactive GIS card view.');
        }
        return;
      }

      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapboxgl as any).accessToken = token;

        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [kitchenLng, kitchenLat],
          zoom: 12,
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('load', () => {
          if (!isMounted) return;

          // 1. Kitchen Marker (Emerald Origin Pin)

          const kitchenEl = document.createElement('div');
          kitchenEl.className = 'w-9 h-9 rounded-full bg-[#0E382B] border-2 border-white shadow-lg flex items-center justify-center text-white cursor-pointer';
          kitchenEl.innerHTML = '🍳';
          kitchenEl.title = kitchenName;

          new mapboxgl.Marker(kitchenEl)
            .setLngLat([kitchenLng, kitchenLat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div style="font-family:sans-serif;padding:4px">
                  <strong style="color:#0E382B;font-size:12px;">${kitchenName}</strong>
                  <div style="font-size:11px;color:#5C6658;">Central Kitchen Dispatch Origin</div>
                </div>`
              )
            )
            .addTo(map);

          // 2. Recovery Partner Markers
          organizations.forEach((org) => {
            const orgEl = document.createElement('div');
            orgEl.className = 'w-8 h-8 rounded-full bg-[#10B981] border-2 border-white shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform';
            orgEl.innerHTML = '🤝';
            orgEl.title = `${org.name} (${org.distanceKm} km)`;

            orgEl.addEventListener('click', () => {
              onSelectOrg(org);
            });

            new mapboxgl.Marker(orgEl)
              .setLngLat([org.lng ?? org.longitude ?? 78.3483, org.lat ?? org.latitude ?? 17.4447])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                  `<div style="font-family:sans-serif;padding:6px;max-width:200px">
                    <strong style="color:#0E382B;font-size:12px;">${org.name}</strong>
                    <div style="font-size:11px;color:#5C6658;margin-top:2px;">${org.distanceKm} km away • ${org.foodCategoryNeeded}</div>
                    <div style="font-size:10px;color:#10B981;font-weight:bold;margin-top:4px;">Capacity: ${org.currentAvailableCapacity} meals</div>
                  </div>`
                )
              )
              .addTo(map);
          });
        });

        map.on('error', () => {
          if (isMounted) {
            setMapError('Mapbox tiles temporarily unreachable. Displaying fallback partner layout.');
          }
        });

        mapInstance.current = map;
      } catch {
        if (isMounted) {
          setMapError('Interactive WebGL map unavailable. Displaying interactive GIS card directory.');
        }
      }
    }

    initializeMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [token, kitchenLat, kitchenLng, kitchenName, organizations, onSelectOrg]);

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];

  return (
    <div className="space-y-6">
      {/* MAP VIEW CONTAINER */}
      <div className="relative w-full h-[400px] sm:h-[460px] rounded-3xl overflow-hidden border border-[#E5E5DE] shadow-sm bg-[#F4F4EE]">
        {/* Real Mapbox Canvas Container */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Fallback Overlay if token missing or GL error */}
        {mapError && (
          <div className="absolute inset-0 bg-[#F4F4EE]/95 backdrop-blur-sm p-6 flex flex-col justify-between z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#0E382B]" />
                <span className="text-xs font-mono font-bold text-[#0E382B] uppercase">
                  HYDERABAD RECOVERY CORRIDOR • GIS VIEW
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                Fallback Active (Token Pending)
              </span>
            </div>

            {/* Stylized Grid for Hyderabad Pins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-auto">
              {organizations.map((org) => {
                const isSelected = org.id === selectedOrg?.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => onSelectOrg(org)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-white border-[#0E382B] shadow-md ring-1 ring-[#0E382B]'
                        : 'bg-white/80 border-[#E5E5DE] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#E8EFEA] px-2 py-0.5 rounded">
                        {org.distanceKm} km away
                      </span>
                      <span className="text-[10px] font-bold text-[#D97706]">
                        {org.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#0E382B] line-clamp-1">
                      {org.name}
                    </div>
                    <div className="text-[11px] text-[#5C6658] mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#7D8878] shrink-0" />
                      <span className="truncate">{org.address}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#E5E5DE] flex items-center justify-between text-[10px]">
                      <span className="text-[#7D8878]">Capacity:</span>
                      <strong className="text-[#0E382B]">{org.currentAvailableCapacity} meals</strong>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-[#7D8878] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" />
              <span>To enable satellite tiles, configure <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>. Distances calculated via Haversine geodesic formula.</span>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#E5E5DE] shadow-sm text-xs z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E382B]" />
            <span className="font-semibold text-[#0E382B]">Hostel Dining Hall (Origin)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="text-[#5C6658]">Seeded Demo Partners ({organizations.length})</span>
          </div>
        </div>
      </div>

      {/* SELECTED ORGANIZATION DISPATCH DRAWER */}
      {selectedOrg && (
        <div className="bg-white rounded-3xl border border-[#E5E5DE] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5DE]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] bg-[#E8EFEA] px-2.5 py-0.5 rounded border border-[#C5DACD]">
                  {selectedOrg.sourceType}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                  STATUS: {selectedOrg.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0E382B] mt-1.5">
                {selectedOrg.name}
              </h2>
              <p className="text-xs text-[#5C6658] mt-0.5">
                {selectedOrg.organizationType} • {selectedOrg.address}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#7D8878] uppercase font-bold block">
                Geodesic Proximity
              </span>
              <div className="text-3xl font-extrabold text-[#0E382B]">
                {selectedOrg.distanceKm} km
              </div>
              <span className="text-xs text-[#5C6658]">
                ~{selectedOrg.etaMinutes} mins transport window
              </span>
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
              <span className="text-[10px] uppercase font-bold text-[#7D8878] block mb-1">
                Current Intake Capacity
              </span>
              <div className="font-bold text-[#0E382B] text-base">
                {selectedOrg.currentAvailableCapacity} meals
              </div>
              <span className="text-[11px] text-[#5C6658] mt-0.5 block">
                Daily max: {selectedOrg.dailyIntakeCapacity} meals
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
              <span className="text-[10px] uppercase font-bold text-[#7D8878] block mb-1">
                Food Category Need
              </span>
              <div className="font-bold text-[#0E382B] text-base">
                {selectedOrg.foodCategoryNeeded}
              </div>
              <span className="text-[11px] text-[#5C6658] mt-0.5 block">
                Accepts insulated bulk pans
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FBFBF9] border border-[#E5E5DE]">
              <span className="text-[10px] uppercase font-bold text-[#7D8878] block mb-1">
                Coordinator Contact
              </span>
              <div className="font-bold text-[#0E382B] text-base">
                {selectedOrg.contactPerson}
              </div>
              <span className="text-[11px] text-[#5C6658] mt-0.5 block font-mono">
                {selectedOrg.phone}
              </span>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5C6658] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Complies with FSSAI safe temperature handoff guidelines (≥63°C hot-held).</span>
            </div>

            <button
              type="button"
              onClick={() => onSchedulePickup && onSchedulePickup(selectedOrg)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0E382B] hover:bg-[#164E3D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Schedule Surplus Pickup</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
