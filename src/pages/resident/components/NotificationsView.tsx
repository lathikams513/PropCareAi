import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Wrench,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, language, t } = useApp();
  const isTamil = language === 'ta';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E0D5] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
            <Bell className="w-3.5 h-3.5" />
            <span>{isTamil ? 'அறிவிப்புகள் & நிகழ்வுகள்' : 'Notification Stream'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
            {isTamil ? 'அறிவிப்பு பலகை' : 'Resident Notifications'}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {isTamil
              ? 'உங்கள் அலகின் சென்சார் அறிவிப்புகள், பணியாளர் வருகை மற்றும் பராமரிப்பு மாற்றங்கள்.'
              : 'Real-time activity log for your residence, work orders, and IoT telemetry alerts.'}
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-[#2E5A44] hover:text-[#1A3626] transition-colors self-start sm:self-auto cursor-pointer"
          >
            {isTamil ? 'அனைத்தையும் வாசித்ததாகக் குறி' : 'Mark all as read'}
          </button>
        )}
      </div>

      {/* Clean Notification List (NOT large boxes) */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] divide-y divide-[#EBE7DF] overflow-hidden shadow-xs">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#2E7D32] mx-auto" />
            <h4 className="text-sm font-bold text-[#1C1E21]">{isTamil ? 'அறிவிப்புகள் எதுவும் இல்லை' : 'No Unread Notifications'}</h4>
            <p className="text-xs">{isTamil ? 'அனைத்து புதிய அறிவிப்புகளும் இங்கே தோன்றும்.' : 'Your notification stream is completely up to date.'}</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = !notif.isRead;

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                  isUnread ? 'bg-[#FAF8F5]/80 hover:bg-[#F3EFEA]' : 'bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'alert'
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : notif.type === 'worker'
                    ? 'bg-[#E8F5E9] text-[#2E5A44]'
                    : 'bg-[#E0F2FE] text-[#0369A1]'
                }`}>
                  {notif.type === 'alert' && <AlertTriangle className="w-4 h-4" />}
                  {notif.type === 'worker' && <UserCheck className="w-4 h-4" />}
                  {notif.type === 'ticket' && <Wrench className="w-4 h-4" />}
                  {notif.type === 'system' && <Sparkles className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold ${isUnread ? 'text-[#1C1E21] font-black' : 'text-[#4B5563]'}`}>
                      {notif.title}
                    </h4>
                    <span className="font-mono text-[10px] text-[#8A8275] shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {/* Unread indicator */}
                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-[#2E5A44] shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
