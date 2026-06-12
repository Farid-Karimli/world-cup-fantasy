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
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.muted }]}>Выберите игрока</Text>
      <View style={styles.grid}>
        {players.map((player) => {
          const active = player.id === selectedPlayerId;
          return (
            <Pressable
              key={player.id}
              onPress={() => onSelect(player.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.tint : theme.card,
                  borderColor: active ? theme.tint : theme.border,
                },
              ]}>
              <Text
                style={[
                  styles.chipText,
                  { color: active ? '#FFFFFF' : theme.text },
                ]}
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
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
