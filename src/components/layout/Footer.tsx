import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setUserRole, t } = useApp();

  return (
    <footer className="bg-[#1A3626] text-[#EFECE6] border-t border-[#2E5A44]/40 pt-16 pb-12 mt-20">
      <div className="app-container space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2E5A44] flex items-center justify-center text-white border border-white/20">
                <Building2 className="w-5 h-5 text-[#E8EFEA]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
                PropCare <span className="text-[#A3E3B8]">AI</span>
              </span>
            </div>

            <p className="text-sm text-[#D5CCC0] max-w-sm leading-relaxed">
              {t.footer.tagline}
            </p>

            <div className="pt-2 text-xs text-[#A3E3B8] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span>{t.home.trustSensor} • {t.home.trustConfirm}</span>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3E3B8]">
              {t.footer.solutionsTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#D5CCC0]">
              <li>{t.footer.solTelemetry}</li>
              <li>{t.footer.solAi}</li>
              <li>{t.footer.solMaint}</li>
              <li>{t.footer.solFleet}</li>
              <li>{t.footer.solPortal}</li>
            </ul>
          </div>

          {/* Column 3: Workspaces */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3E3B8]">
              {t.footer.workspacesTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#D5CCC0]">
              <li>
                <button
                  onClick={() => {
                    setUserRole('public');
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.wsPublic}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('resident');
                    setActiveTab('resident-overview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.wsResident}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('worker');
                    setActiveTab('worker-tasks');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.wsWorker}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setActiveTab('admin-command');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.wsAdmin}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('community');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.wsCommunity}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3E3B8]">
              {t.footer.contactTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#D5CCC0]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A3E3B8]" />
                <span>+91 (80) 4122-8900</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#A3E3B8]" />
                <span>ops@propcare.ai</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A3E3B8] shrink-0 mt-0.5" />
                <span>{t.footer.location}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#2E5A44]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89F91]">
          <div>
            © 2026 {t.footer.copyright}
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
