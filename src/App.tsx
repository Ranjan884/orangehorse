import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AthleteNavbar, ActiveTabType } from './components/AthleteNavbar';
import { AthleteHeroMetrics } from './components/AthleteHeroMetrics';
import { WorkloadChartSection } from './components/WorkloadChartSection';
import { SevenDayPlanSection } from './components/SevenDayPlanSection';
import { SimulationControls } from './components/SimulationControls';
import { AICoachChatSection } from './components/AICoachChatSection';
import { RawDataSection } from './components/RawDataSection';
import { AppGuideModal } from './components/AppGuideModal';
import { LogWorkoutModal } from './components/LogWorkoutModal';
import { NeuralOnboardingModal } from './components/NeuralOnboardingModal';
import {
  generateInitialHistory,
  calculateMetrics,
  generateAutonomousPlan,
  exportToCSV,
} from './utils/sportsScience';
import { AthleteSession, MatchFixture, MicrocycleDay, AthleteProfile } from './types';

export function App() {
  // Navigation tab: overview, analytics, microcycle, coach, simulation, logs
  const [activeTab, setActiveTab] = useState<ActiveTabType>('overview');

  // Modals state
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showLogWorkout, setShowLogWorkout] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Athlete Profile: Check localStorage to see if user has already made a custom profile
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile>(() => {
    try {
      const saved = localStorage.getItem('neural_athlete_profile_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return {
      name: '',
      sport: 'Soccer',
      positionOrDiscipline: '',
      goal: 'competition',
      experienceLevel: 'Advanced',
      daysPerWeek: 5,
      baselineIntensity: 'Moderate',
      isCustomProfile: false,
    };
  });

  // Onboarding prompt: If profile is not customized yet, prompt user immediately on startup!
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('neural_athlete_profile_v2');
      return !saved;
    } catch {
      return true;
    }
  });

  // 28-Day Historical Telemetry calibrated to athlete profile
  const [sessions, setSessions] = useState<AthleteSession[]>(() =>
    generateInitialHistory(athleteProfile)
  );

  // Current Systemic Recovery / Sleep Readiness Score
  const [recoveryScore, setRecoveryScore] = useState<number>(78);

  // Scheduled Match & Competition Fixtures
  const [fixtures, setFixtures] = useState<MatchFixture[]>([
    {
      id: 'fix-1',
      opponent: 'Championship Tournament',
      competition: 'Key Competition',
      date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      daysAway: 4,
      importance: 'high',
    },
  ]);

  // Coach Manual Overrides for 7-Day Plan
  const [coachOverrides, setCoachOverrides] = useState<{
    [dayNum: number]: Partial<MicrocycleDay>;
  }>({});

  // Gemini AI Coach Executive Briefing
  const [coachSummary, setCoachSummary] = useState<string>(
    'Synthesizing autonomous sports-science workload briefing from live telemetry...'
  );
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [summarySource, setSummarySource] = useState<string>('Gemini 3.8 Flash');

  // Compute live metrics (ACWR, Acute Load, Chronic Load, Injury Risk %)
  const metrics = useMemo(() => {
    return calculateMetrics(sessions, recoveryScore);
  }, [sessions, recoveryScore]);

  // Compute 7-day autonomous microcycle plan & sports-science audit logs
  const { plan, logs } = useMemo(() => {
    return generateAutonomousPlan(
      metrics.chronicLoad,
      recoveryScore,
      metrics.currentACWR,
      fixtures,
      coachOverrides
    );
  }, [metrics.chronicLoad, recoveryScore, metrics.currentACWR, fixtures, coachOverrides]);

  // Fetch AI Coach Summary from backend Express API
  const fetchCoachSummary = useCallback(async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/coach-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteName: athleteProfile.name || 'Athlete',
          sport: athleteProfile.sport,
          goal: athleteProfile.goal,
          currentACWR: metrics.currentACWR,
          acuteLoad: metrics.acuteLoad,
          chronicLoad: metrics.chronicLoad,
          recoveryScore: metrics.recoveryScore,
          injuryRiskPct: metrics.injuryRiskPct,
          upcomingMatches: fixtures,
          sevenDayPlan: plan.map((d) => ({
            dayNumber: d.dayNumber,
            dayName: d.dayName,
            sessionType: d.sessionType,
            targetLoad: d.targetLoad,
            focus: d.focus,
          })),
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setCoachSummary(data.summary);
        setSummarySource(data.source || 'gemini-3.8-flash');
      }
    } catch (err) {
      console.error('Error fetching AI coach summary:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [metrics, fixtures, plan, athleteProfile]);

  // Fetch initial summary on mount
  useEffect(() => {
    fetchCoachSummary();
  }, []);

  // Handle Profile Creation / Recalibration
  const handleProfileComplete = (newProfile: AthleteProfile, fixture?: MatchFixture) => {
    try {
      localStorage.setItem('neural_athlete_profile_v2', JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Unable to persist profile to localStorage:', e);
    }

    setAthleteProfile(newProfile);
    setShowOnboarding(false);
    setShowProfileModal(false);

    // Recalibrate 28-day telemetry based on new user profile
    const calibratedSessions = generateInitialHistory(newProfile);
    setSessions(calibratedSessions);

    if (fixture) {
      setFixtures([fixture]);
    }

    // Refresh coach summary with new profile data
    setTimeout(() => {
      fetchCoachSummary();
    }, 200);
  };

  // Update a single day's plan
  const handleUpdateDay = (dayNumber: number, override: Partial<MicrocycleDay>) => {
    setCoachOverrides((prev) => ({
      ...prev,
      [dayNumber]: {
        ...prev[dayNumber],
        ...override,
      },
    }));
  };

  // Reset a single day's override
  const handleResetDay = (dayNumber: number) => {
    setCoachOverrides((prev) => {
      const next = { ...prev };
      delete next[dayNumber];
      return next;
    });
  };

  // Reset all overrides
  const handleResetAllOverrides = () => {
    setCoachOverrides({});
  };

  // Apply What-If Simulation
  const handleApplySimulation = (simLoad: number, simRecovery: number) => {
    setRecoveryScore(simRecovery);
    setSessions((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const last = { ...updated[updated.length - 1] };
        last.load = simLoad;
        last.recovery = simRecovery;
        last.sessionType =
          simLoad >= 900
            ? 'Match'
            : simLoad === 0
            ? 'Rest Day'
            : simLoad <= 250
            ? 'Recovery Block'
            : simLoad > 650
            ? 'Development Session'
            : 'Tactical Session';
        updated[updated.length - 1] = last;
      }
      return updated;
    });
  };

  // Reset What-If Simulation
  const handleResetSimulation = () => {
    setSessions(generateInitialHistory(athleteProfile));
    setRecoveryScore(78);
    setCoachOverrides({});
  };

  // Add Fixture
  const handleAddFixture = (fixture: Omit<MatchFixture, 'id'>) => {
    const newFix: MatchFixture = {
      ...fixture,
      id: `fix-${Date.now()}`,
    };
    setFixtures((prev) => [...prev, newFix].sort((a, b) => a.daysAway - b.daysAway));
  };

  // Delete Fixture
  const handleDeleteFixture = (id: string) => {
    setFixtures((prev) => prev.filter((f) => f.id !== id));
  };

  // Log a new session from modal
  const handleSaveLoggedSession = (newSession: AthleteSession) => {
    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.date === newSession.date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newSession;
        return updated;
      }
      return [...prev, newSession];
    });

    if (newSession.recovery) {
      setRecoveryScore(newSession.recovery);
    }
  };

  // 1-Click Quick Recalibrations
  const handleQuickTiredAction = () => {
    handleUpdateDay(1, {
      sessionType: 'Recovery Block',
      targetLoad: 180,
      focus: 'Active recovery flush & mobility (Restored Balance)',
    });
    setRecoveryScore((prev) => Math.max(45, prev - 15));
  };

  const handleQuickMissedWorkoutAction = () => {
    handleUpdateDay(1, {
      sessionType: 'Tactical Session',
      targetLoad: 420,
      focus: 'Technical skills & movement without joint overload',
    });
  };

  const handleQuickCompetitionTaperAction = () => {
    handleUpdateDay(2, {
      sessionType: 'Taper Session',
      targetLoad: 280,
      focus: 'Short explosive speed & reaction sharpness',
    });
    handleUpdateDay(3, {
      sessionType: 'Taper Session',
      targetLoad: 200,
      focus: 'Pre-game neuromuscular priming & stretch',
    });
  };

  // CSV Import/Export
  const handleImportSessions = (newSessions: AthleteSession[]) => {
    setSessions(newSessions);
  };

  const handleExportPlanCSV = () => {
    exportToCSV(plan, `Neural_Microcycle_Plan_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportHistoryCSV = () => {
    exportToCSV(sessions, `Neural_Telemetry_28D_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const nextMatch = fixtures.length > 0 ? fixtures[0] : undefined;

  return (
    <div className="min-h-screen bg-[#04060B] text-slate-100 bg-neural-grid selection:bg-cyan-500 selection:text-black pb-20 relative overflow-x-hidden">
      {/* Background Ambient Cyber Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Floating Cyber Navbar */}
      <AthleteNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        metrics={metrics}
        onOpenGuide={() => setShowGuide(true)}
        onOpenLogWorkout={() => setShowLogWorkout(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        profile={athleteProfile}
      />

      {/* Main Single-Tab Viewport with Fluid Transitions */}
      <main className="pt-24 sm:pt-28 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AthleteHeroMetrics
                metrics={metrics}
                nextMatch={nextMatch}
                coachSummary={coachSummary}
                isGeneratingSummary={isGeneratingSummary}
                onRefreshSummary={fetchCoachSummary}
                summarySource={summarySource}
                profile={athleteProfile}
                onOpenGuide={() => setShowGuide(true)}
                onOpenProfile={() => setShowProfileModal(true)}
                onNavigateTab={setActiveTab}
                onQuickTiredAction={handleQuickTiredAction}
                onQuickMissedWorkoutAction={handleQuickMissedWorkoutAction}
                onQuickCompetitionTaperAction={handleQuickCompetitionTaperAction}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <WorkloadChartSection sessions={sessions} />
            </motion.div>
          )}

          {activeTab === 'microcycle' && (
            <motion.div
              key="microcycle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <SevenDayPlanSection
                plan={plan}
                logs={logs}
                onUpdateDay={handleUpdateDay}
                onResetDay={handleResetDay}
                onResetAllOverrides={handleResetAllOverrides}
                onExportCSV={handleExportPlanCSV}
                currentChronicLoad={metrics.chronicLoad}
              />
            </motion.div>
          )}

          {activeTab === 'coach' && (
            <motion.div
              key="coach"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AICoachChatSection
                metrics={metrics}
                plan={plan}
                fixtures={fixtures}
                profile={athleteProfile}
              />
            </motion.div>
          )}

          {activeTab === 'simulation' && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <SimulationControls
                currentLoad={sessions[sessions.length - 1]?.load || 500}
                currentRecovery={recoveryScore}
                onApplySimulation={handleApplySimulation}
                onResetSimulation={handleResetSimulation}
                fixtures={fixtures}
                onAddFixture={handleAddFixture}
                onDeleteFixture={handleDeleteFixture}
              />
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <RawDataSection
                sessions={sessions}
                onImportSessions={handleImportSessions}
                onExportCSV={handleExportHistoryCSV}
                onOpenLogWorkout={() => setShowLogWorkout(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mandatory Onboarding Modal for First Time Users */}
      <NeuralOnboardingModal
        isOpen={showOnboarding}
        onComplete={handleProfileComplete}
      />

      {/* Recalibrate Profile Modal */}
      {showProfileModal && (
        <NeuralOnboardingModal
          isOpen={showProfileModal}
          onComplete={handleProfileComplete}
          initialProfile={athleteProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* System Guide / Tutorial Modal */}
      <AppGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Log Workout Modal */}
      <LogWorkoutModal
        isOpen={showLogWorkout}
        onClose={() => setShowLogWorkout(false)}
        onSaveSession={handleSaveLoggedSession}
        currentSport={athleteProfile.sport}
      />

      {/* Cyber Footer */}
      <footer className="mt-20 pt-8 pb-12 border-t border-cyan-500/20 text-center text-xs font-mono-code text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF] animate-pulse" />
            <span className="text-slate-300 font-bold">
              NEURAL // INTERFACE • ATHLETIC PERFORMANCE OS
            </span>
          </div>
          <span className="text-slate-400">
            Tim Gabbett ACWR (0.80–1.30 Sweet Spot) • Gemini 3.8 Flash Grounding
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
