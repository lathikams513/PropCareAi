import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MaintenanceTicket } from '../../../types';
import { 
  X, 
  CheckCircle2, 
  Wrench, 
  FileText, 
  Package, 
  Camera, 
  DollarSign, 
  AlertCircle, 
  Upload 
} from 'lucide-react';

interface WorkCompletionModalProps {
  ticket: MaintenanceTicket;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WorkCompletionModal: React.FC<WorkCompletionModalProps> = ({ ticket, onClose, onSuccess }) => {
  const { updateWorkerJobStatus, t } = useApp();

  const [problemFound, setProblemFound] = useState(ticket.problemFound || 'Concealed micro-crack on high-pressure connector fitting behind utility riser duct.');
  const [workPerformed, setWorkPerformed] = useState(ticket.workPerformed || 'Replaced damaged fitting with industrial brass union and applied high-grade silicone sealant.');
  const [materialsUsed, setMaterialsUsed] = useState(ticket.materialsUsed?.join(', ') || '1x Brass Compression Valve, 1x Silicone O-Ring, 1x PTFE Seal Tape');
  const [notes, setNotes] = useState(ticket.workerNotes || 'System hydrostatic test completed at 3.5 bar with 0 psi drop over 15 minutes. 100% operational.');
  const [cost, setCost] = useState<number>(ticket.repairCost || 350);
  const [beforeImage, setBeforeImage] = useState(ticket.beforeImage || '/images/utility_sensor.jpg');
  const [afterImage, setAfterImage] = useState(ticket.afterImage || '/images/apartment_living.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemFound.trim() || !workPerformed.trim()) {
      setErrorMsg('Please enter both the problem found and the work performed.');
      return;
    }

    setIsSubmitting(true);
    const partsArray = materialsUsed
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    setTimeout(() => {
      updateWorkerJobStatus(ticket.ticketId, 'work_completed', {
        problemFound: problemFound.trim(),
        workPerformed: workPerformed.trim(),
        materialsUsed: partsArray,
        notes: notes.trim(),
        solutionProvided: workPerformed.trim(),
        completionRemarks: notes.trim(),
        parts: partsArray,
        cost: Number(cost) || 0,
        beforeImage,
        afterImage
      });

      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white border border-[#E6E0D5] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-[#1C1E21] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E5A44]/15 flex items-center justify-center text-[#2E5A44]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#1C1E21]">{t.worker.completeModalTitle}</h3>
              <p className="text-xs text-[#6B7280]">
                Ticket <span className="font-mono font-bold text-[#2E5A44]">{ticket.ticketId}</span> • Unit <span className="font-bold text-[#1C1E21]">{ticket.apartmentId}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#8A8275] hover:text-[#1C1E21] rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-[#DCD6CB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Problem Found */}
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1">
              Problem Found & Root Cause <span className="text-red-500">*</span>
            </label>
            <textarea
              value={problemFound}
              onChange={(e) => setProblemFound(e.target.value)}
              rows={2}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CB] focus:bg-white rounded-xl p-3 text-xs text-[#1C1E21] focus:outline-none focus:border-[#2E5A44] transition-colors leading-relaxed"
              placeholder="Describe what exact mechanical/electrical fault was identified..."
              required
            />
          </div>

          {/* Work Performed */}
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1">
              Work Performed / Solution Provided <span className="text-red-500">*</span>
            </label>
            <textarea
              value={workPerformed}
              onChange={(e) => setWorkPerformed(e.target.value)}
              rows={2}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CB] focus:bg-white rounded-xl p-3 text-xs text-[#1C1E21] focus:outline-none focus:border-[#2E5A44] transition-colors leading-relaxed"
              placeholder="Describe repairs, adjustments, or part replacements performed..."
              required
            />
          </div>

          {/* Materials & Parts Used */}
          <div>
            <label className="block text-xs font-bold text-[#1C1E21] mb-1">
              Materials & Spare Parts Used (Comma separated)
            </label>
            <input
              type="text"
              value={materialsUsed}
              onChange={(e) => setMaterialsUsed(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DCD6CB] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#1C1E21] focus:outline-none focus:border-[#2E5A44] transition-colors"
              placeholder="e.g. 1x Compression Valve, 1x PTFE Tape, 1x Washer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#1C1E21] mb-1">
                Technician Notes / Handover Remarks
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CB] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#1C1E21] focus:outline-none focus:border-[#2E5A44] transition-colors"
                placeholder="Pressure test normal, area cleaned..."
              />
            </div>

            {/* Cost */}
            <div>
              <label className="block text-xs font-bold text-[#1C1E21] mb-1">
                Estimated Material / Labor Cost (₹)
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#DCD6CB] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#1C1E21] focus:outline-none focus:border-[#2E5A44] transition-colors font-mono font-bold"
                placeholder="350"
              />
            </div>
          </div>

          {/* Photo Evidence Section */}
          <div className="pt-2 border-t border-[#EBE7DF]">
            <label className="block text-xs font-bold text-[#1C1E21] mb-2">
              Photo Evidence (Before & After)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-2xl overflow-hidden border border-[#E6E0D5] bg-[#FAF8F5] aspect-video">
                <img src={beforeImage} alt="Before Repair" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                  Before
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#E6E0D5] bg-[#FAF8F5] aspect-video">
                <img src={afterImage} alt="After Repair" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#2E5A44] text-white text-[10px] font-bold">
                  After Repaired ✓
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#EBE7DF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-[#DCD6CB] hover:bg-[#FAF8F5] text-xs font-bold text-[#4B5563] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-xl bg-[#2E5A44] hover:bg-[#1A3626] text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75 transition-all"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Completion Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
