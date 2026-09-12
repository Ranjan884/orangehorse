import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Target,
  Trophy,
  ChevronRight,
  UserCheck,
  HelpCircle,
  Flame,
  Info,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { AthleteMetrics, MatchFixture, AthleteProfile } from '../types';

interface AthleteHeroMetricsProps {
  metrics: AthleteMetrics;
  nextMatch?: MatchFixture;
  coachSummary: string;
  isGeneratingSummary: boolean;
  onRefreshSummary: () => void;
  summarySource?: string;
  profile?: AthleteProfile;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
}

export const AthleteHeroMetrics: React.FC<AthleteHeroMetricsProps> = ({
  metrics,
  nextMatch,
  coachSummary,
  isGeneratingSummary,
  onRefreshSummary,
  summarySource,
  profile = {
    name: 'Alexandre Mercer',
    sport: 'Soccer',
    positionOrDiscipline: '#8 Midfielder',
    goal: 'competition',
    experienceLevel: 'Advanced',
  },
  onOpenGuide,
  onOpenSettings,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (key: string) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  const sportEmojis: Record<string, string> = {
    Soccer: '⚽',
    Running: '🏃',
    Equestrian: '🐎',
    Cycling: '🚴',
    Gym: '🏋️',
    Tennis: '🎾',
    Basketball: '🏀',
  };

  const currentSportEmoji = sportEmojis[profile.sport] || '🏃';

  return (
    <section className="pt-24 sm:pt-28 pb-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Friendly Athlete Profile Ribbon with Orange Horse Energy */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card border border-orange-200/90 shadow-sm mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Athlete Avatar with Sport Icon */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5500] to-[#FF7700] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span>{currentSportEmoji}</span>
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs">🐎</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                {profile.name}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono-code font-bold rounded-full bg-orange-100 text-[#FF5500]">
                {profile.sport} • {profile.positionOrDiscipline}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                <UserCheck className="w-3 h-3" /> Safe Zone Active
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-2">
              <span>Goal: <strong>{profile.goal === 'competition' ? 'Peak for Competition' : profile.goal === 'injury-free' ? 'Stay Injury-Free' : 'Build Endurance'}</strong></span>
              <button
                onClick={onOpenSettings}
                className="text-[#FF5500] hover:underline font-semibold text-[11px] flex items-center gap-0.5"
              >
                Change Options <ChevronRight className="w-3 h-3 inline" />
              </button>
            </p>
          </div>
        </div>

        {/* Upcoming Competition / Match Card */}
        {nextMatch ? (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/80 border border-orange-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5500] flex items-center justify-center font-bold text-base">
              <Trophy className="w-4 h-4 text-[#FF5500]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  Target Event: {nextMatch.opponent}
                </span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold uppercase">
                  {nextMatch.daysAway} days away
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono-code">
                {nextMatch.competition} • Automatic taper planned before kickoff
              </p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-500 font-mono-code bg-white/60 px-3 py-2 rounded-xl">
            No competitions scheduled in the next 7 days
          </div>
        )}
      </div>

      {/* Beginner Welcome Banner: "New here? 1-minute visual guide" */}
      <div className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-orange-100/90 via-amber-50 to-orange-50 border border-orange-200/90 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">💡</span>
          <div>
            <span className="text-xs font-bold text-neutral-900 block sm:inline mr-2">
              New to training numbers?
            </span>
            <span className="text-xs text-neutral-600">
              Keep your <strong>Training Balance</strong> between 0.8 and 1.3 to get stronger without pulling muscles.
            </span>
          </div>
        </div>
        <button
          onClick={onOpenGuide}
          className="px-3 py-1.5 rounded-xl bg-white text-[#FF5500] hover:bg-orange-50 border border-orange-200 text-xs font-bold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
        >
          <span>See Simple Guide</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Core Human-Friendly Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Metric 1: Training Balance (Sweet Spot Ratio / ACWR) */}
        <div className="p-5 rounded-3xl glass-card flex flex-col justify-between group hover:border-orange-300 transition-all relative">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-800">
                  Training Balance
                </span>
                <button
                  onClick={() => toggleTooltip('balance')}
                  className="text-neutral-400 hover:text-[#FF5500]"
                  title="What is Training Balance?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              <span
                className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-bold ${
                  metrics.acwrStatus === 'sweet-spot'
                    ? 'bg-emerald-100 text-emerald-800'
                    : metrics.acwrStatus === 'caution'
                    ? 'bg-amber-100 text-amber-800'
                    : metrics.acwrStatus === 'danger'
                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {metrics.acwrStatus === 'sweet-spot'
                  ? '🟢 Sweet Spot'
                  : metrics.acwrStatus === 'caution'
                  ? '🟡 Watch Load'
                  : metrics.acwrStatus === 'danger'
                  ? '🔴 High Spike'
                  : '🔵 Under-load'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl sm:text-4xl font-black font-mono-code text-neutral-900">
                {metrics.currentACWR.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-[#FF5500]">Ratio</span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Target corridor: <strong className="text-neutral-900">0.80 – 1.30</strong>. Puts your body in prime adaptive zone.
            </p>

            {/* In-card explanatory popup */}
            <AnimatePresence>
              {activeTooltip === 'balance' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-neutral-700 leading-normal"
                >
                  <strong>What this means:</strong> Compares your hard work this week against what your body is used to. Below 0.8 is too easy; 0.8–1.3 builds fitness safely; over 1.5 triggers pulled muscles.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-between text-[11px] font-mono-code text-neutral-500">
            <span>Weekly Work / Fitness Base</span>
            <span className="font-bold text-neutral-800">
              {Math.round((metrics.acuteLoad / (metrics.chronicLoad || 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* Metric 2: This Week's Effort (Acute Load / Fatigue) */}
        <div className="p-5 rounded-3xl glass-card flex flex-col justify-between group hover:border-orange-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-800">
                  This Week's Effort
                </span>
                <button
                  onClick={() => toggleTooltip('acute')}
                  className="text-neutral-400 hover:text-[#FF5500]"
                  title="What is This Week's Effort?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5500] font-bold">
                Last 7 Days
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl sm:text-4xl font-black font-mono-code text-neutral-900">
                {metrics.acuteLoad}
              </span>
              <span className="text-xs font-semibold text-neutral-500">Load Points (AU)</span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Total stress accumulated over your past 7 days. Reflects immediate fatigue.
            </p>

            <AnimatePresence>
              {activeTooltip === 'acute' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-neutral-700 leading-normal"
                >
                  <strong>Think of this as fatigue:</strong> How much exertion and sweat you accumulated in the past week.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-between text-[11px] font-mono-code text-neutral-500">
            <span>Daily Average Strain</span>
            <span className="font-bold text-neutral-800">{Math.round(metrics.acuteLoad / 7)} pts / day</span>
          </div>
        </div>

        {/* Metric 3: Long-Term Fitness Base (Chronic Load / Aerobic Engine) */}
        <div className="p-5 rounded-3xl glass-card flex flex-col justify-between group hover:border-orange-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-800">
                  Fitness Base Engine
                </span>
                <button
                  onClick={() => toggleTooltip('chronic')}
                  className="text-neutral-400 hover:text-[#FF5500]"
                  title="What is Fitness Base Engine?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold">
                4-Week Baseline
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl sm:text-4xl font-black font-mono-code text-neutral-900">
                {metrics.chronicLoad}
              </span>
              <span className="text-xs font-semibold text-neutral-500">Base Points</span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Your physical capacity built over 28 days. Protects you like biological armor.
            </p>

            <AnimatePresence>
              {activeTooltip === 'chronic' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-neutral-700 leading-normal"
                >
                  <strong>Think of this as your bank account:</strong> A high fitness base lets you train hard and play intense games without getting sore or hurt.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-between text-[11px] font-mono-code text-neutral-500">
            <span>Stamina Foundation</span>
            <span className="font-bold text-emerald-700">Robust</span>
          </div>
        </div>

        {/* Metric 4: Body Battery & Energy (Recovery Score) */}
        <div className="p-5 rounded-3xl glass-card flex flex-col justify-between group hover:border-orange-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-800">
                  Body Battery &amp; Energy
                </span>
                <HeartPulse className="w-3.5 h-3.5 text-[#FF5500]" />
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                Readiness
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl sm:text-4xl font-black font-mono-code text-neutral-900">
                {metrics.recoveryScore}%
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {metrics.recoveryScore >= 70 ? 'Prime' : metrics.recoveryScore >= 50 ? 'Moderate' : 'Low'}
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {metrics.recoveryScore >= 70
                ? 'High recovery. Fully cleared for hard sprint intervals and match drills.'
                : metrics.recoveryScore >= 50
                ? 'Moderate recovery. Keep training moderate, prioritize deep sleep.'
                : 'Body is drained. Recommend active stretching and light movement only.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-between text-[11px] font-mono-code text-neutral-500">
            <span>Sleep &amp; Resting Heart Rate</span>
            <span className="font-bold text-emerald-700">Good Quality</span>
          </div>
        </div>
      </div>

      {/* Row 2: Injury Risk Meter + AI Coach Advice in warm obsidian card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Injury Risk Meter Card */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-card flex flex-col justify-between border border-orange-200">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF5500]" />
                <h3 className="font-bold text-sm text-neutral-900">Injury Risk Meter</h3>
              </div>
              <span className={`text-sm font-bold font-mono-code ${
                metrics.injuryRiskPct < 30 ? 'text-emerald-700' : metrics.injuryRiskPct < 60 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {metrics.injuryRiskPct}%
              </span>
            </div>

            <p className="text-xs text-neutral-600 mb-4">
              Calculates your likelihood of muscle pulls or joint fatigue based on sudden volume jumps.
            </p>

            {/* Visual Risk Progress Bar */}
            <div className="w-full bg-neutral-200/80 h-3.5 rounded-full overflow-hidden relative mb-2 p-0.5">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  metrics.injuryRiskPct < 30
                    ? 'bg-emerald-500'
                    : metrics.injuryRiskPct < 60
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(5, metrics.injuryRiskPct)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono-code text-neutral-500">
              <span className="text-emerald-700 font-bold">🟢 Safe (0-30%)</span>
              <span className="text-amber-700 font-bold">🟡 Caution (31-60%)</span>
              <span className="text-rose-700 font-bold">🔴 Danger (&gt;60%)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-100 text-xs text-neutral-700">
            <span className="font-bold text-neutral-900">Current Advice: </span>
            {metrics.injuryRiskPct < 30
              ? 'Low strain probability. Full clearance to execute planned training.'
              : metrics.injuryRiskPct < 60
              ? 'Moderate strain risk. Cap maximum sprints, hydrate well, and avoid double sessions.'
              : 'DANGER SPIKE: High risk of soft-tissue pull. AI recommends immediate de-load.'}
          </div>
        </div>

        {/* AI Performance Coach Advice (Warm Obsidian Card with Orange Horse Glow) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-[#1A1613] text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-orange-950">
          {/* Subtle warm orange top glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#FF5500] text-white flex items-center justify-center font-bold text-xs">
                  🐎
                </div>
                <h3 className="font-bold text-sm text-white">
                  Daily AI Coach Advice (Simple Game Plan)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-white/10 text-orange-200">
                  {summarySource || 'Gemini 3.8 Flash'}
                </span>
              </div>

              <button
                onClick={onRefreshSummary}
                disabled={isGeneratingSummary}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono-code flex items-center gap-1.5 transition-colors disabled:opacity-50"
                id="btn-hero-refresh-summary"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                <span>{isGeneratingSummary ? 'Analyzing...' : 'Refresh Advice'}</span>
              </button>
            </div>

            <div className="font-mono-code text-xs sm:text-sm text-orange-50/90 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
              {isGeneratingSummary ? (
                <div className="flex items-center gap-2 text-orange-200 py-3">
                  <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
                  <span>AI coach analyzing your 28-day training logs and upcoming event...</span>
                </div>
              ) : (
                <p className="whitespace-pre-line">{coachSummary}</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] font-mono-code text-neutral-400 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
              Continuous Sports-Science Optimization Engine
            </span>
            <span className="text-orange-300/80">
              Personalized for {profile.sport} ({profile.name})
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
