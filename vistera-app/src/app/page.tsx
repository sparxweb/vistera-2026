'use client';

import React, { useState, useEffect } from 'react';
import { Header, ScreenId } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LandingScreen } from '@/components/screens/LandingScreen';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { ForecastScreen } from '@/components/screens/ForecastScreen';
import { ConsumptionScreen } from '@/components/screens/ConsumptionScreen';
import { RecoveryScreen } from '@/components/screens/RecoveryScreen';
import { OrganizationsScreen } from '@/components/screens/OrganizationsScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';
import { ArchitectureScreen } from '@/components/screens/ArchitectureScreen';
import { AnalysisScreen } from '@/components/screens/AnalysisScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { 
  INITIAL_NUMERICAL_FORECAST, 
  INITIAL_LLM_EXPLANATION, 
  INITIAL_CONSUMPTION,
  INITIAL_SURPLUS_LISTING,
  DEMO_ORGANIZATIONS,
  DEMO_HISTORY,
} from '@/lib/demoData';
import {
  loadInitialState,
  persistDemandForecast,
  persistConsumption,
  updateSurplusStage,
  resetDemoState,
} from '@/lib/supabase/service';
import {
  NumericalForecast,
  LLMExplanation,
  ConsumptionRecord,
  SurplusListing,
  RecoveryOrganization,
  HistoryRecord,
} from '@/types/foodflow';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [forecast, setForecast] = useState<NumericalForecast>(INITIAL_NUMERICAL_FORECAST);
  const [explanation, setExplanation] = useState<LLMExplanation>(INITIAL_LLM_EXPLANATION);
  const [consumption, setConsumption] = useState<ConsumptionRecord>(INITIAL_CONSUMPTION);
  const [surplusListing, setSurplusListing] = useState<SurplusListing>(INITIAL_SURPLUS_LISTING);
  const [organizations, setOrganizations] = useState<RecoveryOrganization[]>(DEMO_ORGANIZATIONS);
  const [history, setHistory] = useState<HistoryRecord[]>(DEMO_HISTORY);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Hydrate persistent state from Supabase or resilient LocalStorage on load
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
  }, []);

  // Sync hash with screen navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenId;
      const validScreens: ScreenId[] = [
        'overview',
        'dashboard',
        'forecast',
        'consumption',
        'analysis',
        'recovery',
        'organizations',
        'history',
        'architecture',
        'settings',
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

  // Forecast generation handler
  const handleForecastGenerated = async (
    newForecast: NumericalForecast,
    newExplanation?: LLMExplanation,
    menu?: string
  ) => {
    setForecast(newForecast);
    const expl = newExplanation || explanation;
    setExplanation(expl);

    // Update consumption predicted baseline
    const updatedConsumption: ConsumptionRecord = {
      ...consumption,
      predictedDemand: newForecast.predictedDemand,
      mealsPrepared: newForecast.recommendedPreparation,
    };
    setConsumption(updatedConsumption);

    // Persist to Supabase / LocalStorage
    await persistDemandForecast(newForecast, expl, menu || 'Rice + Dal + Chicken');

    // Update history
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

  // Consumption update handler
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

    // Refresh history record with actual served
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

  // Surplus listing state update
  const handleUpdateListing = async (updated: SurplusListing) => {
    setSurplusListing(updated);
    await updateSurplusStage(updated.status, updated.assignedOrg);

    if (updated.status === 'collected') {
      setHistory((prev) => {
        if (prev.length === 0) return prev;
        const first = { ...prev[0] };
        first.recoveryStatus = 'Recovered';
        return [first, ...prev.slice(1)];
      });
    }
  };

  // Recovery partner dispatch acceptance
  const handleAcceptOrg = async (org: RecoveryOrganization) => {
    const updated = await updateSurplusStage('accepted', org.name);
    setSurplusListing(updated);
  };

  // Reset demo cycle
  const handleResetDemo = () => {
    const fresh = resetDemoState();
    setForecast(fresh.forecast);
    setExplanation(fresh.explanation);
    setConsumption(fresh.consumption);
    setSurplusListing(fresh.surplusListing);
    setOrganizations(fresh.organizations);
    setHistory(fresh.history);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#141618] bg-grain selection:bg-[#EAF4EE] selection:text-[#1B4D36]">
      {/* Global Topbar Navigation */}
      <Header
        activeScreen={activeScreen}
        onNavigate={navigateTo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeScreen === 'overview' && (
          <LandingScreen onNavigate={navigateTo} />
        )}

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

        {activeScreen === 'consumption' && (
          <ConsumptionScreen
            onNavigate={navigateTo}
            onUpdateConsumption={handleUpdateConsumption}
            predicted={forecast.predictedDemand}
            initialPrepared={forecast.recommendedPreparation}
            initialServed={consumption.mealsServed}
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
            listing={surplusListing}
            onUpdateListing={handleUpdateListing}
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
