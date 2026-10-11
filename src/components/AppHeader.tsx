import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Volume2, 
  RefreshCw, 
  UserCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';

interface AppHeaderProps {
  title?: string;
  onOpenRoleModal: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, onOpenRoleModal }) => {
  const { 
    language, 
    setLanguage, 
    role, 
    isOnline, 
    setIsOnline, 
    transactions, 
    syncOfflineRecords,
    speakText 
  } = useApp();
  const t = getTranslation(language);

  const pendingSyncCount = transactions.filter((t) => !t.synced).length;

  const handleVoiceGuide = () => {
    speakText(
      `Welcome to AVASAR Kabadiwala Connect. You are in the ${role} mode. You can scan scrap, estimate prices, and find authorized recyclers.`,
      `अवसर कबाड़ीवाला कनेक्ट में आपका स्वागत है। आप ${role === 'collector' ? 'कबाड़ीवाला' : 'रीसाइक्लर'} मोड में हैं। आप ई-कचरा स्कैन कर सकते हैं और रीसाइक्लर ढूंढ सकते हैं।`
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-[#176B45] text-white shadow-md">
      {/* Top micro telemetry bar */}
      <div className="bg-[#104e32] py-1 text-[11px] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Offline / Online indicator button (clickable to simulate offline toggle) */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-medium text-[10px] transition-colors ${
              isOnline ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/30 text-amber-200'
            }`}
            title="Click to simulate Online / Offline switch"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-300" />
                <span>{t.onlineStatus}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-300" />
                <span>{t.offlineStatus}</span>
              </>
            )}
          </button>

          {pendingSyncCount > 0 && (
            <button
              onClick={syncOfflineRecords}
              className="flex items-center gap-1 bg-amber-400 text-stone-900 px-1.5 py-0.5 rounded font-bold text-[10px] animate-pulse"
              title="Click to sync offline records"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>{pendingSyncCount} Pending Sync</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Speech Assistant */}
          <button
            onClick={handleVoiceGuide}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-[10px]"
            title="Voice guidance"
          >
            <Volume2 className="w-3 h-3 text-emerald-200" />
            <span className="hidden xs:inline">{t.voiceGuideOn}</span>
          </button>

          {/* Hindi / English Language Switcher */}
          <div className="flex bg-[#0b3824] rounded p-0.5 text-[10px] font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                language === 'en' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                language === 'hi' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-200'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Main Title Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl text-emerald-200 shadow-inner">
            अव
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight flex items-center gap-2">
              <span>{t.appName}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-800 rounded text-emerald-200 font-semibold border border-emerald-700">
                PROD v2.9
              </span>
            </h1>
            <p className="text-xs text-emerald-200/90 leading-none mt-0.5">
              {title || t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Role Badge & Switcher Button */}
        <button
          onClick={onOpenRoleModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-white transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <UserCheck className="w-4 h-4 text-emerald-300" />
          <span className="font-semibold text-xs">
            {role === 'collector'
              ? 'Collector (कबाड़ीवाला)'
              : role === 'recycler'
              ? 'Recycler Hub'
              : role === 'citizen'
              ? 'Citizen (नागरिक)'
              : role === 'ulb'
              ? 'Municipal (ULB)'
              : 'Admin Config'}
          </span>
          <span className="text-[10px] text-emerald-300 underline hidden sm:inline">
            (Switch)
          </span>
        </button>
      </div>

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="bg-amber-600 py-1 text-[11px] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <span>{t.offlineBanner}</span>
            <button
              onClick={() => setIsOnline(true)}
              className="underline font-bold text-[10px] ml-2"
            >
              Go Online
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
