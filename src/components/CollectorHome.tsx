import React, { useState } from 'react';
import { 
  Scan, 
  Calculator, 
  MapPin, 
  FileCheck2, 
  Clock, 
  ShieldAlert, 
  ArrowRight,
  KeyRound,
  Check,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';

interface CollectorHomeProps {
  onNavigate: (tab: string) => void;
  onOpenPassport: (passportId: string) => void;
}

export const CollectorHome: React.FC<CollectorHomeProps> = ({ onNavigate, onOpenPassport }) => {
  const { language, transactions, pickupJobs, verifyPickupJob } = useApp();
  const t = getTranslation(language);

  const [activeOtpInput, setActiveOtpInput] = useState<{ [id: string]: string }>({});
  const [loggedWeight, setLoggedWeight] = useState<{ [id: string]: string }>({});
  const [otpError, setOtpError] = useState<{ [id: string]: string }>({});

  // Derive metrics strictly from actual stored records
  const totalWeight = transactions
    .filter((tx) => tx.handoverStatus !== 'REJECTED')
    .reduce((sum, tx) => sum + tx.weightKg, 0);

  const totalEarnings = transactions
    .filter((tx) => tx.handoverStatus !== 'REJECTED')
    .reduce((sum, tx) => sum + (tx.paidAmount || tx.estimatedValue), 0);

  const completedCount = transactions.filter((tx) => tx.handoverStatus === 'CONFIRMED').length;
  const pendingPaymentAmount = transactions
    .filter((tx) => tx.paymentStatus === 'PENDING' && tx.handoverStatus !== 'REJECTED')
    .reduce((sum, tx) => sum + tx.estimatedValue, 0);

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-5 pb-24">
      {/* Welcome Banner with Rich Telemetry */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#104e32] via-[#176B45] to-[#1f7c52] text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-500/30 space-y-3">
        {/* Decorative background grid element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-full text-emerald-100 border border-white/20">
              COLLECTOR TERMINAL · LIVE
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-200 bg-black/20 px-2.5 py-0.5 rounded-full">
            Ward K-West, Mumbai · 19.1136° N, 72.8697° E
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t.welcomeCollector}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-1 max-w-xl">
            {language === 'hi'
              ? 'अधिकृत रीसाइक्लर्स से सीधे जुड़ें, ब्लूटूथ स्केल से पारदर्शी वजन दर्ज करें और तत्काल यूपीआई भुगतान पाएं।'
              : 'Connect with CPCB registered recyclers, record digital weight with zero middleman deductions, and receive instant UPI settlements.'}
          </p>
        </div>

        {/* Quick Micro Status Bar */}
        <div className="relative z-10 pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-emerald-100">
          <div className="flex items-center gap-2">
            <span className="text-emerald-300">BLUETOOTH LOADCELL:</span>
            <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">CONNECTED (0.00 kg)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-300">DAILY WALLET:</span>
            <span className="font-bold text-white">₹12,390.00 DISBURSED</span>
          </div>
        </div>
      </div>

      {/* Live Commodity Spot Rates Ticker */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">
            ⚡ LIVE E-WASTE SCRAP BENCHMARK RATES (MUMBAI MIDC)
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">UPDATED TODAY</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 block">Server PCBs:</span>
            <span className="font-black text-[#176B45] text-sm">₹100 / kg</span>
            <span className="text-[9px] text-emerald-700 block font-semibold">+₹5 Today</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 block">Copper Cables:</span>
            <span className="font-black text-[#176B45] text-sm">₹80 / kg</span>
            <span className="text-[9px] text-stone-400 block">High Demand</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 block">Li-Ion Cells:</span>
            <span className="font-black text-[#176B45] text-sm">₹60 / kg</span>
            <span className="text-[9px] text-amber-700 block font-semibold">Hazmat Isolated</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-[10px] text-stone-500 block">Smartphones:</span>
            <span className="font-black text-[#176B45] text-sm">₹150 / kg</span>
            <span className="text-[9px] text-emerald-700 block font-semibold">Gold-Fingers</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid with Enhanced Depth */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Weight Handed Over */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-500/50 transition-all space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block">
            {t.totalWasteCollected}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
              {totalWeight.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-stone-500">kg</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block bg-emerald-50 px-2 py-0.5 rounded w-fit">
            100% Circular Diversion
          </span>
        </div>

        {/* Total Estimated Earnings */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-medium block">
            {t.estimatedEarnings}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#176B45] tabular-nums">
              ₹{totalEarnings.toFixed(0)}
            </span>
          </div>
          <span className="text-[10px] text-stone-500 block">
            Direct UPI / Cash Settlement
          </span>
        </div>

        {/* Completed Transactions */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-medium block">
            {t.completedTransactions}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-stone-900 tabular-nums">
              {completedCount}
            </span>
            <span className="text-xs text-stone-500">Lots Cleared</span>
          </div>
          <span className="text-[10px] text-emerald-700 block">
            Traceable Passports
          </span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-medium block">
            {t.pendingPayments}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-amber-600 tabular-nums">
              ₹{pendingPaymentAmount.toFixed(0)}
            </span>
          </div>
          <span className="text-[10px] text-amber-700 block">
            Awaiting Confirmation
          </span>
        </div>
      </div>

      {/* 6 Quick Action Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          {t.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Action 1: Scan E-Waste */}
          <button
            onClick={() => onNavigate('scan')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-[#176B45] border border-emerald-200/60 transition-all active:scale-95 text-center"
          >
            <div className="p-2 rounded-lg bg-[#176B45] text-white mb-1.5 shadow-xs">
              <Scan className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              {t.actionScan}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              AI Camera / Upload
            </span>
          </button>

          {/* Action 2: Scrap Value Estimator */}
          <button
            onClick={() => onNavigate('estimate')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 transition-all active:scale-95 text-center"
          >
            <div className="p-2 rounded-lg bg-stone-700 text-white mb-1.5 shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              {t.actionEstimate}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              Rate Calculator
            </span>
          </button>

          {/* Action 3: Find Recyclers */}
          <button
            onClick={() => onNavigate('recyclers')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 transition-all active:scale-95 text-center"
          >
            <div className="p-2 rounded-lg bg-emerald-800 text-white mb-1.5 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              {t.actionFindRecyclers}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              Nearby Units
            </span>
          </button>

          {/* Action 4: My Waste Passports */}
          <button
            onClick={() => onNavigate('history')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 transition-all active:scale-95 text-center"
          >
            <div className="p-2 rounded-lg bg-stone-700 text-white mb-1.5 shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              {t.actionPassports}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              Digital Receipts
            </span>
          </button>

          {/* Action 5: Transaction History */}
          <button
            onClick={() => onNavigate('history')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 transition-all active:scale-95 text-center"
          >
            <div className="p-2 rounded-lg bg-stone-700 text-white mb-1.5 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              {t.actionHistory}
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">
              Payment Log
            </span>
          </button>

          {/* Action 6: Safety Guide */}
          <button
            onClick={() => onNavigate('safety')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 transition-all active:scale-95 text-center"
          >
            <div className="p-2 rounded-lg bg-amber-600 text-white mb-1.5 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              {t.actionSafety}
            </span>
            <span className="text-[10px] text-amber-700 mt-0.5">
              Hazmat Advisory
            </span>
          </button>
        </div>
      </div>

      {/* Today's Real-Time Doorstep Pickups & OTP Verification */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#176B45]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Today's Doorstep Route & Live Handover OTPs
              </h3>
              <p className="text-[11px] text-stone-500">
                Scheduled by citizens in real time. Enter scale weight and verify the citizen's 4-digit OTP.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
            {pickupJobs.filter(j => j.status !== 'COMPLETED').length} PENDING
          </span>
        </div>

        <div className="space-y-2.5">
          {pickupJobs.map((job) => {
            const isCompleted = job.status === 'COMPLETED';
            return (
              <div
                key={job.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-stone-50/80 border-stone-200 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-stone-900">
                        {job.citizenName}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 bg-white px-1.5 py-0.2 rounded border border-stone-200">
                        ID: {job.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {isCompleted ? '✓ VERIFIED & PAID' : job.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{job.address} ({job.ward})</span>
                    </div>

                    <div className="text-[11px] text-stone-500 font-mono">
                      Slot: {job.timeSlot} · Items: {job.materials.join(', ')} · Est: {job.estimatedWeight}
                    </div>

                    {otpError[job.id] && (
                      <span className="text-[11px] text-rose-600 font-semibold block">
                        ⚠️ {otpError[job.id]}
                      </span>
                    )}
                  </div>

                  {/* Scale & OTP Verification Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    {!isCompleted ? (
                      <>
                        <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg p-1 text-xs shadow-2xs">
                          <span className="text-[10px] text-stone-400 pl-1 font-mono">KG:</span>
                          <input
                            type="number"
                            placeholder={job.estimatedWeight.replace(' kg', '')}
                            value={loggedWeight[job.id] || ''}
                            onChange={(e) => setLoggedWeight({ ...loggedWeight, [job.id]: e.target.value })}
                            className="w-14 bg-transparent text-center font-bold text-stone-900 focus:outline-hidden"
                          />
                        </div>

                        <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg p-1 text-xs shadow-2xs">
                          <KeyRound className="w-3.5 h-3.5 text-stone-400 ml-1" />
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="OTP"
                            value={activeOtpInput[job.id] || ''}
                            onChange={(e) => {
                              setActiveOtpInput({ ...activeOtpInput, [job.id]: e.target.value });
                              if (otpError[job.id]) setOtpError({ ...otpError, [job.id]: '' });
                            }}
                            className="w-14 bg-transparent text-center font-mono font-bold text-[#176B45] tracking-widest focus:outline-hidden"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const otp = activeOtpInput[job.id] || '';
                            const w = loggedWeight[job.id] ? parseFloat(loggedWeight[job.id]) : undefined;
                            const success = verifyPickupJob(job.id, otp, w);
                            if (!success) {
                              setOtpError({
                                ...otpError,
                                [job.id]: `Invalid 4-digit PIN! (Hint: Citizen's screen displays ${job.otpCode})`
                              });
                            }
                          }}
                          className="py-2 px-3 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                          Verify & Pay
                        </button>
                      </>
                    ) : (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                        <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                        <span>₹{job.estPayout} Disbursed via UPI</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Waste Passports / Activity */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Recent Waste Passports
          </h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-[#176B45] font-semibold flex items-center gap-1 hover:underline"
          >
            View All ({transactions.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentTransactions.map((tx) => (
            <div
              key={tx.passportId}
              onClick={() => onOpenPassport(tx.passportId)}
              className="p-3 rounded-xl border border-stone-200 hover:border-emerald-500/60 bg-stone-50/50 hover:bg-white transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={tx.photoUrl}
                  alt={tx.materialName}
                  className="w-11 h-11 rounded-lg object-cover border border-stone-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">
                      {tx.passportId}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      · {tx.weightKg} kg
                    </span>
                  </div>
                  <span className="text-xs text-stone-600 block line-clamp-1">
                    {tx.materialName}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {tx.createdAt}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-[#176B45] block tabular-nums">
                  ₹{tx.paidAmount || tx.estimatedValue}
                </span>
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    tx.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : tx.handoverStatus === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {tx.paymentStatus === 'PAID' ? 'PAID' : tx.handoverStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
