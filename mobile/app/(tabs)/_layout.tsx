import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].card,
          borderTopColor: Colors[colorScheme].border,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Лидеры',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="picks"
        options={{
          title: 'Прогнозы',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Матчи',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'sportscourt.fill', android: 'sports_soccer', web: 'sports_soccer' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
