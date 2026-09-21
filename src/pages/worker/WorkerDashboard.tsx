import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkerLogin } from './WorkerLogin';
import { WorkerSidebar, WorkerNavTab } from './components/WorkerSidebar';
import { WorkerHome } from './components/WorkerHome';
import { WorkerTasks } from './components/WorkerTasks';
import { WorkerActiveJob } from './components/WorkerActiveJob';
import { WorkerPendingJobs } from './components/WorkerPendingJobs';
import { WorkerCompletedJobs } from './components/WorkerCompletedJobs';
import { WorkerHistory } from './components/WorkerHistory';
import { WorkerNotifications } from './components/WorkerNotifications';
import { WorkerProfileView } from './components/WorkerProfileView';
import { 
  Menu, 
  X, 
  Bell, 
  Radio, 
  LogOut,
  Wrench,
  Globe,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { 
    isWorkerAuthenticated, 
    workers, 
    currentWorkerId, 
    notifications, 
    language, 
    setLanguage, 
    workerLogout, 
    t 
  } = useApp();

  const [currentTab, setCurrentTab] = useState<WorkerNavTab>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If worker is not authenticated, show separate Worker Login
  if (!isWorkerAuthenticated) {
    return <WorkerLogin />;
  }

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar',
    role: 'Plumber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  };

  const unreadNotifsCount = notifications.filter(
    (n) => !n.isRead && (n.targetRole === 'worker' || n.targetRole === 'all')
  ).length;

  const handleNavigate = (tab: WorkerNavTab, ticketId?: string) => {
    setCurrentTab(tab);
    if (ticketId) setSelectedTicketId(ticketId);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1E21] flex flex-col font-sans relative selection:bg-[#2E5A44] selection:text-white">
      {/* Background Apartment Visual with Soft Readability Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-15"
        style={{ backgroundImage: "url('/images/hero_community.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#FAFAF8]/95 via-[#FAF8F5]/90 to-[#FAFAF8]/98 pointer-events-none" />

      {/* Worker App Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Desktop Dedicated Worker Sidebar */}
        <div className="hidden lg:flex flex-shrink-0">
          <WorkerSidebar 
            currentTab={currentTab} 
            onSelectTab={(tab) => handleNavigate(tab)} 
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)} 
            />
            <div className="relative z-10 flex">
              <WorkerSidebar 
                currentTab={currentTab} 
                onSelectTab={(tab) => handleNavigate(tab)} 
              />
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-3 text-white self-start"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar for Worker */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E6E0D5] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#FAF8F5] border border-[#E6E0D5] text-[#4B5563] hover:text-[#1C1E21]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
                <span className="text-xs font-bold text-[#2E5A44] uppercase tracking-wider hidden sm:inline">
                  {language === 'ta' ? 'களப்பணியாளர் போர்ட்டல் இணைக்கப்பட்டுள்ளது' : 'Technician Terminal • Online'}
                </span>
              </div>
            </div>

            {/* Right Controls: Notifications, Language, Worker Pill, Logout */}
            <div className="flex items-center gap-3">
              {/* Notifications shortcut */}
              <button
                onClick={() => handleNavigate('notifications')}
                className="relative p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E6E0D5] text-[#4B5563] hover:text-[#1C1E21] transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D97706] text-white font-bold text-[9px] flex items-center justify-center animate-bounce">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#2E5A44] border border-[#E6E0D5] transition-colors cursor-pointer"
                title="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              {/* Worker Profile Badge */}
              <div 
                onClick={() => handleNavigate('profile')}
                className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#E6E0D5] hover:border-[#2E5A44] transition-all cursor-pointer"
              >
                <img
                  src={currentWorker.avatar}
                  alt={currentWorker.name}
                  className="w-7 h-7 rounded-lg object-cover border border-[#E6E0D5]"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#1C1E21] leading-tight">{currentWorker.name}</p>
                  <p className="text-[10px] text-[#2E5A44] font-semibold leading-tight">{currentWorker.role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={workerLogout}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                title={t.worker.logoutBtn}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Subpage View Routing */}
          <main className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <WorkerHome onNavigate={handleNavigate} />
            )}

            {currentTab === 'my-tasks' && (
              <WorkerTasks onNavigate={handleNavigate} />
            )}

            {currentTab === 'active-job' && (
              <WorkerActiveJob 
                onNavigate={handleNavigate} 
                selectedTicketId={selectedTicketId} 
              />
            )}

            {currentTab === 'pending-jobs' && (
              <WorkerPendingJobs onNavigate={handleNavigate} />
            )}

            {currentTab === 'completed-jobs' && (
              <WorkerCompletedJobs onNavigate={handleNavigate} />
            )}

            {currentTab === 'work-history' && (
              <WorkerHistory onNavigate={handleNavigate} />
            )}

            {currentTab === 'notifications' && (
              <WorkerNotifications onNavigate={handleNavigate} />
            )}

            {currentTab === 'profile' && (
              <WorkerProfileView />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
