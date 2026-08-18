import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface PlanGateProps {
  locked: boolean;
  children: React.ReactNode;
}

export function PlanGate({ locked, children }: PlanGateProps) {
  if (!locked) {
    return <>{children}</>;
  }

  return (
    <View style={styles.wrapper}>
      {children}
      <View style={styles.overlay}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockText}>ライトプランで解放</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/subscription/plans' as never)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#E8758A', '#C45070']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>プランを見る</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  lockIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockText: {
    fontSize: 14,
    color: '#C45070',
    fontWeight: '500',
    marginBottom: 12,
  },
  button: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
