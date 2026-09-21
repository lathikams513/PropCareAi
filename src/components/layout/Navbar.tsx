import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Globe,
  Menu,
  X,
  User,
  ShieldAlert,
  Wrench,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    t
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setMobileMenuOpen(false);
    if (role === 'public') setActiveTab('home');
    if (role === 'resident') setActiveTab('resident-overview');
    if (role === 'admin') setActiveTab('admin-command');
    if (role === 'worker') setActiveTab('worker-tasks');
  };

  const scrollToPublicSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (userRole !== 'public') {
      setUserRole('public');
    }
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const isHomeHero = userRole === 'public' && activeTab === 'home';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EBE7DF] text-[#1C1E21] py-3.5'
          : isHomeHero
          ? 'bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white border-b border-white/10 py-5'
          : 'bg-white/95 backdrop-blur-md border-b border-[#EBE7DF] text-[#1C1E21] py-4'
      }`}
    >
      <div className="app-container flex items-center justify-between gap-6">
        
        {/* LEFT: BRAND IDENTITY LOGO */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          onClick={() => handleRoleChange('public')}
        >
          <div className="w-10 h-10 rounded-xl bg-[#2E5A44] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 border border-white/20">
            <Building2 className="w-5 h-5 text-[#E8EFEA]" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-extrabold text-xl tracking-tight font-sans transition-colors ${
              isScrolled || !isHomeHero ? 'text-[#1C1E21]' : 'text-white'
            }`}>
              PropCare <span className="text-[#4D7C5D] font-semibold text-lg">AI</span>
            </span>
            <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border transition-colors ${
              isScrolled || !isHomeHero
                ? 'bg-[#E8EFEA] text-[#2E5A44] border-[#C8DCCF]'
                : 'bg-white/15 text-white border-white/25 backdrop-blur-sm'
            }`}>
              {language === 'ta' ? 'ஸ்மார்ட் வாழ்வு' : 'Smart Living'}
            </span>
          </div>
        </div>

        {/* CENTER: CLEAN HORIZONTAL NAVIGATION */}
        {userRole === 'public' && (
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors duration-200 ${
                activeTab === 'home'
                  ? isScrolled || !isHomeHero ? 'text-[#2E5A44] font-bold' : 'text-white font-bold'
                  : isScrolled || !isHomeHero ? 'text-[#4B5563] hover:text-[#1C1E21]' : 'text-white/80 hover:text-white'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => scrollToPublicSection('about-section')}
              className={`transition-colors duration-200 ${
                isScrolled || !isHomeHero ? 'text-[#4B5563] hover:text-[#1C1E21]' : 'text-white/80 hover:text-white'
              }`}
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToPublicSection('how-it-works')}
              className={`transition-colors duration-200 ${
                isScrolled || !isHomeHero ? 'text-[#4B5563] hover:text-[#1C1E21]' : 'text-white/80 hover:text-white'
              }`}
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => scrollToPublicSection('smart-monitoring')}
              className={`transition-colors duration-200 ${
                isScrolled || !isHomeHero ? 'text-[#4B5563] hover:text-[#1C1E21]' : 'text-white/80 hover:text-white'
              }`}
            >
              {t.nav.smartMonitoring}
            </button>
            <button
              onClick={() => {
                setActiveTab('community');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors duration-200 ${
                activeTab === 'community'
                  ? isScrolled || !isHomeHero ? 'text-[#2E5A44] font-bold' : 'text-white font-bold'
                  : isScrolled || !isHomeHero ? 'text-[#4B5563] hover:text-[#1C1E21]' : 'text-white/80 hover:text-white'
              }`}
            >
              {t.nav.community}
            </button>
          </nav>
        )}

        {/* RIGHT: ACTION BUTTONS (RESIDENT, ADMIN, LANGUAGE) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              isScrolled || !isHomeHero
                ? 'bg-[#FAF8F5] border-[#DCD6CB] text-[#484137] hover:bg-[#EFECE6]'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
            title={t.nav.toggleLanguage}
          >
            {language === 'en' ? 'தமிழ்' : 'English'}
          </button>

          {/* Resident Portal Button */}
          <button
            onClick={() => handleRoleChange('resident')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'resident'
                ? 'bg-[#2E5A44] text-white shadow-sm'
                : isScrolled || !isHomeHero
                ? 'bg-[#FAF8F5] text-[#1C1E21] border border-[#DCD6CB] hover:bg-[#EFECE6]'
                : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.nav.resident}</span>
          </button>

          {/* Admin Command Button */}
          <button
            onClick={() => handleRoleChange('admin')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'admin'
                ? 'bg-[#1C1E21] text-white shadow-sm'
                : isScrolled || !isHomeHero
                ? 'bg-[#FAF8F5] text-[#1C1E21] border border-[#DCD6CB] hover:bg-[#EFECE6]'
                : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.nav.admin}</span>
          </button>

          {/* Worker Portal Button */}
          <button
            onClick={() => handleRoleChange('worker')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'worker'
                ? 'bg-amber-500 text-gray-950 shadow-sm font-extrabold'
                : isScrolled || !isHomeHero
                ? 'bg-[#FAF8F5] text-[#1C1E21] border border-[#DCD6CB] hover:bg-[#EFECE6]'
                : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
            }`}
          >
            <Wrench className={`w-3.5 h-3.5 ${userRole === 'worker' ? 'text-gray-950' : 'text-amber-500'}`} />
            <span>{t.nav.worker}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl border ${
              isScrolled || !isHomeHero
                ? 'bg-[#FAF8F5] border-[#DCD6CB] text-[#1C1E21]'
                : 'bg-white/15 border-white/25 text-white backdrop-blur-sm'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 bg-white border-b border-[#EBE7DF] px-6 py-6 space-y-4 shadow-xl text-[#1C1E21] animate-fade-in">
          <div className="space-y-3 font-semibold text-sm">
            <button
              onClick={() => {
                setActiveTab('home');
                handleRoleChange('public');
              }}
              className="block w-full text-left py-2 hover:text-[#2E5A44]"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => scrollToPublicSection('about-section')}
              className="block w-full text-left py-2 hover:text-[#2E5A44]"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToPublicSection('how-it-works')}
              className="block w-full text-left py-2 hover:text-[#2E5A44]"
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => scrollToPublicSection('smart-monitoring')}
              className="block w-full text-left py-2 hover:text-[#2E5A44]"
            >
              {t.nav.smartMonitoring}
            </button>
            <button
              onClick={() => {
                setActiveTab('community');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-[#2E5A44]"
            >
              {t.nav.community}
            </button>
          </div>

          <div className="pt-4 border-t border-[#EBE7DF] grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => handleRoleChange('resident')}
              className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD6CB] text-center"
            >
              {t.nav.resident}
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD6CB] text-center"
            >
              {t.nav.admin}
            </button>
            <button
              onClick={() => handleRoleChange('worker')}
              className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD6CB] text-center col-span-2"
            >
              {t.nav.worker}
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
