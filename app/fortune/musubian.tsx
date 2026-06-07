import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HEADER_IMG = 'https://musubijima.com/wp-content/uploads/2021/03/contents_header.jpg';
import { calculateLifePathNumber, getCharacterIdByLifePath } from '@/lib/numerology';
import { INITIAL_CHARACTERS } from '@/constants/characters';

const years = Array.from({ length: 91 }, (_, i) => ({ value: String(1920 + i), label: `${1920 + i}年` }));
const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}月` }));
const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}日` }));

function WebSelect({ value, onChange, items }: { value: string; onChange: (v: string) => void; items: { value: string; label: string }[] }) {
  if (Platform.OS === 'web') {
    return (
      <select
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#E5E7EB',
          border: '1px solid rgba(196,181,253,0.4)',
          borderRadius: 8,
          padding: '10px 8px',
          fontSize: 14,
          cursor: 'pointer',
          outline: 'none',
        } as any}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value} style={{ background: '#0D0B1E' }}>
            {item.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <TouchableOpacity style={styles.nativePicker}>
      <Text style={styles.nativePickerText}>{items.find(i => i.value === value)?.label ?? value}</Text>
    </TouchableOpacity>
  );
}

function getCompatibilityScore(lifePathA: number, lifePathB: number): number {
  const highCompat: Record<number, number[]> = {
    1: [3, 5, 7],
    2: [4, 6, 8],
    3: [1, 5, 9],
    4: [2, 6, 8],
    5: [1, 3, 7],
    6: [2, 4, 9],
    7: [1, 5, 7],
    8: [2, 4, 8],
    9: [3, 6, 9],
    11: [2, 6, 9],
    22: [4, 8, 11],
    33: [6, 9, 11],
  };

  const aCompats = highCompat[lifePathA] ?? [];
  const bCompats = highCompat[lifePathB] ?? [];

  let score = 60;
  if (aCompats.includes(lifePathB)) score += 20;
  if (bCompats.includes(lifePathA)) score += 15;
  if (lifePathA === lifePathB) score += 10;

  return Math.min(score, 100);
}

function getCompatibilityMessage(score: number): string {
  if (score >= 90) return 'まさに運命の相性！お互いの魂が深く共鳴し合っています。一緒にいることで、お互いの可能性が無限に広がるでしょう。';
  if (score >= 80) return '素晴らしい相性です！お互いを高め合い、成長させる関係。自然体でいられる心地よいつながりです。';
  if (score >= 70) return '良い相性です。お互いの違いが刺激になり、新しい視点を与えてくれる関係です。';
  if (score >= 60) return '穏やかな相性です。時間をかけてお互いを理解し合うことで、深い絆が生まれるでしょう。';
  return 'チャレンジングな相性ですが、だからこそ大きな学びがあります。違いを尊重することで唯一無二の関係に。';
}

export default function MusubianScreen() {
  const [partnerYear, setPartnerYear] = useState('1990');
  const [partnerMonth, setPartnerMonth] = useState('1');
  const [partnerDay, setPartnerDay] = useState('1');
  const [result, setResult] = useState<{
    myLifePath: number;
    partnerLifePath: number;
    myCharacter: typeof INITIAL_CHARACTERS[0];
    partnerCharacter: typeof INITIAL_CHARACTERS[0];
    score: number;
    message: string;
  } | null>(null);

  const handleDiagnose = () => {
    const partnerDate = new Date(
      parseInt(partnerYear),
      parseInt(partnerMonth) - 1,
      parseInt(partnerDay)
    );
    const partnerLifePath = calculateLifePathNumber(partnerDate);

    const myLifePath = 3;
    const myCharId = getCharacterIdByLifePath(myLifePath);
    const partnerCharId = getCharacterIdByLifePath(partnerLifePath);

    const myCharacter = INITIAL_CHARACTERS.find(c => c.id === myCharId) ?? INITIAL_CHARACTERS[0];
    const partnerCharacter = INITIAL_CHARACTERS.find(c => c.id === partnerCharId) ?? INITIAL_CHARACTERS[0];

    const score = getCompatibilityScore(myLifePath, partnerLifePath);
    const message = getCompatibilityMessage(score);

    setResult({ myLifePath, partnerLifePath, myCharacter, partnerCharacter, score, message });
  };

  const handleReset = () => {
    setResult(null);
    setPartnerYear('1990');
    setPartnerMonth('1');
    setPartnerDay('1');
  };

  return (
    <LinearGradient colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ヘッダー画像 */}
        <View style={styles.heroContainer}>
          {Platform.OS === 'web' ? (
            <img src={HEADER_IMG} alt="むすび族占い" style={{ width: '100%', display: 'block' } as any} />
          ) : (
            <Image source={{ uri: HEADER_IMG }} style={styles.heroImage} resizeMode="cover" />
          )}
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>むすび族占い（相性診断）</Text>
          <Text style={styles.subtitle}>
            あなたと相手のむすびキャラの相性を診断します
          </Text>
        </View>

        {!result ? (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>相手の生年月日</Text>
            <View style={styles.dateRow}>
              <WebSelect value={partnerYear} onChange={setPartnerYear} items={years} />
              <View style={{ width: 8 }} />
              <WebSelect value={partnerMonth} onChange={setPartnerMonth} items={months} />
              <View style={{ width: 8 }} />
              <WebSelect value={partnerDay} onChange={setPartnerDay} items={days} />
            </View>

            <TouchableOpacity
              style={styles.diagnoseButton}
              onPress={handleDiagnose}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#7F77DD', '#6D28D9']}
                style={styles.diagnoseButtonGradient}
              >
                <Text style={styles.diagnoseButtonText}>相性を診断する</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultSection}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>相性スコア</Text>
              <Text style={styles.scoreValue}>{result.score}%</Text>
            </View>

            <View style={styles.characterComparison}>
              <View style={styles.characterBox}>
                <Text style={styles.characterEmoji}>
                  {result.myCharacter.attribute === 'fire' ? '🔥' :
                   result.myCharacter.attribute === 'water' ? '💧' :
                   result.myCharacter.attribute === 'wind' ? '🌿' :
                   result.myCharacter.attribute === 'earth' ? '🌍' : '⭐'}
                </Text>
                <Text style={styles.characterName}>{result.myCharacter.name}</Text>
                <Text style={styles.characterLifePath}>ライフパス {result.myLifePath}</Text>
              </View>

              <Text style={styles.vsText}>×</Text>

              <View style={styles.characterBox}>
                <Text style={styles.characterEmoji}>
                  {result.partnerCharacter.attribute === 'fire' ? '🔥' :
                   result.partnerCharacter.attribute === 'water' ? '💧' :
                   result.partnerCharacter.attribute === 'wind' ? '🌿' :
                   result.partnerCharacter.attribute === 'earth' ? '🌍' : '⭐'}
                </Text>
                <Text style={styles.characterName}>{result.partnerCharacter.name}</Text>
                <Text style={styles.characterLifePath}>ライフパス {result.partnerLifePath}</Text>
              </View>
            </View>

            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{result.message}</Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
              <Text style={styles.retryButtonText}>別の人との相性を診断する</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  heroContainer: { width: '100%', backgroundColor: '#000' },
  heroImage: { width: '100%', height: 200 },
  header: { alignItems: 'center', marginBottom: 32, paddingHorizontal: 20, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#C4B5FD', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  inputSection: { width: '100%', paddingHorizontal: 20 },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#E5E7EB', marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  nativePicker: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8, padding: 10, borderWidth: 1, borderColor: 'rgba(196,181,253,0.3)',
  },
  nativePickerText: { color: '#E5E7EB', fontSize: 14 },
  diagnoseButton: { borderRadius: 16, overflow: 'hidden' },
  diagnoseButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  diagnoseButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  resultSection: { alignItems: 'center', width: '100%', paddingHorizontal: 20 },
  scoreContainer: { alignItems: 'center', marginBottom: 24 },
  scoreLabel: { fontSize: 14, color: '#9CA3AF', marginBottom: 4 },
  scoreValue: { fontSize: 56, fontWeight: 'bold', color: '#E8C547' },
  characterComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  characterBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  characterEmoji: { fontSize: 36, marginBottom: 8 },
  characterName: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  characterLifePath: { fontSize: 12, color: '#9CA3AF' },
  vsText: { fontSize: 24, color: '#E8C547', marginHorizontal: 12, fontWeight: 'bold' },
  messageCard: {
    backgroundColor: 'rgba(127,119,221,0.1)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(127,119,221,0.3)',
    marginBottom: 24,
  },
  messageText: { fontSize: 15, color: '#D1D5DB', lineHeight: 26, textAlign: 'center' },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.4)',
  },
  retryButtonText: { color: '#C4B5FD', fontSize: 14 },
});
