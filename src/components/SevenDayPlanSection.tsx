import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Download,
  Edit2,
  RotateCcw,
  Check,
  Trophy,
  Zap,
  Sliders,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MicrocycleDay, AgentReasoningLog } from '../types';

interface SevenDayPlanSectionProps {
  plan: MicrocycleDay[];
  logs: AgentReasoningLog[];
  onUpdateDay: (dayNumber: number, override: Partial<MicrocycleDay>) => void;
  onResetDay: (dayNumber: number) => void;
  onResetAllOverrides: () => void;
  onExportCSV: () => void;
  currentChronicLoad: number;
}

export const SevenDayPlanSection: React.FC<SevenDayPlanSectionProps> = ({
  plan,
  logs,
  onUpdateDay,
  onResetDay,
  onResetAllOverrides,
  onExportCSV,
  currentChronicLoad,
}) => {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tempLoad, setTempLoad] = useState<number>(500);
  const [tempType, setTempType] = useState<MicrocycleDay['sessionType']>('Development Session');
  const [tempFocus, setTempFocus] = useState<string>('');
  const [showReasoningLogs, setShowReasoningLogs] = useState<boolean>(false);

  const startEdit = (day: MicrocycleDay) => {
    setEditingDay(day.dayNumber);
    setTempLoad(day.targetLoad);
    setTempType(day.sessionType);
    setTempFocus(day.focus);
  };

  const saveEdit = (dayNumber: number) => {
    onUpdateDay(dayNumber, {
      targetLoad: tempLoad,
      sessionType: tempType,
      focus: tempFocus || undefined,
    });
    setEditingDay(null);
  };

  const getSessionBadge = (type: string) => {
    switch (type) {
      case 'Match':
        return 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]';
      case 'Development Session':
        return 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40';
      case 'Tactical Session':
        return 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30';
      case 'Recovery Block':
        return 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40';
      case 'Taper Session':
        return 'bg-amber-950/70 text-amber-400 border border-amber-500/40';
      default:
        return 'bg-slate-900 text-slate-400 border border-slate-800';
    }
  };

  const totalWeeklyLoad = plan.reduce((sum, d) => sum + d.targetLoad, 0);
  const projectedAcute = Math.round(totalWeeklyLoad / 7);
  const projectedACWR = Math.round((projectedAcute / (currentChronicLoad || 1)) * 100) / 100;
  const hasAnyOverride = plan.some((d) => d.isCoachOverride);

  return (
    <div className="space-y-6">
      {/* Top Banner & Projected Horizon */}
      <div className="p-5 sm:p-6 rounded-2xl neural-card border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-mono-code text-xs font-bold text-cyan-400 uppercase tracking-widest">
              AUTONOMOUS MICROCYCLE // 7-DAY HORIZON
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            7-Day Intelligent Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Calculated autonomously to balance physiological adaptation, scheduled matches, and recovery. Click any day to adjust target loads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasAnyOverride && (
            <button
              onClick={onResetAllOverrides}
              className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-mono-code transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Tweaks
            </button>
          )}
          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 text-xs font-mono-code transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Plan CSV
          </button>
        </div>
      </div>

      {/* Projected Microcycle Vitals */}
      <div className="p-4 rounded-xl neural-card border border-cyan-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] font-mono-code text-slate-400 uppercase">Projected Weekly Volume</span>
          <div className="text-xl font-display font-bold text-white mt-1">
            {totalWeeklyLoad.toLocaleString()} <span className="text-xs text-cyan-400 font-mono-code">AU</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono-code text-slate-400 uppercase">Projected Daily Average</span>
          <div className="text-xl font-display font-bold text-white mt-1">
            {projectedAcute} <span className="text-xs text-cyan-400 font-mono-code">AU / day</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono-code text-slate-400 uppercase">Projected ACWR Balance</span>
          <div className={`text-xl font-display font-bold mt-1 ${
            projectedACWR >= 0.8 && projectedACWR <= 1.3 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {projectedACWR.toFixed(2)} {projectedACWR >= 0.8 && projectedACWR <= 1.3 ? '• Safe' : ''}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowReasoningLogs(!showReasoningLogs)}
            className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 border border-cyan-500/30 px-3 py-1.5 rounded-lg bg-black/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showReasoningLogs ? 'Hide Reasoning Logs' : 'View AI Engine Logs'}
            {showReasoningLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Reasoning Logs Collapsible */}
      <AnimatePresence>
        {showReasoningLogs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-[#080C16] border border-cyan-500/30 overflow-hidden space-y-2"
          >
            <div className="text-xs font-mono-code text-cyan-300 font-bold uppercase tracking-wider mb-2">
              Sports-Science Autonomous Engine // Audit Trace
            </div>
            {logs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono-code flex items-start gap-2.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  log.level === 'critical' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                  log.level === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {log.ruleTriggered}
                </span>
                <div className="flex-1">
                  <div className="text-slate-200">{log.decision}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{log.impact}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7-Day Interactive Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {plan.map((day) => {
          const isEditing = editingDay === day.dayNumber;
          return (
            <motion.div
              key={day.dayNumber}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-2xl neural-card border transition-all flex flex-col justify-between min-h-[260px] ${
                day.isMatch
                  ? 'border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] bg-[#0C1220]'
                  : day.isCoachOverride
                  ? 'border-indigo-500/50 bg-[#0A0F1E]'
                  : 'border-cyan-500/20'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                  <div>
                    <div className="font-mono-code text-[11px] text-cyan-400 font-bold uppercase">
                      DAY {day.dayNumber}
                    </div>
                    <div className="text-sm font-bold text-white font-display">
                      {day.dayName.slice(0, 3)}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-500">
                    {day.date.slice(5)}
                  </span>
                </div>

                {/* Session Type Pill */}
                <div className="mb-3">
                  <span className={`inline-block text-[10px] font-mono-code uppercase px-2 py-0.5 rounded-full ${getSessionBadge(day.sessionType)}`}>
                    {day.sessionType}
                  </span>
                </div>

                {/* Target Workload Load Display or Edit Mode */}
                {isEditing ? (
                  <div className="space-y-2 p-2 rounded-lg bg-black/60 border border-cyan-500/40">
                    <label className="text-[10px] font-mono-code text-slate-400 block">
                      Target: {tempLoad} AU
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1200}
                      step={50}
                      value={tempLoad}
                      onChange={(e) => setTempLoad(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />

                    <select
                      value={tempType}
                      onChange={(e) => setTempType(e.target.value as any)}
                      className="w-full text-[10px] font-mono-code bg-slate-900 border border-slate-700 text-white rounded p-1"
                    >
                      <option value="Match">Match Day</option>
                      <option value="Development Session">Development</option>
                      <option value="Tactical Session">Tactical</option>
                      <option value="Recovery Block">Recovery</option>
                      <option value="Taper Session">Taper</option>
                      <option value="Rest Day">Rest Day</option>
                    </select>

                    <div className="flex gap-1 pt-1">
                      <button
                        onClick={() => saveEdit(day.dayNumber)}
                        className="flex-1 py-1 rounded bg-cyan-400 text-black font-mono-code font-bold text-[10px]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDay(null)}
                        className="flex-1 py-1 rounded bg-slate-800 text-slate-300 font-mono-code text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-extrabold text-white">
                        {day.targetLoad}
                      </span>
                      <span className="text-xs font-mono-code text-cyan-400">AU</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug line-clamp-3">
                      {day.focus}
                    </p>
                  </div>
                )}
              </div>

              {/* Day Bottom Actions */}
              {!isEditing && (
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
                  <button
                    onClick={() => startEdit(day)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    <Edit2 className="w-3 h-3" />
                    Tweak
                  </button>

                  {day.isCoachOverride && (
                    <button
                      onClick={() => onResetDay(day.dayNumber)}
                      className="text-slate-500 hover:text-slate-300 text-[10px]"
                      title="Reset to autonomous recommendation"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
