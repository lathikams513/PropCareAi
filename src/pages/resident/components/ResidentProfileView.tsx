import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  User,
  Building2,
  Mail,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const ResidentProfileView: React.FC = () => {
  const {
    currentApartmentId,
    apartments,
    setUserRole,
    setActiveTab: setGlobalActiveTab,
    language,
    t
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const isTamil = language === 'ta';
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      
      {/* Header */}
      <div className="border-b border-[#E6E0D5] pb-4">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
          <User className="w-3.5 h-3.5" />
          <span>{isTamil ? 'குடியிருப்பாளர் அமைப்புகள்' : 'Account & Residence Credentials'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
          {t.resident.profileTitle}
        </h2>
        <p className="text-xs text-[#6B7280]">
          {isTamil
            ? 'உங்கள் தொடர்பு விவரங்கள், அவசர தொடர்பு மற்றும் ஸ்மார்ட் கதவு அணுகல் குறியீடு.'
            : 'Personal contact information, emergency contacts, and Smart Deadbolt PIN for Apartment ' + apt.id + '.'}
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Profile Avatar & Info */}
        <div className="flex items-center gap-4 border-b border-[#FAF8F5] pb-5">
          <div className="w-16 h-16 rounded-2xl bg-[#2E5A44] text-white flex items-center justify-center font-black text-2xl shadow-xs">
            {apt.resident.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1C1E21]">{apt.resident.name}</h3>
            <p className="text-xs text-[#6B7280]">
              {t.common.apartment} {apt.id} • Cedar Heights ({t.common.floor} {apt.floor})
            </p>
            <div className="text-[11px] text-[#2E5A44] font-semibold mt-0.5">
              {t.drawer.moveIn} {apt.resident.moveInDate}
            </div>
          </div>
        </div>

        {/* Contact Details List */}
        <div className="space-y-4 text-xs">
          
          <div className="flex items-center justify-between py-2 border-b border-[#FAF8F5]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8A8275]" />
              {t.resident.contactPhone}
            </span>
            <strong className="text-[#1C1E21]">{apt.resident.phone}</strong>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#FAF8F5]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8A8275]" />
              {t.resident.emailAddress}
            </span>
            <strong className="text-[#1C1E21]">{apt.resident.email}</strong>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#FAF8F5]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#8A8275]" />
              {isTamil ? 'அவசர தொடர்பு' : 'Emergency Contact'}
            </span>
            <strong className="text-[#1C1E21]">{apt.resident.emergencyContact}</strong>
          </div>

          {/* Smart Deadbolt PIN */}
          <div className="flex items-center justify-between py-2 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EBE7DF]">
            <span className="text-[#6B7280] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#2E5A44]" />
              {t.resident.deadboltPin}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-black text-[#2E5A44]">
                {showPin ? apt.resident.pin : '••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[#6B7280] hover:text-[#1C1E21] transition-colors cursor-pointer"
                title={showPin ? 'Hide PIN' : 'Reveal PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* Exit Workspace Action */}
        <div className="pt-4 border-t border-[#EBE7DF]">
          <button
            type="button"
            onClick={() => {
              setUserRole('public');
              setGlobalActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>{t.resident.exitPortal} • {t.resident.exitToHome}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
