import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  Calendar,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Bot,
} from 'lucide-react';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: 'Neural Interface Performance System',
      subtitle: 'The high-precision science to build stamina and eliminate soft-tissue injuries.',
      badge: 'Step 1 of 4 • System Architecture',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Most athletes face a frustrating dilemma: <strong>training too hard causes breakdown</strong>, while under-training causes lost fitness.
          </p>
          <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-1.5 mb-1 font-display">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              The Neural Interface Principle
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on Dr. Tim Gabbett's gold-standard ACWR sports-science model, this platform continuously computes your <strong>Acute:Chronic Workload Ratio</strong> to pinpoint your biological <strong>Sweet Spot (0.80–1.30)</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20">
              <span className="text-xs font-bold text-cyan-300 block mb-1 font-mono-code">1. Track Exertion</span>
              <span className="text-[11px] text-slate-400">Log daily workouts and perceived exertion in Arbitrary Units (AU).</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20">
              <span className="text-xs font-bold text-emerald-400 block mb-1 font-mono-code">2. Sweet Spot Zone</span>
              <span className="text-[11px] text-slate-400">Stay between 0.80 and 1.30 to adapt quickly without tissue tears.</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20">
              <span className="text-xs font-bold text-indigo-400 block mb-1 font-mono-code">3. 7-Day Protocol</span>
              <span className="text-[11px] text-slate-400">Follow an automated microcycle that schedules taper days before matches.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'The 3 Core Telemetry Metrics',
      subtitle: 'Translating sports science into clear, actionable numbers.',
      badge: 'Step 2 of 4 • Biometrics',
      icon: Activity,
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-cyan-300 font-mono-code">
                1. Acute Workload (Fatigue)
              </span>
              <span className="text-[10px] text-slate-400 font-mono-code">7-Day Rolling Average</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Represents what you did this past week. High acute spikes without a base cause muscle strains.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-indigo-300 font-mono-code">
                2. Chronic Workload (Fitness Armor)
              </span>
              <span className="text-[10px] text-slate-400 font-mono-code">28-Day Baseline</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your conditioning foundation. Higher chronic base protects you from high-intensity sprint fatigue.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-emerald-300 font-mono-code">
                3. ACWR Ratio (0.80 — 1.30)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono-code">The Sweet Spot</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Acute divided by Chronic. Below 0.8 is detraining; 0.8 to 1.3 is optimal adaptation; above 1.5 spikes soft-tissue injury risk by 200–400%.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Dedicated Feature Tabs',
      subtitle: 'Organized navigation designed for clarity and speed.',
      badge: 'Step 3 of 4 • Navigation',
      icon: Calendar,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
              <span className="text-xs font-bold text-cyan-300 font-mono-code block">Neural HUD</span>
              <span className="text-[11px] text-slate-400">Live sweet spot status, vital gauges, and daily AI coach briefing.</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
              <span className="text-xs font-bold text-cyan-300 font-mono-code block">Analytics</span>
              <span className="text-[11px] text-slate-400">Interactive charts with visual Sweet Spot Corridor (0.8–1.3) and spike thresholds.</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
              <span className="text-xs font-bold text-cyan-300 font-mono-code block">7-Day Plan</span>
              <span className="text-[11px] text-slate-400">Autonomous weekly plan with editable target loads and decision logs.</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
              <span className="text-xs font-bold text-cyan-300 font-mono-code block">AI Coach Uplink</span>
              <span className="text-[11px] text-slate-400">Ask questions in real time about nutrition, recovery, and tapering.</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
              <span className="text-xs font-bold text-cyan-300 font-mono-code block">What-If Lab</span>
              <span className="text-[11px] text-slate-400">Simulate workouts and sleep before training to preview the impact.</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
              <span className="text-xs font-bold text-cyan-300 font-mono-code block">Session Logs</span>
              <span className="text-[11px] text-slate-400">Historical workout table, CSV export, and batch import.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Ready for High-Performance Training',
      subtitle: 'Your profile has calibrated your initial telemetry.',
      badge: 'Step 4 of 4 • Telemetry Ready',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300">
            <h4 className="font-bold text-sm mb-1 font-display flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Telemetry Online & Grounded
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Whenever you complete a session, tap <strong>Log Session</strong> in the top bar to keep your ACWR updated. The system will autonomously recalibrate your upcoming days.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20 text-xs text-slate-300 space-y-1 font-mono-code">
            <div className="text-cyan-400 font-bold">Pro-Tips:</div>
            <div>• Feeling fatigued? Tap 'I Feel Tired' on the HUD for an instant active flush.</div>
            <div>• Schedule upcoming matches in the What-If Lab to activate automatic tapering.</div>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl rounded-2xl neural-card border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-cyan-500/20 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase font-bold text-cyan-400 tracking-wider">
                {currentStep.badge}
              </span>
              <h3 className="text-lg font-display font-bold text-white">
                {currentStep.title}
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

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <p className="text-xs text-slate-400 font-mono-code mb-4">
            {currentStep.subtitle}
          </p>
          {currentStep.content}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-cyan-500/20 bg-black/60 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStep === idx
                    ? 'w-6 bg-cyan-400 shadow-[0_0_8px_#00F0FF]'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-mono-code text-slate-300 hover:text-white"
              >
                Previous
              </button>
            )}

            {activeStep < steps.length - 1 ? (
              <button
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono-code text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono-code text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                Enter Neural Interface
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
