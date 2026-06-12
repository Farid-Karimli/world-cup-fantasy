import { FantasyMatch, LiveResult, ResolvedMatch } from '@/types';
import { fixtureOrientation, sameFixture } from '@/lib/teams';
import { resolveMatchPoints } from '@/lib/scoring';
import { getSubmissions } from '@/lib/data';

export function findResultForMatch(
  match: FantasyMatch,
  results: LiveResult[],
): LiveResult | null {
  return (
    results.find((item) => sameFixture(match.team1, match.team2, item.team1, item.team2)) ??
    null
  );
}

/** Re-orient a result's home/away score into the match's team1/team2 order. */
function orientScore(
  match: FantasyMatch,
  result: LiveResult | null,
): { team1Score: number | null; team2Score: number | null } {
  if (!result?.score) {
    return { team1Score: null, team2Score: null };
  }
  const orientation = fixtureOrientation(
    match.team1,
    match.team2,
    result.team1,
    result.team2,
  );
  if (orientation === 'flipped') {
    return { team1Score: result.score.away, team2Score: result.score.home };
  }
  return { team1Score: result.score.home, team2Score: result.score.away };
}

export function resolveAllMatches(results: LiveResult[]): ResolvedMatch[] {
  const data = getSubmissions();
  return data.matches.map((match) => {
    const result = findResultForMatch(match, results);
    return {
      ...match,
      result,
      ...orientScore(match, result),
      pointsByPlayer: resolveMatchPoints(match, result, data.rules),
    };
  });
}

export function formatScore(score: { home: number; away: number } | null): string {
  if (!score) return '—';
  return `${score.home}-${score.away}`;
}
