import { AthleteSession, AthleteMetrics, MicrocycleDay, MatchFixture, AgentReasoningLog, ACWRStatus, AthleteProfile } from '../types';

// Generate 28 days of historical training session data adapted to the athlete's custom profile
export function generateInitialHistory(profile?: AthleteProfile): AthleteSession[] {
  const sessions: AthleteSession[] = [];
  const today = new Date();

  // Multiplier from profile intensity
  let intensityFactor = 1.0;
  if (profile?.baselineIntensity === 'Light') intensityFactor = 0.68;
  else if (profile?.baselineIntensity === 'Moderate') intensityFactor = 1.0;
  else if (profile?.baselineIntensity === 'Heavy') intensityFactor = 1.35;
  else if (profile?.baselineIntensity === 'Elite') intensityFactor = 1.65;

  const daysPerWeek = profile?.daysPerWeek || 5;

  // Pattern of loads over the last 28 days
  const rawBase = [
    520, 640, 180, 710, 580, 920, 0, // Week 1
    490, 630, 680, 200, 550, 960, 0, // Week 2
    540, 710, 210, 650, 600, 990, 0, // Week 3
    520, 670, 220, 730, 620, 1020, 0 // Week 4
  ];

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat

    // Calibrate rest days based on daysPerWeek
    let isDayRest = false;
    if (daysPerWeek <= 3 && (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 0)) {
      isDayRest = true;
    } else if (daysPerWeek === 4 && (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 0)) {
      isDayRest = true;
    } else if (daysPerWeek === 5 && (dayOfWeek === 3 || dayOfWeek === 0)) {
      isDayRest = true;
    } else if (daysPerWeek === 6 && dayOfWeek === 0) {
      isDayRest = true;
    }

    let rawLoad = Math.round((rawBase[27 - i] || 500) * intensityFactor);
    if (isDayRest) {
      rawLoad = 0;
    }

    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isMatch = rawLoad >= Math.round(850 * intensityFactor);
    const isRest = rawLoad === 0;
    const isRec = rawLoad > 0 && rawLoad <= Math.round(250 * intensityFactor);

    // Dynamic session types adapted to sport
    const sportName = profile?.sport?.toLowerCase() || 'general';
    let sessionType = 'Tactical Session';
    if (isMatch) {
      sessionType = sportName.includes('run') ? 'Race / Time Trial' : sportName.includes('cycl') ? 'Gran Fondo / Race' : 'Match Day';
    } else if (isRest) {
      sessionType = 'Rest Day';
    } else if (isRec) {
      sessionType = 'Recovery Block';
    } else if (rawLoad > Math.round(620 * intensityFactor)) {
      sessionType = sportName.includes('run') ? 'Tempo & Intervals' : sportName.includes('gym') ? 'Heavy Power & Volume' : 'Development Session';
    } else {
      sessionType = sportName.includes('run') ? 'Aerobic Base Run' : sportName.includes('gym') ? 'Functional Strength' : 'Tactical Session';
    }

    const distanceM = isRest
      ? 0
      : Math.round(rawLoad * (isMatch ? 11 : 8.5) + (Math.random() * 150));
    const rpe = isRest ? 0 : isMatch ? 9 : isRec ? 3 : Math.min(8, Math.max(4, Math.round(rawLoad / (80 * intensityFactor))));
    const recovery = isRest ? 88 : Math.round(80 - (rawLoad / (24 * intensityFactor)) + (Math.random() * 10));
    const sleepHours = Math.round((7 + Math.random() * 2) * 10) / 10;

    sessions.push({
      date: dateStr,
      dayLabel,
      load: rawLoad,
      distanceM,
      rpe,
      recovery: Math.max(35, Math.min(95, recovery)),
      sleepHours,
      sessionType,
    });
  }

  // Calculate rolling ACWR for each session
  for (let i = 0; i < sessions.length; i++) {
    const acuteSlice = sessions.slice(Math.max(0, i - 6), i + 1);
    const acuteAvg = acuteSlice.reduce((sum, s) => sum + s.load, 0) / acuteSlice.length;

    const chronicSlice = sessions.slice(0, i + 1);
    const chronicAvg = chronicSlice.reduce((sum, s) => sum + s.load, 0) / chronicSlice.length;

    sessions[i].acwr = Math.round((acuteAvg / (chronicAvg || 1)) * 100) / 100;
  }

  return sessions;
}

// Compute ACWR, Recovery and Injury Risk
export function calculateMetrics(
  sessions: AthleteSession[],
  currentRecoveryScore: number
): AthleteMetrics {
  if (!sessions || sessions.length === 0) {
    return {
      acuteLoad: 500,
      chronicLoad: 500,
      currentACWR: 1.0,
      recoveryScore: currentRecoveryScore,
      injuryRiskPct: 15,
      acwrStatus: 'sweet-spot',
    };
  }

  // Last 7 days
  const last7 = sessions.slice(-7);
  const acuteLoad = last7.reduce((sum, s) => sum + s.load, 0) / 7;

  // Last 28 days
  const last28 = sessions.slice(-28);
  const chronicLoad = last28.reduce((sum, s) => sum + s.load, 0) / (last28.length || 1);

  const currentACWR = Math.round((acuteLoad / (chronicLoad || 1)) * 100) / 100;

  // ACWR Status
  let acwrStatus: ACWRStatus = 'sweet-spot';
  if (currentACWR < 0.8) acwrStatus = 'under-training';
  else if (currentACWR <= 1.3) acwrStatus = 'sweet-spot';
  else if (currentACWR <= 1.5) acwrStatus = 'caution';
  else acwrStatus = 'danger';

  // Injury Risk Calculation (Gabbett ACWR + Recovery Score)
  let baseRisk = 12;
  if (currentACWR >= 0.8 && currentACWR <= 1.3) {
    baseRisk = 10 + (100 - currentRecoveryScore) * 0.15;
  } else if (currentACWR > 1.3 && currentACWR <= 1.5) {
    baseRisk = 30 + (currentACWR - 1.3) * 120 + (100 - currentRecoveryScore) * 0.25;
  } else if (currentACWR > 1.5) {
    baseRisk = 60 + Math.min(25, (currentACWR - 1.5) * 50) + (100 - currentRecoveryScore) * 0.2;
  } else {
    // < 0.8 under-training risk
    baseRisk = 22 + (0.8 - currentACWR) * 35;
  }

  const injuryRiskPct = Math.round(Math.max(5, Math.min(95, baseRisk)));

  return {
    acuteLoad: Math.round(acuteLoad),
    chronicLoad: Math.round(chronicLoad),
    currentACWR,
    recoveryScore: currentRecoveryScore,
    injuryRiskPct,
    acwrStatus,
  };
}

// Deterministic Autonomous Microcycle Rules Engine (PS-8)
export function generateAutonomousPlan(
  chronicLoad: number,
  recoveryScore: number,
  currentACWR: number,
  fixtures: MatchFixture[],
  existingOverrides: { [dayNum: number]: Partial<MicrocycleDay> } = {}
): { plan: MicrocycleDay[]; logs: AgentReasoningLog[] } {
  const plan: MicrocycleDay[] = [];
  const logs: AgentReasoningLog[] = [];
  const today = new Date();

  // Log current status
  if (currentACWR > 1.5) {
    logs.push({
      id: 'log-spike',
      timestamp: '00:01',
      ruleTriggered: 'ACWR_SPIKE_PROTECTION (Rule 104)',
      decision: 'Forced de-load implemented across next 48h to prevent soft-tissue failure.',
      impact: 'Caps acute training stimulus to <= 0.35x chronic baseline.',
      level: 'critical',
    });
  } else if (recoveryScore < 50) {
    logs.push({
      id: 'log-fatigue',
      timestamp: '00:02',
      ruleTriggered: 'HIGH_FATIGUE_FLAG (Rule 201)',
      decision: 'Recovery score < 50% triggers active mobility and non-impact flush.',
      impact: 'Eliminated heavy eccentric loading and sprint exposures.',
      level: 'warning',
    });
  } else {
    logs.push({
      id: 'log-optimal',
      timestamp: '00:03',
      ruleTriggered: 'SWEET_SPOT_CORRIDOR (Rule 301)',
      decision: 'ACWR within 0.8–1.3 sweet spot. Progressive athletic development permitted.',
      impact: 'Scheduled targeted aerobic power and tactical sharpening.',
      level: 'optimal',
    });
  }

  // Iterate over next 7 days
  for (let i = 1; i <= 7; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(dayDate.getDate() + i);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = dayDate.toISOString().split('T')[0];

    // Check if there is a match fixture on this day
    const matchOnDay = fixtures.find((f) => f.daysAway === i);
    // Check if there is a match tomorrow (MD-1)
    const matchTomorrow = fixtures.find((f) => f.daysAway === i + 1);
    // Check if match in 2-3 days with high importance
    const matchIn2Days = fixtures.find((f) => f.daysAway === i + 2 && f.importance === 'high');

    let sessionType: MicrocycleDay['sessionType'] = 'Development Session';
    let targetLoad = Math.round(chronicLoad * 1.1);
    let focus = 'Aerobic Power & High-Speed Running (HSR)';
    let rationale = 'Progressive overload scheduled within the safe 0.8–1.3 ACWR zone.';
    let isMatch = false;
    let matchOpponent = undefined;

    if (matchOnDay) {
      isMatch = true;
      sessionType = 'Match';
      matchOpponent = matchOnDay.opponent;
      targetLoad = Math.round(chronicLoad * 1.6);
      focus = `Match Day vs ${matchOnDay.opponent} (${matchOnDay.competition})`;
      rationale = 'Full competition stimulus. Peak adrenaline and mechanical demand.';
      logs.push({
        id: `log-day-${i}-match`,
        timestamp: `Day ${i}`,
        ruleTriggered: 'MATCH_FIXTURE_LOCK (Rule 001)',
        decision: `Targeted match vs ${matchOnDay.opponent}.`,
        impact: `Prescribed match load ${targetLoad} AU.`,
        level: 'info',
      });
    } else if (matchTomorrow) {
      // MD-1 Universal Taper
      sessionType = 'Taper Session';
      targetLoad = Math.round(chronicLoad * 0.4);
      focus = 'Activation & Tactical Walkthrough';
      rationale = 'MD-1 universal taper: short neuromuscular primers (<10m) to preserve glycogen.';
      logs.push({
        id: `log-day-${i}-taper`,
        timestamp: `Day ${i}`,
        ruleTriggered: 'MD_MINUS_1_TAPER (Rule 012)',
        decision: `Tapering load prior to match vs ${matchTomorrow.opponent}.`,
        impact: `Load dialed back to 40% chronic (~${targetLoad} AU).`,
        level: 'optimal',
      });
    } else if (i === 1 && (recoveryScore < 50 || currentACWR > 1.5)) {
      // Immediate de-load on Day 1
      sessionType = 'Recovery Block';
      targetLoad = Math.round(chronicLoad * 0.3);
      focus = 'Hydrotherapy, Foam Rolling & Mobility';
      rationale = 'Severe fatigue or ACWR danger zone. Active flushing without muscle damage.';
    } else if (matchIn2Days) {
      sessionType = 'Tactical Session';
      targetLoad = Math.round(chronicLoad * 0.75);
      focus = 'Set Pieces & Tactical Walkthrough';
      rationale = 'Match approaching within 48h. Tactical clarity with controlled mechanical stress.';
    } else if (i === 7 || (i > 1 && plan[i - 2]?.isMatch)) {
      // Post match recovery
      sessionType = 'Rest Day';
      targetLoad = 0;
      focus = 'Complete Physiological Decompression';
      rationale = 'Post-match regenerative window for glycogen supercompensation and sleep.';
    }

    // Apply coach overrides if present
    const override = existingOverrides[i];
    let isCoachOverride = false;
    if (override) {
      if (override.targetLoad !== undefined) targetLoad = override.targetLoad;
      if (override.sessionType) sessionType = override.sessionType;
      if (override.focus) focus = override.focus;
      isCoachOverride = true;
      rationale = `[COACH OVERRIDE]: Manually specified ${targetLoad} AU (${sessionType}).`;
    }

    plan.push({
      dayNumber: i,
      dayName,
      date: dateStr,
      sessionType,
      targetLoad,
      focus,
      rationale,
      isMatch,
      isCoachOverride,
      matchOpponent,
    });
  }

  return { plan, logs };
}

// Convert microcycle plan or session history to CSV
export function exportToCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers
      .map((header) => {
        const val = item[header];
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val ?? '';
      })
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
