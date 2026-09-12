export type ACWRStatus = 'under-training' | 'sweet-spot' | 'caution' | 'danger';

export interface AthleteSession {
  date: string;
  load: number; // Arbitrary Units (AU)
  distanceM: number;
  rpe: number; // 1 - 10
  recovery: number; // 0 - 100%
  sleepHours: number;
  sessionType: string;
  dayLabel?: string;
  acwr?: number;
}

export interface MicrocycleDay {
  dayNumber: number; // 1-7
  dayName: string;
  date: string;
  sessionType: 'Match' | 'Tactical Session' | 'Development Session' | 'Recovery Block' | 'Taper Session' | 'Rest Day';
  targetLoad: number;
  focus: string;
  rationale: string;
  isMatch: boolean;
  isCoachOverride: boolean;
  matchOpponent?: string;
}

export interface MatchFixture {
  id: string;
  opponent: string;
  competition: string;
  date: string;
  daysAway: number;
  importance: 'low' | 'medium' | 'high';
}

export interface AthleteMetrics {
  acuteLoad: number;
  chronicLoad: number;
  currentACWR: number;
  recoveryScore: number;
  injuryRiskPct: number;
  acwrStatus: ACWRStatus;
}

export interface AgentReasoningLog {
  id: string;
  timestamp: string;
  ruleTriggered: string;
  decision: string;
  impact: string;
  level: 'optimal' | 'warning' | 'critical' | 'info';
}

export type SportType = 'Soccer' | 'Running' | 'Equestrian' | 'Cycling' | 'Gym' | 'Tennis' | 'Basketball';

export type TrainingGoal = 'competition' | 'endurance' | 'injury-free' | 'fitness';

export interface AthleteProfile {
  name: string;
  sport: SportType;
  positionOrDiscipline: string;
  goal: TrainingGoal;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  source?: string;
}
