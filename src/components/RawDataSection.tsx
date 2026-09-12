import React, { useState } from 'react';
import { Database, Download, Upload, Search, Filter, ArrowUpDown, PlusCircle, Flame } from 'lucide-react';
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

  const getFriendlySessionName = (sessionType: string) => {
    switch (sessionType) {
      case 'Match':
        return 'Game / Race Day';
      case 'Development Session':
        return 'Hard Workout';
      case 'Tactical Session':
        return 'Medium Workout';
      case 'Recovery Block':
        return 'Active Recovery';
      case 'Taper Session':
        return 'Pre-Game Taper';
      default:
        return 'Rest Day';
    }
  };

  const filteredSessions = sessions
    .filter(
      (s) =>
        s.date.includes(searchTerm) ||
        s.sessionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFriendlySessionName(s.sessionType).toLowerCase().includes(searchTerm.toLowerCase())
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
    <section className="py-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="p-5 sm:p-7 rounded-3xl glass-card border border-orange-200 shadow-xs">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-orange-200/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#FF5500] font-bold mb-1">
              <Database className="w-4 h-4" />
              <span>Past Workout History &amp; Logs</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight font-display">
              28-Day Activity Records
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Review every workout, track your effort points, or import your smartwatch data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenLogWorkout && (
              <button
                onClick={onOpenLogWorkout}
                className="px-3 py-1.5 rounded-full bg-[#FF5500] hover:bg-[#E84E00] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Log Workout</span>
              </button>
            )}

            {/* Import CSV */}
            <label className="px-3 py-1.5 rounded-full bg-white border border-neutral-200 hover:bg-orange-50 text-neutral-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Import CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-csv"
              />
            </label>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              className="px-3 py-1.5 rounded-full bg-[#1D1814] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-800 transition-colors shadow-2xs"
              id="btn-export-raw-csv"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {importNotice && (
          <div className="mb-4 p-3 rounded-2xl bg-orange-50 text-orange-950 text-xs font-semibold border border-orange-200 flex items-center justify-between">
            <span>{importNotice}</span>
            <button onClick={() => setImportNotice(null)} className="font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by date (e.g. 2026-09) or workout type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
            />
          </div>
          <span className="text-xs font-mono-code text-neutral-500">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-orange-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/50 text-[11px] font-mono-code uppercase text-neutral-600 border-b border-orange-200/60">
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-black"
                >
                  <span className="flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="py-3 px-4 font-bold">Workout Type</th>
                <th
                  onClick={() => toggleSort('load')}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-black"
                >
                  <span className="flex items-center gap-1">
                    Effort Points <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('acwr')}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-black"
                >
                  <span className="flex items-center gap-1">
                    Training Balance <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('distanceM')}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-black"
                >
                  <span className="flex items-center gap-1">
                    Distance <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('rpe')}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-black"
                >
                  <span className="flex items-center gap-1">
                    Intensity (1-10) <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('recovery')}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-black"
                >
                  <span className="flex items-center gap-1">
                    Recovery % <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="py-3 px-4 font-bold">Sleep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 text-xs font-mono-code text-neutral-800">
              {filteredSessions.map((row, idx) => (
                <tr key={idx} className="hover:bg-orange-50/40 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-neutral-900">{row.date}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.sessionType === 'Match'
                          ? 'bg-[#FF5500] text-white'
                          : row.sessionType === 'Recovery Block'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.sessionType === 'Rest Day'
                          ? 'bg-neutral-200 text-neutral-600'
                          : 'bg-orange-100 text-[#EA580C]'
                      }`}
                    >
                      {getFriendlySessionName(row.sessionType)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-neutral-900">{row.load} pts</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`font-bold ${
                        (row.acwr || 1) > 1.5
                          ? 'text-rose-600'
                          : (row.acwr || 1) >= 0.8 && (row.acwr || 1) <= 1.3
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {row.acwr?.toFixed(2) || '—'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    {row.distanceM ? `${(row.distanceM / 1000).toFixed(1)} km` : '—'}
                  </td>
                  <td className="py-2.5 px-4">{row.rpe} / 10</td>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">{row.recovery}%</td>
                  <td className="py-2.5 px-4">{row.sleepHours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
