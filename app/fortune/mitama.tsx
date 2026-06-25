import React, { useState, useRef, useEffect } from 'react';
import { noCopy } from '@/constants/Typography';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shareResult } from '../../lib/share';
import { usePlanGate } from '../../hooks/usePlanGate';
import {
  MITAMA_CARDS,
} from '../../constants/mitama-cards';
import type { MitamaCard } from '../../constants/mitama-cards';
import { fetchOverlay } from '../../lib/cms';

export default function MitamaScreen() {
  const { isFree } = usePlanGate();
  const [selectedCard, setSelectedCard] = useState<MitamaCard | null>(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Supabase(mitama_cards)のテキスト列をローカルデータに number で上書き。失敗時はローカルのまま。
  const [cards, setCards] = useState<MitamaCard[]>(MITAMA_CARDS);
  useEffect(() => {
    fetchOverlay('mitama_cards', MITAMA_CARDS, (m) => m.num, (m, r) => ({
      ...m,
      title: r.title ?? m.title,
      shushi: r.god_name ?? m.shushi,
      kotodama: r.kotodama ?? m.kotodama,
      nekomajutsu: r.neko_magic ?? m.nekomajutsu,
      guidance: r.guidance ?? m.guidance,
      kotodamaOpen: r.kotodama_open ?? m.kotodamaOpen,
      message: r.message ?? m.message,
      keyQuestion: r.key_question ?? m.keyQuestion,
    })).then(setCards).catch(() => {});
  }, []);

  const handleDrawCard = () => {
    const card = cards[Math.floor(Math.random() * cards.length)];
    setSelectedCard(card);
    setIsDrawn(true);
    scaleAnim.setValue(0);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleReset = () => {
    setSelectedCard(null);
    setIsDrawn(false);
    scaleAnim.setValue(0);
  };

  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={[styles.container, noCopy]}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isDrawn ? (
          <>
            <View style={styles.drawPrompt}>
              <Text style={styles.drawPromptText}>
                心を静めて、深呼吸を3回。{'\n'}
                準備ができたら直感で1枚引いてください。
              </Text>
              {isFree && (
                <Text style={styles.freeLimit}>今月の残り回数: 3回</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.drawButtonSimple}
              onPress={handleDrawCard}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#E8758A', '#C45070', '#E8758A']}
                style={styles.drawButtonGradient}
              >
                <Text style={styles.drawButtonText}>✦　カードを引く　✦</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : selectedCard ? (
          /* Result Display */
          <Animated.View
            style={[
              styles.resultContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: scaleAnim,
              },
            ]}
          >
            {/* Card Container */}
            <View style={styles.cardContainer}>
              {/* Card Image */}
              <View style={styles.cardImageWrap}>
                <Image
                  source={selectedCard.img}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>

              {/* Card Title */}
              <Text style={styles.cardTitle}>{selectedCard.title}</Text>
              <Text style={styles.cardSubtitle}>{selectedCard.subtitle}</Text>

              {/* Meta Info */}
              <View style={styles.metaSection}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>宗祀</Text>
                  <Text style={styles.metaValue}>{selectedCard.shushi}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>言霊</Text>
                  <Text style={styles.metaValue}>{selectedCard.kotodama}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>ネコ魔術</Text>
                  <Text style={styles.metaValue}>{selectedCard.nekomajutsu}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.cardDivider} />

              {/* 4セクションを枠分けで表示 */}
              <View style={styles.block}>
                <Text style={styles.blockTitle}>〈み・たまの導き〉</Text>
                <Text style={styles.blockBody}>{selectedCard.guidance}</Text>
              </View>
              <View style={styles.block}>
                <Text style={styles.blockTitle}>〈言霊のひらき〉</Text>
                <Text style={styles.blockBody}>{selectedCard.kotodamaOpen}</Text>
              </View>
              <View style={styles.block}>
                <Text style={styles.blockTitle}>〈み・たまからの言葉〉</Text>
                <Text style={styles.blockBody}>{selectedCard.message}</Text>
              </View>
              <View style={[styles.block, styles.blockKey]}>
                <Text style={styles.blockTitle}>〈ひらく鍵〉</Text>
                <Text style={styles.blockBody}>{selectedCard.keyQuestion}</Text>
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => shareResult({
                title: '今日のみ・たまカード',
                message: `【今日引いたみ・たまカード】\n${selectedCard.title}「${selectedCard.subtitle}」\n\n言霊：${selectedCard.kotodama.slice(0, 50)}...`,
              })}
              activeOpacity={0.8}
            >
              <Text style={styles.shareButtonText}>カードをシェアする 🎴</Text>
            </TouchableOpacity>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(232,117,138,0.2)', 'rgba(196,80,112,0.2)']}
                style={styles.retryButtonGradient}
              >
                <Text style={styles.retryButtonText}>もう一度引く</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },

  /* Draw Prompt */
  drawPrompt: {
    marginBottom: 24,
  },
  drawPromptText: {
    fontSize: 16,
    color: '#7A6A6A',
    textAlign: 'center',
    lineHeight: 22,
  },

  freeLimit: {
    fontSize: 16,
    color: '#7A6A6A',
    textAlign: 'center',
    marginTop: 8,
  },

  /* Draw Button */
  drawButtonSimple: {
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 24,
    marginBottom: 24,
    maxWidth: 320,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#E8758A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  drawButtonGradient: {
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 50,
  },
  drawButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 2,
  },

  /* Result */
  resultContainer: {
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImageWrap: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF0F3',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3D1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 20,
    color: '#C45070',
    marginBottom: 16,
    textAlign: 'center',
  },

  /* Meta Info */
  metaSection: {
    width: '100%',
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  metaItem: {
    paddingVertical: 8,
  },
  metaLabel: {
    fontSize: 16,
    color: '#7A6A6A',
    fontWeight: '600',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    color: '#3D1A1A',
    lineHeight: 20,
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#F0D8DC',
  },

  /* Card Divider */
  cardDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(232,117,138,0.3)',
    marginBottom: 16,
  },

  /* 4セクションの枠 */
  block: {
    width: '100%',
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D8DC',
    padding: 18,
    marginBottom: 12,
  },
  blockKey: {
    backgroundColor: '#FFF0F3',
    borderColor: 'rgba(232,117,138,0.4)',
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#C45070',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  blockBody: {
    fontSize: 16,
    color: '#3D1A1A',
    lineHeight: 26,
    width: '100%',
  },

  /* Share */
  shareButton: {
    borderWidth: 1,
    borderColor: '#E8758A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: 'transparent',
  },
  shareButtonText: {
    color: '#C45070',
    fontSize: 16,
    fontWeight: '500',
  },

  /* Retry */
  retryButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232,117,138,0.4)',
  },
  retryButtonText: {
    color: '#F9C0CC',
    fontSize: 18,
    fontWeight: '600',
  },
});
