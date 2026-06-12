import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { fetchEspnResults } from '@/lib/espn';
import { buildLeaderboard } from '@/lib/scoring';
import { resolveAllMatches } from '@/lib/matches';
import { getSubmissions } from '@/lib/data';
import { LiveResult, PlayerScore, ResolvedMatch } from '@/types';

interface FantasyContextValue {
  results: LiveResult[];
  leaderboard: PlayerScore[];
  matches: ResolvedMatch[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

const FantasyContext = createContext<FantasyContextValue | undefined>(undefined);

export function FantasyProvider({ children }: { children: ReactNode }) {
  const submissions = useMemo(() => getSubmissions(), []);
  const [results, setResults] = useState<LiveResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const liveResults = await fetchEspnResults();
      setResults(liveResults);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить результаты');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const matches = useMemo(() => resolveAllMatches(results), [results]);
  const leaderboard = useMemo(
    () => buildLeaderboard(submissions, results),
    [submissions, results],
  );

  const value = useMemo(
    () => ({
      results,
      leaderboard,
      matches,
      loading,
      error,
      lastUpdated,
      refresh,
    }),
    [results, leaderboard, matches, loading, error, lastUpdated, refresh],
  );

  return <FantasyContext.Provider value={value}>{children}</FantasyContext.Provider>;
}

export function useFantasy() {
  const context = useContext(FantasyContext);
  if (!context) {
    throw new Error('useFantasy must be used within FantasyProvider');
  }
  return context;
}
