'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Map as LeafletMapInstance, Marker as LeafletMarkerInstance } from 'leaflet';
import { RecoveryOrganization } from '@/types/foodflow';

interface LeafletMapProps {
  organizations: RecoveryOrganization[];
  selectedOrgId?: string;
  onSelectOrg: (org: RecoveryOrganization) => void;
  onError?: (err: Error) => void;
  className?: string;
}

export function LeafletMap({
  organizations,
  selectedOrgId,
  onSelectOrg,
  onError,
  className = '',
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<Record<string, LeafletMarkerInstance>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Central Kitchen reference coordinates
  const kitchenCoords: [number, number] = useMemo(() => [28.5355, 77.3910], []);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        // Fix leaflet default icon path issues in webpack/turbopack
        const defaultIconProto = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown };
        delete defaultIconProto._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!isMounted) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: kitchenCoords,
          zoom: 14,
          zoomControl: false,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // OpenStreetMap raster tiles
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors | FOODFLOW Dispatch Hub',
          maxZoom: 19,
        }).addTo(map);

        tileLayer.on('tileerror', (e) => {
          console.warn('[FOODFLOW Map] Tile load error, continuing with fallback:', e);
        });

        // 1. Central Kitchen Hub Marker (Emerald Green Pin)
        const kitchenIcon = L.divIcon({
          className: 'custom-kitchen-marker',
          html: `
            <div style="
              background: #1B4D36;
              color: white;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #FFFFFF;
              box-shadow: 0 4px 14px rgba(27,77,54,0.4);
              cursor: pointer;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const kitchenMarker = L.marker(kitchenCoords, { icon: kitchenIcon }).addTo(map);
        kitchenMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; line-height: 1.4; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 10px; background: #EAF4EE; color: #1B4D36; font-weight: 700; padding: 2px 6px; border-radius: 4px;">CENTRAL HUB</span>
              <span style="font-size: 11px; color: #585E68;">Active Kitchen</span>
            </div>
            <strong style="color: #141618; font-size: 14px;">FOODFLOW Central Kitchen</strong>
            <p style="color: #585E68; margin: 4px 0 0; font-size: 12px;">Metropolitan Campus — Building C, Level 1</p>
            <p style="color: #8A929E; margin: 2px 0 0; font-size: 11px;">Surplus Dispatch Point: Loading Bay Dock 2B</p>
          </div>
        `);

        // 2. Organization Markers
        const markers: Record<string, LeafletMarkerInstance> = {};

        organizations.forEach((org) => {
          const orgLat = org.lat || 28.5355 + (org.distanceKm * 0.007);
          const orgLng = org.lng || 77.3910 + (org.distanceKm * 0.006);

          const isSelected = org.id === selectedOrgId;

          const orgIcon = L.divIcon({
            className: `custom-org-marker-${org.id}`,
            html: `
              <div style="
                background: ${isSelected ? '#C6682F' : '#FFFFFF'};
                color: ${isSelected ? '#FFFFFF' : '#141618'};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid ${isSelected ? '#FFFFFF' : '#C6682F'};
                box-shadow: 0 3px 10px rgba(198,104,47,0.3);
                cursor: pointer;
                transition: transform 0.2s;
              ">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                  <path d="M9 9h1"/>
                  <path d="M9 13h1"/>
                  <path d="M9 17h1"/>
                </svg>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([orgLat, orgLng], { icon: orgIcon }).addTo(map);

          // Popup container
          const popupContent = document.createElement('div');
          popupContent.style.fontFamily = 'inherit';
          popupContent.style.fontSize = '12px';
          popupContent.style.lineHeight = '1.4';
          popupContent.style.padding = '4px';

          popupContent.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 9px; background: #FCF1E9; color: #C6682F; font-weight: 700; padding: 2px 5px; border-radius: 4px;">DEMO PARTNER</span>
              <span style="font-size: 11px; color: #585E68;">${org.distanceKm} km (${org.etaMinutes}m ETA)</span>
            </div>
            <strong style="color: #141618; font-size: 13px; display: block; margin-bottom: 2px;">${org.name}</strong>
            <p style="color: #585E68; margin: 0 0 6px; font-size: 11px;">Capacity: <strong>${org.dailyIntakeCapacity} meals/day</strong> | Available: <strong>${org.currentAvailableCapacity}</strong></p>
            <p style="color: #8A929E; margin: 0 0 8px; font-size: 11px;">Accepts: ${org.acceptedFoodTypes.slice(0, 2).join(', ')}</p>
            <button id="btn-select-${org.id}" style="
              width: 100%;
              background: #1B4D36;
              color: white;
              border: none;
              padding: 6px 10px;
              border-radius: 6px;
              font-weight: 600;
              font-size: 11px;
              cursor: pointer;
            ">
              Select for Surplus Dispatch
            </button>
          `;

          // Event listener on popup button
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
        console.warn('[FOODFLOW Map] Leaflet init error:', error);
        if (onError) onError(error);
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
  }, [organizations, kitchenCoords, onError, onSelectOrg, selectedOrgId]);

  // Pan to selected org
  useEffect(() => {
    if (mapInstanceRef.current && selectedOrgId) {
      const selectedOrg = organizations.find((o) => o.id === selectedOrgId);
      if (selectedOrg && selectedOrg.lat && selectedOrg.lng) {
        mapInstanceRef.current.flyTo([selectedOrg.lat, selectedOrg.lng], 15, {
          duration: 1.2,
        });
        const marker = markersRef.current[selectedOrgId];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [selectedOrgId, organizations]);

  return (
    <div className={`relative w-full h-full min-h-[380px] ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-10" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#FAF8F3] flex items-center justify-center z-20">
          <div className="flex items-center gap-2 text-xs text-[#585E68]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D36] animate-ping" />
            Loading Live Street Map Tiles...
          </div>
        </div>
      )}
    </div>
  );
}
