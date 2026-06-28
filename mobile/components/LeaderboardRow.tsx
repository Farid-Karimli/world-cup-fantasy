import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { RANK_MEDALS, useTheme } from '@/constants/theme';
import { PlayerScore } from '@/types';

interface LeaderboardRowProps {
  entry: PlayerScore;
  rank: number;
  highlighted?: boolean;
}

export default function LeaderboardRow({ entry, rank, highlighted }: LeaderboardRowProps) {
  const theme = useTheme();
  const medal = RANK_MEDALS[rank];
  const isPodium = rank <= 3;

  const rowStyle = {
    backgroundColor: highlighted ? theme.highlightBg : theme.card,
    borderColor: highlighted ? theme.brandGreen : theme.border,
    ...(rank === 1 ? { transform: [{ rotate: '-0.5deg' as const }] } : {}),
    ...(rank === 2 ? { transform: [{ rotate: '0.3deg' as const }] } : {}),
  };

  return (
    <View style={[styles.row, rowStyle, isPodium ? styles.podiumShadow : null]}>
      {isPodium ? (
        <View style={[styles.accentBar, { backgroundColor: rank === 1 ? theme.brandGold : rank === 2 ? '#C0C0C0' : '#CD7F32' }]} />
      ) : (
        <View style={[styles.accentBar, { backgroundColor: theme.brandSky }]} />
      )}

      <View style={[styles.rankBadge, { backgroundColor: isPodium ? theme.brandGold : theme.brandNavy }]}>
        {medal ? (
          <Text style={styles.medal}>{medal}</Text>
        ) : (
          <Text style={[styles.rankText, { color: '#FFFFFF' }]}>{rank}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {entry.name}
          {highlighted ? '  👈' : ''}
        </Text>
        <Text style={[styles.meta, { color: theme.muted }]}>
          🎯 {entry.exactHits} точных · ✅ {entry.winnerHits} исход.
        </Text>
      </View>

      <View style={[styles.pointsWrap, { backgroundColor: isPodium ? theme.pointsBg : 'transparent' }]}>
        <Text style={[styles.points, { color: theme.brandGreen }]}>{entry.totalPoints}</Text>
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
    gap: 10,
    borderWidth: 2,
    borderRadius: 20,
    padding: 14,
    paddingLeft: 10,
    overflow: 'hidden',
  },
  podiumShadow: {
    shadowColor: '#FFB81C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  rankBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    transform: [{ rotate: '-3deg' }],
  },
  medal: {
    fontSize: 22,
  },
  rankText: {
    fontSize: 15,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    fontSize: 11,
    fontWeight: '600',
  },
  pointsWrap: {
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 52,
  },
  points: {
    fontSize: 24,
    fontWeight: '900',
  },
  breakdown: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
});
