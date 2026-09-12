import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Activity, Dumbbell, Calendar, Clock } from 'lucide-react';
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

  const calculatedLoad = Math.round(rpe * durationMinutes);

  const getRpeDescription = (val: number) => {
    if (val <= 2) return 'Very Light (Active recovery or warm-up)';
    if (val <= 4) return 'Moderate (Can hold full conversation)';
    if (val <= 6) return 'Challenging (Aerobic burn, heavy breathing)';
    if (val <= 8) return 'Hard (Vigorous pace, muscular fatigue)';
    return 'Maximum Exertion (All-out sprint, match intensity)';
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

  const sportsList: SportType[] = [
    'Soccer',
    'Running',
    'Equestrian',
    'Cycling',
    'Gym',
    'Tennis',
    'Basketball',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg rounded-2xl neural-card border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.2)] max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase font-bold text-cyan-400 tracking-wider">
                TELEMETRY INGESTION
              </span>
              <h3 className="text-lg font-display font-bold text-white">
                Log Training Session
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white border border-slate-800 hover:border-cyan-500/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Calculated Output Banner */}
          <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-code text-cyan-400 uppercase">
                Calculated Workload
              </span>
              <div className="text-2xl font-display font-bold text-white">
                {calculatedLoad} <span className="text-xs font-mono-code text-cyan-400">AU</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono-code text-slate-400">
              <div>{durationMinutes} min × RPE {rpe}</div>
              <div className="text-[10px] text-cyan-300">
                {calculatedLoad >= 800
                  ? 'Match Intensity'
                  : calculatedLoad >= 500
                  ? 'Development Base'
                  : calculatedLoad >= 300
                  ? 'Moderate Technical'
                  : 'Recovery Flush'}
              </div>
            </div>
          </div>

          {/* Date & Sport */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-white text-xs font-mono-code"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1">Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as SportType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl text-white text-xs font-mono-code"
              >
                {sportsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-slate-300">Duration (Minutes):</span>
              <span className="text-cyan-300 font-bold">{durationMinutes} min</span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Effort RPE Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-slate-300">Effort Rating (RPE 1-10):</span>
              <span className="text-cyan-300 font-bold">{rpe} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 italic">
              {getRpeDescription(rpe)}
            </div>
          </div>

          {/* Recovery & Sleep */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1">
                Sleep (Hours): {sleepHours}h
              </label>
              <input
                type="range"
                min={4}
                max={12}
                step={0.5}
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-400 mb-1">
                Recovery Score: {recoveryScore}%
              </label>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={recoveryScore}
                onChange={(e) => setRecoveryScore(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-code font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Workout & Recompute ACWR
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
