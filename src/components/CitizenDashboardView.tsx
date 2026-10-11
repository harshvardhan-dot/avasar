import React, { useState } from 'react';
import { 
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Leaf,
  ShieldCheck,
  Camera,
  Scan,
  ArrowRight,
  RotateCw,
  Info,
  Scale,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CitizenScheduleModal } from './CitizenScheduleModal';
import { SAMPLE_SCAN_PRESETS } from '../data/avasarData';
import type { WasteCategory } from '../types/avasar';

interface CitizenDashboardViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({ onNavigateTab }) => {
  const { transactions, pickupJobs, materials, speakText, language } = useApp();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);

  // Scanner state inside Citizen Dashboard
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectedCategory, setDetectedCategory] = useState<WasteCategory>('PHONES');
  const [confidence, setConfidence] = useState<number>(95);
  const [weightKg, setWeightKg] = useState<number>(2.5);

  const activePhoto = customPhoto || SAMPLE_SCAN_PRESETS[selectedPresetIndex]?.image || SAMPLE_SCAN_PRESETS[0].image;
  const currentMaterial = materials.find((m) => m.id === detectedCategory) || materials[0];
  const ratePerKg = currentMaterial.defaultRatePerKg;
  const estimatedTotal = Number((weightKg * ratePerKg).toFixed(0));

  const runSimulatedScan = (cat: WasteCategory, conf: number, sampleWt: number) => {
    setIsScanning(true);
    setTimeout(() => {
      setDetectedCategory(cat);
      setConfidence(conf);
      setWeightKg(sampleWt);
      setIsScanning(false);
      speakText(
        `Scanned ${cat}. Estimated weight ${sampleWt} kg. Value is ₹${sampleWt * ratePerKg}.`,
        `पहचाना गया ई-कचरा: ${cat}। वजन: ${sampleWt} किलो। मूल्य: ₹${sampleWt * ratePerKg}।`
      );
    }, 700);
  };

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setCustomPhoto(null);
    const preset = SAMPLE_SCAN_PRESETS[index];
    runSimulatedScan(preset.category, preset.confidence, preset.sampleWeight);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhoto(event.target?.result as string);
        runSimulatedScan('PHONES', 92, 2.0);
      };
      reader.readAsDataURL(file);
    }
  };

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

      {/* Citizen AI Waste Scanner & Quick Actions Banner */}
      <div className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 rounded-3xl border border-emerald-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow-xs shrink-0 mt-0.5">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-stone-900">
                  AI E-Waste Diagnostic Scanner & Value Estimator
                </h4>
                <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Citizen Portal Feature
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Scan your obsolete electronics, identify PCB/battery categories, compute instant fair scrap value, and book doorstep collection.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="py-2 px-4 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Launch AI Camera Scanner</span>
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('scan')}
                className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95"
                title="Full-page Scanner Terminal"
              >
                <span>Full Module</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Quick Scan Showcase Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=150&q=80"
                alt="Smartphone scan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Instant Recognition</span>
              <span className="text-xs font-bold text-stone-900 block truncate">Old Phones & Tablets</span>
              <span className="text-[11px] font-semibold text-emerald-700">₹150 / kg rate</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80"
                alt="PCB scan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Precious Metals</span>
              <span className="text-xs font-bold text-stone-900 block truncate">PCBs & Motherboards</span>
              <span className="text-[11px] font-semibold text-emerald-700">₹100 / kg rate</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=150&q=80"
                alt="Battery scan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Hazardous Li-Ion</span>
              <span className="text-xs font-bold text-stone-900 block truncate">Batteries & Power banks</span>
              <span className="text-[11px] font-semibold text-teal-700">Safe Bagging + ₹60/kg</span>
            </div>
          </div>
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

      {/* Citizen In-Dashboard AI Waste Scanner Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Citizen E-Waste Camera Scanner
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Optical Recognition & Payout Calculator
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsScanModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prototype Notice */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2 shadow-2xs">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold block text-amber-950">
                  Instant Simulation:
                </strong>
                Point camera at scrap electronics or test sample cards below to calculate instant scrap rate.
              </div>
            </div>

            {/* Scanner Viewport */}
            <div className="relative aspect-4/3 w-full bg-stone-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              <img
                src={activePhoto}
                alt="Scanned item"
                className="w-full h-full object-cover filter contrast-[1.02]"
              />

              {/* Optical Reticle Crosshairs */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-40 h-40 border border-emerald-400/60 rounded-xl">
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-400/80 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>

              {/* Laser animation */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-line z-20"></div>
              )}

              {/* Floating diagnostic result */}
              <div className="absolute bottom-2 inset-x-2 z-20 bg-stone-900/90 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs flex items-center justify-between border border-white/10 font-sans">
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    {isScanning ? 'CLASSIFYING SPECTRA...' : 'AI CLASSIFICATION:'}
                  </span>
                  <span className="font-bold text-xs text-white">
                    {language === 'hi' ? currentMaterial.nameHi : currentMaterial.nameEn}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-mono block">ACCURACY</span>
                  <span className="font-bold text-emerald-400 text-xs">
                    {confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Presets / Camera controls */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <label className="flex-1 py-2 px-3 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                  <Camera className="w-4 h-4" />
                  <span>Upload / Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => runSimulatedScan(detectedCategory, confidence, weightKg)}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-stone-200 active:scale-95 transition-all"
                  title="Rescan"
                >
                  <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-emerald-700' : ''}`} />
                  <span>Rescan</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SAMPLE_SCAN_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.category}
                    onClick={() => handleSelectPreset(idx)}
                    className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                      selectedPresetIndex === idx && !customPhoto
                        ? 'bg-emerald-50 text-[#176B45] border-[#176B45] font-bold shadow-2xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight & Value Breakdown */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-700" />
                  Approx. Scrap Weight:
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-16 bg-white border border-stone-300 rounded-lg px-2 py-0.5 text-xs font-bold text-stone-900 text-right"
                  />
                  <span className="text-xs font-bold text-stone-700">kg</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-emerald-200/60 pt-2">
                <span className="text-stone-600">Indicative Rate:</span>
                <span className="font-bold text-stone-900">₹{ratePerKg} / kg</span>
              </div>
              <div className="flex items-center justify-between border-t border-emerald-200/60 pt-2">
                <span className="text-xs font-bold text-stone-900">Estimated Doorstep UPI Payout:</span>
                <span className="text-base font-black text-[#176B45]">₹{estimatedTotal}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setIsScanModalOpen(false);
                  setIsScheduleModalOpen(true);
                }}
                className="flex-1 py-2.5 px-4 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Book Pickup for this Item (₹{estimatedTotal})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
