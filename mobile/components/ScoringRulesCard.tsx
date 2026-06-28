import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useTheme } from '@/constants/theme';
import { getSubmissions } from '@/lib/data';

function RuleRow({
  points,
  label,
  detail,
  accent,
}: {
  points: string;
  label: string;
  detail?: string;
  accent: string;
}) {
  const theme = useTheme();

  return (
    <View style={styles.ruleRow}>
      <View style={[styles.pointsBadge, { backgroundColor: accent }]}>
        <Text style={[styles.pointsBadgeText, { color: theme.brandNavy }]}>{points}</Text>
      </View>
      <View style={styles.ruleCopy}>
        <Text style={[styles.ruleLabel, { color: theme.text }]}>{label}</Text>
        {detail ? (
          <Text style={[styles.ruleDetail, { color: theme.muted }]}>{detail}</Text>
        ) : null}
      </View>
    </View>
  );
}

export default function ScoringRulesCard() {
  const theme = useTheme();
  const { rules } = getSubmissions();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.brandGold }]}>
      <Text style={[styles.title, { color: theme.brandNavy }]}>Как начисляются очки</Text>

      <RuleRow
        points={`+${rules.groupExact}`}
        label="Точный счёт — групповой этап"
        accent={theme.brandGreen}
      />
      <RuleRow
        points={`+${rules.knockoutExact}`}
        label="Точный счёт — плей-офф"
        detail="1/8, 1/4, 1/2 и матч за 3-е место. Счёт — на весь матч: основное время, доп. время и пенальти (например, 2-2 + 5-4 пен. = 7-6)."
        accent={theme.brandSky}
      />
      <RuleRow
        points={`+${rules.finalExact}`}
        label="Точный счёт — финал"
        detail="Счёт — на весь матч: основное время, доп. время и пенальти."
        accent={theme.brandGold}
      />

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <RuleRow
        points={`+${rules.winner}`}
        label="Верный исход"
        detail="Победа нужной команды или ничья в группе, если точный счёт не угадан. В плей-офф учитывается итог всего матча, включая пенальти. Не суммируется с очками за счёт."
        accent={theme.brandCoral}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    transform: [{ rotate: '-0.5deg' }],
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pointsBadge: {
    minWidth: 40,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    transform: [{ rotate: '-2deg' }],
  },
  pointsBadgeText: {
    fontSize: 15,
    fontWeight: '900',
  },
  ruleCopy: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
  },
  ruleLabel: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  ruleDetail: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  divider: {
    height: 1.5,
    marginVertical: 2,
  },
});
