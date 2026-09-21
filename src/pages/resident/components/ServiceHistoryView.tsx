import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Star,
  CheckCircle2,
  Calendar,
  Wrench,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ServiceHistoryView: React.FC = () => {
  const { currentApartmentId, apartments, language, t } = useApp();
  const apt = apartments.find((a) => a.id === currentApartmentId) || apartments[0];
  const isTamil = language === 'ta';

  const historyItems = [
    {
      id: 'PC-2026-00120',
      category: 'Electrical & Power',
      problem: isTamil ? 'மெயின் பிரேக்கர் ஆய்வு & சுமை சமநிலை' : 'Main Breaker Inspection & Load Balancing',
      apartmentId: apt.id,
      workerName: 'Suresh Patel',
      workerSkill: 'Electrician',
      completedDate: '12 Sep 2026',
      status: 'Completed',
      rating: 5,
      feedback: isTamil
        ? 'மின்னழுத்த மாறுபாடு உடனே சரி செய்யப்பட்டது. மிகச் சிறந்த பணி!'
        : 'Substation line surge addressed swiftly. Clean and professional.'
    },
    {
      id: 'PC-2026-00115',
      category: 'Water & Plumbing',
      problem: isTamil ? 'குளியலறை ஷவர் பொருத்துதல் & சீரமைப்பு' : 'Bathroom Shower Head Fitting & Sealing',
      apartmentId: apt.id,
      workerName: 'Ravi Kumar',
      workerSkill: 'Plumber',
      completedDate: '04 Sep 2026',
      status: 'Completed',
      rating: 5,
      feedback: isTamil
        ? '20 நிமிடத்தில் பழுது நீக்கப்பட்டது. நன்றி!'
        : 'Fixed within 20 minutes with zero disruption.'
    },
    {
      id: 'PC-2026-00103',
      category: 'HVAC & Climate',
      problem: isTamil ? 'ஏசி வடிகட்டி சுத்தம் & வாயு அழுத்தம் சோதனை' : 'HVAC Blower Filter Cleaning & Pressure Test',
      apartmentId: apt.id,
      workerName: 'Priya Menon',
      workerSkill: 'HVAC Specialist',
      completedDate: '28 Aug 2026',
      status: 'Completed',
      rating: 5,
      feedback: isTamil
        ? 'காற்றின் தரம் வெகுவாக மேம்பட்டுள்ளது.'
        : 'Airflow significantly improved and filter telemetry synchronized.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-[#E6E0D5] pb-4">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#2E5A44]">
          <FileText className="w-3.5 h-3.5" />
          <span>{isTamil ? 'கடந்த கால சேவை பதிவுகள்' : 'Completed Maintenance Archive'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1C1E21] tracking-tight mt-0.5">
          {t.resident.historyTitle}
        </h2>
        <p className="text-xs text-[#6B7280]">
          {isTamil
            ? 'உங்கள் குடியிருப்பில் வெற்றிகரமாக முடிக்கப்பட்டு நீங்கள் மதிப்பிட்ட பழுதுபார்ப்பு வரலாறு.'
            : 'Archive of all completed service orders, verified technician notes, and resident ratings.'}
        </p>
      </div>

      {/* Clean Table / List (NO generic box grid) */}
      <div className="bg-white rounded-3xl border border-[#E6E0D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE7DF] bg-[#FAF8F5] text-[#6B7280] uppercase tracking-wider font-bold">
                <th className="p-4">{t.home.maintThTicket}</th>
                <th className="p-4">{t.home.maintThCategory}</th>
                <th className="p-4">{t.common.apartment}</th>
                <th className="p-4">{t.home.maintThTech}</th>
                <th className="p-4">{isTamil ? 'முடிக்கப்பட்ட நாள்' : 'Completed Date'}</th>
                <th className="p-4">{isTamil ? 'மதிப்பீடு' : 'Resident Rating'}</th>
                <th className="p-4 text-right">{t.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7DF]">
              {historyItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="p-4 font-mono font-bold text-[#2E5A44]">{item.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-[#1C1E21]">{item.problem}</div>
                    <div className="text-[11px] text-[#6B7280]">{item.category}</div>
                  </td>
                  <td className="p-4 font-semibold text-[#1C1E21]">{item.apartmentId}</td>
                  <td className="p-4">
                    <div className="font-bold text-[#1C1E21]">{item.workerName}</div>
                    <div className="text-[11px] text-[#6B7280]">{item.workerSkill}</div>
                  </td>
                  <td className="p-4 text-[#8A8275] font-mono">{item.completedDate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[#F59E0B] font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating}.0★</span>
                    </div>
                    <div className="text-[11px] text-[#6B7280] italic truncate max-w-xs mt-0.5">
                      "{item.feedback}"
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#E8F5E9] text-[#2E7D32]">
                      {t.common.completed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
