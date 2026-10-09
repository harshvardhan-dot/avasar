import React, { useState } from 'react';
import { 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  FileText, 
  TrendingUp, 
  RotateCw,
  Info
} from 'lucide-react';
import type { DiagnosticPreset, Language } from '../types';
import { DIAGNOSTIC_PRESETS } from '../data/mockData';
import { translations } from '../utils/i18n';

interface WasteScannerProps {
  currentLang: Language;
  onSchedulePickup: (preset: DiagnosticPreset) => void;
  onGeneratePassport: (preset: DiagnosticPreset) => void;
}

export const WasteScanner: React.FC<WasteScannerProps> = ({
  currentLang,
  onSchedulePickup,
  onGeneratePassport,
}) => {
  const t = translations[currentLang];
  const [selectedPreset, setSelectedPreset] = useState<DiagnosticPreset>(DIAGNOSTIC_PRESETS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(4); // 0: Optical, 1: Segment, 2: Polymer, 3: Contamination, 4: Complete
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleSelectPreset = (preset: DiagnosticPreset) => {
    setSelectedPreset(preset);
    setCustomImage(null);
    triggerScanAnimation();
  };

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScanStep(0);
    setTimeout(() => setScanStep(1), 350);
    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1050);
    setTimeout(() => {
      setScanStep(4);
      setIsScanning(false);
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCustomImage(uploadEvent.target?.result as string);
        triggerScanAnimation();
      };
      reader.readAsDataURL(file);
    }
  };

  const activeImage = customImage || selectedPreset.image;

  return (
    <div className="space-y-6">
      {/* Header section with telemetry notes */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold uppercase">
              Optical Diagnostic Module
            </span>
            <span className="text-zinc-500 text-xs font-mono">MODEL: RESNET-NIR-V3</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            {t.scannerTitle}
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl">
            {t.scannerSubtitle}
          </p>
        </div>

        {/* Demo Presets Quick Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs font-mono text-zinc-500 whitespace-nowrap">
            Diagnostic Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DIAGNOSTIC_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 ${
                  selectedPreset.id === preset.id && !customImage
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/50 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Left Optical Reticle, Right Diagnostics & Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Industrial Camera Feed & Reticle (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
            {/* Reticle Top Info HUD */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-zinc-950/90 to-transparent backdrop-blur-[2px] text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-zinc-200 font-semibold">{t.opticalDiagnosticReticle}</span>
                <span className="text-zinc-600">|</span>
                <span className="text-emerald-400">SENSING 850nm-1700nm</span>
              </div>
              <div className="flex items-center gap-3">
                <span>FPS: 60.0</span>
                <span>EXP: 1/250s</span>
                <button 
                  onClick={triggerScanAnimation}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  title="Re-run Diagnostic Scan"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Image Canvas with Precision Crosshairs and Bounding Boxes */}
            <div className="relative aspect-4/3 w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
              <img
                src={activeImage}
                alt={selectedPreset.name}
                className="w-full h-full object-cover filter contrast-[1.05] brightness-95"
              />

              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Scanning Laser Line */}
              {isScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-line z-30"></div>
              )}

              {/* Precision Reticle Overlay in the center */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-48 h-48 border border-emerald-500/30 rounded-lg">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
                  {/* Center reticle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 border border-emerald-400/60 rounded-full"></div>
                    <div className="absolute w-8 h-[1px] bg-emerald-400/40"></div>
                    <div className="absolute h-8 w-[1px] bg-emerald-400/40"></div>
                  </div>
                </div>
              </div>

              {/* Live Bounding Boxes */}
              {!isScanning && selectedPreset.segmentationBBoxes.map((box, idx) => (
                <div
                  key={idx}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                  }}
                  className="absolute border border-emerald-400/80 bg-emerald-500/10 rounded-sm pointer-events-none transition-all duration-300"
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-zinc-950/90 border border-emerald-500/40 rounded text-[9px] font-mono text-emerald-300 whitespace-nowrap flex items-center gap-1 shadow-md">
                    <span>{box.label}</span>
                    <span className="text-zinc-500">{(box.conf * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}

              {/* Reticle Bottom Telemetry Footer */}
              <div className="absolute bottom-0 inset-x-0 z-20 px-4 py-2 bg-zinc-950/90 backdrop-blur-sm border-t border-zinc-800/80 text-[11px] font-mono flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">DETECTED RESIN:</span>
                  <span className="text-emerald-400 font-semibold">{selectedPreset.polymerAlloy}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500">RESIN CODE:</span>
                  <span className="text-zinc-200">{selectedPreset.resinCode}</span>
                </div>
              </div>
            </div>

            {/* Reticle Upload or Camera Switcher Bar */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-md font-mono text-zinc-200 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Upload Custom Scrap Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {customImage && (
                  <button
                    onClick={() => setCustomImage(null)}
                    className="text-xs font-mono text-zinc-500 hover:text-zinc-300 underline"
                  >
                    Reset to Preset
                  </button>
                )}
              </div>

              <div className="text-[11px] font-mono text-zinc-500">
                Est. Net Weight: <span className="text-zinc-200 font-semibold">{selectedPreset.estimatedWeightKg} kg</span>
              </div>
            </div>
          </div>

          {/* Optical Diagnostic Telemetry Timeline */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Telemetry Pipeline Execution
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                LATENCY: 124ms · EDGE INFERENCE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className={`p-2 rounded border ${scanStep >= 1 ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950/50'}`}>
                <div className="text-[10px] text-zinc-500">STAGE 1</div>
                <div className="font-medium text-zinc-200">Segment Detect</div>
                <div className="text-[10px] text-emerald-400 mt-1">✓ Complete (3 bboxes)</div>
              </div>
              <div className={`p-2 rounded border ${scanStep >= 2 ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950/50'}`}>
                <div className="text-[10px] text-zinc-500">STAGE 2</div>
                <div className="font-medium text-zinc-200">Spectrometry</div>
                <div className="text-[10px] text-emerald-400 mt-1">✓ 94.6% Confidence</div>
              </div>
              <div className={`p-2 rounded border ${scanStep >= 3 ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950/50'}`}>
                <div className="text-[10px] text-zinc-500">STAGE 3</div>
                <div className="font-medium text-zinc-200">Purity Analysis</div>
                <div className="text-[10px] text-emerald-400 mt-1">✓ 5.4% Impurities</div>
              </div>
              <div className={`p-2 rounded border ${scanStep >= 4 ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950/50'}`}>
                <div className="text-[10px] text-zinc-500">STAGE 4</div>
                <div className="font-medium text-zinc-200">Yield Valuation</div>
                <div className="text-[10px] text-emerald-400 mt-1">✓ Rate ₹{selectedPreset.grossMarketRatePerKg}/kg</div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 italic">
              "{selectedPreset.opticalSummary}"
            </p>
          </div>
        </div>

        {/* Right: Valuation Breakdown & Action Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Diagnostic Metrics Card */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Material Classification
                </span>
                <h3 className="text-lg font-bold text-zinc-100 mt-0.5">
                  {selectedPreset.name}
                </h3>
                <span className="text-xs text-zinc-400">
                  {selectedPreset.subType}
                </span>
              </div>

              {/* Hazard Indicator Badge */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                  selectedPreset.hazardLevel === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : selectedPreset.hazardLevel === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {selectedPreset.hazardLevel === 'CRITICAL' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {selectedPreset.hazardLevel === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {selectedPreset.hazardLevel === 'NONE' && <CheckCircle className="w-3.5 h-3.5" />}
                  HAZARD: {selectedPreset.hazardLevel}
                </span>
              </div>
            </div>

            {/* Purity & Contamination Meters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-400">{t.purityScore}</span>
                  <span className="text-emerald-400 font-bold">{selectedPreset.purityScore}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${selectedPreset.purityScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-400">{t.contaminationIndex}</span>
                  <span className={`font-bold ${selectedPreset.contaminationScore > 10 ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {selectedPreset.contaminationScore}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${selectedPreset.contaminationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Hazard Safety Advisory if applicable */}
            {selectedPreset.hazardNotes && (
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-zinc-200">Safety Protocol: </span>
                  {selectedPreset.hazardNotes}
                </div>
              </div>
            )}

            {/* Formula Valuation Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                    Net Recovery Valuation Formula
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  REAL-TIME COMMODITY FEED
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Gross Market Value ({selectedPreset.estimatedWeightKg}kg × ₹{selectedPreset.grossMarketRatePerKg}/kg):</span>
                  <span className="font-semibold tabular-nums text-zinc-100">
                    + ₹{selectedPreset.grossValue.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span>- Logistics & Local Fleet:</span>
                  </span>
                  <span className="tabular-nums text-rose-400">
                    - ₹{selectedPreset.logisticsDeduction.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-400">
                  <span>- Pre-sorting & Washing Allowance:</span>
                  <span className="tabular-nums text-rose-400">
                    - ₹{selectedPreset.preProcessingDeduction.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                  <div>
                    <div className="text-sm font-bold text-emerald-400">
                      {t.netYieldPayout}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Guaranteed spot payout via UPI / IMPS escrow
                    </div>
                  </div>
                  <div className="text-xl font-mono font-black text-emerald-400 tabular-nums">
                    ₹{selectedPreset.netYieldPayout.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Carbon Offset metric */}
              <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Lifecycle CO₂e Avoided:
                </span>
                <span className="font-bold text-zinc-200">
                  {selectedPreset.carbonOffsetKg} kg CO₂e
                </span>
              </div>
            </div>

            {/* Recommended Treatment */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                Prescribed Circular Pathway:
              </span>
              <span className="text-zinc-300 font-medium">
                {selectedPreset.recommendedTreatment}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onSchedulePickup(selectedPreset)}
                className="w-full py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.schedulePickupBtn}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onGeneratePassport(selectedPreset)}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] border border-zinc-700/80 text-zinc-200 font-mono text-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-zinc-400" />
                <span>{t.generatePassportBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
