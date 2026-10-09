import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Filter, 
  ArrowUpDown, 
  Info, 
  Star,
  Map as MapIcon,
  List as ListIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';
import type { RecyclerFacility, WasteCategory } from '../types/avasar';

interface RecyclerDiscoveryProps {
  onSelectRecycler: (recycler: RecyclerFacility) => void;
  preselectedCategory?: WasteCategory;
}

export const RecyclerDiscovery: React.FC<RecyclerDiscoveryProps> = ({ 
  onSelectRecycler, 
  preselectedCategory 
}) => {
  const { language, recyclers, materials } = useApp();
  const t = getTranslation(language);

  const [categoryFilter, setCategoryFilter] = useState<string>(preselectedCategory || 'ALL');
  const [pickupOnlyFilter, setPickupOnlyFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rate' | 'distance'>('rate');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter recyclers
  const filteredRecyclers = recyclers.filter((rec) => {
    if (categoryFilter !== 'ALL') {
      if (!rec.acceptedCategories.includes(categoryFilter as WasteCategory)) return false;
    }
    if (pickupOnlyFilter && !rec.pickupAvailable) return false;
    return true;
  });

  // Sort recyclers
  filteredRecyclers.sort((a, b) => {
    if (sortBy === 'rate') return b.indicativeRatePerKg - a.indicativeRatePerKg;
    return a.distanceKm - b.distanceKm;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <Store className="w-5 h-5 text-[#176B45]" />
          <span>{t.recyclersTitle}</span>
        </h2>
        <p className="text-xs text-stone-600">
          {t.recyclersSubtitle}
        </p>
      </div>

      {/* Clearly labelled fictional demo notice */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2 shadow-xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong className="font-semibold block text-amber-950">
            Fictional Demonstration Notice:
          </strong>
          {t.fictionalNotice}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg py-1 px-2 text-xs text-stone-800 font-medium focus:outline-hidden w-full"
            >
              <option value="ALL">All Categories (सभी)</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {language === 'hi' ? m.nameHi : m.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rate' | 'distance')}
              className="bg-stone-50 border border-stone-300 rounded-lg py-1 px-2 text-xs text-stone-800 font-medium focus:outline-hidden"
            >
              <option value="rate">{t.sortRate}</option>
              <option value="distance">{t.sortDistance}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1 rounded text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>

        {/* Pickup checkbox */}
        <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer pt-1 border-t border-stone-100">
          <input
            type="checkbox"
            checked={pickupOnlyFilter}
            onChange={(e) => setPickupOnlyFilter(e.target.checked)}
            className="accent-[#176B45] rounded"
          />
          <span>{t.filterPickup} (वाहन संग्रहण सुविधा)</span>
        </label>
      </div>

      {/* Map View Mode: Leaflet / OpenStreetMap Visual representation */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm space-y-2 p-3">
          <div className="flex items-center justify-between text-xs text-stone-600 font-sans">
            <span className="font-semibold text-stone-900">
              OpenStreetMap Telemetry View (Mumbai MIDC Cluster)
            </span>
            <span className="text-[10px] text-emerald-800 font-mono">
              GPS: 19.0760° N, 72.8777° E
            </span>
          </div>

          {/* Clean styled interactive OpenStreetMap container */}
          <div className="relative h-64 w-full rounded-xl overflow-hidden border border-stone-300 bg-stone-100">
            <iframe
              title="OpenStreetMap Recyclers"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.8200%2C19.0100%2C73.0800%2C19.3200&amp;layer=mapnik"
              className="w-full h-full filter saturate-[1.1] contrast-[1.05]"
            ></iframe>

            {/* Floating Quick Facility Chips */}
            <div className="absolute bottom-2 inset-x-2 bg-stone-900/85 backdrop-blur-xs text-white p-2 rounded-lg text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-300 font-mono block">
                  DEMO ACTIVE CLUSTER
                </span>
                <span className="font-bold">4 Verified Facilities in Mumbai / Navi Mumbai</span>
              </div>
              <button
                onClick={() => setViewMode('list')}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-[11px] font-bold"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recyclers Cards List */}
      <div className="space-y-3">
        {filteredRecyclers.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs hover:border-emerald-500/50 transition-all space-y-3"
          >
            {/* Header: Name, Distance & Rating */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-stone-900">
                    {rec.name}
                  </h3>
                  {rec.isVerified && (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full border border-emerald-300 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      CPCB Reg.
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-stone-500 bg-stone-100 px-1 py-0.2 rounded">
                    DEMO ENTRY
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="line-clamp-1">{rec.address}</span>
                </div>
              </div>

              {/* Distance badge */}
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-stone-800 block">
                  {rec.distanceKm} km
                </span>
                <div className="flex items-center gap-0.5 text-[11px] text-amber-600 font-semibold">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{rec.rating}</span>
                </div>
              </div>
            </div>

            {/* Accepted Categories pills */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                Accepted Waste Streams:
              </span>
              <div className="flex flex-wrap gap-1">
                {rec.acceptedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Operational details & Rate */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] text-stone-600">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{rec.operatingHours}</span>
                </div>
                {rec.pickupAvailable && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                    <Truck className="w-3 h-3 text-emerald-700" />
                    <span>Free Doorstep Fleet Pickup</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-500 block">Indicative Offer:</span>
                <span className="text-base font-bold text-[#176B45]">
                  ₹{rec.indicativeRatePerKg} / kg
                </span>
              </div>
            </div>

            {/* Contact & Handover CTA */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${rec.phone}`}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <button
                onClick={() => onSelectRecycler(rec)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#176B45] hover:bg-[#125436] active:scale-98 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.selectRecyclerBtn}</span>
              </button>
            </div>
          </div>
        ))}

        {filteredRecyclers.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center text-stone-500 text-xs space-y-2">
            <p>No recyclers found matching your current filter.</p>
            <button
              onClick={() => {
                setCategoryFilter('ALL');
                setPickupOnlyFilter(false);
              }}
              className="text-[#176B45] font-semibold underline text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
