import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { CollectorHome } from './components/CollectorHome';
import { WasteScannerModule } from './components/WasteScannerModule';
import { ScrapEstimatorPage } from './components/ScrapEstimatorPage';
import { RecyclerDiscovery } from './components/RecyclerDiscovery';
import { WastePassportDetail } from './components/WastePassportDetail';
import { RecyclerPortal } from './components/RecyclerPortal';
import { TransactionHistory } from './components/TransactionHistory';
import { SafetyAdvisor } from './components/SafetyAdvisor';
import { ProfileSettings } from './components/ProfileSettings';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { CitizenDashboardView } from './components/CitizenDashboardView';
import { MunicipalULBDashboardView } from './components/MunicipalULBDashboardView';
import { WelcomeRoleSelectionScreen } from './components/WelcomeRoleSelectionScreen';
import confetti from 'canvas-confetti';
import type { RecyclerFacility, WastePassportRecord, WasteCategory, UserRole } from './types/avasar';

const MainAppContent: React.FC = () => {
  const { role, setRole, isOnline, addTransaction } = useApp();

  // Show 4-dashboard chooser on opening (can be reopened anytime via role switcher)
  const [showInitialRolePicker, setShowInitialRolePicker] = useState<boolean>(true);

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedPassportId, setSelectedPassportId] = useState<string | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Temporary staging data for scanner -> recycler selection -> passport creation workflow
  const [stagedScan, setStagedScan] = useState<{
    category: WasteCategory;
    materialName: string;
    weightKg: number;
    photoUrl: string;
    ratePerKg: number;
    estimatedValue: number;
    confidence: number;
  } | null>(null);

  // Handlers for the mandatory 13-step demonstration flow
  const handleProceedToRecyclers = (scanResult: {
    category: WasteCategory;
    materialName: string;
    weightKg: number;
    photoUrl: string;
    ratePerKg: number;
    estimatedValue: number;
    confidence: number;
  }) => {
    setStagedScan(scanResult);
    setCurrentTab('recyclers');
  };

  const handleSelectRecyclerForStagedBatch = (recycler: RecyclerFacility) => {
    if (!stagedScan) {
      // If user browsed recyclers independently, return
      alert(`Selected ${recycler.name}. Scan or estimate a batch first to create a passport.`);
      return;
    }

    // Generate unique verifiable transaction passport ID
    const newPassportId = `AVS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newRecord: WastePassportRecord = {
      passportId: newPassportId,
      category: stagedScan.category,
      materialName: stagedScan.materialName,
      confidenceScore: stagedScan.confidence,
      photoUrl: stagedScan.photoUrl,
      weightKg: stagedScan.weightKg,
      ratePerKg: recycler.indicativeRatePerKg,
      estimatedValue: Number((stagedScan.weightKg * recycler.indicativeRatePerKg).toFixed(0)),
      collectorName: 'Rajesh Kumar (कबाड़ीवाला)',
      collectorPhone: '+91 98200 11223',
      recyclerId: recycler.id,
      recyclerName: recycler.name,
      pickupRequested: recycler.pickupAvailable,
      notes: 'Logged via mobile AVASAR camera diagnostic reticle.',
      gpsCoords: { lat: recycler.latitude, lng: recycler.longitude },
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      handoverStatus: 'REQUESTED',
      paymentStatus: 'PENDING',
      synced: isOnline,
    };

    addTransaction(newRecord);
    setStagedScan(null);
    setSelectedPassportId(newPassportId);
    setCurrentTab('passport-detail');

    // Tactile celebration
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleOpenPassport = (passportId: string) => {
    setSelectedPassportId(passportId);
    setCurrentTab('passport-detail');
  };

  const handleWelcomeRoleSelect = (chosenRole: UserRole) => {
    setRole(chosenRole);
    setShowInitialRolePicker(false);
    setCurrentTab('home');
  };

  // If user is opening the app, allow selecting between the 4 dashboards
  if (showInitialRolePicker) {
    return <WelcomeRoleSelectionScreen onSelectRole={handleWelcomeRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-stone-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900 antialiased">
      {/* Mobile-first Header */}
      <AppHeader onOpenRoleModal={() => setIsRoleModalOpen(true)} />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: HOME (Distinct dashboard per active role) */}
        {currentTab === 'home' && (
          <>
            {role === 'collector' && (
              <CollectorHome
                onNavigate={setCurrentTab}
                onOpenPassport={handleOpenPassport}
              />
            )}
            {role === 'citizen' && (
              <CitizenDashboardView
                onNavigateTab={setCurrentTab}
              />
            )}
            {role === 'recycler' && (
              <RecyclerPortal
                onOpenPassport={handleOpenPassport}
              />
            )}
            {role === 'ulb' && (
              <MunicipalULBDashboardView />
            )}
          </>
        )}

        {/* TAB 2: SCAN (For collector / waste scanning) */}
        {currentTab === 'scan' && (
          <WasteScannerModule
            onProceedToRecyclers={handleProceedToRecyclers}
          />
        )}

        {/* TAB: ESTIMATE */}
        {currentTab === 'estimate' && (
          <ScrapEstimatorPage
            onSelectCategoryForScan={(_cat) => {
              setCurrentTab('scan');
            }}
          />
        )}

        {/* TAB 3: RECYCLERS */}
        {currentTab === 'recyclers' && (
          <RecyclerDiscovery
            onSelectRecycler={handleSelectRecyclerForStagedBatch}
            preselectedCategory={stagedScan?.category}
          />
        )}

        {/* TAB 5: HISTORY */}
        {currentTab === 'history' && (
          <TransactionHistory
            onOpenPassport={handleOpenPassport}
          />
        )}

        {/* TAB: PASSPORT DETAIL */}
        {currentTab === 'passport-detail' && selectedPassportId && (
          <WastePassportDetail
            passportId={selectedPassportId}
            onBack={() => setCurrentTab('history')}
          />
        )}

        {/* TAB: SAFETY */}
        {currentTab === 'safety' && (
          <SafetyAdvisor />
        )}

        {/* TAB 6: PROFILE */}
        {currentTab === 'profile' && (
          <ProfileSettings
            onOpenRoleModal={() => setIsRoleModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setSelectedPassportId(null);
          setCurrentTab(tab);
        }}
      />

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
};

export default App;
