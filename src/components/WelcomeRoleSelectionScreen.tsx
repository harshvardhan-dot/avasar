import React from 'react';
import { 
  Users, 
  Truck, 
  Factory, 
  Building2, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';
import type { UserRole } from '../types/avasar';

interface WelcomeRoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export const WelcomeRoleSelectionScreen: React.FC<WelcomeRoleSelectionScreenProps> = ({ onSelectRole }) => {
  const { language, setLanguage } = useApp();
  const t = getTranslation(language);

  const stakeholderCards: Array<{
    role: UserRole;
    badge: string;
    badgeColor: string;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    features: string[];
  }> = [
    {
      role: 'citizen',
      badge: 'PRODUCER & CITIZEN PORTAL',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      titleEn: '1. Citizen / Producer (नागरिक)',
      titleHi: '१. नागरिक / कचरा उत्पादक',
      descEn: 'Schedule doorstep e-waste pickups, accumulate Green Credits, track landfill diversion and verify collection via 4-digit OTP.',
      descHi: 'घर बैठे ई-कचरा पिकअप बुक करें, ग्रीन क्रेडिट्स पाएं और ४-अंकों के ओटीपी से सुरक्षित भुगतान प्राप्त करें।',
      icon: Users,
      accentColor: 'border-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-50/30',
      features: ['Doorstep Pickups', 'Green Credits (GC)', 'Landfill Diversion Tracker', '4-Digit OTP Pin']
    },
    {
      role: 'collector',
      badge: 'FIELD MICRO-COLLECTOR',
      badgeColor: 'bg-emerald-800 text-white border-emerald-900',
      titleEn: '2. Kabadi / Collector (कबाड़ीवाला)',
      titleHi: '२. कबाड़ीवाला / स्थानीय संग्राहक',
      descEn: 'Today’s geo-optimized pickup routes, Bluetooth digital weigh scale logging, 4-digit OTP validation, and daily UPI wallet disbursements.',
      descHi: 'आज का अनुकूलित पिकअप रूट, ब्लूटूथ डिजिटल वजन तराजू, ४-अंकों का ओटीपी सत्यापन और तत्काल यूपीआई भुगतान।',
      icon: Truck,
      accentColor: 'border-[#176B45]/40 hover:border-[#176B45] hover:bg-emerald-50/40',
      features: ['Geo-Clustered Route', 'Bluetooth Scale Input', 'OTP Verification', 'Daily UPI Wallet']
    },
    {
      role: 'recycler',
      badge: 'CPCB RECYCLING FACILITY',
      badgeColor: 'bg-stone-800 text-white border-stone-900',
      titleEn: '3. Recycler Hub & Smelter (रीसाइक्लर)',
      titleHi: '३. अधिकृत रीसाइक्लिंग हब व स्मेल्टर',
      descEn: 'Incoming bulk feedstock queue, NIR spectroscopy purity grading (Grade A/B/C), spot scrap commodity tickers, and plant capacity tracking.',
      descHi: 'आगमन फीडस्टॉक कतार, स्पेक्ट्रोस्कोपी शुद्धता ग्रेडिंग (A/B/C), स्क्रैप बाजार भाव और संयंत्र क्षमता उपयोग।',
      icon: Factory,
      accentColor: 'border-stone-400 hover:border-stone-800 hover:bg-stone-50',
      features: ['Incoming Feedstock Queue', 'Purity Grading A/B/C', 'Scrap Ticker', 'Capacity Utilization']
    },
    {
      role: 'ulb',
      badge: 'MUNICIPAL CORPORATION (ULB)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      titleEn: '4. Municipal / ULB (नगर निगम)',
      titleHi: '४. नगर निगम / शहरी स्थानीय निकाय',
      descEn: 'Ward-level diversion heatmaps, total tonnage processed vs landfilled, informal collector formalization count, and CPCB EPR compliance audits.',
      descHi: 'वार्ड स्तर कचरा पृथक्करण हीटमैप, डंपिंग ग्राउंड से बचाया कचरा, पंजीकृत कबाड़ी संख्या और ईपीआर ऑडिट रिपोर्ट।',
      icon: Building2,
      accentColor: 'border-blue-400 hover:border-blue-700 hover:bg-blue-50/30',
      features: ['Ward Diversion Heatmap', 'Processed vs Landfill', 'Formalized Kabadis', 'EPR Audit Tracker']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937] flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-2xl w-full mx-auto space-y-6 pt-2 pb-8">
        {/* Brand Header & Language Switcher */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#176B45] text-white flex items-center justify-center font-bold text-xl shadow-xs">
              अव
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight text-stone-900">
                  {t.appName}
                </h1>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                  v2.8 PROD
                </span>
              </div>
              <p className="text-xs text-stone-500">
                AI Circular Waste Intelligence & Hyper-Local Supply Chain
              </p>
            </div>
          </div>

          {/* Bilingual Switcher */}
          <div className="flex bg-stone-200 rounded-lg p-0.5 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'en' ? 'bg-white text-[#176B45] shadow-xs' : 'text-stone-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'hi' ? 'bg-white text-[#176B45] shadow-xs' : 'text-stone-600'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#176B45] to-[#125436] text-white p-5 rounded-3xl shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-100">
              STAKEHOLDER ONBOARDING GATEWAY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Select Your Operating Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            Choose any of the 4 interconnected stakeholder roles to enter its dedicated real-time portal. You can seamlessly switch between roles at any time.
          </p>
        </div>

        {/* The 4 Stakeholder Dashboard Option Cards */}
        <div className="space-y-3">
          {stakeholderCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.role}
                onClick={() => onSelectRole(card.role)}
                className={`bg-white rounded-2xl border-2 p-4 shadow-xs transition-all duration-150 cursor-pointer group active:scale-[0.99] space-y-3 ${card.accentColor}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-stone-100 group-hover:bg-[#176B45] group-hover:text-white text-stone-800 transition-colors shrink-0 shadow-2xs mt-0.5">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                          {card.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#176B45] transition-colors">
                        {language === 'hi' ? card.titleHi : card.titleEn}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {language === 'hi' ? card.descHi : card.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-2">
                    <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#176B45] group-hover:text-white text-stone-600 flex items-center justify-center transition-all group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Micro capabilities tag row */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {card.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-stone-500 py-4 border-t border-stone-200/80 font-mono">
        AVASAR (अवसर) · Multi-Stakeholder Circular Supply Chain Platform · CPCB Schedule II Audited
      </footer>
    </div>
  );
};
