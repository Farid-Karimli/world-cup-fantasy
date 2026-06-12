import { LiveResult, ParsedScore } from '@/types';

const ESPN_SCOREBOARD =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

interface EspnCompetitor {
  homeAway: 'home' | 'away';
  score: string;
  team: {
    displayName: string;
  };
}

interface EspnEvent {
  competitions: Array<{
    competitors: EspnCompetitor[];
    status: {
      type: {
        state: string;
        description?: string;
        shortDetail?: string;
      };
    };
  }>;
}

interface EspnResponse {
  events?: EspnEvent[];
}

function parseEspnScore(raw: string): ParsedScore | null {
  const value = Number(raw);
  if (Number.isNaN(value)) return null;
  return { home: value, away: value };
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
    const hasScore = !Number.isNaN(homeScore) && !Number.isNaN(awayScore);
    const state = competition.status.type.state;

    results.push({
      team1: home.team.displayName,
      team2: away.team.displayName,
      score: hasScore ? { home: homeScore, away: awayScore } : null,
      status: mapStatus(state),
      statusLabel:
        competition.status.type.shortDetail ??
        competition.status.type.description ??
        'Scheduled',
    });
  }

  return results;
}
