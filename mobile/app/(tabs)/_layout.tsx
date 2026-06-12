import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import WcStripe from '@/components/WcStripe';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brandGreen,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.brandNavy,
          borderTopWidth: 0,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
        headerShown: false,
        tabBarBackground: () => (
          <View style={styles.tabBg}>
            <WcStripe height={3} />
            <View style={[styles.tabFill, { backgroundColor: colors.brandNavy }]} />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Лидеры',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconActive : undefined}>
              <SymbolView
                name={{ ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' }}
                tintColor={focused ? colors.brandGold : color}
                size={24}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="picks"
        options={{
          title: 'Прогнозы',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              tintColor={focused ? colors.brandGold : color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Матчи',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{ ios: 'sportscourt.fill', android: 'sports_soccer', web: 'sports_soccer' }}
              tintColor={focused ? colors.brandGold : color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBg: {
    flex: 1,
  },
  tabFill: {
    flex: 1,
  },
  iconActive: {
    transform: [{ scale: 1.15 }],
  },
});
