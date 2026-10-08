'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  UtensilsCrossed, 
  Activity, 
  AlertTriangle, 
  BrainCircuit, 
  Truck, 
  RotateCw 
} from 'lucide-react';

interface Stage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  systemOwner: string;
}

export const WORKFLOW_STAGES: Stage[] = [
  {
    number: '01',
    title: 'FORECAST',
    subtitle: 'Predict demand',
    description: 'Projects expected meal volumes using historical dining patterns, calendar context, and service signals.',
    icon: <TrendingUp className="w-4 h-4" />,
    systemOwner: 'Forecasting Engine',
  },
  {
    number: '02',
    title: 'PREPARE',
    subtitle: 'Cook smarter',
    description: 'Recommends staged batch cooking and safe buffer margins to prevent over-commitment of food.',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    systemOwner: 'Kitchen Operations',
  },
  {
    number: '03',
    title: 'MONITOR',
    subtitle: 'Track service',
    description: 'Tracks real-time diner headcount and tray depletion during active meal service.',
    icon: <Activity className="w-4 h-4" />,
    systemOwner: 'Service Logging',
  },
  {
    number: '04',
    title: 'DETECT',
    subtitle: 'Find surplus or shortage',
    description: 'Identifies mismatch immediately when service wraps before unserved surplus degrades.',
    icon: <AlertTriangle className="w-4 h-4" />,
    systemOwner: 'Variance Detection',
  },
  {
    number: '05',
    title: 'ANALYZE',
    subtitle: 'Understand why',
    description: 'Pinpoints likely contributing factors and offers actionable operational recommendations.',
    icon: <BrainCircuit className="w-4 h-4" />,
    systemOwner: 'AI Reasoning',
  },
  {
    number: '06',
    title: 'RECOVER',
    subtitle: 'Route eligible surplus',
    description: 'Dispatches unserved, food-safe meals directly to verified local recovery partners.',
    icon: <Truck className="w-4 h-4" />,
    systemOwner: 'Recovery Logistics',
  },
  {
    number: '07',
    title: 'LEARN',
    subtitle: 'Improve the next service',
    description: 'Feeds service outcomes back into the data store to refine future predictions.',
    icon: <RotateCw className="w-4 h-4" />,
    systemOwner: 'Feedback Loop',
  },
];

interface TimelineProps {
  className?: string;
  activeStage?: number;
  onSelectStage?: (index: number) => void;
}

export function Timeline({ className = '', activeStage: controlledStage, onSelectStage }: TimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIdx = hoveredIndex !== null ? hoveredIndex : (controlledStage ?? 0);

  return (
    <div className={`w-full ${className}`}>
      {/* Horizontal timeline cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isSelected = activeIdx === idx;

          return (
            <div
              key={stage.number}
              onMouseEnter={() => {
                setHoveredIndex(idx);
                if (onSelectStage) onSelectStage(idx);
              }}
              className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#1B4D36] shadow-[0_8px_20px_rgba(27,77,54,0.08)] -translate-y-1'
                  : 'bg-[#FAF9F5] border-[#E8E6DE] hover:border-[#D0CDBF] hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-xs font-mono font-bold tracking-wider ${
                      isSelected ? 'text-[#1B4D36]' : 'text-[#8A929E]'
                    }`}
                  >
                    {stage.number}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#EAF4EE] text-[#1B4D36]'
                        : 'bg-[#F0EFEB] text-[#737A87]'
                    }`}
                  >
                    {stage.icon}
                  </div>
                </div>

                <h4 className="text-xs font-bold tracking-tight text-[#141618]">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-[#6F7682] mt-0.5 line-clamp-1">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F0EFEB]">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#8A929E] block">
                  {stage.systemOwner}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Detail Panel */}
      <div className="mt-4 p-5 bg-white rounded-xl border border-[#E6E4DC] shadow-[0_2px_12px_rgba(20,22,24,0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4EE] text-[#1B4D36] flex items-center justify-center shrink-0">
            {WORKFLOW_STAGES[activeIdx].icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#1B4D36]">
                STAGE {WORKFLOW_STAGES[activeIdx].number}
              </span>
              <span className="text-sm font-bold text-[#141618]">
                {WORKFLOW_STAGES[activeIdx].title} — {WORKFLOW_STAGES[activeIdx].subtitle}
              </span>
            </div>
            <p className="text-xs text-[#525866] mt-1 max-w-2xl leading-relaxed">
              {WORKFLOW_STAGES[activeIdx].description}
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-[#FAF9F5] px-3 py-1.5 rounded-lg border border-[#E6E4DC] text-right">
          <span className="text-[10px] text-[#8A929E] block uppercase tracking-wider">
            System Component
          </span>
          <span className="text-xs font-semibold text-[#141618]">
            {WORKFLOW_STAGES[activeIdx].systemOwner}
          </span>
        </div>
      </div>
    </div>
  );
}
