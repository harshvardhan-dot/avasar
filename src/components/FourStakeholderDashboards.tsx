import React, { useState } from 'react';
import { 
  Users, 
  Truck, 
  Factory, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  KeyRound, 
  Check,
  Calendar
} from 'lucide-react';
import { CitizenScheduleModal } from './CitizenScheduleModal';
import { useApp } from '../context/AppContext';
import { WARD_METRICS } from '../data/mockData';

interface FourStakeholderDashboardsProps {
  onNavigateTab?: (tab: string) => void;
}

export const FourStakeholderDashboards: React.FC<FourStakeholderDashboardsProps> = ({ onNavigateTab: _onNavigateTab }) => {
  const { role, setRole, transactions, pickupJobs, verifyPickupJob } = useApp();

  // Active view role
  const [selectedDashboardRole, setSelectedDashboardRole] = useState<'citizen' | 'collector' | 'recycler' | 'ulb'>(
    role === 'citizen' ? 'citizen' : role === 'recycler' ? 'recycler' : role === 'ulb' ? 'ulb' : 'collector'
  );

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [activeOtpInput, setActiveOtpInput] = useState<{ [id: string]: string }>({});
  const [loggedWeight, setLoggedWeight] = useState<{ [id: string]: string }>({});
  const [otpError, setOtpError] = useState<{ [id: string]: string }>({});

  const handleVerifyOtp = (jobId: string, _actualOtp: string) => {
    const input = activeOtpInput[jobId] || '';
    const weightVal = loggedWeight[jobId] ? parseFloat(loggedWeight[jobId]) : undefined;
    const ok = verifyPickupJob(jobId, input, weightVal);
    if (!ok) {
      setOtpError((prev) => ({ ...prev, [jobId]: 'Invalid 4-digit OTP PIN! Check citizen handover screen.' }));
    } else {
      setOtpError((prev) => ({ ...prev, [jobId]: '' }));
    }
  };

  // Live calculations from real stored transactions
  const totalWeightDiverted = transactions.reduce((sum, tx) => sum + tx.weightKg, 0);
  const totalPaidOut = transactions
    .filter((tx) => tx.paymentStatus === 'PAID')
    .reduce((sum, tx) => sum + (tx.paidAmount || tx.estimatedValue), 0);
  const totalCO2Avoided = Number((totalWeightDiverted * 1.85).toFixed(1)); // ~1.85kg CO2e per kg e-waste secondary recovery

  return (
    <div className="space-y-4 pb-20">
      {/* Modern, high-end Segmented Role Switcher */}
      <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => {
            setSelectedDashboardRole('citizen');
            setRole('citizen');
          }}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedDashboardRole === 'citizen'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Citizen (नागरिक)</span>
        </button>

        <button
          onClick={() => {
            setSelectedDashboardRole('collector');
            setRole('collector');
          }}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedDashboardRole === 'collector'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Kabadi (कबाड़ी)</span>
        </button>

        <button
          onClick={() => {
            setSelectedDashboardRole('recycler');
            setRole('recycler');
          }}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedDashboardRole === 'recycler'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
          }`}
        >
          <Factory className="w-3.5 h-3.5" />
          <span>Recycler Hub</span>
        </button>

        <button
          onClick={() => {
            setSelectedDashboardRole('ulb');
            setRole('ulb');
          }}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedDashboardRole === 'ulb'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Municipal (ULB)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. CITIZEN DASHBOARD */}
      {/* ============================================================== */}
      {selectedDashboardRole === 'citizen' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 rounded-2xl shadow-md space-y-1.5">
            <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full text-emerald-100">
              CITIZEN / WASTE PRODUCER PORTAL
            </span>
            <h3 className="text-lg font-bold">
              Namaste, Aarav Mehta (Citizen User)
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Track doorstep pickups, accumulate Green Credits, view landfill diversion and monitor your carbon footprint.
            </p>
          </div>

          {/* 4 Citizen Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Green Credits */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium block">
                Green Credits Earned
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#176B45] tabular-nums">
                  1,840
                </span>
                <span className="text-xs font-bold text-emerald-700">GC</span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Redeemable for BMC property tax & Metro card recharge
              </span>
            </div>

            {/* Lifetime Scrap Weight Diverted */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium block">
                Lifetime Landfill Diversion
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 tabular-nums">
                  {totalWeightDiverted.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-stone-500">kg</span>
              </div>
              <span className="text-[10px] text-emerald-700 block font-medium">
                100% Circular Recovery
              </span>
            </div>

            {/* Carbon Footprint Avoided */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium block">
                Emissions Avoided
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-700 tabular-nums">
                  {totalCO2Avoided}
                </span>
                <span className="text-xs font-bold text-emerald-700">kg CO₂e</span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Averted primary copper mining
              </span>
            </div>

            {/* Instant Direct Payments */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium block">
                Total UPI Payments
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-stone-900 tabular-nums">
                  ₹{totalPaidOut}
                </span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Direct to Bank Account
              </span>
            </div>
          </div>

          {/* Active Scheduled Pickups with 4-Digit OTP */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Active Scheduled Doorstep Pickups
                </h4>
                <p className="text-[11px] text-stone-500">
                  Share the 4-digit OTP with your arriving collector upon visual weight inspection.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {pickupJobs.filter(j => j.status !== 'COMPLETED').length} ACTIVE
              </span>
            </div>

            <div className="space-y-2.5">
              {pickupJobs.map((job) => {
                const isCompleted = job.status === 'COMPLETED';
                return (
                  <div key={job.id} className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCompleted ? 'bg-emerald-50/30 border-emerald-200' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-stone-900">
                          Pickup ID: {job.id} · {job.materials.join(', ')}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isCompleted ? '✓ Completed' : 'Collector: Rajesh Kumar (EV #14)'}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Slot: {job.timeSlot} · Est. {job.estimatedWeight}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{job.address}</span>
                      </div>
                    </div>

                    {/* Secure 4-digit OTP box */}
                    <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-stone-400 block uppercase font-bold">
                          HANDOVER PIN
                        </span>
                        <span className="text-[11px] font-bold text-stone-700">4-Digit OTP</span>
                      </div>
                      <div className="text-xl font-mono font-black text-[#176B45] tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {job.otpCode}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <span>+ Schedule New Doorstep Pickup</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. KABADI / COLLECTOR DASHBOARD */}
      {/* ============================================================== */}
      {selectedDashboardRole === 'collector' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#176B45] to-[#1d8355] text-white p-4 rounded-2xl shadow-md space-y-1.5">
            <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full text-emerald-100">
              FORMALIZED KABADIWALA COLLECTOR PORTAL
            </span>
            <h3 className="text-lg font-bold">
              Rajesh Kumar (Collector ID: KABADI-MUM-412)
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Today's geo-clustered route, Bluetooth digital scales logging, 4-digit OTP handover confirmation, and daily UPI wallet.
            </p>
          </div>

          {/* Quick metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span className="text-[10px] text-stone-500 font-medium block">Today's Route</span>
              <span className="text-lg font-black text-stone-900 block">3 Pickups</span>
              <span className="text-[10px] text-emerald-700 block">3.8 km radius</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span className="text-[10px] text-stone-500 font-medium block">Daily Wallet</span>
              <span className="text-lg font-black text-[#176B45] block tabular-nums">₹12,390</span>
              <span className="text-[10px] text-stone-500 block">UPI Escrow</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span className="text-[10px] text-stone-500 font-medium block">Formalization</span>
              <span className="text-sm font-bold text-emerald-800 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Tier-1 CPCB
              </span>
              <span className="text-[10px] text-stone-500 block">E-Shram Linked</span>
            </div>
          </div>

          {/* Today's Optimized Route List & OTP Verification */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Today's Optimized Pickups & 4-Digit OTP Verification
                </h4>
                <p className="text-[11px] text-stone-500">
                  Enter calibrated Bluetooth scale weight and ask citizen for their 4-digit OTP.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                BT SCALE CONNECTED
              </span>
            </div>

            <div className="space-y-2.5">
              {pickupJobs.map((job) => {
                const isDone = job.status === 'COMPLETED';
                return (
                  <div
                    key={job.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">
                            {job.citizenName}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-stone-200 text-stone-700 border-stone-300'
                          }`}>
                            {isDone ? 'COMPLETED' : job.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{job.address} ({job.ward})</span>
                        </div>
                        <div className="text-[11px] text-stone-600 font-mono">
                          Est. Weight: {job.estimatedWeight} · Items: {job.materials.join(', ')}
                        </div>
                        {otpError[job.id] && (
                          <span className="text-[11px] text-rose-600 font-semibold block">
                            ⚠️ {otpError[job.id]}
                          </span>
                        )}
                      </div>

                      {/* Scale input & OTP Verification */}
                      <div className="flex items-center gap-2 pt-1 sm:pt-0">
                        {!isDone ? (
                          <>
                            <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg p-1 text-xs">
                              <span className="text-[10px] text-stone-400 pl-1 font-mono">KG:</span>
                              <input
                                type="text"
                                placeholder={job.estimatedWeight}
                                value={loggedWeight[job.id] || ''}
                                onChange={(e) => setLoggedWeight({ ...loggedWeight, [job.id]: e.target.value })}
                                className="w-14 bg-transparent text-center font-bold text-stone-900 focus:outline-hidden"
                              />
                            </div>

                            <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg p-1 text-xs">
                              <KeyRound className="w-3.5 h-3.5 text-stone-400 ml-1" />
                              <input
                                type="text"
                                maxLength={4}
                                placeholder="OTP"
                                value={activeOtpInput[job.id] || ''}
                                onChange={(e) => setActiveOtpInput({ ...activeOtpInput, [job.id]: e.target.value })}
                                className="w-14 bg-transparent text-center font-mono font-bold text-[#176B45] tracking-widest focus:outline-hidden"
                              />
                            </div>

                            <button
                              onClick={() => handleVerifyOtp(job.id, job.otpCode)}
                              className="py-1.5 px-3 rounded-lg bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                            >
                              Verify & Pay
                            </button>
                          </>
                        ) : (
                          <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-700" />
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
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. RECYCLER HUB DASHBOARD */}
      {/* ============================================================== */}
      {selectedDashboardRole === 'recycler' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 rounded-2xl shadow-md space-y-1.5">
            <span className="text-[10px] font-mono bg-emerald-700 px-2 py-0.5 rounded-full text-emerald-100">
              RECYCLER HUB & PRECISION SMELTER
            </span>
            <h3 className="text-lg font-bold">
              EcoRev Green Metallurgy Ltd. (Turbhe MIDC)
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Incoming bulk feedstock queue, purity verification grades (A/B/C), spot scrap commodity price ticker, and material processing capacity utilization bar.
            </p>
          </div>

          {/* Plant Capacity & Purity Grades */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Capacity Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-[11px] text-stone-500 font-medium block">
                Plant Processing Capacity
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-[#176B45]">78.4%</span>
                <span className="text-xs text-stone-500">18.8 / 24.0 T/Day</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-[#176B45] h-full w-[78.4%]"></div>
              </div>
              <span className="text-[10px] text-emerald-700 block">Optimal Throughput</span>
            </div>

            {/* Purity Verification Grades */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
              <span className="text-[11px] text-stone-500 font-medium block">
                Purity Verification Grades
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">
                  Grade A: 82%
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-xs">
                  Grade B: 14%
                </span>
                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-bold text-xs">
                  Grade C: 4%
                </span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Calibrated by optical NIR & eddy current sensor
              </span>
            </div>

            {/* Scrap Price Ticker */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium block">
                Scrap Commodity Ticker (Q4 2026)
              </span>
              <div className="space-y-0.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span>Gold-Finger PCB:</span>
                  <span className="font-bold text-[#176B45]">₹100–115/kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Li-Ion NMC Cells:</span>
                  <span className="font-bold text-[#176B45]">₹60–75/kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Copper Cables:</span>
                  <span className="font-bold text-[#176B45]">₹80–92/kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Incoming Bulk Feedstock Queue Table */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Incoming Bulk Feedstock Queue
                </h4>
                <p className="text-[11px] text-stone-500">
                  Real-time consignment verification and gate receiving.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                NIR SPECTROMETRY READY
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase border-b border-stone-200">
                  <tr>
                    <th className="py-2 px-2.5">Passport ID</th>
                    <th className="py-2 px-2.5">Material</th>
                    <th className="py-2 px-2.5">Weight</th>
                    <th className="py-2 px-2.5">Purity Grade</th>
                    <th className="py-2 px-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {transactions.slice(0, 4).map((tx) => (
                    <tr key={tx.passportId} className="hover:bg-stone-50">
                      <td className="py-2.5 px-2.5 font-mono font-bold text-[#176B45]">
                        {tx.passportId}
                      </td>
                      <td className="py-2.5 px-2.5 font-medium">{tx.materialName}</td>
                      <td className="py-2.5 px-2.5 font-bold tabular-nums">{tx.weightKg} kg</td>
                      <td className="py-2.5 px-2.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Grade A+ ({tx.confidenceScore}%)
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          tx.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tx.paymentStatus === 'PAID' ? 'SETTLED' : tx.handoverStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MUNICIPAL / ULB DASHBOARD */}
      {/* ============================================================== */}
      {selectedDashboardRole === 'ulb' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl shadow-md space-y-1.5">
            <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full text-blue-100">
              URBAN LOCAL BODY (ULB) & MUNICIPAL GOVERNANCE
            </span>
            <h3 className="text-lg font-bold">
              Brihanmumbai Municipal Corporation (BMC) Urban Cell
            </h3>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Ward-level diversion heatmaps, total tonnage processed vs landfilled, informal collector formalization count, and EPR compliance tracker.
            </p>
          </div>

          {/* 4 Key ULB Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span className="text-[10px] text-stone-500 font-medium block">Total Diverted</span>
              <span className="text-xl font-black text-[#176B45] block tabular-nums">319.4 T</span>
              <span className="text-[10px] text-emerald-700 block">Diverted from dumps</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span className="text-[10px] text-stone-500 font-medium block">Processed vs Landfill</span>
              <span className="text-xl font-black text-stone-900 block tabular-nums">91.8%</span>
              <span className="text-[10px] text-stone-500 block">Circular Recovery Ratio</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span className="text-[10px] text-stone-500 font-medium block">Formalized Kabadis</span>
              <span className="text-xl font-black text-stone-900 block tabular-nums">666</span>
              <span className="text-[10px] text-blue-700 block font-medium">With Ayushman Cover</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs space-y-0.5">
              <span className="text-[10px] text-stone-500 font-medium block">CPCB EPR Target</span>
              <span className="text-xl font-black text-emerald-700 block tabular-nums">93.4%</span>
              <span className="text-[10px] text-stone-500 block">Audited Compliance</span>
            </div>
          </div>

          {/* Ward-Level Diversion Heatmap Cards */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Ward-Level Diversion Performance Heatmap
                </h4>
                <p className="text-[11px] text-stone-500">
                  Zonal breakdown of segregation compliance, informal inclusion, and landfill diversion.
                </p>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                BMC TELEMETRY SYNC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WARD_METRICS.map((ward, wIdx) => (
                <div key={wIdx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">{ward.wardName}</span>
                    <span className="text-xs font-bold text-[#176B45]">
                      {ward.segregationScore}% Segregation
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <span className="text-[9px] text-stone-400 block">Diverted</span>
                      <span className="font-bold text-stone-900">{ward.tonnageDiverted} T</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <span className="text-[9px] text-stone-400 block">Kabadis</span>
                      <span className="font-bold text-stone-900">{ward.informalCollectorsRegistered}</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-stone-200">
                      <span className="text-[9px] text-stone-400 block">EPR Rate</span>
                      <span className="font-bold text-emerald-700">{ward.eprComplianceRate}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#176B45] h-full rounded-full"
                      style={{ width: `${ward.segregationScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Citizen Doorstep Scheduling Modal */}
      <CitizenScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
};
