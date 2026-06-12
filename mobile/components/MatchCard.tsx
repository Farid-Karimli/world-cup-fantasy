import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useTheme } from '@/constants/theme';
import { ResolvedMatch } from '@/types';

interface MatchCardProps {
  match: ResolvedMatch;
  playerId?: number | null;
  showPoints?: boolean;
}

export default function MatchCard({ match, playerId, showPoints = true }: MatchCardProps) {
  const theme = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;
  const prediction = playerId ? match.predictions[String(playerId)] : undefined;
  const points = playerId ? match.pointsByPlayer[String(playerId)] : undefined;
  const result = match.result;
  const status = result?.status ?? 'scheduled';
  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const hasScore = match.team1Score !== null && match.team2Score !== null;

  // Outcome of the player's prediction, only meaningful once the game is played.
  const outcome: 'exact' | 'winner' | 'miss' | null =
    points && (isFinished || isLive)
      ? points.exact > 0
        ? 'exact'
        : points.winner > 0
          ? 'winner'
          : 'miss'
      : null;

  useEffect(() => {
    if (!isLive) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [isLive, pulse]);

  const statusTheme =
    status === 'live' ? theme.live : status === 'finished' ? theme.success : theme.muted;

  const statusEmoji = status === 'live' ? '🔴' : status === 'finished' ? '✅' : '⏳';

  const outcomeColor =
    outcome === 'exact'
      ? theme.brandGreen
      : outcome === 'winner'
        ? theme.brandGold
        : outcome === 'miss'
          ? theme.muted
          : theme.brandCoral;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isLive ? theme.live : theme.border,
          borderWidth: isLive ? 2 : 1.5,
        },
      ]}>
      <View
        style={[
          styles.stageStripe,
          { backgroundColor: outcome ? outcomeColor : theme.brandGreen },
        ]}
      />

      <View style={styles.inner}>
        <View style={styles.topRow}>
          <Text style={[styles.matchName, { color: theme.text }]}>{match.nameRu}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusTheme}22` }]}>
            {isLive ? (
              <Animated.View style={[styles.liveDot, { backgroundColor: theme.live, opacity: pulse }]} />
            ) : null}
            <Text style={[styles.statusText, { color: statusTheme }]}>
              {statusEmoji} {result?.statusLabel ?? 'Скоро'}
            </Text>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.teamCol}>
            <Text style={[styles.team, { color: theme.text }]} numberOfLines={1}>
              {match.team1}
            </Text>
            <View style={styles.vsRow}>
              <View style={[styles.vsLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.vs, { color: theme.muted }]}>vs</Text>
              <View style={[styles.vsLine, { backgroundColor: theme.border }]} />
            </View>
            <Text style={[styles.team, { color: theme.text }]} numberOfLines={1}>
              {match.team2}
            </Text>
          </View>

          <View style={[styles.scoreBox, { backgroundColor: theme.brandNavy }]}>
            <Text style={styles.score}>{hasScore ? match.team1Score : '—'}</Text>
            <Text style={styles.scoreDivider}>:</Text>
            <Text style={styles.score}>{hasScore ? match.team2Score : '—'}</Text>
          </View>

          {prediction ? (
            <View
              style={[
                styles.predictionCol,
                {
                  backgroundColor: outcome ? `${outcomeColor}22` : theme.pointsBg,
                  borderColor: outcome ? outcomeColor : 'transparent',
                },
              ]}>
              <Text style={[styles.predictionLabel, { color: theme.muted }]}>🔮 Прогноз</Text>
              <Text style={[styles.prediction, { color: outcome ? outcomeColor : theme.brandCoral }]}>
                {prediction}
              </Text>
            </View>
          ) : null}
        </View>

        {showPoints && prediction && outcome ? (
          <View
            style={[
              styles.pointsBar,
              {
                backgroundColor:
                  outcome === 'miss' ? `${theme.muted}1A` : `${outcomeColor}22`,
              },
            ]}>
            <Text style={[styles.pointsText, { color: outcome === 'miss' ? theme.muted : outcomeColor }]}>
              {outcome === 'exact'
                ? `🎯 Точный счёт! +${points!.total} очков (${points!.exact} счёт${
                    points!.winner ? ` · ${points!.winner} победитель` : ''
                  })`
                : outcome === 'winner'
                  ? `✅ Угадан победитель · +${points!.winner} очк${
                      isLive ? ' (пока)' : 'а'
                    }`
                  : isLive
                    ? '⏳ Пока мимо'
                    : '❌ Без очков'}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  stageStripe: {
    width: 5,
  },
  inner: {
    flex: 1,
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
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamCol: {
    flex: 1,
    gap: 2,
  },
  team: {
    fontSize: 13,
    fontWeight: '700',
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  vsLine: {
    flex: 1,
    height: 1,
  },
  vs: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  scoreBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 0,
    transform: [{ rotate: '-1deg' }],
  },
  score: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  scoreDivider: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '700',
  },
  predictionCol: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 72,
    transform: [{ rotate: '1deg' }],
  },
  predictionLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  prediction: {
    fontSize: 18,
    fontWeight: '900',
  },
  pointsBar: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
