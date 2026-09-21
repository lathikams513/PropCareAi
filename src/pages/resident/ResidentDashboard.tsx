import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResidentHeader } from './components/ResidentHeader';
import { ResidentNavigation, ResidentTabType } from './components/ResidentNavigation';
import { ResidentHome } from './components/ResidentHome';
import { MyApartmentView } from './components/MyApartmentView';
import { SmartMonitoringView } from './components/SmartMonitoringView';
import { AiAlertsView } from './components/AiAlertsView';
import { ReportProblemView } from './components/ReportProblemView';
import { MaintenanceView } from './components/MaintenanceView';
import { TrackWorkerView } from './components/TrackWorkerView';
import { ServiceHistoryView } from './components/ServiceHistoryView';
import { NotificationsView } from './components/NotificationsView';
import { ResidentProfileView } from './components/ResidentProfileView';
import { VerificationModal } from './components/VerificationModal';

export const ResidentDashboard: React.FC = () => {
  const {
    currentApartmentId,
    apartments,
    tickets,
    aiAlerts,
    notifications
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const aptTickets = tickets.filter((t) => t.apartmentId === apt.id);
  const activeTicket = aptTickets.find((t) => t.status !== 'resident_verified');
  const aptAlerts = aiAlerts.filter((a) => a.apartmentId === apt.id);
  const pendingAlerts = aptAlerts.filter((a) => a.status === 'pending');
  const unreadNotifs = notifications.filter((n) => !n.isRead);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<ResidentTabType>('overview');

  // Verification & Rating Modal State
  const [verifyingTicketId, setVerifyingTicketId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 animate-fade-in text-[#1C1E21]">
      
      {/* 1. TOP RESIDENT ENVIRONMENT HEADER */}
      <ResidentHeader />

      {/* 2. MAIN RESIDENT WORKSPACE BODY */}
      <div className="app-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Resident Workspace Navigation (3 Cols on Desktop) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-36 z-10">
            <ResidentNavigation
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              pendingAlertsCount={pendingAlerts.length}
              activeMaintenanceCount={activeTicket ? 1 : 0}
              unreadNotificationsCount={unreadNotifs.length}
            />
          </aside>

          {/* Right: Active View Content (9 Cols on Desktop) */}
          <main className="lg:col-span-9 min-w-0">
            {activeTab === 'overview' && (
              <ResidentHome
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenVerifyModal={(ticketId) => setVerifyingTicketId(ticketId)}
              />
            )}

            {activeTab === 'apartment' && <MyApartmentView />}

            {activeTab === 'monitoring' && <SmartMonitoringView />}

            {activeTab === 'alerts' && <AiAlertsView />}

            {activeTab === 'report' && (
              <ReportProblemView
                onSuccessNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'maintenance' && (
              <MaintenanceView
                onOpenVerifyModal={(ticketId) => setVerifyingTicketId(ticketId)}
              />
            )}

            {activeTab === 'worker' && <TrackWorkerView />}

            {activeTab === 'history' && <ServiceHistoryView />}

            {activeTab === 'notifications' && <NotificationsView />}

            {activeTab === 'profile' && <ResidentProfileView />}
          </main>

        </div>
      </div>

      {/* 3. RESIDENT WORK COMPLETION & 5-STAR SIGN-OFF MODAL */}
      {verifyingTicketId && (
        <VerificationModal
          ticketId={verifyingTicketId}
          onClose={() => setVerifyingTicketId(null)}
        />
      )}

    </div>
  );
};

export default ResidentDashboard;
