import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, usePathname } from 'expo-router';

import { Text } from '@/components/Themed';
import WcStripe from '@/components/WcStripe';
import { useTheme } from '@/constants/theme';

const NAV = [
  { label: 'Лидеры', path: '/', emoji: '🏆' },
  { label: 'Прогнозы', path: '/picks', emoji: '🔮' },
  { label: 'Матчи', path: '/matches', emoji: '⚽' },
] as const;

/**
 * Top navigation for the web build. A dropdown menu is used instead of a bottom
 * tab bar so that mobile browser chrome (URL / search bar) never covers it.
 */
export default function WebNav() {
  const theme = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = NAV.find((item) => item.path === pathname) ?? NAV[0];

  const go = (path: string) => {
    setOpen(false);
    if (path !== pathname) {
      router.navigate(path as never);
    }
  };

  return (
    <View style={[styles.bar, { backgroundColor: theme.brandNavy }]}>
      <WcStripe height={3} />
      <View style={styles.barInner}>
        <View style={styles.brand}>
          <Text style={styles.brandEmoji}>⚽</Text>
          <Text style={styles.brandText}>WC Fantasy</Text>
          <View style={[styles.wcBadge, { backgroundColor: theme.brandGold }]}>
            <Text style={styles.wcBadgeText}>ЧМ 2026</Text>
          </View>
        </View>

        <View style={styles.menuWrap}>
          <Pressable
            onPress={() => setOpen((value) => !value)}
            style={[styles.trigger, { borderColor: theme.brandGold }]}>
            <Text style={styles.triggerText}>
              {current.emoji} {current.label}
            </Text>
            <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
          </Pressable>

          {open ? (
            <>
              <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
              <View style={[styles.menu, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {NAV.map((item) => {
                  const active = item.path === current.path;
                  return (
                    <Pressable
                      key={item.path}
                      onPress={() => go(item.path)}
                      style={[
                        styles.menuItem,
                        active && { backgroundColor: theme.highlightBg },
                      ]}>
                      <Text
                        style={[
                          styles.menuText,
                          { color: active ? theme.brandGreen : theme.text },
                        ]}>
                        {item.emoji} {item.label}
                      </Text>
                      {active ? (
                        <Text style={[styles.check, { color: theme.brandGreen }]}>✓</Text>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    zIndex: 100,
  },
  barInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandEmoji: {
    fontSize: 20,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  wcBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    transform: [{ rotate: '-2deg' }],
  },
  wcBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00205B',
    letterSpacing: 0.4,
  },
  menuWrap: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  triggerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  chevron: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -2000,
    right: -2000,
    height: 4000,
    zIndex: 90,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    minWidth: 180,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 6,
    zIndex: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '800',
  },
  check: {
    fontSize: 14,
    fontWeight: '900',
  },
});
