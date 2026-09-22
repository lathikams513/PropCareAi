import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { getAssetUrl } from '../../../utils/assets';
import {
  Send,
  Mic,
  MicOff,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Wrench,
  Clock
} from 'lucide-react';
import { IssueCategory, Priority } from '../../../types';
import { ResidentTabType } from './ResidentNavigation';

interface ReportProblemViewProps {
  onSuccessNavigate: (tab: ResidentTabType) => void;
}

export const ReportProblemView: React.FC<ReportProblemViewProps> = ({ onSuccessNavigate }) => {
  const {
    currentApartmentId,
    apartments,
    createManualTicket,
    language,
    t,
    translateCategory,
    translatePriority
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const isTamil = language === 'ta';

  // Form State
  const [selectedArea, setSelectedArea] = useState<string>('Kitchen');
  const [reportCategory, setReportCategory] = useState<IssueCategory>('Water & Plumbing');
  const [reportProblem, setReportProblem] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportPriority, setReportPriority] = useState<Priority>('high');
  const [reportPhoto, setReportPhoto] = useState<string>(getAssetUrl('/images/utility_sensor.jpg'));
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const areas = [
    { id: 'Kitchen', label: isTamil ? 'சமையலறை' : 'Kitchen' },
    { id: 'Bathroom', label: isTamil ? 'குளியலறை' : 'Bathroom' },
    { id: 'Living Room', label: isTamil ? 'வரவேற்பறை' : 'Living Room' },
    { id: 'Bedroom', label: isTamil ? 'படுக்கையறை' : 'Bedroom' },
    { id: 'Utility', label: isTamil ? 'பயன்பாட்டு அறை' : 'Utility' },
    { id: 'Other', label: isTamil ? 'மற்றவை' : 'Other' }
  ];

  const categories: IssueCategory[] = [
    'Water & Plumbing',
    'Electrical & Power',
    'HVAC & Climate',
    'Appliance',
    'Civil & Structure'
  ];

  const handleVoiceToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setReportDesc((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecordingVoice(false);
        };
        recognition.onerror = () => setIsRecordingVoice(false);
        recognition.start();
      } else {
        setTimeout(() => {
          setReportDesc((prev) =>
            prev
              ? `${prev} ${isTamil ? 'சமையலறை குழாயில் நீர் கசிகிறது.' : 'Water leaking beneath kitchen counter faucet fitting.'}`
              : isTamil
              ? 'சமையலறை குழாயில் நீர் கசிகிறது.'
              : 'Water leaking beneath kitchen counter faucet fitting.'
          );
          setIsRecordingVoice(false);
        }, 1200);
      }
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportProblem.trim()) return;

    const fullProblemTitle = `[${selectedArea}] ${reportProblem}`;

    const newTicketId = createManualTicket({
      apartmentId: apt.id,
      category: reportCategory,
      problem: fullProblemTitle,
      description: reportDesc || (isTamil ? 'குடியிருப்பாளரால் நேரடியாகப் பதிவு செய்யப்பட்டது.' : `Reported in ${selectedArea} via resident portal.`),
      priority: reportPriority,
      photoUrl: reportPhoto
    });

    setSuccessMessage(
      isTamil
        ? `கோரிக்கை ${newTicketId} வெற்றிகரமாக உருவாக்கப்பட்டது! நிர்வாகத்திற்கு அறிவிக்கப்பட்டுள்ளது.`
        : `Maintenance request ${newTicketId} created successfully! Property management notified.`
    );

    setTimeout(() => {
      setSuccessMessage('');
      onSuccessNavigate('maintenance');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-[#E6E0D5] pb-4">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
          <Send className="w-3.5 h-3.5" />
          <span>{isTamil ? 'புதிய சேவை கோரிக்கை' : 'Direct Facility Work Order'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
          {t.resident.reportTitle}
        </h2>
        <p className="text-xs text-[#6B7280]">
          {isTamil
            ? 'உங்கள் அடுக்குமாடி குடியிருப்புக்கான பழுதுபார்ப்பு அல்லது சேவை கோரிக்கையை எளிதாக சமர்ப்பிக்கவும்.'
            : 'Submit a service request for your apartment. A verified technician will be assigned promptly.'}
        </p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Select Area in Apartment */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#4B5563] block">
              1. {isTamil ? 'இடத்தைத் தேர்ந்தெடுக்கவும்' : 'Select Area / Room'}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {areas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedArea(area.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedArea === area.id
                      ? 'bg-[#1C1E21] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#4B5563] hover:text-[#1C1E21] border border-[#E6E0D5]'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Problem Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#4B5563] block">
                2. {t.resident.formCategory}
              </label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value as IssueCategory)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1C1E21] focus:bg-white focus:outline-none focus:border-[#2E5A44] cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {translateCategory(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#4B5563] block">
                3. {t.resident.formPriority}
              </label>
              <select
                value={reportPriority}
                onChange={(e) => setReportPriority(e.target.value as Priority)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1C1E21] focus:bg-white focus:outline-none focus:border-[#2E5A44] cursor-pointer"
              >
                <option value="low">{translatePriority('low')} (48 hrs)</option>
                <option value="medium">{translatePriority('medium')} (24 hrs)</option>
                <option value="high">{translatePriority('high')} (Same Day)</option>
                <option value="critical">{translatePriority('critical')} (Emergency Urgent)</option>
              </select>
            </div>
          </div>

          {/* Step 3: Problem Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#4B5563] block">
              4. {t.resident.formProblemTitle}
            </label>
            <input
              type="text"
              required
              value={reportProblem}
              onChange={(e) => setReportProblem(e.target.value)}
              placeholder={isTamil ? 'எ.கா. குழாயில் நீர் கசிகிறது' : 'e.g. Faucet dripping continuously under sink'}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl px-4 py-3 text-xs font-medium text-[#1C1E21] focus:bg-white focus:outline-none focus:border-[#2E5A44]"
            />
          </div>

          {/* Step 4: Description & Voice Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#4B5563]">
                5. {t.resident.formDesc}
              </label>
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-[#DC2626] text-white animate-pulse'
                    : 'bg-[#FAF8F5] text-[#2E5A44] hover:bg-[#E8F5E9] border border-[#E6E0D5]'
                }`}
              >
                {isRecordingVoice ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isRecordingVoice ? (isTamil ? 'பதிவாகிறது...' : 'Listening...') : (isTamil ? 'குரல் மூலம் பேசு' : 'Voice Dictate')}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              placeholder={t.resident.formDescPlaceholder}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl p-3.5 text-xs font-medium text-[#1C1E21] focus:bg-white focus:outline-none focus:border-[#2E5A44]"
            />
          </div>

          {/* Step 5: Photo Attachment */}
          <div className="space-y-2 border-t border-[#EBE7DF] pt-4">
            <label className="text-xs font-black uppercase tracking-wider text-[#4B5563] block">
              6. {isTamil ? 'புகைப்படம் இணைக்கவும்' : 'Photo Evidence (Optional)'}
            </label>
            <div className="flex items-center gap-4">
              <img
                src={reportPhoto}
                alt="Selected issue"
                className="w-16 h-16 rounded-xl object-cover border border-[#E6E0D5]"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1C1E21] block">
                  {isTamil ? 'மாதிரி சென்சார் / ஆய்வுப் படம் இணைக்கப்பட்டது' : 'Inspection Photo Attached'}
                </span>
                <span className="text-[11px] text-[#6B7280] block">
                  {isTamil ? 'தொழில்நுட்ப வல்லுநருக்கு சிக்கலை விரைவாகப் புரிந்துகொள்ள உதவும்.' : 'Helps technician arrive prepared with correct replacement parts.'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#EBE7DF] flex items-center justify-between">
            <span className="text-xs text-[#8A8275]">
              {t.common.apartment} {apt.id} • Cedar Heights
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t.resident.formSubmitBtn}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
