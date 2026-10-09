import { 
  Home, 
  Camera, 
  Store, 
  FileText, 
  User,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { language, role } = useApp();
  const t = getTranslation(language);

  // Dynamic role-based navigation tabs:
  // User Requirement: "the history and scan must only be there in kabadiwala dashboard and why there is a dashboard button in lower remove it"
  const tabs = [
    { id: 'home', label: t.navHome, icon: Home },
    ...(role === 'collector'
      ? [
          { id: 'scan', label: t.navScan, icon: Camera },
          { id: 'recyclers', label: t.navRecyclers, icon: Store },
          { id: 'history', label: t.navHistory, icon: FileText },
        ]
      : role === 'citizen'
      ? [
          { id: 'recyclers', label: 'Nearby Recyclers', icon: Store },
          { id: 'safety', label: 'Safety Guide', icon: ShieldCheck },
        ]
      : role === 'recycler'
      ? [
          { id: 'safety', label: 'Hazmat Guide', icon: ShieldCheck },
        ]
      : [
          { id: 'safety', label: 'Compliance Guide', icon: ShieldCheck },
        ]),
    { id: 'profile', label: t.navProfile, icon: User },
  ].filter((tab, index, self) => index === self.findIndex((t) => t.id === tab.id));

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around py-2 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-[#176B45] font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-emerald-100 text-[#176B45] shadow-xs scale-105' 
                  : 'bg-transparent text-stone-500'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-1 tracking-tight whitespace-nowrap transition-colors ${
                isActive ? 'text-[#176B45] font-bold' : 'text-stone-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
