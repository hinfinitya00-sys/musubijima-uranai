import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePlanGate } from '@/hooks/usePlanGate';

export function TrialBanner() {
  const { isTrialActive, trialDaysLeft } = usePlanGate();

  if (!isTrialActive) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        🎁 無料トライアル期間中（残り{trialDaysLeft}日）
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#EDE9FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    color: '#5B21B6',
    textAlign: 'center',
    fontWeight: '500',
  },
});
