import { LiveResult } from '@/types';
import { buildScoreBreakdown } from '@/lib/scoreBreakdown';

// World Cup 2026 runs Jun 11 – Jul 19. The scoreboard endpoint only returns
// the current day's fixtures unless an explicit date range is supplied, so we
// always request the full tournament window. The endpoint also silently caps
// results at 100 events without an explicit limit — the 104-match tournament
// (72 group + 32 knockout) would otherwise be missing the latest fixtures.
const TOURNAMENT_START = '20260611';
const TOURNAMENT_END = '20260719';
const EVENT_LIMIT = 200;
const ESPN_SCOREBOARD =
  `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${TOURNAMENT_START}-${TOURNAMENT_END}&limit=${EVENT_LIMIT}`;

interface EspnDetail {
  scoringPlay?: boolean;
  shootout?: boolean;
  scoreValue?: number;
  team?: { id?: string };
}

interface EspnCompetitor {
  homeAway: 'home' | 'away';
  score: string;
  team: {
    id: string;
    displayName: string;
  };
}

interface EspnCompetition {
  competitors: EspnCompetitor[];
  details?: EspnDetail[];
  status: {
    type: {
      state: string;
      description?: string;
      shortDetail?: string;
    };
  };
}

interface EspnEvent {
  competitions: EspnCompetition[];
}

interface EspnResponse {
  events?: EspnEvent[];
}

function mapStatus(state: string): LiveResult['status'] {
  if (state === 'pre') return 'scheduled';
  if (state === 'in') return 'live';
  return 'finished';
}

export async function fetchEspnResults(): Promise<LiveResult[]> {
  const response = await fetch(ESPN_SCOREBOARD);
  if (!response.ok) {
    throw new Error(`ESPN API error: ${response.status}`);
  }

  const payload = (await response.json()) as EspnResponse;
  const results: LiveResult[] = [];

  for (const event of payload.events ?? []) {
    const competition = event.competitions[0];
    if (!competition) continue;

    const home = competition.competitors.find((team) => team.homeAway === 'home');
    const away = competition.competitors.find((team) => team.homeAway === 'away');
    if (!home || !away) continue;

    const homeScore = Number(home.score);
    const awayScore = Number(away.score);
    const state = competition.status.type.state;
    const status = mapStatus(state);
    // Scheduled games come back as 0-0; only trust a score once the match is
    // live or finished.
    const hasScore =
      status !== 'scheduled' && !Number.isNaN(homeScore) && !Number.isNaN(awayScore);
    const scoreBreakdown = hasScore
      ? buildScoreBreakdown(competition.details, home, away)
      : null;

    results.push({
      team1: home.team.displayName,
      team2: away.team.displayName,
      score: hasScore ? { home: homeScore, away: awayScore } : null,
      scoreBreakdown,
      status,
      statusLabel:
        competition.status.type.shortDetail ??
        competition.status.type.description ??
        'Scheduled',
    });
  }

  return results;
}
