import { Platform, StyleSheet, Text, type ColorValue } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface TabIconProps {
  emoji: string;
  iosSymbol: string;
  androidSymbol: string;
  color: ColorValue;
  focused: boolean;
}

export default function TabIcon({ emoji, iosSymbol, androidSymbol, color, focused }: TabIconProps) {
  if (Platform.OS === 'web') {
    return <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>;
  }

  return (
    <SymbolView
      name={{
        ios: iosSymbol as never,
        android: androidSymbol as never,
        web: androidSymbol as never,
      }}
      tintColor={color}
      size={24}
    />
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 20,
    lineHeight: 24,
    opacity: 0.7,
  },
  emojiFocused: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
});
