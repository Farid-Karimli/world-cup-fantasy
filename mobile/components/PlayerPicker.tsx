import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { useTheme } from '@/constants/theme';
import { getSubmissions } from '@/lib/data';

interface PlayerPickerProps {
  selectedPlayerId: number | null;
  onSelect: (playerId: number) => void;
}

export default function PlayerPicker({ selectedPlayerId, onSelect }: PlayerPickerProps) {
  const theme = useTheme();
  const players = getSubmissions().players;

  return (
    <View style={[styles.wrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.brandNavy }]}>
        👤 Кто ты на этом турнире?
      </Text>
      <View style={styles.grid}>
        {players.map((player) => {
          const active = player.id === selectedPlayerId;
          return (
            <Pressable
              key={player.id}
              onPress={() => onSelect(player.id)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active ? theme.brandGreen : theme.background,
                  borderColor: active ? theme.brandGreen : theme.border,
                  transform: [{ scale: pressed ? 0.96 : 1 }, { rotate: active ? '-1deg' : '0deg' }],
                },
              ]}>
              <View style={[styles.numBadge, { backgroundColor: active ? theme.brandGold : theme.brandNavy }]}>
                <Text style={[styles.numText, { color: active ? theme.brandNavy : '#FFFFFF' }]}>
                  {player.id}
                </Text>
              </View>
              <Text
                style={[styles.chipText, { color: active ? '#FFFFFF' : theme.text }]}
                numberOfLines={1}>
                {player.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    borderStyle: 'dashed',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderRadius: 999,
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 5,
    maxWidth: '100%',
  },
  numBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 11,
    fontWeight: '900',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
});
