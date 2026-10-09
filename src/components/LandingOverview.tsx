import React from 'react';
import { 
  Cpu, 
  MapPin, 
  FileCheck2, 
  Bot, 
  ArrowRight, 
  Users, 
  Truck, 
  Factory, 
  Building2
} from 'lucide-react';
import type { ActiveTab, Language, UserRole } from '../types';

interface LandingOverviewProps {
  currentLang: Language;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({
  onNavigateTab,
  onSelectRole,
}) => {

  return (
    <div className="space-y-12 py-2">
      {/* Enterprise Hero Section */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-12 overflow-hidden shadow-2xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CIRCULAR LOGISTICS & TELEMETRY NETWORK</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Transforming urban waste into high-grade industrial feedstock.
          </h1>

          <p className="text-base md:text-lg text-zinc-400 leading-relaxed font-sans">
            <strong className="text-zinc-200">AVASAR</strong> is an enterprise-grade AI intelligence platform connecting Indian citizens, informal scrap collectors (kabadis), authorized recycler hubs, and municipal corporations (ULBs) into a unified, cryptographically auditable circular supply chain.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('scanner')}
              className="py-3 px-5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold text-sm transition-all duration-150 flex items-center gap-2 shadow-lg shadow-emerald-500/15 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Launch Optical Diagnostic Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('routing')}
              className="py-3 px-5 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] border border-zinc-700/80 text-zinc-200 font-mono text-xs transition-all duration-150 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Explore Material-to-Market Engine</span>
            </button>
          </div>
        </div>

        {/* Live Ecosystem Metric Ticker Cards */}
        <div className="relative z-10 mt-10 pt-8 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Total Waste Diverted</span>
            <span className="text-xl font-bold text-zinc-100 tabular-nums">4,812.5 T</span>
            <span className="text-[10px] text-emerald-400 block">Across 24 Mumbai Wards</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Formalized Kabadis</span>
            <span className="text-xl font-bold text-zinc-100 tabular-nums">1,420</span>
            <span className="text-[10px] text-zinc-400 block">CPCB & E-Shram Linked</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Net Direct Payouts</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">₹1.84 Cr</span>
            <span className="text-[10px] text-zinc-400 block">Instant Escrow UPI</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Avoided Emissions</span>
            <span className="text-xl font-bold text-zinc-100 tabular-nums">7,218 T CO₂e</span>
            <span className="text-[10px] text-emerald-400 block">Verified Carbon Offsets</span>
          </div>
        </div>
      </div>

      {/* Feature Architecture Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-xl font-bold text-zinc-100">
            Core Enterprise Capabilities
          </h2>
          <span className="font-mono text-xs text-zinc-500">
            PRODUCTION SYSTEM MODULES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Scanner */}
          <div 
            onClick={() => onNavigateTab('scanner')}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-emerald-500/50 hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                AI Waste Diagnostic Scanner
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Optical computer vision segmentation with NIR polymer spectroscopy and dynamic Net Recovery formula computation.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-1">
              <span>Try Scanner</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Routing Engine */}
          <div 
            onClick={() => onNavigateTab('routing')}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-emerald-500/50 hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                Material-to-Market Engine
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Algorithmic yield matching between micro-collectors and certified recyclers, factoring haulage freight and purity premiums.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-1">
              <span>View Route Matrix</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Digital Passport */}
          <div 
            onClick={() => onNavigateTab('passport')}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-emerald-500/50 hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                Digital Waste Passport
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Cryptographically anchored 6-stage chain-of-custody ledger with QR codes and tamper-evident SHA-256 weight manifests.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-1">
              <span>Verify Batch</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: AI Advisor */}
          <div 
            onClick={() => onNavigateTab('advisor')}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-emerald-500/50 hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                Circularity & Legal Advisor
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Specialized LLM grounded in Indian E-Waste Rules 2022, PWM Rules 2024, CPCB EPR targets, and spot market price tickers.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-1">
              <span>Consult Advisor</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stakeholder Portals Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">
              Multi-Stakeholder Operating System
            </h2>
            <p className="text-xs text-zinc-400">
              Purpose-built user interfaces engineered for each segment of the circular value chain.
            </p>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            SELECT A ROLE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => {
              onSelectRole('citizen');
              onNavigateTab('dashboards');
            }}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>1. Citizen / Producer</span>
            </div>
            <p className="text-xs text-zinc-400">
              Doorstep scrap booking, Green Credit accumulation, transparent weigh-scale payouts & landfill diversion stats.
            </p>
          </div>

          <div
            onClick={() => {
              onSelectRole('kabadi');
              onNavigateTab('dashboards');
            }}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>2. Kabadi / Collector</span>
            </div>
            <p className="text-xs text-zinc-400">
              Optimized daily route clusters, 4-digit OTP handover security, Bluetooth load-cell scales & instant UPI wallet disbursements.
            </p>
          </div>

          <div
            onClick={() => {
              onSelectRole('recycler');
              onNavigateTab('dashboards');
            }}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
              <Factory className="w-4 h-4 text-emerald-400" />
              <span>3. Recycler Hub</span>
            </div>
            <p className="text-xs text-zinc-400">
              Incoming industrial feedstock queue, gate NIR spectroscopy purity grading, capacity utilization & EPR certificate generation.
            </p>
          </div>

          <div
            onClick={() => {
              onSelectRole('ulb');
              onNavigateTab('dashboards');
            }}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>4. Municipal (ULB)</span>
            </div>
            <p className="text-xs text-zinc-400">
              Ward-by-ward segregation heatmaps, informal workforce formalization records, compactor fuel savings & CPCB compliance audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
