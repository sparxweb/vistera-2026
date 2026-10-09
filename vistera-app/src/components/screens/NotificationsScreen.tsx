'use client';

import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  RotateCw,
  CheckCheck,
  ShieldCheck,
  Building2,
  HeartHandshake
} from 'lucide-react';
import { FoodRecoveryNotification, AuthUser, ScreenId } from '@/types/foodflow';

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  currentUser?: AuthUser;
  notifications: FoodRecoveryNotification[];
  onMarkAllRead?: () => void;
  onRefresh: () => void;
}

export function NotificationsScreen({
  onNavigate,
  currentUser,
  notifications,
  onMarkAllRead,
  onRefresh,
}: NotificationsScreenProps) {
  const role = currentUser?.role || 'HOTEL';
  const roleNotifs = notifications.filter((n) => n.targetRole === role || n.targetRole === 'ALL');
  const unreadCount = roleNotifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E4DC]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D36] bg-[#EAF4EE] px-2.5 py-0.5 rounded border border-[#D0E7DA]">
            IN-APP NOTIFICATIONS &amp; AUDIT TRAIL
          </span>
          <h1 className="text-2xl font-extrabold text-[#141618] mt-1">
            Activity Alerts &amp; Workflow Events
          </h1>
          <p className="text-xs text-[#585E68] mt-0.5">
            Real-time in-app delivery for surplus offers, safety reviews, partner acceptances, and pickups.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={onRefresh}
            className="py-2 px-3 rounded-xl bg-white border border-[#E6E4DC] hover:bg-[#FAF9F5] text-xs font-bold text-[#141618] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#585E68]" />
            <span>Refresh</span>
          </button>
          {unreadCount > 0 && onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="py-2 px-3 rounded-xl bg-[#141618] text-white hover:bg-[#2C3035] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* DISCLOSURE */}
      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E4DC] text-[11px] text-[#737A87] flex items-start gap-2">
        <Info className="w-4 h-4 text-[#737A87] shrink-0 mt-0.5" />
        <span>
          <strong>In-App Architecture Notice:</strong> These alerts are recorded in the shared data store on confirmed actions. No external SMS, WhatsApp, or third-party email services are claimed or invoked.
        </span>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {roleNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E4DC] p-12 text-center">
            <Bell className="w-10 h-10 text-[#A0A7B5] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#141618]">No notifications yet</h3>
            <p className="text-xs text-[#585E68] mt-1">
              Events will trigger here when offers are created, approved, accepted, or collected.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden divide-y divide-[#E6E4DC]">
            {roleNotifs.map((notif) => {
              const isSuccess = notif.type === 'SUCCESS';
              const isWarning = notif.type === 'WARNING';
              const isAlert = notif.type === 'ALERT';

              return (
                <div
                  key={notif.id}
                  className={`p-4 flex items-start gap-3.5 transition-colors ${
                    !notif.read ? 'bg-[#FAF9F5]/70' : 'bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isSuccess ? 'bg-[#EAF4EE] text-[#2E7D32]' :
                    isWarning ? 'bg-[#FEF3C7] text-[#D97706]' :
                    isAlert ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {isSuccess ? <CheckCircle2 className="w-4 h-4" /> :
                     isWarning || isAlert ? <AlertCircle className="w-4 h-4" /> :
                     <Info className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#141618]">{notif.title}</h4>
                        {notif.offerId && (
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-[#585E68]">
                            {notif.offerId}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#737A87] shrink-0">{notif.timestamp}</span>
                    </div>

                    <p className="text-xs text-[#585E68] leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
