import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useTheme } from '@/constants/theme';
import { PlayerScore } from '@/types';

interface LeaderboardRowProps {
  entry: PlayerScore;
  rank: number;
  highlighted?: boolean;
}

export default function LeaderboardRow({ entry, rank, highlighted }: LeaderboardRowProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: highlighted ? '#E8F5EF' : theme.card,
          borderColor: highlighted ? theme.tint : theme.border,
        },
      ]}>
      <View style={[styles.rankBadge, { backgroundColor: rank <= 3 ? theme.accent : theme.border }]}>
        <Text style={[styles.rankText, { color: rank <= 3 ? '#111827' : theme.text }]}>{rank}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {entry.name}
        </Text>
        <Text style={[styles.meta, { color: theme.muted }]}>
          Точный счёт: {entry.exactHits} · Победитель: {entry.winnerHits}
        </Text>
      </View>

      <View style={styles.pointsWrap}>
        <Text style={[styles.points, { color: theme.tint }]}>{entry.totalPoints}</Text>
        <Text style={[styles.breakdown, { color: theme.muted }]}>
          {entry.exactPoints}+{entry.winnerPoints}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 15,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
  },
  pointsWrap: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 22,
    fontWeight: '800',
  },
  breakdown: {
    fontSize: 11,
    marginTop: 2,
  },
});
