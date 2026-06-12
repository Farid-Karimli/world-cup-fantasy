import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/constants/theme';

const MAX_WIDTH = 720;

export default function WebShell({ children, style, ...rest }: ViewProps) {
  const theme = useTheme();

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.native, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.webOuter, { backgroundColor: theme.background }]}>
      <View style={[styles.webInner, style]} {...rest}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
  },
  webOuter: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh' as unknown as number,
  },
  webInner: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_WIDTH,
  },
});
