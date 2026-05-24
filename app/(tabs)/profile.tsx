import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { MeshBackground } from '@/components/animations/MeshBackground';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MeshBackground />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.title}>Profile — coming in Screen 7</Text>
          <Text style={styles.subtitle}>Taste profile, history, premium upsell,{'\n'}and account settings.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md },
  icon: { fontSize: 48 },
  title: { fontFamily: Typography.display, fontSize: 22, color: Colors.cream, textAlign: 'center' },
  subtitle: { fontFamily: Typography.body, fontSize: 14, color: Colors.creamDim, textAlign: 'center', lineHeight: 22 },
});
