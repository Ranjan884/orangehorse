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
  Info,
  Sliders,
  ShieldCheck,
  Flame,
  HelpCircle,
  Clock,
  Sparkles
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

  const getFriendlySessionName = (type: string) => {
    switch (type) {
      case 'Match':
        return 'Game / Race Day';
      case 'Development Session':
        return 'Hard Workout (Build Engine)';
      case 'Tactical Session':
        return 'Medium Workout (Skills & Form)';
      case 'Recovery Block':
        return 'Active Recovery & Stretch';
      case 'Taper Session':
        return 'Pre-Game Taper (Save Energy)';
      default:
        return 'Full Rest Day';
    }
  };

  const getFriendlyBadgeClass = (type: string) => {
    switch (type) {
      case 'Match':
        return 'bg-[#FF5500] text-white font-bold';
      case 'Development Session':
        return 'bg-orange-100 text-[#EA580C] font-semibold';
      case 'Tactical Session':
        return 'bg-amber-100 text-amber-900 font-semibold';
      case 'Recovery Block':
        return 'bg-emerald-100 text-emerald-800 font-semibold';
      case 'Taper Session':
        return 'bg-purple-100 text-purple-900 font-semibold';
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  };

  const totalWeeklyLoad = plan.reduce((sum, d) => sum + d.targetLoad, 0);
  const projectedAcute = Math.round(totalWeeklyLoad / 7);
  const projectedACWR = Math.round((projectedAcute / (currentChronicLoad || 1)) * 100) / 100;
  const hasAnyOverride = plan.some((d) => d.isCoachOverride);

  return (
    <section id="seven-day-plan" className="py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 pb-4 border-b border-orange-200/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#FF5500] font-bold mb-1">
            <Calendar className="w-4 h-4" />
            <span>7-Day Smart Workout Schedule</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-display">
            Personalized Daily Training Plan
          </h3>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
            Automatically balanced so you build fitness without burning out. You can click <strong>"Adjust"</strong> on any day to fit your personal schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasAnyOverride && (
            <button
              onClick={onResetAllOverrides}
              className="px-3 py-1.5 rounded-full bg-orange-100 hover:bg-orange-200 text-[#FF5500] text-xs font-mono-code font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to AI Plan</span>
            </button>
          )}

          <button
            onClick={onExportCSV}
            className="px-3.5 py-1.5 rounded-full bg-[#1D1814] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            id="btn-export-plan-csv"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Schedule</span>
          </button>
        </div>
      </div>

      {/* 3 Quick Summary Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-2xl bg-white/80 border border-orange-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-code uppercase text-neutral-500 font-bold block">
              Total Weekly Volume
            </span>
            <span className="text-xl font-bold font-mono-code text-neutral-900">
              {totalWeeklyLoad.toLocaleString()} <span className="text-xs font-normal text-neutral-500">Points</span>
            </span>
          </div>
          <span className="p-2 rounded-xl bg-orange-100 text-[#FF5500] text-lg">🔥</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 border border-orange-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-code uppercase text-neutral-500 font-bold block">
              Projected Balance
            </span>
            <span className="text-xl font-bold font-mono-code text-neutral-900">
              {projectedACWR.toFixed(2)}{' '}
              <span className={`text-xs font-bold ${projectedACWR <= 1.3 && projectedACWR >= 0.8 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {projectedACWR <= 1.3 && projectedACWR >= 0.8 ? '• Safe Zone' : '• High Load'}
              </span>
            </span>
          </div>
          <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-lg">🎯</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 border border-orange-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-code uppercase text-neutral-500 font-bold block">
              Competition Days
            </span>
            <span className="text-xl font-bold font-mono-code text-neutral-900">
              {plan.filter((d) => d.isMatch).length}{' '}
              <span className="text-xs font-normal text-neutral-500">Event(s) Planned</span>
            </span>
          </div>
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800 text-lg">🏆</span>
        </div>
      </div>

      {/* Plan Table Card */}
      <div className="rounded-3xl glass-card border border-orange-200 shadow-xs overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-orange-200/60 bg-orange-50/50 text-[11px] font-mono-code uppercase text-neutral-600 tracking-wider">
                <th className="py-3 px-4 font-bold">Day</th>
                <th className="py-3 px-4 font-bold">Workout Type</th>
                <th className="py-3 px-4 font-bold">Target Effort</th>
                <th className="py-3 px-4 font-bold">Training Focus</th>
                <th className="py-3 px-4 font-bold">Why the AI Scheduled This</th>
                <th className="py-3 px-4 font-bold text-right">Customize</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 text-xs text-neutral-800">
              {plan.map((day) => {
                const isEditing = editingDay === day.dayNumber;

                return (
                  <tr
                    key={day.dayNumber}
                    className={`hover:bg-orange-50/30 transition-colors ${
                      day.isMatch
                        ? 'bg-orange-100/40'
                        : day.isCoachOverride
                        ? 'bg-amber-50/60'
                        : ''
                    }`}
                  >
                    {/* Day & Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl font-mono-code text-xs flex items-center justify-center font-bold ${
                          day.isMatch ? 'bg-[#FF5500] text-white' : 'bg-black/5 text-neutral-700'
                        }`}>
                          D{day.dayNumber}
                        </span>
                        <div>
                          <div className="font-bold text-neutral-900">{day.dayName}</div>
                          <div className="text-[10px] font-mono-code text-neutral-500">
                            {day.date}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Session Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={tempType}
                          onChange={(e) => setTempType(e.target.value as any)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-orange-300 text-xs font-semibold focus:outline-none"
                        >
                          <option value="Match">Game / Race Day</option>
                          <option value="Development Session">Hard Workout (Build Engine)</option>
                          <option value="Tactical Session">Medium Workout (Skills & Form)</option>
                          <option value="Recovery Block">Active Recovery & Stretch</option>
                          <option value="Taper Session">Pre-Game Taper</option>
                          <option value="Rest Day">Full Rest</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] ${getFriendlyBadgeClass(day.sessionType)}`}>
                            {getFriendlySessionName(day.sessionType)}
                          </span>
                          {day.isCoachOverride && (
                            <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                              Customized
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Target Load */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono-code">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="1400"
                            step="25"
                            value={tempLoad}
                            onChange={(e) => setTempLoad(Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded-xl bg-white border border-orange-300 text-xs font-bold"
                          />
                          <span className="text-[11px] text-neutral-500">Points</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-neutral-900 text-sm">{day.targetLoad}</span>
                          <span className="text-[11px] text-neutral-500">pts</span>
                        </div>
                      )}
                    </td>

                    {/* Focus Area */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempFocus}
                          onChange={(e) => setTempFocus(e.target.value)}
                          className="w-full px-2 py-1 rounded-xl bg-white border border-orange-300 text-xs"
                          placeholder="e.g. Speed drills & stamina"
                        />
                      ) : (
                        <span className="font-medium text-neutral-800">{day.focus}</span>
                      )}
                    </td>

                    {/* Autonomous Rationale (Friendly) */}
                    <td className="py-3 px-4 text-neutral-600 text-xs max-w-xs">
                      {day.rationale}
                    </td>

                    {/* Coach Action Button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => saveEdit(day.dayNumber)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                            title="Save adjustments"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingDay(null)}
                            className="p-1.5 rounded-lg bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(day)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 text-neutral-700 hover:text-[#FF5500] border border-neutral-200 text-xs font-semibold flex items-center gap-1 transition-all"
                            title="Customize this day's workout"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Adjust</span>
                          </button>
                          {day.isCoachOverride && (
                            <button
                              onClick={() => onResetDay(day.dayNumber)}
                              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                              title="Reset back to AI recommendation"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Decision Rules & Safety Guarantees Log */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card border border-orange-200">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF5500]" />
            <h4 className="font-bold text-xs text-neutral-900 uppercase font-mono-code">
              AI Safety Rules Active Today
            </h4>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono-code">
            3 Protective Guardrails Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-2xl bg-white/70 border border-orange-100">
            <span className="text-xs font-bold text-neutral-900 block mb-0.5">
              🛡️ No Dangerous Volume Spikes
            </span>
            <p className="text-[11px] text-neutral-600">
              Caps weekly increase at +10% over chronic base to protect ligaments and tendons.
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/70 border border-orange-100">
            <span className="text-xs font-bold text-neutral-900 block mb-0.5">
              ⚡ Pre-Game Freshness Guarantee
            </span>
            <p className="text-[11px] text-neutral-600">
              Automatically cuts volume by 60% on the day before match day to guarantee fresh legs.
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/70 border border-orange-100">
            <span className="text-xs font-bold text-neutral-900 block mb-0.5">
              😴 Recovery-Driven Load Dials
            </span>
            <p className="text-[11px] text-neutral-600">
              If your body battery score dips below 60%, heavy sprints are automatically converted to active flush.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
