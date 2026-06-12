import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TabIcon from '@/components/TabIcon';
import WebNav from '@/components/WebNav';
import WebShell from '@/components/WebShell';
import WcStripe from '@/components/WcStripe';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const tabs = (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brandGreen,
        tabBarInactiveTintColor: colors.tabIconDefault,
        // Hidden on web; navigation there lives in the WebNav dropdown.
        tabBarStyle: isWeb
          ? { display: 'none' }
          : {
              backgroundColor: colors.brandNavy,
              borderTopWidth: 0,
              height: 58 + insets.bottom,
              paddingBottom: insets.bottom + 8,
              paddingTop: 8,
              elevation: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
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
            <TabIcon
              emoji="🏆"
              iosSymbol="trophy.fill"
              androidSymbol="emoji_events"
              color={focused ? colors.brandGold : color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="picks"
        options={{
          title: 'Прогнозы',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              emoji="🔮"
              iosSymbol="person.fill"
              androidSymbol="person"
              color={focused ? colors.brandGold : color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Матчи',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              emoji="⚽"
              iosSymbol="sportscourt.fill"
              androidSymbol="sports_soccer"
              color={focused ? colors.brandGold : color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );

  if (isWeb) {
    return (
      <WebShell>
        <WebNav />
        <View style={styles.webBody}>{tabs}</View>
      </WebShell>
    );
  }

  return tabs;
}

const styles = StyleSheet.create({
  tabBg: {
    flex: 1,
  },
  tabFill: {
    flex: 1,
  },
  webBody: {
    flex: 1,
  },
});
