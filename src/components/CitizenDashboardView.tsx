import React, { useState } from 'react';
import { 
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CitizenScheduleModal } from './CitizenScheduleModal';

interface CitizenDashboardViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = () => {
  const { transactions, pickupJobs } = useApp();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);

  // Live calculations from real stored transactions
  const totalWeightDiverted = transactions.reduce((sum, tx) => sum + tx.weightKg, 0);
  const totalPaidOut = transactions
    .filter((tx) => tx.paymentStatus === 'PAID')
    .reduce((sum, tx) => sum + (tx.paidAmount || tx.estimatedValue), 0);
  const totalCO2Avoided = Number((totalWeightDiverted * 1.85).toFixed(1)); // ~1.85kg CO2e per kg e-waste secondary recovery

  const pendingPickups = pickupJobs.filter((j) => j.status !== 'COMPLETED');
  const completedPickups = pickupJobs.filter((j) => j.status === 'COMPLETED');

  return (
    <div className="space-y-4 pb-20">
      {/* Citizen Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 rounded-3xl shadow-lg border border-emerald-700/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono bg-white/20 px-2.5 py-0.5 rounded-full text-emerald-100 font-bold uppercase tracking-wider">
            CITIZEN / E-WASTE PRODUCER PORTAL
          </span>
          <span className="text-[11px] font-mono text-emerald-200 bg-black/20 px-2 py-0.5 rounded-full">
            Ward K-West, Mumbai
          </span>
        </div>
        <h3 className="text-xl font-black tracking-tight text-white">
          Namaste, Aarav Mehta (Citizen User)
        </h3>
        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
          Schedule doorstep e-waste pickups with local kabadis, earn Green Credits, ensure zero landfill dumping, and receive direct instant UPI payouts.
        </p>
      </div>

      {/* 4 Citizen Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Green Credits */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Green Credits Earned
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#176B45] tabular-nums">
              1,840
            </span>
            <span className="text-xs font-bold text-emerald-700">GC</span>
          </div>
          <span className="text-[10px] text-stone-500 block">
            Redeemable for Metro recharge & property tax
          </span>
        </div>

        {/* Lifetime Scrap Weight Diverted */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Landfill Diversion
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-900 tabular-nums">
              {totalWeightDiverted.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-stone-500">kg</span>
          </div>
          <span className="text-[10px] text-emerald-700 block font-semibold">
            100% Circular Recovery
          </span>
        </div>

        {/* Carbon Footprint Avoided */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            Emissions Avoided
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-teal-700 tabular-nums">
              {totalCO2Avoided}
            </span>
            <span className="text-xs font-bold text-teal-700">kg CO₂e</span>
          </div>
          <span className="text-[10px] text-stone-500 block">
            Averted toxic chemical leaching
          </span>
        </div>

        {/* Instant Direct Payments */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
          <span className="text-[11px] text-stone-500 font-semibold block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#176B45]" />
            Total UPI Earnings
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-900 tabular-nums">
              ₹{totalPaidOut}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 block font-semibold">
            Direct Bank Transfer
          </span>
        </div>
      </div>

      {/* Active Doorstep Pickups with Real-Time 4-Digit OTP */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              Active Doorstep Pickups & Handover OTPs
            </h4>
            <p className="text-xs text-stone-500">
              Show this 4-digit OTP to your arriving Kabadiwala once scrap is placed on their digital scale.
            </p>
          </div>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="py-2 px-4 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <span>+ Schedule New Pickup</span>
          </button>
        </div>

        {/* Pickups List */}
        <div className="space-y-3">
          {pendingPickups.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-semibold text-stone-700">No pending pickups!</p>
              <p className="text-[11px] text-stone-500">
                Click "+ Schedule New Pickup" above to book an instant scrap collection.
              </p>
            </div>
          ) : (
            pendingPickups.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/90 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-stone-900">
                      Pickup ID: {job.id} · {job.materials.join(', ')}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Collector: Rajesh Kumar (EV #14)
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Slot: {job.timeSlot} · Est. {job.estimatedWeight}</span>
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{job.address}</span>
                  </div>
                </div>

                {/* Prominent 4-Digit OTP Box */}
                <div className="bg-white px-4 py-2.5 rounded-2xl border-2 border-emerald-300 shadow-xs flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-stone-400 block uppercase font-bold">
                      HANDOVER PIN
                    </span>
                    <span className="text-xs font-black text-stone-800">4-Digit OTP</span>
                  </div>
                  <div className="text-2xl font-mono font-black text-[#176B45] tracking-widest bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shadow-inner">
                    {job.otpCode}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Completed Pickups */}
          {completedPickups.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Recently Completed Pickups ({completedPickups.length})
              </span>
              <div className="space-y-2">
                {completedPickups.slice(0, 2).map((job) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900">{job.id}</span> ·{' '}
                      <span className="text-stone-600">{job.materials.join(', ')}</span>
                      <span className="text-[10px] text-stone-400 block">{job.timeSlot}</span>
                    </div>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">
                      ✓ Handed Over & ₹{job.estPayout} Paid
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Citizen Schedule Modal */}
      <CitizenScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
};
