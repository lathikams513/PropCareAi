import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MaintenanceTicket } from '../../../types';
import { WorkerNavTab } from './WorkerSidebar';
import { WorkCompletionModal } from './WorkCompletionModal';
import { 
  Wrench, 
  MapPin, 
  Radio, 
  Cpu, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  AlertTriangle, 
  Phone, 
  FileCheck2,
  ArrowRight,
  User,
  Package,
  FileText
} from 'lucide-react';

interface WorkerActiveJobProps {
  onNavigate: (tab: WorkerNavTab) => void;
  selectedTicketId?: string;
}

export const WorkerActiveJob: React.FC<WorkerActiveJobProps> = ({ onNavigate, selectedTicketId }) => {
  const { workers, currentWorkerId, tickets, updateWorkerJobStatus, rejectWorkerJob, t, language } = useApp();

  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar'
  };

  const myTickets = tickets.filter((t) => t.workerId === currentWorker.id || t.workerName === currentWorker.name);
  
  // Find selected ticket, or active ticket, or default ticket
  const ticket = (selectedTicketId ? myTickets.find((t) => t.ticketId === selectedTicketId) : null)
    || myTickets.find((t) => ['work_in_progress', 'worker_en_route', 'worker_accepted'].includes(t.status))
    || myTickets.find((t) => t.status === 'worker_assigned')
    || myTickets[0];

  if (!ticket) {
    return (
      <div className="bg-white border border-[#E6E0D5] rounded-3xl p-12 text-center text-[#6B7280] shadow-sm">
        <Wrench className="w-12 h-12 text-[#2E5A44] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1C1E21] mb-1">{t.worker.noActiveJobTitle}</h3>
        <p className="text-xs max-w-md mx-auto mb-4">{t.worker.noActiveJobDesc}</p>
        <button
          onClick={() => onNavigate('my-tasks')}
          className="px-5 py-2.5 bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          View My Tasks →
        </button>
      </div>
    );
  }

  // Work Progress Steps
  const steps = [
    {
      id: 'assigned',
      label: t.worker.stepAssigned,
      statusKey: 'worker_assigned',
      isDone: ['worker_assigned', 'worker_accepted', 'worker_en_route', 'work_in_progress', 'work_completed', 'resident_verified'].includes(ticket.status),
      isActive: ticket.status === 'worker_assigned',
      time: ticket.createdAt
    },
    {
      id: 'accepted',
      label: t.worker.stepAccepted,
      statusKey: 'worker_accepted',
      isDone: ['worker_accepted', 'worker_en_route', 'work_in_progress', 'work_completed', 'resident_verified'].includes(ticket.status),
      isActive: ticket.status === 'worker_accepted',
      time: '10:48 AM'
    },
    {
      id: 'on_the_way',
      label: t.worker.stepOnTheWay,
      statusKey: 'worker_en_route',
      isDone: ['worker_en_route', 'work_in_progress', 'work_completed', 'resident_verified'].includes(ticket.status),
      isActive: ticket.status === 'worker_en_route',
      time: '10:55 AM'
    },
    {
      id: 'arrived',
      label: t.worker.stepArrived,
      statusKey: 'work_in_progress',
      isDone: ['work_in_progress', 'work_completed', 'resident_verified'].includes(ticket.status),
      isActive: ticket.status === 'work_in_progress',
      time: '11:02 AM'
    },
    {
      id: 'in_progress',
      label: t.worker.stepWorkInProgress,
      statusKey: 'work_in_progress',
      isDone: ['work_in_progress', 'work_completed', 'resident_verified'].includes(ticket.status),
      isActive: ticket.status === 'work_in_progress',
      time: '11:10 AM'
    },
    {
      id: 'completed',
      label: t.worker.stepCompleted,
      statusKey: 'work_completed',
      isDone: ['work_completed', 'resident_verified'].includes(ticket.status),
      isActive: ticket.status === 'work_completed' || ticket.status === 'resident_verified',
      time: ticket.completedAt || 'Pending'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      
      {/* Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono font-bold text-xs text-[#2E5A44] bg-[#E8EFEA] px-2.5 py-0.5 rounded-lg border border-[#7E9E8B]/30">
              Ticket {ticket.ticketId}
            </span>
            <span className={`badge ${
              ticket.priority === 'critical' || ticket.priority === 'high' ? 'badge-danger' : 'badge-warning'
            } text-[10px]`}>
              {ticket.priority} Priority
            </span>
            <span className="badge badge-healthy text-[10px]">
              {ticket.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1E21]">{ticket.problem}</h1>
          <p className="text-xs text-[#6B7280]">
            Apartment {ticket.apartmentId} • Resident: {ticket.residentName} • Created {ticket.createdAt}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {ticket.status === 'worker_assigned' && (
            <button
              onClick={() => updateWorkerJobStatus(ticket.ticketId, 'worker_accepted')}
              className="px-5 py-2.5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.worker.btnAcceptJob}</span>
            </button>
          )}

          {ticket.status === 'worker_accepted' && (
            <button
              onClick={() => updateWorkerJobStatus(ticket.ticketId, 'worker_en_route')}
              className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4" />
              <span>{t.worker.btnStartTravel} 🚗</span>
            </button>
          )}

          {ticket.status === 'worker_en_route' && (
            <button
              onClick={() => updateWorkerJobStatus(ticket.ticketId, 'work_in_progress')}
              className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>{t.worker.btnArrived} 📍</span>
            </button>
          )}

          {ticket.status === 'work_in_progress' && (
            <button
              onClick={() => setCompletionModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{t.worker.btnCompleteWork} ✅</span>
            </button>
          )}
        </div>
      </div>

      {/* Workflow Progress Stepper */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider">{language === 'ta' ? 'பணி முன்னேற்ற காலவரிசை' : 'Maintenance Workflow Timeline'}</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                step.isActive
                  ? 'bg-[#E8EFEA] border-[#2E5A44] shadow-xs'
                  : step.isDone
                  ? 'bg-white border-[#E6E0D5]'
                  : 'bg-[#FAF8F5] border-[#E6E0D5] opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${
                  step.isDone ? 'bg-[#2E7D32]' : 'bg-[#DCD6CB]'
                }`} />
                <span className={`text-xs font-bold ${
                  step.isActive ? 'text-[#2E5A44]' : 'text-[#1C1E21]'
                }`}>
                  {step.label}
                </span>
              </div>
              <p className="text-[10px] text-[#8A8275] font-mono">{step.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Diagnostics & Evidence + Location & Resident Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Sensor Telemetry & Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EBE7DF] pb-3">
              <div className="w-8 h-8 rounded-xl bg-[#0284C7]/15 flex items-center justify-center text-[#0284C7]">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1E21] uppercase tracking-wider">{language === 'ta' ? 'நேரடி சென்சார் அளவீடு' : 'Live Sensor Telemetry'}</h3>
                <p className="text-[11px] text-[#6B7280]">Real-time edge sensor readings from Unit {ticket.apartmentId}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] space-y-2 text-xs">
              <div className="font-bold text-[#1C1E21]">Problem Description:</div>
              <p className="text-[#4B5563] leading-relaxed">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD]">
                <span className="text-[#0369A1] font-bold text-[11px]">Sensor Telemetry Reading</span>
                <div className="text-base font-mono font-extrabold text-[#0284C7] mt-1">
                  {ticket.sensorReading || '14.8 L/min (Anomalous Flow)'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]">
                <span className="text-[#059669] font-bold text-[11px]">AI Statistical Confidence</span>
                <div className="text-base font-extrabold text-[#2E5A44] mt-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#2E5A44]" />
                  <span>{ticket.aiConfidence || 94}% Confidence</span>
                </div>
              </div>
            </div>

            {/* Resident & Admin Confirmations */}
            <div className="pt-2 border-t border-[#EBE7DF] flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-bold">
                <UserCheck className="w-4 h-4" />
                <span>Resident Confirmed</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Apartment Location & Resident Contact */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider pb-2 border-b border-[#EBE7DF]">
              Location & Contact Guide
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
                <div className="w-10 h-10 rounded-xl bg-[#2E5A44]/15 flex items-center justify-center text-[#2E5A44] font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#1C1E21]">Unit {ticket.apartmentId}</div>
                  <div className="text-[11px] text-[#6B7280]">
                    Block {ticket.apartmentId.split('-')[0] || 'A'} • Floor {ticket.apartmentId.split('-')[1]?.[0] || '2'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7]/15 flex items-center justify-center text-[#0284C7]">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-[#1C1E21]">{ticket.residentName}</div>
                  <div className="text-[11px] text-[#6B7280]">Resident (Primary Occupant)</div>
                </div>
                <a
                  href="tel:+919884099123"
                  className="p-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#2E5A44] border border-[#DCD6CB] shadow-xs cursor-pointer"
                  title="Call Resident"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] space-y-1 text-xs">
                <span className="font-bold text-[#1C1E21]">Building Access Instructions:</span>
                <p className="text-[#6B7280] leading-relaxed">
                  Use Service Elevator B. Riser utility duct panel key is located in the Ground Floor facility room (Code #204).
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Completion Modal */}
      {completionModalOpen && (
        <WorkCompletionModal
          ticket={ticket}
          onClose={() => setCompletionModalOpen(false)}
          onSuccess={() => onNavigate('completed-jobs')}
        />
      )}
    </div>
  );
};
