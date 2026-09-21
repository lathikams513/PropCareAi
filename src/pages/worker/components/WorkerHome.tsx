import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MaintenanceTicket } from '../../../types';
import { WorkerNavTab } from './WorkerSidebar';
import { WorkCompletionModal } from './WorkCompletionModal';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Activity, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Radio, 
  FileCheck2,
  Calendar,
  Layers
} from 'lucide-react';

interface WorkerHomeProps {
  onNavigate: (tab: WorkerNavTab, ticketId?: string) => void;
}

export const WorkerHome: React.FC<WorkerHomeProps> = ({ onNavigate }) => {
  const { workers, currentWorkerId, tickets, updateWorkerJobStatus, rejectWorkerJob, t, language } = useApp();

  const [completionTicket, setCompletionTicket] = useState<MaintenanceTicket | null>(null);

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar',
    role: 'Plumber',
    rating: 4.92,
    shiftStatus: 'available'
  };

  // Get current hour for greeting
  const currentHour = new Date().getHours();
  let greetingText = t.worker.greetingMorning;
  if (currentHour >= 12 && currentHour < 17) greetingText = t.worker.greetingAfternoon;
  if (currentHour >= 17) greetingText = t.worker.greetingEvening;

  const myTickets = tickets.filter((t) => t.workerId === currentWorker.id || t.workerName === currentWorker.name);
  
  // Current Job is the first active or assigned job
  const activeJob = myTickets.find((t) => ['work_in_progress', 'worker_en_route', 'worker_accepted'].includes(t.status)) 
    || myTickets.find((t) => t.status === 'worker_assigned') 
    || myTickets[0];

  // Stats calculation
  const todaysAssignments = myTickets.length;
  const pendingJobs = myTickets.filter((t) => t.status === 'worker_assigned' || t.status === 'admin_confirmed').length;
  const inProgressJobs = myTickets.filter((t) => ['worker_accepted', 'worker_en_route', 'work_in_progress'].includes(t.status)).length;
  const completedJobs = myTickets.filter((t) => t.status === 'work_completed' || t.status === 'resident_verified').length;
  const totalJobs = (currentWorker.completedTasks || 180) + completedJobs;
  const avgCompletionTime = '38 mins';

  // Work Progress Steps
  const workflowSteps = [
    { id: 'assigned', label: 'Assigned', isDone: true },
    { id: 'accepted', label: 'Accepted', isDone: ['worker_accepted', 'worker_en_route', 'work_in_progress', 'work_completed', 'resident_verified'].includes(activeJob?.status || '') },
    { id: 'on_the_way', label: 'On The Way', isDone: ['worker_en_route', 'work_in_progress', 'work_completed', 'resident_verified'].includes(activeJob?.status || '') },
    { id: 'arrived', label: 'Arrived', isDone: ['work_in_progress', 'work_completed', 'resident_verified'].includes(activeJob?.status || '') },
    { id: 'working', label: 'Working', isDone: ['work_in_progress', 'work_completed', 'resident_verified'].includes(activeJob?.status || '') },
    { id: 'completed', label: 'Completed', isDone: ['work_completed', 'resident_verified'].includes(activeJob?.status || '') },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in font-sans">
      
      {/* =========================================================================
          1. WORKER HERO AREA (Matching Homepage Aesthetics)
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-[#E6E0D5] shadow-lg bg-white">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/corridor_floor.jpg')" }}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/80 via-black/60 to-black/35 backdrop-blur-[2px] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 text-white space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-[#A3E3B8] text-xs font-bold uppercase tracking-widest">
              <Wrench className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{t.worker.terminalTitle} • ID: {currentWorker.id}</span>
            </div>

            {/* Quick Shift Status Pills */}
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs">
              <span className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeJob?.status === 'worker_en_route' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-white/80'
              }`}>
                {t.worker.statusOnTheWay}
              </span>
              <span className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeJob?.status === 'work_in_progress' ? 'bg-[#D97706] text-white shadow-xs' : 'text-white/80'
              }`}>
                {t.worker.statusWorking}
              </span>
              <span className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                (!activeJob || activeJob.status === 'work_completed') ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-white/80'
              }`}>
                {t.worker.statusAvailable}
              </span>
            </div>
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {greetingText}, <span className="text-[#A3E3B8]">{currentWorker.name.split(' ')[0]}</span>
            </h1>
            <div className="text-base sm:text-lg font-bold text-white/95">
              {language === 'ta' ? 'உங்கள் பராமரிப்பு பணிகள்' : 'Your Maintenance Work Orders'}
            </div>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              {todaysAssignments} {t.worker.assignments} today • {inProgressJobs > 0 ? inProgressJobs : (activeJob ? 1 : 0)} active job • {pendingJobs} pending assignments.
            </p>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-white">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#A3E3B8]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black">{todaysAssignments}</div>
                <div className="text-[11px] text-white/75 font-medium">{t.worker.kpiTodaysAssignments}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black">{pendingJobs}</div>
                <div className="text-[11px] text-amber-200 font-medium">{t.worker.kpiPendingJobs}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-[#2E5A44]/60 flex items-center justify-center text-[#A3E3B8]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black">{completedJobs}</div>
                <div className="text-[11px] text-white/75 font-medium">{t.worker.kpiCompletedJobs}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black">{currentWorker.rating || 4.9} ★</div>
                <div className="text-[11px] text-sky-200 font-medium">{t.worker.averageRating}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CURRENT JOB — VISUALLY PROMINENT SECTION
          ========================================================================= */}
      {activeJob ? (
        <section className="bg-white border-2 border-[#2E5A44]/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 relative overflow-hidden">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EBE7DF]">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2E7D32]"></span>
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2E5A44] block">
                  ACTIVE ASSIGNMENT
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1E21]">{t.worker.currentJobBanner}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                activeJob.priority === 'critical' ? 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]' :
                activeJob.priority === 'high' ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]' :
                activeJob.priority === 'medium' ? 'bg-[#FFF8E1] text-[#B45309] border border-[#FFE082]' :
                'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
              }`}>
                {activeJob.priority} Priority
              </span>
              <button
                onClick={() => onNavigate('active-job')}
                className="text-xs text-[#2E5A44] hover:text-[#1A3626] font-bold hover:underline ml-2 cursor-pointer"
              >
                Deep Details →
              </button>
            </div>
          </div>

          {/* Key Operational Details in Clean Horizontal Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
              <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">{t.worker.ticketLabel}</p>
              <p className="text-base font-mono font-extrabold text-[#2E5A44] mt-1">{activeJob.ticketId}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
              <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">{t.worker.aptLabel}</p>
              <p className="text-base font-extrabold text-[#1C1E21] mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#2E5A44]" />
                <span>{activeJob.apartmentId}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
              <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">{t.worker.problemLabel}</p>
              <p className="text-base font-extrabold text-[#1C1E21] mt-1 truncate">{activeJob.problem}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
              <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">{t.worker.statusLabel}</p>
              <div className="mt-1">
                <span className="badge badge-warning text-[11px]">
                  {activeJob.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Progress Steps */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B7280]">
              Maintenance Workflow Progress
            </div>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pt-1">
              {workflowSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2 shrink-0">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    step.isDone 
                      ? 'bg-[#2E5A44] text-white shadow-xs' 
                      : 'bg-white border border-[#DCD6CB] text-[#8A8275]'
                  }`}>
                    {step.isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E3B8]" />}
                    <span>{step.label}</span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <span className="text-[#B8B0A2] font-bold text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Confirmations, Telemetry, and Quick Contact */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EBE7DF] text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#E8F5E9] px-3 py-1.5 rounded-xl border border-[#C8E6C9] text-[#2E7D32] font-bold">
                <UserCheck className="w-4 h-4" />
                <span>Resident Confirmed ✓</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#E8F5E9] px-3 py-1.5 rounded-xl border border-[#C8E6C9] text-[#2E7D32] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Verified ✓</span>
              </div>

              {activeJob.sensorReading && (
                <div className="flex items-center gap-1.5 bg-[#E0F2FE] px-3 py-1.5 rounded-xl border border-[#BAE6FD] text-[#0369A1] font-mono font-bold">
                  <Radio className="w-4 h-4" />
                  <span>{activeJob.sensorReading}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:+919884099123"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C1E21] border border-[#DCD6CB] font-bold text-xs shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>{t.worker.btnCallResident}</span>
              </a>
              <button
                onClick={() => alert(`Directions to ${activeJob.apartmentId}: Take Elevator to Floor 2, Corridor East.`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C1E21] border border-[#DCD6CB] font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>{t.worker.btnGetDirections}</span>
              </button>
            </div>
          </div>

          {/* Action Pipeline Buttons */}
          <div className="pt-4 border-t border-[#EBE7DF]">
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
              {t.worker.whatToDoNow} — Select Next Action:
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {activeJob.status === 'worker_assigned' && (
                <>
                  <button
                    onClick={() => updateWorkerJobStatus(activeJob.ticketId, 'worker_accepted')}
                    className="flex-1 min-w-[140px] px-6 py-3.5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.worker.btnAcceptJob}</span>
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Reason for declining this work order:');
                      rejectWorkerJob(activeJob.ticketId, reason || undefined);
                    }}
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{t.worker.btnRejectJob}</span>
                  </button>
                </>
              )}

              {activeJob.status === 'worker_accepted' && (
                <button
                  onClick={() => updateWorkerJobStatus(activeJob.ticketId, 'worker_en_route')}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t.worker.btnStartTravel} 🚗</span>
                </button>
              )}

              {activeJob.status === 'worker_en_route' && (
                <button
                  onClick={() => updateWorkerJobStatus(activeJob.ticketId, 'work_in_progress')}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t.worker.btnArrived} 📍</span>
                </button>
              )}

              {activeJob.status === 'work_in_progress' && (
                <>
                  <button
                    onClick={() => setCompletionTicket(activeJob)}
                    className="flex-1 px-6 py-3.5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{t.worker.btnCompleteWork} ✅</span>
                  </button>
                  <button
                    onClick={() => onNavigate('active-job')}
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1C1E21] border border-[#DCD6CB] text-xs font-bold cursor-pointer"
                  >
                    <span>Live Telemetry & Diagnostics</span>
                  </button>
                </>
              )}

              {activeJob.status === 'work_completed' && (
                <div className="w-full p-4 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl flex items-center justify-between text-xs text-[#2E7D32]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Repair completed! Awaiting resident sign-off.</span>
                  </div>
                  <button
                    onClick={() => onNavigate('my-tasks')}
                    className="px-4 py-2 bg-[#2E5A44] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Next Task →
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-white border border-[#E6E0D5] rounded-3xl p-10 text-center text-[#6B7280] shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#1C1E21] mb-1">{t.worker.noActiveJobTitle}</h3>
          <p className="text-xs max-w-md mx-auto mb-4">{t.worker.noActiveJobDesc}</p>
          <button
            onClick={() => onNavigate('pending-jobs')}
            className="px-5 py-2.5 bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Browse Pending Jobs →
          </button>
        </div>
      )}

      {/* =========================================================================
          3. TODAY'S WORK — SCHEDULED TASK LIST
          ========================================================================= */}
      <section className="bg-white border border-[#E6E0D5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
          <div className="space-y-0.5">
            <div className="eyebrow text-[#2E5A44]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.worker.todaysWork}</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#1C1E21]">
              {language === 'ta' ? 'இன்றைய பணி அட்டவணை' : "Today's Work Schedule"}
            </h3>
          </div>

          <button
            onClick={() => onNavigate('my-tasks')}
            className="text-xs font-bold text-[#2E5A44] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({myTickets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#EBE7DF]">
          {myTickets.map((tkt, idx) => (
            <div 
              key={tkt.ticketId}
              onClick={() => onNavigate('active-job', tkt.ticketId)}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors cursor-pointer rounded-xl px-2 group"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#8A8275] w-16 shrink-0">
                  {idx === 0 ? '9:30 AM' : idx === 1 ? '11:00 AM' : '1:30 PM'}
                </span>
                <span className="font-extrabold text-sm text-[#2E5A44] w-16 shrink-0 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{tkt.apartmentId}</span>
                </span>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#1C1E21] group-hover:text-[#2E5A44] transition-colors">
                    {tkt.problem}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">Resident: {tkt.residentName}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`badge ${
                  tkt.priority === 'critical' || tkt.priority === 'high' ? 'badge-danger' : 'badge-warning'
                } text-[10px]`}>
                  {tkt.priority} Priority
                </span>
                <span className="badge badge-neutral text-[10px]">
                  {tkt.status.replace(/_/g, ' ')}
                </span>
                <ArrowRight className="w-4 h-4 text-[#9E9382] group-hover:text-[#2E5A44] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completion Modal */}
      {completionTicket && (
        <WorkCompletionModal
          ticket={completionTicket}
          onClose={() => setCompletionTicket(null)}
          onSuccess={() => onNavigate('completed-jobs')}
        />
      )}
    </div>
  );
};
