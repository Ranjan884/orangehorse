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
  Coffee,
  HelpCircle,
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
  const [newComp, setNewComp] = useState('Championship Tournament');
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl neural-card border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="font-mono-code text-xs font-bold text-cyan-400 uppercase tracking-widest">
              WHAT-IF LAB // WORKLOAD SANDBOX
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Physiological Scenario Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Model tomorrow's workout volume and sleep recovery to forecast their instant impact on your ACWR Training Balance and Injury Risk Index before you step onto the field.
          </p>
        </div>

        <button
          onClick={onResetSimulation}
          className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 text-xs font-mono-code transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Baseline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Workload Sliders */}
        <div className="lg:col-span-7 p-6 rounded-2xl neural-card border border-cyan-500/25 space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Dynamic Impulse Variables
            </h3>
            <span className="text-[11px] font-mono-code text-cyan-400">
              REAL-TIME RECALCULATION
            </span>
          </div>

          {/* Slider 1: Simulated Workout Load */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-slate-300">Simulated Tomorrow's Workload:</span>
              <span className="text-cyan-300 font-bold text-sm">{sliderLoad} AU</span>
            </div>
            <input
              type="range"
              min={0}
              max={1200}
              step={20}
              value={sliderLoad}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSliderLoad(val);
                onApplySimulation(val, sliderRecovery);
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
              <span>0 AU (Full Rest)</span>
              <span>350 AU (Light)</span>
              <span>550 AU (Standard)</span>
              <span>850 AU (Hard)</span>
              <span>1200 AU (Extreme)</span>
            </div>
          </div>

          {/* Slider 2: Recovery Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono-code">
              <span className="text-slate-300">Simulated Recovery / Sleep Score:</span>
              <span className="text-emerald-400 font-bold text-sm">{sliderRecovery}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={sliderRecovery}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSliderRecovery(val);
                onApplySimulation(sliderLoad, val);
              }}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
              <span>20% (Exhausted)</span>
              <span>50% (Drained)</span>
              <span>75% (Good)</span>
              <span>100% (Peak Readiness)</span>
            </div>
          </div>

          {/* 1-Click Simulation Presets */}
          <div>
            <span className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider block mb-2">
              Instant Simulation Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handlePreset(1050, 60)}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-rose-950/40 hover:border-rose-500/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-rose-300">Overload Match</div>
                <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">1050 AU • 60%</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreset(520, 80)}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-cyan-950/40 hover:border-cyan-500/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-cyan-300">Sweet Spot Base</div>
                <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">520 AU • 80%</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreset(180, 85)}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-emerald-950/40 hover:border-emerald-500/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-emerald-300">Active Recovery</div>
                <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">180 AU • 85%</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreset(0, 95)}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700 text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-300">Full Rest Day</div>
                <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">0 AU • 95%</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Event & Match Schedule Manager */}
        <div className="lg:col-span-5 p-6 rounded-2xl neural-card border border-cyan-500/25 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Event Horizon Manager
            </h3>
            <button
              onClick={() => setIsAddingFixture(!isAddingFixture)}
              className="text-xs font-mono-code font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 border border-cyan-500/30 px-2.5 py-1 rounded-lg bg-black/40"
            >
              <Plus className="w-3.5 h-3.5" />
              {isAddingFixture ? 'Cancel' : 'Add Event'}
            </button>
          </div>

          {/* Add Fixture Form */}
          {isAddingFixture && (
            <form onSubmit={handleAddSubmit} className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/30 space-y-3">
              <div>
                <label className="block text-[11px] font-mono-code text-slate-400 mb-1">
                  Opponent or Event Title
                </label>
                <input
                  type="text"
                  value={newOpponent}
                  onChange={(e) => setNewOpponent(e.target.value)}
                  placeholder="e.g. Finals vs Red Star"
                  className="w-full px-3 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white text-xs font-medium focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono-code text-slate-400 mb-1">
                    Days Away ({newDaysAway}d)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={newDaysAway}
                    onChange={(e) => setNewDaysAway(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer mt-1"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-code text-slate-400 mb-1">
                    Importance
                  </label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="high">High (Peak Taper)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (Training Game)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono-code transition-all"
              >
                Schedule Event into Microcycle
              </button>
            </form>
          )}

          {/* List of scheduled fixtures */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {fixtures.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono-code text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No events currently queued. Click '+ Add Event' to schedule.
              </div>
            ) : (
              fixtures.map((fix) => (
                <div
                  key={fix.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between hover:border-cyan-500/30 transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{fix.opponent}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold uppercase ${
                        fix.importance === 'high'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {fix.importance}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono-code mt-0.5">
                      {fix.competition} • In {fix.daysAway} day{fix.daysAway === 1 ? '' : 's'}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteFixture(fix.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
