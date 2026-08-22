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
    backgroundColor: '#FFF0F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    color: '#C94F70',
    textAlign: 'center',
    fontWeight: '500',
  },
});
