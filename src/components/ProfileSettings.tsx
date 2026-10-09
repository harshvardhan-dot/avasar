import React, { useState } from 'react';
import { 
  Volume2, 
  Check, 
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { WasteCategory } from '../types/avasar';

interface ProfileSettingsProps {
  onOpenRoleModal: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onOpenRoleModal }) => {
  const { 
    language, 
    setLanguage, 
    role, 
    materials, 
    updateMaterialPrice, 
    syncOfflineRecords, 
    speakText 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'admin'>('profile');
  const [editedPrices, setEditedPrices] = useState<{ [key in WasteCategory]?: number }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePriceChange = (id: WasteCategory, val: number) => {
    setEditedPrices((prev) => ({ ...prev, [id]: val }));
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(editedPrices).forEach(([id, price]) => {
      if (price !== undefined) {
        updateMaterialPrice(id as WasteCategory, price);
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* User Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#176B45] flex items-center justify-center font-bold text-lg border border-emerald-300">
            RK
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-stone-900">
              {role === 'collector' ? 'Rajesh Kumar (कबाड़ीवाला)' : 'EcoRev Facility Manager'}
            </h3>
            <span className="text-xs text-stone-500 block">
              {role === 'collector' ? 'Mobile Partner ID: KABADI-MUM-412' : 'License: CPCB-REG-2026-MH'}
            </span>
            <span className="inline-block mt-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
              Demo Active Profile
            </span>
          </div>

          <button
            onClick={onOpenRoleModal}
            className="text-xs font-semibold text-[#176B45] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            Switch Role
          </button>
        </div>
      </div>

      {/* Tabs: User Settings vs Demo Admin Config */}
      <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Preferences & Language
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'admin'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Admin Benchmark Config
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4 text-xs">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="font-bold text-stone-800 block">
              Display Language / भाषा चुनें:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-xl border font-bold text-center transition-all ${
                  language === 'en'
                    ? 'bg-emerald-50 border-[#176B45] text-[#176B45]'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`p-3 rounded-xl border font-bold text-center transition-all ${
                  language === 'hi'
                    ? 'bg-emerald-50 border-[#176B45] text-[#176B45]'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Voice Speech Assistant Test */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800 block">
                Voice Guidance (आवाज़ मार्गदर्शन)
              </span>
              <span className="text-[11px] text-stone-500">
                Uses built-in browser speech synthesis
              </span>
            </div>
            <button
              onClick={() => speakText('Audio assistant is active and operational.', 'ध्वनि मार्गदर्शन सक्रिय है।')}
              className="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 font-semibold text-stone-800 flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#176B45]" />
              <span>Test Audio</span>
            </button>
          </div>

          {/* Sync offline storage */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800 block">
                Local Storage & Offline Records
              </span>
              <span className="text-[11px] text-stone-500">
                Simulate syncing pending transactions to cloud
              </span>
            </div>
            <button
              onClick={syncOfflineRecords}
              className="py-1.5 px-3 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white font-bold flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Admin Demo Price Configuration */}
      {activeTab === 'admin' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
          <div className="border-b border-stone-100 pb-2">
            <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              PROTOTYPE DEMO CONFIGURATION
            </span>
            <h3 className="text-sm font-bold text-stone-900 mt-1">
              Indicative Sample Scrap Rates (₹ / kg)
            </h3>
            <p className="text-[11px] text-stone-500">
              Update sample material price benchmarks used in the Scanner and Estimator.
            </p>
          </div>

          <form onSubmit={handleSavePrices} className="space-y-3">
            {materials.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs gap-2">
                <span className="font-medium text-stone-800 flex-1">
                  {language === 'hi' ? m.nameHi : m.nameEn}:
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-stone-500 text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    defaultValue={m.defaultRatePerKg}
                    onChange={(e) => handlePriceChange(m.id, parseFloat(e.target.value))}
                    className="w-20 bg-stone-50 border border-stone-300 rounded-lg p-1.5 text-center font-bold text-stone-900 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-stone-500">/kg</span>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-3"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Benchmark Rates Updated!</span>
                </>
              ) : (
                <span>Save New Benchmark Rates</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
