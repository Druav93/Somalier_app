import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Typography } from '@/constants/theme';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={tabStyles.iconWrapper}>
      <Text style={tabStyles.icon}>{icon}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: { alignItems: 'center', gap: 2 },
  icon: { fontSize: 22 },
  label: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.creamDim,
  },
  labelActive: { color: Colors.gold },
});

export default function TabsLayout() {
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
          <BlurView intensity={80} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,14,39,0.6)' }]} />
        ),
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.creamDim,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📸" label="Scan" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bar"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🍾" label="My Bar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cocktail"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🍸" label="Mix" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
