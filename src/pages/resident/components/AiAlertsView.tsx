import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  Check,
  Sparkles,
  Clock,
  ShieldCheck,
  Droplets,
  Zap,
  Info
} from 'lucide-react';

export const AiAlertsView: React.FC = () => {
  const {
    currentApartmentId,
    apartments,
    aiAlerts,
    confirmAiAlert,
    language,
    t,
    translateStatus
  } = useApp();

  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const aptAlerts = aiAlerts.filter((a) => a.apartmentId === apt.id);
  const isTamil = language === 'ta';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E0D5] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTamil ? 'மனிதர் சரிபார்த்தல் பாதுகாப்பு' : 'Human-in-the-Loop Anomaly Verification'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
            {t.resident.tabAlerts} • {t.common.apartment} {apt.id}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {isTamil
              ? 'சென்சார் மாறுபாடுகளைக் கவனித்து உறுதிப்படுத்துங்கள் அல்லது நிராகரியுங்கள். எந்தவொரு பணியாளரும் உங்கள் அனுமதியின்றி அனுப்பப்பட மாட்டார்.'
              : 'Review potential system anomalies flagged by edge sensors. Technicians are dispatched only after human confirmation.'}
          </p>
        </div>
      </div>

      {/* Alerts Feed */}
      {aptAlerts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E6E0D5] p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1C1E21]">
            {isTamil ? 'எச்சரிக்கைகள் எதுவும் இல்லை' : 'All Sensor Streams Normal'}
          </h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            {isTamil
              ? 'உங்கள் அலகின் அனைத்து நீர் மற்றும் மின்சார அமைப்புகளும் இயல்பான வரம்பிற்குள் இயங்குகின்றன.'
              : 'Zero active anomalies flagged for Apartment ' + apt.id + '. Edge telemetries match established historical baselines.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {aptAlerts.map((alt) => {
            const isPending = alt.status === 'pending';

            return (
              <div
                key={alt.id}
                className={`rounded-2xl border p-6 space-y-4 transition-all ${
                  isPending
                    ? 'bg-[#FFFBEB] border-[#FCD34D] shadow-sm'
                    : 'bg-white border-[#E6E0D5] shadow-2xs'
                }`}
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isPending ? 'bg-[#FDE68A] text-[#B45309]' : 'bg-[#FAF8F5] text-[#2E5A44]'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#1C1E21]">{alt.issueTitle}</h4>
                      <div className="text-[11px] text-[#6B7280] flex items-center gap-2">
                        <span>{alt.sensorName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-[#8A8275]">
                          <Clock className="w-3 h-3" />
                          {alt.detectedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto ${
                    isPending
                      ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                      : 'bg-[#FAF8F5] text-[#6B7280] border border-[#E6E0D5]'
                  }`}>
                    {translateStatus(alt.status)}
                  </span>
                </div>

                {/* Explanation */}
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {alt.explanation}
                </p>

                {/* Telemetry Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/60 rounded-xl p-3.5 border border-black/5 text-xs">
                  <div>
                    <span className="text-[#8A8275] block text-[10px] font-bold uppercase">{t.resident.readingLabel}</span>
                    <strong className="text-[#DC2626] font-black">{alt.readingValue} {alt.unit}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A8275] block text-[10px] font-bold uppercase">{t.common.baseline}</span>
                    <strong className="text-[#2E7D32] font-bold">{alt.normalRange}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A8275] block text-[10px] font-bold uppercase">{t.resident.confidence}</span>
                    <strong className="text-[#2E5A44] font-black">{alt.confidence}%</strong>
                  </div>
                </div>

                {/* Pending Actions */}
                {isPending && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => confirmAiAlert(alt.id, true)}
                      className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t.resident.confirmProblemBtn}</span>
                    </button>
                    <button
                      onClick={() => confirmAiAlert(alt.id, false)}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD6CB] text-xs font-bold text-[#1C1E21] flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-[#2E7D32]" />
                      <span>{t.resident.notProblemBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
