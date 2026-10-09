'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header, ScreenId } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LandingScreen } from '@/components/screens/LandingScreen';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { ForecastScreen } from '@/components/screens/ForecastScreen';
import { PreparationScreen } from '@/components/screens/PreparationScreen';
import { ConsumptionScreen } from '@/components/screens/ConsumptionScreen';
import { RecoveryScreen } from '@/components/screens/RecoveryScreen';
import { OrganizationsScreen } from '@/components/screens/OrganizationsScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';
import { ArchitectureScreen } from '@/components/screens/ArchitectureScreen';
import { AnalysisScreen } from '@/components/screens/AnalysisScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { NgoInboxScreen } from '@/components/screens/NgoInboxScreen';
import { NgoPickupsScreen } from '@/components/screens/NgoPickupsScreen';
import { NgoHistoryScreen } from '@/components/screens/NgoHistoryScreen';
import { NotificationsScreen } from '@/components/screens/NotificationsScreen';

import { 
  INITIAL_NUMERICAL_FORECAST, 
  INITIAL_LLM_EXPLANATION, 
  INITIAL_CONSUMPTION,
  INITIAL_SURPLUS_LISTING,
  DEMO_ORGANIZATIONS,
  DEMO_HISTORY,
  DEMO_HOTEL_USER,
  DEMO_NGO,
  INITIAL_RECOVERY_OFFERS,
  INITIAL_RECOVERY_NOTIFICATIONS,
} from '@/lib/demoData';

import {
  loadInitialState,
  persistDemandForecast,
  persistConsumption,
  updateSurplusStage,
  resetDemoState,
} from '@/lib/supabase/service';

import {
  getRecoveryOffers,
  createRecoveryOffer,
  submitSafetyReview,
  acceptRecoveryOffer,
  declineRecoveryOffer,
  scheduleOfferPickup,
  confirmHotelHandover,
  completeRecoveryRun,
  getRecoveryNotifications,
  markNotificationRead,
  resetRecoveryData,
} from '@/lib/recovery/offerService';

import {
  NumericalForecast,
  LLMExplanation,
  ConsumptionRecord,
  SurplusListing,
  RecoveryOrganization,
  HistoryRecord,
  ServiceType,
  AuthUser,
  UserRole,
  FoodRecoveryOffer,
  FoodRecoveryNotification,
  FoodUnit,
} from '@/types/foodflow';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEMO_HOTEL_USER);
  
  // Hotel Operations state
  const [forecast, setForecast] = useState<NumericalForecast>(INITIAL_NUMERICAL_FORECAST);
  const [explanation, setExplanation] = useState<LLMExplanation>(INITIAL_LLM_EXPLANATION);
  const [consumption, setConsumption] = useState<ConsumptionRecord>(INITIAL_CONSUMPTION);
  const [surplusListing, setSurplusListing] = useState<SurplusListing>(INITIAL_SURPLUS_LISTING);
  const [organizations, setOrganizations] = useState<RecoveryOrganization[]>(DEMO_ORGANIZATIONS);
  const [history, setHistory] = useState<HistoryRecord[]>(DEMO_HISTORY);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Shared Food Recovery Ecosystem state
  const [recoveryOffers, setRecoveryOffers] = useState<FoodRecoveryOffer[]>(INITIAL_RECOVERY_OFFERS);
  const [notifications, setNotifications] = useState<FoodRecoveryNotification[]>(INITIAL_RECOVERY_NOTIFICATIONS);

  // Sync recovery data from shared data layer
  const syncRecoveryData = useCallback(async () => {
    const { offers } = await getRecoveryOffers();
    setRecoveryOffers(offers);
    const notifs = getRecoveryNotifications();
    setNotifications(notifs);
  }, []);

  // Hydrate persistent state on mount
  useEffect(() => {
    loadInitialState().then((state) => {
      setForecast(state.forecast);
      setExplanation(state.explanation);
      setConsumption(state.consumption);
      setSurplusListing(state.surplusListing);
      setOrganizations(state.organizations);
      setHistory(state.history);
      setIsSupabaseConnected(state.isSupabaseConnected);
    });

    syncRecoveryData();

    // Listen for custom cross-component update events
    const handleUpdateEvent = () => {
      syncRecoveryData();
    };

    window.addEventListener('foodflow_offers_updated', handleUpdateEvent);
    return () => window.removeEventListener('foodflow_offers_updated', handleUpdateEvent);
  }, [syncRecoveryData]);

  // Sync hash with screen navigation & enforce role permissions
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenId;
      const validScreens: ScreenId[] = [
        'overview',
        'login',
        'dashboard',
        'forecast',
        'preparation',
        'consumption',
        'analysis',
        'recovery',
        'organizations',
        'history',
        'architecture',
        'settings',
        'ngo_inbox',
        'ngo_pickups',
        'ngo_history',
        'notifications',
      ];
      if (validScreens.includes(hash)) {
        setActiveScreen(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (screen: ScreenId) => {
    setActiveScreen(screen);
    window.location.hash = screen;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Role switching helper for evaluators
  const handleSwitchRole = (targetRole: UserRole) => {
    if (targetRole === 'NGO') {
      setCurrentUser(DEMO_NGO);
      navigateTo('ngo_inbox');
    } else {
      setCurrentUser(DEMO_HOTEL_USER);
      navigateTo('dashboard');
    }
  };

  // Login handler
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'NGO') {
      navigateTo('ngo_inbox');
    } else {
      navigateTo('dashboard');
    }
  };

  // -------------------------------------------------------------
  // RECOVERY WORKFLOW ACTION HANDLERS (Shared Store Operations)
  // -------------------------------------------------------------

  const handleCreateOffer = async (data: {
    foodItem: string;
    dishCategory: string;
    quantity: number;
    unit: FoodUnit;
    servingsEquivalent?: number;
    preparationDateTime: string;
    availableUntil: string;
    pickupDeadline: string;
    storageCondition: 'Hot-holding (≥63°C)' | 'Refrigerated (≤4°C)' | 'Ambient / Dry';
    temperatureLoggedCelsius?: number;
    hotelLocation?: string;
    handlingNotes?: string;
  }) => {
    const res = await createRecoveryOffer(data, currentUser);
    if (!res.success) {
      throw new Error(res.error || 'Failed to create offer');
    }
    await syncRecoveryData();
  };

  const handleSubmitSafetyReview = async (
    offerId: string,
    review: {
      temperatureVerified: boolean;
      hygieneCheckPassed: boolean;
      packagingFoodGrade: boolean;
      responsibleStaffConfirmation: boolean;
      temperatureLoggedCelsius?: number;
      reviewedBy: string;
      reviewerDesignation: string;
      decision: 'ELIGIBLE_FOR_REVIEWED_PICKUP' | 'REJECTED';
      rejectionReason?: string;
      safetyNotes?: string;
    }
  ) => {
    const res = await submitSafetyReview(offerId, review, currentUser);
    if (!res.success) {
      throw new Error(res.error || 'Failed to submit safety review');
    }
    await syncRecoveryData();
  };

  const handleAcceptOffer = async (offerId: string) => {
    const res = await acceptRecoveryOffer(offerId, currentUser);
    if (!res.success) {
      throw new Error(res.error || 'Failed to accept offer');
    }
    await syncRecoveryData();
  };

  const handleDeclineOffer = async (offerId: string, reason: string) => {
    const res = await declineRecoveryOffer(offerId, reason, currentUser);
    if (!res.success) {
      throw new Error(res.error || 'Failed to decline offer');
    }
    await syncRecoveryData();
  };

  const handleSchedulePickup = async (
    offerId: string,
    details: {
      scheduledDateTime: string;
      vehicleType: string;
      driverContact: string;
      notes?: string;
    }
  ) => {
    const res = await scheduleOfferPickup(offerId, details, currentUser);
    if (!res.success) {
      throw new Error(res.error || 'Failed to schedule pickup');
    }
    await syncRecoveryData();
  };

  const handleConfirmHandover = async (offerId: string, temp?: number) => {
    const res = await confirmHotelHandover(offerId, temp, currentUser);
    if (!res.success) {
      throw new Error(res.error || 'Failed to confirm handover');
    }
    await syncRecoveryData();
  };

  const handleCompletePickup = async (offerId: string) => {
    const res = await completeRecoveryRun(offerId, currentUser);
    if (!res.success) {
      throw new Error(res.error || 'Failed to complete recovery');
    }
    await syncRecoveryData();
  };

  // -------------------------------------------------------------
  // HOTEL DEMAND FORECAST & CONSUMPTION HANDLERS
  // -------------------------------------------------------------

  const handleForecastGenerated = async (
    newForecast: NumericalForecast,
    newExplanation?: LLMExplanation,
    menu?: string
  ) => {
    setForecast(newForecast);
    const expl = newExplanation || explanation;
    setExplanation(expl);

    const updatedConsumption: ConsumptionRecord = {
      ...consumption,
      predictedDemand: newForecast.predictedDemand,
      mealsPrepared: newForecast.recommendedPreparation,
    };
    setConsumption(updatedConsumption);

    await persistDemandForecast(newForecast, expl, menu || 'Rice + Dal + Chicken');

    const updatedHistory: HistoryRecord = {
      date: 'Today',
      day: 'Wednesday',
      diners: newForecast.expectedDiners,
      forecast: newForecast.predictedDemand,
      prepared: newForecast.recommendedPreparation,
      actualServed: 0,
      variance: 0,
      surplus: 0,
      recoveryStatus: 'None (Zero Waste)',
    };
    setHistory((prev) => [updatedHistory, ...prev.slice(0, 15)]);
  };

  const handleUpdateConsumption = async (record: ConsumptionRecord) => {
    setConsumption(record);
    await persistConsumption(record);

    if (record.surplusDetected > 0) {
      setSurplusListing((prev) => ({
        ...prev,
        servings: record.surplusDetected,
        status: 'listed',
      }));
    }

    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const first = { ...prev[0] };
      first.prepared = record.mealsPrepared;
      first.actualServed = record.mealsServed;
      first.variance = record.mealsServed - record.predictedDemand;
      first.surplus = record.surplusDetected;
      first.recoveryStatus = record.surplusDetected > 0 ? 'Recovered' : 'None (Zero Waste)';
      return [first, ...prev.slice(1)];
    });
  };

  const handleUpdateListing = async (updated: SurplusListing) => {
    setSurplusListing(updated);
    await updateSurplusStage(updated.status, updated.assignedOrg);
  };

  const handleAcceptOrg = async (org: RecoveryOrganization) => {
    const updated = await updateSurplusStage('accepted', org.name);
    setSurplusListing(updated);
  };

  // Reset entire demo cycle
  const handleResetDemo = () => {
    const fresh = resetDemoState();
    resetRecoveryData();
    setForecast(fresh.forecast);
    setExplanation(fresh.explanation);
    setConsumption(fresh.consumption);
    setSurplusListing(fresh.surplusListing);
    setOrganizations(fresh.organizations);
    setHistory(fresh.history);
    setRecoveryOffers(INITIAL_RECOVERY_OFFERS);
    setNotifications(INITIAL_RECOVERY_NOTIFICATIONS);
  };

  const unreadNotifs = notifications.filter(
    (n) => !n.read && (n.targetRole === currentUser.role || n.targetRole === 'ALL')
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#141618] bg-grain selection:bg-[#EAF4EE] selection:text-[#1B4D36]">
      {/* Global Topbar Navigation */}
      <Header
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        unreadNotifCount={unreadNotifs}
        onOpenNotifications={() => navigateTo('notifications')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* PUBLIC & AUTH SCREENS */}
        {activeScreen === 'overview' && (
          <LandingScreen onNavigate={navigateTo} />
        )}

        {activeScreen === 'login' && (
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess}
            onNavigateLanding={() => navigateTo('overview')}
          />
        )}

        {/* ============================================================== */}
        {/* HOTEL DASHBOARDS & SCREENS                                     */}
        {/* ============================================================== */}
        {activeScreen === 'dashboard' && (
          <DashboardScreen
            onNavigate={navigateTo}
            forecast={forecast}
            explanation={explanation}
            consumption={consumption}
          />
        )}

        {activeScreen === 'forecast' && (
          <ForecastScreen
            onForecastGenerated={handleForecastGenerated}
            onNavigate={navigateTo}
          />
        )}

        {activeScreen === 'preparation' && (
          <PreparationScreen
            onNavigate={navigateTo}
            predictedDiners={forecast.predictedDiners || forecast.predictedDemand || 795}
            initialService={(forecast.serviceMeal?.toUpperCase() as ServiceType) || 'LUNCH'}
            forecast={forecast}
          />
        )}

        {activeScreen === 'consumption' && (
          <ConsumptionScreen
            onNavigate={navigateTo}
            onUpdateConsumption={handleUpdateConsumption}
            forecast={forecast}
          />
        )}

        {activeScreen === 'analysis' && (
          <AnalysisScreen
            onNavigate={navigateTo}
            predicted={forecast.predictedDemand}
            served={consumption.mealsServed}
            prepared={consumption.mealsPrepared}
          />
        )}

        {activeScreen === 'recovery' && (
          <RecoveryScreen 
            onNavigate={navigateTo}
            currentUser={currentUser}
            offers={recoveryOffers}
            onCreateOffer={handleCreateOffer}
            onSubmitSafetyReview={handleSubmitSafetyReview}
            onConfirmHandover={handleConfirmHandover}
            onRefresh={syncRecoveryData}
            surplusQuantity={consumption.surplusDetected}
          />
        )}

        {activeScreen === 'organizations' && (
          <OrganizationsScreen 
            onNavigate={navigateTo}
            organizations={organizations}
            onAcceptOrg={handleAcceptOrg}
          />
        )}

        {activeScreen === 'history' && (
          <HistoryScreen 
            onNavigate={navigateTo}
            history={history}
          />
        )}

        {activeScreen === 'architecture' && (
          <ArchitectureScreen />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen 
            onNavigate={navigateTo} 
          />
        )}

        {/* ============================================================== */}
        {/* NGO RECOVERY DASHBOARDS & SCREENS                              */}
        {/* ============================================================== */}
        {activeScreen === 'ngo_inbox' && (
          <NgoInboxScreen
            onNavigate={navigateTo}
            currentUser={currentUser}
            offers={recoveryOffers}
            onAcceptOffer={handleAcceptOffer}
            onDeclineOffer={handleDeclineOffer}
            onSchedulePickup={handleSchedulePickup}
            onCompletePickup={handleCompletePickup}
            onRefresh={syncRecoveryData}
            isRemote={isSupabaseConnected}
          />
        )}

        {activeScreen === 'ngo_pickups' && (
          <NgoPickupsScreen
            onNavigate={navigateTo}
            currentUser={currentUser}
            offers={recoveryOffers}
            onSchedulePickup={handleSchedulePickup}
            onCompletePickup={handleCompletePickup}
            onRefresh={syncRecoveryData}
          />
        )}

        {activeScreen === 'ngo_history' && (
          <NgoHistoryScreen
            onNavigate={navigateTo}
            currentUser={currentUser}
            offers={recoveryOffers}
          />
        )}

        {/* NOTIFICATIONS AUDIT LOG SCREEN */}
        {activeScreen === 'notifications' && (
          <NotificationsScreen
            onNavigate={navigateTo}
            currentUser={currentUser}
            notifications={notifications}
            onMarkAllRead={() => {
              notifications.forEach((n) => markNotificationRead(n.id));
              syncRecoveryData();
            }}
            onRefresh={syncRecoveryData}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer 
        onNavigate={navigateTo} 
        isSupabaseConnected={isSupabaseConnected} 
        onResetDemo={handleResetDemo} 
      />
    </div>
  );
}
