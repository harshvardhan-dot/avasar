import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';

interface TransactionHistoryProps {
  onOpenPassport: (passportId: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onOpenPassport }) => {
  const { language, transactions } = useApp();
  const t = getTranslation(language);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'PAID' | 'UNPAID'>('ALL');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    // Search query
    const matchSearch =
      tx.passportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recyclerName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;

    // Status filter
    if (statusFilter === 'PAID') return tx.paymentStatus === 'PAID';
    if (statusFilter === 'UNPAID') return tx.paymentStatus === 'PENDING';
    if (statusFilter === 'COMPLETED') return tx.handoverStatus === 'CONFIRMED';
    if (statusFilter === 'PENDING') return tx.handoverStatus !== 'CONFIRMED';

    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#176B45]" />
          <span>{t.actionHistory}</span>
        </h2>
        <p className="text-xs text-stone-600">
          Search and view verifiable chain-of-custody records stored in phone memory.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 space-y-2.5 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Passport ID, material, or recycler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2 pl-9 pr-3 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-emerald-600"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {(['ALL', 'PENDING', 'COMPLETED', 'PAID', 'UNPAID'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg border font-semibold whitespace-nowrap transition-all ${
                statusFilter === filter
                  ? 'bg-[#176B45] text-white border-[#176B45] shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filtered.map((tx) => (
          <div
            key={tx.passportId}
            onClick={() => onOpenPassport(tx.passportId)}
            className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-500/50 p-4 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900">
                    {tx.passportId}
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    · {tx.weightKg} kg
                  </span>
                  {!tx.synced && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-mono">
                      Offline
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-stone-800 mt-0.5">
                  {tx.materialName}
                </h4>
                <span className="text-[11px] text-stone-500 block">
                  To: {tx.recyclerName}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-[#176B45] block tabular-nums">
                  ₹{tx.paidAmount || tx.estimatedValue}
                </span>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    tx.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : tx.handoverStatus === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {tx.paymentStatus === 'PAID' ? 'PAID' : tx.handoverStatus}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{tx.createdAt}</span>
              </span>
              <span className="text-[#176B45] font-semibold flex items-center gap-0.5">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
            No transaction records found matching your filter.
          </div>
        )}
      </div>
    </div>
  );
};
