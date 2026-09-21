import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Home,
  Building,
  Activity,
  Sparkles,
  Send,
  Wrench,
  UserCheck,
  FileText,
  Bell,
  Settings,
  AlertCircle
} from 'lucide-react';

export type ResidentTabType =
  | 'overview'
  | 'apartment'
  | 'monitoring'
  | 'alerts'
  | 'report'
  | 'maintenance'
  | 'worker'
  | 'history'
  | 'notifications'
  | 'profile';

interface ResidentNavigationProps {
  activeTab: ResidentTabType;
  onSelectTab: (tab: ResidentTabType) => void;
  pendingAlertsCount: number;
  activeMaintenanceCount: number;
  unreadNotificationsCount: number;
}

export const ResidentNavigation: React.FC<ResidentNavigationProps> = ({
  activeTab,
  onSelectTab,
  pendingAlertsCount,
  activeMaintenanceCount,
  unreadNotificationsCount
}) => {
  const { language } = useApp();

  const isTamil = language === 'ta';

  const navSections = [
    {
      title: isTamil ? 'என் வீடு' : 'MY HOME',
      items: [
        {
          id: 'overview' as ResidentTabType,
          label: isTamil ? 'முகப்பு' : 'Home Overview',
          icon: Home,
          badge: null
        },
        {
          id: 'apartment' as ResidentTabType,
          label: isTamil ? 'என் அடுக்குமாடி' : 'My Apartment',
          icon: Building,
          badge: null
        }
      ]
    },
    {
      title: isTamil ? 'கண்காணிப்பு' : 'MONITOR',
      items: [
        {
          id: 'monitoring' as ResidentTabType,
          label: isTamil ? 'ஸ்மார்ட் கண்காணிப்பு' : 'Smart Monitoring',
          icon: Activity,
          badge: null
        },
        {
          id: 'alerts' as ResidentTabType,
          label: isTamil ? 'AI எச்சரிக்கைகள்' : 'AI Alerts',
          icon: Sparkles,
          badge: pendingAlertsCount > 0 ? `${pendingAlertsCount}` : null,
          badgeColor: 'bg-[#B45309] text-white'
        }
      ]
    },
    {
      title: isTamil ? 'சேவைகள்' : 'SERVICES',
      items: [
        {
          id: 'report' as ResidentTabType,
          label: isTamil ? 'புகாரளிக்கவும்' : 'Report a Problem',
          icon: Send,
          badge: null
        },
        {
          id: 'maintenance' as ResidentTabType,
          label: isTamil ? 'பராமரிப்பு பணிகள்' : 'Maintenance',
          icon: Wrench,
          badge: activeMaintenanceCount > 0 ? `${activeMaintenanceCount}` : null,
          badgeColor: 'bg-[#2E5A44] text-white'
        },
        {
          id: 'worker' as ResidentTabType,
          label: isTamil ? 'பணியாளர் இருப்பிடம்' : 'Track Worker',
          icon: UserCheck,
          badge: null
        },
        {
          id: 'history' as ResidentTabType,
          label: isTamil ? 'சேவை வரலாறு' : 'Service History',
          icon: FileText,
          badge: null
        }
      ]
    },
    {
      title: isTamil ? 'கணக்கு' : 'ACCOUNT',
      items: [
        {
          id: 'notifications' as ResidentTabType,
          label: isTamil ? 'அறிவிப்புகள்' : 'Notifications',
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : null,
          badgeColor: 'bg-[#0369A1] text-white'
        },
        {
          id: 'profile' as ResidentTabType,
          label: isTamil ? 'சுயவிவரம் & அமைப்புகள்' : 'Profile & Settings',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  return (
    <nav className="w-full bg-white rounded-2xl border border-[#E6E0D5] p-3 shadow-2xs">
      
      {/* Desktop & Tablet Sidebar Layout */}
      <div className="hidden lg:block space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 text-[10px] font-black uppercase tracking-wider text-[#8A8275]">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#1C1E21] text-white shadow-xs'
                        : 'text-[#4B5563] hover:text-[#1C1E21] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#A3E3B8]' : 'text-[#8A8275]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${item.badgeColor || 'bg-[#2E5A44] text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Tab Navigation */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {navSections.flatMap((s) => s.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#1C1E21] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1C1E21] bg-[#FAF8F5] border border-[#E6E0D5]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#A3E3B8]' : 'text-[#6B7280]'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="w-4 h-4 rounded-full bg-[#B45309] text-white text-[9px] flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

    </nav>
  );
};
