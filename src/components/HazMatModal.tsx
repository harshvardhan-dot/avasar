import React from 'react';
import { 
  ShieldAlert, 
  X, 
  BatteryCharging, 
  Radio, 
  FlaskConical, 
  PhoneCall
} from 'lucide-react';
import type { Language } from '../types';

interface HazMatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
}

export const HazMatModal: React.FC<HazMatModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-zinc-950 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-100">
                  Hazardous Material (HazMat) Safety Protocols
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  MANDATORY
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Ground safety regulations for informal collectors and citizen deposit bays.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High Risk Item Handling Cards */}
        <div className="space-y-4">
          {/* Swollen Li-ion batteries */}
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <BatteryCharging className="w-4 h-4" />
              <span>1. Swollen or Punctured Lithium-Ion Battery Cells (UN 3480)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 font-bold block">DO:</span>
                <p className="text-zinc-300 leading-relaxed">
                  Isolate in a dry, fire-safe container surrounded by vermiculite or dry sand. Tape external exposed terminals with non-conductive electrical tape.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-rose-400 font-bold block">DO NOT:</span>
                <p className="text-zinc-300 leading-relaxed">
                  Never puncture, submerge in tap water, or toss into general scrap bales or balers where mechanical compaction will trigger thermal runaway.
                </p>
              </div>
            </div>
          </div>

          {/* Cathode Ray Tubes & Mercury CFLs */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Radio className="w-4 h-4" />
              <span>2. CRT Monitors, Old Displays & Fluorescent CFL Lamps</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 font-bold block">DO:</span>
                <p className="text-zinc-300 leading-relaxed">
                  Handle the glass tube intact. Wear Class 3 heavy-duty nitrile gloves and eye protection. Dispatch directly to CPCB specialized mercury recapture centers.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-rose-400 font-bold block">DO NOT:</span>
                <p className="text-zinc-300 leading-relaxed">
                  Never shatter glass tubes in open backyards. Phosphor coatings and mercury vapors cause irreversible respiratory and neural toxicity.
                </p>
              </div>
            </div>
          </div>

          {/* Chemical Solvent Cans & Petrochemical Drums */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>3. Chemical Containers & Agro-Pesticide Cans</span>
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              Must undergo triple-rinsing protocol before being accepted as HDPE resin. Contaminated agrochemical containers must be routed directly to authorized incinerators/co-processing kilns.
            </div>
          </div>
        </div>

        {/* Emergency Assistance Hotline */}
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>National HazMat Response Emergency Desk:</span>
          </div>
          <span className="text-emerald-400 font-bold">1800-11-2244 (Toll-Free)</span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs font-mono transition-colors cursor-pointer"
          >
            Acknowledge & Close Safety Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
