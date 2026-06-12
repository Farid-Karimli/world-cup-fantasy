import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LeaderboardRow from '@/components/LeaderboardRow';
import { Text } from '@/components/Themed';
import { useFantasy } from '@/context/FantasyContext';
import { useSelectedPlayer } from '@/context/PlayerContext';
import { sharedStyles, useTheme } from '@/constants/theme';

export default function LeaderboardScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { leaderboard, loading, error, lastUpdated, refresh } = useFantasy();
  const { selectedPlayerId } = useSelectedPlayer();

  return (
    <ScrollView
      style={[sharedStyles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.tint} />}>
      <View style={sharedStyles.header}>
        <Text style={[sharedStyles.title, { color: theme.text }]}>Таблица лидеров</Text>
        <Text style={[sharedStyles.subtitle, { color: theme.muted }]}>
          {lastUpdated
            ? `Обновлено ${lastUpdated.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
            : 'Загрузка результатов FIFA...'}
        </Text>
      </View>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: '#FEE2E2', borderColor: theme.danger }]}>
          <Text style={{ color: theme.danger }}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {leaderboard.map((entry, index) => (
          <LeaderboardRow
            key={entry.playerId}
            entry={entry}
            rank={index + 1}
            highlighted={entry.playerId === selectedPlayerId}
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
