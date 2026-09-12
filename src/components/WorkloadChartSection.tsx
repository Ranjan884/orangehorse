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
  Cell
} from 'recharts';
import { BarChart3, HelpCircle, Flame } from 'lucide-react';
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
        return '#FF5500'; // Racehorse Orange
      case 'Development Session':
        return '#EA580C'; // Deep Amber
      case 'Tactical Session':
        return '#FB923C'; // Warm Orange
      case 'Recovery Block':
        return '#10B981'; // Emerald recovery
      case 'Taper Session':
        return '#F59E0B'; // Gold Amber
      default:
        return '#E5E7EB'; // Gray rest
    }
  };

  const getFriendlySessionName = (sessionType: string) => {
    switch (sessionType) {
      case 'Match':
        return 'Game / Race Day';
      case 'Development Session':
        return 'Hard Workout (Base Engine)';
      case 'Tactical Session':
        return 'Medium Workout (Skills & Form)';
      case 'Recovery Block':
        return 'Active Recovery & Flush';
      case 'Taper Session':
        return 'Pre-Game Taper';
      default:
        return 'Rest Day';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as AthleteSession;
      return (
        <div className="p-3.5 rounded-2xl bg-[#1A1613] text-white font-mono-code text-xs shadow-xl border border-orange-900/60 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-2">
            <span className="font-bold text-white">{data.date}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5500]/20 text-[#FF5500] font-bold">
              {getFriendlySessionName(data.sessionType)}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">Workout Effort:</span>
              <span className="font-bold text-[#FF5500]">{data.load} Load Points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Training Balance:</span>
              <span
                className={`font-bold ${
                  (data.acwr || 1) > 1.5
                    ? 'text-rose-400'
                    : (data.acwr || 1) >= 0.8 && (data.acwr || 1) <= 1.3
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {data.acwr?.toFixed(2) || '1.00'}{' '}
                {(data.acwr || 1) >= 0.8 && (data.acwr || 1) <= 1.3 ? '• Sweet Spot' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">GPS Distance:</span>
              <span>{data.distanceM ? `${(data.distanceM / 1000).toFixed(1)} km` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Effort Rating (RPE):</span>
              <span>{data.rpe} / 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Body Recovery:</span>
              <span className="text-emerald-400 font-bold">{data.recovery}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="p-5 sm:p-7 rounded-3xl glass-card border border-orange-200 shadow-xs">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-orange-200/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#FF5500] font-bold mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Workout Effort &amp; Sweet Spot Chart</span>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-neutral-400 hover:text-neutral-800"
                title="How to read this chart"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-neutral-900 tracking-tight font-display">
              Daily Training Strain vs. Safe Training Corridor
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              The bars show your daily workout strain. The black line tracks your balance — keep it inside the green 0.8–1.3 zone!
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-orange-100/70 border border-orange-200">
            {([28, 14, 7] as const).map((days) => (
              <button
                key={days}
                onClick={() => setRangeDays(days)}
                className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold transition-all ${
                  rangeDays === days
                    ? 'bg-[#FF5500] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Last {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Explanation for normal people */}
        {showExplanation && (
          <div className="mb-4 p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-neutral-700 space-y-1">
            <span className="font-bold text-neutral-900 block">How to read this:</span>
            <p>• <strong>Bars:</strong> How much exertion you put in that day. Higher bar = harder workout.</p>
            <p>• <strong>Black Line:</strong> Your training balance. When it's in the green dashed zone (0.8 to 1.3), your body is absorbing the training smoothly.</p>
            <p>• <strong>Red Dashed Line (1.5):</strong> If the black line crosses this red ceiling, you're in the danger zone for muscle pulls.</p>
          </div>
        )}

        {/* Legend bar with friendly names */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono-code text-neutral-700 mb-5">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#FF5500]" /> Game / Race Day
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#EA580C]" /> Hard Training
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#FB923C]" /> Medium Skills
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#10B981]" /> Active Recovery
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-4 h-0.5 bg-[#1D1814]" /> Balance Trend
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold">
            🟢 0.8–1.3 Sweet Spot
          </span>
          <span className="flex items-center gap-1.5 text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded-full font-bold">
            🔴 1.5 Spike Danger
          </span>
        </div>

        {/* Recharts Canvas */}
        <div className="w-full h-[340px] sm:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayedSessions} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 85, 0, 0.08)" vertical={false} />
              
              <XAxis
                dataKey="date"
                tickFormatter={(val) => {
                  const parts = val.split('-');
                  return `${parts[1]}/${parts[2]}`;
                }}
                tick={{ fontSize: 11, fill: '#78716C', fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={{ stroke: 'rgba(255, 85, 0, 0.15)' }}
                tickLine={false}
              />

              {/* Left Axis: Load Points */}
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, 1200]}
                tick={{ fontSize: 11, fill: '#78716C', fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={false}
                tickLine={false}
                unit=" pts"
              />

              {/* Right Axis: Balance Ratio */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 2.4]}
                tick={{ fontSize: 11, fill: '#FF5500', fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={false}
                tickLine={false}
              />

              {/* Sweet Spot Corridor */}
              <ReferenceLine
                yAxisId="right"
                y={0.8}
                stroke="#10B981"
                strokeDasharray="3 3"
                label={{
                  value: '0.8 Sweet Spot Min',
                  fill: '#10B981',
                  fontSize: 10,
                  position: 'insideBottomLeft',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
              <ReferenceLine
                yAxisId="right"
                y={1.3}
                stroke="#10B981"
                strokeDasharray="3 3"
                label={{
                  value: '1.3 Sweet Spot Max',
                  fill: '#10B981',
                  fontSize: 10,
                  position: 'insideTopLeft',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />

              {/* Danger Line */}
              <ReferenceLine
                yAxisId="right"
                y={1.5}
                stroke="#EF4444"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '1.5 Spike Danger',
                  fill: '#EF4444',
                  fontSize: 10,
                  position: 'right',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Bars for Daily Workload */}
              <Bar yAxisId="left" dataKey="load" radius={[6, 6, 0, 0]} maxBarSize={28}>
                {displayedSessions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.sessionType)} />
                ))}
              </Bar>

              {/* Trend Line for Training Balance */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="acwr"
                stroke="#1D1814"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#1D1814', strokeWidth: 1, stroke: '#FFFFFF' }}
                activeDot={{ r: 5, fill: '#FF5500', strokeWidth: 2, stroke: '#FFFFFF' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Interpretation */}
        <div className="mt-4 pt-3 border-t border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 font-mono-code gap-2">
          <span>
            Calculated with 28-day historical baseline • Updated continuously with your workout logs
          </span>
          <span className="text-[#FF5500] font-bold">
            Status: Training tracking active
          </span>
        </div>
      </div>
    </section>
  );
};
