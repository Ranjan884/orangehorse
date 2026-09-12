import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Activity,
  Shield,
  Trophy,
  Zap,
  Flame,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Target,
  Sparkles,
  Calendar,
  X,
} from 'lucide-react';
import { AthleteProfile, TrainingGoal, MatchFixture } from '../types';

interface NeuralOnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: AthleteProfile, fixture?: MatchFixture) => void;
  initialProfile?: AthleteProfile;
  onClose?: () => void;
}

const SPORTS = [
  { id: 'Soccer', label: 'Soccer / Football', icon: '⚽', desc: 'Sprints, tactical agility & match spikes' },
  { id: 'Running', label: 'Distance Running', icon: '🏃', desc: 'Aerobic engine, mileage & tempo runs' },
  { id: 'Cycling', label: 'Road / MTB Cycling', icon: '🚴', desc: 'Power output, FTP zones & cadence' },
  { id: 'Basketball', label: 'Basketball', icon: '🏀', desc: 'Jump strain, court accelerations & high RPE' },
  { id: 'Gym', label: 'Strength / Gym', icon: '🏋️', desc: 'Mechanical tension, volume & recovery' },
  { id: 'CrossFit', label: 'CrossFit / HYROX', icon: '⚡', desc: 'High metabolic conditioning & mixed loads' },
  { id: 'Tennis', label: 'Tennis / Racquet', icon: '🎾', desc: 'Rotational power, multi-directional speed' },
  { id: 'Swimming', label: 'Swimming', icon: '🏊', desc: 'Full-body low-impact aerobic engine' },
  { id: 'Track & Field', label: 'Track & Field', icon: '👟', desc: 'Neuromuscular velocity & explosive power' },
  { id: 'Other', label: 'Other Discipline', icon: '🎯', desc: 'Custom athletic conditioning' },
];

export function NeuralOnboardingModal({
  isOpen,
  onComplete,
  initialProfile,
  onClose,
}: NeuralOnboardingModalProps) {
  const [step, setStep] = useState<number>(1);

  // Form state
  const [name, setName] = useState<string>(initialProfile?.name || '');
  const [sport, setSport] = useState<string>(initialProfile?.sport || 'Soccer');
  const [position, setPosition] = useState<string>(initialProfile?.positionOrDiscipline || '');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Pro'>(
    initialProfile?.experienceLevel || 'Advanced'
  );
  const [daysPerWeek, setDaysPerWeek] = useState<number>(initialProfile?.daysPerWeek || 5);
  const [intensity, setIntensity] = useState<'Light' | 'Moderate' | 'Heavy' | 'Elite'>(
    initialProfile?.baselineIntensity || 'Moderate'
  );
  const [goal, setGoal] = useState<TrainingGoal>(initialProfile?.goal || 'competition');
  const [hasEvent, setHasEvent] = useState<boolean>(initialProfile?.upcomingEventName ? true : true);
  const [eventName, setEventName] = useState<string>(
    initialProfile?.upcomingEventName || 'Upcoming Match / Event'
  );
  const [eventDays, setEventDays] = useState<number>(initialProfile?.upcomingEventDays || 4);

  // Calibrating animation step
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [calibrationText, setCalibrationText] = useState<string>('Connecting Neural Telemetry Link...');

  if (!isOpen) return null;

  const handleStartCalibration = () => {
    setIsCalibrating(true);
    setCalibrationProgress(15);
    setCalibrationText('Analyzing athletic profile parameters...');

    setTimeout(() => {
      setCalibrationProgress(45);
      setCalibrationText('Synthesizing 28-day baseline acute & chronic load...');
    }, 600);

    setTimeout(() => {
      setCalibrationProgress(75);
      setCalibrationText('Calibrating 0.8–1.3 ACWR Sweet Spot corridor & injury guardrails...');
    }, 1200);

    setTimeout(() => {
      setCalibrationProgress(100);
      setCalibrationText('Neural link stabilized. Loading interface...');
    }, 1800);

    setTimeout(() => {
      const finalProfile: AthleteProfile = {
        name: name.trim() || 'Athlete',
        sport,
        positionOrDiscipline: position.trim() || (sport === 'Soccer' ? 'Midfielder' : sport === 'Running' ? 'Runner' : 'Athlete'),
        goal,
        experienceLevel: experience,
        daysPerWeek,
        baselineIntensity: intensity,
        upcomingEventName: hasEvent ? eventName : undefined,
        upcomingEventDays: hasEvent ? eventDays : undefined,
        isCustomProfile: true,
      };

      const fixture: MatchFixture | undefined = hasEvent
        ? {
            id: `fix-${Date.now()}`,
            opponent: eventName.trim() || 'Target Event',
            competition: goal === 'competition' ? 'Championship' : 'Key Performance Event',
            date: new Date(Date.now() + eventDays * 86400000).toISOString().split('T')[0],
            daysAway: eventDays,
            importance: eventDays <= 4 ? 'high' : 'medium',
          }
        : undefined;

      onComplete(finalProfile, fixture);
    }, 2300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#090D18] border border-cyan-500/30 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.18)] p-6 sm:p-8 text-slate-100 overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00F0FF]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-cyan-500/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                  NEURAL LINK // CALIBRATION
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                Initialize Athlete Profile
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="font-mono-code text-xs text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full">
              STEP {step} OF 3
            </div>
            {onClose && initialProfile?.isCustomProfile && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white border border-slate-800 hover:border-cyan-500/30"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Calibration Progress Sequence Overlay */}
        <AnimatePresence>
          {isCalibrating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[#070A12]/95 backdrop-blur-2xl z-20 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/90 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.4)] mb-6 animate-pulse">
                <Activity className="w-8 h-8" />
              </div>
              <span className="font-mono-code text-xs text-cyan-400 uppercase tracking-widest mb-2">
                CALIBRATING NEURAL TELEMETRY
              </span>
              <h3 className="text-xl font-display font-bold text-white mb-6">
                Personalizing Sweet Spot Engine
              </h3>

              {/* High-tech progress bar */}
              <div className="w-full max-w-md h-2 bg-slate-900 rounded-full border border-cyan-500/30 overflow-hidden mb-4 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full shadow-[0_0_12px_#00F0FF]"
                  animate={{ width: `${calibrationProgress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <p className="font-mono-code text-xs text-cyan-300/80 min-h-6">
                {calibrationText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Athlete Identity & Sport */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">
                Athlete Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (e.g., Alex Vance)"
                className="w-full px-4 py-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 text-sm font-medium transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">
                Choose Your Sport / Discipline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                {SPORTS.map((s) => {
                  const isSelected = sport === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSport(s.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex flex-col items-center justify-center text-center ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xl mb-1">{s.icon}</span>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">
                  Position / Specialty
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder={sport === 'Soccer' ? 'e.g. Midfielder' : sport === 'Running' ? 'e.g. 10k / Half-Marathon' : 'e.g. Athlete'}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  <option value="Beginner">Beginner (1–2 yrs training)</option>
                  <option value="Intermediate">Intermediate (3–5 yrs consistent)</option>
                  <option value="Advanced">Advanced (Competitive athlete)</option>
                  <option value="Pro">Elite / Semi-Pro</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Training Volume & Schedule */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">
                Weekly Training Frequency ({daysPerWeek} Days / Week)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDaysPerWeek(num)}
                    className={`py-3 rounded-xl border font-mono-code font-bold text-sm transition-all ${
                      daysPerWeek === num
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-cyan-500/30'
                    }`}
                  >
                    {num} Days
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Remaining {7 - daysPerWeek} day{7 - daysPerWeek === 1 ? '' : 's'} will be scheduled as protective rest and recovery flushes.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">
                Typical Session Workload Intensity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'Light', label: 'Light', load: '~350 AU', desc: 'Focus on health & mobility' },
                  { id: 'Moderate', label: 'Moderate', load: '~520 AU', desc: 'Standard club training' },
                  { id: 'Heavy', label: 'Heavy', load: '~720 AU', desc: 'High volume & intensity' },
                  { id: 'Elite', label: 'Elite', load: '~920 AU', desc: 'Full-time pro athlete' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setIntensity(lvl.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      intensity === lvl.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{lvl.label}</div>
                    <div className="font-mono-code text-xs text-cyan-400 mt-0.5">{lvl.load}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Objective & Upcoming Event */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">
                Primary Athletic Objective
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'competition',
                    title: 'Peak for Competition',
                    desc: 'Prioritizes match-readiness with automated pre-event tapers.',
                    icon: Trophy,
                    color: 'text-amber-400',
                  },
                  {
                    id: 'injury-free',
                    title: 'Stay Injury-Free',
                    desc: 'Strictly bounds weekly spikes inside Gabbett 0.8–1.3 corridor.',
                    icon: Shield,
                    color: 'text-emerald-400',
                  },
                  {
                    id: 'endurance',
                    title: 'Build Chronic Engine',
                    desc: 'Progressive safe overload to grow physical work capacity.',
                    icon: Zap,
                    color: 'text-cyan-400',
                  },
                  {
                    id: 'fitness',
                    title: 'General Conditioning',
                    desc: 'Harmonious balance of strength, aerobic fitness, and recovery.',
                    icon: Flame,
                    color: 'text-indigo-400',
                  },
                ].map((g) => {
                  const Icon = g.icon;
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${g.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{g.title}</div>
                        <div className="text-xs text-slate-400 mt-1">{g.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Event Toggle */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono-code uppercase tracking-wider text-slate-300">
                    Upcoming Target Event or Match?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasEvent(!hasEvent)}
                  className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold transition-all ${
                    hasEvent
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {hasEvent ? 'YES, CONFIGURE' : 'NONE RIGHT NOW'}
                </button>
              </div>

              {hasEvent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] font-mono-code text-slate-400 mb-1">
                      Event / Opponent Name
                    </label>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g. City Cup Final or 10K Race"
                      className="w-full px-3 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-code text-slate-400 mb-1">
                      Days Until Event ({eventDays} Days Away)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={14}
                      value={eventDays}
                      onChange={(e) => setEventDays(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer mt-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-cyan-500/20">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:border-cyan-500/30 text-xs font-mono-code transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>
          ) : (
            <div className="text-[11px] font-mono-code text-slate-500">
              * Custom telemetry synthesized on submit
            </div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !name.trim()) {
                  setName('Alexandre Vance');
                }
                setStep((s) => s + 1);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-code shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
            >
              NEXT STEP
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartCalibration}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-bold text-xs font-mono-code shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              CALIBRATE & LAUNCH HUD
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
