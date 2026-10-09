import React, { useState } from 'react';
import { 
  Users, 
  Truck, 
  Factory, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  KeyRound, 
  Check
} from 'lucide-react';
import type { UserRole, Language, PickupJob } from '../types';
import { SAMPLE_PICKUP_JOBS, WARD_METRICS } from '../data/mockData';
import { translations } from '../utils/i18n';

interface StakeholderDashboardsProps {
  currentLang: Language;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const StakeholderDashboards: React.FC<StakeholderDashboardsProps> = ({
  currentLang,
  selectedRole,
  onRoleChange,
}) => {
  const t = translations[currentLang];
  const [pickupJobs, setPickupJobs] = useState<PickupJob[]>(SAMPLE_PICKUP_JOBS);
  const [activeOtpInput, setActiveOtpInput] = useState<{ [id: string]: string }>({});
  const [verifiedJobs, setVerifiedJobs] = useState<{ [id: string]: boolean }>({});
  const [loggedWeight, setLoggedWeight] = useState<{ [id: string]: string }>({});

  const handleVerifyOtp = (jobId: string, actualOtp: string) => {
    const input = activeOtpInput[jobId];
    if (input === actualOtp) {
      setVerifiedJobs((prev) => ({ ...prev, [jobId]: true }));
      setPickupJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'COMPLETED' } : j))
      );
    } else {
      alert('Invalid Verification OTP PIN. Please inspect citizen app display.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold uppercase">
              Role-Specific Operations & Telemetry
            </span>
            <span className="text-zinc-500 text-xs font-mono">LIVE PRODUCTION PORTALS</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            {t.dashboardTitle}
          </h2>
        </div>

        {/* 4 Role Selector Tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => onRoleChange('citizen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedRole === 'citizen'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen / Producer</span>
          </button>

          <button
            onClick={() => onRoleChange('kabadi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedRole === 'kabadi'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Kabadi / Collector</span>
          </button>

          <button
            onClick={() => onRoleChange('recycler')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedRole === 'recycler'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Recycler Hub</span>
          </button>

          <button
            onClick={() => onRoleChange('ulb')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedRole === 'ulb'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Municipal (ULB)</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD 1: CITIZEN / PRODUCER */}
      {selectedRole === 'citizen' && (
        <div className="space-y-6">
          {/* Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                {t.creditsEarned}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                  1,840 GC
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +120 This Week
                </span>
              </div>
              <span className="text-xs text-zinc-400 block pt-1">
                Redeemable for municipal property tax rebates & metro card credits
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                {t.landfillDiverted}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-zinc-100 tabular-nums">
                  214.8 kg
                </span>
                <span className="text-xs font-mono text-zinc-400">Lifetime</span>
              </div>
              <span className="text-xs text-zinc-400 block pt-1">
                100% verified circular recycling through formalized kabadis
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                {t.co2Avoided}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                  348.2 kg
                </span>
                <span className="text-xs font-mono text-zinc-500">CO₂e Avoided</span>
              </div>
              <span className="text-xs text-zinc-400 block pt-1">
                Equivalent to 1,420 km of combustion vehicle emissions averted
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Direct UPI Payouts
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-zinc-100 tabular-nums">
                  ₹6,420.00
                </span>
                <span className="text-xs font-mono text-emerald-400">Instant</span>
              </div>
              <span className="text-xs text-zinc-400 block pt-1">
                Zero middleman margin: Direct digital weigh-scale settlement
              </span>
            </div>
          </div>

          {/* Active Pickups & Escrow Pin Card */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  Active Scheduled Pickups
                </h3>
                <p className="text-xs text-zinc-400">
                  Share the 4-digit OTP code with your arriving collector after visual weight verification.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                1 Pickup En Route
              </span>
            </div>

            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100">
                    Pickup ID: PK-982 · High-Value E-Waste & Batteries
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Collector: Rajesh Kumar (EV Fleet #14)
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 flex items-center gap-3">
                  <span>Slot: Today, 11:45 AM - 12:30 PM</span>
                  <span>Est. Weight: ~16 kg</span>
                  <span>Est. Payout: ₹2,850.00</span>
                </div>
              </div>

              {/* Secure Handover OTP */}
              <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2.5 rounded-lg border border-emerald-500/40">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 block">SECURE OTP CODE</span>
                  <span className="text-xs font-mono text-zinc-400">Handover Pin</span>
                </div>
                <div className="text-xl font-mono font-black text-emerald-400 tracking-widest bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/30">
                  3190
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD 2: KABADI / MICRO-COLLECTOR */}
      {selectedRole === 'kabadi' && (
        <div className="space-y-6">
          {/* Collector Quick Status & Wallet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Today's Route Schedule
              </span>
              <div className="text-2xl font-black font-mono text-zinc-100">
                3 Assigned Lots
              </div>
              <span className="text-xs text-zinc-400">
                Optimized geo-cluster across Ward K-West (Total 3.8 km radius)
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Daily Payout Wallet
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ₹12,390.00
              </div>
              <span className="text-xs text-zinc-400">
                Disbursed to Canara Bank UPI · Micro-Collector Rajesh Kumar
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Formalization & Safety Tier
              </span>
              <div className="text-lg font-bold font-mono text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Tier-1 CPCB Registered</span>
              </div>
              <span className="text-xs text-zinc-400">
                E-Shram Card Linked · Health Insurance Covered
              </span>
            </div>
          </div>

          {/* Interactive Collector Route List & OTP Verification */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  {t.todayRoute}
                </h3>
                <p className="text-xs text-zinc-400">
                  Verify digital scale readings and unlock payment with citizen's 4-digit OTP.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                BLUETOOTH LOAD CELL: CONNECTED
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {pickupJobs.map((job) => {
                const isDone = job.status === 'COMPLETED' || verifiedJobs[job.id];
                return (
                  <div
                    key={job.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-zinc-800 bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-100 text-sm">
                            {job.citizenName}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {isDone ? 'COMPLETED' : job.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{job.address} ({job.ward})</span>
                        </div>
                        <div className="text-xs font-mono text-zinc-500 flex gap-2 pt-1">
                          <span>Items: {job.materials.join(', ')}</span>
                          <span>· Est: {job.estimatedWeight}</span>
                        </div>
                      </div>

                      {/* Scale logging & OTP Action */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        {!isDone ? (
                          <>
                            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded p-1">
                              <span className="text-[10px] text-zinc-500 pl-1">SCALE KG:</span>
                              <input
                                type="text"
                                placeholder={job.estimatedWeight}
                                value={loggedWeight[job.id] || ''}
                                onChange={(e) => setLoggedWeight({ ...loggedWeight, [job.id]: e.target.value })}
                                className="w-16 bg-transparent text-xs text-zinc-100 text-center font-mono focus:outline-hidden"
                              />
                            </div>

                            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded p-1">
                              <KeyRound className="w-3.5 h-3.5 text-zinc-500 ml-1" />
                              <input
                                type="text"
                                maxLength={4}
                                placeholder="OTP"
                                value={activeOtpInput[job.id] || ''}
                                onChange={(e) => setActiveOtpInput({ ...activeOtpInput, [job.id]: e.target.value })}
                                className="w-14 bg-transparent text-xs text-emerald-400 text-center font-mono tracking-widest focus:outline-hidden font-bold"
                              />
                            </div>

                            <button
                              onClick={() => handleVerifyOtp(job.id, job.otpCode)}
                              className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Verify & Pay
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/30">
                            <Check className="w-4 h-4" />
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

      {/* DASHBOARD 3: RECYCLER HUB */}
      {selectedRole === 'recycler' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Plant Processing Capacity
              </span>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-2xl font-black text-emerald-400">78.4%</span>
                <span className="text-xs text-zinc-400">18.8 / 24.0 Tons/Day</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[78.4%]"></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Quality Feedstock Purity Index
              </span>
              <div className="text-2xl font-black font-mono text-zinc-100">
                94.8% Grade A+
              </div>
              <span className="text-xs text-zinc-400">
                Automated NIR spectroscopy validation at receiving bay
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Secondary Feedstock Contracts
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ₹84.2 Lakhs
              </div>
              <span className="text-xs text-zinc-400">
                Offtake agreements with automotive & packaging conglomerates
              </span>
            </div>
          </div>

          {/* Incoming Queue Table */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  {t.feedstockQueue}
                </h3>
                <p className="text-xs text-zinc-400">
                  Real-time consignment verification and gate receiving.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                LIVE GATE CAM & SENSOR READY
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Batch ID</th>
                    <th className="py-2.5 px-3">Aggregator / Hub</th>
                    <th className="py-2.5 px-3">Polymer / Grade</th>
                    <th className="py-2.5 px-3">Net Weight</th>
                    <th className="py-2.5 px-3">Spectrometry Grade</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  <tr className="hover:bg-zinc-900/40">
                    <td className="py-3 px-3 font-semibold text-emerald-400">AVS-2026-MUM-8921</td>
                    <td className="py-3 px-3 text-zinc-300">Bandra-Kurla MRF Hub</td>
                    <td className="py-3 px-3 text-zinc-300">HDPE Blow Molding (#2)</td>
                    <td className="py-3 px-3 text-zinc-200">42.5 kg</td>
                    <td className="py-3 px-3 text-emerald-400">94.6% (Grade A+)</td>
                    <td className="py-3 px-3 text-amber-400">In Granulation Line</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40">
                    <td className="py-3 px-3 font-semibold text-zinc-200">AVS-2026-MUM-8919</td>
                    <td className="py-3 px-3 text-zinc-300">Dharavi Micro-Consortium</td>
                    <td className="py-3 px-3 text-zinc-300">PET Flakes Cold-Washed</td>
                    <td className="py-3 px-3 text-zinc-200">1,240.0 kg</td>
                    <td className="py-3 px-3 text-zinc-300">88.2% (Grade B)</td>
                    <td className="py-3 px-3 text-emerald-400">Washing Cleared</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40">
                    <td className="py-3 px-3 font-semibold text-zinc-200">AVS-2026-MUM-8914</td>
                    <td className="py-3 px-3 text-zinc-300">Andheri Electronics Hub</td>
                    <td className="py-3 px-3 text-zinc-300">Telecom Multi-Layer FR4</td>
                    <td className="py-3 px-3 text-zinc-200">180.0 kg</td>
                    <td className="py-3 px-3 text-emerald-400">92.4% (Precious Metals)</td>
                    <td className="py-3 px-3 text-zinc-400">In Smelting Bay</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD 4: MUNICIPAL / ULB */}
      {selectedRole === 'ulb' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Total Ward Diversion
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                319.4 Tons
              </div>
              <span className="text-xs text-zinc-400">
                Monthly non-biodegradable diversion from Deonar & Mulund dumps
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Formalized Kabadis
              </span>
              <div className="text-2xl font-black font-mono text-zinc-100">
                666 Collectors
              </div>
              <span className="text-xs text-zinc-400">
                Equipped with digital scales, biometric ID & Ayushman health cover
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                CPCB EPR Compliance
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                93.4% Target
              </div>
              <span className="text-xs text-zinc-400">
                Audited digital certificate generation for brand owners
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Municipal Fuel Savings
              </span>
              <div className="text-2xl font-black font-mono text-zinc-100">
                ₹18.4 Lakhs
              </div>
              <span className="text-xs text-zinc-400">
                Avoided municipal compactor trips via hyper-local collector routing
              </span>
            </div>
          </div>

          {/* Ward Level Performance Heatmap / Table */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  {t.wardHeatmap}
                </h3>
                <p className="text-xs text-zinc-400">
                  Zonal breakdown of segregation compliance, formalized informal inclusion, and landfill diversion.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                BMC URBAN TELEMETRY SYNC
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WARD_METRICS.map((ward, wIdx) => (
                <div key={wIdx} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 font-sans">{ward.wardName}</span>
                    <span className="text-emerald-400 font-bold">{ward.segregationScore}% Segregation</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">Diverted</span>
                      <span className="text-zinc-100 font-bold">{ward.tonnageDiverted} T</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">Kabadis</span>
                      <span className="text-zinc-100 font-bold">{ward.informalCollectorsRegistered}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 block text-[9px]">EPR Rate</span>
                      <span className="text-emerald-400 font-bold">{ward.eprComplianceRate}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${ward.segregationScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
