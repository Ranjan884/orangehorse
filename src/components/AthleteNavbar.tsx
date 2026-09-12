import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Calendar,
  Sparkles,
  Bot,
  Sliders,
  Database,
  Menu,
  X,
  PlusCircle,
  BookOpen,
  User,
  Zap,
} from 'lucide-react';
import { AthleteMetrics, AthleteProfile } from '../types';

export type ActiveTabType = 'overview' | 'analytics' | 'microcycle' | 'coach' | 'simulation' | 'logs';

interface AthleteNavbarProps {
  activeTab: ActiveTabType;
  onSelectTab: (tab: ActiveTabType) => void;
  metrics: AthleteMetrics;
  onOpenGuide: () => void;
  onOpenLogWorkout: () => void;
  onOpenProfile: () => void;
  profile: AthleteProfile;
}

export const AthleteNavbar: React.FC<AthleteNavbarProps> = ({
  activeTab,
  onSelectTab,
  metrics,
  onOpenGuide,
  onOpenLogWorkout,
  onOpenProfile,
  profile,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTabs = [
    { id: 'overview' as const, label: 'Neural HUD', icon: Activity, tag: 'Status' },
    { id: 'analytics' as const, label: 'Analytics', icon: Zap, tag: '0.8–1.3' },
    { id: 'microcycle' as const, label: '7-Day Plan', icon: Calendar, tag: 'Cycle' },
    { id: 'coach' as const, label: 'AI Coach', icon: Bot, tag: 'Uplink' },
    { id: 'simulation' as const, label: 'What-If Lab', icon: Sliders, tag: 'Sim' },
    { id: 'logs' as const, label: 'Logs', icon: Database, tag: 'History' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <nav
          className={`relative flex items-center justify-between px-3.5 sm:px-5 py-2.5 rounded-2xl transition-all duration-300 neural-glass-nav ${
            isScrolled ? 'shadow-[0_10px_35px_rgba(0,0,0,0.8)] border-cyan-500/30' : 'border-cyan-500/20'
          }`}
          id="athlete-main-navigation"
        >
          {/* Brand Logo - Neural Interface Theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onSelectTab('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="relative w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/50 text-cyan-400 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform">
                <span className="font-mono-code font-black text-xs">NI</span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold tracking-tight text-white font-display">
                    NEURAL<span className="text-cyan-400">INTERFACE</span>
                  </span>
                  <span className="hidden md:inline-block text-[9px] font-mono-code uppercase font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                    ACWR 0.8–1.3
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Fluid Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1 relative bg-black/40 p-1 rounded-xl border border-cyan-500/20">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                    isActive ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="neural-nav-pill"
                      className="absolute inset-0 rounded-lg bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'opacity-70'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Live Balance Telemetry Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono-code font-bold border transition-all ${
                metrics.acwrStatus === 'sweet-spot'
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : metrics.acwrStatus === 'caution'
                  ? 'bg-amber-950/50 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : metrics.acwrStatus === 'danger'
                  ? 'bg-rose-950/60 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                  : 'bg-cyan-950/50 text-cyan-400 border-cyan-500/40'
              }`}
              title="Current ACWR Balance: 0.8–1.3 is the injury-free Sweet Spot"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  metrics.acwrStatus === 'sweet-spot'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                    : metrics.acwrStatus === 'caution'
                    ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]'
                    : metrics.acwrStatus === 'danger'
                    ? 'bg-rose-400 shadow-[0_0_8px_#F43F5E]'
                    : 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]'
                }`}
              />
              <span>{metrics.currentACWR.toFixed(2)} ACWR</span>
            </div>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-950/70 hover:bg-cyan-950/50 hover:border-cyan-400 text-xs text-slate-200 transition-all font-mono-code"
              title="Calibrate Athlete Profile"
              id="profile-btn"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline font-bold truncate max-w-[100px]">{profile.name.split(' ')[0]}</span>
            </button>

            {/* + Log Session Button */}
            <button
              onClick={onOpenLogWorkout}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-code font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.35)] transition-all"
              id="log-session-btn"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Log Session</span>
            </button>

            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-cyan-500/20 bg-slate-950/60 hover:bg-slate-900 text-slate-300 text-xs font-mono-code transition-all"
              title="Interactive System Guide"
              id="guide-btn"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white border border-cyan-500/20"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 p-3 rounded-2xl neural-card border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
            >
              <div className="grid grid-cols-2 gap-2">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onSelectTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-left border flex items-center gap-2 transition-all ${
                        isActive
                          ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300'
                          : 'bg-black/30 border-slate-800 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <div className="text-xs font-medium">{tab.label}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
