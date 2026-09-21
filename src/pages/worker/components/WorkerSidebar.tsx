import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  History, 
  Bell, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export type WorkerNavTab = 
  | 'dashboard' 
  | 'my-tasks' 
  | 'active-job' 
  | 'pending-jobs' 
  | 'completed-jobs' 
  | 'work-history' 
  | 'notifications' 
  | 'profile';

interface WorkerSidebarProps {
  currentTab: WorkerNavTab;
  onSelectTab: (tab: WorkerNavTab) => void;
}

export const WorkerSidebar: React.FC<WorkerSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { workers, currentWorkerId, tickets, notifications, t, workerLogout, updateWorkerShiftStatus } = useApp();

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar',
    role: 'Plumber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    shiftStatus: 'available'
  };

  // Counts for badges
  const myTickets = tickets.filter((t) => t.workerId === currentWorker.id || t.workerName === currentWorker.name);
  const activeJob = myTickets.find((t) => ['worker_accepted', 'worker_en_route', 'work_in_progress'].includes(t.status)) || myTickets.find((t) => t.status === 'worker_assigned');
  const pendingJobsCount = myTickets.filter((t) => t.status === 'worker_assigned' || t.status === 'admin_confirmed').length;
  const completedJobsCount = myTickets.filter((t) => t.status === 'work_completed' || t.status === 'resident_verified').length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead && (n.targetRole === 'worker' || n.targetRole === 'all')).length;

  const navItems = [
    {
      id: 'dashboard' as WorkerNavTab,
      label: t.worker.navDashboard,
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'my-tasks' as WorkerNavTab,
      label: t.worker.navMyTasks,
      icon: ClipboardList,
      badge: myTickets.length > 0 ? myTickets.length : null
    },
    {
      id: 'active-job' as WorkerNavTab,
      label: t.worker.navActiveJob,
      icon: Wrench,
      badge: activeJob ? '1' : null,
      pulse: activeJob ? true : false
    },
    {
      id: 'pending-jobs' as WorkerNavTab,
      label: t.worker.navPendingJobs,
      icon: Clock,
      badge: pendingJobsCount > 0 ? pendingJobsCount : null
    },
    {
      id: 'completed-jobs' as WorkerNavTab,
      label: t.worker.navCompletedJobs,
      icon: CheckCircle2,
      badge: completedJobsCount > 0 ? completedJobsCount : null
    },
    {
      id: 'work-history' as WorkerNavTab,
      label: t.worker.navWorkHistory,
      icon: History,
      badge: null
    },
    {
      id: 'notifications' as WorkerNavTab,
      label: t.worker.navNotifications,
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null
    },
    {
      id: 'profile' as WorkerNavTab,
      label: t.worker.navProfile,
      icon: User,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E6E0D5] text-[#1C1E21] flex flex-col flex-shrink-0 select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#EBE7DF] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2E5A44] flex items-center justify-center text-white font-bold shadow-xs">
            <Wrench className="w-4 h-4 text-[#A3E3B8]" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-[#1C1E21] flex items-center gap-1.5">
              PropCare <span className="text-[#2E5A44] text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8EFEA] border border-[#2E5A44]/20">WORKER</span>
            </h2>
            <p className="text-[11px] text-[#6B7280]">Field Technician Portal</p>
          </div>
        </div>
      </div>

      {/* Worker Quick Status Card */}
      <div className="p-3.5 mx-3 my-3 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src={currentWorker.avatar} 
            alt={currentWorker.name} 
            className="w-10 h-10 rounded-xl object-cover border border-[#E6E0D5]"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs text-[#1C1E21] truncate">{currentWorker.name}</h3>
            <p className="text-[11px] text-[#2E5A44] font-semibold">{currentWorker.role}</p>
          </div>
        </div>

        {/* Live Status Switcher */}
        <div className="mt-3 pt-2.5 border-t border-[#EBE7DF] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4B5563]">
            <span className={`w-2 h-2 rounded-full ${
              currentWorker.shiftStatus === 'available' ? 'bg-[#2E7D32] animate-pulse' :
              currentWorker.shiftStatus === 'working' ? 'bg-[#D97706] animate-pulse' :
              currentWorker.shiftStatus === 'on_the_way' ? 'bg-[#0284C7] animate-pulse' : 'bg-[#9CA3AF]'
            }`} />
            <span className="capitalize">{currentWorker.shiftStatus || 'Available'}</span>
          </div>
          <select 
            value={currentWorker.shiftStatus || 'available'}
            onChange={(e) => updateWorkerShiftStatus(currentWorker.id, e.target.value as any)}
            className="bg-white text-[#1C1E21] text-[10px] font-semibold rounded-lg px-2 py-1 border border-[#DCD6CB] focus:outline-none focus:border-[#2E5A44] cursor-pointer"
          >
            <option value="available">Available</option>
            <option value="on_the_way">On The Way</option>
            <option value="working">Working</option>
            <option value="on_break">On Break</option>
          </select>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-[#8A8275] uppercase tracking-wider">
          Worker Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2E5A44] text-white font-bold shadow-xs'
                  : 'text-[#4B5563] hover:bg-[#FAF8F5] hover:text-[#1C1E21]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white text-[#2E5A44]'
                        : item.pulse
                        ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D] animate-pulse'
                        : 'bg-[#FAF8F5] text-[#4B5563] border border-[#E6E0D5]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#9E9382]'}`} />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-[#EBE7DF]">
        <button
          onClick={workerLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.worker.logoutBtn}</span>
        </button>
      </div>
    </aside>
  );
};
