import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Building2,
  Ticket,
  Wrench,
  Radio,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    apartments,
    tickets,
    workers,
    setUserRole,
    setCurrentApartmentId,
    setCurrentWorkerId,
    setActiveTab,
    setSelectedApartmentForDrawer,
    t,
    language,
    translateStatus,
    translateCategory,
    translatePriority
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd/Ctrl + K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search matches
  const matchedApartments = apartments.filter(
    (a) =>
      a.id.toLowerCase().includes(cleanQuery) ||
      a.resident.name.toLowerCase().includes(cleanQuery) ||
      a.blockId.toLowerCase().includes(cleanQuery)
  );

  const matchedTickets = tickets.filter(
    (tkt) =>
      tkt.ticketId.toLowerCase().includes(cleanQuery) ||
      tkt.problem.toLowerCase().includes(cleanQuery) ||
      tkt.apartmentId.toLowerCase().includes(cleanQuery) ||
      tkt.category.toLowerCase().includes(cleanQuery)
  );

  const matchedWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(cleanQuery) ||
      w.role.toLowerCase().includes(cleanQuery) ||
      w.specialties.some((s) => s.toLowerCase().includes(cleanQuery))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DCD6CB] overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E6E0D5] gap-3">
          <Search className="w-5 h-5 text-[#2E5A44]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.commandPalette.placeholder}
            className="w-full text-sm font-medium text-[#1C1E21] bg-transparent outline-none placeholder-[#9CA3AF]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#9CA3AF] hover:text-[#1C1E21]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-[#6B7280] bg-[#F4F1EB] rounded-md border border-[#E6E0D5] hover:bg-[#EFECE6]"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          
          {/* Quick Suggested Commands */}
          {!query && (
            <div className="space-y-1">
              <p className="px-2 text-[11px] font-bold text-[#8A8275] uppercase tracking-wider">
                {t.commandPalette.quickShortcuts}
              </p>
              <button
                onClick={() => {
                  setUserRole('resident');
                  setCurrentApartmentId('A-302');
                  setActiveTab('resident-overview');
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4F1EB] transition-colors text-left text-xs font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#2E5A44]" />
                  <span>{t.commandPalette.openResidentHud}</span>
                </div>
                <span className="text-[11px] text-[#2E5A44] font-semibold">{t.commandPalette.jumpToResident}</span>
              </button>

              <button
                onClick={() => {
                  setUserRole('admin');
                  setActiveTab('admin-command');
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4F1EB] transition-colors text-left text-xs font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#B45309]" />
                  <span>{t.commandPalette.openAdminCenter}</span>
                </div>
                <span className="text-[11px] text-[#1C1E21] font-semibold">{t.commandPalette.jumpToAdmin}</span>
              </button>

              <button
                onClick={() => {
                  setUserRole('worker');
                  setCurrentWorkerId('W-01');
                  setActiveTab('worker-tasks');
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4F1EB] transition-colors text-left text-xs font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-[#2E7D32]" />
                  <span>{t.commandPalette.openWorkerTerminal}</span>
                </div>
                <span className="text-[11px] text-[#2E7D32] font-semibold">{t.commandPalette.jumpToWorker}</span>
              </button>
            </div>
          )}

          {/* Matched Apartments */}
          {matchedApartments.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold text-[#8A8275] uppercase tracking-wider mb-1">
                {t.commandPalette.apartments} ({matchedApartments.length})
              </p>
              <div className="space-y-1">
                {matchedApartments.slice(0, 4).map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => {
                      setUserRole('admin');
                      setSelectedApartmentForDrawer(apt);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F1EB] transition-colors text-left text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#E8EFEA] text-[#2E5A44] flex items-center justify-center font-bold text-xs">
                        {apt.id}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1C1E21]">{apt.resident.name}</div>
                        <div className="text-[11px] text-[#6B7280]">
                          {t.common.block} {apt.blockId} • {t.common.floor} {apt.floor} • {t.common.status}: {translateStatus(apt.status, language)}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Tickets */}
          {matchedTickets.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold text-[#8A8275] uppercase tracking-wider mb-1">
                {t.commandPalette.tickets} ({matchedTickets.length})
              </p>
              <div className="space-y-1">
                {matchedTickets.slice(0, 4).map((ticket) => (
                  <button
                    key={ticket.ticketId}
                    onClick={() => {
                      setUserRole('admin');
                      setActiveTab('admin-maintenance');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F1EB] transition-colors text-left text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Ticket className="w-4 h-4 text-[#B45309]" />
                      <div>
                        <div className="font-semibold text-[#1C1E21]">
                          {ticket.ticketId} — {ticket.problem}
                        </div>
                        <div className="text-[11px] text-[#6B7280]">
                          {ticket.apartmentId} • {translateCategory(ticket.category, language)} • {t.common.status}: {translateStatus(ticket.status, language)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#B45309]">
                      {translatePriority(ticket.priority, language)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Workers */}
          {matchedWorkers.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-bold text-[#8A8275] uppercase tracking-wider mb-1">
                {t.commandPalette.technicians} ({matchedWorkers.length})
              </p>
              <div className="space-y-1">
                {matchedWorkers.map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => {
                      setUserRole('worker');
                      setCurrentWorkerId(worker.id);
                      setActiveTab('worker-tasks');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F1EB] transition-colors text-left text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-[#2E5A44]" />
                      <div>
                        <div className="font-semibold text-[#1C1E21]">
                          {worker.name} ({worker.role})
                        </div>
                        <div className="text-[11px] text-[#6B7280]">
                          {t.worker.residentRating}: {worker.rating}★ • {worker.completedTasks} {t.common.completed} • {worker.currentLocation}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#2E5A44] font-medium">{t.commandPalette.switchView}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {query && matchedApartments.length === 0 && matchedTickets.length === 0 && matchedWorkers.length === 0 && (
            <div className="py-8 text-center text-xs text-[#6B7280]">
              {t.commandPalette.noMatches} "<span className="font-semibold text-[#1C1E21]">{query}</span>". {t.commandPalette.searchSuggestion}
            </div>
          )}

        </div>

        {/* Footer info in palette */}
        <div className="px-4 py-2.5 bg-[#FAF8F5] border-t border-[#E6E0D5] flex items-center justify-between text-[11px] text-[#8A8275]">
          <span>{t.commandPalette.footerNavigate}</span>
          <span>{t.commandPalette.footerIndexer}</span>
        </div>

      </div>
    </div>
  );
};

