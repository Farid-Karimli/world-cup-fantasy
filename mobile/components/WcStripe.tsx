import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/constants/theme';

/** Tri-host WC 2026 accent stripe — green · gold · coral · sky */
export default function WcStripe({ height = 5 }: { height?: number }) {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, { height }]}>
      <View style={[styles.segment, { backgroundColor: theme.stripe1, flex: 3 }]} />
      <View style={[styles.segment, { backgroundColor: theme.stripe2, flex: 2 }]} />
      <View style={[styles.segment, { backgroundColor: theme.stripe3, flex: 2 }]} />
      <View style={[styles.segment, { backgroundColor: theme.stripe4, flex: 3 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
});
