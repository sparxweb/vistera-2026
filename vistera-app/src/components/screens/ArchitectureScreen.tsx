'use client';

import React from 'react';
import { 
  Cpu, 
  Database, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  Server, 
  MapPin, 
  ArrowRight, 
  FileCode2,
  CheckCircle2,
  AlertOctagon,
  Scale
} from 'lucide-react';
import { ArchitectureDiagram } from '@/components/ui/ArchitectureDiagram';

export function ArchitectureScreen() {
  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded border border-[#D0E7DA]">
              JUDGE & EVALUATOR DOSSIER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141618]">
            AI & System Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[#585E68] mt-0.5">
            Technical blueprint explaining our strict mathematical separation, security model, and integration hooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#1B4D36] bg-[#EAF4EE] px-3 py-1 rounded-full border border-[#D0E7DA] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Fake AI Claims Standard
          </span>
        </div>
      </div>

      {/* Primary Visual Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Backend Integration Points Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#141618]">
          Production Integration Points & Server Topology
        </h3>
        <p className="text-xs text-[#6F7682]">
          Where each production component connects to the Next.js App Router and external infrastructure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Forecasting Engine */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EAF4EE] text-[#1B4D36] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#141618]">
                  1. Forecasting Engine (Numerical ML)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#1B4D36] bg-[#EAF4EE] px-2 py-0.5 rounded">
                DETERMINISTIC
              </span>
            </div>
            <p className="text-xs text-[#525866] leading-relaxed">
              <strong>Location:</strong> <code className="bg-[#FAF9F5] px-1 py-0.5 rounded text-[11px] font-mono">/src/lib/forecasting/engine.ts</code> or microservice container. Runs ridge regression and Holt-Winters seasonal smoothing on 60-day shift logs to output exact integer serving numbers (e.g., 742 servings).
            </p>
            <div className="text-[11px] text-[#737A87] bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EAE8E0] font-mono">
              OUTPUT: &#123; predictedDemand: 742, buffer: 18, risk: &quot;MEDIUM&quot; &#125;
            </div>
          </div>

          {/* Card 2: Gemini LLM Engine */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F8F4FF] text-[#6D28D9] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#141618]">
                  2. Gemini API (Natural-Language Synthesis)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#6D28D9] bg-[#F8F4FF] px-2 py-0.5 rounded">
                SERVER-SIDE ONLY
              </span>
            </div>
            <p className="text-xs text-[#525866] leading-relaxed">
              <strong>Location:</strong> <code className="bg-[#FAF9F5] px-1 py-0.5 rounded text-[11px] font-mono">/src/app/api/ai/route.ts</code> via <code className="bg-[#FAF9F5] px-1 py-0.5 rounded text-[11px] font-mono">@google/genai</code>. Takes deterministic numbers + context as prompt input to synthesize human-readable operational reasoning and batch staging advice.
            </p>
            <div className="text-[11px] text-[#737A87] bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EAE8E0] font-mono">
              ENV: GEMINI_API_KEY (Never sent to client browser)
            </div>
          </div>

          {/* Card 3: Supabase Database */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0E6] text-[#B85720] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#141618]">
                  3. Supabase / PostgreSQL Database
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#B85720] bg-[#FAF0E6] px-2 py-0.5 rounded">
                POSTGRESQL + RLS
              </span>
            </div>
            <p className="text-xs text-[#525866] leading-relaxed">
              <strong>Location:</strong> <code className="bg-[#FAF9F5] px-1 py-0.5 rounded text-[11px] font-mono">/src/lib/supabase.ts</code>. Stores tables: <code className="text-[10px] font-mono">forecasts</code>, <code className="text-[10px] font-mono">actual_consumption</code>, <code className="text-[10px] font-mono">surplus_listings</code>, and <code className="text-[10px] font-mono">recovery_organizations</code> with Row Level Security.
            </p>
            <div className="text-[11px] text-[#737A87] bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EAE8E0] font-mono">
              ENV: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
            </div>
          </div>

          {/* Card 4: Map Service */}
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-5 shadow-[0_2px_12px_rgba(20,22,24,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] text-[#141618] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#141618]">
                  4. Mapbox GL / Google Maps Integration
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#141618] bg-[#FAF9F5] px-2 py-0.5 rounded">
                GEO-DISPATCH
              </span>
            </div>
            <p className="text-xs text-[#525866] leading-relaxed">
              <strong>Location:</strong> <code className="bg-[#FAF9F5] px-1 py-0.5 rounded text-[11px] font-mono">/src/components/ui/MapPanel.tsx</code>. Designed to swap seamlessly from interactive SVG vector mode to Mapbox GL JS using standard GeoJSON features.
            </p>
            <div className="text-[11px] text-[#737A87] bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EAE8E0] font-mono">
              ENV: NEXT_PUBLIC_MAPBOX_TOKEN / GOOGLE_MAPS_KEY
            </div>
          </div>
        </div>
      </div>

      {/* Security Architecture & Environmental Variable Isolation */}
      <div className="bg-[#FAF9F5] rounded-2xl border border-[#E6E4DC] p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#141618]">
          <Lock className="w-4 h-4 text-[#1B4D36]" />
          <span>Security Architecture & API Key Isolation Standard</span>
        </div>
        <p className="text-xs text-[#525866] leading-relaxed max-w-3xl">
          In strict accordance with the hackathon specification, all credentials (<code className="font-mono text-[11px]">GEMINI_API_KEY</code>, <code className="font-mono text-[11px]">SUPABASE_SERVICE_ROLE_KEY</code>) are quarantined on the Next.js server runtime. No raw LLM calls, private service keys, or unauthenticated writes are exposed in frontend client bundles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-white rounded-xl border border-[#E8E6DE]">
            <CheckCircle2 className="w-4 h-4 text-[#1B4D36] mb-1" />
            <strong className="text-[#141618] block">No Frontend Key Leaks</strong>
            <span className="text-[11px] text-[#6F7682]">Server routes act as reverse proxies with rate limiting</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E8E6DE]">
            <CheckCircle2 className="w-4 h-4 text-[#1B4D36] mb-1" />
            <strong className="text-[#141618] block">Bounded Temperature Prompts</strong>
            <span className="text-[11px] text-[#6F7682]">Gemini temperature fixed at 0.2 for reproducible reasoning</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E8E6DE]">
            <CheckCircle2 className="w-4 h-4 text-[#1B4D36] mb-1" />
            <strong className="text-[#141618] block">Structured JSON Schemas</strong>
            <span className="text-[11px] text-[#6F7682]">Strict response types enforce structured factor parsing</span>
          </div>
        </div>
      </div>

      {/* Foundational Product Principle */}
      <div className="p-6 rounded-2xl bg-white border border-[#E6E4DC] shadow-[0_2px_12px_rgba(20,22,24,0.02)] space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#1B4D36]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#141618]">
            Core Product Principle
          </h4>
        </div>
        <p className="text-sm font-semibold text-[#141618] italic leading-relaxed">
          &ldquo;FOODFLOW should never claim &lsquo;AI eliminates food waste.&rsquo; Instead, FOODFLOW helps kitchens reduce avoidable overproduction by making data-informed preparation decisions and providing a structured recovery workflow for eligible surplus.&rdquo;
        </p>
      </div>
    </div>
  );
}
