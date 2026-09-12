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
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sliders,
  ChevronRight,
  User,
  Clock,
} from 'lucide-react';
import { AthleteMetrics, MatchFixture, AthleteProfile } from '../types';

interface AthleteHeroMetricsProps {
  metrics: AthleteMetrics;
  nextMatch?: MatchFixture;
  coachSummary: string;
  isGeneratingSummary: boolean;
  onRefreshSummary: () => void;
  summarySource?: string;
  profile: AthleteProfile;
  onOpenGuide: () => void;
  onOpenProfile: () => void;
  onNavigateTab: (tab: any) => void;
  onQuickTiredAction: () => void;
  onQuickMissedWorkoutAction: () => void;
  onQuickCompetitionTaperAction: () => void;
}

export const AthleteHeroMetrics: React.FC<AthleteHeroMetricsProps> = ({
  metrics,
  nextMatch,
  coachSummary,
  isGeneratingSummary,
  onRefreshSummary,
  summarySource,
  profile,
  onOpenGuide,
  onOpenProfile,
  onNavigateTab,
  onQuickTiredAction,
  onQuickMissedWorkoutAction,
  onQuickCompetitionTaperAction,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (key: string) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  const getStatusColor = () => {
    switch (metrics.acwrStatus) {
      case 'sweet-spot':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/60',
          border: 'border-emerald-500/40',
          glow: 'glow-box-emerald',
          label: 'OPTIMAL SWEET SPOT (0.80 – 1.30)',
          summary: 'Conditioning load is in the high-performance sweet spot. Injury risk is minimized while fitness expands.',
        };
      case 'caution':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-950/60',
          border: 'border-amber-500/40',
          glow: 'glow-box-amber',
          label: 'CAUTION: ELEVATED WORKLOAD (1.31 – 1.50)',
          summary: 'Workload is elevating above chronic capacity. Monitor neuromuscular fatigue closely.',
        };
      case 'danger':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-950/70',
          border: 'border-rose-500/50',
          glow: 'glow-box-rose',
          label: 'HIGH INJURY RISK SPIKE (> 1.50)',
          summary: 'Acute strain heavily exceeds 28-day base armor. Urgent active recovery required to avert strain.',
        };
      default:
        return {
          text: 'text-cyan-400',
          bg: 'bg-cyan-950/60',
          border: 'border-cyan-500/40',
          glow: 'glow-box-cyan',
          label: 'UNDER-TRAINING BASE (< 0.80)',
          summary: 'Effort is lower than chronic fitness armor. Gradually ramp volume to retain competitive conditioning.',
        };
    }
  };

  const status = getStatusColor();

  return (
    <div className="space-y-6">
      {/* Top Telemetry Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl neural-card border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/90 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <User className="w-6 h-6 text-cyan-400" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display font-bold text-lg text-white">
                {profile.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                {profile.sport} • {profile.positionOrDiscipline}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-slate-900 border border-slate-700 text-slate-300">
                {profile.experienceLevel}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono-code text-[11px] text-cyan-300/90">NEURAL LINK ACTIVE</span>
              </span>
              <span>•</span>
              <span>
                Objective:{' '}
                <strong className="text-slate-200">
                  {profile.goal === 'competition'
                    ? 'Peak for Competition'
                    : profile.goal === 'injury-free'
                    ? 'Stay Injury-Free'
                    : profile.goal === 'endurance'
                    ? 'Build Engine Base'
                    : 'General Conditioning'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenProfile}
            className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/60 hover:border-cyan-400 text-xs font-mono-code text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            Recalibrate Profile
          </button>
          <button
            onClick={onOpenGuide}
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-xs font-mono-code text-slate-300 transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            System Guide
          </button>
        </div>
      </div>

      {/* Hero Section: Training Sweet Spot Status Card */}
      <div className={`p-6 sm:p-7 rounded-2xl neural-card border transition-all ${status.border} ${status.glow}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: ACWR Status Info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.bg} ${status.text} animate-pulse`} />
              <span className={`font-mono-code text-xs font-bold uppercase tracking-wider ${status.text}`}>
                {status.label}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                {metrics.currentACWR.toFixed(2)}
              </h1>
              <span className="font-mono-code text-xs text-slate-400">
                RATIO (ACWR)
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {status.summary}
            </p>
          </div>

          {/* Right: Interactive Visual Sweet Spot Gauge */}
          <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 w-full lg:w-96 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-slate-400">ACWR SPECTRUM</span>
              <span className="text-emerald-400 font-bold">0.80 — 1.30 SAFE ZONE</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              {/* Under-training zone: 0 to 0.8 (40% of 2.0 scale) */}
              <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-cyan-950/40 border-r border-cyan-500/20" />
              {/* Sweet spot zone: 0.8 to 1.3 (25% of 2.0 scale, offset 40%) */}
              <div className="absolute left-[40%] top-0 bottom-0 w-[25%] bg-emerald-500/30 border-r border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              {/* Caution zone: 1.3 to 1.5 (10% of 2.0 scale, offset 65%) */}
              <div className="absolute left-[65%] top-0 bottom-0 w-[10%] bg-amber-500/30 border-r border-amber-500/40" />
              {/* Danger zone: 1.5+ (25% of 2.0 scale, offset 75%) */}
              <div className="absolute left-[75%] top-0 bottom-0 right-0 bg-rose-500/30" />

              {/* Glowing Pointer Cursor */}
              <div
                className="absolute top-0 bottom-0 w-2 -ml-1 bg-white rounded-full shadow-[0_0_10px_#FFFFFF] z-10 transition-all duration-500"
                style={{
                  left: `${Math.min(98, Math.max(2, (metrics.currentACWR / 2.0) * 100))}%`,
                }}
              />
            </div>

            {/* Gauge Marks */}
            <div className="flex justify-between text-[10px] font-mono-code text-slate-500 px-1">
              <span>0.0</span>
              <span className="text-emerald-400 font-bold">0.80</span>
              <span className="text-emerald-400 font-bold">1.30</span>
              <span className="text-amber-400">1.50</span>
              <span>2.0+</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
              <span className="text-slate-400">Estimated Injury Risk:</span>
              <span className={`font-bold ${metrics.injuryRiskPct > 35 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {metrics.injuryRiskPct}% Probability
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Biometric Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: This Week's Effort */}
        <div className="p-5 rounded-2xl neural-card border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-code text-xs text-slate-400 uppercase tracking-wider">
              This Week's Effort
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">
              {metrics.acuteLoad}
            </span>
            <span className="font-mono-code text-xs text-cyan-400">AU / day</span>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            7-day rolling average fatigue load
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
            <span className="text-slate-500">Weekly Total:</span>
            <span className="text-slate-200 font-semibold">{metrics.acuteLoad * 7} AU</span>
          </div>
        </div>

        {/* Metric 2: Fitness Base Armor */}
        <div className="p-5 rounded-2xl neural-card border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-code text-xs text-slate-400 uppercase tracking-wider">
              Fitness Base Engine
            </span>
            <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">
              {metrics.chronicLoad}
            </span>
            <span className="font-mono-code text-xs text-indigo-400">AU / day</span>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            28-day conditioning protective base
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
            <span className="text-slate-500">Conditioning Armor:</span>
            <span className="text-indigo-300 font-semibold">High Reserve</span>
          </div>
        </div>

        {/* Metric 3: Body Battery / Sleep */}
        <div className="p-5 rounded-2xl neural-card border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-code text-xs text-slate-400 uppercase tracking-wider">
              Body Battery & Sleep
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">
              {metrics.recoveryScore}%
            </span>
            <span className="font-mono-code text-xs text-emerald-400">Readiness</span>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Neuromuscular & systemic readiness score
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
            <span className="text-slate-500">Status:</span>
            <span className="text-emerald-300 font-semibold">Ready for Stimulus</span>
          </div>
        </div>
      </div>

      {/* AI Coach Daily Directive Card */}
      <div className="p-5 sm:p-6 rounded-2xl neural-card border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF] animate-pulse" />
            <span className="font-mono-code text-xs font-bold text-cyan-300 tracking-wider uppercase">
              AI Sports Scientist // Daily Briefing
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono-code text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              Source: {summarySource || 'Gemini 3.8 Flash'}
            </span>
            <button
              onClick={onRefreshSummary}
              disabled={isGeneratingSummary}
              className="p-1.5 rounded-lg border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/40 text-cyan-400 transition-all"
              title="Refresh Briefing"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed min-h-[50px]">
          {isGeneratingSummary ? (
            <span className="flex items-center gap-2 text-cyan-400 font-mono-code text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Synthesizing autonomous biometric briefing from live ACWR & microcycle telemetry...
            </span>
          ) : (
            coachSummary
          )}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono-code">
            Want detailed questions or tailored workout advice?
          </span>
          <button
            onClick={() => onNavigateTab('coach')}
            className="text-xs font-mono-code font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 group"
          >
            Open AI Coach Chat
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Target Event / Match Horizon + Quick Recalibrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Upcoming Target Horizon */}
        <div className="p-5 rounded-2xl neural-card border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-mono-code text-xs uppercase tracking-wider text-slate-300 font-bold">
                Target Horizon // Upcoming Event
              </span>
            </div>
            {nextMatch && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">
                {nextMatch.daysAway} DAYS AWAY
              </span>
            )}
          </div>

          {nextMatch ? (
            <div className="space-y-2">
              <div className="text-base font-bold text-white font-display">
                {nextMatch.opponent}
              </div>
              <div className="text-xs text-slate-400">
                {nextMatch.competition} • Scheduled for {nextMatch.date}
              </div>
              <p className="text-xs text-cyan-300/90 pt-1">
                Autonomous taper sequence will peak explosive readiness 48 hours prior.
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-3">
              No target event scheduled. Maintaining progressive overload baseline.
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('simulation')}
              className="text-xs font-mono-code text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              Simulate Match Load in What-If Lab
            </button>
          </div>
        </div>

        {/* Right: Quick 1-Click Status Recalibration */}
        <div className="p-5 rounded-2xl neural-card border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="font-mono-code text-xs uppercase tracking-wider text-slate-300 font-bold">
              1-Click Smart Recalibrations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={onQuickTiredAction}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-cyan-950/40 hover:border-cyan-500/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                I Feel Tired
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Converts today to light active flush
              </div>
            </button>

            <button
              onClick={onQuickMissedWorkoutAction}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-cyan-950/40 hover:border-cyan-500/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                Missed Workout
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Safely rebalances without dangerous spike
              </div>
            </button>

            <button
              onClick={onQuickCompetitionTaperAction}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-cyan-950/40 hover:border-cyan-500/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                Event Taper
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Sharpens neuromuscular readiness
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
