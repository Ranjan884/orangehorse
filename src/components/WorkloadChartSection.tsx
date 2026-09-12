import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Activity,
  Zap,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { AthleteSession } from '../types';

interface WorkloadChartSectionProps {
  sessions: AthleteSession[];
}

export const WorkloadChartSection: React.FC<WorkloadChartSectionProps> = ({ sessions }) => {
  const [rangeDays, setRangeDays] = useState<28 | 14 | 7>(28);
  const [showExplanation, setShowExplanation] = useState(false);

  const displayedSessions = sessions.slice(-rangeDays);

  const getBarColor = (sessionType: string) => {
    switch (sessionType) {
      case 'Match':
      case 'Race / Time Trial':
      case 'Match Day':
        return '#00F0FF'; // Cyber Neon Cyan
      case 'Development Session':
      case 'Tempo & Intervals':
      case 'Heavy Power & Volume':
        return '#6366F1'; // Neural Indigo
      case 'Tactical Session':
      case 'Aerobic Base Run':
      case 'Functional Strength':
        return '#38BDF8'; // Sky Cyan
      case 'Recovery Block':
        return '#10B981'; // Emerald Recovery
      case 'Taper Session':
        return '#F59E0B'; // Amber Taper
      default:
        return '#1E293B'; // Slate Rest
    }
  };

  // Summary statistics calculation
  const totalVolume = displayedSessions.reduce((acc, s) => acc + s.load, 0);
  const avgLoad = Math.round(totalVolume / (displayedSessions.length || 1));
  const maxLoad = Math.max(...displayedSessions.map((s) => s.load), 0);
  const sweetSpotDays = displayedSessions.filter(
    (s) => (s.acwr || 1) >= 0.8 && (s.acwr || 1) <= 1.3
  ).length;
  const sweetSpotPercent = Math.round((sweetSpotDays / (displayedSessions.length || 1)) * 100);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as AthleteSession;
      const acwrVal = data.acwr || 1;
      return (
        <div className="p-3.5 rounded-xl bg-[#090D18] text-white font-mono-code text-xs shadow-[0_0_25px_rgba(0,240,255,0.2)] border border-cyan-500/40 min-w-[220px]">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
            <span className="font-bold text-cyan-300">{data.date}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              {data.sessionType}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Session Load:</span>
              <span className="font-bold text-cyan-400">{data.load} AU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ACWR Ratio:</span>
              <span
                className={`font-bold ${
                  acwrVal > 1.5
                    ? 'text-rose-400'
                    : acwrVal >= 0.8 && acwrVal <= 1.3
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {acwrVal.toFixed(2)}{' '}
                {acwrVal >= 0.8 && acwrVal <= 1.3 ? '• Sweet Spot' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recovery Score:</span>
              <span className="text-emerald-400 font-semibold">{data.recovery}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">RPE (1-10):</span>
              <span className="text-slate-200">{data.rpe} / 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sleep Duration:</span>
              <span className="text-slate-200">{data.sleepHours} hrs</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl neural-card border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-mono-code text-xs font-bold text-cyan-400 uppercase tracking-widest">
              TELEMETRY ANALYTICS // ACWR CORRIDOR
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Workload & Sweet Spot Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect daily strain spikes versus your 28-day conditioning base. Staying between 0.80 and 1.30 builds endurance while shielding soft tissue from breakdown.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-cyan-500/30 self-start md:self-auto">
          {([7, 14, 28] as const).map((days) => (
            <button
              key={days}
              onClick={() => setRangeDays(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all ${
                rangeDays === days
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl neural-card border border-cyan-500/20">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase">Average Daily Load</div>
          <div className="text-2xl font-display font-bold text-white mt-1">{avgLoad} <span className="text-xs font-mono-code text-cyan-400">AU</span></div>
          <div className="text-[11px] text-slate-500 mt-1">{displayedSessions.length} days analyzed</div>
        </div>

        <div className="p-4 rounded-xl neural-card border border-cyan-500/20">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase">Total Training Volume</div>
          <div className="text-2xl font-display font-bold text-white mt-1">{totalVolume.toLocaleString()} <span className="text-xs font-mono-code text-cyan-400">AU</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Total physical stress</div>
        </div>

        <div className="p-4 rounded-xl neural-card border border-cyan-500/20">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase">Peak Single Session</div>
          <div className="text-2xl font-display font-bold text-cyan-300 mt-1">{maxLoad} <span className="text-xs font-mono-code text-cyan-400">AU</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Highest acute demand</div>
        </div>

        <div className="p-4 rounded-xl neural-card border border-cyan-500/20">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase">Sweet Spot Compliance</div>
          <div className="text-2xl font-display font-bold text-emerald-400 mt-1">{sweetSpotPercent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{sweetSpotDays} of {displayedSessions.length} days in 0.8–1.3</div>
        </div>
      </div>

      {/* Main High-Tech Cyber Chart Canvas */}
      <div className="p-5 sm:p-6 rounded-2xl neural-card border border-cyan-500/25 relative overflow-hidden">
        {/* Chart Legend and Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
              <span className="text-slate-300">Daily Session Load (AU)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-indigo-400" />
              <span className="text-slate-300">ACWR Ratio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 rounded-full bg-emerald-400/40 border border-emerald-400" />
              <span className="text-emerald-400">Sweet Spot Corridor (0.80 – 1.30)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-rose-500" />
              <span className="text-rose-400">Danger Spike Threshold (1.50)</span>
            </div>
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showExplanation ? 'Hide Guide' : 'How to Read This Chart'}
          </button>
        </div>

        {/* Inline Guide Collapsible */}
        {showExplanation && (
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 space-y-2 mb-6">
            <div className="font-bold text-cyan-300">Reading Your Workload & Ratio Chart:</div>
            <p>
              • <strong>The Vertical Bars (Cyan / Indigo / Emerald)</strong> show each day's raw exertion load in Arbitrary Units (AU).
            </p>
            <p>
              • <strong>The Purple Trend Line</strong> is your ACWR (Acute:Chronic Workload Ratio). When it stays inside the <strong>green corridor (0.80–1.30)</strong>, your body adapts without breaking down.
            </p>
            <p>
              • <strong>Crossing 1.50 (Red line)</strong> flags an acute spike, tripling your risk of soft-tissue pulls or hamstring tears over the following 5–7 days.
            </p>
          </div>
        )}

        {/* Recharts Canvas */}
        <div className="h-80 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={displayedSessions}
              margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0, 240, 255, 0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={11}
                fontFamily="JetBrains Mono"
                tickFormatter={(str) => {
                  const d = new Date(str);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />

              {/* Left Axis: Workload AU */}
              <YAxis
                yAxisId="left"
                stroke="#64748B"
                fontSize={11}
                fontFamily="JetBrains Mono"
                domain={[0, (dataMax: number) => Math.max(1200, Math.ceil(dataMax * 1.15))]}
                label={{
                  value: 'Workload (AU)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#64748B',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              {/* Right Axis: ACWR Ratio */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748B"
                fontSize={11}
                fontFamily="JetBrains Mono"
                domain={[0, 2.2]}
                ticks={[0.5, 0.8, 1.0, 1.3, 1.5, 2.0]}
                label={{
                  value: 'ACWR Ratio',
                  angle: 90,
                  position: 'insideRight',
                  fill: '#64748B',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Sweet Spot Corridor Lines */}
              <ReferenceLine
                yAxisId="right"
                y={0.8}
                stroke="#10B981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '0.80 Sweet Spot Min',
                  position: 'insideTopLeft',
                  fill: '#10B981',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              <ReferenceLine
                yAxisId="right"
                y={1.3}
                stroke="#10B981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '1.30 Sweet Spot Max',
                  position: 'insideTopLeft',
                  fill: '#10B981',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              <ReferenceLine
                yAxisId="right"
                y={1.5}
                stroke="#F43F5E"
                strokeWidth={1.5}
                label={{
                  value: '1.50 Danger Spike',
                  position: 'insideTopRight',
                  fill: '#F43F5E',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />

              {/* Workload Bars */}
              <Bar yAxisId="left" dataKey="load" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {displayedSessions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.sessionType)} />
                ))}
              </Bar>

              {/* ACWR Trend Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="acwr"
                stroke="#818CF8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#818CF8' }}
                activeDot={{ r: 6, fill: '#00F0FF', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
