import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const ATTRIBUTE_COLORS: Record<string, string> = {
  fire: '#E74C3C',
  water: '#3498DB',
  wind: '#2ECC71',
  earth: '#F39C12',
};

const ATTRIBUTE_LABELS: Record<string, string> = {
  fire: '火',
  water: '水',
  wind: '風',
  earth: '土',
};

export default function CharacterScreen() {
  // This will be connected to tRPC in the full implementation
  const character = {
    name: 'Gola',
    nameJa: 'ゴーラ',
    attribute: 'fire',
    description: '情熱的で行動力あふれるリーダー気質のキャラクター',
    descriptionFull: null as string | null,
    imageUrl: null as string | null,
  };
  const plan = 'free';

  const attributeColor = ATTRIBUTE_COLORS[character.attribute] ?? '#888';

  return (
    <LinearGradient colors={['#FFFAF9', '#FDF1F3', '#FFFAF9']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* キャラ画像プレースホルダー */}
        <View style={styles.imageContainer}>
          <View style={[styles.imagePlaceholder, { borderColor: attributeColor }]}>
            <Text style={styles.imageEmoji}>
              {character.attribute === 'fire' ? '🔥' :
               character.attribute === 'water' ? '💧' :
               character.attribute === 'wind' ? '🌿' : '🌍'}
            </Text>
          </View>
        </View>

        {/* 属性バッジ */}
        <View style={[styles.attributeBadge, { backgroundColor: attributeColor }]}>
          <Text style={styles.attributeText}>
            {ATTRIBUTE_LABELS[character.attribute]} 属性
          </Text>
        </View>

        {/* キャラ名 */}
        <Text style={styles.characterName}>{character.name}</Text>
        {character.nameJa && (
          <Text style={styles.characterNameJa}>{character.nameJa}</Text>
        )}

        {/* 説明文 */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{character.description}</Text>
        </View>

        {/* フリープランの場合のアップセル */}
        {plan === 'free' && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={() => router.push('/subscription/plans')}
          >
            <LinearGradient colors={['#F2D06B', '#E8A87C']} style={styles.upgradeGradient}>
              <Text style={styles.upgradeTitle}>もっと詳しく知る</Text>
              <Text style={styles.upgradeSubtitle}>
                スタンダードプランでキャラの詳細解説を解放
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* スタンダード以上：詳細説明 */}
        {plan !== 'free' && character.descriptionFull && (
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>詳細解説</Text>
            <Text style={styles.descriptionText}>{character.descriptionFull}</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, alignItems: 'center' },
  imageContainer: { marginTop: 20, marginBottom: 16 },
  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#F9C0CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmoji: { fontSize: 64 },
  attributeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  attributeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  characterName: { fontSize: 32, fontWeight: 'bold', color: '#C45070', marginBottom: 4 },
  characterNameJa: { fontSize: 16, color: '#7A6A6A', marginBottom: 20 },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#C45070', marginBottom: 8 },
  descriptionText: { fontSize: 15, color: '#3D1A1A', lineHeight: 24 },
  upgradeCard: { width: '100%', borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  upgradeGradient: { padding: 20, alignItems: 'center' },
  upgradeTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFAF9', marginBottom: 4 },
  upgradeSubtitle: { fontSize: 13, color: '#333' },
});
