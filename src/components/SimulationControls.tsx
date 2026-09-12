import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Trophy,
  AlertTriangle,
  Sparkles,
  Zap,
  Flame,
  Coffee,
  HelpCircle
} from 'lucide-react';
import { MatchFixture } from '../types';

interface SimulationControlsProps {
  currentLoad: number;
  currentRecovery: number;
  onApplySimulation: (simulatedLoad: number, simulatedRecovery: number) => void;
  onResetSimulation: () => void;
  fixtures: MatchFixture[];
  onAddFixture: (fixture: Omit<MatchFixture, 'id'>) => void;
  onDeleteFixture: (id: string) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentLoad,
  currentRecovery,
  onApplySimulation,
  onResetSimulation,
  fixtures,
  onAddFixture,
  onDeleteFixture,
}) => {
  const [sliderLoad, setSliderLoad] = useState<number>(currentLoad);
  const [sliderRecovery, setSliderRecovery] = useState<number>(currentRecovery);

  // New fixture form state
  const [isAddingFixture, setIsAddingFixture] = useState(false);
  const [newOpponent, setNewOpponent] = useState('');
  const [newComp, setNewComp] = useState('League Match / Race');
  const [newDaysAway, setNewDaysAway] = useState(3);
  const [newImportance, setNewImportance] = useState<'low' | 'medium' | 'high'>('high');

  const handlePreset = (load: number, recovery: number) => {
    setSliderLoad(load);
    setSliderRecovery(recovery);
    onApplySimulation(load, recovery);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpponent.trim()) return;

    const d = new Date();
    d.setDate(d.getDate() + newDaysAway);

    onAddFixture({
      opponent: newOpponent.trim(),
      competition: newComp,
      date: d.toISOString().split('T')[0],
      daysAway: Number(newDaysAway),
      importance: newImportance,
    });

    setNewOpponent('');
    setIsAddingFixture(false);
  };

  return (
    <section className="py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: What-If Workout Simulator */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl glass-card border border-orange-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-orange-200/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-bold text-sm">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 font-display">
                    What-If Workout Simulator
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-mono-code">
                    Test how different training days affect your body in real-time
                  </span>
                </div>
              </div>
              <button
                onClick={onResetSimulation}
                className="text-xs font-mono-code font-bold text-[#FF5500] hover:text-[#E84E00] flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
              Wondering if you can handle an intense game or should take an extra rest day? Move the sliders below to see your injury risk and recommended 7-day schedule adapt instantly.
            </p>

            {/* Quick 1-Click Scenario Buttons */}
            <div className="mb-6">
              <span className="text-[10px] font-mono-code uppercase font-bold text-neutral-500 block mb-2">
                Try a 1-Click Scenario:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handlePreset(1050, 85)}
                  className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-left transition-all text-xs font-semibold flex flex-col gap-0.5 shadow-2xs hover:shadow-xs group"
                >
                  <span className="text-[#FF5500] font-bold">🏁 Big Match</span>
                  <span className="text-[10px] text-neutral-500 font-normal">1,050 pts • High load</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePreset(650, 75)}
                  className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-left transition-all text-xs font-semibold flex flex-col gap-0.5 shadow-2xs hover:shadow-xs group"
                >
                  <span className="text-[#EA580C] font-bold">⚡ Hard Workout</span>
                  <span className="text-[10px] text-neutral-500 font-normal">650 pts • Stamina build</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePreset(200, 50)}
                  className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-left transition-all text-xs font-semibold flex flex-col gap-0.5 shadow-2xs hover:shadow-xs group"
                >
                  <span className="text-emerald-700 font-bold">🌿 Active Stretch</span>
                  <span className="text-[10px] text-neutral-500 font-normal">200 pts • Flush lactate</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePreset(0, 40)}
                  className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-left transition-all text-xs font-semibold flex flex-col gap-0.5 shadow-2xs hover:shadow-xs group"
                >
                  <span className="text-neutral-700 font-bold">😴 Complete Rest</span>
                  <span className="text-[10px] text-neutral-500 font-normal">0 pts • Recharge day</span>
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5 bg-white/70 p-4 rounded-2xl border border-orange-100 mb-6">
              {/* Daily Load Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5 font-mono-code text-xs">
                  <span className="text-neutral-800 font-bold">Today's Workout Strain</span>
                  <span className="font-bold text-[#FF5500] text-sm bg-orange-100 px-2 py-0.5 rounded-lg">
                    {sliderLoad} Load Points
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="25"
                  value={sliderLoad}
                  onChange={(e) => setSliderLoad(Number(e.target.value))}
                  className="w-full accent-[#FF5500] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono-code text-neutral-400 mt-1">
                  <span>0 pts (Full Rest)</span>
                  <span>500 pts (Moderate)</span>
                  <span>1,000+ pts (All-Out Match)</span>
                </div>
              </div>

              {/* Recovery Readiness Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5 font-mono-code text-xs">
                  <span className="text-neutral-800 font-bold">Body Energy &amp; Recovery Score</span>
                  <span
                    className={`font-bold text-sm px-2 py-0.5 rounded-lg ${
                      sliderRecovery >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : sliderRecovery >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sliderRecovery}% Readiness
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={sliderRecovery}
                  onChange={(e) => setSliderRecovery(Number(e.target.value))}
                  className="w-full accent-[#FF5500] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono-code text-neutral-400 mt-1">
                  <span>20% (Exhausted / Poor Sleep)</span>
                  <span>60% (Average)</span>
                  <span>100% (Peak Recharged)</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => onApplySimulation(sliderLoad, sliderRecovery)}
              className="w-full py-2.5 rounded-2xl bg-[#FF5500] hover:bg-[#E84E00] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
              id="btn-apply-simulation"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Apply Test Scenario to Plan &amp; Dashboard</span>
            </button>
          </div>
        </div>

        {/* Right Column: Upcoming Matches / Competitions */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl glass-card border border-orange-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-orange-200/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5500] flex items-center justify-center font-bold text-sm">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 font-display">
                    Upcoming Events &amp; Matches
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-mono-code">
                    The AI automatically plans pre-game tapers before each event
                  </span>
                </div>
              </div>

              {!isAddingFixture && (
                <button
                  onClick={() => setIsAddingFixture(true)}
                  className="px-2.5 py-1 rounded-full bg-[#FF5500] text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-[#E84E00] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Event</span>
                </button>
              )}
            </div>

            {/* Add Fixture Form */}
            {isAddingFixture && (
              <form
                onSubmit={handleAddSubmit}
                className="mb-4 p-4 rounded-2xl bg-white border border-orange-200 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">Add New Competition / Match</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingFixture(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-700"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Event / Opponent Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Marathon / Red Star FC"
                    value={newOpponent}
                    onChange={(e) => setNewOpponent(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Competition
                    </label>
                    <input
                      type="text"
                      value={newComp}
                      onChange={(e) => setNewComp(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Days Away
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={newDaysAway}
                      onChange={(e) => setNewDaysAway(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono-code"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#FF5500] text-white text-xs font-bold shadow-2xs hover:bg-[#E84E00]"
                >
                  Save Event &amp; Adjust Schedule
                </button>
              </form>
            )}

            {/* List of Existing Fixtures */}
            <div className="space-y-2.5">
              {fixtures.map((fix) => (
                <div
                  key={fix.id}
                  className="p-3.5 rounded-2xl bg-white/80 border border-orange-200/80 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-orange-50 text-[#FF5500] text-sm font-bold">
                      🏆
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900">{fix.opponent}</span>
                        <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                          in {fix.daysAway} days
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono-code">
                        {fix.competition} • {fix.date}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteFixture(fix.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                    title="Remove event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-100 text-xs text-neutral-500 font-mono-code">
            ⚡ Matches require an MD-1 taper day at 40% load to preserve muscle freshness.
          </div>
        </div>
      </div>
    </section>
  );
};
