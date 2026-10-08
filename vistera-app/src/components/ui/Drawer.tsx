'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: 'right' | 'bottom';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-[#141618]/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-10 z-10 transition-transform ${
          position === 'right' ? 'translate-x-0' : ''
        }`}
      >
        <div className="w-screen max-w-md bg-white border-l border-[#E6E4DC] shadow-[0_0_40px_rgba(20,22,24,0.12)] p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex items-start justify-between pb-4 border-b border-[#F0EFEB]">
            <div>
              <h3 className="text-base font-semibold text-[#141618]">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#6F7682] mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[#8A929E] hover:text-[#141618] hover:bg-[#F4F3ED] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
