import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, CheckCheck, AlertTriangle, Wrench, Info, ArrowRight } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setUserRole,
    setCurrentApartmentId,
    setActiveTab,
    t
  } = useApp();

  if (!isNotificationOpen) return null;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.linkTarget) {
      setUserRole(notif.linkTarget.role);
      if (notif.linkTarget.apartmentId) setCurrentApartmentId(notif.linkTarget.apartmentId);
      if (notif.linkTarget.tab) setActiveTab(notif.linkTarget.tab);
    }
    setIsNotificationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#DCD6CB] flex flex-col animate-fade-in">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E6E0D5] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2E5A44] text-white flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1C1E21]">{t.notifications.title}</h3>
                <p className="text-[11px] text-[#6B7280]">{t.notifications.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-semibold text-[#2E5A44] hover:underline flex items-center gap-1"
                title={t.notifications.markAllRead}
              >
                <CheckCheck className="w-3.5 h-3.5" /> {t.notifications.markAllRead}
              </button>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#1C1E21] rounded-md hover:bg-[#EFECE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6B7280]">
                {t.notifications.noNotifs}
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-[#FAF8F5] border-[#E6E0D5] opacity-80'
                      : 'bg-white border-[#2E5A44]/30 shadow-xs ring-1 ring-[#2E5A44]/10'
                  } hover:border-[#2E5A44] hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {notif.type === 'alert' && (
                        <div className="w-6 h-6 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {notif.type === 'ticket' && (
                        <div className="w-6 h-6 rounded-full bg-[#FFF8E1] text-[#B45309] flex items-center justify-center">
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {notif.type === 'worker' && (
                        <div className="w-6 h-6 rounded-full bg-[#E8EFEA] text-[#2E5A44] flex items-center justify-center">
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {notif.type === 'system' && (
                        <div className="w-6 h-6 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#1C1E21]">{notif.title}</h4>
                        <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{notif.message}</p>
                      
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="capitalize font-semibold text-[#2E5A44] flex items-center gap-1">
                          {t.notifications.viewDetails} <ArrowRight className="w-3 h-3" />
                        </span>
                        {!notif.isRead && (
                          <span className="inline-block w-2 h-2 rounded-full bg-[#2E5A44]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#FAF8F5] border-t border-[#E6E0D5] text-center text-xs text-[#8A8275]">
            {t.notifications.footer}
          </div>

        </div>
      </div>
    </div>
  );
};

