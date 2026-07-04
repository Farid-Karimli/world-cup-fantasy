export type MatchStage =
  | 'group'
  | 'round32'
  | 'round16'
  | 'quarter'
  | 'semi'
  | 'third'
  | 'final';

export interface Player {
  id: number;
  name: string;
}

export interface FantasyMatch {
  id: number;
  nameRu: string;
  team1: string;
  team2: string;
  stage: MatchStage;
  predictions: Record<string, string>;
}

export interface ScoringRules {
  groupExact: number;
  knockoutExact: number;
  finalExact: number;
  winner: number;
}

export interface SubmissionsData {
  players: Player[];
  matches: FantasyMatch[];
  rules: ScoringRules;
}

export interface ParsedScore {
  home: number;
  away: number;
}

/** Regulation + extra time, optional penalties, and the fantasy full-game total. */
export interface ScoreBreakdown {
  regulation: ParsedScore;
  penalties: ParsedScore | null;
  fullGame: ParsedScore;
}

export interface LiveResult {
  team1: string;
  team2: string;
  /** Regulation/extra-time score from ESPN (home/away order). */
  score: ParsedScore | null;
  /** Full-game breakdown when extra time or penalties apply. */
  scoreBreakdown: ScoreBreakdown | null;
  status: 'scheduled' | 'live' | 'finished';
  statusLabel: string;
}

export interface MatchPoints {
  exact: number;
  winner: number;
  total: number;
}

export interface PlayerScore {
  playerId: number;
  name: string;
  exactPoints: number;
  winnerPoints: number;
  totalPoints: number;
  exactHits: number;
  winnerHits: number;
}

export interface ResolvedMatch extends FantasyMatch {
  result: LiveResult | null;
  /** Scores oriented to team1/team2 order (null until played). */
  team1Score: number | null;
  team2Score: number | null;
  /** Full-game scores for knockout display/scoring (null for group stage). */
  team1FullScore: number | null;
  team2FullScore: number | null;
  scoreBreakdown: ScoreBreakdown | null;
  pointsByPlayer: Record<string, MatchPoints>;
}
