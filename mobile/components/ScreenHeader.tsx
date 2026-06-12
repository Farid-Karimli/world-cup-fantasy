import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import WcStripe from '@/components/WcStripe';
import { useTheme } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
}

export default function ScreenHeader({ title, subtitle, emoji = '⚽' }: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.hero, { backgroundColor: theme.brandNavy }]}>
        <WcStripe height={4} />
        <View style={styles.heroBody}>
          <View style={styles.brandRow}>
            <Text style={styles.emoji}>{emoji}</Text>
            <View style={[styles.wcBadge, { backgroundColor: theme.brandGold }]}>
              <Text style={styles.wcBadgeText}>ЧМ 2026</Text>
            </View>
            <Text style={styles.hosts}>🇺🇸 🇲🇽 🇨🇦</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={[styles.ballDeco, { backgroundColor: theme.brandGreen }]}>
          <Text style={styles.ballEmoji}>🏆</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -20,
    marginBottom: 4,
  },
  hero: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBody: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  emoji: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  wcBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    transform: [{ rotate: '-2deg' }],
  },
  wcBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00205B',
    letterSpacing: 0.5,
  },
  hosts: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 'auto',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
  },
  ballDeco: {
    position: 'absolute',
    right: 16,
    bottom: -8,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '12deg' }],
    opacity: 0.9,
  },
  ballEmoji: {
    fontSize: 26,
  },
});
