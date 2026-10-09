import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  IndianRupee,
  Users,
  Search,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import type { WastePassportRecord } from '../types/avasar';

interface RecyclerPortalProps {
  onOpenPassport: (passportId: string) => void;
}

export const RecyclerPortal: React.FC<RecyclerPortalProps> = ({ onOpenPassport }) => {
  const { transactions, updateTransactionStatus, speakText } = useApp();

  const [activePaymentModalTx, setActivePaymentModalTx] = useState<WastePassportRecord | null>(null);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'BANK_TRANSFER'>('UPI');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Transactions metrics for this demo recycler
  const pendingLots = transactions.filter((tx) => tx.handoverStatus !== 'CONFIRMED' && tx.handoverStatus !== 'REJECTED');
  const confirmedLots = transactions.filter((tx) => tx.handoverStatus === 'CONFIRMED');
  const totalWeightProcessed = confirmedLots.reduce((sum, tx) => sum + tx.weightKg, 0);
  const totalPaidOut = confirmedLots
    .filter((tx) => tx.paymentStatus === 'PAID')
    .reduce((sum, tx) => sum + (tx.paidAmount || tx.estimatedValue), 0);

  // Daily Ledger summary by date
  const todayTransactions = transactions.filter((tx) => tx.createdAt.includes('Today') || tx.createdAt.includes('2026-10-10'));
  const todayWeightKg = todayTransactions.reduce((sum, tx) => sum + tx.weightKg, 0);
  const todaySpend = todayTransactions.reduce((sum, tx) => sum + (tx.paidAmount || tx.estimatedValue), 0);

  // Material summary breakdown
  const materialBreakdown = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.weightKg;
    return acc;
  }, {} as Record<string, number>);

  const handleConfirmHandover = (passportId: string) => {
    updateTransactionStatus(passportId, 'CONFIRMED');
    speakText(
      `Handover for lot ${passportId} confirmed on digital weighbridge.`,
      `लॉट ${passportId} का डिजिटल वजन कन्फर्म किया गया।`
    );
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentModalTx) return;

    updateTransactionStatus(
      activePaymentModalTx.passportId,
      'CONFIRMED',
      'PAID',
      activePaymentModalTx.estimatedValue
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // safe fallback
    }

    speakText(
      `Payment of Rupees ${activePaymentModalTx.estimatedValue} disbursed to ${activePaymentModalTx.collectorName} via ${paymentMode}.`,
      `रुपये ${activePaymentModalTx.estimatedValue} का भुगतान ${activePaymentModalTx.collectorName} को ${paymentMode} द्वारा किया गया।`
    );

    setActivePaymentModalTx(null);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.passportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.collectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.materialName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || tx.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5 pb-20">
      {/* Recycler Facility Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-zinc-900 to-stone-800 text-white p-5 rounded-3xl shadow-lg border border-stone-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold bg-emerald-700/80 px-2.5 py-0.5 rounded-full text-emerald-100 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            CPCB AUTHORIZED RECYCLER FACILITY
          </span>
          <span className="text-[11px] text-stone-400 font-mono">Reg: CPCB/EW-REG/MH/2024/0081</span>
        </div>
        <h2 className="text-xl font-black tracking-tight">
          EcoRev Green Metallurgy Ltd. (Turbhe MIDC)
        </h2>
        <p className="text-xs text-stone-300 leading-relaxed max-w-xl">
          Track incoming e-waste lots, monitor kilograms delivered by verified Kabadiwalas, verify spectroscopy purity grades, and record daily procurement spending.
        </p>
      </div>

      {/* Daily Procurement & Spend Ledger (User Requested) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-[#176B45]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Daily Procurement & Payout Ledger
              </h3>
              <p className="text-[11px] text-stone-500">
                Daily waste tonnage intake and actual procurement money spent.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
            LIVE ESCROW
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[10px] text-stone-500 font-medium block">Today's Intake</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-stone-900 tabular-nums">{todayWeightKg.toFixed(1)}</span>
              <span className="text-xs font-bold text-stone-500">kg</span>
            </div>
            <span className="text-[10px] text-emerald-700 block font-medium">
              {pendingLots.length > 0 ? `${pendingLots.length} pending intake verify` : 'All lots inspected'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[10px] text-stone-500 font-medium block">Today's Money Spent</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#176B45] tabular-nums">₹{todaySpend.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[10px] text-stone-400 block font-mono">Direct UPI / Bank Transfer</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[10px] text-stone-500 font-medium block">Lifetime Received</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-stone-900 tabular-nums">{totalWeightProcessed.toFixed(1)}</span>
              <span className="text-xs font-bold text-stone-500">kg</span>
            </div>
            <span className="text-[10px] text-emerald-700 block font-medium">Secondary Metallurgy Intake</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[10px] text-stone-500 font-medium block">Total Payouts Disbursed</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-700 tabular-nums">₹{totalPaidOut.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[10px] text-stone-400 block font-mono">100% Tax Compliant</span>
          </div>
        </div>
      </div>

      {/* E-Waste Kilograms Breakdown by Material (User Requested) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              E-Waste Category Stock & Kilograms
            </h3>
            <p className="text-[11px] text-stone-500">
              Total volume stored and pre-processed in recovery silos.
            </p>
          </div>
          <span className="text-[10px] font-mono text-stone-500">
            {Object.keys(materialBreakdown).length} Categories Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'PCB', label: 'Circuit Boards (PCB)', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
            { id: 'BATTERIES', label: 'Li-Ion Cells', color: 'bg-amber-50 text-amber-900 border-amber-200' },
            { id: 'CABLES', label: 'Copper Wires', color: 'bg-teal-50 text-teal-900 border-teal-200' },
            { id: 'PHONES', label: 'Smartphones', color: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            { id: 'LAPTOPS', label: 'Laptops', color: 'bg-purple-50 text-purple-900 border-purple-200' },
            { id: 'CRT', label: 'CRT Displays', color: 'bg-stone-100 text-stone-900 border-stone-300' },
          ].map((cat) => {
            const kg = materialBreakdown[cat.id] || 0;
            return (
              <div key={cat.id} className={`p-3 rounded-2xl border ${cat.color} space-y-0.5`}>
                <span className="text-[10px] font-semibold block line-clamp-1">{cat.label}</span>
                <span className="text-lg font-black block tabular-nums">{kg.toFixed(1)} kg</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time E-Waste Batches with Kabadiwalas Details (User Requested) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#176B45]" />
              <span>Incoming Feedstock & Kabadiwala Batches</span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Review scrap consignments, recorded kilograms, kabadiwala identity, and settle payments.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs">
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search kabadiwala / lot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-stone-900 focus:outline-hidden w-36 text-[11px]"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-[11px] text-stone-800 focus:outline-hidden"
            >
              <option value="ALL">All Scrap</option>
              <option value="PCB">PCB</option>
              <option value="BATTERIES">Batteries</option>
              <option value="CABLES">Cables</option>
            </select>
          </div>
        </div>

        {/* Lots List */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.passportId}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                tx.paymentStatus === 'PAID'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : tx.handoverStatus === 'CONFIRMED'
                  ? 'border-blue-200 bg-blue-50/20'
                  : 'border-stone-200 bg-white hover:border-emerald-500/40'
              }`}
            >
              {/* Item info header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={tx.photoUrl}
                    alt={tx.materialName}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-stone-900">
                        {tx.passportId}
                      </span>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full tabular-nums">
                        {tx.weightKg} kg
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        Rate: ₹{tx.ratePerKg}/kg
                      </span>
                    </div>
                    <span className="text-xs text-stone-800 font-bold block mt-0.5">
                      {tx.materialName}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-0.5">
                      <span className="font-semibold text-emerald-900">Kabadiwala:</span>
                      <span>{tx.collectorName}</span>
                      <span className="text-stone-400 font-mono">({tx.collectorPhone})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <div>
                    <span className="text-base font-black text-[#176B45] tabular-nums block">
                      ₹{tx.paidAmount || tx.estimatedValue}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {tx.createdAt}
                    </span>
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1 ${
                      tx.paymentStatus === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : tx.handoverStatus === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {tx.paymentStatus === 'PAID' ? '✓ SETTLED & PAID' : tx.handoverStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Confirm Receipt & Record Payment */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => onOpenPassport(tx.passportId)}
                  className="text-xs text-[#176B45] font-semibold underline hover:text-[#125436]"
                >
                  View Cryptographic Waste Passport
                </button>

                <div className="flex items-center gap-2">
                  {/* Step 1: Confirm Receipt */}
                  {tx.handoverStatus !== 'CONFIRMED' && (
                    <button
                      onClick={() => handleConfirmHandover(tx.passportId)}
                      className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm Digital Weight</span>
                    </button>
                  )}

                  {/* Step 2: Record Payment */}
                  {tx.paymentStatus !== 'PAID' ? (
                    <button
                      onClick={() => setActivePaymentModalTx(tx)}
                      className="py-1.5 px-3 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Disburse Payment</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Settled via {tx.paymentMode || 'UPI'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Settlement Modal */}
      {activePaymentModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#176B45]" />
                <span>Disburse Kabadiwala Payment</span>
              </h3>
              <button
                onClick={() => setActivePaymentModalTx(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs font-sans">
              <div className="p-3 bg-stone-50 rounded-2xl space-y-1">
                <span className="text-[10px] text-stone-500 font-mono block">
                  Lot: {activePaymentModalTx.passportId}
                </span>
                <span className="font-bold text-stone-900 text-sm block">
                  {activePaymentModalTx.materialName}
                </span>
                <div className="flex justify-between text-xs pt-1 font-mono">
                  <span>Weight: <strong>{activePaymentModalTx.weightKg} kg</strong></span>
                  <span className="font-bold text-[#176B45]">
                    Amount: ₹{activePaymentModalTx.estimatedValue}
                  </span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 block">
                  Disbursement Mode:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['UPI', 'CASH', 'BANK_TRANSFER'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                        paymentMode === mode
                          ? 'bg-emerald-50 border-[#176B45] text-[#176B45]'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collector Account VPA note */}
              <div className="p-3 rounded-xl bg-stone-100 text-stone-700 text-[11px] space-y-0.5">
                <span>Beneficiary: <strong>{activePaymentModalTx.collectorName}</strong></span>
                <span className="block text-[10px] text-stone-500 font-mono">
                  Phone: {activePaymentModalTx.collectorPhone} · UPI VPA: rajesh.kumar@okhdfcbank
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActivePaymentModalTx(null)}
                  className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#176B45] hover:bg-[#125436] text-white font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Confirm & Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
