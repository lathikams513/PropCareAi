import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ApartmentDrawer } from './components/common/ApartmentDrawer';
import { HomePage } from './pages/public/HomePage';
import { CommunityExplorer } from './pages/community/CommunityExplorer';
import { ResidentDashboard } from './pages/resident/ResidentDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { WorkerDashboard } from './pages/worker/WorkerDashboard';

export const AppContent: React.FC = () => {
  const { userRole, activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1C1E21]">
      <Navbar />

      <main className={`flex-1 ${userRole === 'public' && activeTab === 'home' ? '' : 'pt-20'}`}>
        {/* Render page based on role and activeTab */}
        {userRole === 'public' && activeTab === 'home' && <HomePage />}
        {userRole === 'public' && activeTab === 'community' && <CommunityExplorer />}
        {userRole === 'resident' && <ResidentDashboard />}
        {userRole === 'admin' && <AdminDashboard />}
        {userRole === 'worker' && <WorkerDashboard />}
      </main>

      <Footer />

      {/* Global Drawers & Modals */}
      <CommandPalette />
      <NotificationDrawer />
      <ApartmentDrawer />
    </div>
  );
};

export default AppContent;
