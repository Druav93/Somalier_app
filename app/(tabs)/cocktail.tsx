import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MeshBackground } from '@/components/animations/MeshBackground';
import { Typography, Spacing } from '@/constants/theme';
import { useColors } from '@/context/ThemeContext';

export default function CocktailScreen() {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MeshBackground />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.icon}>🍸</Text>
          <Text style={[styles.title, { color: colors.text }]}>Cocktail Mode — coming in Screen 6</Text>
          <Text style={[styles.subtitle, { color: colors.textDim }]}>"What can I make?" using your bar inventory{'\n'}and AI cocktail recommendations.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md },
  icon: { fontSize: 48 },
  title: { fontFamily: Typography.display, fontSize: 22, textAlign: 'center' },
  subtitle: { fontFamily: Typography.body, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
