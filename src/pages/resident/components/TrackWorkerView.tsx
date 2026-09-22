import React from 'react';
import { useApp } from '../../../context/AppContext';
import { getAssetUrl } from '../../../utils/assets';
import {
  UserCheck,
  Phone,
  Mail,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Building2,
  Wrench
} from 'lucide-react';

export const TrackWorkerView: React.FC = () => {
  const {
    currentApartmentId,
    apartments,
    tickets,
    language,
    t,
    translateStatus
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const aptTickets = tickets.filter((t) => t.apartmentId === apt.id);
  const activeTicket = aptTickets.find((t) => t.status !== 'resident_verified');
  const isTamil = language === 'ta';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-[#E6E0D5] pb-4">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
          <UserCheck className="w-3.5 h-3.5" />
          <span>{isTamil ? 'பணியாளர் நேரலை கண்காணிப்பு' : 'Field Technician Real-Time Dispatch'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
          {t.resident.trackTitle}
        </h2>
        <p className="text-xs text-[#6B7280]">
          {isTamil
            ? 'உங்கள் வீட்டிற்கு வருகை தரும் தொழில்நுட்ப பணியாளரின் நேரலை இருப்பிடம் மற்றும் வருகை நேரம்.'
            : 'Track the assigned technician en route to your apartment with verified arrival ETA.'}
        </p>
      </div>

      {activeTicket && activeTicket.workerName ? (
        <div className="space-y-6">
          
          {/* Main Technician Profile & Arrival Banner */}
          <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#FAF8F5] pb-6">
              <div className="flex items-center gap-4">
                <img
                  src={getAssetUrl(activeTicket.workerAvatar || '/images/maintenance_technician.jpg')}
                  alt={activeTicket.workerName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#E6E0D5] shadow-xs"
                />
                <div className="space-y-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
                    {isTamil ? 'உங்கள் சேவை தொழில்நுட்ப வல்லுநர்' : 'YOUR SERVICE TECHNICIAN'}
                  </div>
                  <h3 className="text-xl font-black text-[#1C1E21]">{activeTicket.workerName}</h3>
                  <p className="text-xs font-semibold text-[#6B7280]">
                    {activeTicket.workerSkill || 'Master Plumber'} • Certified Facility Technician
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="flex items-center text-xs font-bold text-[#F59E0B]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="ml-1 text-[#1C1E21]">4.92</span>
                    </span>
                    <span className="text-xs text-[#8A8275]">•</span>
                    <span className="text-xs text-[#6B7280]">184 {isTamil ? 'பணிகள் முடித்தவர்' : 'jobs completed'}</span>
                  </div>
                </div>
              </div>

              {/* Status & ETA Large Badge */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE7DF] text-left sm:text-right space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8A8275] block">
                  {isTamil ? 'தற்போதைய நிலை' : 'CURRENT STATUS'}
                </span>
                <div className="text-lg font-black text-[#2E5A44]">
                  {activeTicket.status === 'worker_en_route' 
                    ? (isTamil ? 'வருகிறார் (On The Way)' : 'On The Way') 
                    : translateStatus(activeTicket.status)}
                </div>
                <div className="text-xs font-bold text-[#B45309] flex items-center sm:justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'வருகை நேரம்: ~10 நிமிடம்' : 'ETA: ~10 minutes'}</span>
                </div>
              </div>
            </div>

            {/* Horizontal Route / Floor Tracking Progress */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-[#4B5563]">
                {isTamil ? 'வருகை பாதை முன்னேற்றம்' : 'Arrival Route & Dispatch Path'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#E8F5E9] text-[#2E7D32] font-bold border border-[#C8E6C9] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="block text-[10px] opacity-80">{isTamil ? 'படி 1' : 'Step 1'}</span>
                    <span>{isTamil ? 'பயன்பாட்டு அறை புறப்பாடு' : 'Ground Utility Bay'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#E8F5E9] text-[#2E7D32] font-bold border border-[#C8E6C9] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="block text-[10px] opacity-80">{isTamil ? 'படி 2' : 'Step 2'}</span>
                    <span>{isTamil ? 'மின்தூக்கி தளம் 3' : 'Tower Elevator 3'}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl font-bold border flex items-center gap-2 ${
                  activeTicket.status === 'worker_en_route' || activeTicket.status === 'work_in_progress'
                    ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] animate-pulse'
                    : 'bg-[#FAF8F5] text-[#8A8275] border-[#E6E0D5]'
                }`}>
                  <Navigation className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="block text-[10px] opacity-80">{isTamil ? 'படி 3' : 'Step 3'}</span>
                    <span>{isTamil ? 'தளம் 3 நடைபாதை' : 'Floor 3 Hallway'}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl font-bold border flex items-center gap-2 ${
                  activeTicket.status === 'work_in_progress' || activeTicket.status === 'work_completed'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : 'bg-[#FAF8F5] text-[#8A8275] border-[#E6E0D5]'
                }`}>
                  <MapPin className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="block text-[10px] opacity-80">{isTamil ? 'படி 4' : 'Step 4'}</span>
                    <span>{t.common.apartment} {apt.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technician Contact & Work Order Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EBE7DF]">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8A8275] block">
                  {isTamil ? 'பணி விவரம்' : 'ASSIGNED WORK ORDER'}
                </span>
                <strong className="text-xs text-[#1C1E21] block">{activeTicket.ticketId} • {activeTicket.problem}</strong>
                <span className="text-[11px] text-[#6B7280] block">{isTamil ? 'அடுக்குமாடி' : 'Apartment'} {apt.id} ({t.common.floor} {apt.floor})</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#8A8275] block">
                    {isTamil ? 'தொலைபேசி தொடர்பு' : 'DIRECT CALL'}
                  </span>
                  <strong className="text-xs text-[#1C1E21] block">+91 98450 12891</strong>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Calling technician ${activeTicket.workerName} at +91 98450 12891`)}
                  className="px-4 py-2 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'அழைக்கவும்' : 'Call'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E6E0D5] p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] text-[#2E5A44] flex items-center justify-center mx-auto border border-[#E6E0D5]">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1C1E21]">{t.resident.noTechEnRoute}</h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">{t.resident.noTechDesc}</p>
        </div>
      )}

    </div>
  );
};
