import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Building2,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface ResidentHeaderProps {
  onSwitchApartment?: (id: string) => void;
}

export const ResidentHeader: React.FC<ResidentHeaderProps> = () => {
  const {
    currentApartmentId,
    apartments,
    setCurrentApartmentId,
    setUserRole,
    setActiveTab: setGlobalActiveTab,
    t,
    language
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'ta') {
      if (hour < 12) return 'காலை வணக்கம்';
      if (hour < 17) return 'மதிய வணக்கம்';
      return 'மாலை வணக்கம்';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isWarning = apt.status === 'warning' || apt.hasActiveAlert;

  return (
    <header className="border-b border-[#E6E0D5] bg-white/70 backdrop-blur-md sticky top-16 z-20 py-4 transition-all">
      <div className="app-container flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Resident Greeting & Unit Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#E6E0D5] text-[#2E5A44]">
              <Building2 className="w-3 h-3 text-[#2E5A44]" />
              {t.common.apartment} {apt.id}
            </span>
            <span className="text-xs text-[#8A8275]">•</span>
            <span className="text-xs font-semibold text-[#6B7280]">
              Cedar Heights • {t.common.floor} {apt.floor} • {t.common.block} {apt.blockId}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight">
            {getGreeting()}, {apt.resident.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#6B7280]">
            {language === 'ta' 
              ? 'உங்கள் இல்லத்திற்கு மீண்டும் நல்வரவு. இன்றைய நேரலை நிலவரம் இங்கே.' 
              : "Welcome back. Here's what's happening at your home today."}
          </p>
        </div>

        {/* Right: Status Indicator & Unit Selector & Exit */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Unit Switcher Selector */}
          <div className="relative inline-flex items-center">
            <select
              value={currentApartmentId}
              onChange={(e) => setCurrentApartmentId(e.target.value)}
              className="appearance-none bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#1C1E21] pl-3 pr-8 py-2 rounded-xl border border-[#DCD6CB] cursor-pointer transition-colors focus:outline-none focus:border-[#2E5A44]"
              title="Switch demo apartment"
            >
              {apartments.slice(0, 4).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} ({a.resident.name}) {a.hasActiveAlert ? '• ⚠ Alert' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 pointer-events-none" />
          </div>

          {/* Real-time Health Badge */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
            isWarning
              ? 'bg-[#FFF8E1] text-[#B45309] border-[#FFE082]'
              : 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isWarning ? 'bg-[#B45309] animate-ping' : 'bg-[#2E7D32] animate-pulse'
            }`} />
            <span>
              {isWarning ? t.resident.actionRequired : t.resident.allSystemsHealthy}
            </span>
          </div>

          {/* Exit Portal Button */}
          <button
            onClick={() => {
              setUserRole('public');
              setGlobalActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer shadow-2xs"
            title={t.resident.exitPortal}
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">{t.resident.exitPortal}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
