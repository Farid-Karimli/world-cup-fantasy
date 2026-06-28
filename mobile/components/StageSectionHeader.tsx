import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import WcStripe from '@/components/WcStripe';
import { useTheme } from '@/constants/theme';
import { stageLabel, stageSectionLabel } from '@/lib/stages';
import { MatchStage } from '@/types';

interface StageSectionHeaderProps {
  stage: MatchStage;
  matchCount: number;
}

export default function StageSectionHeader({ stage, matchCount }: StageSectionHeaderProps) {
  const theme = useTheme();
  const isGroup = stage === 'group';

  return (
    <View style={styles.wrap}>
      <WcStripe height={4} />
      <View style={[styles.header, { backgroundColor: isGroup ? theme.brandGreen : theme.brandNavy }]}>
        <View style={styles.copy}>
          <Text style={styles.section}>{stageSectionLabel(stage)}</Text>
          <Text style={styles.title}>{stageLabel(stage)}</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: theme.brandGold }]}>
          <Text style={[styles.count, { color: theme.brandNavy }]}>{matchCount}</Text>
        </View>
      </View>
      {!isGroup ? (
        <Text style={[styles.note, { color: theme.muted }]}>
          Прогноз — на весь матч: основное время, доп. время и пенальти
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    marginTop: 8,
  },
  header: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    transform: [{ rotate: '-0.5deg' }],
  },
  copy: {
    gap: 2,
    flex: 1,
  },
  section: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  countBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  count: {
    fontSize: 14,
    fontWeight: '900',
  },
  note: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    paddingHorizontal: 4,
  },
});
