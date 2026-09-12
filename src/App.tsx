import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AthleteNavbar } from './components/AthleteNavbar';
import { AthleteHeroMetrics } from './components/AthleteHeroMetrics';
import { WorkloadChartSection } from './components/WorkloadChartSection';
import { SevenDayPlanSection } from './components/SevenDayPlanSection';
import { SimulationControls } from './components/SimulationControls';
import { AICoachChatSection } from './components/AICoachChatSection';
import { RawDataSection } from './components/RawDataSection';
import { AppGuideModal } from './components/AppGuideModal';
import { LogWorkoutModal } from './components/LogWorkoutModal';
import { AthleteSettingsModal } from './components/AthleteSettingsModal';
import {
  generateInitialHistory,
  calculateMetrics,
  generateAutonomousPlan,
  exportToCSV,
} from './utils/sportsScience';
import { AthleteSession, MatchFixture, MicrocycleDay, AthleteProfile } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'plan' | 'ai-coach' | 'simulation' | 'raw-data'
  >('dashboard');

  // Modals state
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showLogWorkout, setShowLogWorkout] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Athlete Profile
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile>({
    name: 'Alexandre Mercer',
    sport: 'Soccer',
    positionOrDiscipline: '#8 Central Midfielder',
    goal: 'competition',
    experienceLevel: 'Advanced',
  });

  // 28-Day Historical telemetry
  const [sessions, setSessions] = useState<AthleteSession[]>(() => generateInitialHistory());

  // Current Recovery Score
  const [recoveryScore, setRecoveryScore] = useState<number>(78);

  // Upcoming Match Fixtures
  const [fixtures, setFixtures] = useState<MatchFixture[]>([
    {
      id: 'fix-1',
      opponent: 'Red Star FC',
      competition: 'Champions Cup (QF)',
      date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      daysAway: 3,
      importance: 'high',
    },
    {
      id: 'fix-2',
      opponent: 'Olympique Lyon',
      competition: 'National League',
      date: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
      daysAway: 6,
      importance: 'medium',
    },
  ]);

  // Coach Manual Overrides for 7-day plan
  const [coachOverrides, setCoachOverrides] = useState<{
    [dayNum: number]: Partial<MicrocycleDay>;
  }>({});

  // Gemini AI Coach Executive Briefing
  const [coachSummary, setCoachSummary] = useState<string>(
    'Synthesizing autonomous sports-science workload briefing...'
  );
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [summarySource, setSummarySource] = useState<string>('Gemini 3.8 Flash');

  // Compute live metrics (ACWR, Acute, Chronic, Injury Risk)
  const metrics = useMemo(() => {
    return calculateMetrics(sessions, recoveryScore);
  }, [sessions, recoveryScore]);

  // Compute 7-day autonomous microcycle plan and reasoning logs
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
          athleteName: athleteProfile.name,
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

  // Apply Simulation
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

  // Reset Simulation to default
  const handleResetSimulation = () => {
    setSessions(generateInitialHistory());
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

  // Log a new workout from modal
  const handleSaveLoggedSession = (newSession: AthleteSession) => {
    setSessions((prev) => {
      // Check if session for date exists
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

  // 1-Click Quick Actions (from Options / Settings Modal)
  const handleQuickTiredAction = () => {
    // Change today (Day 1) to recovery block (200 AU)
    handleUpdateDay(1, {
      sessionType: 'Recovery Block',
      targetLoad: 180,
      focus: 'Active recovery flush & foam rolling (Restored Balance)',
    });
    setRecoveryScore((prev) => Math.max(45, prev - 15));
  };

  const handleQuickMissedWorkoutAction = () => {
    // Yesterday was 0 load, redistribute slightly across next 3 days
    handleUpdateDay(1, {
      sessionType: 'Tactical Session',
      targetLoad: 420,
      focus: 'Technical skills without overloading joints',
    });
  };

  const handleQuickCompetitionTaperAction = () => {
    // Set Day 2 and Day 3 to taper sessions
    handleUpdateDay(2, {
      sessionType: 'Taper Session',
      targetLoad: 280,
      focus: 'Short explosive speed & reaction sharpness',
    });
    handleUpdateDay(3, {
      sessionType: 'Taper Session',
      targetLoad: 200,
      focus: 'Pre-game priming & flexibility',
    });
  };

  // Import Telemetry Sessions
  const handleImportSessions = (newSessions: AthleteSession[]) => {
    setSessions(newSessions);
  };

  // Export 7-Day Plan CSV
  const handleExportPlanCSV = () => {
    exportToCSV(plan, `Microcycle_Plan_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Export 28-Day Raw Telemetry CSV
  const handleExportHistoryCSV = () => {
    exportToCSV(sessions, `Athlete_Telemetry_28D_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const nextMatch = fixtures.length > 0 ? fixtures[0] : undefined;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1D1814] selection:bg-[#FF5500] selection:text-white pb-20">
      {/* Top Floating Glass Navbar */}
      <AthleteNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        metrics={metrics}
        onTriggerSummary={fetchCoachSummary}
        isGeneratingSummary={isGeneratingSummary}
        onExportCSV={handleExportPlanCSV}
        onOpenGuide={() => setShowGuide(true)}
        onOpenLogWorkout={() => setShowLogWorkout(true)}
        onOpenSettings={() => setShowSettings(true)}
        currentSport={athleteProfile.sport}
      />

      {/* Main View Renderer based on activeTab */}
      <main>
        {activeTab === 'dashboard' && (
          <>
            <AthleteHeroMetrics
              metrics={metrics}
              nextMatch={nextMatch}
              coachSummary={coachSummary}
              isGeneratingSummary={isGeneratingSummary}
              onRefreshSummary={fetchCoachSummary}
              summarySource={summarySource}
              profile={athleteProfile}
              onOpenGuide={() => setShowGuide(true)}
              onOpenSettings={() => setShowSettings(true)}
            />

            <WorkloadChartSection sessions={sessions} />

            <SevenDayPlanSection
              plan={plan}
              logs={logs}
              onUpdateDay={handleUpdateDay}
              onResetDay={handleResetDay}
              onResetAllOverrides={handleResetAllOverrides}
              onExportCSV={handleExportPlanCSV}
              currentChronicLoad={metrics.chronicLoad}
            />
          </>
        )}

        {activeTab === 'plan' && (
          <div className="pt-24 sm:pt-28">
            <SevenDayPlanSection
              plan={plan}
              logs={logs}
              onUpdateDay={handleUpdateDay}
              onResetDay={handleResetDay}
              onResetAllOverrides={handleResetAllOverrides}
              onExportCSV={handleExportPlanCSV}
              currentChronicLoad={metrics.chronicLoad}
            />
          </div>
        )}

        {activeTab === 'ai-coach' && (
          <div className="pt-24 sm:pt-28">
            <AICoachChatSection
              metrics={metrics}
              plan={plan}
              fixtures={fixtures}
              profile={athleteProfile}
            />
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="pt-24 sm:pt-28">
            <SimulationControls
              currentLoad={sessions[sessions.length - 1]?.load || 500}
              currentRecovery={recoveryScore}
              onApplySimulation={handleApplySimulation}
              onResetSimulation={handleResetSimulation}
              fixtures={fixtures}
              onAddFixture={handleAddFixture}
              onDeleteFixture={handleDeleteFixture}
            />
          </div>
        )}

        {activeTab === 'raw-data' && (
          <div className="pt-24 sm:pt-28">
            <RawDataSection
              sessions={sessions}
              onImportSessions={handleImportSessions}
              onExportCSV={handleExportHistoryCSV}
              onOpenLogWorkout={() => setShowLogWorkout(true)}
            />
          </div>
        )}
      </main>

      {/* Guide / Tutorial Modal for normal people */}
      <AppGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Log Workout Modal */}
      <LogWorkoutModal
        isOpen={showLogWorkout}
        onClose={() => setShowLogWorkout(false)}
        onSaveSession={handleSaveLoggedSession}
        currentSport={athleteProfile.sport}
      />

      {/* Athlete Settings & Preferences Modal */}
      <AthleteSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        profile={athleteProfile}
        onUpdateProfile={(updated) => setAthleteProfile(updated)}
        onQuickTiredAction={handleQuickTiredAction}
        onQuickMissedWorkoutAction={handleQuickMissedWorkoutAction}
        onQuickCompetitionTaperAction={handleQuickCompetitionTaperAction}
      />

      {/* Footer */}
      <footer className="mt-16 pt-8 pb-12 border-t border-orange-200/60 text-center text-xs font-mono-code text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
            <span className="text-neutral-700 font-bold">
              OrangeHorse • Autonomous Athlete Performance Planner
            </span>
          </div>
          <span>
            Training Sweet Spot Engine (0.8–1.3 ACWR) • Multi-Sport Guardrails • Gemini 3.8 Intelligence
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
