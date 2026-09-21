import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Droplets,
  Zap,
  Thermometer,
  Wind,
  Activity,
  Calendar,
  Clock,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export const SmartMonitoringView: React.FC = () => {
  const { currentApartmentId, apartments, language, t } = useApp();
  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const isTamil = language === 'ta';

  // Subtabs: 'overview' | 'water' | 'electricity' | 'temperature' | 'environment'
  const [activeMetricTab, setActiveMetricTab] = useState<'overview' | 'water' | 'electricity' | 'temperature' | 'environment'>('water');

  const waterHistoryData = [
    { time: '00:00', value: 0.1, baseline: 4.0 },
    { time: '04:00', value: 0.2, baseline: 4.0 },
    { time: '06:00', value: 3.2, baseline: 4.0 },
    { time: '08:00', value: 6.5, baseline: 4.0 },
    { time: '10:00', value: apt.hasActiveAlert ? 14.8 : 4.5, baseline: 4.0 },
    { time: '12:00', value: 4.8, baseline: 4.0 },
    { time: '14:00', value: 4.2, baseline: 4.0 },
    { time: '16:00', value: apt.sensorSummary.waterFlow, baseline: 4.0 }
  ];

  const powerHistoryData = [
    { time: '00:00', value: 0.3, baseline: 1.5 },
    { time: '04:00', value: 0.4, baseline: 1.5 },
    { time: '06:00', value: 1.1, baseline: 1.5 },
    { time: '08:00', value: 2.6, baseline: 1.5 },
    { time: '10:00', value: 3.4, baseline: 1.5 },
    { time: '12:00', value: 1.8, baseline: 1.5 },
    { time: '14:00', value: 1.5, baseline: 1.5 },
    { time: '16:00', value: apt.sensorSummary.powerUsage, baseline: 1.5 }
  ];

  const tempHistoryData = [
    { time: '00:00', value: 22.8, baseline: 24.0 },
    { time: '04:00', value: 23.2, baseline: 24.0 },
    { time: '08:00', value: 24.2, baseline: 24.0 },
    { time: '12:00', value: 26.5, baseline: 24.0 },
    { time: '16:00', value: apt.sensorSummary.temperature, baseline: 24.0 },
    { time: '20:00', value: 24.0, baseline: 24.0 }
  ];

  const aqiHistoryData = [
    { time: '00:00', value: 22, baseline: 35 },
    { time: '04:00', value: 20, baseline: 35 },
    { time: '08:00', value: 34, baseline: 35 },
    { time: '12:00', value: 38, baseline: 35 },
    { time: '16:00', value: apt.sensorSummary.airQuality, baseline: 35 },
    { time: '20:00', value: 28, baseline: 35 }
  ];

  const getMetricDetails = () => {
    switch (activeMetricTab) {
      case 'water':
        return {
          title: isTamil ? 'நீர் பயன்பாடு' : 'Water Usage',
          currentVal: `${apt.sensorSummary.waterFlow} L/min`,
          totalToday: '42.6 Liters',
          baseline: '0.0 – 8.0 L/min',
          status: apt.sensorSummary.waterFlow > 10 ? 'warning' : 'healthy',
          node: `ESP32-${apt.id}-WTR`,
          desc: isTamil ? 'சமையலறை மற்றும் பயன்பாட்டு குழாய்களின் தொடர் ஓட்ட கண்காணிப்பு.' : 'High-frequency ultrasonic flow meter measuring line flow.',
          data: waterHistoryData,
          color: '#0369A1',
          gradId: 'monWaterGrad'
        };
      case 'electricity':
        return {
          title: isTamil ? 'மின்சார நுகர்வு' : 'Electricity Load',
          currentVal: `${apt.sensorSummary.powerUsage} kW`,
          totalToday: '8.4 kWh',
          baseline: '0.2 – 4.5 kW',
          status: 'healthy',
          node: `ESP32-${apt.id}-PWR`,
          desc: isTamil ? '230V மெயின் விநியோக சுமை மற்றும் ஆற்றல் கண்காணிப்பு.' : 'Dual-channel current transformer measuring active active load.',
          data: powerHistoryData,
          color: '#B45309',
          gradId: 'monPowerGrad'
        };
      case 'temperature':
        return {
          title: isTamil ? 'வெப்பநிலை & ஈரப்பதம்' : 'Temperature & Climate',
          currentVal: `${apt.sensorSummary.temperature}°C`,
          totalToday: `${apt.sensorSummary.humidity}% Relative Humidity`,
          baseline: '21.0 – 26.5°C',
          status: 'healthy',
          node: `ESP32-${apt.id}-TEMP`,
          desc: isTamil ? 'அறை வெப்பநிலை மற்றும் காற்றின் ஈரப்பதம்.' : 'Calibrated precision sensor monitoring indoor ambient comfort.',
          data: tempHistoryData,
          color: '#2E5A44',
          gradId: 'monTempGrad'
        };
      case 'environment':
      case 'overview':
      default:
        return {
          title: isTamil ? 'காற்றின் தரம் & சுற்றுச்சூழல்' : 'Air Purity & Environment',
          currentVal: `${apt.sensorSummary.airQuality} AQI`,
          totalToday: 'PM2.5: 8.2 µg/m³',
          baseline: '0 – 50 AQI (Good)',
          status: 'healthy',
          node: `ESP32-${apt.id}-AQI`,
          desc: isTamil ? 'காற்றின் தூய்மை மற்றும் துகள்கள் அளவு அளவீடு.' : 'Optical laser particulate meter checking fresh outdoor ventilation.',
          data: aqiHistoryData,
          color: '#16A34A',
          gradId: 'monAqiGrad'
        };
    }
  };

  const currentMetric = getMetricDetails();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E0D5] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
            <Activity className="w-3.5 h-3.5" />
            <span>{isTamil ? 'நேரலை டெலிமெட்ரி கண்காணிப்பு' : 'Live Telemetry & Resource Analytics'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
            {t.resident.tabMonitoring} • {t.common.apartment} {apt.id}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {isTamil
              ? 'உங்கள் அலகின் அனைத்து பயன்பாட்டு அமைப்புகளின் 24-மணி நேர முழுமையான வரைபடம்.'
              : "High-resolution continuous telemetry synchronized with Cedar Heights management node."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] bg-white px-3 py-1.5 rounded-xl border border-[#E6E0D5]">
          <Clock className="w-3.5 h-3.5 text-[#2E5A44]" />
          <span>{t.resident.samplingRate}</span>
        </div>
      </div>

      {/* Metric Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#EBE7DF] pb-3">
        {[
          { id: 'water', label: isTamil ? 'நீர்' : 'Water', icon: Droplets },
          { id: 'electricity', label: isTamil ? 'மின்சாரம்' : 'Electricity', icon: Zap },
          { id: 'temperature', label: isTamil ? 'வெப்பநிலை' : 'Temperature', icon: Thermometer },
          { id: 'environment', label: isTamil ? 'சுற்றுச்சூழல்' : 'Environment', icon: Wind }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMetricTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMetricTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#1C1E21] text-white shadow-xs'
                  : 'bg-white text-[#6B7280] hover:text-[#1C1E21] border border-[#E6E0D5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#A3E3B8]' : 'text-[#8A8275]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Large Chart Section */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Metric Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF8F5] pb-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#8A8275]">
              {currentMetric.title}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[#1C1E21]">
                {currentMetric.currentVal}
              </span>
              <span className="text-xs font-bold text-[#6B7280]">
                • {isTamil ? 'இன்றைய மொத்தம்' : 'Today'}: {currentMetric.totalToday}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.common.optimal}</span>
            </span>
          </div>
        </div>

        {/* Large Readable Chart Canvas */}
        <div className="h-72 sm:h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentMetric.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={currentMetric.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" vertical={false} />
              <XAxis dataKey="time" stroke="#9E9382" fontSize={11} tickLine={false} />
              <YAxis stroke="#9E9382" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E6E0D5',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={currentMetric.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${currentMetric.gradId})`}
                name={currentMetric.title}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Clean Horizontal Telemetry Spec Table (NO TINY CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#FAF8F5] rounded-2xl p-5 border border-[#EBE7DF] text-xs">
          <div>
            <span className="text-[#8A8275] uppercase text-[10px] font-bold block">{t.home.monitorNormalBaseline}</span>
            <strong className="text-[#2E7D32] text-sm mt-0.5 block">{currentMetric.baseline}</strong>
          </div>
          <div>
            <span className="text-[#8A8275] uppercase text-[10px] font-bold block">{isTamil ? 'சென்சார் முனை' : 'Hardware Node'}</span>
            <strong className="font-mono text-[#1C1E21] text-sm mt-0.5 block">{currentMetric.node}</strong>
          </div>
          <div>
            <span className="text-[#8A8275] uppercase text-[10px] font-bold block">{t.home.monitorModel}</span>
            <strong className="text-[#2E5A44] text-sm mt-0.5 block">Isolation Forest v2.4</strong>
          </div>
          <div>
            <span className="text-[#8A8275] uppercase text-[10px] font-bold block">{isTamil ? 'கடைசி ஒத்திசைவு' : 'Last Synced'}</span>
            <strong className="text-[#1C1E21] text-sm mt-0.5 block">{isTamil ? 'தற்போது' : 'Just now'}</strong>
          </div>
        </div>

      </div>

    </div>
  );
};
