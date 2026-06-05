import React, { useState, useRef } from 'react';
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
import {
  MITAMA_CARDS,
  MITAMA_OUTRO,
  MITAMA_CREDIT,
  MITAMA_PROFILE_IMG,
} from '../../constants/mitama-cards';
import type { MitamaCard } from '../../constants/mitama-cards';

const PROFILE_HEADER = '其田 寿枝（そのだ ひさえ）\n1972年　神奈川県生まれ　福岡県飯塚市で育つ\n書籍　kindle電子出版\n占い本「ネコ占い」「今年の運勢」\n短編小説「コーヒーの香り」';

const PROFILE_HISTORY = [
  { year: '2001年', desc: '夫より事業継承　マサジアートギャラリー代表となる' },
  { year: '2003年', desc: '占いカウンセリングをはじめる' },
  { year: '2006年', desc: '自社ギャラリーにて占い講座を始める' },
  { year: '2014年', desc: 'オリジナル専用占いカード制作' },
  { year: '2015年', desc: 'TNC文化サークルにて占い講座開講（2020年3月まで）' },
  { year: '2021年', desc: '想形楽合同会社　設立' },
  { year: '2021年', desc: '洋風いなり寿司のお店「うまいなり」オープン' },
];

export default function MitamaScreen() {
  const [selectedCard, setSelectedCard] = useState<MitamaCard | null>(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleDrawCard = () => {
    const card = MITAMA_CARDS[Math.floor(Math.random() * MITAMA_CARDS.length)];
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
      style={styles.container}
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
            </View>
            <TouchableOpacity
              style={styles.drawButtonSimple}
              onPress={handleDrawCard}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4C1D95', '#6D28D9', '#4C1D95']}
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
                  resizeMode="cover"
                />
              </View>

              {/* Card Number & Title */}
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

              {/* Message - Full text, no truncation */}
              <Text style={styles.cardMessage}>
                {selectedCard.message}
              </Text>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(127,119,221,0.3)', 'rgba(109,40,217,0.3)']}
                style={styles.retryButtonGradient}
              >
                <Text style={styles.retryButtonText}>もう一度引く</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        {/* Footer: Outro, Profile, Credit */}
        <View style={styles.footerSection}>
          <View style={styles.footerDivider} />
          <Text style={styles.outroText}>{MITAMA_OUTRO}</Text>

          <View style={styles.profileSection}>
            <Image
              source={MITAMA_PROFILE_IMG}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <Text style={styles.profileHeading}>占い師プロフィール</Text>
            <Text style={styles.profileText}>{PROFILE_HEADER}</Text>
            <View style={{ width: '100%', maxWidth: 400, marginTop: 12 }}>
              {PROFILE_HISTORY.map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 8, paddingHorizontal: 8 }}>
                  <Text style={[styles.profileText, { width: 56, flexShrink: 0, color: '#C4B5FD', fontWeight: '600' }]}>
                    {item.year}
                  </Text>
                  <Text style={[styles.profileText, { flex: 1, textAlign: 'left' }]}>
                    {item.desc}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.creditSection}>
            <Text style={styles.creditText}>{MITAMA_CREDIT}</Text>
          </View>
        </View>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },

  /* Draw Prompt */
  drawPrompt: {
    marginBottom: 24,
  },
  drawPromptText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  /* Draw Button */
  drawButtonSimple: {
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 48,
    marginBottom: 48,
    shadowColor: '#4C1D95',
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
    fontSize: 18,
    color: '#E8C547',
    fontWeight: '700',
    letterSpacing: 2,
  },

  /* Result */
  resultContainer: {
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  cardImageWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  cardNumber: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1B4B',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#6D28D9',
    marginBottom: 16,
    textAlign: 'center',
  },

  /* Meta Info */
  metaSection: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  metaItem: {
    paddingVertical: 8,
  },
  metaLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  /* Card Divider */
  cardDivider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(109,40,217,0.3)',
    marginBottom: 16,
  },

  /* Message */
  cardMessage: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 28,
    width: '100%',
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
    borderColor: 'rgba(196,181,253,0.4)',
  },
  retryButtonText: {
    color: '#C4B5FD',
    fontSize: 16,
    fontWeight: '600',
  },

  /* Footer */
  footerSection: {
    width: '100%',
    marginTop: 48,
    alignItems: 'center',
  },
  footerDivider: {
    width: 80,
    height: 1,
    backgroundColor: 'rgba(109,40,217,0.2)',
    marginBottom: 24,
  },
  outroText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  profileSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4C1D95',
    marginBottom: 12,
  },
  profileText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 22,
    textAlign: 'center',
  },
  creditSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(196,181,253,0.2)',
    width: '100%',
    alignItems: 'center',
  },
  creditText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
