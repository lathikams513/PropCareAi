import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Wrench,
  Clock,
  CheckCircle2,
  ChevronRight,
  Filter,
  UserCheck,
  AlertTriangle,
  X,
  Star,
  FileText,
  Calendar
} from 'lucide-react';
import { MaintenanceTicket } from '../../../types';

interface MaintenanceViewProps {
  onOpenVerifyModal: (ticketId: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ onOpenVerifyModal }) => {
  const {
    currentApartmentId,
    apartments,
    tickets,
    language,
    t,
    translateStatus,
    translateCategory,
    translatePriority
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const isTamil = language === 'ta';

  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');
  const [inspectedTicketId, setInspectedTicketId] = useState<string | null>(null);

  const aptTickets = tickets.filter((t) => t.apartmentId === apt.id);

  const filteredTickets = aptTickets.filter((tkt) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'open') {
      return (
        tkt.status === 'ai_detected' ||
        tkt.status === 'awaiting_resident' ||
        tkt.status === 'resident_confirmed' ||
        tkt.status === 'admin_confirmed'
      );
    }
    if (statusFilter === 'in_progress') {
      return (
        tkt.status === 'worker_assigned' ||
        tkt.status === 'worker_accepted' ||
        tkt.status === 'worker_en_route' ||
        tkt.status === 'work_in_progress'
      );
    }
    if (statusFilter === 'completed') {
      return tkt.status === 'work_completed' || tkt.status === 'resident_verified';
    }
    return true;
  });

  const inspectedTicket = aptTickets.find((t) => t.ticketId === inspectedTicketId);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E0D5] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
            <Wrench className="w-3.5 h-3.5" />
            <span>{isTamil ? 'வேலை உத்தரவுகள் கண்காணிப்பு' : 'Service Orders & Live Execution'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
            {t.resident.maintTitle}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {isTamil
              ? 'உங்கள் குடியிருப்பின் அனைத்து பராமரிப்பு பணிகள் மற்றும் தொழில்நுட்ப முன்னேற்றத்தைக் கண்காணிக்கவும்.'
              : 'Track active work orders, assigned technicians, and resident verification sign-offs.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E6E0D5]">
          {(['all', 'open', 'in_progress', 'completed'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === key
                  ? 'bg-white text-[#1C1E21] shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              {key === 'all'
                ? t.resident.filterAll
                : key === 'open'
                ? t.resident.filterOpen
                : key === 'in_progress'
                ? t.resident.filterInProgress
                : t.resident.filterCompleted}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Table / List of Service Orders */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE7DF] bg-[#FAF8F5] text-[#6B7280] uppercase tracking-wider font-bold">
                <th className="p-4">{t.home.maintThTicket}</th>
                <th className="p-4">{t.home.maintThCategory}</th>
                <th className="p-4">{t.home.maintThTech}</th>
                <th className="p-4">{t.home.maintThStatus}</th>
                <th className="p-4">{t.home.maintThTime}</th>
                <th className="p-4 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7DF]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-[#6B7280]">
                    <CheckCircle2 className="w-8 h-8 text-[#2E7D32] mx-auto mb-2" />
                    <span className="font-bold block text-sm text-[#1C1E21]">{t.resident.noTicketsFound}</span>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((tkt) => {
                  const isCompletedNeedSignoff = tkt.status === 'work_completed';

                  return (
                    <tr
                      key={tkt.ticketId}
                      onClick={() => setInspectedTicketId(tkt.ticketId)}
                      className="hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      {/* Ticket ID */}
                      <td className="p-4 font-mono font-bold text-[#2E5A44]">
                        {tkt.ticketId}
                      </td>

                      {/* Problem & Category */}
                      <td className="p-4">
                        <div className="font-bold text-[#1C1E21]">{tkt.problem}</div>
                        <div className="text-[11px] text-[#6B7280]">{translateCategory(tkt.category)}</div>
                      </td>

                      {/* Assigned Tech */}
                      <td className="p-4 text-[#1C1E21] font-semibold">
                        {tkt.workerName ? (
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E5A44] flex items-center justify-center font-bold text-[10px]">
                              {tkt.workerName.charAt(0)}
                            </span>
                            <span>{tkt.workerName}</span>
                          </div>
                        ) : (
                          <span className="text-[#8A8275] italic">{t.common.unassigned}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          tkt.status === 'resident_verified'
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : tkt.status === 'work_completed'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#FAF8F5] text-[#4B5563] border border-[#E6E0D5]'
                        }`}>
                          {translateStatus(tkt.status)}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="p-4 text-[#8A8275] font-mono">
                        {tkt.createdAt}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        {isCompletedNeedSignoff ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenVerifyModal(tkt.ticketId);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1A3626] text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer animate-pulse"
                          >
                            {t.resident.verifyRateBtn}
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-[#2E5A44] hover:underline flex items-center justify-end gap-1">
                            <span>{t.common.viewDetails}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Inspector Drawer / Section */}
      {inspectedTicket && (
        <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-md space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2E5A44]">{inspectedTicket.ticketId}</span>
                <span className="text-xs text-[#8A8275]">•</span>
                <span className="text-xs font-bold text-[#6B7280]">{translateCategory(inspectedTicket.category)}</span>
              </div>
              <h3 className="text-xl font-black text-[#1C1E21] mt-1">{inspectedTicket.problem}</h3>
            </div>

            <button
              onClick={() => setInspectedTicketId(null)}
              className="p-2 rounded-xl text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Execution Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#6B7280]">
              {t.resident.timelineTitle}
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6E0D5]">
              {inspectedTicket.timeline.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#2E5A44] ring-4 ring-white" />
                  <div className="flex items-center gap-2">
                    <strong className="text-[#1C1E21]">{translateStatus(item.status)}</strong>
                    <span className="font-mono text-[11px] text-[#8A8275]">({item.timestamp})</span>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-0.5">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technician & Parts Info (if completed) */}
          {(inspectedTicket.problemFound || inspectedTicket.workPerformed) && (
            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#EBE7DF] space-y-3 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8A8275] block">
                {isTamil ? 'பழுதுபார்ப்பு குறிப்புகள்' : 'Service Completion Notes'}
              </span>
              <div className="space-y-1.5 text-[#1C1E21]">
                <div><strong>{isTamil ? 'கண்டறியப்பட்ட சிக்கல்' : 'Diagnosis'}:</strong> {inspectedTicket.problemFound || 'N/A'}</div>
                <div><strong>{isTamil ? 'செய்யப்பட்ட வேலை' : 'Action Taken'}:</strong> {inspectedTicket.workPerformed || 'N/A'}</div>
                <div><strong>{isTamil ? 'மாற்றப்பட்ட பாகங்கள்' : 'Parts Replaced'}:</strong> {inspectedTicket.materialsUsed?.join(', ') || 'Standard gasket fittings'}</div>
              </div>
            </div>
          )}

          {/* Verification Rating Trigger */}
          {inspectedTicket.status === 'work_completed' && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onOpenVerifyModal(inspectedTicket.ticketId)}
                className="px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1A3626] text-white text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                <span>{t.resident.verifyRateBtn}</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
