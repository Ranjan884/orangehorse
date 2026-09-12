import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  Search,
  ArrowUpDown,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AthleteSession } from '../types';

interface RawDataSectionProps {
  sessions: AthleteSession[];
  onImportSessions: (imported: AthleteSession[]) => void;
  onExportCSV: () => void;
  onOpenLogWorkout?: () => void;
}

export const RawDataSection: React.FC<RawDataSectionProps> = ({
  sessions,
  onImportSessions,
  onExportCSV,
  onOpenLogWorkout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof AthleteSession>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          setImportNotice('CSV file is empty or missing headers.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
        const newSessions: AthleteSession[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/"/g, ''));
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx];
          });

          if (rowObj.date) {
            newSessions.push({
              date: rowObj.date,
              load: Number(rowObj.load) || 400,
              distanceM: Number(rowObj.distancem || rowObj.distance) || 4000,
              rpe: Number(rowObj.rpe) || 6,
              recovery: Number(rowObj.recovery) || 75,
              sleepHours: Number(rowObj.sleephours || rowObj.sleep) || 7.5,
              sessionType: rowObj.sessiontype || 'Development Session',
              dayLabel: rowObj.daylabel,
              acwr: Number(rowObj.acwr) || undefined,
            });
          }
        }

        if (newSessions.length > 0) {
          onImportSessions(newSessions);
          setImportNotice(`Successfully imported ${newSessions.length} workout records.`);
        } else {
          setImportNotice('No valid rows could be parsed from the CSV.');
        }
      } catch (err: any) {
        setImportNotice(`Error parsing CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const filteredSessions = sessions
    .filter(
      (s) =>
        s.date.includes(searchTerm) ||
        s.sessionType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: keyof AthleteSession) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl neural-card border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-mono-code text-xs font-bold text-cyan-400 uppercase tracking-widest">
              TELEMETRY ARCHIVE // WORKOUT LOGS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Historical Training Sessions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Audit raw load points, ACWR balance history, sleep hours, and perceived exertion (RPE) across your training cycle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenLogWorkout && (
            <button
              onClick={onOpenLogWorkout}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-code font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Log New Session
            </button>
          )}

          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 text-xs font-mono-code transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <label className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 text-xs font-mono-code transition-all flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-xs text-cyan-200 font-mono-code flex items-center justify-between">
          <span>{importNotice}</span>
          <button
            onClick={() => setImportNotice(null)}
            className="text-cyan-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search and Table Container */}
      <div className="rounded-2xl neural-card border border-cyan-500/20 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center gap-3">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter sessions by date (e.g. 2026-09) or workout type..."
            className="bg-transparent border-none text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-black/50 border-b border-slate-800 text-slate-400">
              <tr>
                <th
                  onClick={() => toggleSort('date')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300"
                >
                  <span className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="p-3.5">Session Type</th>
                <th
                  onClick={() => toggleSort('load')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300"
                >
                  <span className="flex items-center gap-1">
                    Load (AU) <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('acwr')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300"
                >
                  <span className="flex items-center gap-1">
                    ACWR Ratio <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('recovery')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300"
                >
                  <span className="flex items-center gap-1">
                    Recovery <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('rpe')}
                  className="p-3.5 cursor-pointer hover:text-cyan-300"
                >
                  <span className="flex items-center gap-1">
                    RPE (1-10) <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="p-3.5">Sleep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSessions.map((session, idx) => {
                const acwrVal = session.acwr || 1;
                return (
                  <tr
                    key={idx}
                    className="hover:bg-cyan-950/20 transition-colors text-slate-300"
                  >
                    <td className="p-3.5 font-bold text-white whitespace-nowrap">
                      {session.date}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-cyan-300">
                        {session.sessionType}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-cyan-400">
                      {session.load} AU
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          acwrVal > 1.5
                            ? 'text-rose-400'
                            : acwrVal >= 0.8 && acwrVal <= 1.3
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {acwrVal.toFixed(2)}
                        {acwrVal >= 0.8 && acwrVal <= 1.3 && (
                          <span className="text-[10px] font-normal">• Sweet Spot</span>
                        )}
                      </span>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-semibold">
                      {session.recovery}%
                    </td>
                    <td className="p-3.5">{session.rpe} / 10</td>
                    <td className="p-3.5">{session.sleepHours} hrs</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
