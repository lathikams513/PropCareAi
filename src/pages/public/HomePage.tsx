import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Cpu,
  Droplets,
  Zap,
  Wind,
  Thermometer,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  UserCheck,
  TrendingUp,
  FileText,
  Clock,
  ChevronRight,
  ChevronDown,
  Check,
  AlertCircle,
  Sliders,
  Calendar,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const HomePage: React.FC = () => {
  const {
    setUserRole,
    setActiveTab,
    aiAlerts,
    confirmAiAlert,
    workers,
    t,
    language
  } = useApp();

  // Active tab for Smart Monitoring Section
  const [sensorTab, setSensorTab] = useState<'water' | 'electric' | 'temperature' | 'humidity' | 'air'>('water');
  
  // Active step for Workflow Timeline
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(4);

  // Active Building tab in Community visual section
  const [activeBuildingPreview, setActiveBuildingPreview] = useState<'A' | 'B' | 'C'>('A');

  // Live feedback message for interactive AI demo
  const [aiDemoFeedback, setAiDemoFeedback] = useState<string | null>(null);

  // Telemetry chart data for smart monitoring
  const waterTelemetryData = [
    { time: '04:00', flow: 0.2 },
    { time: '06:00', flow: 3.4 },
    { time: '08:00', flow: 6.8 },
    { time: '10:00', flow: 14.8 }, // Anomaly spike
    { time: '12:00', flow: 5.2 },
    { time: '14:00', flow: 4.1 },
    { time: '16:00', flow: 4.5 }
  ];

  const electricTelemetryData = [
    { time: '04:00', power: 0.4 },
    { time: '06:00', power: 1.2 },
    { time: '08:00', power: 2.8 },
    { time: '10:00', power: 4.9 },
    { time: '12:00', power: 1.6 },
    { time: '14:00', power: 1.4 },
    { time: '16:00', power: 1.2 }
  ];

  const tempTelemetryData = [
    { time: '04:00', temp: 23.5 },
    { time: '08:00', temp: 24.8 },
    { time: '12:00', temp: 27.2 },
    { time: '16:00', temp: 28.0 },
    { time: '20:00', temp: 25.4 }
  ];

  const workflowSteps = language === 'ta' ? [
    { step: 1, title: 'IoT சென்சார் அளவீடு', role: 'சென்சார்கள்', desc: 'வன்பொருள் சென்சார்கள் நீர் ஓட்டம், மின்னழுத்தம், அதிர்வு மற்றும் ஈரப்பதத்தைத் தொடர்ச்சியாக அளவிடுகின்றன.' },
    { step: 2, title: 'புள்ளிவிவர பகுப்பாய்வு', role: 'Isolation Forest', desc: 'குடியிருப்பின் முந்தைய அளவீடுகளுடன் ஒப்பிட்டு அசாதாரண மாற்றங்களை அல்காரிதம் கண்டறிகிறது.' },
    { step: 3, title: 'சாத்தியமான சிக்கல் கண்டறிதல்', role: 'PropCare Engine', desc: 'உடனடி பணியாளர் அனுப்புதலுக்கு பதிலாக துல்லிய சதவிகிதத்துடன் கூடிய பரிந்துரை உருவாக்கப்படுகிறது.' },
    { step: 4, title: 'குடியிருப்பாளர் உறுதிசெய்தல்', role: 'குடியிருப்பாளர் சரிபார்ப்பு', desc: 'குடியிருப்பாளர் தனது மொபைலில் சரிபார்த்து உண்மையான கசிவா அல்லது சாதாரண பயன்பாடா என உறுதிப்படுத்துகிறார்.' },
    { step: 5, title: 'பராமரிப்பு கோரிக்கை ஒப்புதல்', role: 'சொத்து மேலாளர்', desc: 'வசதி மேலாளர்கள் சிக்கலின் அவசரத்தை சரிபார்த்து, உதிரிபாகங்கள் மற்றும் அணுகலை உறுதிசெய்கிறார்கள்.' },
    { step: 6, title: 'பணியாளர் அனுப்புதல்', role: 'பணி ஒதுக்கீடு', desc: 'அருகிலுள்ள சான்றளிக்கப்பட்ட தொழில்நுட்ப வல்லுநருக்கு பழுது விவரங்கள் மற்றும் உதிரிபாகங்களுடன் பணி ஒதுக்கப்படுகிறது.' },
    { step: 7, title: 'பழுதுபார்ப்பு நிறைவு', role: 'களப்பணியாளர்', desc: 'பணியாளர் வந்து பழுதை சரிசெய்து, மாற்றப்பட்ட உதிரிபாகங்களின் புகைப்படங்களை பதிவேற்றுகிறார்.' },
    { step: 8, title: 'குடியிருப்பாளர் ஒப்புதல் & மதிப்பீடு', role: 'மதிப்பீடு & நிறைவு', desc: 'குடியிருப்பாளர் பழுதுபார்ப்பை சோதித்து, 5-நட்சத்திர மதிப்பீடு அளித்து கோரிக்கையை முடிக்கிறார்.' }
  ] : [
    { step: 1, title: 'IoT Edge Telemetry', role: 'Sensors', desc: 'Hardware sensors continuously measure water flow, power voltage, vibration, and humidity at 1-second intervals.' },
    { step: 2, title: 'Statistical Analysis', role: 'Isolation Forest', desc: 'Statistical models identify readings that deviate from the apartment\'s historical baseline.' },
    { step: 3, title: 'Possible Problem Flagged', role: 'PropCare Engine', desc: 'A tentative advisory is generated with a confidence rating rather than triggering an unverified dispatch.' },
    { step: 4, title: 'Resident Confirmation', role: 'Resident Verification', desc: 'The resident checks their mobile interface and confirms if there is an actual leak or simply intentional high usage.' },
    { step: 5, title: 'Work Order Authorization', role: 'Property Manager', desc: 'Facility managers verify problem priority, approve materials, and coordinate building access.' },
    { step: 6, title: 'Technician Dispatch', role: 'Logistics Matcher', desc: 'Nearby certified technicians receive the work order along with sensor evidence and required spare parts.' },
    { step: 7, title: 'Repair Execution', role: 'Field Technician', desc: 'The technician arrives, resolves the mechanical issue, and uploads photos of the repaired fittings.' },
    { step: 8, title: 'Resident Sign-Off', role: 'Verification & Rating', desc: 'The resident tests the repair, gives a star rating, and closes the maintenance ticket.' }
  ];

  const buildingDetails = {
    A: {
      name: language === 'ta' ? 'Cedar Heights (பிளாக் A)' : 'Cedar Heights (Block A)',
      floors: 8,
      units: 64,
      healthy: 61,
      warning: 2,
      maintenance: 1,
      desc: language === 'ta' ? 'மத்திய தோட்டத்தை நோக்கிய கிழக்கு கோபுரம். ஸ்மார்ட் பிரதான குழாய் சென்சார்கள் மற்றும் மின்தூக்கி கண்காணிப்பு கொண்டது.' : 'East Wing tower overlooking the central landscaped courtyard. Features smart main line manifold sensors and elevator telemetry.'
    },
    B: {
      name: language === 'ta' ? 'Pine Crest (பிளாக் B)' : 'Pine Crest (Block B)',
      floors: 8,
      units: 64,
      healthy: 62,
      warning: 2,
      maintenance: 0,
      desc: language === 'ta' ? 'சமூக கிளப்ஹவுஸ் அருகிலுள்ள மத்திய கோபுரம். இரட்டை மின்சுமை மீட்டர்கள் மற்றும் HVAC கூரைக்கண்காணிப்பு கொண்டது.' : 'Central tower adjacent to community clubhouse. Integrated with dual-feed power load meters and HVAC rooftop monitors.'
    },
    C: {
      name: language === 'ta' ? 'Olive Grove (பிளாக் C)' : 'Olive Grove (Block C)',
      floors: 8,
      units: 64,
      healthy: 63,
      warning: 1,
      maintenance: 0,
      desc: language === 'ta' ? 'நேரடி தோட்ட அணுகல் கொண்ட மேற்கு கோபுரம். துணை நீர் ஓட்ட சென்சார்கள் மற்றும் வெளிப்புற ஈரப்பத மானிகளுடன் பொருத்தப்பட்டுள்ளது.' : 'West Wing tower with direct garden access. Equipped with sub-metered water flow sensors and exterior humidity monitors.'
    }
  };

  // Target alert in Unit A-302
  const demoAlert = aiAlerts.find((a) => a.apartmentId === 'A-302') || aiAlerts[0];

  const handleDemoConfirm = (isProblem: boolean) => {
    if (demoAlert) {
      confirmAiAlert(demoAlert.id, isProblem, isProblem ? 'Resident confirmed issue via interactive demo' : 'Resident verified as normal intended usage');
      setAiDemoFeedback(isProblem ? t.home.aiConfirmedFeedback : t.home.aiDismissedFeedback);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      
      {/* 1. HOMEPAGE HERO */}
      <section className="relative min-h-screen h-screen w-full flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero_community.jpg')" }}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none" />

        <div className="relative z-10 app-container pt-20 pb-10 flex items-center">
          <div className="max-w-2xl text-left space-y-6 text-white animate-fade-in">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-[#A3E3B8] text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
              {t.home.heroBadge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {t.home.heroTitle1}<br />
              <span className="text-[#A3E3B8]">{t.home.heroTitle2}</span>
            </h1>

            <div className="text-lg sm:text-xl font-bold text-white/90 tracking-wide">
              {t.home.heroTagline}
            </div>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl font-normal">
              {t.home.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveTab('community');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#2E5A44] text-white font-bold text-sm hover:bg-[#1A3626] shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
              >
                <span>{t.home.exploreBtn}</span>
                <ArrowRight className="w-4 h-4 text-[#A3E3B8]" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/15 text-white font-bold text-sm hover:bg-white/25 border border-white/25 backdrop-blur-md transition-all duration-200"
              >
                <span>{t.home.howItWorksBtn}</span>
              </button>
            </div>

            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-white/70 font-semibold tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                {t.home.trustSensor}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                {t.home.trustConfirm}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                {t.home.trustDispatch}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                {t.home.trustResolved}
              </span>
            </div>

          </div>
        </div>

        <div 
          onClick={() => scrollToSection('about-section')}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 cursor-pointer flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors animate-bounce"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest">{t.home.scrollDown}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* 2. EDITORIAL INTRO */}
      <section id="about-section" className="app-container pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E6E0D5]">
              <img
                src="/images/apartment_living.jpg"
                alt="Modern Apartment Living Room"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1E21]">{t.home.aboutPhotoApt}</div>
                  <div className="text-[11px] text-[#6B7280]">{t.home.aboutPhotoSub}</div>
                </div>
                <span className="badge badge-healthy text-[10px]">{t.home.aboutPhotoBadge}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="eyebrow">
              <Building2 className="w-3.5 h-3.5" /> {t.home.aboutEyebrow}
            </div>

            <h2 className="h2 leading-tight">
              {t.home.aboutTitle}
            </h2>

            <p className="body-text text-base leading-relaxed">
              {t.home.aboutDesc1}
            </p>

            <p className="body-text text-sm text-[#6B7280] leading-relaxed">
              {t.home.aboutDesc2}
            </p>

            <div className="pt-4 border-t border-[#E6E0D5] space-y-4">
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-extrabold text-[#2E5A44] mt-0.5">01</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1E21]">{t.home.aboutFeature1Title}</h4>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{t.home.aboutFeature1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-extrabold text-[#B45309] mt-0.5">02</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1E21]">{t.home.aboutFeature2Title}</h4>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{t.home.aboutFeature2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-extrabold text-[#0369A1] mt-0.5">03</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1E21]">{t.home.aboutFeature3Title}</h4>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{t.home.aboutFeature3Desc}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. COMMUNITY TOPOLOGY */}
      <section className="relative py-16 bg-[#F4F1EB] border-y border-[#E6E0D5] overflow-hidden">
        <div className="relative z-10 app-container space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="eyebrow">
                <Layers className="w-3.5 h-3.5" /> {t.home.communityEyebrow}
              </div>
              <h2 className="h2">
                {t.home.communityTitle}
              </h2>
              <p className="body-text">
                {t.home.communityDesc}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#E6E0D5] shadow-xs">
              {(['A', 'B', 'C'] as const).map((blockKey) => (
                <button
                  key={blockKey}
                  onClick={() => setActiveBuildingPreview(blockKey)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeBuildingPreview === blockKey
                      ? 'bg-[#2E5A44] text-white shadow-xs'
                      : 'text-[#6B7280] hover:text-[#1C1E21]'
                  }`}
                >
                  {t.common.block} {blockKey}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-white border border-[#E6E0D5] shadow-md grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-7 relative min-h-[360px]">
              <img
                src="/images/block_complex.jpg"
                alt="Green Meadows Residential Tower"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-6 left-6">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#2E5A44] text-xs font-extrabold shadow-md">
                  {t.common.block} {activeBuildingPreview} {t.home.communityActiveSelection}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <h3 className="text-2xl font-extrabold">{buildingDetails[activeBuildingPreview].name}</h3>
                <p className="text-xs text-white/80">{buildingDetails[activeBuildingPreview].desc}</p>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-4">
                  <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{t.home.communityInventory}</span>
                  <span className="badge badge-healthy text-xs">{buildingDetails[activeBuildingPreview].healthy} {t.home.communityHealthyBadge}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[#FAF8F5]">
                    <span className="text-[#6B7280]">{t.home.communityFloors}</span>
                    <span className="font-extrabold text-[#1C1E21]">{buildingDetails[activeBuildingPreview].floors}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[#FAF8F5]">
                    <span className="text-[#6B7280]">{t.home.communityUnits}</span>
                    <span className="font-extrabold text-[#1C1E21]">{buildingDetails[activeBuildingPreview].units}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-[#FAF8F5]">
                    <span className="text-[#6B7280]">{t.home.communityWarnings}</span>
                    <span className="font-extrabold text-[#B45309]">{buildingDetails[activeBuildingPreview].warning}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-[#6B7280]">{t.home.communityMaint}</span>
                    <span className="font-extrabold text-[#0369A1]">{buildingDetails[activeBuildingPreview].maintenance}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('community');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full btn-primary py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>{t.home.communityNavigateBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. HOW PROPCARE WORKS */}
      <section id="how-it-works" className="app-container space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="eyebrow mx-auto">
            <Activity className="w-3.5 h-3.5" /> {t.home.workflowEyebrow}
          </div>
          <h2 className="h2">
            {t.home.workflowTitle}
          </h2>
          <p className="body-text">
            {t.home.workflowDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {workflowSteps.map((ws) => {
            const isActive = activeWorkflowStep === ws.step;
            return (
              <button
                key={ws.step}
                onClick={() => setActiveWorkflowStep(ws.step)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-md'
                    : 'bg-white border-[#E6E0D5] text-[#1C1E21] hover:border-[#2E5A44]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-[#2E5A44]' : 'bg-[#FAF8F5] text-[#6B7280]'
                  }`}>
                    {ws.step}
                  </span>
                  <span className={`text-[9px] font-bold uppercase truncate ${isActive ? 'text-white/80' : 'text-[#8A8275]'}`}>
                    {ws.role}
                  </span>
                </div>
                <div className="font-bold text-xs truncate">{ws.title}</div>
              </button>
            );
          })}
        </div>

        {(() => {
          const cur = workflowSteps.find((s) => s.step === activeWorkflowStep) || workflowSteps[0];
          return (
            <div className="p-8 rounded-3xl bg-white border border-[#E6E0D5] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="text-xs font-bold text-[#2E5A44] uppercase tracking-wider">
                  {t.home.workflowStepOf} {cur.step} {t.home.workflowOf} {cur.role.toUpperCase()}
                </div>
                <h3 className="text-xl font-extrabold text-[#1C1E21]">{cur.title}</h3>
                <p className="body-text text-sm leading-relaxed text-[#4B5563]">
                  {cur.desc}
                </p>
              </div>

              <div className="lg:col-span-4 flex items-center justify-end gap-3">
                <button
                  disabled={activeWorkflowStep === 1}
                  onClick={() => setActiveWorkflowStep((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#DCD6CB] hover:bg-[#FAF8F5] disabled:opacity-40"
                >
                  {t.home.workflowPrev}
                </button>
                <button
                  disabled={activeWorkflowStep === 8}
                  onClick={() => setActiveWorkflowStep((prev) => Math.min(8, prev + 1))}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2E5A44] text-white hover:bg-[#1A3626] disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>{t.home.workflowNext}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}

      </section>

      {/* 5. AI DETECTION */}
      <section id="ai-detection" className="app-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E6E0D5]">
              <img
                src="/images/utility_sensor.jpg"
                alt="Apartment Kitchen Utility Sensor"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1E21]">{t.home.aiSensorEvidence}</div>
                  <div className="text-[11px] text-[#B45309] font-semibold">{t.home.aiSensorSubtitle}</div>
                </div>
                <span className="badge badge-warning text-[10px]">{t.home.aiSensorBadge}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="eyebrow text-[#B45309]">
              <Sparkles className="w-3.5 h-3.5" /> {t.home.aiEyebrow}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-widest text-[#B45309]">
                {t.home.aiFlagged}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1E21] leading-tight">
                {t.home.aiTitle}
              </h2>
            </div>

            <p className="body-text text-sm leading-relaxed">
              {t.home.aiDesc}
            </p>

            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D5] shadow-xs space-y-4">
              <div className="grid grid-cols-3 gap-4 border-b border-[#EBE7DF] pb-4">
                <div>
                  <div className="text-[11px] text-[#6B7280]">{t.home.aiCurrentFlow}</div>
                  <div className="text-xl font-extrabold text-[#B91C1C] mt-0.5">14.8 <span className="text-xs font-normal text-[#6B7280]">L/min</span></div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6B7280]">{t.home.aiNormalExpected}</div>
                  <div className="text-xl font-extrabold text-[#1C1E21] mt-0.5">4.0–8.0 <span className="text-xs font-normal text-[#6B7280]">L/min</span></div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6B7280]">{t.home.aiConfidence}</div>
                  <div className="text-xl font-extrabold text-[#2E5A44] mt-0.5">94%</div>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  {t.home.aiStatusAwaiting}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDemoConfirm(true)}
                    className="p-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {t.home.aiConfirmBtn}
                  </button>
                  <button
                    onClick={() => handleDemoConfirm(false)}
                    className="p-3 rounded-xl bg-[#F4F1EB] hover:bg-[#E6E0D5] text-[#1C1E21] text-xs font-extrabold flex items-center justify-center gap-1.5 border border-[#DCD6CB] transition-all"
                  >
                    <Check className="w-4 h-4 text-[#2E7D32]" />
                    {t.home.aiDismissBtn}
                  </button>
                </div>
              </div>

              {aiDemoFeedback && (
                <div className="p-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-bold text-[#2E7D32] animate-fade-in flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{aiDemoFeedback}</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 6. SMART MONITORING */}
      <section id="smart-monitoring" className="app-container space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="eyebrow mx-auto">
            <Cpu className="w-3.5 h-3.5" /> {t.home.monitorEyebrow}
          </div>
          <h2 className="h2">
            {t.home.monitorTitle}
          </h2>
          <p className="body-text">
            {t.home.monitorDesc}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E6E0D5] shadow-sm space-y-8">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EBE7DF]">
            <button
              onClick={() => setSensorTab('water')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                sensorTab === 'water'
                  ? 'bg-[#2E5A44] text-white shadow-xs'
                  : 'bg-[#F4F1EB] text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>{t.home.monitorTabWater}</span>
            </button>
            <button
              onClick={() => setSensorTab('electric')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                sensorTab === 'electric'
                  ? 'bg-[#2E5A44] text-white shadow-xs'
                  : 'bg-[#F4F1EB] text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{t.home.monitorTabPower}</span>
            </button>
            <button
              onClick={() => setSensorTab('temperature')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                sensorTab === 'temperature'
                  ? 'bg-[#2E5A44] text-white shadow-xs'
                  : 'bg-[#F4F1EB] text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              <Thermometer className="w-4 h-4" />
              <span>{t.home.monitorTabTemp}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 h-72 w-full">
              <div className="text-xs font-bold text-[#6B7280] mb-3 flex items-center justify-between">
                <span>{t.home.monitorChartTitle}</span>
                <span className="text-[#2E7D32] flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" /> {t.common.liveStream}
                </span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                {sensorTab === 'water' ? (
                  <AreaChart data={waterTelemetryData}>
                    <defs>
                      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0369A1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0369A1" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#9E9382" fontSize={11} />
                    <YAxis stroke="#9E9382" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E6E0D5' }} />
                    <Area type="monotone" dataKey="flow" stroke="#0369A1" strokeWidth={3} fillOpacity={1} fill="url(#waterGrad)" name="Water Flow (L/min)" />
                  </AreaChart>
                ) : sensorTab === 'electric' ? (
                  <AreaChart data={electricTelemetryData}>
                    <defs>
                      <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B45309" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#B45309" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#9E9382" fontSize={11} />
                    <YAxis stroke="#9E9382" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E6E0D5' }} />
                    <Area type="monotone" dataKey="power" stroke="#B45309" strokeWidth={3} fillOpacity={1} fill="url(#elecGrad)" name="Power Load (kW)" />
                  </AreaChart>
                ) : (
                  <AreaChart data={tempTelemetryData}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E5A44" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2E5A44" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#9E9382" fontSize={11} />
                    <YAxis stroke="#9E9382" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E6E0D5' }} />
                    <Area type="monotone" dataKey="temp" stroke="#2E5A44" strokeWidth={3} fillOpacity={1} fill="url(#tempGrad)" name="Temperature (°C)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-4 space-y-4 bg-[#FAF8F5] p-6 rounded-2xl border border-[#E6E0D5]">
              <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
                <span className="text-xs font-bold text-[#1C1E21] uppercase tracking-wider">{t.home.monitorInspectionTitle}</span>
                <span className="badge badge-healthy text-[10px]">{t.common.active}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t.home.monitorCurrentReading}</span>
                  <span className="font-extrabold text-[#1C1E21]">
                    {sensorTab === 'water' ? '4.5 L/min' : sensorTab === 'electric' ? '1.2 kW' : '24°C'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t.home.monitorNormalBaseline}</span>
                  <span className="font-bold text-[#2E7D32]">
                    {sensorTab === 'water' ? '0–8.0 L/min' : sensorTab === 'electric' ? '0.2–4.5 kW' : '22–26°C'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t.home.monitorSamplingFreq}</span>
                  <span className="font-bold text-[#1C1E21]">{t.home.monitorSamplingValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t.home.monitorModel}</span>
                  <span className="font-bold text-[#2E5A44]">Isolation Forest v2.4</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setUserRole('resident');
                  setActiveTab('resident-sensors');
                }}
                className="w-full btn-secondary py-2.5 text-xs font-bold mt-2"
              >
                {t.home.monitorOpenBtn}
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 7. MAINTENANCE MANAGEMENT */}
      <section className="app-container space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="eyebrow">
              <Wrench className="w-3.5 h-3.5" /> {t.home.maintEyebrow}
            </div>
            <h2 className="h2">
              {t.home.maintTitle}
            </h2>
            <p className="body-text">
              {t.home.maintDesc}
            </p>
          </div>

          <button
            onClick={() => {
              setUserRole('admin');
              setActiveTab('admin-command');
            }}
            className="btn-secondary text-xs font-bold self-start md:self-auto"
          >
            {t.home.maintOpenAdminBtn}
          </button>
        </div>

        <div className="rounded-3xl overflow-hidden bg-white border border-[#E6E0D5] shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE7DF] bg-[#FAF8F5] text-[#6B7280] uppercase tracking-wider font-bold">
                <th className="p-4">{t.home.maintThTicket}</th>
                <th className="p-4">{t.home.maintThCategory}</th>
                <th className="p-4">{t.home.maintThApartment}</th>
                <th className="p-4">{t.home.maintThTech}</th>
                <th className="p-4">{t.home.maintThStatus}</th>
                <th className="p-4">{t.home.maintThTime}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7DF]">
              <tr className="hover:bg-[#FAF8F5] transition-colors">
                <td className="p-4 font-bold text-[#1C1E21]">PC-2026-00125</td>
                <td className="p-4">
                  <div className="font-bold text-[#1C1E21]">{language === 'ta' ? 'சமையலறை தொட்டிக்கு அடியில் நீர் கசிவு' : 'Water Leakage under Kitchen Sink'}</div>
                  <div className="text-[11px] text-[#6B7280]">{language === 'ta' ? 'நீர் ஓட்டம் 14.8 L/min மாறுபாடு' : 'Water flow 14.8 L/min anomaly'}</div>
                </td>
                <td className="p-4 font-bold text-[#2E5A44]">A-302</td>
                <td className="p-4 font-semibold text-[#1C1E21]">Ravi Kumar ({language === 'ta' ? 'பிளம்பர்' : 'Master Plumber'})</td>
                <td className="p-4">
                  <span className="badge badge-warning text-[10px]">{t.common.inProgress}</span>
                </td>
                <td className="p-4 text-[#8A8275]">10:42 AM</td>
              </tr>

              <tr className="hover:bg-[#FAF8F5] transition-colors">
                <td className="p-4 font-bold text-[#1C1E21]">PC-2026-00124</td>
                <td className="p-4">
                  <div className="font-bold text-[#1C1E21]">{language === 'ta' ? 'மின் தடை சுவிட்ச் விழுதல்' : 'Circuit Breaker Tripping'}</div>
                  <div className="text-[11px] text-[#6B7280]">{language === 'ta' ? 'HVAC மின்சுமை சமநிலை' : 'HVAC compressor phase load'}</div>
                </td>
                <td className="p-4 font-bold text-[#2E5A44]">B-104</td>
                <td className="p-4 font-semibold text-[#1C1E21]">Suresh Patel ({language === 'ta' ? 'எலக்ட்ரீசியன்' : 'Electrician'})</td>
                <td className="p-4">
                  <span className="badge badge-healthy text-[10px]">{t.common.verified} (5.0★)</span>
                </td>
                <td className="p-4 text-[#8A8275]">{language === 'ta' ? 'நேற்று' : 'Yesterday'}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="app-container">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[380px] flex items-center justify-center text-center p-8 sm:p-16">
          <img
            src="/images/balcony_nature.jpg"
            alt="Sunny Apartment Balcony View"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/65" />

          <div className="relative z-10 space-y-6 max-w-2xl text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {t.home.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              {t.home.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveTab('community');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-xl bg-white text-[#1C1E21] font-extrabold text-sm hover:bg-[#FAF8F5] shadow-lg transition-all"
              >
                {t.home.ctaExploreBtn}
              </button>
              <button
                onClick={() => {
                  setUserRole('resident');
                  setActiveTab('resident-overview');
                }}
                className="px-8 py-3.5 rounded-xl bg-[#2E5A44] text-white font-extrabold text-sm hover:bg-[#1A3626] border border-white/20 shadow-lg transition-all"
              >
                {t.home.ctaResidentBtn}
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
