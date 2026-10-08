'use client';

import React from 'react';

export interface StatusBadgeProps {
  label: string;
  variant?: 'green' | 'amber' | 'neutral' | 'red' | 'blue';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = true,
  className = '',
}: StatusBadgeProps) {
  const styles = {
    green: 'bg-[#EBF5EF] text-[#1B4D36] border-[#D0E7DA]',
    amber: 'bg-[#FCF2EB] text-[#B85720] border-[#F7DAC8]',
    neutral: 'bg-[#F2F1EC] text-[#4A4E57] border-[#E2E0D8]',
    red: 'bg-[#FDF0ED] text-[#B92B27] border-[#F6D0C9]',
    blue: 'bg-[#EDF4FB] text-[#226399] border-[#CEE1F4]',
  }[variant];

  const dotColors = {
    green: 'bg-[#226846]',
    amber: 'bg-[#C86A34]',
    neutral: 'bg-[#6C727E]',
    red: 'bg-[#D32F2F]',
    blue: 'bg-[#2B78B8]',
  }[variant];

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${styles} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {label}
    </span>
  );
}
