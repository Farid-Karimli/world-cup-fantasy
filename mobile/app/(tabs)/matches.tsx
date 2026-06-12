import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MatchCard from '@/components/MatchCard';
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

  return (
    <ScrollView
      style={[sharedStyles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.tint} />}>
      <View style={sharedStyles.header}>
        <Text style={[sharedStyles.title, { color: theme.text }]}>Матчи</Text>
        <Text style={[sharedStyles.subtitle, { color: theme.muted }]}>
          {finishedCount} завершено · {liveCount} live
          {lastUpdated
            ? ` · ${lastUpdated.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
            : ''}
        </Text>
      </View>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: '#FEE2E2', borderColor: theme.danger }]}>
          <Text style={{ color: theme.danger }}>{error}</Text>
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
  list: {
    gap: 10,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
});
