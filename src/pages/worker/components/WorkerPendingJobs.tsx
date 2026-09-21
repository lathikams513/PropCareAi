import React from 'react';
import { useApp } from '../../../context/AppContext';
import { WorkerNavTab } from './WorkerSidebar';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  AlertTriangle, 
  ArrowRight, 
  Wrench 
} from 'lucide-react';

interface WorkerPendingJobsProps {
  onNavigate: (tab: WorkerNavTab, ticketId?: string) => void;
}

export const WorkerPendingJobs: React.FC<WorkerPendingJobsProps> = ({ onNavigate }) => {
  const { workers, currentWorkerId, tickets, updateWorkerJobStatus, rejectWorkerJob, t } = useApp();

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar'
  };

  const pendingTickets = tickets.filter(
    (t) => (t.workerId === currentWorker.id || t.workerName === currentWorker.name) &&
           (t.status === 'worker_assigned' || t.status === 'admin_confirmed')
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-[#D97706]">
              <Clock className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1C1E21]">{t.worker.pendingJobsTitle}</h1>
          </div>
          <p className="text-xs text-[#6B7280]">{t.worker.pendingJobsSubtitle}</p>
        </div>
        <span className="px-3.5 py-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] font-bold text-xs rounded-full">
          {pendingTickets.length} Pending
        </span>
      </div>

      {/* Pending List */}
      {pendingTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingTickets.map((ticket) => (
            <div 
              key={ticket.ticketId}
              className="p-6 rounded-3xl bg-white border border-[#E6E0D5] hover:border-[#2E5A44] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-[#2E5A44] bg-[#E8EFEA] px-2.5 py-0.5 rounded-lg border border-[#7E9E8B]/30">
                    {ticket.ticketId}
                  </span>
                  <span className={`badge ${
                    ticket.priority === 'critical' || ticket.priority === 'high' ? 'badge-danger' : 'badge-warning'
                  } text-[10px]`}>
                    {ticket.priority} Priority
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#1C1E21] mt-1">{ticket.problem}</h3>
                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 leading-relaxed">{ticket.description}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#EBE7DF] text-xs">
                  <div>
                    <span className="text-[#8A8275] text-[11px]">Location:</span>
                    <p className="font-bold text-[#1C1E21] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2E5A44]" />
                      <span>Unit {ticket.apartmentId}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[#8A8275] text-[11px]">Resident:</span>
                    <p className="font-semibold text-[#1C1E21] mt-0.5">{ticket.residentName}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    updateWorkerJobStatus(ticket.ticketId, 'worker_accepted');
                    onNavigate('active-job', ticket.ticketId);
                  }}
                  className="flex-1 py-2.5 bg-[#2E5A44] hover:bg-[#1A3626] text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.worker.btnAcceptJob}</span>
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Reason for declining this work order:');
                    rejectWorkerJob(ticket.ticketId, reason || undefined);
                  }}
                  className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-red-50 text-red-600 border border-[#DCD6CB] hover:border-red-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E6E0D5] rounded-3xl p-12 text-center text-[#6B7280] shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#1C1E21] mb-1">{t.worker.noPendingJobs}</h3>
          <p className="text-xs max-w-sm mx-auto mb-4">All queued tasks have been accepted or completed.</p>
          <button
            onClick={() => onNavigate('my-tasks')}
            className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-white text-[#2E5A44] rounded-xl font-bold text-xs border border-[#DCD6CB] transition-colors cursor-pointer shadow-xs"
          >
            Review All Tasks →
          </button>
        </div>
      )}
    </div>
  );
};
