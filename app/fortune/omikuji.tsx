import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { drawOmikuji } from '@/constants/omikuji';

export default function OmikujiScreen() {
  const [result, setResult] = useState<ReturnType<typeof drawOmikuji> | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  const handleDraw = () => {
    setIsDrawing(true);
    setResult(null);

    setTimeout(() => {
      const omikuji = drawOmikuji();
      setResult(omikuji);
      setIsDrawing(false);

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }, 1000);
  };

  const handleReset = () => {
    scaleAnim.setValue(0);
    setResult(null);
  };

  return (
    <LinearGradient colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>今日のおみくじ</Text>
        <Text style={styles.subtitle}>むすび島の運勢を占おう</Text>

        {!result ? (
          <TouchableOpacity
            style={[styles.drawButton, isDrawing && styles.drawButtonDisabled]}
            onPress={handleDraw}
            disabled={isDrawing}
          >
            <LinearGradient colors={['#E8C547', '#F59E0B']} style={styles.drawButtonGradient}>
              <Text style={styles.drawButtonEmoji}>🎴</Text>
              <Text style={styles.drawButtonText}>
                {isDrawing ? '占い中...' : 'おみくじを引く'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <Animated.View style={[styles.resultContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.resultCard}>
              <Text style={styles.resultEmoji}>{result.emoji}</Text>
              <Text style={styles.resultLabel}>{result.label}</Text>
              <View style={styles.divider} />
              <Text style={styles.resultMessage}>{result.message}</Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
              <Text style={styles.retryButtonText}>もう一度引く</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E8C547', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 40 },
  drawButton: { borderRadius: 20, overflow: 'hidden', width: '80%' },
  drawButtonDisabled: { opacity: 0.6 },
  drawButtonGradient: { paddingVertical: 24, alignItems: 'center' },
  drawButtonEmoji: { fontSize: 48, marginBottom: 12 },
  drawButtonText: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  resultContainer: { alignItems: 'center', width: '100%' },
  resultCard: {
    backgroundColor: 'rgba(232,197,71,0.08)',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232,197,71,0.3)',
  },
  resultEmoji: { fontSize: 56, marginBottom: 12 },
  resultLabel: { fontSize: 36, fontWeight: 'bold', color: '#E8C547', marginBottom: 16 },
  divider: { width: 60, height: 2, backgroundColor: 'rgba(232,197,71,0.3)', marginBottom: 16 },
  resultMessage: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', lineHeight: 28 },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(232,197,71,0.4)',
  },
  retryButtonText: { color: '#E8C547', fontSize: 14 },
});
