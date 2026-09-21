import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { WorkerNavTab } from './WorkerSidebar';
import { 
  History, 
  Search, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Wrench,
  Star
} from 'lucide-react';

interface WorkerHistoryProps {
  onNavigate: (tab: WorkerNavTab) => void;
}

export const WorkerHistory: React.FC<WorkerHistoryProps> = ({ onNavigate }) => {
  const { workers, currentWorkerId, tickets, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar',
    completedTasks: 184,
    rating: 4.92
  };

  const historyTickets = tickets.filter(
    (t) => (t.workerId === currentWorker.id || t.workerName === currentWorker.name)
  );

  const filteredHistory = historyTickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.ticketId.toLowerCase().includes(q) ||
      t.apartmentId.toLowerCase().includes(q) ||
      t.problem.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A44]/15 flex items-center justify-center text-[#2E5A44]">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1C1E21]">{t.worker.workHistoryTitle}</h1>
          </div>
          <p className="text-xs text-[#6B7280]">{t.worker.workHistorySubtitle}</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#8A8275] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past repairs..."
            className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C1E21] placeholder-[#8A8275] focus:outline-none focus:border-[#2E5A44] transition-colors"
          />
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.worker.totalEfficiencyScore}</span>
            <TrendingUp className="w-4 h-4 text-[#2E7D32]" />
          </div>
          <p className="text-2xl font-black text-[#2E7D32]">98.4%</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">Top 5% Facility Wide</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.worker.completedJobs}</span>
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
          </div>
          <p className="text-2xl font-black text-[#1C1E21]">{currentWorker.completedTasks || 184}</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">Lifetime Work Orders</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.worker.averageRating}</span>
            <Star className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
          </div>
          <p className="text-2xl font-black text-[#D97706]">{currentWorker.rating || 4.9} ★</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">Based on 142 reviews</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.worker.kpiAvgCompletionTime}</span>
            <Clock className="w-4 h-4 text-[#2E5A44]" />
          </div>
          <p className="text-2xl font-black text-[#2E5A44]">{currentWorker.avgResponseMins || 14} mins</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">Average On-Site SLA</p>
        </div>
      </div>

      {/* Historical List */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider pb-2 border-b border-[#EBE7DF]">
          {t.worker.historicalLog}
        </h3>

        <div className="divide-y divide-[#EBE7DF]">
          {filteredHistory.map((item) => (
            <div key={item.ticketId} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-[#FAF8F5] px-2 rounded-xl transition-colors">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#2E5A44] bg-[#E8EFEA] px-2 py-0.5 rounded border border-[#7E9E8B]/30">
                    {item.ticketId}
                  </span>
                  <span className="text-[#8A8275]">•</span>
                  <span className="font-bold text-sm text-[#1C1E21]">{item.problem}</span>
                  <span className="badge badge-neutral text-[10px]">
                    {item.category}
                  </span>
                </div>
                <p className="text-[#6B7280] flex items-center gap-2">
                  <span className="font-semibold text-[#1C1E21]">Unit {item.apartmentId}</span>
                  <span>•</span>
                  <span>Resident: {item.residentName}</span>
                  <span>•</span>
                  <span className="font-mono">{item.createdAt}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {item.residentRating && (
                  <span className="px-2.5 py-1 bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded-xl font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                    <span>{item.residentRating}.0</span>
                  </span>
                )}
                <span className={`badge ${
                  item.status === 'resident_verified' || item.status === 'work_completed'
                    ? 'badge-healthy'
                    : 'badge-neutral'
                } text-[10px]`}>
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
