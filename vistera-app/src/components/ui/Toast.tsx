'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: 'success' | 'alert' | 'info';
}

export function Toast({
  show,
  onClose,
  title,
  message,
  type = 'success',
}: ToastProps) {
  if (!show) return null;

  const icon = {
    success: <CheckCircle2 className="w-4 h-4 text-[#1B4D36]" />,
    alert: <AlertCircle className="w-4 h-4 text-[#B85720]" />,
    info: <Info className="w-4 h-4 text-[#226399]" />,
  }[type];

  const border = {
    success: 'border-[#D0E7DA] bg-[#F2F8F4]',
    alert: 'border-[#F7DAC8] bg-[#FDF5EE]',
    info: 'border-[#CEE1F4] bg-[#F0F6FD]',
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-[0_8px_24px_rgba(20,22,24,0.08)] max-w-sm ${border}`}
      >
        <div className="shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 text-xs">
          <p className="font-semibold text-[#141618]">{title}</p>
          {message && <p className="text-[#585E68] mt-0.5">{message}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[#8A929E] hover:text-[#141618] shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
