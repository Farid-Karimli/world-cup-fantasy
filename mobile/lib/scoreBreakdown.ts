import { ParsedScore, ScoreBreakdown } from '@/types';

interface EspnDetail {
  scoringPlay?: boolean;
  shootout?: boolean;
  scoreValue?: number;
  team?: { id?: string };
}

interface EspnCompetitor {
  homeAway: 'home' | 'away';
  score: string;
  team: { id: string; displayName: string };
}

export function buildScoreBreakdown(
  details: EspnDetail[] | undefined,
  home: EspnCompetitor,
  away: EspnCompetitor,
): ScoreBreakdown | null {
  const homeId = home.team.id;
  const awayId = away.team.id;
  const homeScore = Number(home.score);
  const awayScore = Number(away.score);

  if (!details?.length) {
    if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) return null;
    const regulation = { home: homeScore, away: awayScore };
    return { regulation, penalties: null, fullGame: regulation };
  }

  let regHome = 0;
  let regAway = 0;
  let penHome = 0;
  let penAway = 0;

  for (const detail of details) {
    if (!detail.scoringPlay) continue;
    const value = detail.scoreValue ?? 1;
    const teamId = detail.team?.id;
    if (detail.shootout) {
      if (teamId === homeId) penHome += value;
      else if (teamId === awayId) penAway += value;
    } else if (teamId === homeId) {
      regHome += value;
    } else if (teamId === awayId) {
      regAway += value;
    }
  }

  // Fall back to headline scores when details are incomplete.
  if (regHome === 0 && regAway === 0 && !Number.isNaN(homeScore) && !Number.isNaN(awayScore)) {
    regHome = homeScore;
    regAway = awayScore;
  }

  const regulation: ParsedScore = { home: regHome, away: regAway };
  const penalties =
    penHome > 0 || penAway > 0 ? { home: penHome, away: penAway } : null;
  const fullGame: ParsedScore = {
    home: regulation.home + (penalties?.home ?? 0),
    away: regulation.away + (penalties?.away ?? 0),
  };

  return { regulation, penalties, fullGame };
}

export function formatScore(score: ParsedScore): string {
  return `${score.home}-${score.away}`;
}

export function formatKnockoutScore(breakdown: ScoreBreakdown): string {
  if (breakdown.penalties) {
    return `${formatScore(breakdown.regulation)} (${formatScore(breakdown.penalties)} пен.) → ${formatScore(breakdown.fullGame)}`;
  }
  return formatScore(breakdown.fullGame);
}
