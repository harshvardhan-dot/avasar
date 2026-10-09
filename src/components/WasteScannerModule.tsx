import React, { useState } from 'react';
import { 
  Camera, 
  RotateCw, 
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';
import { SAMPLE_SCAN_PRESETS } from '../data/avasarData';
import type { WasteCategory } from '../types/avasar';

interface WasteScannerModuleProps {
  onProceedToRecyclers: (scanResult: {
    category: WasteCategory;
    materialName: string;
    weightKg: number;
    photoUrl: string;
    ratePerKg: number;
    estimatedValue: number;
    confidence: number;
  }) => void;
}

export const WasteScannerModule: React.FC<WasteScannerModuleProps> = ({ onProceedToRecyclers }) => {
  const { language, materials, speakText } = useApp();
  const t = getTranslation(language);

  // Default preset is first sample PCB
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectedCategory, setDetectedCategory] = useState<WasteCategory>('PCB');
  const [confidence, setConfidence] = useState<number>(93);
  const [weightKg, setWeightKg] = useState<number>(5.0);

  const activePhoto = customPhoto || SAMPLE_SCAN_PRESETS[selectedPresetIndex].image;

  // Find corresponding material config for rate calculation
  const currentMaterial = materials.find((m) => m.id === detectedCategory) || materials[0];
  const ratePerKg = currentMaterial.defaultRatePerKg;
  const estimatedTotal = Number((weightKg * ratePerKg).toFixed(0));

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
        // Default classification for user custom upload
        runSimulatedScan('PHONES', 89, 3.0);
      };
      reader.readAsDataURL(file);
    }
  };

  const runSimulatedScan = (cat: WasteCategory, conf: number, sampleWt: number) => {
    setIsScanning(true);
    setTimeout(() => {
      setDetectedCategory(cat);
      setConfidence(conf);
      setWeightKg(sampleWt);
      setIsScanning(false);
      speakText(
        `Scanned ${cat}. Estimated weight ${sampleWt} kilograms. Value is approximately ${sampleWt * ratePerKg} rupees.`,
        `पहचाना गया कचरा: ${cat}। वजन: ${sampleWt} किलो। अनुमानित मूल्य: ${sampleWt * ratePerKg} रुपये।`
      );
    }, 750);
  };

  const handleCreatePassport = () => {
    onProceedToRecyclers({
      category: detectedCategory,
      materialName: language === 'hi' ? currentMaterial.nameHi : currentMaterial.nameEn,
      weightKg: Number(weightKg),
      photoUrl: activePhoto,
      ratePerKg,
      estimatedValue: estimatedTotal,
      confidence,
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
          {t.scanTitle}
        </h2>
        <p className="text-xs text-stone-600">
          {t.scanSubtitle}
        </p>
      </div>

      {/* Clear Anti-AI-Slop Simulation Disclaimer */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2 shadow-xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11px]">
          <strong className="font-semibold block text-amber-950">
            {language === 'hi' ? 'नमूना वर्गीकरण (Simulated Demo)' : 'Educational Prototype Notice:'}
          </strong>
          {t.simulatedDisclaimer}
        </div>
      </div>

      {/* Camera / Photo Canvas Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
        {/* Reticle Viewport */}
        <div className="relative aspect-4/3 w-full bg-stone-900 flex items-center justify-center overflow-hidden">
          <img
            src={activePhoto}
            alt="Scrap item"
            className="w-full h-full object-cover filter contrast-[1.02]"
          />

          {/* Precision Optical Scanner Reticle Crosshairs */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-44 h-44 border border-emerald-400/60 rounded-xl">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400"></div>
              {/* Center point */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-emerald-400/80 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Laser Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-line z-20"></div>
          )}

          {/* Classification Overlay Pill */}
          <div className="absolute bottom-2 inset-x-2 z-20 bg-stone-900/90 backdrop-blur-xs text-white p-2 rounded-lg text-xs flex items-center justify-between border border-white/10 font-sans">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono block">
                {isScanning ? 'ANALYZING SPECTRUM...' : 'SIMULATED DETECTION:'}
              </span>
              <span className="font-bold text-xs">
                {language === 'hi' ? currentMaterial.nameHi : currentMaterial.nameEn}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 font-mono block">CONFIDENCE</span>
              <span className="font-bold text-emerald-400 text-xs">
                {confidence}% {t.simulatedConfidence}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Buttons & Sample Selector */}
        <div className="p-3 pt-0 space-y-3">
          <div className="flex gap-2">
            <label className="flex-1 py-2.5 px-3 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all">
              <Camera className="w-4 h-4" />
              <span>{t.uploadImage}</span>
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
              className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-stone-200 active:scale-95 transition-all"
              title="Re-run diagnostic analysis"
            >
              <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-emerald-700' : ''}`} />
              <span className="hidden sm:inline">Rescan</span>
            </button>
          </div>

          {/* Sample preset buttons */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
              {t.choosePreset}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_SCAN_PRESETS.map((preset, idx) => (
                <button
                  key={preset.category}
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    selectedPresetIndex === idx && !customPhoto
                      ? 'bg-emerald-50 text-[#176B45] border-[#176B45] font-bold shadow-xs'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Correction & Weight Formulation Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
        {/* Category correction dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
            <span>{t.correctCategory}</span>
            <span className="text-[10px] text-stone-400 font-normal">
              Collector Overrule
            </span>
          </label>
          <select
            value={detectedCategory}
            onChange={(e) => setDetectedCategory(e.target.value as WasteCategory)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 font-medium focus:outline-hidden focus:border-emerald-600"
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {language === 'hi' ? m.nameHi : m.nameEn} (₹{m.defaultRatePerKg}/kg)
              </option>
            ))}
          </select>
        </div>

        {/* Enter Weight Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
            <span>{t.enterWeight}</span>
            <span className="text-[10px] text-emerald-700 font-medium">
              Calibrated Scale Input
            </span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 pl-9 text-base font-bold text-stone-900 focus:outline-hidden focus:border-emerald-600 tabular-nums"
              />
              <Scale className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-3 rounded-xl border border-stone-200">
              KG
            </span>
          </div>
        </div>

        {/* Valuation Formula Calculation Box */}
        <div className="bg-stone-50 rounded-xl border border-stone-200/80 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>{t.indicativeRate}:</span>
            <span className="font-bold text-stone-900 tabular-nums">
              ₹{ratePerKg} / kg
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>Weight × Benchmark Rate:</span>
            <span className="font-mono text-stone-700">
              {weightKg} kg × ₹{ratePerKg}
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                {t.estimatedValue}
              </span>
              <span className="text-[10px] text-stone-500">
                Formula: Weight × Rate
              </span>
            </div>
            <span className="text-2xl font-black text-[#176B45] tabular-nums">
              ₹{estimatedTotal}
            </span>
          </div>
        </div>

        {/* Clear Disclaimer */}
        <p className="text-[10px] text-stone-500 leading-relaxed italic">
          {t.estimateDisclaimer}
        </p>

        {/* Action Button: Proceed to Recycler Matching */}
        <button
          onClick={handleCreatePassport}
          className="w-full py-3 px-4 rounded-xl bg-[#176B45] hover:bg-[#125436] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <span>{t.createPassportBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
