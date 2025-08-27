import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']} //  gradient
      style={styles.fill}
    >
      <SafeAreaView style={styles.fill}>
        <View style={styles.content}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flex: 1,
    padding: 16,
  },
});
