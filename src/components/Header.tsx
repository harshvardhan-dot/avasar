import React from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Layers, 
  MapPin, 
  Cpu, 
  FileCheck2, 
  Bot, 
  LayoutDashboard
} from 'lucide-react';
import type { Language, ActiveTab, UserRole } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenHazmatModal: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  selectedRole,
  onRoleChange,
  onOpenHazmatModal,
  isVoiceActive,
  onToggleVoice,
}) => {
  const t = translations[currentLang];

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t.navHome, icon: <Layers className="w-4 h-4" /> },
    { id: 'scanner', label: t.navScanner, icon: <Cpu className="w-4 h-4" /> },
    { id: 'routing', label: t.navRouting, icon: <MapPin className="w-4 h-4" /> },
    { id: 'passport', label: t.navPassport, icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'advisor', label: t.navAdvisor, icon: <Bot className="w-4 h-4" /> },
    { id: 'dashboards', label: t.navDashboards, icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      {/* Top Telemetry Strip */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-1.5 border-b border-zinc-900 bg-zinc-950 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-medium tracking-wider text-emerald-400 uppercase">
              {t.telemetryLive}
            </span>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="hidden sm:inline font-mono text-[11px] text-zinc-500">
            MUM-NODE-04 · 19.0760° N, 72.8777° E · CPCB RECYC-SEC-2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Voice Assistant Trigger */}
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
              isVoiceActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
            }`}
            title="Toggle Accessibility Audio Telemetry Guidance"
          >
            {isVoiceActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Audio Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">{t.voiceGuideBtn}</span>
              </>
            )}
          </button>

          {/* HazMat Quick Safety Button */}
          <button
            onClick={onOpenHazmatModal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.safetyGuideBtn}</span>
            <span className="sm:hidden">HazMat</span>
          </button>

          {/* Multi-language Selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded transition-all ${
                currentLang === 'en'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 rounded transition-all ${
                currentLang === 'hi'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-2 py-0.5 rounded transition-all ${
                currentLang === 'mr'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700/80 group-hover:border-emerald-500/60 transition-all shadow-inner">
              <span className="font-mono text-base font-black text-emerald-400 tracking-tighter">A</span>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-zinc-100 group-hover:text-emerald-400 transition-colors">
                  {t.brandName}
                </span>
                <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  v2.4-STD
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block truncate max-w-sm">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Quick role indicator for mobile */}
          <div className="md:hidden">
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-zinc-900 text-zinc-200 text-xs border border-zinc-800 rounded px-2 py-1 font-mono"
            >
              <option value="citizen">Citizen</option>
              <option value="kabadi">Kabadi Collector</option>
              <option value="recycler">Recycler Hub</option>
              <option value="ulb">Municipal (ULB)</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Role Quick Switcher for Desktop */}
        <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-zinc-800/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Role:
          </span>
          <div className="flex bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 text-xs">
            {(['citizen', 'kabadi', 'recycler', 'ulb'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  onRoleChange(r);
                  onTabChange('dashboards');
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  selectedRole === r
                    ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/80 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r === 'citizen' && 'Citizen'}
                {r === 'kabadi' && 'Kabadi'}
                {r === 'recycler' && 'Recycler'}
                {r === 'ulb' && 'ULB Gov'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
