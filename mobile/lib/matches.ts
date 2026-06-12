import { FantasyMatch, LiveResult, ResolvedMatch } from '@/types';
import { sameFixture } from '@/lib/teams';
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

export function resolveAllMatches(results: LiveResult[]): ResolvedMatch[] {
  const data = getSubmissions();
  return data.matches.map((match) => ({
    ...match,
    result: findResultForMatch(match, results),
    pointsByPlayer: resolveMatchPoints(
      match,
      findResultForMatch(match, results),
      data.rules,
    ),
  }));
}

export function formatScore(score: { home: number; away: number } | null): string {
  if (!score) return '—';
  return `${score.home}-${score.away}`;
}
