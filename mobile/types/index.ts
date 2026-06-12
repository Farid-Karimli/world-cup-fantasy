export type MatchStage = 'group' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';

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

export interface LiveResult {
  team1: string;
  team2: string;
  score: ParsedScore | null;
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
  /** Actual scores oriented to team1/team2 order (null until played). */
  team1Score: number | null;
  team2Score: number | null;
  pointsByPlayer: Record<string, MatchPoints>;
}
