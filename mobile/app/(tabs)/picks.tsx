import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MatchCard from '@/components/MatchCard';
import PlayerPicker from '@/components/PlayerPicker';
import { Text } from '@/components/Themed';
import { useFantasy } from '@/context/FantasyContext';
import { useSelectedPlayer } from '@/context/PlayerContext';
import { sharedStyles, useTheme } from '@/constants/theme';
import { getSubmissions } from '@/lib/data';

export default function PicksScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { matches, loading, refresh } = useFantasy();
  const { selectedPlayerId, setSelectedPlayerId, ready } = useSelectedPlayer();
  const player = getSubmissions().players.find((item) => item.id === selectedPlayerId);

  const totalPoints = matches.reduce((sum, match) => {
    if (!selectedPlayerId) return sum;
    return sum + (match.pointsByPlayer[String(selectedPlayerId)]?.total ?? 0);
  }, 0);

  const finishedWithPoints = matches.filter(
    (match) =>
      selectedPlayerId &&
      match.result?.status === 'finished' &&
      (match.pointsByPlayer[String(selectedPlayerId)]?.total ?? 0) > 0,
  ).length;

  return (
    <ScrollView
      style={[sharedStyles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.tint} />}>
      <View style={sharedStyles.header}>
        <Text style={[sharedStyles.title, { color: theme.text }]}>Мои прогнозы</Text>
        <Text style={[sharedStyles.subtitle, { color: theme.muted }]}>
          Сравнение ваших счетов с результатами FIFA
        </Text>
      </View>

      {ready ? (
        <PlayerPicker
          selectedPlayerId={selectedPlayerId}
          onSelect={setSelectedPlayerId}
        />
      ) : null}

      {player ? (
        <View style={[styles.summary, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View>
            <Text style={[styles.summaryName, { color: theme.text }]}>{player.name}</Text>
            <Text style={[styles.summaryMeta, { color: theme.muted }]}>
              Удачных матчей: {finishedWithPoints}
            </Text>
          </View>
          <Text style={[styles.summaryPoints, { color: theme.tint }]}>{totalPoints}</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            playerId={selectedPlayerId}
            showPoints
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  summary: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryMeta: {
    marginTop: 4,
    fontSize: 13,
  },
  summaryPoints: {
    fontSize: 32,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
});
