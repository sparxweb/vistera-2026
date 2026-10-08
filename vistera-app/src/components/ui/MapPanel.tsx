'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { RecoveryOrganization } from '@/types/foodflow';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, AlertCircle, Globe } from 'lucide-react';

const LeafletMap = dynamic(
  () => import('./LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false }
);

interface MapPanelProps {
  organizations: RecoveryOrganization[];
  selectedOrgId?: string;
  onSelectOrg: (org: RecoveryOrganization) => void;
  className?: string;
}

export function MapPanel({
  organizations,
  selectedOrgId,
  onSelectOrg,
  className = '',
}: MapPanelProps) {
  const [mapMode, setMapMode] = useState<'live' | 'editorial' | 'satellite-mock'>('live');
  const [showRadius, setShowRadius] = useState(true);
  const [mapError, setMapError] = useState(false);

  const selectedOrg =
    organizations.find((o) => o.id === selectedOrgId) || organizations[0];

  // SVG coordinate projection simulation for the 4 demo pins
  const kitchenCoords = { x: 280, y: 200 };

  const orgCoords: Record<string, { x: number; y: number }> = {
    'org-01': { x: 340, y: 150 },
    'org-02': { x: 220, y: 130 },
    'org-03': { x: 190, y: 290 },
    'org-04': { x: 420, y: 230 },
  };

  const handleMapError = () => {
    console.warn('[FOODFLOW Map] Live map failed to load, switching to graceful fallback.');
    setMapError(true);
    setMapMode('editorial');
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#E6E4DC] bg-[#FAF8F3] shadow-[0_2px_16px_rgba(20,22,24,0.03)] flex flex-col ${className}`}
    >
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E6E4DC] shadow-sm text-xs">
          <Compass className="w-3.5 h-3.5 text-[#1B4D36]" />
          <span className="font-semibold text-[#141618]">
            Metropolitan Logistics Grid
          </span>
          <span className="text-[10px] bg-[#EAF4EE] text-[#1B4D36] font-medium px-1.5 py-0.2 rounded">
            {mapMode === 'live' ? 'LIVE OSM TILES' : 'SPATIAL GRID'}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-[#E6E4DC] shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setMapMode('live')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
              mapMode === 'live' && !mapError
                ? 'bg-[#1B4D36] text-white'
                : 'text-[#6F7682] hover:text-[#141618]'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Live Street Map</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('editorial')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mapMode === 'editorial'
                ? 'bg-[#1B4D36] text-white'
                : 'text-[#6F7682] hover:text-[#141618]'
            }`}
          >
            Editorial Vector
          </button>
          <button
            type="button"
            onClick={() => setMapMode('satellite-mock')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mapMode === 'satellite-mock'
                ? 'bg-[#141618] text-white'
                : 'text-[#6F7682] hover:text-[#141618]'
            }`}
          >
            Cadastral Grid
          </button>
          <button
            type="button"
            onClick={() => setShowRadius(!showRadius)}
            className={`p-1 rounded text-[#6F7682] hover:text-[#141618] hover:bg-[#F2F0E8] transition-colors ${
              showRadius ? 'text-[#1B4D36]' : ''
            }`}
            title="Toggle Safe Temperature Transit Rings"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Fallback Alert Banner when Map is Unavailable */}
      {mapError && (
        <div className="bg-[#FFF8E6] border-b border-[#F5E0B3] px-4 py-2 z-10 flex items-center gap-2 text-xs text-[#925400]">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C6682F]" />
          <span>Map service unavailable — showing demo spatial view.</span>
        </div>
      )}

      {/* Map View Container */}
      <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden select-none bg-[#F7F5EE]">
        {mapMode === 'live' && !mapError ? (
          <div className="w-full h-full">
            <LeafletMap
              organizations={organizations}
              selectedOrgId={selectedOrgId}
              onSelectOrg={onSelectOrg}
              onError={handleMapError}
            />
          </div>
        ) : (
          <svg
            viewBox="0 0 560 380"
            className="w-full h-full object-cover"
            style={{
              filter: mapMode === 'satellite-mock' ? 'contrast(1.05) brightness(0.96)' : 'none',
            }}
          >
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#EAE7DD"
                  strokeWidth="0.75"
                />
              </pattern>

              <radialGradient id="kitchenGlow">
                <stop offset="0%" stopColor="#1B4D36" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1B4D36" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="#FBF9F5" />
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* River / Natural Corridor */}
            <path
              d="M 0 320 C 140 310, 200 360, 360 340 C 440 330, 500 360, 560 350 L 560 380 L 0 380 Z"
              fill="#E5ECF2"
              opacity="0.8"
            />

            {/* Road Network Lines */}
            <g stroke="#E0DDCF" strokeWidth="2.5" fill="none">
              <path d="M 0 110 Q 200 120 560 90" stroke="#DDD9CE" strokeWidth="3" />
              <path d="M 120 0 Q 150 190 180 380" stroke="#DDD9CE" strokeWidth="3" />
              <path d="M 380 0 Q 360 210 390 380" stroke="#DDD9CE" strokeWidth="3" />
              <path d="M 0 250 Q 280 230 560 270" stroke="#DDD9CE" strokeWidth="3.5" />
              <path d="M 60 70 L 480 310" strokeWidth="1.2" strokeDasharray="6 4" />
              <path d="M 480 50 L 100 330" strokeWidth="1.2" strokeDasharray="6 4" />
            </g>

            {/* Transit Buffer Radius Rings */}
            {showRadius && (
              <g fill="none">
                <circle
                  cx={kitchenCoords.x}
                  cy={kitchenCoords.y}
                  r="70"
                  stroke="#1B4D36"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.35"
                />
                <circle
                  cx={kitchenCoords.x}
                  cy={kitchenCoords.y}
                  r="130"
                  stroke="#C6682F"
                  strokeWidth="1"
                  strokeDasharray="6 6"
                  opacity="0.25"
                />
              </g>
            )}

            {/* Connecting Dispatch Vectors */}
            {organizations.map((org) => {
              const pos = orgCoords[org.id] || { x: 300, y: 220 };
              const isSelected = org.id === selectedOrgId;
              return (
                <line
                  key={`line-${org.id}`}
                  x1={kitchenCoords.x}
                  y1={kitchenCoords.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isSelected ? '#1B4D36' : '#C4C0B3'}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={isSelected ? 'none' : '3 3'}
                  opacity={isSelected ? 0.9 : 0.4}
                />
              );
            })}

            {/* Central Kitchen Node */}
            <circle
              cx={kitchenCoords.x}
              cy={kitchenCoords.y}
              r="28"
              fill="url(#kitchenGlow)"
            />
            <circle
              cx={kitchenCoords.x}
              cy={kitchenCoords.y}
              r="9"
              fill="#1B4D36"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="drop-shadow-sm"
            />
            <text
              x={kitchenCoords.x}
              y={kitchenCoords.y + 22}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#1B4D36"
              letterSpacing="0.05em"
            >
              CENTRAL KITCHEN HUB
            </text>

            {/* Recovery Organization Nodes */}
            {organizations.map((org) => {
              const pos = orgCoords[org.id] || { x: 300, y: 220 };
              const isSelected = org.id === selectedOrgId;

              return (
                <g
                  key={org.id}
                  onClick={() => onSelectOrg(org)}
                  className="cursor-pointer transition-transform hover:scale-105"
                  style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 10 : 7}
                    fill={isSelected ? '#C6682F' : '#FFFFFF'}
                    stroke={isSelected ? '#FFFFFF' : '#C6682F'}
                    strokeWidth="2.5"
                    className="drop-shadow-md"
                  />
                  <rect
                    x={pos.x - 55}
                    y={pos.y - 28}
                    width="110"
                    height="20"
                    rx="4"
                    fill={isSelected ? '#141618' : '#FFFFFF'}
                    stroke={isSelected ? '#141618' : '#E6E4DC'}
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="600"
                    fill={isSelected ? '#FFFFFF' : '#141618'}
                  >
                    {org.name.slice(0, 16)}..
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Bottom Floating Card: Selected Partner Snapshot */}
        {selectedOrg && (
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-[#E6E4DC] shadow-[0_8px_24px_rgba(20,22,24,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FCF2EB] text-[#B85720] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-bold text-[#141618]">
                    {selectedOrg.name}
                  </h5>
                  <span className="text-[10px] font-semibold text-[#1B4D36] bg-[#EAF4EE] px-1.5 py-0.2 rounded border border-[#D0E7DA] flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Demo Partner
                  </span>
                </div>
                <p className="text-[11px] text-[#6F7682] mt-0.5">
                  {selectedOrg.address} • {selectedOrg.distanceKm} km away (~{selectedOrg.etaMinutes} mins via courier)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-[#525866] bg-[#FAF9F5] px-2.5 py-1 rounded border border-[#E6E4DC]">
                Accepts: <strong className="text-[#141618]">{selectedOrg.acceptedFoodTypes[0]}</strong>
              </span>
              <button
                type="button"
                onClick={() => onSelectOrg(selectedOrg)}
                className="px-3 py-1.5 bg-[#1B4D36] hover:bg-[#143B2A] text-white text-xs font-medium rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Navigation className="w-3 h-3" />
                <span>Select for Transfer</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mapbox / OpenStreetMap Ready Integration Slot Banner */}
      <div className="bg-[#FAF9F5] px-4 py-2 border-t border-[#E6E4DC] flex items-center justify-between text-[11px] text-[#737A87]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1B4D36]" />
          <span>Interactive Vector Geo-Service • Leaflet OpenStreetMap Active</span>
        </div>
        <span className="font-mono text-[10px] text-[#8A929E]">
          LAT 28.5355 • LNG 77.3910 • DEMO LOGISTICS ZONE
        </span>
      </div>
    </div>
  );
}
