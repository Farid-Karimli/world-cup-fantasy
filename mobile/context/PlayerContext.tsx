import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getSubmissions } from '@/lib/data';

const STORAGE_KEY = 'fantasy:selectedPlayerId';

interface PlayerContextValue {
  selectedPlayerId: number | null;
  setSelectedPlayerId: (playerId: number) => Promise<void>;
  ready: boolean;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [selectedPlayerId, setSelectedPlayerIdState] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active) return;
        if (value) {
          setSelectedPlayerIdState(Number(value));
        } else {
          setSelectedPlayerIdState(getSubmissions().players[0]?.id ?? null);
        }
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const setSelectedPlayerId = async (playerId: number) => {
    setSelectedPlayerIdState(playerId);
    await AsyncStorage.setItem(STORAGE_KEY, String(playerId));
  };

  const value = useMemo(
    () => ({ selectedPlayerId, setSelectedPlayerId, ready }),
    [selectedPlayerId, ready],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function useSelectedPlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('useSelectedPlayer must be used within PlayerProvider');
  }
  return context;
}
