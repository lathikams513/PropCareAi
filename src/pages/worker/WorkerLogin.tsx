import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserCheck, CheckCircle2, KeyRound } from 'lucide-react';

export const WorkerLogin: React.FC = () => {
  const { workers, workerLogin, t } = useApp();
  const [workerIdOrName, setWorkerIdOrName] = useState('WRK-102');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(t.workerLogin.errorIncorrect);
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const success = workerLogin(workerIdOrName, password);
      if (!success) {
        setError(t.workerLogin.errorIncorrect);
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSelectPreset = (wId: string) => {
    setWorkerIdOrName(wId);
    setPassword('worker123');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2E5A44] text-white shadow-md border border-white/20 mb-2">
            <Wrench className="w-8 h-8 text-[#E8EFEA]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1E21] tracking-tight">
              {t.workerLogin.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-xs mx-auto">
              {t.workerLogin.subtitle}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#E6E0D5] shadow-lg space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error message alert */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] text-xs font-semibold flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                <span>{error}</span>
              </div>
            )}

            {/* Technician Selection & Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                {t.workerLogin.workerIdLabel}
              </label>
              
              {/* Preset Worker Avatars */}
              <div className="grid grid-cols-2 gap-2 pb-1">
                {workers.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSelectPreset(w.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      workerIdOrName === w.id || workerIdOrName === w.name
                        ? 'bg-[#E8EFEA] border-[#2E5A44] text-[#1C1E21] shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E6E0D5] text-[#6B7280] hover:border-[#2E5A44]/50'
                    }`}
                  >
                    <img src={w.avatar} alt={w.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate text-[#1C1E21]">{w.name}</div>
                      <div className="text-[10px] text-[#2E5A44] truncate">{w.role}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8275]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={workerIdOrName}
                  onChange={(e) => {
                    setWorkerIdOrName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={t.workerLogin.workerIdPlaceholder}
                  className="form-input pl-10 text-sm py-2.5 font-medium bg-[#FAF8F5] border-[#DCD6CB] focus:bg-white transition-all rounded-xl w-full"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                {t.workerLogin.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8275]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={t.workerLogin.passwordPlaceholder}
                  className="form-input pl-10 pr-10 text-sm py-3 font-medium bg-[#FAF8F5] border-[#DCD6CB] focus:bg-white transition-all rounded-xl w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8275] hover:text-[#1C1E21] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-[#2E5A44] hover:bg-[#1A3626] shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.workerLogin.submitBtn}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#A3E3B8]" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credential Shortcut */}
          <div className="pt-4 border-t border-[#EBE7DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#8A8275] font-medium flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#2E5A44]" />
              {t.workerLogin.demoHint}
            </span>
            <button
              type="button"
              onClick={() => {
                setPassword('worker123');
                setError(null);
              }}
              className="text-[#2E5A44] hover:text-[#1A3626] font-bold text-xs underline underline-offset-2 transition-colors cursor-pointer"
            >
              {t.workerLogin.quickFill}
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center text-[11px] text-[#8A8275] flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>{t.workerLogin.secureBadge}</span>
        </div>

      </div>
    </div>
  );
};
