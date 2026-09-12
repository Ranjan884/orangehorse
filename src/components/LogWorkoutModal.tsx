import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Flame, Zap, Calendar, Clock, Activity, Dumbbell } from 'lucide-react';
import { AthleteSession, SportType } from '../types';

interface LogWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (session: AthleteSession) => void;
  currentSport?: SportType;
}

export const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({
  isOpen,
  onClose,
  onSaveSession,
  currentSport = 'Soccer',
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [sport, setSport] = useState<SportType>(currentSport);
  const [sessionType, setSessionType] = useState<string>('Hard Workout (Base Engine)');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [rpe, setRpe] = useState<number>(7);
  const [distanceKm, setDistanceKm] = useState<number>(5.5);
  const [recoveryScore, setRecoveryScore] = useState<number>(80);
  const [sleepHours, setSleepHours] = useState<number>(7.5);

  if (!isOpen) return null;

  // Simple load calculation: RPE (1-10) * minutes (scaled by standard multiplier)
  // For standard AU load: RPE * minutes
  const calculatedLoad = Math.round(rpe * durationMinutes);

  const getRpeDescription = (val: number) => {
    if (val <= 2) return 'Very Light (Casual recovery or warm-up)';
    if (val <= 4) return 'Moderate (Can hold conversation)';
    if (val <= 6) return 'Challenging (Aerobic burn, heavy breathing)';
    if (val <= 8) return 'Hard (Vigorous pace, muscular fatigue)';
    return 'Maximum Effort (All-out sprint, match intensity)';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSession: AthleteSession = {
      date,
      load: calculatedLoad,
      distanceM: Math.round(distanceKm * 1000),
      rpe,
      recovery: recoveryScore,
      sleepHours,
      sessionType:
        calculatedLoad >= 800
          ? 'Match'
          : calculatedLoad >= 500
          ? 'Development Session'
          : calculatedLoad >= 300
          ? 'Tactical Session'
          : calculatedLoad > 0
          ? 'Recovery Block'
          : 'Rest Day',
    };

    onSaveSession(newSession);
    onClose();
  };

  const sportsList: { name: SportType; icon: string }[] = [
    { name: 'Soccer', icon: '⚽' },
    { name: 'Running', icon: '🏃' },
    { name: 'Equestrian', icon: '🐎' },
    { name: 'Cycling', icon: '🚴' },
    { name: 'Gym', icon: '🏋️' },
    { name: 'Tennis', icon: '🎾' },
    { name: 'Basketball', icon: '🏀' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-[#FAF8F5] border border-orange-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="log-workout-modal-container"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-orange-200/60 bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-bold shadow-xs">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                Log a Workout Session
              </h3>
              <p className="text-xs text-neutral-500">
                Instantly calculates your training load and updates your weekly plan
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Sport / Activity Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Activity / Sport
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sportsList.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setSport(item.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    sport === item.name
                      ? 'bg-[#FF5500] text-white shadow-xs font-bold'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-orange-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Workout Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Duration (Minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="360"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-mono-code">
                  min
                </span>
              </div>
            </div>
          </div>

          {/* Intensity Slider (RPE) */}
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-neutral-800">
                How hard was it? (Effort 1 to 10)
              </label>
              <span className="text-xs font-bold font-mono-code text-[#FF5500] px-2 py-0.5 rounded-full bg-orange-50">
                Rating {rpe} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full accent-[#FF5500] cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              {getRpeDescription(rpe)}
            </p>
          </div>

          {/* Distance & Sleep */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Distance Covered (km)
              </label>
              <input
                type="number"
                min="0"
                max="150"
                step="0.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Sleep Last Night (Hours)
              </label>
              <input
                type="number"
                min="3"
                max="14"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
              />
            </div>
          </div>

          {/* Estimated Load Output Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-code uppercase font-semibold text-[#FF5500] block">
                Calculated Session Effort
              </span>
              <div className="text-xl font-bold font-mono-code text-neutral-900">
                {calculatedLoad}{' '}
                <span className="text-xs font-normal text-neutral-500">Load Points (AU)</span>
              </div>
              <span className="text-[11px] text-neutral-600">
                {durationMinutes} min × {rpe} RPE intensity
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono-code uppercase text-neutral-400 block">
                Classification
              </span>
              <span className="text-xs font-bold text-[#FF5500]">
                {calculatedLoad >= 800
                  ? 'Heavy Match Effort'
                  : calculatedLoad >= 500
                  ? 'Hard Training Day'
                  : calculatedLoad >= 300
                  ? 'Moderate Training'
                  : 'Light Recovery'}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E84E00] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Update Plan</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
