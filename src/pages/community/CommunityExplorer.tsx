import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Lock,
  Unlock,
  KeyRound,
  User,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  DoorClosed,
  Home,
  Droplets,
  Zap,
  Thermometer,
  Wind,
  Check,
  Delete,
  CornerDownLeft,
  Navigation
} from 'lucide-react';

export const CommunityExplorer: React.FC = () => {
  const {
    blocks,
    apartments,
    setUserRole,
    setCurrentApartmentId,
    setActiveTab,
    t,
    language,
    translateStatus
  } = useApp();

  // Navigation steps: 'blocks' | 'floors' | 'doors' | 'access' | 'interior'
  const [navStep, setNavStep] = useState<'blocks' | 'floors' | 'doors' | 'access' | 'interior'>('blocks');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('A');
  const [selectedFloor, setSelectedFloor] = useState<number>(3);
  const [selectedAptId, setSelectedAptId] = useState<string>('A-302');
  
  // PIN lock state for door access
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const activeBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];
  const activeApartment = apartments.find((a) => a.id === selectedAptId) || apartments[0];

  // Apartments on selected floor
  const floorApartments = apartments.filter(
    (a) => a.blockId === selectedBlockId && a.floor === selectedFloor
  );

  const displayDoors = floorApartments.length > 0 ? floorApartments : [
    {
      id: `${selectedBlockId}-${selectedFloor}01`,
      blockId: selectedBlockId,
      floor: selectedFloor,
      doorNumber: `${selectedFloor}01`,
      resident: { id: 'RES-GEN1', apartmentId: `${selectedBlockId}-${selectedFloor}01`, name: 'Aarav Sharma', email: '', phone: '', pin: '1234', moveInDate: '', emergencyContact: '' },
      status: 'healthy' as const,
      sensorSummary: { temperature: 24, humidity: 50, waterFlow: 4.5, powerUsage: 1.2, airQuality: 30 },
      hasActiveAlert: false,
      sensors: []
    },
    {
      id: `${selectedBlockId}-${selectedFloor}02`,
      blockId: selectedBlockId,
      floor: selectedFloor,
      doorNumber: `${selectedFloor}02`,
      resident: { id: 'RES-GEN2', apartmentId: `${selectedBlockId}-${selectedFloor}02`, name: 'Ananya Kumar', email: '', phone: '', pin: '1234', moveInDate: '', emergencyContact: '' },
      status: selectedAptId === `${selectedBlockId}-${selectedFloor}02` ? activeApartment.status : 'healthy' as const,
      sensorSummary: { temperature: 24.2, humidity: 52, waterFlow: 14.8, powerUsage: 1.45, airQuality: 34 },
      hasActiveAlert: selectedBlockId === 'A' && selectedFloor === 3,
      sensors: []
    },
    {
      id: `${selectedBlockId}-${selectedFloor}03`,
      blockId: selectedBlockId,
      floor: selectedFloor,
      doorNumber: `${selectedFloor}03`,
      resident: { id: 'RES-GEN3', apartmentId: `${selectedBlockId}-${selectedFloor}03`, name: 'Karthik Rao', email: '', phone: '', pin: '1234', moveInDate: '', emergencyContact: '' },
      status: 'healthy' as const,
      sensorSummary: { temperature: 23.8, humidity: 48, waterFlow: 3.8, powerUsage: 0.9, airQuality: 28 },
      hasActiveAlert: false,
      sensors: []
    },
    {
      id: `${selectedBlockId}-${selectedFloor}04`,
      blockId: selectedBlockId,
      floor: selectedFloor,
      doorNumber: `${selectedFloor}04`,
      resident: { id: 'RES-GEN4', apartmentId: `${selectedBlockId}-${selectedFloor}04`, name: 'Meera Nambiar', email: '', phone: '', pin: '1234', moveInDate: '', emergencyContact: '' },
      status: 'healthy' as const,
      sensorSummary: { temperature: 24.5, humidity: 50, waterFlow: 4.0, powerUsage: 1.1, airQuality: 31 },
      hasActiveAlert: false,
      sensors: []
    },
    {
      id: `${selectedBlockId}-${selectedFloor}05`,
      blockId: selectedBlockId,
      floor: selectedFloor,
      doorNumber: `${selectedFloor}05`,
      resident: { id: 'RES-GEN5', apartmentId: `${selectedBlockId}-${selectedFloor}05`, name: 'Vikram Joshi', email: '', phone: '', pin: '1234', moveInDate: '', emergencyContact: '' },
      status: 'healthy' as const,
      sensorSummary: { temperature: 24.0, humidity: 49, waterFlow: 4.2, powerUsage: 1.3, airQuality: 29 },
      hasActiveAlert: false,
      sensors: []
    }
  ];

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
    setNavStep('floors');
  };

  const handleFloorSelect = (floorNum: number) => {
    setSelectedFloor(floorNum);
    setNavStep('doors');
  };

  const handleDoorSelect = (aptId: string) => {
    setSelectedAptId(aptId);
    setEnteredPin('');
    setPinError('');
    setNavStep('access');
  };

  const handleKeypadPress = (num: string) => {
    if (enteredPin.length < 4) {
      setEnteredPin((prev) => prev + num);
      setPinError('');
    }
  };

  const handleKeypadDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError('');
  };

  const handleEnterApartment = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setNavStep('interior');
    }, 700);
  };

  const handleProceedToDashboard = () => {
    setUserRole('resident');
    setCurrentApartmentId(selectedAptId);
    setActiveTab('resident-overview');
  };

  return (
    <div className="app-container py-8 space-y-8 animate-fade-in">
      
      {/* Top Breadcrumb Trail & Step Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E6E0D5] pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280]">
          <button
            onClick={() => setNavStep('blocks')}
            className={`hover:text-[#2E5A44] transition-colors flex items-center gap-1 ${
              navStep === 'blocks' ? 'text-[#2E5A44] font-extrabold' : ''
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.community.groundsBreadcrumb}</span>
          </button>
          
          {navStep !== 'blocks' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <button
                onClick={() => setNavStep('floors')}
                className={`hover:text-[#2E5A44] transition-colors ${
                  navStep === 'floors' ? 'text-[#2E5A44] font-extrabold' : ''
                }`}
              >
                {activeBlock.name}
              </button>
            </>
          )}

          {(navStep === 'doors' || navStep === 'access' || navStep === 'interior') && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <button
                onClick={() => setNavStep('doors')}
                className={`hover:text-[#2E5A44] transition-colors ${
                  navStep === 'doors' ? 'text-[#2E5A44] font-extrabold' : ''
                }`}
              >
                {t.common.floor} {selectedFloor === 0 ? (language === 'ta' ? 'தரைத்தளம்' : 'Ground') : selectedFloor}
              </button>
            </>
          )}

          {(navStep === 'access' || navStep === 'interior') && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span className="text-[#1C1E21] font-extrabold">
                {t.common.apartment} {selectedAptId}
              </span>
            </>
          )}
        </div>

        {navStep !== 'blocks' && (
          <button
            onClick={() => {
              if (navStep === 'interior') setNavStep('access');
              else if (navStep === 'access') setNavStep('doors');
              else if (navStep === 'doors') setNavStep('floors');
              else if (navStep === 'floors') setNavStep('blocks');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DCD6CB] text-xs font-bold text-[#4B5563] hover:text-[#1C1E21] hover:border-[#2E5A44] shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.common.back}</span>
          </button>
        )}
      </div>

      {/* STEP 1: COMMUNITY GROUNDS */}
      {navStep === 'blocks' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="space-y-1 max-w-2xl">
            <div className="eyebrow">
              <Layers className="w-3.5 h-3.5" /> {t.home.communityEyebrow}
            </div>
            <h1 className="h2">
              {t.community.chooseBuildingTitle}
            </h1>
            <p className="body-text">
              {t.community.chooseBuildingDesc}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E6E0D5] min-h-[460px] flex flex-col justify-end p-6 sm:p-10">
            <img
              src="/images/block_complex.jpg"
              alt="Green Meadows Residential Complex"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 space-y-6">
              <div className="text-white space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A3E3B8]">Green Meadows Estates</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.community.towersTitle}</h2>
                <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                  {t.community.towersDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blocks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBlockSelect(b.id)}
                    className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 text-left hover:bg-white hover:border-[#2E5A44] transition-all duration-300 shadow-lg group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#2E5A44] text-white text-xs font-extrabold">
                        {t.common.block} {b.id}
                      </span>
                      <span className="badge badge-healthy text-[10px]">{b.healthyCount} {t.home.communityHealthyBadge}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#1C1E21] group-hover:text-[#2E5A44] transition-colors">
                      {b.name}
                    </h3>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">{b.totalFloors} {t.home.communityFloors} • {b.totalApartments} {t.home.communityUnits}</p>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EBE7DF] text-xs font-bold text-[#2E5A44]">
                      <span>{t.community.enterBuilding}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: FLOOR SELECTION */}
      {navStep === 'floors' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="space-y-1">
            <div className="eyebrow">
              <Building2 className="w-3.5 h-3.5" /> {activeBlock.name}
            </div>
            <h1 className="h2">
              {t.community.selectFloorTitle}
            </h1>
            <p className="body-text">
              {t.community.selectFloorDesc}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E6E0D5] min-h-[480px] grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-7 relative min-h-[280px]">
              <img
                src="/images/corridor_floor.jpg"
                alt="Apartment Corridor Hallway"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 hidden lg:block" />
              <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-white/95 text-[#1C1E21] shadow-lg max-w-xs">
                <div className="text-xs font-bold">{activeBlock.name} {t.community.corridorHallway}</div>
                <div className="text-[11px] text-[#6B7280]">{t.community.elevatorOnline}</div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FAF8F5] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#1C1E21]">{t.community.elevatorControl}</h3>
                    <p className="text-[11px] text-[#6B7280]">{t.community.chooseDest}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E8EFEA] text-[#2E5A44] text-xs font-extrabold">
                    {activeBlock.id}-Wing Elevator
                  </span>
                </div>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {[
                    { floor: 8, label: t.community.floorPenthouse, units: '801–808', status: t.common.optimal },
                    { floor: 7, label: `${t.community.floorNum} 7`, units: '701–708', status: t.common.optimal },
                    { floor: 6, label: `${t.community.floorNum} 6`, units: '601–608', status: t.common.optimal },
                    { floor: 5, label: `${t.community.floorNum} 5`, units: '501–508', status: t.common.optimal },
                    { floor: 4, label: `${t.community.floorNum} 4`, units: '401–408', status: t.common.optimal },
                    { floor: 3, label: `${t.community.floorNum} 3`, units: '301–308', status: language === 'ta' ? 'அசாதாரண எச்சரிக்கை (A-302)' : 'Anomaly Active (A-302)', highlight: true },
                    { floor: 2, label: `${t.community.floorNum} 2`, units: '201–208', status: t.common.optimal },
                    { floor: 1, label: `${t.community.floorNum} 1`, units: '101–108', status: t.common.optimal },
                    { floor: 0, label: t.community.floorGround, units: 'G01–G08', status: t.common.optimal }
                  ].map((f) => {
                    const isSelected = selectedFloor === f.floor;
                    return (
                      <button
                        key={f.floor}
                        onClick={() => handleFloorSelect(f.floor)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                          f.highlight
                            ? 'bg-[#FFF8E1] border-[#FFE082] text-[#B45309] font-bold hover:bg-[#FEF3C7]'
                            : isSelected
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-sm'
                            : 'bg-white border-[#E6E0D5] text-[#1C1E21] hover:border-[#2E5A44] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-sm ${
                            isSelected ? 'bg-white text-[#2E5A44]' : 'bg-[#EFECE6] text-[#1C1E21]'
                          }`}>
                            {f.floor === 0 ? 'G' : f.floor}
                          </span>
                          <div>
                            <div className="font-bold">{f.label}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#6B7280]'}`}>
                              {t.community.floorUnits} {f.units}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold">{f.status}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] text-[#6B7280] pt-2 border-t border-[#EBE7DF] flex items-center justify-between">
                <span>{t.community.floorTip}</span>
                <span className="text-[#2E7D32] font-semibold">{t.community.elevatorReady}</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: DOOR SELECTION */}
      {navStep === 'doors' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="space-y-1">
            <div className="eyebrow">
              <DoorClosed className="w-3.5 h-3.5" /> {t.common.floor} {selectedFloor === 0 ? (language === 'ta' ? 'தரைத்தளம்' : 'Ground') : selectedFloor} {t.community.corridorHallway}
            </div>
            <h1 className="h2">
              {t.community.selectDoorTitle}
            </h1>
            <p className="body-text">
              {t.community.selectDoorDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {displayDoors.map((aptItem) => {
              const isAlertUnit = aptItem.hasActiveAlert || aptItem.status === 'warning' || aptItem.status === 'maintenance';
              return (
                <div
                  key={aptItem.id}
                  onClick={() => handleDoorSelect(aptItem.id)}
                  className="door-card p-6 flex flex-col justify-between min-h-[380px] group text-center cursor-pointer transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="space-y-2">
                    <div className="door-plaque mx-auto px-4 py-1.5 rounded-md font-mono text-base font-extrabold tracking-widest uppercase inline-block">
                      {aptItem.doorNumber}
                    </div>
                    <div className="text-[11px] text-white/70 font-sans truncate">
                      {aptItem.resident?.name || t.common.resident}
                    </div>
                  </div>

                  <div className="py-8 flex flex-col items-center justify-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110 ${
                      isAlertUnit
                        ? 'bg-[#DC2626]/20 border-[#DC2626] text-[#FCA5A5]'
                        : 'bg-white/10 border-white/30 text-white'
                    }`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      isAlertUnit
                        ? 'bg-[#DC2626] text-white'
                        : 'bg-[#2E7D32] text-white'
                    }`}>
                      {isAlertUnit ? t.community.alertActive : t.community.secure}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-2 rounded-full bg-[#EAD6AA] mx-auto shadow-sm" />
                    <div className="text-xs font-bold text-[#EAD6AA] group-hover:text-white transition-colors">
                      {t.community.tapToEnter}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* STEP 4: PIN KEYPAD */}
      {navStep === 'access' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="space-y-1">
            <div className="eyebrow">
              <Lock className="w-3.5 h-3.5" /> {t.community.enterPinTitle}
            </div>
            <h1 className="h2">
              {t.common.apartment} {selectedAptId}
            </h1>
            <p className="body-text">
              {t.common.resident}: <strong>{activeApartment.resident.name}</strong> • {t.community.enterPinDesc}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E6E0D5] min-h-[520px] flex items-center justify-center p-6">
            
            <img
              src="/images/apartment_door.jpg"
              alt="Apartment Door Entry"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

            <div className="relative z-10 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-2xl space-y-6 text-center">
              
              <div className="space-y-1">
                <div className="door-plaque mx-auto px-4 py-1 rounded-md font-mono text-sm font-extrabold tracking-widest inline-block">
                  {selectedAptId}
                </div>
                <h3 className="text-lg font-bold text-[#1C1E21]">{activeApartment.resident.name}</h3>
                <p className="text-xs text-[#6B7280]">{t.community.pinPlaceholder}</p>
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      enteredPin.length > idx
                        ? 'bg-[#2E5A44] border-[#2E5A44] scale-110'
                        : 'border-[#DCD6CB] bg-[#FAF8F5]'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-lg font-bold text-[#1C1E21] hover:bg-[#E8EFEA] hover:border-[#2E5A44] transition-all active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setEnteredPin('1234')}
                  className="p-3.5 rounded-2xl bg-[#E8EFEA] text-[#2E5A44] text-xs font-bold border border-[#C8DCCF] hover:bg-[#2E5A44] hover:text-white transition-all"
                  title="Auto fill PIN: 1234"
                >
                  {t.community.autoPinBtn}
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-lg font-bold text-[#1C1E21] hover:bg-[#E8EFEA] hover:border-[#2E5A44] transition-all active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={handleKeypadDelete}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-bold text-[#6B7280] hover:bg-[#FEE2E2] hover:text-[#B91C1C] transition-all flex items-center justify-center"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>

              <button
                disabled={isUnlocking}
                onClick={handleEnterApartment}
                className="w-full btn-primary py-3.5 text-sm font-bold shadow-md"
              >
                {isUnlocking ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    {t.community.unlockingDeadbolt}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Unlock className="w-4 h-4" />
                    {t.community.unlockBtn}
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* STEP 5: APARTMENT INTERIOR */}
      {navStep === 'interior' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="eyebrow">
                <Home className="w-3.5 h-3.5" /> {t.community.welcomeHome} {selectedAptId}
              </div>
              <h1 className="h2">
                {t.community.welcomeHome} {activeApartment.resident.name}
              </h1>
              <p className="body-text">
                {t.community.livingRoomSubtitle}
              </p>
            </div>

            <button
              onClick={handleProceedToDashboard}
              className="btn-primary px-6 py-3.5 text-sm font-bold shadow-md flex items-center gap-2"
            >
              <span>{t.community.enterDashboardBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E6E0D5] min-h-[520px]">
            <img
              src="/images/apartment_living.jpg"
              alt="Apartment Living Room Interior"
              className="w-full h-full object-cover min-h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

            <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#2E5A44] text-white flex items-center justify-center font-bold text-xs">
                  {selectedAptId}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1C1E21]">{activeApartment.resident.name}</div>
                  <div className="text-[11px] text-[#6B7280]">{t.community.deadboltUnlocked}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  activeApartment.status === 'healthy'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                    : 'bg-[#FFF8E1] text-[#B45309] border border-[#FFE082]'
                }`}>
                  {activeApartment.status === 'healthy' ? t.community.systemHealthy : t.community.attentionRequired}
                </span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md space-y-1">
                <div className="text-[11px] font-bold text-[#6B7280] flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#0369A1]" /> {t.home.monitorTabWater}
                </div>
                <div className="text-xl font-extrabold text-[#1C1E21]">
                  {activeApartment.sensorSummary.waterFlow} <span className="text-xs font-bold text-[#6B7280]">L/min</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md space-y-1">
                <div className="text-[11px] font-bold text-[#6B7280] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#B45309]" /> {t.home.monitorTabPower}
                </div>
                <div className="text-xl font-extrabold text-[#1C1E21]">
                  {activeApartment.sensorSummary.powerUsage} <span className="text-xs font-bold text-[#6B7280]">kW</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md space-y-1">
                <div className="text-[11px] font-bold text-[#6B7280] flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#2E5A44]" /> {t.home.monitorTabTemp}
                </div>
                <div className="text-xl font-extrabold text-[#1C1E21]">
                  {activeApartment.sensorSummary.temperature}°C
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md space-y-1">
                <div className="text-[11px] font-bold text-[#6B7280] flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-[#0369A1]" /> {t.common.optimal}
                </div>
                <div className="text-xl font-extrabold text-[#1C1E21]">
                  {activeApartment.sensorSummary.humidity}%
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
