import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MatchCard from '@/components/MatchCard';
import PlayerPicker from '@/components/PlayerPicker';
import ScreenHeader from '@/components/ScreenHeader';
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
      contentContainerStyle={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.brandGold} />}>
      <ScreenHeader
        title="Мои прогнозы"
        subtitle="Угадай счёт — заработай очки!"
        emoji="🔮"
      />

      {ready ? (
        <PlayerPicker
          selectedPlayerId={selectedPlayerId}
          onSelect={setSelectedPlayerId}
        />
      ) : null}

      {player ? (
        <View style={[styles.summary, { backgroundColor: theme.brandNavy, borderColor: theme.brandGold }]}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>ТВОЙ СЧЁТ</Text>
            <Text style={styles.summaryName}>{player.name}</Text>
            <Text style={styles.summaryMeta}>
              🎉 Удачных матчей: {finishedWithPoints}
            </Text>
          </View>
          <View style={[styles.pointsCircle, { backgroundColor: theme.brandGold }]}>
            <Text style={[styles.summaryPoints, { color: theme.brandNavy }]}>{totalPoints}</Text>
            <Text style={[styles.pointsUnit, { color: theme.brandNavy }]}>очков</Text>
          </View>
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
    borderWidth: 3,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    transform: [{ rotate: '0.5deg' }],
  },
  summaryLeft: {
    flex: 1,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.6)',
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  summaryMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  pointsCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  summaryPoints: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 30,
  },
  pointsUnit: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  list: {
    gap: 10,
  },
});
