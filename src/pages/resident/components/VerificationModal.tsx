import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Star, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerificationModalProps {
  ticketId: string;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ ticketId, onClose }) => {
  const { verifyTicketCompletion, language, t } = useApp();
  const isTamil = language === 'ta';

  const [ratingScore, setRatingScore] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>(
    isTamil
      ? 'பழுதுபார்ப்பு மிக நேர்த்தியாக முடிக்கப்பட்டது. சிறந்த பணி!'
      : 'Repairs completed professionally and cleanly. Excellent work!'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyTicketCompletion(ticketId, ratingScore, feedback);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E6E0D5] shadow-2xl space-y-6 animate-scale-in">
        
        <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2E5A44]">
              {t.resident.rateModalTitle}
            </span>
            <h3 className="text-lg font-black text-[#1C1E21] mt-0.5">
              {t.common.ticket} {ticketId}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8A8275] hover:text-[#1C1E21] p-1.5 rounded-xl hover:bg-[#FAF8F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#4B5563] block">
              {t.resident.starRatingLabel}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRatingScore(s)}
                  className={`p-2 rounded-xl text-2xl transition-transform hover:scale-125 cursor-pointer ${
                    s <= ratingScore ? 'text-[#F59E0B]' : 'text-[#DCD6CB]'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#4B5563] block">
              {t.resident.feedbackLabel}
            </label>
            <textarea
              rows={3}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CB] rounded-xl p-3 text-xs font-medium text-[#1C1E21] focus:bg-white focus:outline-none focus:border-[#2E5A44]"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="p-3 rounded-xl border border-[#DCD6CB] text-xs font-bold text-[#4B5563] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="p-3 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              {t.resident.submitSignoffBtn}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
