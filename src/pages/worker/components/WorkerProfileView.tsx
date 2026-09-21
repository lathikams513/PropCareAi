import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  User, 
  Wrench, 
  Phone, 
  Mail, 
  Award, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Star, 
  Save, 
  Radio 
} from 'lucide-react';

export const WorkerProfileView: React.FC = () => {
  const { workers, currentWorkerId, updateWorkerShiftStatus, t } = useApp();

  const currentWorker = workers.find((w) => w.id === currentWorkerId) || workers[0] || {
    id: 'WRK-102',
    name: 'Arun Kumar',
    role: 'Plumber',
    phone: '+91 98450 12891',
    email: 'arun.k@propcareai.internal',
    rating: 4.92,
    completedTasks: 184,
    shiftStatus: 'available',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  };

  const [phone, setPhone] = useState(currentWorker.phone || '+91 98450 12891');
  const [shiftStatus, setShiftStatus] = useState(currentWorker.shiftStatus || 'available');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkerShiftStatus(currentWorker.id, shiftStatus as any);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A44]/15 flex items-center justify-center text-[#2E5A44]">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1C1E21]">{t.worker.profileTitle}</h1>
          </div>
          <p className="text-xs text-[#6B7280]">{t.worker.profileSubtitle}</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl text-xs font-bold text-[#2E7D32] flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#2E7D32] flex-shrink-0" />
          <span>Profile changes and availability status saved successfully!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-[#E8EFEA] shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
              shiftStatus === 'available' ? 'bg-[#2E7D32]' :
              shiftStatus === 'working' ? 'bg-[#D97706]' : 'bg-[#9CA3AF]'
            }`} />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#1C1E21]">{currentWorker.name}</h2>
            <p className="text-xs font-mono text-[#2E5A44] font-bold mt-0.5">ID: {currentWorker.id}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#E8EFEA] text-[#2E5A44] border border-[#7E9E8B]/30">
              {currentWorker.role}
            </span>
          </div>

          <div className="w-full pt-4 border-t border-[#EBE7DF] grid grid-cols-2 gap-3 text-left">
            <div className="p-3 bg-[#FAF8F5] border border-[#E6E0D5] rounded-2xl">
              <p className="text-[10px] text-[#6B7280] uppercase font-bold">Rating</p>
              <p className="text-base font-extrabold text-[#D97706] mt-0.5 flex items-center gap-1">
                <span>{currentWorker.rating || 4.9}</span>
                <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
              </p>
            </div>
            <div className="p-3 bg-[#FAF8F5] border border-[#E6E0D5] rounded-2xl">
              <p className="text-[10px] text-[#6B7280] uppercase font-bold">Repairs Done</p>
              <p className="text-base font-extrabold text-[#1C1E21] mt-0.5">{currentWorker.completedTasks || 184}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form & Details */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider mb-4 pb-2 border-b border-[#EBE7DF]">
              Personal & Work Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Worker Name */}
              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  {t.worker.lblWorkerName}
                </label>
                <input
                  type="text"
                  value={currentWorker.name}
                  disabled
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl px-3 py-2 text-xs text-[#6B7280] cursor-not-allowed font-medium"
                />
              </div>

              {/* Worker ID */}
              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  {t.worker.lblWorkerId}
                </label>
                <input
                  type="text"
                  value={currentWorker.id}
                  disabled
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl px-3 py-2 text-xs font-mono text-[#2E5A44] cursor-not-allowed font-bold"
                />
              </div>

              {/* Skill / Category */}
              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  {t.worker.lblSkillCategory}
                </label>
                <input
                  type="text"
                  value={currentWorker.role}
                  disabled
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl px-3 py-2 text-xs text-[#6B7280] cursor-not-allowed font-medium"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#1C1E21] mb-1">
                  {t.worker.lblPhone}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#DCD6CB] rounded-xl px-3 py-2 text-xs text-[#1C1E21] focus:outline-none focus:border-[#2E5A44] transition-colors font-medium"
                />
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-xs font-bold text-[#1C1E21] mb-1">
                  {t.worker.lblAvailability} / {t.worker.lblCurrentStatus}
                </label>
                <select
                  value={shiftStatus}
                  onChange={(e) => setShiftStatus(e.target.value as any)}
                  className="w-full bg-white border border-[#DCD6CB] rounded-xl px-3 py-2 text-xs text-[#1C1E21] focus:outline-none focus:border-[#2E5A44] transition-colors cursor-pointer capitalize font-medium"
                >
                  <option value="available">{t.worker.statusOptionAvailable}</option>
                  <option value="on_the_way">On The Way</option>
                  <option value="working">{t.worker.statusOptionBusy}</option>
                  <option value="on_break">{t.worker.statusOptionOnBreak}</option>
                </select>
              </div>

              {/* Shift Hours */}
              <div>
                <label className="block text-xs font-bold text-[#4B5563] mb-1">
                  {t.worker.lblShiftHours}
                </label>
                <input
                  type="text"
                  value="08:00 AM – 06:00 PM (Shift A)"
                  disabled
                  className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl px-3 py-2 text-xs text-[#6B7280] cursor-not-allowed font-mono"
                />
              </div>
            </div>

            {/* Certifications & Badges */}
            <div className="pt-4 border-t border-[#EBE7DF]">
              <label className="block text-xs font-bold text-[#4B5563] mb-2">
                {t.worker.lblTradeCertifications}
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#2E7D32] flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Licensed Plumbing Contractor (IPC Gold)</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-xs text-[#0369A1] flex items-center gap-1.5 font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Hydrostatic Ultrasonic Leak Certified</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DCD6CB] text-xs text-[#4B5563] flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>OSHA Safety Standard Compliant</span>
                </span>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2E5A44] hover:bg-[#1A3626] text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.worker.btnSaveProfile}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
