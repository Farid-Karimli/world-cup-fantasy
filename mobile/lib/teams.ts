const NORMALIZE = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Every spelling we might encounter (from the spreadsheet or ESPN) maps to one
// stable canonical key. Matching is done on these keys with strict equality —
// substring matching is intentionally avoided because short tokens like "us"
// falsely match "Australia"/"Austria", conflating different fixtures.
const ALIASES: Record<string, string[]> = {
  'bosnia herzegovina': ['bosnia and herzegovina', 'bosnia'],
  'czech republic': ['czechia', 'czech'],
  'dr congo': ['congo dr', 'democratic republic of congo'],
  'ivory coast': ['cote d ivoire', 'cote divoire'],
  'cape verde': ['cabo verde'],
  'saudi arabia': ['ksa'],
  'south korea': ['korea republic', 'korea south'],
  'north korea': ['korea dpr'],
  'usa': ['united states', 'united states of america'],
  'netherlands': ['holland'],
  'turkey': ['turkiye'],
  'iran': ['ir iran'],
};

const CANONICAL_BY_NAME = new Map<string, string>();
for (const [canonical, aliases] of Object.entries(ALIASES)) {
  CANONICAL_BY_NAME.set(NORMALIZE(canonical), canonical);
  for (const alias of aliases) {
    CANONICAL_BY_NAME.set(NORMALIZE(alias), canonical);
  }
}

export function normalizeTeamName(name: string): string {
  return NORMALIZE(name);
}

function canonicalTeam(name: string): string {
  const normalized = NORMALIZE(name);
  return CANONICAL_BY_NAME.get(normalized) ?? normalized;
}

export function teamsMatch(a: string, b: string): boolean {
  return canonicalTeam(a) === canonicalTeam(b);
}

export function sameFixture(
  teamA: string,
  teamB: string,
  teamC: string,
  teamD: string,
): boolean {
  return fixtureOrientation(teamA, teamB, teamC, teamD) !== null;
}

/**
 * Determines how the prediction fixture (teamA vs teamB) lines up with the
 * result fixture (teamC vs teamD).
 *   'direct'  -> teamA === teamC and teamB === teamD
 *   'flipped' -> teamA === teamD and teamB === teamC
 *   null      -> not the same fixture
 */
export function fixtureOrientation(
  teamA: string,
  teamB: string,
  teamC: string,
  teamD: string,
): 'direct' | 'flipped' | null {
  if (teamsMatch(teamA, teamC) && teamsMatch(teamB, teamD)) return 'direct';
  if (teamsMatch(teamA, teamD) && teamsMatch(teamB, teamC)) return 'flipped';
  return null;
}
