'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Map as LeafletMapInstance, Marker as LeafletMarkerInstance } from 'leaflet';
import { RecoveryOrganization } from '@/types/foodflow';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Info, 
  Clock, 
  Layers 
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface RecoveryLeafletMapProps {
  organizations: RecoveryOrganization[];
  selectedOrgId?: string;
  onSelectOrg: (org: RecoveryOrganization) => void;
  onSchedulePickup?: (org: RecoveryOrganization) => void;
  kitchenLat?: number;
  kitchenLng?: number;
  kitchenName?: string;
  className?: string;
}

export function RecoveryLeafletMap({
  organizations,
  selectedOrgId,
  onSelectOrg,
  onSchedulePickup,
  kitchenLat = 17.4447,
  kitchenLng = 78.3483,
  kitchenName = 'Deccan Grand Hotel — Central Dispatch',
  className = '',
}: RecoveryLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<Record<string, LeafletMarkerInstance>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const selectedOrg = useMemo(() => {
    return organizations.find((o) => o.id === selectedOrgId) || organizations[0];
  }, [organizations, selectedOrgId]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        // Leaflet icon path resolution
        const defaultIconProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown };
        delete defaultIconProto._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!isMounted) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [kitchenLat, kitchenLng],
          zoom: 12,
          zoomControl: false,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // OpenStreetMap free tile service
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors | FOODFLOW Hyderabad Rescue Grid',
          maxZoom: 18,
        }).addTo(map);

        tileLayer.on('tileerror', () => {
          if (isMounted) {
            console.warn('[FOODFLOW Leaflet] Tile loading notice: tiles may be cached or rate-limited.');
          }
        });

        // 1. Deccan Grand Hotel Origin Marker (Emerald Pin)
        const hotelIcon = L.divIcon({
          className: 'custom-hotel-marker',
          html: `
            <div style="
              background: #1B4D36;
              color: white;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #FFFFFF;
              box-shadow: 0 4px 14px rgba(27,77,54,0.45);
              cursor: pointer;
            ">
              <span style="font-size: 20px;">🏨</span>
            </div>
          `,
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        });

        const hotelMarker = L.marker([kitchenLat, kitchenLng], { icon: hotelIcon }).addTo(map);
        hotelMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; line-height: 1.4; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 10px; background: #EAF4EE; color: #1B4D36; font-weight: 700; padding: 2px 6px; border-radius: 4px;">DEMO DISPATCH ORIGIN</span>
            </div>
            <strong style="color: #141618; font-size: 14px;">${kitchenName}</strong>
            <p style="color: #585E68; margin: 4px 0 0; font-size: 12px;">Gachibowli / Financial District Corridor, Hyderabad</p>
            <p style="color: #8A929E; margin: 2px 0 0; font-size: 11px;">Surplus Staging: Loading Bay Dock 2B (Insulated Carriers)</p>
          </div>
        `);

        // 2. Organization Markers (Seeded Demo Partners across Hyderabad)
        const markers: Record<string, LeafletMarkerInstance> = {};

        organizations.forEach((org) => {
          const orgLat = org.lat ?? (kitchenLat + 0.01);
          const orgLng = org.lng ?? (kitchenLng + 0.01);
          const isSelected = org.id === selectedOrgId;

          const partnerIcon = L.divIcon({
            className: `custom-partner-marker-${org.id}`,
            html: `
              <div style="
                background: ${isSelected ? '#C6682F' : '#FFFFFF'};
                color: ${isSelected ? '#FFFFFF' : '#141618'};
                width: 34px;
                height: 34px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid ${isSelected ? '#FFFFFF' : '#1B4D36'};
                box-shadow: 0 3px 10px rgba(0,0,0,0.25);
                cursor: pointer;
                transition: transform 0.2s;
              ">
                <span style="font-size: 16px;">🤝</span>
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          });

          const marker = L.marker([orgLat, orgLng], { icon: partnerIcon }).addTo(map);

          const distanceText = formatStraightLineDistance(kitchenLat, kitchenLng, orgLat, orgLng);

          const popupContent = document.createElement('div');
          popupContent.style.fontFamily = 'inherit';
          popupContent.style.fontSize = '12px';
          popupContent.style.lineHeight = '1.4';
          popupContent.style.padding = '4px';

          popupContent.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 9px; background: #FCF1E9; color: #C6682F; font-weight: 700; padding: 2px 5px; border-radius: 4px;">SEEDED DEMO PARTNER</span>
              <span style="font-size: 11px; color: #585E68;">${distanceText}</span>
            </div>
            <strong style="color: #141618; font-size: 13px; display: block; margin-bottom: 2px;">${org.name}</strong>
            <p style="color: #585E68; margin: 0 0 4px; font-size: 11px;">${org.address}</p>
            <p style="color: #1B4D36; margin: 0 0 6px; font-size: 11px; font-weight: 600;">
              Capacity: ${org.currentAvailableCapacity} portions available | ETA: ~${org.etaMinutes} mins
            </p>
            <p style="color: #737A87; margin: 0 0 8px; font-size: 10px;">
              Accepts: ${org.acceptedFoodTypes.slice(0, 2).join(', ')}
            </p>
            <button id="btn-select-${org.id}" style="
              width: 100%;
              background: #1B4D36;
              color: white;
              border: none;
              padding: 6px 10px;
              border-radius: 6px;
              font-weight: 700;
              font-size: 11px;
              cursor: pointer;
            ">
              Select for Rescue Dispatch
            </button>
          `;

          marker.bindPopup(popupContent);

          marker.on('popupopen', () => {
            const btn = document.getElementById(`btn-select-${org.id}`);
            if (btn) {
              btn.onclick = () => {
                onSelectOrg(org);
                map.closePopup();
              };
            }
          });

          marker.on('click', () => {
            onSelectOrg(org);
          });

          markers[org.id] = marker;
        });

        markersRef.current = markers;
        mapInstanceRef.current = map;
        setIsLoaded(true);
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.warn('[FOODFLOW Leaflet] Map initialization notice:', error);
        setMapError(error.message);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [organizations, kitchenLat, kitchenLng, kitchenName, onSelectOrg, selectedOrgId]);

  // Center/Pan on selected organization
  useEffect(() => {
    if (mapInstanceRef.current && selectedOrgId) {
      const selected = organizations.find((o) => o.id === selectedOrgId);
      if (selected && selected.lat && selected.lng) {
        mapInstanceRef.current.flyTo([selected.lat, selected.lng], 13.5, {
          duration: 1.0,
        });
        const marker = markersRef.current[selectedOrgId];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [selectedOrgId, organizations]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* MANDATORY PROMINENT DEMO BANNER */}
      <div className="bg-[#FAF9F5] border border-[#E6E4DC] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF4EE] text-[#1B4D36] border border-[#D0E7DA] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#1B4D36]">
                Hyderabad Demo Recovery Network — Illustrative Data
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                Synthetic Seed Data
              </span>
            </div>
            <p className="text-[11px] text-[#737A87] mt-0.5">
              Powered by Leaflet & OpenStreetMap tiles. Distances are approximate Haversine straight-line coordinates, not live driving routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] font-medium text-[#585E68]">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1B4D36]" />
          <span>Deccan Grand Hotel ({kitchenLat.toFixed(4)}, {kitchenLng.toFixed(4)})</span>
        </div>
      </div>

      {/* MAP VIEWPORT & INTERACTIVE CARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6E4DC] overflow-hidden shadow-xs relative min-h-[460px] flex flex-col">
          <div className="p-3.5 bg-[#FAF9F5] border-b border-[#E6E4DC] flex items-center justify-between text-xs text-[#585E68]">
            <div className="flex items-center gap-2 font-semibold">
              <Navigation className="w-3.5 h-3.5 text-[#1B4D36]" />
              <span>Hyderabad Locality GIS Grid (Gachibowli, Madhapur, Mehdipatnam, Ameerpet, Kukatpally, Secunderabad)</span>
            </div>
            <span className="text-[11px] text-[#737A87]">
              {organizations.length} Seeded Demo Partners
            </span>
          </div>

          <div className="relative flex-1 min-h-[420px]">
            <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />

            {!isLoaded && !mapError && (
              <div className="absolute inset-0 bg-[#FAF9F5] flex items-center justify-center z-20">
                <div className="flex items-center gap-2 text-xs text-[#585E68]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D36] animate-ping" />
                  Loading OpenStreetMap Tiles for Hyderabad...
                </div>
              </div>
            )}

            {mapError && (
              <div className="absolute inset-0 bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center z-20">
                <Info className="w-8 h-8 text-amber-600 mb-2" />
                <h4 className="text-sm font-bold text-[#141618]">Map Viewport Fallback</h4>
                <p className="text-xs text-[#585E68] max-w-md mt-1">
                  Leaflet map rendering initialized in offline fallback mode. All partner cards below remain fully synchronized and interactive.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Partner Detail Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedOrg ? (
            <div className="bg-white rounded-3xl border border-[#E6E4DC] p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0EFEB]">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FCF1E9] text-[#C6682F] text-[10px] font-bold">
                    {selectedOrg.verifiedBadgeText || 'Seeded Demo Partner'}
                  </span>
                  <h3 className="text-base font-extrabold text-[#141618] mt-1.5 leading-snug">
                    {selectedOrg.name}
                  </h3>
                  <span className="text-xs text-[#737A87] block mt-0.5">
                    {selectedOrg.organizationType}
                  </span>
                </div>
              </div>

              {/* Proximity & Intake Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
                  <span className="text-[10px] font-bold text-[#737A87] uppercase block">
                    Straight-Line Dist.
                  </span>
                  <span className="text-sm font-extrabold text-[#1B4D36] mt-0.5 block">
                    {formatStraightLineDistance(kitchenLat, kitchenLng, selectedOrg.lat, selectedOrg.lng)}
                  </span>
                  <span className="text-[10px] text-[#737A87] block mt-0.5">
                    Approx. ~{selectedOrg.etaMinutes} mins ETA
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E6E4DC]">
                  <span className="text-[10px] font-bold text-[#737A87] uppercase block">
                    Avail. Intake
                  </span>
                  <span className="text-sm font-extrabold text-[#141618] mt-0.5 block">
                    {selectedOrg.currentAvailableCapacity} portions
                  </span>
                  <span className="text-[10px] text-[#737A87] block mt-0.5">
                    Max: {selectedOrg.dailyIntakeCapacity} / day
                  </span>
                </div>
              </div>

              {/* Location & Food Match */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#1B4D36] shrink-0 mt-0.5" />
                  <span className="text-[#585E68]">{selectedOrg.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#1B4D36] shrink-0" />
                  <span className="text-[#585E68]">Operating Hours: {selectedOrg.openHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#1B4D36] shrink-0" />
                  <span className="text-[#585E68]">Contact: {selectedOrg.contactPerson} ({selectedOrg.phone})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0EFEB]">
                <span className="text-[11px] font-bold text-[#141618] block mb-1">
                  Accepted Food Profiles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOrg.acceptedFoodTypes.map((type, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#EAF4EE] text-[#1B4D36] text-[10px] font-semibold border border-[#D0E7DA]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {onSchedulePickup && (
                <button
                  type="button"
                  onClick={() => onSchedulePickup(selectedOrg)}
                  className="w-full py-3 bg-[#1B4D36] hover:bg-[#16402D] text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Initiate Simulated Demo Dispatch</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E6E4DC] p-6 text-center shadow-xs">
              <p className="text-xs text-[#737A87]">Select a partner from the map or list to view dispatch specifications.</p>
            </div>
          )}

          {/* Partner Quick-Select Mini List */}
          <div className="bg-white rounded-3xl border border-[#E6E4DC] p-4 shadow-xs">
            <span className="text-xs font-bold text-[#141618] block mb-2 px-1">
              All Seeded Demo Partners ({organizations.length})
            </span>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {organizations.map((org) => {
                const isSelected = org.id === selectedOrg?.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => onSelectOrg(org)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF4EE] border-[#1B4D36] text-[#1B4D36] font-bold'
                        : 'bg-[#FAF9F5] border-[#E6E4DC] hover:border-[#D0E7DA] text-[#141618]'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="truncate">{org.name}</div>
                      <div className="text-[10px] text-[#737A87] font-normal truncate">
                        {org.address.split(',')[1] || org.city}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono shrink-0 text-[#737A87]">
                      {formatStraightLineDistance(kitchenLat, kitchenLng, org.lat, org.lng)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
