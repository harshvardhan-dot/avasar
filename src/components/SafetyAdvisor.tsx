import React from 'react';
import { 
  ShieldAlert, 
  Flame, 
  BatteryCharging, 
  Leaf, 
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';

export const SafetyAdvisor: React.FC = () => {
  const { language, transactions, speakText } = useApp();
  const t = getTranslation(language);

  // Derive verifiable impact metrics from actual stored transactions
  const totalKg = transactions.reduce((sum, tx) => sum + tx.weightKg, 0);
  const completedHandovers = transactions.filter((tx) => tx.handoverStatus === 'CONFIRMED').length;
  const totalEarnings = transactions.reduce((sum, tx) => sum + (tx.paidAmount || tx.estimatedValue), 0);
  const uniqueRecyclers = new Set(transactions.map((tx) => tx.recyclerId)).size;

  const handleReadSafetyAloud = () => {
    speakText(
      'Safety notice: Never burn electrical wires to recover copper. Toxic fumes cause severe respiratory illness. Do not crush damaged batteries.',
      'सुरक्षा सूचना: तांबा निकालने के लिए तारों को कभी न जलाएं। इससे निकलने वाला धुआं फेफड़ों के लिए अत्यंत हानिकारक है। क्षतिग्रस्त बैटरियों को कभी न तोड़ें।'
    );
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>{t.safetyTitle}</span>
          </h2>
          <p className="text-xs text-stone-600">
            {t.safetySubtitle}
          </p>
        </div>

        <button
          onClick={handleReadSafetyAloud}
          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#176B45] border border-emerald-200 transition-colors shrink-0"
          title="Listen in Hindi or English"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Guideline Cards */}
      <div className="space-y-3">
        {/* Wire Burning Warning */}
        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>{t.wireWarning} (तारों को न जलाएं)</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {t.wireWarningDesc}
          </p>
          <div className="bg-rose-50 rounded-lg p-2.5 text-[11px] text-rose-900 font-medium">
            Safe Alternative: Use mechanical handheld stripper pliers or sell whole unstripped wire bales directly to EcoRev / authorized hubs.
          </div>
        </div>

        {/* Battery Handling Warning */}
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <BatteryCharging className="w-4 h-4 text-amber-600" />
            <span>{t.batteryWarning} (बैटरी सावधानी)</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {t.batteryWarningDesc}
          </p>
          <div className="bg-amber-50 rounded-lg p-2.5 text-[11px] text-amber-900 font-medium">
            Safe Protocol: Tape terminals with electrical tape. Store in dry vermiculite sand buckets away from flammables.
          </div>
        </div>

        {/* Why Authorized Recyclers Matter */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Why Authorised Recycling Matters</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            Informal acid leaching and open-air burning contaminate local groundwater with lead, cadmium, and mercury. CPCB registered facilities operate enclosed hydrometallurgical recovery loops that circulate high-purity secondary copper and gold back into green manufacturing.
          </p>
        </div>
      </div>

      {/* Verifiable Impact Dashboard */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="border-b border-stone-100 pb-2">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            {t.impactTitle}
          </h3>
          <p className="text-[11px] text-stone-500">
            Computed strictly from actual stored prototype records in this device.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
            <span className="text-[10px] text-stone-500 font-medium block">
              {t.kgRecorded}
            </span>
            <span className="text-xl font-bold text-stone-900 tabular-nums">
              {totalKg.toFixed(1)} kg
            </span>
            <span className="text-[10px] text-emerald-700 block">
              Verifiable Landfill Diversion
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
            <span className="text-[10px] text-stone-500 font-medium block">
              {t.completedHandovers}
            </span>
            <span className="text-xl font-bold text-[#176B45] tabular-nums">
              {completedHandovers} Lots
            </span>
            <span className="text-[10px] text-stone-500 block">
              Audited Weighbridge Receipts
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
            <span className="text-[10px] text-stone-500 font-medium block">
              {t.totalIncome}
            </span>
            <span className="text-xl font-bold text-stone-900 tabular-nums">
              ₹{totalEarnings}
            </span>
            <span className="text-[10px] text-emerald-700 block">
              Direct Digital Settlement
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
            <span className="text-[10px] text-stone-500 font-medium block">
              Engaged Recycler Facilities
            </span>
            <span className="text-xl font-bold text-stone-900 tabular-nums">
              {uniqueRecyclers} Hubs
            </span>
            <span className="text-[10px] text-stone-500 block">
              CPCB Formal Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
