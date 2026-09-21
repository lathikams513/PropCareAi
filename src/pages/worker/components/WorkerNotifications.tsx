import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { WorkerNavTab } from './WorkerSidebar';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Wrench, 
  UserCheck, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

interface WorkerNotificationsProps {
  onNavigate: (tab: WorkerNavTab, ticketId?: string) => void;
}

export const WorkerNotifications: React.FC<WorkerNotificationsProps> = ({ onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, t } = useApp();

  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const workerNotifs = notifications.filter(
    (n) => n.targetRole === 'worker' || n.targetRole === 'all'
  );

  const filteredNotifs = filterUnreadOnly
    ? workerNotifs.filter((n) => !n.isRead)
    : workerNotifs;

  const getNotifIcon = (title: string, type: string) => {
    const tLower = title.toLowerCase();
    if (tLower.includes('assigned') || tLower.includes('maintenance')) {
      return <Wrench className="w-4 h-4 text-[#2E5A44]" />;
    }
    if (tLower.includes('resident confirmed') || tLower.includes('confirmed')) {
      return <UserCheck className="w-4 h-4 text-[#2E7D32]" />;
    }
    if (tLower.includes('admin') || tLower.includes('approved')) {
      return <ShieldCheck className="w-4 h-4 text-[#0284C7]" />;
    }
    if (tLower.includes('location') || tLower.includes('updated')) {
      return <MapPin className="w-4 h-4 text-[#7C5A3E]" />;
    }
    if (tLower.includes('verification') || tLower.includes('sign-off')) {
      return <Sparkles className="w-4 h-4 text-[#D97706]" />;
    }
    return <Bell className="w-4 h-4 text-[#6B7280]" />;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A44]/15 flex items-center justify-center text-[#2E5A44]">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1C1E21]">{t.worker.notificationsTitle}</h1>
          </div>
          <p className="text-xs text-[#6B7280]">{t.worker.notificationsSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              filterUnreadOnly
                ? 'bg-[#E8EFEA] text-[#2E5A44] border-[#7E9E8B]/40'
                : 'bg-[#FAF8F5] text-[#4B5563] border-[#DCD6CB] hover:text-[#1C1E21]'
            }`}
          >
            {filterUnreadOnly ? 'Showing Unread Only' : 'Show Unread Only'}
          </button>
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF8F5] hover:bg-white text-[#1C1E21] rounded-xl border border-[#DCD6CB] text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <CheckCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>{t.worker.btnMarkAllRead}</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.linkTarget?.ticketId) {
                  onNavigate('active-job', notif.linkTarget.ticketId);
                }
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-white border-[#E6E0D5] text-[#6B7280] hover:border-[#DCD6CB]'
                  : 'bg-[#FAF8F5] border-[#2E5A44]/40 text-[#1C1E21] shadow-xs hover:border-[#2E5A44]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-2xl border mt-0.5 ${
                  notif.isRead 
                    ? 'bg-[#FAF8F5] border-[#E6E0D5]' 
                    : 'bg-white border-[#2E5A44]/20 shadow-xs'
                }`}>
                  {getNotifIcon(notif.title, notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm ${notif.isRead ? 'text-[#4B5563]' : 'text-[#1C1E21]'}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] max-w-xl leading-relaxed">{notif.message}</p>
                  <span className="inline-block text-[10px] text-[#8A8275] font-mono">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {notif.linkTarget?.ticketId && (
                <div className="flex items-center gap-1 text-xs font-bold text-[#2E5A44] whitespace-nowrap pt-1 hover:underline">
                  <span>View Job</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E6E0D5] rounded-3xl p-12 text-center text-[#6B7280] shadow-sm">
            <Bell className="w-10 h-10 text-[#8A8275] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1C1E21] mb-1">{t.worker.noNotifications}</h3>
            <p className="text-xs max-w-sm mx-auto">You're all caught up with your operational notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};
