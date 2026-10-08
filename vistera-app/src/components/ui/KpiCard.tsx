'use client';

import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  badge?: {
    text: string;
    variant?: 'green' | 'amber' | 'neutral' | 'red' | 'blue';
  };
  highlight?: boolean;
  accentColor?: 'green' | 'amber' | 'default';
  icon?: React.ReactNode;
}

export function KpiCard({
  label,
  value,
  unit,
  subtext,
  badge,
  highlight = false,
  accentColor = 'default',
  icon,
}: KpiCardProps) {
  const accentBorder = {
    default: 'hover:border-[#D4D1C6]',
    green: 'border-l-4 border-l-[#1B4D36] hover:border-[#C4DFC0]',
    amber: 'border-l-4 border-l-[#C6682F] hover:border-[#F6D5C0]',
  }[accentColor];

  const badgeStyles = {
    green: 'bg-[#EBF5EF] text-[#1B4D36] border-[#D0E7DA]',
    amber: 'bg-[#FCF2EB] text-[#B85720] border-[#F7DAC8]',
    neutral: 'bg-[#F2F1EC] text-[#585E68] border-[#E2E0D8]',
    red: 'bg-[#FDF0ED] text-[#B92B27] border-[#F6D0C9]',
    blue: 'bg-[#EDF4FB] text-[#226399] border-[#CEE1F4]',
  }[badge?.variant || 'neutral'];

  return (
    <div
      className={`group relative bg-white rounded-xl p-5 border border-[#E6E4DC] shadow-[0_2px_12px_rgba(20,22,24,0.02)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(20,22,24,0.06)] hover:-translate-y-0.5 ${accentBorder} ${
        highlight ? 'bg-[#FCFAF7]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#737A87]">
          {label}
        </span>
        {icon && (
          <div className="text-[#8A929E] group-hover:text-[#141618] transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#141618]">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[#737A87]">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F2F0E8]/70">
        {subtext ? (
          <span className="text-xs text-[#6F7682] truncate">
            {subtext}
          </span>
        ) : <span />}

        {badge && (
          <span
            className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeStyles}`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
