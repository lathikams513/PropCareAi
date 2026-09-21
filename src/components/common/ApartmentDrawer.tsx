import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  User,
  Phone,
  Mail,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Thermometer,
  Droplets,
  Zap,
  Wind,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const ApartmentDrawer: React.FC = () => {
  const {
    selectedApartmentForDrawer,
    setSelectedApartmentForDrawer,
    tickets,
    aiAlerts,
    setUserRole,
    setCurrentApartmentId,
    setActiveTab,
    t,
    language,
    translateStatus
  } = useApp();

  if (!selectedApartmentForDrawer) return null;

  const apt = selectedApartmentForDrawer;
  const aptTickets = tickets.filter((tkt) => tkt.apartmentId === apt.id);
  const aptAlerts = aiAlerts.filter((a) => a.apartmentId === apt.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-[#DCD6CB] flex flex-col animate-fade-in">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E6E0D5] bg-[#FAF8F5] flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#2E5A44] text-white flex items-center justify-center font-bold text-base shadow-sm">
                {apt.id}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#1C1E21]">{t.common.apartment} {apt.id}</h2>
                  <span
                    className={`badge ${
                      apt.status === 'healthy'
                        ? 'badge-healthy'
                        : apt.status === 'warning'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {apt.status === 'healthy' && <CheckCircle2 className="w-3 h-3" />}
                    {apt.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                    {apt.status === 'maintenance' && <Wrench className="w-3 h-3" />}
                    {translateStatus(apt.status, language)}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  {t.common.block} {apt.blockId} (Cedar Heights) • {t.common.floor} {apt.floor} • {t.common.door} {apt.doorNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUserRole('resident');
                  setCurrentApartmentId(apt.id);
                  setActiveTab('resident-overview');
                  setSelectedApartmentForDrawer(null);
                }}
                className="btn-primary text-xs py-1.5 px-3"
              >
                {t.drawer.launchResidentHud} <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setSelectedApartmentForDrawer(null)}
                className="p-1.5 text-[#9CA3AF] hover:text-[#1C1E21] rounded-lg hover:bg-[#EFECE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Resident Information Row */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E0D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8EFEA] text-[#2E5A44] flex items-center justify-center font-bold text-sm">
                  {apt.resident.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C1E21] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#4D7C5D]" /> {apt.resident.name}
                  </div>
                  <div className="text-[11px] text-[#6B7280] flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.resident.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {apt.resident.email}</span>
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-[#8A8275]">
                <div>{t.drawer.moveIn} <strong className="text-[#1C1E21]">{apt.resident.moveInDate}</strong></div>
                <div>{t.drawer.pin} <strong className="font-mono">{apt.resident.pin}</strong></div>
              </div>
            </div>

            {/* Current Real-time Environmental Telemetry */}
            <div>
              <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#2E5A44]" /> {t.drawer.ambientTelemetry}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#E6E0D5] shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>{t.drawer.waterFlow}</span>
                    <Droplets className="w-3.5 h-3.5 text-[#0284C7]" />
                  </div>
                  <div className={`text-base font-bold ${apt.sensorSummary.waterFlow > 10 ? 'text-[#DC2626]' : 'text-[#1C1E21]'}`}>
                    {apt.sensorSummary.waterFlow} <span className="text-xs font-normal text-[#6B7280]">L/min</span>
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">{t.drawer.normal}: 2–8.5 L/min</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E6E0D5] shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>{t.drawer.powerLoad}</span>
                    <Zap className="w-3.5 h-3.5 text-[#D97706]" />
                  </div>
                  <div className="text-base font-bold text-[#1C1E21]">
                    {apt.sensorSummary.powerUsage} <span className="text-xs font-normal text-[#6B7280]">kW</span>
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">{t.drawer.normal}: 0.2–3.5 kW</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E6E0D5] shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>{t.drawer.temperature}</span>
                    <Thermometer className="w-3.5 h-3.5 text-[#EA580C]" />
                  </div>
                  <div className="text-base font-bold text-[#1C1E21]">
                    {apt.sensorSummary.temperature} <span className="text-xs font-normal text-[#6B7280]">°C</span>
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Humidity: {apt.sensorSummary.humidity}%</div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E6E0D5] shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                    <span>{t.drawer.airQuality}</span>
                    <Wind className="w-3.5 h-3.5 text-[#16A34A]" />
                  </div>
                  <div className="text-base font-bold text-[#1C1E21]">
                    {apt.sensorSummary.airQuality} <span className="text-xs font-normal text-[#6B7280]">AQI</span>
                  </div>
                  <div className="text-[10px] text-[#16A34A] mt-0.5 font-semibold">{t.drawer.cleanPure}</div>
                </div>
              </div>
            </div>

            {/* Active AI Alerts for this Apartment */}
            {aptAlerts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" /> {t.drawer.activeAiFlag}
                </h3>
                <div className="space-y-2">
                  {aptAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FCA5A5]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#991B1B]">{alert.issueTitle}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">
                          {alert.confidence}% {t.drawer.confidence}
                        </span>
                      </div>
                      <p className="text-xs text-[#7F1D1D] mt-1">{alert.explanation}</p>
                      <div className="text-[11px] text-[#991B1B] mt-2 font-medium">
                        {t.drawer.current} <strong>{alert.readingValue} {alert.unit}</strong> • {t.drawer.targetBaseline} {alert.normalRange}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Installed Sensors Fleet */}
            <div>
              <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider mb-3">
                {t.drawer.installedSensors} ({apt.sensors.length})
              </h3>
              <div className="space-y-2">
                {apt.sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="p-3 rounded-xl bg-white border border-[#E6E0D5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#1C1E21]">{sensor.name}</div>
                      <div className="text-[11px] text-[#6B7280]">
                        {t.drawer.location} {sensor.location} • {t.drawer.battery} {sensor.batteryLevel ?? 100}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#1C1E21]">
                        {sensor.currentValue} {sensor.unit}
                      </div>
                      <span className={`badge ${sensor.status === 'normal' ? 'badge-healthy' : 'badge-warning'} text-[10px]`}>
                        {translateStatus(sensor.status, language)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service & Maintenance Tickets for this apartment */}
            <div>
              <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#6B7280]" /> {t.drawer.serviceHistory} ({aptTickets.length})
              </h3>
              {aptTickets.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E0D5] text-xs text-[#6B7280] text-center">
                  {t.drawer.noTicketsRecord}
                </div>
              ) : (
                <div className="space-y-3">
                  {aptTickets.map((tkt) => (
                    <div key={tkt.ticketId} className="p-3.5 rounded-xl bg-white border border-[#E6E0D5] shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1C1E21]">{tkt.ticketId} — {tkt.problem}</span>
                        <span className="badge badge-info text-[10px]">{translateStatus(tkt.status, language)}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">{tkt.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-[#8A8275] pt-1 border-t border-[#F0EDE6]">
                        <span>{t.drawer.technician} <strong>{tkt.workerName || t.common.unassigned}</strong></span>
                        <span>{t.drawer.created} {tkt.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

