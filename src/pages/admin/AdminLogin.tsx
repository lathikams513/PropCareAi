import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, t } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(t.adminLogin.errorIncorrect);
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const success = adminLogin(password);
      if (!success) {
        setError(t.adminLogin.errorIncorrect);
        setIsLoading(false);
      }
    }, 300);
  };

  const handleQuickFill = () => {
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1C1E21] text-white shadow-md border border-[#2E5A44]/30 mb-2">
            <ShieldAlert className="w-8 h-8 text-[#A3E3B8]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1E21] tracking-tight">
              {t.adminLogin.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-xs mx-auto">
              {t.adminLogin.subtitle}
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                {t.adminLogin.passwordLabel}
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
                  placeholder={t.adminLogin.passwordPlaceholder}
                  className="form-input pl-10 pr-10 text-sm py-3 font-medium bg-[#FAF8F5] border-[#DCD6CB] focus:bg-white transition-all rounded-xl w-full"
                  autoFocus
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
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-[#1C1E21] hover:bg-black shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.adminLogin.submitBtn}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#A3E3B8]" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credential Shortcut */}
          <div className="pt-4 border-t border-[#EBE7DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#8A8275] font-medium flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#2E5A44]" />
              {t.adminLogin.demoHint}
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[#2E5A44] hover:text-[#1A3626] font-bold text-xs underline underline-offset-2 transition-colors cursor-pointer"
            >
              {t.adminLogin.quickFill}
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center text-[11px] text-[#8A8275] flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>{t.adminLogin.secureBadge}</span>
        </div>

      </div>
    </div>
  );
};
