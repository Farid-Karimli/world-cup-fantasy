import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MatchCard from '@/components/MatchCard';
import ScreenHeader from '@/components/ScreenHeader';
import { Text } from '@/components/Themed';
import { useFantasy } from '@/context/FantasyContext';
import { useSelectedPlayer } from '@/context/PlayerContext';
import { sharedStyles, useTheme } from '@/constants/theme';

export default function MatchesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { matches, loading, error, lastUpdated, refresh, results } = useFantasy();
  const { selectedPlayerId } = useSelectedPlayer();

  const liveCount = results.filter((item) => item.status === 'live').length;
  const finishedCount = results.filter((item) => item.status === 'finished').length;

  const subtitle = [
    `✅ ${finishedCount} завершено`,
    liveCount > 0 ? `🔴 ${liveCount} live` : null,
    lastUpdated
      ? `🕐 ${lastUpdated.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <ScrollView
      style={[sharedStyles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.brandGold} />}>
      <ScreenHeader title="Матчи" subtitle={subtitle || 'Синхронизация с FIFA...'} emoji="⚽" />

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: '#FEE2E2', borderColor: theme.danger }]}>
          <Text style={{ color: theme.danger }}>😬 {error}</Text>
        </View>
      ) : null}

      {liveCount > 0 ? (
        <View style={[styles.liveBanner, { backgroundColor: theme.brandCoral }]}>
          <Text style={styles.liveBannerText}>
            🔴 Идёт {liveCount} {liveCount === 1 ? 'матч' : 'матча'} прямо сейчас!
          </Text>
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
    gap: 14,
  },
  list: {
    gap: 10,
  },
  liveBanner: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    transform: [{ rotate: '-0.5deg' }],
  },
  liveBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorBox: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
  },
});
