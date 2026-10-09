import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Clock, 
  MapPin, 
  Lock,
  Copy,
  Check
} from 'lucide-react';
import type { Language, WasteBatchPassport } from '../types';
import { INITIAL_BATCH_PASSPORT } from '../data/mockData';
import { translations } from '../utils/i18n';

interface WastePassportProps {
  currentLang: Language;
  passportData?: WasteBatchPassport;
}

export const WastePassportView: React.FC<WastePassportProps> = ({
  currentLang,
  passportData = INITIAL_BATCH_PASSPORT,
}) => {
  const t = translations[currentLang];
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(passportData.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadCertificate = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Compliance Standard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold uppercase">
              Verifiable Custody Ledger
            </span>
            <span className="text-zinc-500 text-xs font-mono">STANDARDS: ISO 14064 / CPCB EPR SCHEDULE II</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            {t.passportTitle}
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl">
            {t.passportSubtitle}
          </p>
        </div>

        {/* Certificate Export Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCertificate}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold text-xs font-mono transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Certificate Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t.downloadPdf}</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] border border-zinc-800 text-zinc-300 font-mono text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">{t.printPassport}</span>
          </button>
        </div>
      </div>

      {/* Top Passport Dossier Card with QR and Cryptographic Hash */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle Watermark Badge */}
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none select-none text-right font-mono font-black text-6xl text-white">
          AVASAR
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* QR Code Container */}
          <div className="md:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center space-y-3">
            <div className="p-3 bg-white rounded-lg shadow-inner">
              {/* High-contrast Mock QR rendering */}
              <div className="w-32 h-32 bg-white flex flex-col justify-between p-1">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-black border-4 border-white ring-2 ring-black"></div>
                  <div className="w-4 h-4 bg-black"></div>
                  <div className="w-8 h-8 bg-black border-4 border-white ring-2 ring-black"></div>
                </div>
                <div className="flex justify-around items-center">
                  <div className="w-3 h-3 bg-black"></div>
                  <div className="w-6 h-6 bg-emerald-600 rounded-xs flex items-center justify-center text-[8px] text-white font-black font-mono">
                    AVS
                  </div>
                  <div className="w-3 h-3 bg-black"></div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 bg-black border-4 border-white ring-2 ring-black"></div>
                  <div className="w-4 h-2 bg-black"></div>
                  <div className="w-4 h-4 bg-black"></div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 block">
                AUDIT PASSPORT ID
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {passportData.batchId}
              </span>
            </div>
          </div>

          {/* Dossier Information Grid */}
          <div className="md:col-span-9 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">Material Grade</span>
                <span className="text-zinc-100 font-bold text-sm">{passportData.grade}</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">{passportData.materialType}</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">{t.verifiedWeight}</span>
                <span className="text-emerald-400 font-bold text-sm tabular-nums">
                  {passportData.certifiedWeightKg} kg (Net)
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Calibrated BT Loadcell</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">Carbon Offset Metric</span>
                <span className="text-zinc-100 font-bold text-sm tabular-nums">
                  {passportData.co2OffsetKg} kg CO₂e
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Verified Avoidance</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Signature */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.batchHash}</span>
                </span>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Signature</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-[11px] text-zinc-300 font-mono break-all bg-zinc-950 p-2 rounded border border-zinc-800/80">
                {passportData.sha256Hash}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500 pt-1">
              <span>Producer Context: {passportData.producerType}</span>
              <span>Issued: {passportData.issuedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Stage Chain-of-Custody Timeline */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              6-Stage Cryptographic Custody Trail
            </h3>
            <p className="text-xs text-zinc-400">
              Multi-signature validation at every transfer milestone with physical geolocation stamps.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
            Current Stage: 5 of 6 (Granulation)
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-800">
          {passportData.stages.map((stage) => {
            const isCompleted = stage.status === 'COMPLETED';
            const isInTransit = stage.status === 'IN_TRANSIT';

            return (
              <div key={stage.step} className="relative group">
                {/* Node Milestone Icon */}
                <div
                  className={`absolute -left-[30px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-[11px] font-mono font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : isInTransit
                      ? 'bg-zinc-900 border-emerald-500 text-emerald-400 animate-pulse'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {isCompleted ? '✓' : stage.step}
                </div>

                {/* Stage Content Card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'border-zinc-800 bg-zinc-900/60'
                    : isInTransit
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-zinc-900 bg-zinc-950/40 opacity-70'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-200">
                        Stage {stage.step}: {stage.title}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isInTransit
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                      }`}>
                        {stage.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{stage.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {stage.details}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{stage.location}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Handler: </span>
                      <span className="text-zinc-300 font-medium">{stage.actor}</span>
                    </div>
                    {stage.verifiedWeightKg && (
                      <div>
                        <span className="text-zinc-500">Scale Weight: </span>
                        <span className="text-emerald-400 font-semibold">{stage.verifiedWeightKg} kg</span>
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
  );
};
