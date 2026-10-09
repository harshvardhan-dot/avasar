import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Language, 
  UserRole, 
  MaterialPriceConfig, 
  RecyclerFacility, 
  WastePassportRecord,
  WasteCategory
} from '../types/avasar';
import type { PickupJob } from '../types';
import { 
  INITIAL_MATERIALS, 
  INITIAL_RECYCLERS, 
  INITIAL_TRANSACTIONS 
} from '../data/avasarData';
import { 
  SAMPLE_PICKUP_JOBS, 
  INITIAL_MUNICIPAL_NOTICES, 
  INITIAL_REGISTERED_KABADIWALAS, 
  INITIAL_REGISTERED_RECYCLERS 
} from '../data/mockData';
import type { MunicipalNotice, RegisteredKabadiwala, RegisteredRecycler } from '../types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  materials: MaterialPriceConfig[];
  updateMaterialPrice: (id: WasteCategory, newPrice: number) => void;
  recyclers: RecyclerFacility[];
  updateRecycler: (updated: RecyclerFacility) => void;
  transactions: WastePassportRecord[];
  addTransaction: (newTx: WastePassportRecord) => void;
  updateTransactionStatus: (
    passportId: string, 
    status: WastePassportRecord['handoverStatus'], 
    paymentStatus?: WastePassportRecord['paymentStatus'],
    paidAmount?: number
  ) => void;
  pickupJobs: PickupJob[];
  addPickupJob: (job: Omit<PickupJob, 'id' | 'status' | 'otpCode'>) => PickupJob;
  verifyPickupJob: (jobId: string, enteredOtp: string, actualWeightKg?: number) => boolean;
  notices: MunicipalNotice[];
  publishNotice: (notice: Omit<MunicipalNotice, 'id' | 'publishedAt'>) => MunicipalNotice;
  registeredKabadiwalas: RegisteredKabadiwala[];
  registeredRecyclersList: RegisteredRecycler[];
  syncOfflineRecords: () => void;
  speakText: (textEn: string, textHi?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'avasar_lang',
  ROLE: 'avasar_role',
  MATERIALS: 'avasar_materials_v2',
  RECYCLERS: 'avasar_recyclers_v2',
  TRANSACTIONS: 'avasar_transactions_v2',
  PICKUPS: 'avasar_pickups_v2',
  NOTICES: 'avasar_notices_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'collector';
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const [materials, setMaterials] = useState<MaterialPriceConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
      return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  const [recyclers, setRecyclers] = useState<RecyclerFacility[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECYCLERS);
      return saved ? JSON.parse(saved) : INITIAL_RECYCLERS;
    } catch {
      return INITIAL_RECYCLERS;
    }
  });

  const [transactions, setTransactions] = useState<WastePassportRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [pickupJobs, setPickupJobs] = useState<PickupJob[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PICKUPS);
      return saved ? JSON.parse(saved) : SAMPLE_PICKUP_JOBS;
    } catch {
      return SAMPLE_PICKUP_JOBS;
    }
  });

  const [notices, setNotices] = useState<MunicipalNotice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      return saved ? JSON.parse(saved) : INITIAL_MUNICIPAL_NOTICES;
    } catch {
      return INITIAL_MUNICIPAL_NOTICES;
    }
  });

  const [registeredKabadiwalas] = useState<RegisteredKabadiwala[]>(INITIAL_REGISTERED_KABADIWALAS);
  const [registeredRecyclersList] = useState<RegisteredRecycler[]>(INITIAL_REGISTERED_RECYCLERS);

  // Track browser online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const setRole = (r: UserRole) => {
    setRoleState(r);
    localStorage.setItem(STORAGE_KEYS.ROLE, r);
  };

  const updateMaterialPrice = (id: WasteCategory, newPrice: number) => {
    setMaterials((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, defaultRatePerKg: newPrice } : m));
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateRecycler = (updatedRecycler: RecyclerFacility) => {
    setRecyclers((prev) => {
      const updated = prev.map((r) => (r.id === updatedRecycler.id ? updatedRecycler : r));
      localStorage.setItem(STORAGE_KEYS.RECYCLERS, JSON.stringify(updated));
      return updated;
    });
  };

  const addTransaction = (newTx: WastePassportRecord) => {
    setTransactions((prev) => {
      // Put newest first, persist to LocalStorage
      const updated = [newTx, ...prev];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateTransactionStatus = (
    passportId: string,
    status: WastePassportRecord['handoverStatus'],
    paymentStatus?: WastePassportRecord['paymentStatus'],
    paidAmount?: number
  ) => {
    setTransactions((prev) => {
      const updated = prev.map((tx) => {
        if (tx.passportId === passportId) {
          return {
            ...tx,
            handoverStatus: status,
            paymentStatus: paymentStatus || tx.paymentStatus,
            paidAmount: paidAmount !== undefined ? paidAmount : tx.paidAmount,
            paymentDate: paymentStatus === 'PAID' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today' : tx.paymentDate,
            paymentMode: paymentStatus === 'PAID' ? ('UPI' as const) : tx.paymentMode,
            synced: true,
          };
        }
        return tx;
      });
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const addPickupJob = (job: Omit<PickupJob, 'id' | 'status' | 'otpCode'>) => {
    const id = `PK-${Math.floor(100 + Math.random() * 900)}`;
    const otpCode = String(Math.floor(1000 + Math.random() * 9000));
    const newJob: PickupJob = {
      ...job,
      id,
      status: 'ASSIGNED',
      otpCode,
    };
    setPickupJobs((prev) => {
      const updated = [newJob, ...prev];
      localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(updated));
      return updated;
    });
    return newJob;
  };

  const verifyPickupJob = (jobId: string, enteredOtp: string, actualWeightKg?: number): boolean => {
    const targetJob = pickupJobs.find((j) => j.id === jobId);
    if (!targetJob) return false;
    if (targetJob.otpCode !== enteredOtp.trim()) return false;

    // Mark job as completed
    const updatedJobs = pickupJobs.map((j) =>
      j.id === jobId ? { ...j, status: 'COMPLETED' as const } : j
    );
    setPickupJobs(updatedJobs);
    localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(updatedJobs));

    // Also auto-record a completed transaction passport for full supply chain fidelity!
    const weightVal = actualWeightKg || parseFloat(targetJob.estimatedWeight) || 15;
    const newPassport: WastePassportRecord = {
      passportId: `AVS-${jobId}`,
      category: 'PCB',
      materialName: targetJob.materials.join(' + '),
      confidenceScore: 95,
      photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      weightKg: weightVal,
      ratePerKg: Math.round(targetJob.estPayout / (weightVal || 1)),
      estimatedValue: targetJob.estPayout,
      paidAmount: targetJob.estPayout,
      collectorName: 'Rajesh Kumar (कबाड़ीवाला)',
      collectorPhone: '+91 98200 11223',
      recyclerId: 'REC-001',
      recyclerName: 'Ecorev Green Recycling Ltd.',
      pickupRequested: true,
      notes: `Doorstep verified via OTP ${enteredOtp} from ${targetJob.citizenName}`,
      gpsCoords: { lat: 19.1136, lng: 72.8697 },
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      handoverStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMode: 'UPI',
      paymentDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      synced: isOnline,
    };
    addTransaction(newPassport);

    return true;
  };

  const publishNotice = (notice: Omit<MunicipalNotice, 'id' | 'publishedAt'>): MunicipalNotice => {
    const id = `NOT-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const newNotice: MunicipalNotice = {
      ...notice,
      id,
      publishedAt: 'Just now, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotices((prev) => {
      const updated = [newNotice, ...prev];
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(updated));
      return updated;
    });
    return newNotice;
  };

  const syncOfflineRecords = () => {
    setTransactions((prev) => {
      const updated = prev.map((tx) => ({ ...tx, synced: true }));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const speakText = (textEn: string, textHi?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = language === 'hi' && textHi ? textHi : textEn;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole,
        isOnline,
        setIsOnline,
        materials,
        updateMaterialPrice,
        recyclers,
        updateRecycler,
        transactions,
        addTransaction,
        updateTransactionStatus,
        pickupJobs,
        addPickupJob,
        verifyPickupJob,
        notices,
        publishNotice,
        registeredKabadiwalas,
        registeredRecyclersList,
        syncOfflineRecords,
        speakText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
