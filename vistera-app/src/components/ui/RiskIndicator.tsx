'use client';

import React from 'react';
import { RiskLevel } from '@/types/foodflow';

interface RiskIndicatorProps {
  level: RiskLevel;
  showBars?: boolean;
  className?: string;
}

export function RiskIndicator({ level, showBars = true, className = '' }: RiskIndicatorProps) {
  const config = {
    LOW: {
      color: 'text-[#1B4D36]',
      bg: 'bg-[#EBF5EF]',
      border: 'border-[#D0E7DA]',
      barActive: 1,
      label: 'Low Risk',
      barColor: 'bg-[#226846]',
    },
    MEDIUM: {
      color: 'text-[#B85720]',
      bg: 'bg-[#FCF2EB]',
      border: 'border-[#F7DAC8]',
      barActive: 2,
      label: 'Medium Risk',
      barColor: 'bg-[#C86A34]',
    },
    HIGH: {
      color: 'text-[#B92B27]',
      bg: 'bg-[#FDF0ED]',
      border: 'border-[#F6D0C9]',
      barActive: 3,
      label: 'High Risk',
      barColor: 'bg-[#D32F2F]',
    },
  }[level];

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${className}`}>
      {showBars && (
        <div className="flex items-center gap-0.5" aria-hidden="true">
          <span className={`w-1 h-2 rounded-full ${config.barActive >= 1 ? config.barColor : 'bg-black/10'}`} />
          <span className={`w-1 h-3 rounded-full ${config.barActive >= 2 ? config.barColor : 'bg-black/10'}`} />
          <span className={`w-1 h-4 rounded-full ${config.barActive >= 3 ? config.barColor : 'bg-black/10'}`} />
        </div>
      )}
      <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
        {level}
      </span>
    </div>
  );
}
