'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}: ModalProps) {
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

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2.5 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#141618]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center">
        {/* Modal Dialog Card */}
        <div
          role="dialog"
          aria-modal="true"
          className={`relative w-full my-auto ${maxWidthClass} bg-white rounded-2xl border border-[#E6E4DC] shadow-[0_20px_50px_rgba(20,22,24,0.15)] p-4 sm:p-6 md:p-7 z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto`}
        >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F0EFEB]">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-[#141618]">
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
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  </div>
  );
}
