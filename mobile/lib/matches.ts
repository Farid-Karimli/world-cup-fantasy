import { FantasyMatch, LiveResult, MatchStage, ResolvedMatch, ScoreBreakdown } from '@/types';
import { fixtureOrientation, sameFixture } from '@/lib/teams';
import { resolveMatchPoints } from '@/lib/scoring';
import { getSubmissions } from '@/lib/data';
import { isKnockoutStage, STAGE_ORDER } from '@/lib/stages';

export function findResultForMatch(
  match: FantasyMatch,
  results: LiveResult[],
): LiveResult | null {
  return (
    results.find((item) => sameFixture(match.team1, match.team2, item.team1, item.team2)) ??
    null
  );
}

function orientBreakdown(
  match: FantasyMatch,
  result: LiveResult | null,
): ScoreBreakdown | null {
  if (!result?.scoreBreakdown) return null;
  const orientation = fixtureOrientation(
    match.team1,
    match.team2,
    result.team1,
    result.team2,
  );
  if (!orientation) return null;

  const { regulation, penalties, fullGame } = result.scoreBreakdown;
  if (orientation === 'direct') {
    return { regulation, penalties, fullGame };
  }

  return {
    regulation: { home: regulation.away, away: regulation.home },
    penalties: penalties
      ? { home: penalties.away, away: penalties.home }
      : null,
    fullGame: { home: fullGame.away, away: fullGame.home },
  };
}

/** Re-orient a result score into the match's team1/team2 order. */
function orientScore(
  match: FantasyMatch,
  result: LiveResult | null,
  useFullGame: boolean,
): { team1Score: number | null; team2Score: number | null } {
  if (!result?.score) {
    return { team1Score: null, team2Score: null };
  }

  const breakdown = orientBreakdown(match, result);
  const score = useFullGame
    ? breakdown?.fullGame ?? result.scoreBreakdown?.fullGame ?? result.score
    : breakdown?.regulation ?? result.score;

  const orientation = fixtureOrientation(
    match.team1,
    match.team2,
    result.team1,
    result.team2,
  );
  if (orientation === 'flipped') {
    return { team1Score: score.away, team2Score: score.home };
  }
  return { team1Score: score.home, team2Score: score.away };
}

export function resolveAllMatches(results: LiveResult[]): ResolvedMatch[] {
  const data = getSubmissions();
  return data.matches.map((match) => {
    const result = findResultForMatch(match, results);
    const knockout = isKnockoutStage(match.stage);
    const regulation = orientScore(match, result, false);
    const full = orientScore(match, result, true);

    return {
      ...match,
      result,
      team1Score: regulation.team1Score,
      team2Score: regulation.team2Score,
      team1FullScore: full.team1Score,
      team2FullScore: full.team2Score,
      scoreBreakdown: orientBreakdown(match, result),
      pointsByPlayer: resolveMatchPoints(match, result, data.rules),
    };
  });
}

export function groupMatchesByStage(
  matches: ResolvedMatch[],
): Array<{ stage: MatchStage; matches: ResolvedMatch[] }> {
  return STAGE_ORDER.map((stage) => ({
    stage,
    matches: matches.filter((match) => match.stage === stage),
  })).filter((section) => section.matches.length > 0);
}

export function formatScore(score: { home: number; away: number } | null): string {
  if (!score) return '—';
  return `${score.home}-${score.away}`;
}
