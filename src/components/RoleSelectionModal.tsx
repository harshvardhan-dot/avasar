import React from 'react';
import { 
  Users, 
  Store, 
  Building2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';
import type { UserRole } from '../types/avasar';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
  const { language, role, setRole } = useApp();
  const t = getTranslation(language);

  if (!isOpen) return null;

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 p-5 w-full max-w-sm shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {t.selectRole}
            </h3>
            <span className="text-[11px] text-stone-500">
              Demo Authentication (Simulated)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear Notice */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-[11px] text-stone-600 leading-relaxed">
          Select either user persona to test the complete end-to-end handover flow. No real SMS OTP needed for this college demo.
        </div>

        {/* Roles list */}
        <div className="space-y-2.5">
          {/* Role 1: Collector */}
          <button
            onClick={() => handleSelectRole('collector')}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-98 ${
              role === 'collector'
                ? 'bg-emerald-50 border-[#176B45] shadow-xs'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="p-2 rounded-xl bg-[#176B45] text-white shrink-0 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900">
                  {t.roleCollector}
                </span>
                {role === 'collector' && (
                  <span className="text-[9px] font-bold bg-[#176B45] text-white px-1.5 py-0.2 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                {t.roleCollectorDesc}
              </p>
            </div>
          </button>

          {/* Role 2: Recycler */}
          <button
            onClick={() => handleSelectRole('recycler')}
            className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-98 ${
              role === 'recycler'
                ? 'bg-emerald-50 border-[#176B45] shadow-xs'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="p-2 rounded-xl bg-stone-800 text-white shrink-0 mt-0.5">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900">
                  {t.roleRecycler}
                </span>
                {role === 'recycler' && (
                  <span className="text-[9px] font-bold bg-stone-800 text-white px-1.5 py-0.2 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                {t.roleRecyclerDesc}
              </p>
            </div>
          </button>

          {/* Role 3: Citizen */}
          <button
            onClick={() => handleSelectRole('citizen')}
            className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-98 ${
              role === 'citizen'
                ? 'bg-emerald-50 border-[#176B45] shadow-xs'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="p-2 rounded-xl bg-teal-700 text-white shrink-0 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900">
                  Citizen / Producer (नागरिक)
                </span>
                {role === 'citizen' && (
                  <span className="text-[9px] font-bold bg-teal-700 text-white px-1.5 py-0.2 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                Track doorstep pickup schedules, 4-digit OTP, Green Credits & carbon footprint tracker.
              </p>
            </div>
          </button>

          {/* Role 4: Municipal ULB */}
          <button
            onClick={() => handleSelectRole('ulb')}
            className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-98 ${
              role === 'ulb'
                ? 'bg-emerald-50 border-[#176B45] shadow-xs'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="p-2 rounded-xl bg-blue-800 text-white shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900">
                  Municipal / ULB (नगर निगम)
                </span>
                {role === 'ulb' && (
                  <span className="text-[9px] font-bold bg-blue-800 text-white px-1.5 py-0.2 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                Ward diversion heatmaps, total tonnage processed vs landfilled & EPR compliance tracker.
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
