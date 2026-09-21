import React from 'react';
import { useApp } from '../../../context/AppContext';
import { WorkerNavTab } from './WorkerSidebar';
import { 
  CheckCircle2, 
  Star, 
  Package, 
  MapPin, 
  Calendar, 
  Wrench,
  Camera,
  MessageSquareQuote
} from 'lucide-react';

interface WorkerCompletedJobsProps {
  onNavigate: (tab: WorkerNavTab, ticketId?: string) => void;
}

export const WorkerCompletedJobs: React.FC<WorkerCompletedJobsProps> = ({ onNavigate }) => {
  const { workers, currentWorkerId, tickets, t } = useApp();

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar'
  };

  const completedTickets = tickets.filter(
    (t) => (t.workerId === currentWorker.id || t.workerName === currentWorker.name) &&
           (t.status === 'work_completed' || t.status === 'resident_verified')
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A44]/15 flex items-center justify-center text-[#2E5A44]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1C1E21]">{t.worker.completedJobsTitle}</h1>
          </div>
          <p className="text-xs text-[#6B7280]">{t.worker.completedJobsSubtitle}</p>
        </div>
        <span className="px-3.5 py-1.5 bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] font-bold text-xs rounded-full">
          {completedTickets.length} Completed
        </span>
      </div>

      {/* Completed Cards */}
      {completedTickets.length > 0 ? (
        <div className="space-y-4">
          {completedTickets.map((ticket) => (
            <div 
              key={ticket.ticketId}
              className="p-6 rounded-3xl bg-white border border-[#E6E0D5] hover:border-[#2E5A44] shadow-sm space-y-4 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-[#EBE7DF]">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs text-[#2E5A44] bg-[#E8EFEA] px-2.5 py-0.5 rounded-lg border border-[#7E9E8B]/30">
                    {ticket.ticketId}
                  </span>
                  <h3 className="font-bold text-base text-[#1C1E21]">{ticket.problem}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#1C1E21] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2E5A44]" />
                    <span>Unit {ticket.apartmentId}</span>
                  </span>
                  <span className="text-xs text-[#8A8275]">•</span>
                  <span className="text-xs text-[#6B7280] flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#8A8275]" />
                    <span>{ticket.completedAt || 'Today'}</span>
                  </span>
                </div>
              </div>

              {/* Resolution Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Problem Found & Work Performed */}
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
                    <p className="text-[11px] font-bold text-[#B45309] mb-0.5 uppercase tracking-wider">Problem Found:</p>
                    <p className="text-[#4B5563] leading-relaxed">{ticket.problemFound || ticket.description}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#E8F5E9]/50 border border-[#C8E6C9]">
                    <p className="text-[11px] font-bold text-[#2E7D32] mb-0.5 uppercase tracking-wider">Work Performed:</p>
                    <p className="text-[#4B5563] leading-relaxed">{ticket.workPerformed || ticket.solutionProvided || ticket.workerNotes || 'Repair executed according to standard safety code.'}</p>
                  </div>
                </div>

                {/* Materials & Resident Feedback */}
                <div className="space-y-2.5">
                  {/* Materials */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5]">
                    <p className="text-[11px] font-bold text-[#0369A1] mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                      <Package className="w-3.5 h-3.5" />
                      <span>Materials & Parts Used:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ticket.materialsUsed && ticket.materialsUsed.length > 0 ? (
                        ticket.materialsUsed.map((part, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-white text-[#1C1E21] text-[11px] font-medium border border-[#DCD6CB]">
                            {part}
                          </span>
                        ))
                      ) : ticket.partsReplaced && ticket.partsReplaced.length > 0 ? (
                        ticket.partsReplaced.map((part, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-white text-[#1C1E21] text-[11px] font-medium border border-[#DCD6CB]">
                            {part}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8A8275] text-[11px]">Standard tooling & brass compression fittings</span>
                      )}
                    </div>
                  </div>

                  {/* Resident Rating & Feedback */}
                  {ticket.residentRating ? (
                    <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">Resident Feedback:</span>
                        <div className="flex items-center text-[#D97706] gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < (ticket.residentRating || 5) ? 'fill-[#D97706] text-[#D97706]' : 'text-[#DCD6CB]'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#484137] italic text-[11px]">"{ticket.residentFeedback || 'Prompt and efficient resolution! Very professional.'}"</p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D5] text-[#6B7280] flex items-center justify-between">
                      <span className="text-[11px]">Resident Sign-Off:</span>
                      <span className="badge badge-warning text-[10px]">
                        Pending Sign-off
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E6E0D5] rounded-3xl p-12 text-center text-[#6B7280] shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-[#8A8275] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1C1E21] mb-1">{t.worker.noCompletedJobs}</h3>
          <p className="text-xs max-w-sm mx-auto">Completed maintenance tickets and resident reviews will appear here.</p>
        </div>
      )}
    </div>
  );
};
