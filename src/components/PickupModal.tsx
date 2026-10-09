import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  X,
  CreditCard
} from 'lucide-react';
import type { DiagnosticPreset, Language } from '../types';

interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset: DiagnosticPreset | null;
  currentLang: Language;
}

export const PickupModal: React.FC<PickupModalProps> = ({
  isOpen,
  onClose,
  preset,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('morning');
  const [scheduledSuccess, setScheduledSuccess] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>('Flat 602, Raheja Palms, Marol, Andheri East, Mumbai');
  const [userUpi, setUserUpi] = useState<string>('mehta.aarav@okaxis');

  if (!isOpen || !preset) return null;

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduledSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">
                Schedule Carbon-Neutral Scrap Pickup
              </h3>
              <p className="text-xs text-zinc-400">
                Hyper-local collector assigned via AVASAR algorithm with calibrated scale.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setScheduledSuccess(false);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!scheduledSuccess ? (
          <form onSubmit={handleConfirmSchedule} className="space-y-4">
            {/* Batch summary */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-zinc-400 block">{preset.name}</span>
                <span className="text-zinc-500 text-[11px]">{preset.polymerAlloy}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-sm">~{preset.estimatedWeightKg} kg</span>
                <span className="text-zinc-400 block text-[11px]">Est. Payout: ₹{preset.netYieldPayout}</span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 block">Pickup Location / Ward:</label>
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-hidden focus:border-emerald-500/60 font-sans text-xs"
              />
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 block">Select Preferred Time Slot:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: '10:00 - 11:30 AM', badge: 'EV Route Active' },
                  { id: 'afternoon', label: '02:00 - 03:30 PM', badge: 'Normal' },
                  { id: 'evening', label: '05:00 - 06:30 PM', badge: 'High Traffic' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedSlot === slot.id
                        ? 'bg-zinc-800 border-emerald-500/60 text-zinc-100 shadow-xs'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="font-semibold text-xs text-zinc-200">{slot.label}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">{slot.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID for instant payout */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 block">UPI VPA for Instant Direct Settlement:</label>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                <CreditCard className="w-4 h-4 text-emerald-400 ml-1" />
                <input
                  type="text"
                  value={userUpi}
                  onChange={(e) => setUserUpi(e.target.value)}
                  placeholder="yourname@okhdfcbank"
                  required
                  className="w-full bg-transparent text-zinc-200 text-xs focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Assign Hyper-Local Collector</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State with Assigned Collector & OTP */
          <div className="space-y-5 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-zinc-100">
                Collector Dispatched & Route Locked!
              </h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Rajesh Kumar (Formalized Micro-Collector ID: KABADI-MUM-412) will arrive with an IoT bluetooth scale.
              </p>
            </div>

            {/* OTP Handover Box */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-emerald-500/40 max-w-sm mx-auto space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 block uppercase">
                Your 4-Digit Handover Verification OTP
              </span>
              <div className="text-3xl font-mono font-black text-emerald-400 tracking-widest">
                7419
              </div>
              <span className="text-[10px] text-zinc-500 block">
                Do not share until waste has been weighed on the calibrated scale
              </span>
            </div>

            <button
              onClick={() => {
                setScheduledSuccess(false);
                onClose();
              }}
              className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors cursor-pointer"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
