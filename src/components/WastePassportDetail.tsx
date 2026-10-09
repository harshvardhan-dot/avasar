import React, { useState } from 'react';
import { 
  Printer, 
  Check, 
  ArrowLeft,
  Info,
  User,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';
import type { WastePassportRecord } from '../types/avasar';

interface WastePassportDetailProps {
  passportId: string;
  onBack: () => void;
}

export const WastePassportDetail: React.FC<WastePassportDetailProps> = ({ passportId, onBack }) => {
  const { language, transactions } = useApp();
  const t = getTranslation(language);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Look up passport record from LocalStorage via Context
  const record: WastePassportRecord | undefined = transactions.find(
    (tx) => tx.passportId === passportId
  );

  if (!record) {
    return (
      <div className="space-y-4 pb-20 p-4 bg-white rounded-2xl border border-stone-200 text-center">
        <p className="text-sm text-stone-600">Waste Passport not found.</p>
        <button
          onClick={onBack}
          className="text-xs text-[#176B45] font-bold underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePrintDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      window.print();
      setDownloadSuccess(false);
    }, 400);
  };

  // 6-step lifecycle stages
  const timelineStages = [
    {
      step: 1,
      title: t.step1,
      desc: `Material classified as ${record.materialName} (${record.confidenceScore}% conf).`,
      isDone: true,
      time: record.createdAt,
    },
    {
      step: 2,
      title: t.step2,
      desc: `Weight: ${record.weightKg} kg × ₹${record.ratePerKg}/kg = ₹${record.estimatedValue}.`,
      isDone: true,
      time: record.createdAt,
    },
    {
      step: 3,
      title: t.step3,
      desc: `Routed to ${record.recyclerName}.`,
      isDone: true,
      time: record.createdAt,
    },
    {
      step: 4,
      title: t.step4,
      desc: 'Collector recorded physical lot dispatch to recycler unit.',
      isDone: record.handoverStatus !== 'REQUESTED',
      time: record.handoverStatus !== 'REQUESTED' ? record.createdAt : 'Pending Handover',
    },
    {
      step: 5,
      title: t.step5,
      desc: 'Authorised recycler confirmed weighbridge reading & material quality.',
      isDone: record.handoverStatus === 'CONFIRMED',
      time: record.handoverStatus === 'CONFIRMED' ? 'Confirmed at Gate' : 'Awaiting Confirmation',
    },
    {
      step: 6,
      title: t.step6,
      desc: `Instant digital settlement of ₹${record.paidAmount || record.estimatedValue} via ${record.paymentMode || 'UPI / IMPS'}.`,
      isDone: record.paymentStatus === 'PAID',
      time: record.paymentDate || 'Pending Payment',
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 py-1.5 px-3 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handlePrintDownload}
          className="flex items-center gap-1.5 text-xs font-bold text-[#176B45] hover:text-white hover:bg-[#176B45] bg-emerald-50 border border-emerald-300 py-1.5 px-3 rounded-xl transition-all cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Receipt Ready!</span>
            </>
          ) : (
            <>
              <Printer className="w-3.5 h-3.5" />
              <span>{t.downloadReceipt}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Passport Docket Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden p-4 space-y-4">
        {/* Title & Passport ID */}
        <div className="border-b border-stone-100 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-[#176B45] text-white px-2 py-0.5 rounded-md">
                DIGITAL TRACEABILITY DOCKET
              </span>
              {!record.synced && (
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                  Offline Record (Pending Cloud Sync)
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight mt-1">
              Passport ID: {record.passportId}
            </h2>
            <span className="text-xs text-stone-500">
              Created: {record.createdAt}
            </span>
          </div>

          <div className="text-right">
            <span
              className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
                record.paymentStatus === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : record.handoverStatus === 'CONFIRMED'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              {record.paymentStatus === 'PAID' ? 'SETTLED & PAID' : record.handoverStatus}
            </span>
          </div>
        </div>

        {/* Clear non-blockchain explanation banner */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#176B45] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-stone-800 font-semibold block">
              Traceability System Notice:
            </strong>
            {t.blockchainNotice}
          </div>
        </div>

        {/* Material Photograph & Core Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-4 aspect-4/3 rounded-xl overflow-hidden border border-stone-200">
            <img
              src={record.photoUrl}
              alt={record.materialName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="sm:col-span-8 space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-stone-500 block">Category:</span>
                <span className="font-bold text-stone-900">{record.materialName}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block">Verified Weight:</span>
                <span className="font-bold text-[#176B45] text-sm tabular-nums">
                  {record.weightKg} kg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block">Indicative Rate:</span>
                <span className="font-semibold text-stone-900">
                  ₹{record.ratePerKg} / kg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block">Total Value:</span>
                <span className="font-bold text-stone-900 text-sm tabular-nums">
                  ₹{record.paidAmount || record.estimatedValue}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Collector: <strong>{record.collectorName}</strong> ({record.collectorPhone})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Selected Recycler: <strong>{record.recyclerName}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Stage Visual Timeline */}
        <div className="pt-2 border-t border-stone-100 space-y-3">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            {t.handoverTimeline}
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {timelineStages.map((stage) => (
              <div key={stage.step} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[20px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    stage.isDone
                      ? 'bg-[#176B45] text-white shadow-xs'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {stage.isDone ? '✓' : stage.step}
                </div>

                <div className={`p-2.5 rounded-xl border text-xs ${
                  stage.isDone
                    ? 'bg-emerald-50/50 border-emerald-200/80 text-stone-800'
                    : 'bg-stone-50/60 border-stone-200/60 text-stone-500'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-stone-900">
                      Step {stage.step}: {stage.title}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {stage.time}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
