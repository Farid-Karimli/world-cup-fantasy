import {
  FantasyMatch,
  LiveResult,
  MatchPoints,
  MatchStage,
  ParsedScore,
  PlayerScore,
  ScoringRules,
  SubmissionsData,
} from '@/types';
import { sameFixture } from '@/lib/teams';

export function parseScore(raw: string): ParsedScore | null {
  const match = raw.trim().match(/^(\d+)\s*[-:]\s*(\d+)$/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function getWinner(score: ParsedScore): 'home' | 'away' | 'draw' {
  if (score.home > score.away) return 'home';
  if (score.away > score.home) return 'away';
  return 'draw';
}

function exactPointsForStage(stage: MatchStage, rules: ScoringRules): number {
  if (stage === 'final') return rules.finalExact;
  if (stage === 'group') return rules.groupExact;
  return rules.knockoutExact;
}

export function scorePrediction(
  predictionRaw: string,
  actual: ParsedScore,
  stage: MatchStage,
  rules: ScoringRules,
  predictionIsHomeFirst: boolean,
): MatchPoints {
  const prediction = parseScore(predictionRaw);
  if (!prediction) {
    return { exact: 0, winner: 0, total: 0 };
  }

  const predicted = predictionIsHomeFirst
    ? prediction
    : { home: prediction.away, away: prediction.home };
  const actualWinner = getWinner(actual);
  const predictedWinner = getWinner(predicted);

  let exact = 0;
  if (predicted.home === actual.home && predicted.away === actual.away) {
    exact = exactPointsForStage(stage, rules);
  }

  let winner = 0;
  if (actualWinner === predictedWinner) {
    winner = rules.winner;
  }

  return { exact, winner, total: exact + winner };
}

export function resolveMatchPoints(
  match: FantasyMatch,
  result: LiveResult | null,
  rules: ScoringRules,
): Record<string, MatchPoints> {
  const points: Record<string, MatchPoints> = {};
  if (!result?.score) {
    return points;
  }

  const homeFirst = sameFixture(match.team1, match.team2, result.team1, result.team2);
  const awayFirst = sameFixture(match.team1, match.team2, result.team2, result.team1);
  if (!homeFirst && !awayFirst) {
    return points;
  }

  for (const [playerId, prediction] of Object.entries(match.predictions)) {
    points[playerId] = scorePrediction(
      prediction,
      result.score,
      match.stage,
      rules,
      homeFirst,
    );
  }

  return points;
}

export function buildLeaderboard(data: SubmissionsData, results: LiveResult[]): PlayerScore[] {
  const resultByFixture = new Map<string, LiveResult>();
  for (const result of results) {
    resultByFixture.set(`${result.team1}|${result.team2}`, result);
    resultByFixture.set(`${result.team2}|${result.team1}`, result);
  }

  const leaderboard = data.players.map<PlayerScore>((player) => ({
    playerId: player.id,
    name: player.name,
    exactPoints: 0,
    winnerPoints: 0,
    totalPoints: 0,
    exactHits: 0,
    winnerHits: 0,
  }));

  const byId = new Map(leaderboard.map((entry) => [entry.playerId, entry]));

  for (const match of data.matches) {
    const result =
      results.find((item) => sameFixture(match.team1, match.team2, item.team1, item.team2)) ??
      null;
    const pointsByPlayer = resolveMatchPoints(match, result, data.rules);

    for (const [playerId, points] of Object.entries(pointsByPlayer)) {
      const entry = byId.get(Number(playerId));
      if (!entry) continue;
      entry.exactPoints += points.exact;
      entry.winnerPoints += points.winner;
      entry.totalPoints += points.total;
      if (points.exact > 0) entry.exactHits += 1;
      if (points.winner > 0) entry.winnerHits += 1;
    }
  }

  return leaderboard.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.exactPoints !== a.exactPoints) return b.exactPoints - a.exactPoints;
    return a.name.localeCompare(b.name, 'ru');
  });
}
