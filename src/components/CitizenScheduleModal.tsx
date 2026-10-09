import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  X,
  CreditCard,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import type { PickupJob } from '../types';

interface CitizenScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduled?: (job: PickupJob) => void;
}

export const CitizenScheduleModal: React.FC<CitizenScheduleModalProps> = ({
  isOpen,
  onClose,
  onScheduled,
}) => {
  const { addPickupJob, speakText } = useApp();

  const [materials, setMaterials] = useState<string[]>(['E-Waste / Telecom PCBs', 'Li-Ion Battery Cells']);
  const [address, setAddress] = useState<string>('Flat 501, Greenfield Residency, Link Road, Andheri West');
  const [ward, setWard] = useState<string>('Ward K-West');
  const [selectedSlot, setSelectedSlot] = useState<string>('Today, 02:00 PM - 03:00 PM');
  const [estWeight, setEstWeight] = useState<string>('15 kg');
  const [upiId, setUpiId] = useState<string>('aarav.mehta@oksbi');
  const [scheduledJob, setScheduledJob] = useState<PickupJob | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const weightNum = parseFloat(estWeight) || 12;
    const estPayout = Math.round(weightNum * 95); // ~₹95/kg benchmark

    const newJob = addPickupJob({
      citizenName: 'Aarav Mehta (Citizen)',
      address,
      ward,
      timeSlot: selectedSlot,
      estimatedWeight: `${weightNum} kg`,
      materials,
      estPayout,
    });

    setScheduledJob(newJob);
    if (onScheduled) onScheduled(newJob);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    speakText(
      `Doorstep pickup scheduled successfully! Your secure 4-digit handover PIN is ${newJob.otpCode}. Rajesh Kumar will arrive soon.`,
      `डोरस्टेप पिकअप सफलतापूर्वक शेड्यूल हो गया है! आपका 4-अंकों का ओटीपी पिन ${newJob.otpCode} है।`
    );
  };

  const handleClose = () => {
    setScheduledJob(null);
    onClose();
  };

  const toggleMaterial = (mat: string) => {
    if (materials.includes(mat)) {
      if (materials.length > 1) {
        setMaterials(materials.filter((m) => m !== mat));
      }
    } else {
      setMaterials([...materials, mat]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-[#176B45]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Schedule Doorstep E-Waste Pickup
              </h3>
              <p className="text-[11px] text-stone-500">
                Connects directly to nearby Kabadiwala with calibrated IoT loadcell.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!scheduledJob ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Scrap Category Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Select Materials for Pickup:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'E-Waste / Telecom PCBs',
                  'Li-Ion Battery Cells',
                  'Copper Cables & Wiring',
                  'Old Laptops & Chargers',
                  'Smartphones & Displays',
                ].map((item) => {
                  const isChecked = materials.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMaterial(item)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                        isChecked
                          ? 'bg-emerald-50 border-[#176B45] text-[#176B45] shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Weight & Payout */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block">
                  Approx. Weight (kg):
                </label>
                <input
                  type="text"
                  value={estWeight}
                  onChange={(e) => setEstWeight(e.target.value)}
                  placeholder="e.g. 15 kg"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:bg-white focus:outline-hidden focus:border-[#176B45]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block">
                  Estimated Payout:
                </label>
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs font-bold text-[#176B45] flex items-center justify-between">
                  <span>₹{Math.round((parseFloat(estWeight) || 12) * 95)}</span>
                  <span className="text-[10px] text-emerald-700 font-normal">UPI Escrow</span>
                </div>
              </div>
            </div>

            {/* Pickup Address */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Pickup Address:</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#176B45]"
              />
            </div>

            {/* Ward & Time Slot */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block">
                  Municipal Ward:
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 text-xs text-stone-900 font-medium focus:outline-hidden"
                >
                  <option value="Ward K-West">Ward K-West (Andheri W)</option>
                  <option value="Ward K-East">Ward K-East (Andheri E)</option>
                  <option value="Ward H-West">Ward H-West (Bandra)</option>
                  <option value="Ward G-North">Ward G-North (Dharavi)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Time Window:</span>
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 text-xs text-stone-900 font-medium focus:outline-hidden"
                >
                  <option value="Today, 11:45 AM - 12:30 PM">11:45 AM - 12:30 PM (Quick)</option>
                  <option value="Today, 02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Afternoon)</option>
                  <option value="Today, 04:30 PM - 05:30 PM">04:30 PM - 05:30 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Instant Settlement UPI */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-600 block flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                <span>UPI VPA for Instant Direct Bank Payout:</span>
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okaxis"
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-mono text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#176B45]"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#176B45] hover:bg-[#125436] active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Confirm & Dispatch Collector Now</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State with Live OTP */
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#176B45] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                {scheduledJob.id} · ASSIGNED & EN ROUTE
              </span>
              <h4 className="text-base font-black text-stone-900">
                Collector Dispatched in Real Time!
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Rajesh Kumar (EV #14) is en route with a calibrated Bluetooth load cell scale.
              </p>
            </div>

            {/* OTP Handover Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-[#176B45]/40 max-w-xs mx-auto space-y-1.5 shadow-xs">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">
                YOUR 4-DIGIT SECURE HANDOVER OTP
              </span>
              <div className="text-3xl font-mono font-black text-[#176B45] tracking-widest bg-white py-1.5 px-4 rounded-xl border border-emerald-200 shadow-inner">
                {scheduledJob.otpCode}
              </div>
              <span className="text-[10px] text-stone-500 block">
                Share this PIN with the collector only after your e-waste is placed on the scale.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Time Window:</span>
                <span className="font-bold text-stone-800">{scheduledJob.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Est. Payout:</span>
                <span className="font-bold text-[#176B45]">₹{scheduledJob.estPayout} via UPI</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-[#176B45] text-white text-xs font-bold transition-all hover:bg-[#125436] cursor-pointer"
            >
              Done & View Live Status on Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
