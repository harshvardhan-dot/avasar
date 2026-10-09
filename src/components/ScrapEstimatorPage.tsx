import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';
import type { WasteCategory } from '../types/avasar';

interface ScrapEstimatorPageProps {
  onSelectCategoryForScan: (cat: WasteCategory) => void;
}

export const ScrapEstimatorPage: React.FC<ScrapEstimatorPageProps> = ({ onSelectCategoryForScan }) => {
  const { language, materials } = useApp();
  const t = getTranslation(language);

  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('PCB');
  const [weightKg, setWeightKg] = useState<number>(10);

  const activeMaterial = materials.find((m) => m.id === selectedCategory) || materials[0];
  const ratePerKg = activeMaterial.defaultRatePerKg;
  const estimatedTotal = Number((weightKg * ratePerKg).toFixed(0));

  return (
    <div className="space-y-4 pb-20">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#176B45]" />
          <span>{t.actionEstimate}</span>
        </h2>
        <p className="text-xs text-stone-600">
          Calculate scrap earnings using transparent indicative sample benchmark prices.
        </p>
      </div>

      {/* Main Calculation Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
        {/* Waste Category Selector */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 block">
            Select E-Waste Category:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {materials.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedCategory(m.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedCategory === m.id
                    ? 'bg-emerald-50 border-[#176B45] text-[#176B45] shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-bold leading-tight">
                  {language === 'hi' ? m.nameHi : m.nameEn}
                </div>
                <div className="text-[11px] font-semibold text-stone-500 mt-1">
                  ₹{m.defaultRatePerKg} / kg
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Weight in kg */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
            <span>{t.enterWeight}:</span>
            <span className="text-[11px] font-bold text-[#176B45]">
              {weightKg} Kilograms
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="200"
              step="1"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value))}
              className="w-full accent-[#176B45] h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(0.1, parseFloat(e.target.value) || 0))}
              className="w-20 bg-stone-50 border border-stone-300 rounded-xl p-2 text-center text-sm font-bold text-stone-900 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="bg-stone-50 rounded-xl border border-stone-200/90 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Material Category:</span>
            <span className="font-semibold text-stone-900">
              {language === 'hi' ? activeMaterial.nameHi : activeMaterial.nameEn}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Indicative Rate Benchmark:</span>
            <span className="font-bold text-stone-900">
              ₹{ratePerKg} / kg
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Batch Weight:</span>
            <span className="font-bold text-stone-900">
              {weightKg} kg
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                Estimated Net Scrap Value:
              </span>
              <span className="text-[10px] text-stone-500">
                Formula: {weightKg} kg × ₹{ratePerKg}/kg
              </span>
            </div>
            <span className="text-2xl font-black text-[#176B45] tabular-nums">
              ₹{estimatedTotal}
            </span>
          </div>
        </div>

        {/* Description & Hazard info */}
        <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 space-y-1">
          <span className="font-semibold block text-stone-900">
            Material Specification:
          </span>
          <p className="text-[11px] leading-relaxed">
            {language === 'hi' ? activeMaterial.descriptionHi : activeMaterial.descriptionEn}
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-[10px] font-semibold text-stone-600">
            <span>Safety Hazard Level:</span>
            <span className={`px-1.5 py-0.2 rounded ${
              activeMaterial.safetyHazard === 'HIGH'
                ? 'bg-rose-100 text-rose-800'
                : activeMaterial.safetyHazard === 'MEDIUM'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {activeMaterial.safetyHazard}
            </span>
          </div>
        </div>

        {/* Prototype Disclaimer */}
        <p className="text-[10px] text-stone-500 italic leading-relaxed">
          Disclaimer: All indicative sample prices are configurable for prototype demonstrations and must not be represented as real-time certified market exchange prices.
        </p>

        {/* Quick button to jump to scanner */}
        <button
          onClick={() => onSelectCategoryForScan(selectedCategory)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <span>Take a Photo / Scan this Category</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
