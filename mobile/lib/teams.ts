const NORMALIZE = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const ALIASES: Record<string, string[]> = {
  'bosnia herzegovina': ['bosnia', 'bos herz'],
  'czech republic': ['czechia', 'czech'],
  'dr congo': ['congo dr', 'democratic republic of congo'],
  'ivory coast': ['cote d ivoire', 'cote divoire'],
  'cape verde': ['cabo verde'],
  'saudi arabia': ['ksa'],
  'south korea': ['korea republic', 'korea'],
  'usa': ['united states', 'us'],
  'netherlands': ['holland'],
};

export function normalizeTeamName(name: string): string {
  return NORMALIZE(name);
}

export function teamsMatch(a: string, b: string): boolean {
  const left = normalizeTeamName(a);
  const right = normalizeTeamName(b);
  if (left === right) return true;
  if (left.includes(right) || right.includes(left)) return true;

  for (const [canonical, aliases] of Object.entries(ALIASES)) {
    const bucket = [canonical, ...aliases];
    const leftHit = bucket.some((item) => left.includes(item) || item.includes(left));
    const rightHit = bucket.some((item) => right.includes(item) || item.includes(right));
    if (leftHit && rightHit) return true;
  }

  return false;
}

export function sameFixture(
  teamA: string,
  teamB: string,
  teamC: string,
  teamD: string,
): boolean {
  return (
    (teamsMatch(teamA, teamC) && teamsMatch(teamB, teamD)) ||
    (teamsMatch(teamA, teamD) && teamsMatch(teamB, teamC))
  );
}
