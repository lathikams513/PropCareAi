import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Droplets,
  Zap,
  Thermometer,
  Wind,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  ChevronRight,
  Battery,
  Activity,
  Maximize2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface RoomHotspot {
  id: string;
  name: string;
  tamilName: string;
  xPercent: number;
  yPercent: number;
  sensorType: 'water' | 'power' | 'temperature' | 'air_quality' | 'pressure';
  sensorId: string;
  sensorName: string;
  reading: string;
  baseline: string;
  status: 'normal' | 'warning' | 'optimal';
  description: string;
  battery: number;
  historyData: { time: string; value: number }[];
}

export const MyApartmentView: React.FC = () => {
  const { currentApartmentId, apartments, language, t } = useApp();
  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const isTamil = language === 'ta';

  const isWaterAnomaly = apt.hasActiveAlert || apt.status === 'warning';

  const hotspots: RoomHotspot[] = [
    {
      id: 'kitchen',
      name: 'Kitchen',
      tamilName: 'சமையலறை',
      xPercent: 24,
      yPercent: 48,
      sensorType: 'water',
      sensorId: `SENS-${apt.id}-WTR`,
      sensorName: 'Under-Sink Sub-Manifold Meter',
      reading: isWaterAnomaly ? '14.8 L/min' : `${apt.sensorSummary.waterFlow} L/min`,
      baseline: '0.0 – 8.0 L/min',
      status: isWaterAnomaly ? 'warning' : 'normal',
      description: isWaterAnomaly
        ? (isTamil ? 'அசாதாரண தொடர் நீர் ஓட்டம் கண்டறியப்பட்டுள்ளது.' : 'Continuous flow deviation flagged during low appliance usage.')
        : (isTamil ? 'நீர் ஓட்டம் சீராக உள்ளது.' : 'Plumbing manifold operating at nominal pressure.'),
      battery: 94,
      historyData: [
        { time: '06:00', value: 2.1 },
        { time: '08:00', value: 5.4 },
        { time: '10:00', value: isWaterAnomaly ? 14.8 : 4.2 },
        { time: '12:00', value: 4.8 },
        { time: '14:00', value: 3.9 }
      ]
    },
    {
      id: 'utility',
      name: 'Utility Duct',
      tamilName: 'பயன்பாட்டு அறை',
      xPercent: 82,
      yPercent: 32,
      sensorType: 'power',
      sensorId: `SENS-${apt.id}-PWR`,
      sensorName: 'Main Distribution & Load Node',
      reading: `${apt.sensorSummary.powerUsage} kW (230V)`,
      baseline: '0.2 – 4.5 kW',
      status: 'normal',
      description: isTamil ? 'மின்சுமை மற்றும் மின்னழுத்தம் சீரான வரம்பில் உள்ளது.' : 'Dual-phase electrical distribution with automatic surge protection.',
      battery: 100,
      historyData: [
        { time: '06:00', value: 0.8 },
        { time: '08:00', value: 2.4 },
        { time: '10:00', value: 3.1 },
        { time: '12:00', value: 1.6 },
        { time: '14:00', value: apt.sensorSummary.powerUsage }
      ]
    },
    {
      id: 'living',
      name: 'Living Room',
      tamilName: 'வரவேற்பறை',
      xPercent: 52,
      yPercent: 62,
      sensorType: 'temperature',
      sensorId: `SENS-${apt.id}-TEMP`,
      sensorName: 'Smart Ambient Climate & AQI Hub',
      reading: `${apt.sensorSummary.temperature}°C • ${apt.sensorSummary.airQuality} AQI`,
      baseline: '21 – 26°C • < 50 AQI',
      status: 'optimal',
      description: isTamil ? 'அறை வெப்பம் மற்றும் காற்றின் தூய்மை உகந்த நிலையில் உள்ளது.' : 'Central living zone climate optimized with HEPA circulation.',
      battery: 88,
      historyData: [
        { time: '06:00', value: 23.0 },
        { time: '08:00', value: 23.8 },
        { time: '10:00', value: 24.5 },
        { time: '12:00', value: 24.2 },
        { time: '14:00', value: apt.sensorSummary.temperature }
      ]
    },
    {
      id: 'bathroom',
      name: 'Master Bathroom',
      tamilName: 'குளியலறை',
      xPercent: 18,
      yPercent: 24,
      sensorType: 'water',
      sensorId: `SENS-${apt.id}-BATH`,
      sensorName: 'Moisture & Drain Flow Acoustic Sensor',
      reading: '0.0 L/min • Dry',
      baseline: 'Zero leakage floor threshold',
      status: 'normal',
      description: isTamil ? 'கசிவு அல்லது ஈரப்பத முரண்பாடுகள் இல்லை.' : 'Acoustic leak detector reports zero baseline vibrations.',
      battery: 92,
      historyData: [
        { time: '06:00', value: 0.0 },
        { time: '08:00', value: 4.2 },
        { time: '10:00', value: 0.0 },
        { time: '12:00', value: 0.0 },
        { time: '14:00', value: 0.0 }
      ]
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom & Balcony',
      tamilName: 'படுக்கையறை & பால்கனி',
      xPercent: 74,
      yPercent: 75,
      sensorType: 'air_quality',
      sensorId: `SENS-${apt.id}-AQI`,
      sensorName: 'Balcony Air Purity & PM2.5 Sensor',
      reading: `${apt.sensorSummary.airQuality} AQI • ${apt.sensorSummary.humidity}% RH`,
      baseline: 'Fresh green-zone airflow',
      status: 'optimal',
      description: isTamil ? 'இயற்கை காற்று மற்றும் ஈரப்பதம் ஆரோக்கியமான நிலையில் உள்ளது.' : 'Cross-ventilation from east garden facing balcony.',
      battery: 85,
      historyData: [
        { time: '06:00', value: 26 },
        { time: '08:00', value: 30 },
        { time: '10:00', value: 34 },
        { time: '12:00', value: 31 },
        { time: '14:00', value: apt.sensorSummary.airQuality }
      ]
    }
  ];

  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('kitchen');
  const activeSpot = hotspots.find((h) => h.id === selectedHotspotId) || hotspots[0];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E0D5] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
            <Layers className="w-3.5 h-3.5" />
            <span>{isTamil ? 'உள்ளமை காட்சி & சென்சார்கள்' : 'Interior Spatial Layout & Edge Nodes'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
            {isTamil ? 'என் அடுக்குமாடி சூழல்' : 'My Apartment'} ({apt.id})
          </h2>
          <p className="text-xs text-[#6B7280]">
            {isTamil
              ? 'உங்கள் வீட்டில் நிறுவப்பட்டுள்ள ஸ்மார்ட் சென்சார்களைக் கிளிக் செய்து நேரலை அளவீடுகளைப் பார்க்கவும்.'
              : 'Interact with sensor hotspots positioned throughout your residence to view live telemetry and health.'}
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs font-bold text-[#6B7280]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
            {t.common.normal}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" />
            {t.common.warning}
          </span>
        </div>
      </div>

      {/* Main Interactive Apartment Visual & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Realistic Apartment Visual Map with Interactive Hotspots (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-[#E6E0D5] bg-[#FAF8F5] shadow-xs">
            
            {/* Apartment Photography Background */}
            <div className="relative h-72 sm:h-96 md:h-[420px] w-full">
              <img
                src="/images/apartment_living.jpg"
                alt="Apartment Interior Hotspots"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />

              {/* Hotspot Points Overlay */}
              {hotspots.map((spot) => {
                const isSelected = selectedHotspotId === spot.id;
                const isWarn = spot.status === 'warning';

                return (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedHotspotId(spot.id)}
                    style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer focus:outline-none transition-transform duration-300 ${
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    }`}
                    title={`${spot.name}: ${spot.reading}`}
                  >
                    {/* Pulsing Radar Ring */}
                    <span className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                      isWarn ? 'bg-[#DC2626]' : isSelected ? 'bg-[#2E5A44]' : 'bg-white'
                    }`} />

                    {/* Sensor Marker Button */}
                    <div className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-lg border backdrop-blur-md transition-colors ${
                      isSelected
                        ? 'bg-[#1C1E21] text-white border-white ring-2 ring-white/50'
                        : isWarn
                        ? 'bg-[#DC2626] text-white border-white/80 animate-bounce'
                        : 'bg-white/90 text-[#1C1E21] border-white/60 hover:bg-white'
                    }`}>
                      {spot.sensorType === 'water' && <Droplets className="w-3.5 h-3.5 text-[#0369A1]" />}
                      {spot.sensorType === 'power' && <Zap className="w-3.5 h-3.5 text-[#B45309]" />}
                      {spot.sensorType === 'temperature' && <Thermometer className="w-3.5 h-3.5 text-[#2E5A44]" />}
                      {spot.sensorType === 'air_quality' && <Wind className="w-3.5 h-3.5 text-[#16A34A]" />}
                      <span className="hidden sm:inline font-extrabold">{isTamil ? spot.tamilName : spot.name}</span>
                    </div>
                  </button>
                );
              })}

              {/* Bottom Instructions Banner */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/50 backdrop-blur-md text-white rounded-xl px-4 py-2 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-[#A3E3B8]" />
                  {isTamil ? 'அளவீடுகளை அறிய புள்ளிகளைத் தட்டவும்' : 'Tap any hotspot marker to inspect live edge telemetry'}
                </span>
                <span className="font-mono text-[11px] text-white/80">Apt {apt.id}</span>
              </div>
            </div>

          </div>

          {/* Quick Horizontal Room Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {hotspots.map((spot) => {
              const isSelected = selectedHotspotId === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setSelectedHotspotId(spot.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2E5A44] text-white shadow-xs'
                      : 'bg-white text-[#4B5563] hover:text-[#1C1E21] border border-[#E6E0D5]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    spot.status === 'warning' ? 'bg-[#DC2626]' : 'bg-[#2E7D32]'
                  }`} />
                  <span>{isTamil ? spot.tamilName : spot.name}</span>
                  <span className="text-[10px] opacity-80">({spot.reading.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Sensor Node Detail Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E6E0D5] p-6 shadow-xs space-y-5">
          
          <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8A8275]">
                {isTamil ? 'சென்சார் முனையம்' : 'ACTIVE SENSOR NODE'}
              </span>
              <h3 className="text-base font-black text-[#1C1E21]">{isTamil ? activeSpot.tamilName : activeSpot.name}</h3>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
              activeSpot.status === 'warning'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-[#E8F5E9] text-[#2E7D32]'
            }`}>
              {activeSpot.status === 'warning' ? t.common.warning : t.common.normal}
            </span>
          </div>

          {/* Reading Large Display */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-1">
            <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
              {t.home.monitorCurrentReading}
            </div>
            <div className={`text-2xl font-black ${
              activeSpot.status === 'warning' ? 'text-[#DC2626]' : 'text-[#1C1E21]'
            }`}>
              {activeSpot.reading}
            </div>
            <div className="text-xs text-[#4B5563] pt-1">
              {activeSpot.description}
            </div>
          </div>

          {/* Mini Telemetry Trend Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280]">
              <span>{isTamil ? 'இன்றைய போக்கு' : "Today's Trend"}</span>
              <span className="text-[11px] text-[#8A8275]">{activeSpot.baseline}</span>
            </div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeSpot.historyData}>
                  <defs>
                    <linearGradient id="spotGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeSpot.status === 'warning' ? '#DC2626' : '#2E5A44'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={activeSpot.status === 'warning' ? '#DC2626' : '#2E5A44'} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#9E9382" fontSize={10} />
                  <YAxis stroke="#9E9382" fontSize={10} hide />
                  <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E6E0D5', fontSize: '11px' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={activeSpot.status === 'warning' ? '#DC2626' : '#2E5A44'}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spotGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-2 text-xs border-t border-[#EBE7DF] pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">{isTamil ? 'சென்சார் ஐடி' : 'Node Identifier'}</span>
              <span className="font-mono font-bold text-[#1C1E21]">{activeSpot.sensorId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">{t.home.monitorNormalBaseline}</span>
              <span className="font-bold text-[#2E7D32]">{activeSpot.baseline}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">{isTamil ? 'பேட்டரி நிலை' : 'Battery Status'}</span>
              <span className="font-bold text-[#1C1E21] flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-[#2E7D32]" />
                {activeSpot.battery}%
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
