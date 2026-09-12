import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  HeartPulse,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Flame,
  Activity,
  Sliders,
  Calendar,
  Compass
} from 'lucide-react';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: 'Welcome to the Orange Horse Performance Planner',
      subtitle: 'The simple way to build athletic stamina and never get injured.',
      badge: 'Step 1 of 4 • The Big Picture',
      icon: Flame,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Most athletes and everyday runners make one common mistake: <strong>they push too hard too fast</strong>, or rest too long and lose fitness.
          </p>
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200">
            <h4 className="font-bold text-sm text-[#FF5500] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              The Orange Horse Philosophy
            </h4>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Just like high-performance racehorses and elite runners, your body needs steady, progressive conditioning. This app calculates your exact <strong>Training Sweet Spot</strong> so you peak at the right time without pulling muscles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white border border-neutral-200">
              <span className="text-xs font-bold text-neutral-900 block mb-1">1. Track Effort</span>
              <span className="text-[11px] text-neutral-600">See your past workouts and daily stress in simple load points.</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-neutral-200">
              <span className="text-xs font-bold text-neutral-900 block mb-1">2. Stay in the Zone</span>
              <span className="text-[11px] text-neutral-600">Keep your ratio between 0.8 and 1.3 to avoid fatigue spikes.</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-neutral-200">
              <span className="text-xs font-bold text-neutral-900 block mb-1">3. Smart 7-Day Plan</span>
              <span className="text-[11px] text-neutral-600">Get an automated daily schedule that protects you before games.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'The 3 Numbers That Matter (In Plain English)',
      subtitle: 'Understanding your body numbers without medical jargon.',
      badge: 'Step 2 of 4 • Core Numbers',
      icon: Activity,
      content: (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
                <span className="font-bold text-xs text-neutral-900">1. Training Balance (The Sweet Spot Ratio)</span>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Goal: 0.80 – 1.30
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Think of this as a speedometer. If it's <strong>under 0.8</strong>, you're undertraining and losing fitness. If it's <strong>between 0.8 and 1.3</strong>, your body is getting stronger safely. If it spikes <strong>over 1.5</strong>, your risk of pulled muscles jumps by 300%.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-bold text-xs text-neutral-900">2. This Week's Effort (Recent Fatigue)</span>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-black/5 text-neutral-600">
                7-Day Window
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              The total physical strain accumulated over your last 7 days. High effort is great for building speed, but too much back-to-back causes chronic burnout.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-bold text-xs text-neutral-900">3. Long-Term Fitness Base (Your Engine)</span>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                28-Day Baseline
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Your aerobic engine built over the past 4 weeks. The bigger your fitness base, the more punishment your body can safely handle without breaking down.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Your 7-Day Smart Workout Schedule',
      subtitle: 'How the AI schedules your week around your matches or long runs.',
      badge: 'Step 3 of 4 • Daily Schedule',
      icon: Calendar,
      content: (
        <div className="space-y-3.5">
          <p className="text-sm text-neutral-700 leading-relaxed">
            Every morning, the AI looks at your current recovery and upcoming games, and balances your 7-day week:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-[#FF5500] text-white text-xs font-bold mt-0.5">🏁</span>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Game / Competition Day</span>
                <span className="text-[11px] text-neutral-600">All-out match effort (high load points).</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-blue-500 text-white text-xs font-bold mt-0.5">⚡</span>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Hard Workout (Build Base)</span>
                <span className="text-[11px] text-neutral-600">High intensity to raise your long-term fitness.</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-purple-500 text-white text-xs font-bold mt-0.5">🎯</span>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Medium Skills / Form</span>
                <span className="text-[11px] text-neutral-600">Tactics, drills, and rhythm without heavy strain.</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-emerald-500 text-white text-xs font-bold mt-0.5">🌿</span>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">Active Recovery & Taper</span>
                <span className="text-[11px] text-neutral-600">Light movement, foam rolling, and pre-game rest.</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-500 bg-black/5 p-2.5 rounded-xl font-mono-code">
            💡 <strong>Pro Tip:</strong> Click "Adjust" on any day in the table to change the workout if your schedule changes!
          </p>
        </div>
      ),
    },
    {
      title: 'Tools: What-If Simulator & AI Coach',
      subtitle: 'Ask questions, test workout scenarios, and log your training.',
      badge: 'Step 4 of 4 • Interactive Tools',
      icon: Sliders,
      content: (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200">
            <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5 mb-1">
              <Sliders className="w-4 h-4 text-[#FF5500]" />
              The "What-If" Workout Simulator
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Wondering what happens if you run an extra 10km tomorrow or skip training for 3 days? Slide the controls in the <strong>What-If Simulator</strong> tab to see how your injury risk and fitness adapt in real-time!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200">
            <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-[#FF5500]" />
              AI Performance Coach (Chat anytime)
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              In the <strong>AI Coach</strong> tab, you can ask in plain English: <em>"Why do I feel sluggish today?"</em> or <em>"How should I eat before Saturday's game?"</em> and get instant sports-science advice.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200">
            <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5 mb-1">
              <PlusIcon className="w-4 h-4 text-[#FF5500]" />
              + Log Today's Workout Button
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Click the orange <strong>"+ Log Workout"</strong> button in the top navigation anytime to record your sessions in 10 seconds.
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-[#FAF8F5] border border-orange-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="app-guide-modal-container"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-orange-200/60 bg-white/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-bold shadow-xs">
              🐎
            </div>
            <div>
              <span className="text-[11px] font-mono-code uppercase font-semibold text-[#FF5500]">
                {current.badge}
              </span>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                {current.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-neutral-500 hover:text-neutral-900 transition-colors"
            id="close-guide-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs Indicator */}
        <div className="flex border-b border-orange-100 bg-orange-50/40 px-6 py-2 gap-1.5 overflow-x-auto">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeStep === idx
                  ? 'bg-[#FF5500] text-white shadow-xs font-semibold'
                  : 'text-neutral-600 hover:bg-orange-100/50'
              }`}
            >
              {idx + 1}. {idx === 0 ? 'Start' : idx === 1 ? 'Numbers' : idx === 2 ? 'Schedule' : 'Tools'}
            </button>
          ))}
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <p className="text-xs text-neutral-500 font-medium">{current.subtitle}</p>
          {current.content}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-orange-200/60 bg-white/80 flex items-center justify-between">
          <button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-30 transition-all"
          >
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStep === idx ? 'w-5 bg-[#FF5500]' : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-5 py-2 rounded-full bg-[#FF5500] hover:bg-[#E84E00] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready to Train!</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

function PlusIcon(props: any) {
  return (
    <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
