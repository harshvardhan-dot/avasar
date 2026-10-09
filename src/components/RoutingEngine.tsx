import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  Leaf, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { Language } from '../types';
import { RECYCLER_FACILITIES } from '../data/mockData';
import { translations } from '../utils/i18n';

interface RoutingEngineProps {
  currentLang: Language;
  onSelectRoute: (facilityId: string) => void;
}

export const RoutingEngine: React.FC<RoutingEngineProps> = ({
  currentLang,
  onSelectRoute,
}) => {
  const t = translations[currentLang];
  const [expandedRationale, setExpandedRationale] = useState<string | null>('rec-beta');
  const [selectedBatchWeight, setSelectedBatchWeight] = useState<number>(42.5);

  const toggleRationale = (id: string) => {
    setExpandedRationale(expandedRationale === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold uppercase">
              Algorithmic Supply Chain Optimizer
            </span>
            <span className="text-zinc-500 text-xs font-mono">ROUTING ENGINE v3.1</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            {t.routingTitle}
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl">
            {t.routingSubtitle}
          </p>
        </div>

        {/* Dynamic batch size toggle */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-mono">
          <span className="text-zinc-500">Active Batch Size:</span>
          <div className="flex gap-1">
            {[42.5, 150, 500].map((wt) => (
              <button
                key={wt}
                onClick={() => setSelectedBatchWeight(wt)}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedBatchWeight === wt
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {wt} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparative Facility Intelligence Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/90 text-[11px] font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Processing Facility</th>
                <th className="py-3 px-3">Facility Class</th>
                <th className="py-3 px-3">{t.distance}</th>
                <th className="py-3 px-3">{t.grossOffer}</th>
                <th className="py-3 px-3">Logistics & Handling</th>
                <th className="py-3 px-3 text-right">{t.netPayout}</th>
                <th className="py-3 px-3">Purity Match</th>
                <th className="py-3 px-3">Carbon Avoided</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-mono text-xs">
              {RECYCLER_FACILITIES.map((facility) => {
                const multiplier = selectedBatchWeight / 42.5;
                const dynamicGross = facility.grossBatchTotal * multiplier;
                const dynamicTransport = facility.transportCost * (1 + (multiplier - 1) * 0.4);
                const dynamicHandling = facility.handlingCost * multiplier;
                const dynamicNet = dynamicGross - (dynamicTransport + dynamicHandling);
                const dynamicCarbon = (facility.carbonOffsetAvoidedKg * multiplier).toFixed(1);

                return (
                  <React.Fragment key={facility.id}>
                    <tr className={`transition-colors ${
                      facility.isAiRecommended
                        ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                        : 'hover:bg-zinc-900/50'
                    }`}>
                      {/* Name & Badge */}
                      <td className="py-4 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-100">
                            {facility.name}
                          </span>
                          {facility.isAiRecommended && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              {t.recommendedBadge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-mono mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{facility.location}</span>
                        </div>
                      </td>

                      {/* Facility Class */}
                      <td className="py-4 px-3 text-zinc-400">
                        <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                          {facility.facilityType.split(' ')[0]} {facility.facilityType.split(' ')[1]}
                        </span>
                      </td>

                      {/* Distance */}
                      <td className="py-4 px-3 text-zinc-300">
                        <div className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{facility.distanceKm} km</span>
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          ~{facility.turnaroundHours}h transit
                        </div>
                      </td>

                      {/* Gross Offer */}
                      <td className="py-4 px-3 text-zinc-200">
                        <div className="font-semibold">₹{facility.grossOfferPerKg}/kg</div>
                        <div className="text-[10px] text-zinc-500">
                          ₹{dynamicGross.toFixed(0)} total
                        </div>
                      </td>

                      {/* Logistics & Handling deductions */}
                      <td className="py-4 px-3 text-rose-400 tabular-nums">
                        <div>- ₹{(dynamicTransport + dynamicHandling).toFixed(0)}</div>
                        <div className="text-[10px] text-zinc-500">
                          Freight: ₹{dynamicTransport.toFixed(0)}
                        </div>
                      </td>

                      {/* Net Payout */}
                      <td className="py-4 px-3 text-right">
                        <div className={`text-base font-bold tabular-nums ${
                          facility.isAiRecommended ? 'text-emerald-400' : 'text-zinc-200'
                        }`}>
                          ₹{dynamicNet.toFixed(0)}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          ₹{(dynamicNet / selectedBatchWeight).toFixed(1)}/kg net
                        </div>
                      </td>

                      {/* Purity Match */}
                      <td className="py-4 px-3 text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                facility.purityMatchPercent > 90 ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${facility.purityMatchPercent}%` }}
                            ></div>
                          </div>
                          <span>{facility.purityMatchPercent}%</span>
                        </div>
                      </td>

                      {/* Carbon Offset */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Leaf className="w-3.5 h-3.5" />
                          <span className="font-semibold">{dynamicCarbon} kg</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleRationale(facility.id)}
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                            title="Expand algorithmic reasoning"
                          >
                            {expandedRationale === facility.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => onSelectRoute(facility.id)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold font-sans transition-all active:scale-[0.98] ${
                              facility.isAiRecommended
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                            }`}
                          >
                            Select Route
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Rationale Details Row */}
                    {expandedRationale === facility.id && (
                      <tr className="bg-zinc-950/80 border-b border-zinc-800">
                        <td colSpan={9} className="p-4">
                          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-3 font-sans text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Algorithmic Route Recommendation Rationale
                              </span>
                              <span className="text-zinc-500 font-mono text-[11px]">
                                FACILITY ID: {facility.id.toUpperCase()}
                              </span>
                            </div>

                            <p className="text-zinc-300 leading-relaxed">
                              {facility.rationale}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-800 text-zinc-400 text-xs">
                              <div>
                                <span className="font-semibold text-zinc-300 font-mono block text-[11px] mb-1">
                                  Secondary Processing Technology:
                                </span>
                                <span>{facility.recoveryTech}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-zinc-300 font-mono block text-[11px] mb-1">
                                  Statutory Accreditation & Licenses:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {facility.certifications.map((cert, cIdx) => (
                                    <span key={cIdx} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">
                                      {cert}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Intelligence Callout */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              Automated Hyper-Local Scrap Aggregation Enabled
            </h4>
            <p className="text-xs text-zinc-400">
              When 8 or more micro-collectors bundle HDPE within a 3km radius, AVASAR deploys an electric transit vehicle, eliminating ₹110/batch in intermediate cartage.
            </p>
          </div>
        </div>
        <div className="font-mono text-xs text-zinc-400 whitespace-nowrap bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
          NEXT EV BATCH: <span className="text-emerald-400 font-semibold">14:30 IST (480kg bundled)</span>
        </div>
      </div>
    </div>
  );
};
