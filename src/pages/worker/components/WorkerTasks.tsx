import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MaintenanceTicket } from '../../../types';
import { WorkerNavTab } from './WorkerSidebar';
import { WorkCompletionModal } from './WorkCompletionModal';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface WorkerTasksProps {
  onNavigate: (tab: WorkerNavTab, ticketId?: string) => void;
}

export const WorkerTasks: React.FC<WorkerTasksProps> = ({ onNavigate }) => {
  const { workers, currentWorkerId, tickets, updateWorkerJobStatus, t, language } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'assigned' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [completionTicket, setCompletionTicket] = useState<MaintenanceTicket | null>(null);

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar'
  };

  const myTickets = tickets.filter((t) => t.workerId === currentWorker.id || t.workerName === currentWorker.name);

  const filteredTickets = myTickets.filter((ticket) => {
    // Tab filter
    if (activeFilter === 'assigned' && !['worker_assigned', 'admin_confirmed'].includes(ticket.status)) return false;
    if (activeFilter === 'in_progress' && !['worker_accepted', 'worker_en_route', 'work_in_progress'].includes(ticket.status)) return false;
    if (activeFilter === 'completed' && !['work_completed', 'resident_verified'].includes(ticket.status)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ticket.ticketId.toLowerCase().includes(q) ||
        ticket.apartmentId.toLowerCase().includes(q) ||
        ticket.problem.toLowerCase().includes(q) ||
        ticket.category.toLowerCase().includes(q) ||
        ticket.residentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A44]/15 flex items-center justify-center text-[#2E5A44]">
              <ClipboardList className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1C1E21]">{t.worker.myTasksTitle}</h1>
          </div>
          <p className="text-xs text-[#6B7280]">{t.worker.myTasksSubtitle}</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8A8275] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket, apt, problem..."
            className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1E21] placeholder-[#8A8275] focus:outline-none focus:border-[#2E5A44] transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#2E5A44] text-white shadow-xs'
              : 'bg-white border border-[#DCD6CB] text-[#4B5563] hover:text-[#1C1E21]'
          }`}
        >
          {t.worker.tabAllTasks} ({myTickets.length})
        </button>
        <button
          onClick={() => setActiveFilter('assigned')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'assigned'
              ? 'bg-[#2E5A44] text-white shadow-xs'
              : 'bg-white border border-[#DCD6CB] text-[#4B5563] hover:text-[#1C1E21]'
          }`}
        >
          {t.worker.tabAssigned} ({myTickets.filter((t) => ['worker_assigned', 'admin_confirmed'].includes(t.status)).length})
        </button>
        <button
          onClick={() => setActiveFilter('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'in_progress'
              ? 'bg-[#2E5A44] text-white shadow-xs'
              : 'bg-white border border-[#DCD6CB] text-[#4B5563] hover:text-[#1C1E21]'
          }`}
        >
          {t.worker.tabInProgress} ({myTickets.filter((t) => ['worker_accepted', 'worker_en_route', 'work_in_progress'].includes(t.status)).length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'completed'
              ? 'bg-[#2E5A44] text-white shadow-xs'
              : 'bg-white border border-[#DCD6CB] text-[#4B5563] hover:text-[#1C1E21]'
          }`}
        >
          {t.worker.tabCompleted} ({myTickets.filter((t) => ['work_completed', 'resident_verified'].includes(t.status)).length})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              onClick={() => onNavigate('active-job', ticket.ticketId)}
              className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs hover:border-[#2E5A44] hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono font-bold text-xs text-[#2E5A44] bg-[#E8EFEA] px-2 py-0.5 rounded-lg border border-[#7E9E8B]/30">
                    {ticket.ticketId}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-[#1C1E21] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2E5A44]" />
                    <span>Unit {ticket.apartmentId}</span>
                  </span>
                  <span className="text-[#8A8275]">•</span>
                  <h3 className="font-bold text-sm sm:text-base text-[#1C1E21] group-hover:text-[#2E5A44] transition-colors">
                    {ticket.problem}
                  </h3>
                  <span className={`badge ${
                    ticket.priority === 'critical' || ticket.priority === 'high' ? 'badge-danger' : 'badge-warning'
                  } text-[10px]`}>
                    {ticket.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-[#6B7280] max-w-2xl line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8A8275] pt-1">
                  <span>Resident: <strong className="text-[#1C1E21]">{ticket.residentName}</strong></span>
                  <span>Category: <strong className="text-[#1C1E21]">{ticket.category}</strong></span>
                  <span>Created: <strong className="font-mono text-[#1C1E21]">{ticket.createdAt}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                <span className={`badge ${
                  ticket.status === 'work_in_progress' || ticket.status === 'worker_en_route'
                    ? 'badge-warning'
                    : ticket.status === 'work_completed' || ticket.status === 'resident_verified'
                    ? 'badge-healthy'
                    : 'badge-neutral'
                } text-xs`}>
                  {ticket.status.replace(/_/g, ' ')}
                </span>

                {ticket.status === 'work_in_progress' && (
                  <button
                    onClick={() => setCompletionTicket(ticket)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Complete Work
                  </button>
                )}

                <button
                  onClick={() => onNavigate('active-job', ticket.ticketId)}
                  className="p-2 rounded-xl bg-[#FAF8F5] border border-[#DCD6CB] text-[#1C1E21] group-hover:bg-[#2E5A44] group-hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E6E0D5] rounded-3xl p-12 text-center text-[#6B7280] shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1C1E21]">{language === 'ta' ? 'பொருந்தும் பணிகள் இல்லை' : 'No matching tasks found'}</h3>
            <p className="text-xs mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

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
