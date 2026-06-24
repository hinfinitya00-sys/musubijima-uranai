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
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { calculateMusubiNumber } from '@/lib/numerology';
import {
  MUSUBIZOKU_INTRO,
  MUSUBI_CHARACTERS,
} from '@/constants/musubizoku';
import type { MusubiCharacter } from '@/constants/musubizoku';

const years = Array.from({ length: 91 }, (_, i) => ({ value: String(1920 + i), label: `${1920 + i}年` }));
const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}月` }));
const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}日` }));

const ELEMENT_EMOJI: Record<string, string> = { 火: '🔥', 水: '💧', 風: '🍃', 土: '🌱' };

function WebSelect({ value, onChange, items }: { value: string; onChange: (v: string) => void; items: { value: string; label: string }[] }) {
  if (Platform.OS === 'web') {
    return (
      <select
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        style={{
          flex: 1,
          backgroundColor: Colors.sectionPink,
          color: Colors.ink,
          border: `1px solid ${Colors.border}`,
          borderRadius: 8,
          padding: '10px 8px',
          fontSize: 14,
          cursor: 'pointer',
          outline: 'none',
        } as any}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value} style={{ background: Colors.surface }}>
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

/** 数秘番号からむすび族を取得。範囲外は最も近い番号にフォールバック。 */
function findCharacter(num: number): MusubiCharacter {
  const exact = MUSUBI_CHARACTERS.find(c => c.num === num);
  if (exact) return exact;
  return MUSUBI_CHARACTERS.reduce((best, c) =>
    Math.abs(c.num - num) < Math.abs(best.num - num) ? c : best,
  MUSUBI_CHARACTERS[0]);
}

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

export default function MusubianScreen() {
  const [year, setYear] = useState('1994');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('28');
  const [result, setResult] = useState<{ num: number; character: MusubiCharacter } | null>(null);

  const handleDiagnose = () => {
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const num = calculateMusubiNumber(date);
    setResult({ num, character: findCharacter(num) });
  };

  return (
    <LinearGradient colors={[Colors.sectionPink, Colors.bg, Colors.sectionPink]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!result ? (
          <View style={styles.introWrap}>
            <View style={styles.header}>
              <Text style={styles.title}>結び族占い</Text>
              <Text style={styles.subtitle}>あなたは、どんな結び族でしょうか。</Text>
            </View>

            <View style={styles.introCard}>
              <Text style={styles.introText}>{MUSUBIZOKU_INTRO}</Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>生年月日</Text>
              <View style={styles.dateRow}>
                <WebSelect value={year} onChange={setYear} items={years} />
                <View style={{ width: 8 }} />
                <WebSelect value={month} onChange={setMonth} items={months} />
                <View style={{ width: 8 }} />
                <WebSelect value={day} onChange={setDay} items={days} />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleDiagnose} activeOpacity={0.7}>
                <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.primaryButtonGradient}>
                  <Text style={styles.primaryButtonText}>鑑定する</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.resultSection}>
            {/* キャラクター画像 */}
            <View style={styles.charImageWrap}>
              <Image source={result.character.image} style={styles.charImage} resizeMode="contain" />
            </View>

            {/* 名前・属性・数秘番号 */}
            <Text style={styles.charName}>
              {ELEMENT_EMOJI[result.character.element] ?? '🌱'} {result.character.name}
            </Text>
            <Text style={styles.charMeta}>
              数秘{result.character.num}の結び族 ／ {result.character.element}
            </Text>

            {/* キーワード */}
            <View style={styles.keywordCard}>
              <Text style={styles.keywordLabel}>キーワード</Text>
              <Text style={styles.keywordValue}>{result.character.keywords}</Text>
            </View>

            {/* ラッキーカラー・補助カラー */}
            <View style={styles.colorRow}>
              <View style={styles.colorBox}>
                <Text style={styles.colorBoxLabel}>ラッキーカラー</Text>
                <Text style={styles.colorBoxValue}>{result.character.luckyColor}</Text>
              </View>
              <View style={{ width: 10 }} />
              <View style={styles.colorBox}>
                <Text style={styles.colorBoxLabel}>補助カラー</Text>
                <Text style={styles.colorBoxValue}>{result.character.subColor}</Text>
              </View>
            </View>

            {/* 各セクション（docxの順番通り。見出しは名前・属性から復元） */}
            <Section heading={`${result.character.name}ってどんな結び族？`} body={result.character.description} />
            <Section heading={`生まれた時にもらった${result.character.element}の贈りもの`} body={result.character.gift} />
            <Section heading={`${result.character.name}が苦手なこと`} body={result.character.weakness} />
            <Section heading="あなたらしい幸せの育て方" body={result.character.happiness} />

            {/* 結び島からの手紙 */}
            <View style={styles.letterCard}>
              <Text style={styles.letterHeading}>結び島からの手紙</Text>
              <Text style={styles.letterSigner}>{result.character.letterSigner}</Text>
              <Text style={styles.letterBody}>{result.character.letter}</Text>
            </View>

            {/* 結び島のことば */}
            <Text style={styles.kotobaText}>🌱 結び島のことば{'\n'}あなたの中にも、結びの種があります。</Text>

            {/* 育ち3段階 */}
            <View style={styles.growthCard}>
              <Text style={styles.growthTitle}>【結び族{result.character.num}の育ち】</Text>
              <View style={styles.growthStage}>
                <Text style={styles.growthStageLabel}>🌱 若木</Text>
                <Text style={styles.growthStageBody}>{result.character.growth.young}</Text>
              </View>
              <View style={styles.growthStage}>
                <Text style={styles.growthStageLabel}>🌿 成長</Text>
                <Text style={styles.growthStageBody}>{result.character.growth.middle}</Text>
              </View>
              <View style={styles.growthStage}>
                <Text style={styles.growthStageLabel}>🍃 円熟</Text>
                <Text style={styles.growthStageBody}>{result.character.growth.mature}</Text>
              </View>
              <View style={styles.growthDivider} />
              <Text style={styles.growthWordsLabel}>🍃 結びのことば</Text>
              <Text style={styles.growthWordsBody}>{result.character.bindingWord}</Text>
            </View>

            {/* 課金誘導バナー */}
            <TouchableOpacity
              style={styles.upsellBanner}
              onPress={() => router.push('/subscription/plans' as never)}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.upsellGradient}>
                <Text style={styles.upsellTitle}>✨ もっと深く、自分を知る</Text>
                <Text style={styles.upsellText}>
                  プランに登録すると、毎月の運勢や全機能が解放されます
                </Text>
                <View style={styles.upsellButton}>
                  <Text style={styles.upsellButtonText}>プランを見る →</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* 戻るボタン */}
            <TouchableOpacity style={styles.retryButton} onPress={() => setResult(null)} activeOpacity={0.7}>
              <Text style={styles.retryButtonText}>別の生年月日で鑑定する</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 80, paddingTop: 32, paddingHorizontal: 20, maxWidth: 600, width: '100%', alignSelf: 'center' },

  introWrap: { width: '100%' },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 22 },

  introCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  introText: { fontSize: 14, color: Colors.ink, lineHeight: 26 },

  inputSection: { width: '100%' },
  inputLabel: { fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  nativePicker: { flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: Colors.border },
  nativePickerText: { color: Colors.ink, fontSize: 14 },
  primaryButton: { borderRadius: 16, overflow: 'hidden' },
  primaryButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.surface },

  resultSection: { alignItems: 'center', width: '100%' },
  charImageWrap: { width: '100%', maxWidth: 360, aspectRatio: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: Colors.surface, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  charImage: { width: '100%', height: '100%' },
  charName: { fontSize: 26, fontWeight: 'bold', color: Colors.ink, marginBottom: 4 },
  charMeta: { fontSize: 14, color: Colors.primaryDark, marginBottom: 20 },

  keywordCard: { width: '100%', backgroundColor: Colors.sectionPink, borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
  keywordLabel: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600', marginBottom: 4 },
  keywordValue: { fontSize: 15, color: Colors.ink, fontWeight: '500', textAlign: 'center' },

  colorRow: { flexDirection: 'row', width: '100%', marginBottom: 24 },
  colorBox: { flex: 1, backgroundColor: Colors.sectionCream, borderRadius: 12, padding: 14 },
  colorBoxLabel: { fontSize: 11, color: Colors.muted, fontWeight: '600', marginBottom: 4 },
  colorBoxValue: { fontSize: 13, color: Colors.ink, lineHeight: 20 },

  section: { width: '100%', backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionHeading: { fontSize: 17, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 12 },
  sectionBody: { fontSize: 14, color: Colors.ink, lineHeight: 26 },

  letterCard: { width: '100%', backgroundColor: Colors.sectionPink, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  letterHeading: { fontSize: 17, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 8 },
  letterSigner: { fontSize: 14, color: Colors.muted, marginBottom: 8 },
  letterBody: { fontSize: 14, color: Colors.ink, lineHeight: 26, fontStyle: 'italic' },

  kotobaText: { fontSize: 14, color: Colors.primaryDark, textAlign: 'center', lineHeight: 24, marginBottom: 16 },

  growthCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  growthTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.ink, marginBottom: 16, textAlign: 'center' },
  growthStage: { marginBottom: 14 },
  growthStageLabel: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  growthStageBody: { fontSize: 14, color: Colors.ink, lineHeight: 24 },
  growthDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  growthWordsLabel: { fontSize: 14, fontWeight: '700', color: Colors.accent, marginBottom: 6 },
  growthWordsBody: { fontSize: 14, color: Colors.ink, lineHeight: 24 },

  upsellBanner: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  upsellGradient: { padding: 20, alignItems: 'center' },
  upsellTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  upsellText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20, marginBottom: 14 },
  upsellButton: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, paddingVertical: 8, paddingHorizontal: 20 },
  upsellButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  retryButtonText: { color: Colors.primary, fontSize: 14 },
});
