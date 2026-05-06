import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MITAMA_CARDS = [
  { emoji: '🌸', title: '花開く', message: 'あなたの中に眠っていた才能が、今まさに花開こうとしています。自分を信じて、一歩踏み出してみて。' },
  { emoji: '🌊', title: '流れに乗る', message: '今は抵抗せず、流れに身を委ねる時。宇宙があなたを最適な場所へ導いてくれています。' },
  { emoji: '🔥', title: '情熱の炎', message: 'あなたの内なる炎が燃え上がっています。その情熱を大切に、思いきって行動しましょう。' },
  { emoji: '🌙', title: '月の導き', message: '直感を信じてください。今あなたが感じていることは、魂からの大切なメッセージです。' },
  { emoji: '⭐', title: '星の祝福', message: '宇宙があなたを祝福しています。今日という日は、新しい始まりにふさわしい特別な日。' },
  { emoji: '🦋', title: '変容', message: '変化を恐れないで。今の苦しみは、美しい蝶になるための大切なプロセスです。' },
  { emoji: '🌈', title: '調和', message: 'あなたの周りのすべてが調和に向かっています。人間関係に素敵な変化が訪れるでしょう。' },
  { emoji: '💎', title: '本質', message: 'あなたの本当の輝きは、飾らないありのままの姿にあります。自分らしさを大切に。' },
  { emoji: '🕊️', title: '解放', message: '手放す時が来ました。古い執着を手放すことで、新しい祝福が流れ込んできます。' },
  { emoji: '🌱', title: '種まき', message: '今日蒔いた種は、必ず実を結びます。目に見える成果がなくても、確実に成長しています。' },
  { emoji: '☀️', title: '光', message: 'あなた自身が光です。周りを照らすために、まず自分を満たすことを忘れないで。' },
  { emoji: '🏔️', title: '頂', message: '山の頂は近い。ここまで登ってきた自分を褒めてあげて。あと少しです。' },
  { emoji: '💫', title: 'むすび', message: '大切な縁が結ばれようとしています。心を開いて、その出会いを受け入れましょう。' },
  { emoji: '🎭', title: '本当の自分', message: '仮面を外して、本当の自分で生きる勇気を。ありのままのあなたを愛してくれる人がいます。' },
  { emoji: '🌺', title: '美', message: 'あなたが美しいと感じるものを大切に。美を感じる心が、人生を豊かにしてくれます。' },
];

export default function MitamaScreen() {
  const [selectedCard, setSelectedCard] = useState<typeof MITAMA_CARDS[0] | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleDrawCard = () => {
    setIsRevealing(true);
    const card = MITAMA_CARDS[Math.floor(Math.random() * MITAMA_CARDS.length)];

    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setSelectedCard(card);
    });
  };

  const handleReset = () => {
    setSelectedCard(null);
    setIsRevealing(false);
    flipAnim.setValue(0);
  };

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <LinearGradient colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🃏</Text>
          <Text style={styles.title}>み・たまカード</Text>
          <Text style={styles.subtitle}>
            直感で1枚選んでください。{'\n'}
            今のあなたに必要なメッセージが届きます。
          </Text>
        </View>

        {!selectedCard && !isRevealing ? (
          <TouchableOpacity style={styles.drawButton} onPress={handleDrawCard}>
            <LinearGradient colors={['#7F77DD', '#6D28D9']} style={styles.drawButtonGradient}>
              <Animated.View style={[styles.cardBack, { transform: [{ rotateY }] }]}>
                <Text style={styles.cardBackEmoji}>✨</Text>
                <Text style={styles.cardBackText}>タップしてカードを引く</Text>
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        ) : isRevealing && !selectedCard ? (
          <View style={styles.revealingContainer}>
            <Text style={styles.revealingText}>カードを開いています...</Text>
          </View>
        ) : selectedCard ? (
          <View style={styles.resultContainer}>
            <View style={styles.cardFront}>
              <Text style={styles.cardEmoji}>{selectedCard.emoji}</Text>
              <Text style={styles.cardTitle}>{selectedCard.title}</Text>
              <View style={styles.cardDivider} />
              <Text style={styles.cardMessage}>{selectedCard.message}</Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
              <Text style={styles.retryButtonText}>もう一度引く</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#C4B5FD', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  drawButton: { width: width * 0.7, aspectRatio: 0.7, borderRadius: 20, overflow: 'hidden' },
  drawButtonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardBack: { alignItems: 'center' },
  cardBackEmoji: { fontSize: 56, marginBottom: 16 },
  cardBackText: { fontSize: 16, color: '#E5E7EB', fontWeight: '600' },
  revealingContainer: { padding: 40, alignItems: 'center' },
  revealingText: { fontSize: 18, color: '#C4B5FD' },
  resultContainer: { alignItems: 'center', width: '100%' },
  cardFront: {
    width: '90%',
    backgroundColor: 'rgba(127,119,221,0.1)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(127,119,221,0.4)',
  },
  cardEmoji: { fontSize: 64, marginBottom: 16 },
  cardTitle: { fontSize: 28, fontWeight: 'bold', color: '#E8C547', marginBottom: 16 },
  cardDivider: { width: 60, height: 2, backgroundColor: 'rgba(232,197,71,0.3)', marginBottom: 16 },
  cardMessage: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', lineHeight: 28 },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.4)',
  },
  retryButtonText: { color: '#C4B5FD', fontSize: 14 },
});
