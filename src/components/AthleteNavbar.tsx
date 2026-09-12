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
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Download,
  HelpCircle,
  PlusCircle,
  Settings,
  BookOpen
} from 'lucide-react';
import { AthleteMetrics, SportType } from '../types';

interface AthleteNavbarProps {
  activeTab: 'dashboard' | 'plan' | 'ai-coach' | 'simulation' | 'raw-data';
  onSelectTab: (tab: 'dashboard' | 'plan' | 'ai-coach' | 'simulation' | 'raw-data') => void;
  metrics: AthleteMetrics;
  onTriggerSummary: () => void;
  isGeneratingSummary: boolean;
  onExportCSV: () => void;
  onOpenGuide: () => void;
  onOpenLogWorkout: () => void;
  onOpenSettings: () => void;
  currentSport?: SportType;
}

export const AthleteNavbar: React.FC<AthleteNavbarProps> = ({
  activeTab,
  onSelectTab,
  metrics,
  onTriggerSummary,
  isGeneratingSummary,
  onExportCSV,
  onOpenGuide,
  onOpenLogWorkout,
  onOpenSettings,
  currentSport = 'Soccer',
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

  // Simplified names for normal people
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, hint: 'Summary & Stats' },
    { id: 'plan', label: '7-Day Plan', icon: Calendar, hint: 'Workout Schedule' },
    { id: 'ai-coach', label: 'AI Coach', icon: Bot, hint: 'Ask Questions' },
    { id: 'simulation', label: 'What-If Lab', icon: Sliders, hint: 'Test Scenarios' },
    { id: 'raw-data', label: 'Past Workouts', icon: Database, hint: 'History & Logs' },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <nav
          className={`relative flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 glass-nav border border-orange-200/80 ${
            isScrolled ? 'shadow-lg bg-white/90 backdrop-blur-2xl' : 'shadow-sm bg-white/75 backdrop-blur-xl'
          }`}
          id="athlete-main-navigation"
        >
          {/* Brand Logo - Orange Horse Theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2 text-left group focus:outline-none"
              id="brand-logo-btn"
            >
              {/* Vibrant Orange Horse Mark */}
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5500] to-[#FF7700] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
                <span>🐎</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900 font-display">
                    OrangeHorse
                  </span>
                  <span className="hidden xs:inline-block text-[10px] font-mono-code uppercase font-bold text-[#FF5500] px-1.5 py-0.2 rounded bg-orange-100">
                    Pro AI
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Fluid Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 relative">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                    isActive ? 'text-neutral-900 font-bold' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill-indicator"
                      className="absolute inset-0 rounded-full bg-white shadow-xs border border-orange-200"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 34,
                      }}
                    />
                  )}
                  <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-[#FF5500]' : 'opacity-70'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls: Quick Guide + Log Workout + Balance Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live Training Balance Pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-code font-bold border ${
                metrics.acwrStatus === 'sweet-spot'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : metrics.acwrStatus === 'caution'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : metrics.acwrStatus === 'danger'
                  ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
              title="Your Training Balance Ratio (0.8–1.3 is the injury-free Sweet Spot)"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  metrics.acwrStatus === 'sweet-spot'
                    ? 'bg-emerald-500'
                    : metrics.acwrStatus === 'caution'
                    ? 'bg-amber-500'
                    : metrics.acwrStatus === 'danger'
                    ? 'bg-rose-500'
                    : 'bg-blue-500'
                }`}
              />
              <span className="text-[11px]">
                {metrics.currentACWR.toFixed(2)}{' '}
                {metrics.acwrStatus === 'sweet-spot'
                  ? '• Sweet Spot'
                  : metrics.acwrStatus === 'caution'
                  ? '• High Load'
                  : metrics.acwrStatus === 'danger'
                  ? '• Spike Danger'
                  : '• Light Load'}
              </span>
            </div>

            {/* Quick Guide / Tutorial Button */}
            <button
              onClick={onOpenGuide}
              className="px-2.5 sm:px-3 py-1 rounded-full bg-orange-100 hover:bg-orange-200 text-[#FF5500] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              title="View simple guide and tutorial for normal people"
              id="btn-nav-guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">App Guide</span>
            </button>

            {/* + Log Workout Button */}
            <button
              onClick={onOpenLogWorkout}
              className="px-2.5 sm:px-3 py-1 rounded-full bg-[#FF5500] hover:bg-[#E84E00] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              id="btn-nav-log-workout"
              title="Record a completed workout"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Log Workout</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-neutral-700 transition-colors"
              title="More options & Athlete Profile"
              id="btn-nav-settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full bg-black/5 text-neutral-800 lg:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden absolute top-full left-0 right-0 mt-2 p-4 rounded-3xl glass-dropdown shadow-xl border border-orange-200 overflow-hidden"
              >
                <div className="flex flex-col gap-1.5">
                  {navTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onSelectTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                          activeTab === tab.id ? 'bg-orange-50 font-bold text-[#FF5500] border border-orange-200' : 'text-neutral-700 hover:bg-white/60'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                          <span className="text-[10px] text-neutral-400">({tab.hint})</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                    );
                  })}

                  <div className="pt-2 mt-2 border-t border-orange-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onOpenGuide();
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 py-2 rounded-xl bg-orange-100 text-[#FF5500] text-xs font-bold text-center"
                    >
                      📖 Beginner Guide
                    </button>
                    <button
                      onClick={() => {
                        onExportCSV();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 px-3 rounded-xl bg-black/5 text-neutral-700 text-xs font-medium"
                    >
                      <Download className="w-4 h-4 inline mr-1" /> CSV
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
};
