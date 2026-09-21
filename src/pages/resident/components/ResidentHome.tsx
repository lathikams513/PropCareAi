import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Droplets,
  Zap,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  UserCheck,
  Check,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ResidentTabType } from './ResidentNavigation';

interface ResidentHomeProps {
  onNavigate: (tab: ResidentTabType) => void;
  onOpenVerifyModal: (ticketId: string) => void;
}

export const ResidentHome: React.FC<ResidentHomeProps> = ({
  onNavigate,
  onOpenVerifyModal
}) => {
  const {
    currentApartmentId,
    apartments,
    tickets,
    aiAlerts,
    confirmAiAlert,
    t,
    language,
    translateStatus,
    translatePriority,
    translateCategory
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const aptTickets = tickets.filter((t) => t.apartmentId === apt.id);
  const activeTicket = aptTickets.find((t) => t.status !== 'resident_verified');
  const aptAlerts = aiAlerts.filter((a) => a.apartmentId === apt.id);
  const pendingAlert = aptAlerts.find((a) => a.status === 'pending');

  const isTamil = language === 'ta';

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. HERO: REAL APARTMENT ENVIRONMENT */}
      <div className="relative rounded-3xl overflow-hidden shadow-xs border border-[#E6E0D5] bg-[#FAF8F5]">
        
        {/* Large Apartment Visual Environment */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src="/images/apartment_living.jpg"
            alt={`Apartment ${apt.id} Interior`}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle natural gradient overlay for readability without obscuring photography */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E21]/80 via-[#1C1E21]/20 to-transparent" />

          {/* Floating Top Left Pill */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#1C1E21] border border-white/40 shadow-xs">
              {t.common.apartment} {apt.id}
            </span>
            <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-[#1C1E21]/60 backdrop-blur-md text-white border border-white/20">
              Cedar Heights • {t.common.floor} {apt.floor}
            </span>
          </div>

          {/* Floating Top Right Interactive Explore Shortcut */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button
              onClick={() => onNavigate('apartment')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 hover:bg-white text-[#2E5A44] backdrop-blur-md border border-white/50 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTamil ? 'அடுக்குமாடி ஆய்வு' : 'View Floor & Sensors'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Hero Overlay Content */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#A3E3B8]">
                {isTamil ? 'என் இல்லத்தின் நிலவரம்' : 'HOME ENVIRONMENT TELEMETRY'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isTamil ? 'அடுக்குமாடி' : 'My Apartment'} {apt.id}
              </h2>
              <p className="text-xs sm:text-sm text-[#F3EFEA]/90 max-w-lg">
                {apt.hasActiveAlert || apt.status === 'warning'
                  ? (isTamil ? 'கவனம் தேவை: ஒரு அமைப்பு சரிபார்ப்பு நிலுவையில் உள்ளது.' : 'Notice: 1 system anomaly is awaiting your confirmation.')
                  : (isTamil ? 'அனைத்து அமைப்புகளும் இயல்பான வரம்பில் செயல்படுகின்றன.' : 'All fixtures, electrical circuits, and water meters are operating normally.')}
              </p>
            </div>

            <div className="shrink-0">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold backdrop-blur-md border ${
                apt.hasActiveAlert || apt.status === 'warning'
                  ? 'bg-[#B45309]/80 text-[#FEF3C7] border-[#FFE082]/40'
                  : 'bg-[#2E5A44]/80 text-[#E8F5E9] border-[#C8E6C9]/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  apt.hasActiveAlert ? 'bg-[#FFE082] animate-ping' : 'bg-[#A3E3B8] animate-pulse'
                }`} />
                <span>
                  {apt.hasActiveAlert ? (isTamil ? 'செயல்பாடு தேவை' : 'Action Needed') : (isTamil ? 'அனைத்து அமைப்புகளும் சீரானவை' : 'All Systems Normal')}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. HOME STATUS BAR: CLEAN HORIZONTAL ROW (NOT 4 CARDS) */}
        <div className="bg-white border-t border-[#E6E0D5] px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x divide-[#EBE7DF]">
            
            {/* Water Metric */}
            <div className="flex items-center justify-between md:justify-start md:gap-4 pt-3 md:pt-0 md:pr-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {t.home.monitorTabWater}
                  </div>
                  <div className="text-lg font-black text-[#1C1E21] flex items-baseline gap-1">
                    {apt.sensorSummary.waterFlow}
                    <span className="text-xs font-normal text-[#8A8275]">L/min</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                apt.sensorSummary.waterFlow > 10
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-[#E8F5E9] text-[#2E7D32]'
              }`}>
                {apt.sensorSummary.waterFlow > 10 ? t.common.warning : t.common.normal}
              </span>
            </div>

            {/* Power Metric */}
            <div className="flex items-center justify-between md:justify-start md:gap-4 pt-3 md:pt-0 md:px-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {t.home.monitorTabPower}
                  </div>
                  <div className="text-lg font-black text-[#1C1E21] flex items-baseline gap-1">
                    {apt.sensorSummary.powerUsage}
                    <span className="text-xs font-normal text-[#8A8275]">kW</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32]">
                {t.common.normal}
              </span>
            </div>

            {/* Temperature Metric */}
            <div className="flex items-center justify-between md:justify-start md:gap-4 pt-3 md:pt-0 md:px-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E5A44] flex items-center justify-center shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {t.home.monitorTabTemp}
                  </div>
                  <div className="text-lg font-black text-[#1C1E21] flex items-baseline gap-1">
                    {apt.sensorSummary.temperature}°C
                    <span className="text-xs font-normal text-[#8A8275]">({apt.sensorSummary.humidity}%)</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32]">
                {t.common.optimal}
              </span>
            </div>

            {/* Air Quality Metric */}
            <div className="flex items-center justify-between md:justify-start md:gap-4 pt-3 md:pt-0 md:pl-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {isTamil ? 'காற்றின் தரம்' : 'Air Quality'}
                  </div>
                  <div className="text-lg font-black text-[#1C1E21] flex items-baseline gap-1">
                    {apt.sensorSummary.airQuality}
                    <span className="text-xs font-normal text-[#8A8275]">AQI</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32]">
                {t.common.good}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* 3. CURRENT ALERT / POSSIBLE PROBLEM (Contextual Notification, NOT a generic giant box) */}
      {pendingAlert && (
        <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#FCD34D] p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FDE68A] pb-3">
            <div className="flex items-center gap-2 text-xs font-black text-[#B45309] uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>{t.resident.possibleProblemTitle}</span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
              <Clock className="w-3.5 h-3.5" />
              {t.resident.detectedAt} {pendingAlert.detectedAt}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#1C1E21]">
              "{pendingAlert.issueTitle || t.resident.aiProblemExplanation}"
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {pendingAlert.explanation}
            </p>
          </div>

          {/* Horizontal Meta Row */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#4B5563] bg-white/70 rounded-xl p-3 border border-[#FDE68A]">
            <div>
              <span className="text-[#6B7280]">{t.resident.confidence}</span>{' '}
              <strong className="text-[#2E5A44] font-black">{pendingAlert.confidence}%</strong>
            </div>
            <div>
              <span className="text-[#6B7280]">{t.resident.readingLabel}</span>{' '}
              <strong className="text-[#DC2626] font-black">{pendingAlert.readingValue} {pendingAlert.unit}</strong>{' '}
              <span className="text-[#8A8275]">({t.common.baseline}: {pendingAlert.normalRange})</span>
            </div>
            <div>
              <span className="text-[#6B7280]">{isTamil ? 'சென்சார்' : 'Sensor'}:</span>{' '}
              <strong className="text-[#1C1E21]">{pendingAlert.sensorName}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => confirmAiAlert(pendingAlert.id, true, 'Confirmed by resident via workspace')}
              className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t.resident.confirmProblemBtn}</span>
            </button>
            <button
              onClick={() => confirmAiAlert(pendingAlert.id, false, 'Dismissed as normal usage')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C1E21] text-xs font-bold border border-[#DCD6CB] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#2E7D32]" />
              <span>{t.resident.notProblemBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. ACTIVE MAINTENANCE (Clean Horizontal Row & Step Timeline) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1C1E21] flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#2E5A44]" />
            <span>{isTamil ? 'செயலில் உள்ள பராமரிப்பு' : 'Active Maintenance'}</span>
          </h3>
          <button
            onClick={() => onNavigate('maintenance')}
            className="text-xs font-bold text-[#2E5A44] hover:text-[#1A3626] flex items-center gap-1"
          >
            <span>{isTamil ? 'அனைத்து பணிகள்' : 'View All Orders'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {activeTicket ? (
          <div className="bg-white rounded-2xl border border-[#E6E0D5] p-5 shadow-2xs space-y-5">
            
            {/* Header Information Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF8F5] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#2E5A44]">{activeTicket.ticketId}</span>
                  <span className="text-xs text-[#8A8275]">•</span>
                  <span className="text-xs font-bold text-[#6B7280]">{translateCategory(activeTicket.category)}</span>
                </div>
                <h4 className="text-base font-bold text-[#1C1E21] mt-0.5">{activeTicket.problem}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8E1] text-[#B45309] border border-[#FFE082]">
                  {translateStatus(activeTicket.status)}
                </span>
                {activeTicket.status === 'work_completed' && (
                  <button
                    onClick={() => onOpenVerifyModal(activeTicket.ticketId)}
                    className="px-4 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1A3626] text-white text-xs font-black animate-pulse transition-all shadow-xs cursor-pointer"
                  >
                    {t.resident.verifyRateBtn}
                  </button>
                )}
              </div>
            </div>

            {/* Worker & ETA Horizontal Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF8F5] rounded-xl p-3.5 text-xs">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-[#2E5A44] shrink-0" />
                <div>
                  <span className="text-[#8A8275] block text-[10px] uppercase font-bold">{t.resident.assignedTech}</span>
                  <strong className="text-[#1C1E21]">{activeTicket.workerName || t.resident.awaitingDispatch}</strong>
                  {activeTicket.workerSkill && <span className="text-[#6B7280] text-[11px] block">{activeTicket.workerSkill}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#0369A1] shrink-0" />
                <div>
                  <span className="text-[#8A8275] block text-[10px] uppercase font-bold">{t.resident.estArrival}</span>
                  <strong className="text-[#1C1E21]">
                    {activeTicket.status === 'worker_en_route' 
                      ? (isTamil ? 'வருகிறார் (10 நிமிடம்)' : 'On The Way (ETA 10 min)') 
                      : translateStatus(activeTicket.status)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#B45309] shrink-0" />
                <div>
                  <span className="text-[#8A8275] block text-[10px] uppercase font-bold">{t.resident.servicePriority}</span>
                  <strong className="text-[#B45309] uppercase">{translatePriority(activeTicket.priority)}</strong>
                </div>
              </div>
            </div>

            {/* Step-by-Step Horizontal Pipeline */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                {isTamil ? 'வேலை முன்னேற்றம்' : 'Service Execution Pipeline'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] font-bold border border-[#C8E6C9] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.resident.step1Reported}</span>
                </div>
                
                <div className={`p-2.5 rounded-xl font-bold border flex items-center gap-1.5 ${
                  activeTicket.workerId
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : 'bg-[#FAF8F5] text-[#8A8275] border-[#E6E0D5]'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{activeTicket.workerId ? t.resident.step2AdminDone : t.resident.step2Admin}</span>
                </div>

                <div className={`p-2.5 rounded-xl font-bold border flex items-center gap-1.5 ${
                  activeTicket.status === 'work_in_progress' || activeTicket.status === 'work_completed' || activeTicket.status === 'resident_verified'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : activeTicket.status === 'worker_en_route'
                    ? 'bg-[#FFF8E1] text-[#B45309] border-[#FFE082]'
                    : 'bg-[#FAF8F5] text-[#8A8275] border-[#E6E0D5]'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{activeTicket.status === 'work_in_progress' ? t.resident.step3TechProgress : activeTicket.status === 'worker_en_route' ? (isTamil ? 'வருகிறார்' : 'En Route') : t.resident.step3Tech}</span>
                </div>

                <div className={`p-2.5 rounded-xl font-bold border flex items-center gap-1.5 ${
                  activeTicket.status === 'work_completed'
                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] animate-pulse'
                    : activeTicket.status === 'resident_verified'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : 'bg-[#FAF8F5] text-[#8A8275] border-[#E6E0D5]'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{activeTicket.status === 'work_completed' ? t.resident.step4VerifyNeeded : t.resident.step4Signoff}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E6E0D5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1C1E21]">{t.resident.noActiveOrders}</h4>
                <p className="text-xs text-[#6B7280]">{t.resident.allOperatingNormal}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
            >
              {t.resident.reportIssueBtn}
            </button>
          </div>
        )}
      </div>

      {/* 5. RECENT ACTIVITY: NATURAL TIMELINE (NOT CARDS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1C1E21]">
            {t.resident.recentActivityTitle}
          </h3>
          <span className="text-xs text-[#8A8275]">{t.resident.last7Days}</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E0D5] p-5">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6E0D5]">
            
            {/* Event 1 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#B45309] ring-4 ring-white" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <strong className="text-[#1C1E21]">
                  {isTamil ? 'நீர் ஓட்ட முரண்பாடு கண்டறியப்பட்டது' : 'Water flow anomaly detected'}
                </strong>
                <span className="font-mono text-[11px] text-[#8A8275]">Today • 10:42 AM</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {isTamil
                  ? 'சமையலறை சென்சார் S-101 14.8 L/min மாறுபாட்டைப் பதிவு செய்து குடியிருப்பாளர் உறுதிப்படுத்தலுக்கு அனுப்பியது.'
                  : 'Kitchen line sensor S-101 flagged 14.8 L/min continuous flow deviation.'}
              </p>
            </div>

            {/* Event 2 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#2E7D32] ring-4 ring-white" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <strong className="text-[#1C1E21]">
                  {isTamil ? 'வழக்கமான மின்சுமை சரிபார்ப்பு நிறைவுற்றது' : 'Daily telemetry baseline updated'}
                </strong>
                <span className="font-mono text-[11px] text-[#8A8275]">Today • 06:00 AM</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {isTamil
                  ? 'மின்சார மற்றும் நீர் சென்சார்கள் இயல்பு நிலைக்கு ஒத்திசைக்கப்பட்டன.'
                  : 'ESP32 edge nodes synchronized with central anomaly detector.'}
              </p>
            </div>

            {/* Event 3 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#2E5A44] ring-4 ring-white" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <strong className="text-[#1C1E21]">
                  {isTamil ? 'ஸ்மார்ட் கதவு பூட்டு மென்பொருள் புதுப்பிக்கப்பட்டது' : 'Smart Deadbolt security update'}
                </strong>
                <span className="font-mono text-[11px] text-[#8A8275]">Yesterday • 08:30 PM</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {isTamil
                  ? 'பாதுகாப்பு பதிப்பு v4.2.1 வெற்றிகரமாக நிறுவப்பட்டது.'
                  : 'Firmware patch v4.2.1 applied over secure residential mesh.'}
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
