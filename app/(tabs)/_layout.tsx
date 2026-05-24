import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Typography } from '@/constants/theme';
import { useColors, useTheme } from '@/context/ThemeContext';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  const colors = useColors();
  return (
    <View style={tabStyles.iconWrapper}>
      <Text style={tabStyles.icon}>{icon}</Text>
      <Text style={[tabStyles.label, { color: focused ? colors.gold : colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: { alignItems: 'center', gap: 2 },
  icon: { fontSize: 22 },
  label: { fontFamily: Typography.bodyMedium, fontSize: 10 },
});

export default function TabsLayout() {
  const colors = useColors();
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 80,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isDark ? 80 : 70}
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBar }]}
          />
        ),
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} /> }} />
      <Tabs.Screen name="camera" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📸" label="Scan" focused={focused} /> }} />
      <Tabs.Screen name="bar" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🍾" label="My Bar" focused={focused} /> }} />
      <Tabs.Screen name="cocktail" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🍸" label="Mix" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} /> }} />
    </Tabs>
  );
}
