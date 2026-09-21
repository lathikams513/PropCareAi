import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLogin } from './AdminLogin';
import {
  Building2,
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Clock,
  User,
  Search,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Droplets,
  Thermometer,
  Wind,
  ArrowRight,
  UserCheck,
  TrendingUp,
  Cpu,
  BarChart3,
  CheckCheck,
  Eye,
  Send,
  Check,
  Plus,
  Sliders,
  Bell,
  Settings,
  FileSpreadsheet,
  LogOut,
  Calendar,
  X,
  Phone,
  MessageSquare,
  AlertCircle,
  MapPin,
  Radio,
  FileCheck2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { MaintenanceTicket, Apartment, WorkerProfile, AIAlert } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminAuthenticated,
    adminLogout,
    apartments,
    tickets,
    workers,
    aiAlerts,
    activity,
    adminConfirmTicket,
    assignWorkerToTicket,
    verifyTicketCompletion,
    setSelectedApartmentForDrawer,
    t,
    language,
    translateStatus,
    translateCategory,
    translatePriority
  } = useApp();

  // If not authenticated, render the dedicated AdminLogin page
  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // Active view tab: 'overview' | 'problems' | 'actions' | 'workers' | 'apartments' | 'reports'
  const [adminView, setAdminView] = useState<'overview' | 'problems' | 'actions' | 'workers' | 'apartments' | 'reports'>('overview');

  // Selected ticket / issue for complete details inspection modal
  const [inspectingTicket, setInspectingTicket] = useState<MaintenanceTicket | null>(null);
  const [inspectingAlert, setInspectingAlert] = useState<AIAlert | null>(null);

  // Dispatch Modal State
  const [dispatchingTicket, setDispatchingTicket] = useState<MaintenanceTicket | null>(null);

  // Worker Monitoring status filter
  const [workerStatusFilter, setWorkerStatusFilter] = useState<'all' | 'available' | 'assigned' | 'en_route' | 'working' | 'completed'>('all');

  // Apartment Overview Multi-filters
  const [aptSearch, setAptSearch] = useState('');
  const [aptCategoryFilter, setAptCategoryFilter] = useState<string>('all');
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('all');
  const [aptWorkerFilter, setAptWorkerFilter] = useState<string>('all');

  // Operational KPIs
  const totalApartmentsCount = apartments.length; // 192 units
  const activeProblemsCount = apartments.filter((a) => a.status !== 'healthy' || a.hasActiveAlert || a.activeTicketId).length;
  const pendingConfirmationsCount = aiAlerts.filter((a) => a.status === 'pending').length;
  const maintenanceInProgressCount = tickets.filter(
    (tkt) => ['worker_assigned', 'worker_accepted', 'worker_en_route', 'work_in_progress'].includes(tkt.status)
  ).length;
  const completedCount = tickets.filter((tkt) => tkt.status === 'work_completed' || tkt.status === 'resident_verified').length;
  const workersAvailableCount = workers.filter((w) => w.activeTasks === 0 || w.isAvailable).length;

  // Pending Actions list calculation
  const pendingResidentAlerts = aiAlerts.filter((a) => a.status === 'pending');
  const pendingAdminTickets = tickets.filter((tkt) => tkt.status === 'resident_confirmed');
  const pendingWorkerAssignTickets = tickets.filter((tkt) => tkt.status === 'admin_confirmed' && !tkt.workerId);
  const pendingWorkerAcceptTickets = tickets.filter((tkt) => tkt.status === 'worker_assigned');
  const pendingCompletionVerification = tickets.filter((tkt) => tkt.status === 'work_completed');

  // Problem counts for Reports / Overview section
  const totalProblemsReported = tickets.length + pendingResidentAlerts.length;
  const resolvedProblemsCount = tickets.filter((tkt) => tkt.status === 'resident_verified' || tkt.status === 'work_completed').length;
  const pendingProblemsTotal = totalProblemsReported - resolvedProblemsCount;
  const waterProblemsCount = tickets.filter((tkt) => tkt.category === 'Water & Plumbing').length + aiAlerts.filter((a) => a.category === 'Water & Plumbing').length;
  const electricalProblemsCount = tickets.filter((tkt) => tkt.category === 'Electrical & Power').length;
  const hvacProblemsCount = tickets.filter((tkt) => tkt.category === 'HVAC & Climate').length + aiAlerts.filter((a) => a.category === 'HVAC & Climate').length;
  const otherProblemsCount = tickets.filter((tkt) => !['Water & Plumbing', 'Electrical & Power', 'HVAC & Climate'].includes(tkt.category)).length;

  // Filtered workers list
  const filteredWorkers = workers.filter((w) => {
    if (workerStatusFilter === 'all') return true;
    if (workerStatusFilter === 'available') return w.activeTasks === 0 && w.isAvailable;
    if (workerStatusFilter === 'assigned') {
      const tkt = tickets.find((t) => t.workerId === w.id);
      return tkt && (tkt.status === 'worker_assigned' || tkt.status === 'worker_accepted');
    }
    if (workerStatusFilter === 'en_route') {
      const tkt = tickets.find((t) => t.workerId === w.id);
      return tkt && tkt.status === 'worker_en_route';
    }
    if (workerStatusFilter === 'working') {
      const tkt = tickets.find((t) => t.workerId === w.id);
      return tkt && tkt.status === 'work_in_progress';
    }
    if (workerStatusFilter === 'completed') {
      return w.completedTasks > 0;
    }
    return true;
  });

  // Filtered Apartments list for Section 6
  const filteredApartmentOverview = apartments.filter((apt) => {
    const aptTkt = tickets.find((t) => t.apartmentId === apt.id);
    const aptAlt = aiAlerts.find((a) => a.apartmentId === apt.id);

    // Search matches apt ID or resident name
    const matchesSearch =
      !aptSearch.trim() ||
      apt.id.toLowerCase().includes(aptSearch.toLowerCase()) ||
      apt.resident.name.toLowerCase().includes(aptSearch.toLowerCase());

    // Category filter
    const matchesCat =
      aptCategoryFilter === 'all' ||
      aptTkt?.category === aptCategoryFilter ||
      aptAlt?.category === aptCategoryFilter;

    // Status filter
    const matchesStatus =
      aptStatusFilter === 'all' ||
      (aptStatusFilter === 'healthy' && apt.status === 'healthy' && !apt.hasActiveAlert) ||
      (aptStatusFilter === 'warning' && (apt.status === 'warning' || apt.hasActiveAlert)) ||
      (aptStatusFilter === 'maintenance' && apt.status === 'maintenance') ||
      (aptStatusFilter === 'in_progress' && aptTkt && ['worker_assigned', 'work_in_progress'].includes(aptTkt.status)) ||
      (aptStatusFilter === 'completed' && aptTkt && ['work_completed', 'resident_verified'].includes(aptTkt.status));

    // Worker filter
    const matchesWorker =
      aptWorkerFilter === 'all' ||
      (aptWorkerFilter === 'unassigned' && (!aptTkt || !aptTkt.workerId)) ||
      aptTkt?.workerId === aptWorkerFilter ||
      aptTkt?.workerName?.toLowerCase().includes(aptWorkerFilter.toLowerCase());

    return matchesSearch && matchesCat && matchesStatus && matchesWorker;
  });

  const handleAssignWorker = (ticketId: string, workerId: string) => {
    assignWorkerToTicket(ticketId, workerId);
    setDispatchingTicket(null);
  };

  const getWorkerCurrentTask = (worker: WorkerProfile) => {
    const activeTkt = tickets.find((t) => t.workerId === worker.id && t.status !== 'resident_verified');
    if (activeTkt) {
      return {
        taskName: activeTkt.problem,
        apartmentId: activeTkt.apartmentId,
        status: activeTkt.status,
        statusLabel:
          activeTkt.status === 'worker_en_route'
            ? t.admin.statusEnRoute
            : activeTkt.status === 'work_in_progress'
            ? t.admin.statusWorking
            : activeTkt.status === 'worker_assigned' || activeTkt.status === 'worker_accepted'
            ? t.admin.statusAssigned
            : t.admin.statusAvailable
      };
    }
    return {
      taskName: language === 'ta' ? 'புதிய பணிகளுக்கு தயாராக உள்ளார்' : 'Available on standby',
      apartmentId: '—',
      status: 'available',
      statusLabel: t.admin.statusAvailable
    };
  };

  // Analytics chart data
  const categoryChartData = [
    { name: translateCategory('Water & Plumbing', language), count: waterProblemsCount, color: '#0284C7' },
    { name: translateCategory('Electrical & Power', language), count: electricalProblemsCount, color: '#D97706' },
    { name: translateCategory('HVAC & Climate', language), count: hvacProblemsCount, color: '#2E5A44' },
    { name: translateCategory('Civil & Structure', language), count: otherProblemsCount, color: '#6B6255' }
  ];

  const resolutionTrendData = [
    { day: language === 'ta' ? 'திங்கள்' : 'Mon', avgMins: 18, resolved: 4 },
    { day: language === 'ta' ? 'செவ்வாய்' : 'Tue', avgMins: 14, resolved: 6 },
    { day: language === 'ta' ? 'புதன்' : 'Wed', avgMins: 12, resolved: 5 },
    { day: language === 'ta' ? 'வியாழன்' : 'Thu', avgMins: 15, resolved: 7 },
    { day: language === 'ta' ? 'வெள்ளி' : 'Fri', avgMins: 13, resolved: 8 },
    { day: language === 'ta' ? 'சனி' : 'Sat', avgMins: 11, resolved: 4 },
    { day: language === 'ta' ? 'ஞாயிறு' : 'Sun', avgMins: 10, resolved: 3 }
  ];

  // Dynamic greeting based on hour
  const currentHour = new Date().getHours();
  let greetingGreeting = language === 'ta' ? 'காலை வணக்கம்' : 'Good Morning';
  if (currentHour >= 12 && currentHour < 17) {
    greetingGreeting = language === 'ta' ? 'மதிய வணக்கம்' : 'Good Afternoon';
  } else if (currentHour >= 17) {
    greetingGreeting = language === 'ta' ? 'மாலை வணக்கம்' : 'Good Evening';
  }

  return (
    <div className="min-h-screen relative pb-20 font-sans selection:bg-[#2E5A44] selection:text-white">
      {/* Background Apartment Visual with Soft Readability Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20"
        style={{ backgroundImage: "url('/images/hero_community.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#FAFAF8]/95 via-[#FAF8F5]/90 to-[#FAFAF8]/98 pointer-events-none" />

      <div className="relative z-10 app-container pt-6 space-y-8 animate-fade-in">
        
        {/* =========================================================================
            1. HERO AREA: APARTMENT OPERATIONS COMMAND
            ========================================================================= */}
        <section className="relative rounded-3xl overflow-hidden border border-[#E6E0D5] shadow-lg bg-white">
          {/* Hero background image with gradient overlay */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/block_complex.jpg')" }}
          />
          <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/85 via-black/60 to-black/40 backdrop-blur-[2px] pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 text-white space-y-6">
            
            {/* Top Eyebrow & Live Telemetry Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-[#A3E3B8] text-xs font-bold uppercase tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5 text-[#34D399]" />
                <span>{language === 'ta' ? 'நிர்வாகக் கட்டுப்பாட்டு மையம்' : 'ADMIN • APARTMENT OPERATIONS'}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span>{t.admin.continuousStream}</span>
                </span>

                <button
                  onClick={adminLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-red-500/80 text-white border border-white/25 text-xs font-bold backdrop-blur-md shadow-xs transition-all cursor-pointer"
                  title={t.admin.logoutBtn}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.admin.logoutBtn}</span>
                </button>
              </div>
            </div>

            {/* Editorial Heading */}
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {greetingGreeting}, <span className="text-[#A3E3B8]">Admin</span>
              </h1>
              <div className="text-base sm:text-lg font-bold text-white/95">
                {t.admin.title}
              </div>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                {language === 'ta' 
                  ? 'அனைத்து குடியிருப்புகளின் நீர், மின்சாரம், ஏசி சிக்கல்கள், குடியிருப்பாளர் உறுதிசெய்தல் மற்றும் பணியாளர் முன்னேற்றத்தை ஒரே இடத்திலிருந்து கண்காணிக்கவும்.'
                  : 'Monitor current apartment issues, maintenance activity, resident confirmations and worker progress across all towers from one unified workspace.'}
              </p>
            </div>

            {/* Live Operational Metrics Ribbon (Seamless Integration, not giant isolated boxes) */}
            <div className="pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
              
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#A3E3B8]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{totalApartmentsCount}</div>
                  <div className="text-[11px] text-white/75 font-medium">{t.admin.statTotalApartments}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-300">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{activeProblemsCount}</div>
                  <div className="text-[11px] text-red-200 font-medium">{t.admin.statActiveProblems}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{pendingConfirmationsCount + pendingAdminTickets.length}</div>
                  <div className="text-[11px] text-amber-200 font-medium">{t.admin.statPendingConfirmations}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
                <div className="w-10 h-10 rounded-xl bg-[#2E5A44]/60 flex items-center justify-center text-[#A3E3B8]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{workersAvailableCount} / {workers.length}</div>
                  <div className="text-[11px] text-white/75 font-medium">{t.admin.statWorkersAvailable}</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            2. OPERATIONS NAVIGATION TABS
            ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-[#E6E0D5] shadow-xs">
          {[
            { id: 'overview', label: t.admin.tabLiveOps, icon: ShieldAlert },
            { id: 'problems', label: `${t.admin.tabCurrentProblems} (${tickets.length})`, icon: Wrench },
            { id: 'actions', label: `${t.admin.tabPendingActions} (${pendingResidentAlerts.length + pendingAdminTickets.length + pendingWorkerAssignTickets.length})`, icon: Clock, alert: pendingAdminTickets.length > 0 },
            { id: 'workers', label: t.admin.tabWorkerMonitoring, icon: UserCheck },
            { id: 'apartments', label: t.admin.tabApartmentOverview, icon: Building2 },
            { id: 'reports', label: t.admin.tabReportsOverview, icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminView(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2E5A44] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#1C1E21] hover:bg-[#FAF8F5]'
                } ${tab.alert && !isActive ? 'bg-[#FFFBEB] text-[#D97706] font-extrabold border border-[#FDE68A]' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            VIEW 1: LIVE OPERATIONS (Combined Overview)
            ========================================================================= */}
        {adminView === 'overview' && (
          <div className="space-y-10 animate-fade-in">
            
            {/* SECTION: PENDING ACTIONS STRIP */}
            {(pendingAdminTickets.length > 0 || pendingWorkerAssignTickets.length > 0 || pendingResidentAlerts.length > 0) && (
              <div className="p-5 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-[#D97706]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#1C1E21] uppercase tracking-wider">
                        {t.admin.pendingActionsTitle}
                      </h3>
                      <p className="text-xs text-[#6B7280]">{t.admin.pendingActionsSubtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAdminView('actions')}
                    className="text-xs font-bold text-[#2E5A44] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'அனைத்தையும் காண்க' : 'View Pipeline'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Admin Verifications */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-warning text-[10px]">{t.admin.actionAdminVerify}</span>
                      <span className="font-extrabold text-sm text-[#D97706]">{pendingAdminTickets.length}</span>
                    </div>
                    <p className="text-xs text-[#4B5563] line-clamp-2">
                      {pendingAdminTickets.length > 0
                        ? `${pendingAdminTickets[0].apartmentId}: ${pendingAdminTickets[0].problem}`
                        : (language === 'ta' ? 'சரிபார்ப்பு நிலுவையில் இல்லை' : 'No tickets pending verification')}
                    </p>
                    {pendingAdminTickets.length > 0 && (
                      <button
                        onClick={() => adminConfirmTicket(pendingAdminTickets[0].ticketId)}
                        className="w-full py-2 px-3 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        {t.admin.btnVerifyTicket}
                      </button>
                    )}
                  </div>

                  {/* Card 2: Worker Assignments */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-neutral text-[10px]">{t.admin.actionWorkerAssign}</span>
                      <span className="font-extrabold text-sm text-[#0284C7]">{pendingWorkerAssignTickets.length}</span>
                    </div>
                    <p className="text-xs text-[#4B5563] line-clamp-2">
                      {pendingWorkerAssignTickets.length > 0
                        ? `${pendingWorkerAssignTickets[0].apartmentId}: ${pendingWorkerAssignTickets[0].problem}`
                        : (language === 'ta' ? 'பணியாளர் ஒதுக்கீடு நிலுவையில் இல்லை' : 'All confirmed tickets assigned')}
                    </p>
                    {pendingWorkerAssignTickets.length > 0 && (
                      <button
                        onClick={() => setDispatchingTicket(pendingWorkerAssignTickets[0])}
                        className="w-full py-2 px-3 rounded-xl bg-[#1C1E21] hover:bg-black text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        {t.admin.btnDispatchWorker}
                      </button>
                    )}
                  </div>

                  {/* Card 3: Resident Confirmations */}
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-danger text-[10px]">{t.admin.actionResidentPending}</span>
                      <span className="font-extrabold text-sm text-[#DC2626]">{pendingResidentAlerts.length}</span>
                    </div>
                    <p className="text-xs text-[#4B5563] line-clamp-2">
                      {pendingResidentAlerts.length > 0
                        ? `${pendingResidentAlerts[0].apartmentId}: ${pendingResidentAlerts[0].issueTitle} (${pendingResidentAlerts[0].confidence}%)`
                        : (language === 'ta' ? 'AI எச்சரிக்கைகள் அனைத்தும் உறுதி செய்யப்பட்டன' : 'No AI detections awaiting resident')}
                    </p>
                    {pendingResidentAlerts.length > 0 && (
                      <button
                        onClick={() => setInspectingAlert(pendingResidentAlerts[0])}
                        className="w-full py-2 px-3 rounded-xl border border-[#DCD6CB] hover:bg-white text-[#1C1E21] font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        {t.admin.viewDetails}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: WHAT IS HAPPENING NOW (Current Operations) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE7DF] pb-3">
                <div className="space-y-0.5">
                  <div className="eyebrow text-[#2E5A44]">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'நிகழ்நேர செயல்பாடுகள்' : 'WHAT IS HAPPENING NOW'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1E21] tracking-tight">
                    {t.admin.currentProblemsTitle}
                  </h2>
                </div>

                <div className="text-xs text-[#6B7280]">
                  {language === 'ta' ? 'முழு விவரங்களை ஆய்வு செய்ய வரிசையை கிளிக் செய்க' : 'Click any row to inspect complete sensor diagnostics & history'}
                </div>
              </div>

              {/* Clean Horizontal Operations Table (Not generic boxes) */}
              <div className="rounded-3xl overflow-hidden bg-white border border-[#E6E0D5] shadow-sm divide-y divide-[#EBE7DF]">
                
                {/* Header row */}
                <div className="hidden lg:grid grid-cols-12 gap-4 p-4.5 bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  <div className="col-span-2">{t.admin.colApartment}</div>
                  <div className="col-span-3">{t.admin.colProblem}</div>
                  <div className="col-span-2">{t.admin.colDetection}</div>
                  <div className="col-span-2">{t.admin.colWorkerAssigned}</div>
                  <div className="col-span-2">{t.admin.colStatus}</div>
                  <div className="col-span-1 text-right">{t.admin.colActions}</div>
                </div>

                {/* Operations Rows */}
                {tickets.map((tkt) => (
                  <div
                    key={tkt.ticketId}
                    onClick={() => setInspectingTicket(tkt)}
                    className="p-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 items-start lg:items-center hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                  >
                    {/* Apartment & Resident */}
                    <div className="lg:col-span-2 flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${
                        tkt.priority === 'critical' ? 'bg-[#DC2626] animate-pulse' :
                        tkt.priority === 'high' ? 'bg-[#D97706]' : 'bg-[#2E5A44]'
                      }`} />
                      <div>
                        <div className="font-extrabold text-sm text-[#1C1E21] group-hover:text-[#2E5A44] transition-colors flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2E5A44]" />
                          <span>{tkt.apartmentId}</span>
                        </div>
                        <div className="text-[11px] text-[#6B7280]">{tkt.residentName}</div>
                      </div>
                    </div>

                    {/* Problem & Category */}
                    <div className="lg:col-span-3">
                      <div className="font-bold text-xs sm:text-sm text-[#1C1E21]">{tkt.problem}</div>
                      <div className="text-[11px] text-[#6B6255] flex items-center gap-1 mt-0.5">
                        {tkt.category === 'Water & Plumbing' && <Droplets className="w-3 h-3 text-[#0284C7]" />}
                        {tkt.category === 'Electrical & Power' && <Zap className="w-3 h-3 text-[#D97706]" />}
                        {tkt.category === 'HVAC & Climate' && <Wind className="w-3 h-3 text-[#2E5A44]" />}
                        <span>{translateCategory(tkt.category, language)}</span>
                      </div>
                    </div>

                    {/* Detection / Confidence */}
                    <div className="lg:col-span-2 text-xs">
                      {tkt.aiConfidence ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-lg border border-[#BAE6FD]">
                          <Sparkles className="w-3 h-3 text-[#0284C7]" />
                          AI Flagged ({tkt.aiConfidence}%)
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#6B7280]">
                          {language === 'ta' ? 'குடியிருப்பாளர் புகார்' : 'Resident Reported'}
                        </span>
                      )}
                      <div className="text-[10px] text-[#8A8275] mt-0.5 font-mono">{tkt.createdAt}</div>
                    </div>

                    {/* Worker Assigned */}
                    <div className="lg:col-span-2 text-xs">
                      {tkt.workerName ? (
                        <div className="flex items-center gap-2.5">
                          {tkt.workerAvatar && (
                            <img src={tkt.workerAvatar} alt={tkt.workerName} className="w-7 h-7 rounded-xl object-cover border border-[#E6E0D5]" />
                          )}
                          <div>
                            <div className="font-bold text-[#1C1E21]">{tkt.workerName}</div>
                            <div className="text-[10px] text-[#6B7280]">{tkt.workerSkill}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#D97706] font-bold bg-[#FFFBEB] px-2.5 py-1 rounded-lg border border-[#FDE68A]">
                          {t.common.unassigned}
                        </span>
                      )}
                    </div>

                    {/* Current Status */}
                    <div className="lg:col-span-2">
                      <span className={`badge ${
                        tkt.status === 'work_in_progress' || tkt.status === 'worker_en_route'
                          ? 'badge-warning'
                          : tkt.status === 'work_completed' || tkt.status === 'resident_verified'
                          ? 'badge-healthy'
                          : 'badge-neutral'
                      } text-[10px]`}>
                        {translateStatus(tkt.status, language)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-1 text-right w-full lg:w-auto" onClick={(e) => e.stopPropagation()}>
                      {tkt.status === 'resident_confirmed' ? (
                        <button
                          onClick={() => adminConfirmTicket(tkt.ticketId)}
                          className="px-3 py-1.5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                        >
                          {t.admin.btnVerify}
                        </button>
                      ) : !tkt.workerId || tkt.status === 'admin_confirmed' ? (
                        <button
                          onClick={() => setDispatchingTicket(tkt)}
                          className="px-3 py-1.5 rounded-xl bg-[#1C1E21] hover:bg-black text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                        >
                          {t.admin.btnDispatch}
                        </button>
                      ) : (
                        <button
                          onClick={() => setInspectingTicket(tkt)}
                          className="text-xs text-[#2E5A44] font-bold hover:underline cursor-pointer"
                        >
                          {t.admin.viewDetails} →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Also show pending AI Alerts in the operations list */}
                {pendingResidentAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => setInspectingAlert(alt)}
                    className="p-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 items-start lg:items-center bg-[#FFFBEB]/35 hover:bg-[#FFFBEB]/70 transition-colors cursor-pointer group"
                  >
                    <div className="lg:col-span-2 flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#D97706] animate-pulse shrink-0" />
                      <div>
                        <div className="font-extrabold text-sm text-[#1C1E21] group-hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{alt.apartmentId}</span>
                        </div>
                        <div className="text-[11px] text-[#6B7280]">Floor {alt.apartmentId.split('-')[1]?.[0] || '1'}</div>
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <div className="font-bold text-xs sm:text-sm text-[#1C1E21]">{alt.issueTitle}</div>
                      <div className="text-[11px] text-[#6B6255]">{translateCategory(alt.category, language)}</div>
                    </div>

                    <div className="lg:col-span-2 text-xs">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-lg border border-[#FCD34D]">
                        <Sparkles className="w-3 h-3" />
                        AI ({alt.confidence}%)
                      </span>
                      <div className="text-[10px] text-[#8A8275] mt-0.5 font-mono">{alt.detectedAt}</div>
                    </div>

                    <div className="lg:col-span-2 text-xs text-[#8A8275]">
                      {language === 'ta' ? 'குடியிருப்பாளர் உறுதிக்கு காத்திருக்கிறது' : 'Awaiting resident check'}
                    </div>

                    <div className="lg:col-span-2">
                      <span className="badge badge-warning text-[10px]">
                        {t.admin.actionResidentPending}
                      </span>
                    </div>

                    <div className="lg:col-span-1 text-right w-full lg:w-auto" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setInspectingAlert(alt)}
                        className="px-3 py-1.5 rounded-xl border border-[#DCD6CB] hover:bg-white text-[#1C1E21] font-bold text-xs shadow-xs cursor-pointer"
                      >
                        {t.admin.viewDetails}
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* SECTION: RECENT ACTIVITY TIMELINE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-4">
                <div className="space-y-1">
                  <div className="eyebrow text-[#2E5A44]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'நேரடி செயல்பாட்டு பதிவு' : 'OPERATIONS TIMELINE'}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1C1E21]">
                    {language === 'ta' ? 'சமீபத்திய செயல்பாடுகள்' : 'Recent Operational Activity'}
                  </h3>
                </div>
                <span className="text-xs text-[#6B7280]">Live stream active</span>
              </div>

              <div className="space-y-4">
                {activity.slice(0, 6).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start gap-4 text-xs group">
                    <div className="w-16 font-mono text-[#8A8275] text-[11px] shrink-0 pt-0.5">
                      {item.timestamp}
                    </div>

                    <div className="relative flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                        item.type === 'ai_alert' ? 'bg-[#D97706]' :
                        item.type === 'resident_confirm' ? 'bg-[#0284C7]' :
                        item.type === 'worker_action' ? 'bg-[#2E5A44]' : 'bg-[#16A34A]'
                      }`} />
                      {idx !== activity.slice(0, 6).length - 1 && (
                        <div className="w-0.5 h-10 bg-[#E6E0D5] my-1" />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="font-bold text-sm text-[#1C1E21]">
                        {item.title}
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {item.description}
                      </p>
                      {item.apartmentId && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#2E5A44] bg-[#E8EFEA] px-2 py-0.5 rounded">
                          Unit {item.apartmentId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: CURRENT PROBLEMS (Dedicated View)
            ========================================================================= */}
        {adminView === 'problems' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE7DF] pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1C1E21]">{t.admin.currentProblemsTitle}</h2>
                <p className="text-xs text-[#6B7280]">{t.admin.currentProblemsSubtitle}</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden bg-white border border-[#E6E0D5] shadow-sm divide-y divide-[#EBE7DF]">
              {tickets.map((tkt) => (
                <div
                  key={tkt.ticketId}
                  onClick={() => setInspectingTicket(tkt)}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-extrabold text-base text-[#2E5A44] flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{tkt.apartmentId}</span>
                      </span>
                      <span className="text-xs text-[#8A8275]">•</span>
                      <span className="font-bold text-sm sm:text-base text-[#1C1E21]">{tkt.problem}</span>
                      <span className={`badge ${
                        tkt.priority === 'critical' || tkt.priority === 'high' ? 'badge-danger' : 'badge-warning'
                      } text-[10px]`}>
                        {translatePriority(tkt.priority, language)}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280] max-w-2xl leading-relaxed">{tkt.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8A8275] pt-1">
                      <span>{t.common.resident}: <strong className="text-[#1C1E21]">{tkt.residentName}</strong></span>
                      <span>{t.common.worker}: <strong className="text-[#1C1E21]">{tkt.workerName || t.common.unassigned}</strong></span>
                      <span className="font-mono">{tkt.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="badge badge-neutral text-xs">
                      {translateStatus(tkt.status, language)}
                    </span>
                    <button className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD6CB] text-[#1C1E21] group-hover:bg-[#2E5A44] group-hover:text-white transition-colors cursor-pointer">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: PENDING ACTIONS (Direct Execution Pipeline)
            ========================================================================= */}
        {adminView === 'actions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#EBE7DF] pb-4">
              <h2 className="text-2xl font-extrabold text-[#1C1E21]">{t.admin.pendingActionsTitle}</h2>
              <p className="text-xs text-[#6B7280]">{t.admin.pendingActionsSubtitle}</p>
            </div>

            <div className="space-y-4">
              {/* 1. Admin Verification Pending */}
              {pendingAdminTickets.map((tkt) => (
                <div key={tkt.ticketId} className="p-6 rounded-3xl bg-white border border-[#FDE68A] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-warning text-[10px]">{t.admin.actionAdminVerify}</span>
                      <span className="font-extrabold text-base text-[#1C1E21]">{tkt.apartmentId} • {tkt.problem}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">{tkt.description}</p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => adminConfirmTicket(tkt.ticketId)}
                      className="py-2.5 px-5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      {t.admin.btnVerifyTicket}
                    </button>
                    <button
                      onClick={() => setInspectingTicket(tkt)}
                      className="py-2.5 px-4 rounded-xl border border-[#DCD6CB] text-[#1C1E21] font-bold text-xs hover:bg-[#FAF8F5] cursor-pointer"
                    >
                      {t.admin.viewDetails}
                    </button>
                  </div>
                </div>
              ))}

              {/* 2. Worker Assignment Pending */}
              {pendingWorkerAssignTickets.map((tkt) => (
                <div key={tkt.ticketId} className="p-6 rounded-3xl bg-white border border-[#BAE6FD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-neutral text-[10px]">{t.admin.actionWorkerAssign}</span>
                      <span className="font-extrabold text-base text-[#1C1E21]">{tkt.apartmentId} • {tkt.problem}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">{tkt.description}</p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setDispatchingTicket(tkt)}
                      className="py-2.5 px-5 rounded-xl bg-[#1C1E21] hover:bg-black text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      {t.admin.btnDispatchWorker}
                    </button>
                    <button
                      onClick={() => setInspectingTicket(tkt)}
                      className="py-2.5 px-4 rounded-xl border border-[#DCD6CB] text-[#1C1E21] font-bold text-xs hover:bg-[#FAF8F5] cursor-pointer"
                    >
                      {t.admin.viewDetails}
                    </button>
                  </div>
                </div>
              ))}

              {/* 3. Resident Confirmation Pending */}
              {pendingResidentAlerts.map((alt) => (
                <div key={alt.id} className="p-6 rounded-3xl bg-white border border-[#FCA5A5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-danger text-[10px]">{t.admin.actionResidentPending}</span>
                      <span className="font-extrabold text-base text-[#1C1E21]">{alt.apartmentId} • {alt.issueTitle}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">{alt.explanation}</p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setInspectingAlert(alt)}
                      className="py-2.5 px-5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      {t.admin.viewDetails}
                    </button>
                  </div>
                </div>
              ))}

              {pendingAdminTickets.length === 0 && pendingWorkerAssignTickets.length === 0 && pendingResidentAlerts.length === 0 && (
                <div className="p-12 rounded-3xl bg-white border border-[#E6E0D5] text-center space-y-2 text-[#6B7280]">
                  <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-2" />
                  <h3 className="text-base font-bold text-[#1C1E21]">{t.admin.noPendingActions}</h3>
                  <p className="text-xs">All apartment alerts and work orders have been processed.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 4: WORKER MONITORING (Roster & Availability Pipeline)
            ========================================================================= */}
        {adminView === 'workers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE7DF] pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1C1E21]">{t.admin.workerMonitoringTitle}</h2>
                <p className="text-xs text-[#6B7280]">{t.admin.workerMonitoringSubtitle}</p>
              </div>

              {/* Filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'all', label: t.admin.filterAllWorkers },
                  { id: 'available', label: t.admin.filterAvailable },
                  { id: 'assigned', label: t.admin.filterAssigned },
                  { id: 'en_route', label: t.admin.filterEnRoute },
                  { id: 'working', label: t.admin.filterWorking },
                  { id: 'completed', label: t.admin.filterCompletedWorkers }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setWorkerStatusFilter(btn.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      workerStatusFilter === btn.id
                        ? 'bg-[#2E5A44] text-white shadow-xs'
                        : 'bg-white border border-[#DCD6CB] text-[#6B7280] hover:text-[#1C1E21]'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden bg-white border border-[#E6E0D5] shadow-sm divide-y divide-[#EBE7DF]">
              {/* Header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 p-4.5 bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                <div className="col-span-3">{t.admin.colWorkerName}</div>
                <div className="col-span-2">{t.admin.colSkill}</div>
                <div className="col-span-3">{t.admin.colCurrentTask}</div>
                <div className="col-span-1">{t.admin.colWorkerApt}</div>
                <div className="col-span-2">{t.admin.colWorkerStatus}</div>
                <div className="col-span-1 text-right">{t.admin.colAvailability}</div>
              </div>

              {/* Worker rows */}
              {filteredWorkers.map((worker) => {
                const currentTask = getWorkerCurrentTask(worker);
                return (
                  <div key={worker.id} className="p-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 items-start lg:items-center hover:bg-[#FAF8F5] transition-colors">
                    
                    {/* Worker name & avatar */}
                    <div className="lg:col-span-3 flex items-center gap-3">
                      <img src={worker.avatar} alt={worker.name} className="w-11 h-11 rounded-2xl object-cover border border-[#E6E0D5]" />
                      <div>
                        <div className="font-bold text-sm text-[#1C1E21]">{worker.name}</div>
                        <div className="text-[11px] text-[#6B7280]">{worker.phone} • {worker.rating}★</div>
                      </div>
                    </div>

                    {/* Skill */}
                    <div className="lg:col-span-2">
                      <span className="font-bold text-xs text-[#2E5A44] bg-[#E8EFEA] px-2.5 py-1 rounded-lg">
                        {worker.role}
                      </span>
                    </div>

                    {/* Current Task */}
                    <div className="lg:col-span-3">
                      <div className="font-bold text-xs text-[#1C1E21] truncate">{currentTask.taskName}</div>
                      <div className="text-[10px] text-[#8A8275]">
                        {worker.activeTasks > 0 ? `${worker.activeTasks} ${t.worker.tasks} active` : t.worker.allTasksDone}
                      </div>
                    </div>

                    {/* Apartment */}
                    <div className="lg:col-span-1 font-bold text-xs text-[#1C1E21]">
                      {currentTask.apartmentId}
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2">
                      <span className={`badge ${
                        currentTask.status === 'work_in_progress'
                          ? 'badge-warning'
                          : currentTask.status === 'worker_en_route'
                          ? 'badge-neutral'
                          : currentTask.status === 'available'
                          ? 'badge-healthy'
                          : 'badge-warning'
                      } text-[10px]`}>
                        {currentTask.statusLabel}
                      </span>
                    </div>

                    {/* Availability */}
                    <div className="lg:col-span-1 text-right">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        worker.isAvailable ? 'text-[#2E7D32]' : 'text-[#8A8275]'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${worker.isAvailable ? 'bg-[#2E7D32]' : 'bg-[#9CA3AF]'}`} />
                        {worker.isAvailable ? t.admin.statusAvailable : 'Off Duty'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 5: APARTMENT OVERVIEW (Multi-filter Matrix & Visual Context)
            ========================================================================= */}
        {adminView === 'apartments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#EBE7DF] pb-4 space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1C1E21]">{t.admin.apartmentOverviewTitle}</h2>
                <p className="text-xs text-[#6B7280]">{t.admin.apartmentOverviewSubtitle}</p>
              </div>

              {/* Filter controls row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                {/* 1. Apartment search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8A8275]" />
                  <input
                    type="text"
                    placeholder={t.admin.filterSearchPlaceholder}
                    value={aptSearch}
                    onChange={(e) => setAptSearch(e.target.value)}
                    className="form-input pl-9 text-xs py-2 w-full rounded-xl bg-white border-[#DCD6CB]"
                  />
                </div>

                {/* 2. Problem type filter */}
                <select
                  value={aptCategoryFilter}
                  onChange={(e) => setAptCategoryFilter(e.target.value)}
                  className="form-select text-xs py-2 rounded-xl bg-white border-[#DCD6CB]"
                >
                  <option value="all">{t.admin.filterAllCategories}</option>
                  <option value="Water & Plumbing">{translateCategory('Water & Plumbing', language)}</option>
                  <option value="Electrical & Power">{translateCategory('Electrical & Power', language)}</option>
                  <option value="HVAC & Climate">{translateCategory('HVAC & Climate', language)}</option>
                  <option value="Civil & Structure">{translateCategory('Civil & Structure', language)}</option>
                </select>

                {/* 3. Status filter */}
                <select
                  value={aptStatusFilter}
                  onChange={(e) => setAptStatusFilter(e.target.value)}
                  className="form-select text-xs py-2 rounded-xl bg-white border-[#DCD6CB]"
                >
                  <option value="all">{t.admin.filterAllStatuses}</option>
                  <option value="healthy">{t.common.healthy}</option>
                  <option value="warning">{t.common.warning}</option>
                  <option value="in_progress">{t.common.inProgress}</option>
                  <option value="completed">{t.common.completed}</option>
                </select>

                {/* 4. Worker filter */}
                <select
                  value={aptWorkerFilter}
                  onChange={(e) => setAptWorkerFilter(e.target.value)}
                  className="form-select text-xs py-2 rounded-xl bg-white border-[#DCD6CB]"
                >
                  <option value="all">{t.admin.filterAllWorkersOpt}</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
                  ))}
                  <option value="unassigned">{t.common.unassigned}</option>
                </select>

                {/* 5. Reset button */}
                <button
                  onClick={() => {
                    setAptSearch('');
                    setAptCategoryFilter('all');
                    setAptStatusFilter('all');
                    setAptWorkerFilter('all');
                  }}
                  className="py-2 px-3 rounded-xl border border-[#DCD6CB] hover:bg-white text-xs font-bold text-[#4B5563] cursor-pointer text-center bg-[#FAF8F5]"
                >
                  {language === 'ta' ? 'வடிகட்டிகளை மீட்டமைக்க' : 'Reset Filters'}
                </button>

              </div>
            </div>

            {/* Apartment community table */}
            <div className="rounded-3xl overflow-hidden bg-white border border-[#E6E0D5] shadow-sm divide-y divide-[#EBE7DF]">
              <div className="hidden lg:grid grid-cols-12 gap-3 p-4.5 bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                <div className="col-span-2">{t.admin.thApartment}</div>
                <div className="col-span-3">{t.admin.thProblemType}</div>
                <div className="col-span-1">{t.admin.thSeverity}</div>
                <div className="col-span-2">{t.admin.thResidentConfirmed}</div>
                <div className="col-span-2">{t.admin.thWorkerHandling}</div>
                <div className="col-span-2 text-right">{t.admin.thMaintStatus}</div>
              </div>

              {filteredApartmentOverview.map((apt) => {
                const aptTkt = tickets.find((t) => t.apartmentId === apt.id);
                const aptAlt = aiAlerts.find((a) => a.apartmentId === apt.id);

                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedApartmentForDrawer(apt)}
                    className="p-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 items-start lg:items-center hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                  >
                    {/* Apartment & Resident */}
                    <div className="lg:col-span-2 flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${
                        apt.status === 'healthy' ? 'bg-[#2E7D32]' : 'bg-[#DC2626]'
                      }`} />
                      <div>
                        <div className="font-extrabold text-sm text-[#1C1E21] group-hover:text-[#2E5A44] transition-colors flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2E5A44]" />
                          <span>{apt.id}</span>
                        </div>
                        <div className="text-[11px] text-[#6B7280] truncate">{apt.resident.name}</div>
                      </div>
                    </div>

                    {/* Problem Type */}
                    <div className="lg:col-span-3 text-xs">
                      {aptTkt ? (
                        <div>
                          <div className="font-bold text-[#1C1E21]">{aptTkt.problem}</div>
                          <div className="text-[11px] text-[#6B6255]">{translateCategory(aptTkt.category, language)}</div>
                        </div>
                      ) : aptAlt ? (
                        <div>
                          <div className="font-bold text-[#D97706]">{aptAlt.issueTitle}</div>
                          <div className="text-[11px] text-[#8A8275]">AI Flagged</div>
                        </div>
                      ) : (
                        <div className="text-[#2E7D32] font-semibold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'ta' ? 'அனைத்து அமைப்புகளும் சீராக உள்ளன' : 'Normal Operation'}</span>
                        </div>
                      )}
                    </div>

                    {/* Severity */}
                    <div className="lg:col-span-1">
                      {aptTkt ? (
                        <span className={`badge ${
                          aptTkt.priority === 'critical' || aptTkt.priority === 'high' ? 'badge-danger' : 'badge-warning'
                        } text-[9px]`}>
                          {translatePriority(aptTkt.priority, language)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#8A8275]">Low</span>
                      )}
                    </div>

                    {/* Resident Confirmed */}
                    <div className="lg:col-span-2 text-xs">
                      {aptTkt ? (
                        <span className="text-[#2E7D32] font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmed</span>
                        </span>
                      ) : aptAlt ? (
                        <span className="text-[#D97706] font-bold text-xs">Pending Verification</span>
                      ) : (
                        <span className="text-[#8A8275]">—</span>
                      )}
                    </div>

                    {/* Worker Handling */}
                    <div className="lg:col-span-2 text-xs">
                      {aptTkt?.workerName ? (
                        <div className="font-bold text-[#1C1E21]">{aptTkt.workerName}</div>
                      ) : (
                        <span className="text-[#8A8275]">—</span>
                      )}
                    </div>

                    {/* Maintenance Status */}
                    <div className="lg:col-span-2 text-right">
                      <span className={`badge ${
                        apt.status === 'healthy'
                          ? 'badge-healthy'
                          : apt.status === 'maintenance'
                          ? 'badge-warning'
                          : 'badge-danger'
                      } text-[10px]`}>
                        {translateStatus(apt.status, language)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 6: REPORT / OVERVIEW (Visual Analytics & Community Overview)
            ========================================================================= */}
        {adminView === 'reports' && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-[#EBE7DF] pb-4">
              <h2 className="text-2xl font-extrabold text-[#1C1E21]">{t.admin.reportsOverviewTitle}</h2>
              <p className="text-xs text-[#6B7280]">{t.admin.reportsOverviewSubtitle}</p>
            </div>

            {/* Metric Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
              
              <div className="p-4 rounded-2xl bg-white border border-[#E6E0D5] text-center shadow-xs">
                <div className="text-[10px] font-bold text-[#6B7280] uppercase truncate">{t.admin.metricTotalProblems}</div>
                <div className="text-2xl font-extrabold text-[#1C1E21] mt-1">{totalProblemsReported}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-center shadow-xs">
                <div className="text-[10px] font-bold text-[#2E7D32] uppercase truncate">{t.admin.metricResolvedProblems}</div>
                <div className="text-2xl font-extrabold text-[#2E7D32] mt-1">{resolvedProblemsCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-center shadow-xs">
                <div className="text-[10px] font-bold text-[#B45309] uppercase truncate">{t.admin.metricPendingProblems}</div>
                <div className="text-2xl font-extrabold text-[#B45309] mt-1">{pendingProblemsTotal}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] text-center shadow-xs">
                <div className="text-[10px] font-bold text-[#0369A1] uppercase truncate">{t.admin.metricWaterProblems}</div>
                <div className="text-2xl font-extrabold text-[#0369A1] mt-1">{waterProblemsCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] text-center shadow-xs">
                <div className="text-[10px] font-bold text-[#B45309] uppercase truncate">{t.admin.metricElectricalProblems}</div>
                <div className="text-2xl font-extrabold text-[#B45309] mt-1">{electricalProblemsCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8EFEA] border border-[#7E9E8B]/40 text-center shadow-xs">
                <div className="text-[10px] font-bold text-[#2E5A44] uppercase truncate">{t.admin.metricHvacProblems}</div>
                <div className="text-2xl font-extrabold text-[#2E5A44] mt-1">{hvacProblemsCount}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6E0D5] text-center shadow-xs">
                <div className="text-[10px] font-bold text-[#6B7280] uppercase truncate">{t.admin.metricOtherProblems}</div>
                <div className="text-2xl font-extrabold text-[#1C1E21] mt-1">{otherProblemsCount}</div>
              </div>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Category Distribution */}
              <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider">
                  {t.admin.chartProblemBreakdown}
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <XAxis dataKey="name" fontSize={11} stroke="#6B6255" />
                      <YAxis fontSize={11} stroke="#6B6255" />
                      <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E6E0D5', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
                      <Bar dataKey="count" fill="#2E5A44" radius={[8, 8, 0, 0]} name={t.common.ticket} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Average Resolution Time */}
              <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider">
                  {t.admin.chartResolutionTrend}
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={resolutionTrendData}>
                      <XAxis dataKey="day" fontSize={11} stroke="#6B6255" />
                      <YAxis fontSize={11} stroke="#6B6255" />
                      <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E6E0D5', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
                      <Area type="monotone" dataKey="avgMins" stroke="#2E5A44" fill="#E8EFEA" strokeWidth={2.5} name={t.worker.mins} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: TICKET / ISSUE DETAILS INSPECTION MODAL
            ========================================================================= */}
        {inspectingTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#E6E0D5] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-start justify-between gap-4 border-b border-[#EBE7DF] pb-4">
                <div>
                  <span className="badge badge-warning text-xs mb-1">
                    {translateStatus(inspectingTicket.status, language)}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#1C1E21]">{inspectingTicket.problem}</h3>
                  <p className="text-xs text-[#6B7280]">
                    {t.common.ticket} {inspectingTicket.ticketId} • {t.common.apartment} {inspectingTicket.apartmentId}
                  </p>
                </div>
                <button
                  onClick={() => setInspectingTicket(null)}
                  className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#8A8275] hover:text-[#1C1E21] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2">
                  <div className="font-bold text-[#1C1E21]">{t.admin.fieldSensorEvidence}</div>
                  <p className="text-[#4B5563] leading-relaxed">{inspectingTicket.description}</p>
                  {inspectingTicket.sensorReading && (
                    <div className="text-[11px] font-mono text-[#0284C7] bg-white p-2.5 rounded-xl border border-[#EBE7DF]">
                      {inspectingTicket.sensorReading}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#8A8275]">{t.common.resident}</span>
                    <div className="font-bold text-sm text-[#1C1E21] mt-0.5">{inspectingTicket.residentName}</div>
                  </div>
                  <div>
                    <span className="text-[#8A8275]">{t.admin.fieldAssignedWorker}</span>
                    <div className="font-bold text-sm text-[#2E5A44] mt-0.5">
                      {inspectingTicket.workerName || t.common.unassigned}
                    </div>
                  </div>
                </div>

                {/* Problem Found & Solution Provided if completed */}
                {inspectingTicket.solutionProvided && (
                  <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] space-y-1">
                    <div className="font-bold text-[#2E7D32]">{t.worker.solutionProvidedLabel}</div>
                    <p className="text-[#4B5563]">{inspectingTicket.solutionProvided}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-2 pt-2 border-t border-[#EBE7DF]">
                  <div className="font-bold text-[#1C1E21] uppercase tracking-wider text-[11px]">
                    {t.admin.fieldTimeline}
                  </div>
                  <div className="space-y-2.5">
                    {inspectingTicket.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-[#2E5A44] mt-1.5 shrink-0" />
                        <div>
                          <span className="font-bold text-[#1C1E21] font-mono">{item.timestamp}</span>: {item.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EBE7DF]">
                <button
                  type="button"
                  onClick={() => setInspectingTicket(null)}
                  className="py-2.5 px-4 rounded-xl border border-[#DCD6CB] text-xs font-bold text-[#4B5563] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  {t.admin.btnClose}
                </button>
                {inspectingTicket.status === 'resident_confirmed' && (
                  <button
                    type="button"
                    onClick={() => {
                      adminConfirmTicket(inspectingTicket.ticketId);
                      setInspectingTicket(null);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {t.admin.btnVerifyTicket}
                  </button>
                )}
                {(!inspectingTicket.workerId || inspectingTicket.status === 'admin_confirmed') && (
                  <button
                    type="button"
                    onClick={() => {
                      setDispatchingTicket(inspectingTicket);
                      setInspectingTicket(null);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-[#1C1E21] hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {t.admin.btnDispatchWorker}
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: AI ALERT DETAILS INSPECTION
            ========================================================================= */}
        {inspectingAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E6E0D5] shadow-2xl space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#EBE7DF] pb-4">
                <div>
                  <span className="badge badge-danger text-xs mb-1">
                    AI Confidence: {inspectingAlert.confidence}%
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1C1E21]">{inspectingAlert.issueTitle}</h3>
                  <p className="text-xs text-[#6B7280]">{t.common.apartment} {inspectingAlert.apartmentId}</p>
                </div>
                <button
                  onClick={() => setInspectingAlert(null)}
                  className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#8A8275] hover:text-[#1C1E21] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-1">
                  <span className="text-[#8A8275]">{t.admin.fieldSensorEvidence}:</span>
                  <p className="font-bold text-[#1C1E21]">{inspectingAlert.sensorName}</p>
                  <p className="text-[#6B7280]">{inspectingAlert.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF]">
                    <span className="text-[#8A8275]">Reading:</span>
                    <div className="font-extrabold text-sm text-[#DC2626] mt-0.5">{inspectingAlert.readingValue} {inspectingAlert.unit}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EBE7DF]">
                    <span className="text-[#8A8275]">Normal Range:</span>
                    <div className="font-bold text-sm text-[#2E7D32] mt-0.5">{inspectingAlert.normalRange}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EBE7DF]">
                <button
                  type="button"
                  onClick={() => setInspectingAlert(null)}
                  className="w-full py-2.5 rounded-xl bg-[#1C1E21] text-white text-xs font-bold hover:bg-black cursor-pointer"
                >
                  {t.admin.btnClose}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL: WORKER DISPATCH DIALOG
            ========================================================================= */}
        {dispatchingTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E6E0D5] shadow-2xl space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#EBE7DF] pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1C1E21]">{t.admin.dispatchModalTitle}</h3>
                  <p className="text-xs text-[#6B7280]">{t.common.ticket} {dispatchingTicket.ticketId} • {dispatchingTicket.apartmentId}</p>
                </div>
                <button
                  onClick={() => setDispatchingTicket(null)}
                  className="p-2 rounded-full hover:bg-[#FAF8F5] text-[#8A8275] hover:text-[#1C1E21] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-[#4B5563]">{t.admin.selectAvailableTech}</div>
                {workers.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleAssignWorker(dispatchingTicket.ticketId, w.id)}
                    className="w-full p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] hover:border-[#2E5A44] hover:bg-white text-left transition-all flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={w.avatar} alt={w.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-[#1C1E21] group-hover:text-[#2E5A44] transition-colors">{w.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{w.role} • {w.activeTasks} {t.worker.tasks} active</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2E5A44] group-hover:translate-x-1 transition-transform">
                      {t.admin.assignArrow}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDispatchingTicket(null)}
                className="w-full p-3 rounded-xl border border-[#DCD6CB] text-xs font-bold text-[#4B5563] hover:bg-[#FAF8F5] cursor-pointer"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
