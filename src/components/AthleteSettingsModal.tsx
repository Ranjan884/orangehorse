import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Check,
  User,
  Zap,
  Shield,
  Trophy,
  Sliders,
  Sparkles,
  Flame,
  RotateCcw,
  Coffee,
  CalendarCheck
} from 'lucide-react';
import { AthleteProfile, SportType, TrainingGoal } from '../types';

interface AthleteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AthleteProfile;
  onUpdateProfile: (profile: AthleteProfile) => void;
  onQuickTiredAction: () => void;
  onQuickMissedWorkoutAction: () => void;
  onQuickCompetitionTaperAction: () => void;
}

export const AthleteSettingsModal: React.FC<AthleteSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onQuickTiredAction,
  onQuickMissedWorkoutAction,
  onQuickCompetitionTaperAction,
}) => {
  const [name, setName] = useState(profile.name);
  const [sport, setSport] = useState<SportType>(profile.sport);
  const [position, setPosition] = useState(profile.positionOrDiscipline);
  const [goal, setGoal] = useState<TrainingGoal>(profile.goal);
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      sport,
      positionOrDiscipline: position,
      goal,
      experienceLevel,
    });
    onClose();
  };

  const sports: { type: SportType; label: string; icon: string }[] = [
    { type: 'Soccer', label: 'Soccer / Football', icon: '⚽' },
    { type: 'Running', label: 'Running / Track', icon: '🏃' },
    { type: 'Equestrian', label: 'Equestrian / Horse', icon: '🐎' },
    { type: 'Cycling', label: 'Road Cycling', icon: '🚴' },
    { type: 'Gym', label: 'Gym / Strength / CrossFit', icon: '🏋️' },
    { type: 'Tennis', label: 'Tennis / Padel', icon: '🎾' },
    { type: 'Basketball', label: 'Basketball', icon: '🏀' },
  ];

  const goals: { type: TrainingGoal; label: string; desc: string; icon: string }[] = [
    {
      type: 'competition',
      label: 'Peak for Competition / Match',
      desc: 'Optimizes microcycles for high energy and sharp tapering before games.',
      icon: '🏆',
    },
    {
      type: 'injury-free',
      label: 'Stay Injury-Free (Safety First)',
      desc: 'Keeps workloads strictly capped to protect joints, tendons, and muscles.',
      icon: '🛡️',
    },
    {
      type: 'endurance',
      label: 'Build Aerobic Engine & Stamina',
      desc: 'Focuses on steady long-term volume and conditioning base.',
      icon: '⚡',
    },
    {
      type: 'fitness',
      label: 'General Health & Maintenance',
      desc: 'Balanced routine for consistent fitness, vitality, and well-being.',
      icon: '🌿',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl bg-[#FAF8F5] border border-orange-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="athlete-settings-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-orange-200/60 bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-bold shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                Athlete Profile &amp; Preferences
              </h3>
              <p className="text-xs text-neutral-500">
                Personalize your sport, goals, and training guardrails
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {actionNotice && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200 flex items-center justify-between">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-emerald-700 underline text-[11px]">
                Dismiss
              </button>
            </div>
          )}

          {/* Quick 1-Click Actions Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
            <span className="text-[11px] font-mono-code uppercase font-bold text-[#FF5500] block mb-1">
              ⚡ 1-Click Smart Adjustments
            </span>
            <p className="text-xs text-neutral-600 mb-3">
              Need immediate advice? The AI can recalibrate your training plan in one tap:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onQuickTiredAction();
                  setActionNotice('Restored balance: Today changed to Active Recovery & light flush.');
                }}
                className="p-2.5 rounded-xl bg-white border border-orange-200/80 hover:border-orange-400 text-left transition-all text-xs font-medium flex flex-col gap-1 shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  <span>"I Feel Exhausted"</span>
                </div>
                <span className="text-[10px] text-neutral-500 leading-tight">
                  Converts today to light recovery to prevent burnout.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onQuickMissedWorkoutAction();
                  setActionNotice('Rebalanced schedule: Remaining days spread evenly without dangerous spikes.');
                }}
                className="p-2.5 rounded-xl bg-white border border-orange-200/80 hover:border-orange-400 text-left transition-all text-xs font-medium flex flex-col gap-1 shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                  <span>"I Missed Yesterday"</span>
                </div>
                <span className="text-[10px] text-neutral-500 leading-tight">
                  Smoothly redistributes load without double-session spikes.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onQuickCompetitionTaperAction();
                  setActionNotice('Taper activated: Friday & Saturday load reduced to guarantee fresh legs.');
                }}
                className="p-2.5 rounded-xl bg-white border border-orange-200/80 hover:border-orange-400 text-left transition-all text-xs font-medium flex flex-col gap-1 shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>"Game This Weekend"</span>
                </div>
                <span className="text-[10px] text-neutral-500 leading-tight">
                  Activates pre-match taper to peak freshness.
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Athlete Name & Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Athlete Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                  placeholder="e.g. Alexandre Mercer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Position / Discipline
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                  placeholder="e.g. Midfielder / 10K Runner / Eventer"
                />
              </div>
            </div>

            {/* Sport Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Primary Sport / Discipline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sports.map((item) => (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setSport(item.type)}
                    className={`p-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all text-left ${
                      sport === item.type
                        ? 'bg-[#FF5500] text-white shadow-xs font-bold'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-orange-50'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Primary Training Focus &amp; Goal
              </label>
              <div className="space-y-2">
                {goals.map((item) => (
                  <label
                    key={item.type}
                    className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      goal === item.type
                        ? 'bg-orange-50/80 border-[#FF5500] shadow-xs'
                        : 'bg-white border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="trainingGoal"
                      checked={goal === item.type}
                      onChange={() => setGoal(item.type)}
                      className="mt-1 accent-[#FF5500]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-xs font-bold text-neutral-900">{item.label}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Experience Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced', 'Pro'] as const).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-1.5 rounded-xl text-xs font-medium transition-all ${
                      experienceLevel === lvl
                        ? 'bg-neutral-900 text-white font-bold shadow-xs'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E84E00] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
