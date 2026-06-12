import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useTheme } from '@/constants/theme';
import { formatScore } from '@/lib/matches';
import { ResolvedMatch } from '@/types';

interface MatchCardProps {
  match: ResolvedMatch;
  playerId?: number | null;
  showPoints?: boolean;
}

export default function MatchCard({ match, playerId, showPoints = true }: MatchCardProps) {
  const theme = useTheme();
  const prediction = playerId ? match.predictions[String(playerId)] : undefined;
  const points = playerId ? match.pointsByPlayer[String(playerId)] : undefined;
  const result = match.result;
  const status = result?.status ?? 'scheduled';

  const statusTheme =
    status === 'live' ? theme.live : status === 'finished' ? theme.success : theme.muted;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.topRow}>
        <Text style={[styles.matchName, { color: theme.text }]}>{match.nameRu}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${statusTheme}22` }]}>
          <Text style={[styles.statusText, { color: statusTheme }]}>
            {result?.statusLabel ?? 'Скоро'}
          </Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.teamCol}>
          <Text style={[styles.team, { color: theme.text }]} numberOfLines={1}>
            {match.team1}
          </Text>
          <Text style={[styles.team, { color: theme.text }]} numberOfLines={1}>
            {match.team2}
          </Text>
        </View>

        <View style={styles.scoreCol}>
          <Text style={[styles.score, { color: theme.text }]}>
            {result?.score ? formatScore(result.score).split('-')[0] : '—'}
          </Text>
          <Text style={[styles.score, { color: theme.text }]}>
            {result?.score ? formatScore(result.score).split('-')[1] : '—'}
          </Text>
        </View>

        {prediction ? (
          <View style={styles.predictionCol}>
            <Text style={[styles.predictionLabel, { color: theme.muted }]}>Прогноз</Text>
            <Text style={[styles.prediction, { color: theme.accent }]}>{prediction}</Text>
          </View>
        ) : null}
      </View>

      {showPoints && points && points.total > 0 ? (
        <View style={[styles.pointsBar, { backgroundColor: '#E8F5EF' }]}>
          <Text style={[styles.pointsText, { color: theme.tint }]}>
            +{points.total} очков ({points.exact} точный · {points.winner} победитель)
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'flex-start',
  },
  matchName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamCol: {
    flex: 1,
    gap: 8,
  },
  team: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreCol: {
    width: 36,
    alignItems: 'center',
    gap: 8,
  },
  score: {
    fontSize: 20,
    fontWeight: '800',
  },
  predictionCol: {
    alignItems: 'flex-end',
    minWidth: 72,
  },
  predictionLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  prediction: {
    fontSize: 18,
    fontWeight: '800',
  },
  pointsBar: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
