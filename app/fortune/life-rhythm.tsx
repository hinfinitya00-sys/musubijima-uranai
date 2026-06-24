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
import { calculateThisYearNumber } from '@/lib/numerology';
import {
  YEAR_FORTUNE_INTRO,
  YEAR_FORTUNE_INTRO_TITLE,
  YEAR_FORTUNE_SEASONS,
  YEAR_FORTUNES,
} from '@/constants/year-fortune';
import type { YearFortune } from '@/constants/year-fortune';

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

const KEYWORD_LABELS = [
  { key: 'marriage' as const, label: '結婚' },
  { key: 'health' as const, label: '健康' },
  { key: 'money' as const, label: '金運' },
  { key: 'encounter' as const, label: '出会い' },
  { key: 'travel' as const, label: '旅行' },
];

export default function LifeRhythmScreen() {
  const [year, setYear] = useState('1994');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('28');
  const [result, setResult] = useState<YearFortune | null>(null);

  const handleCalc = () => {
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const num = calculateThisYearNumber(date);
    const fortune = YEAR_FORTUNES.find(y => y.num === num) ?? YEAR_FORTUNES[0];
    setResult(fortune);
  };

  return (
    <LinearGradient colors={[Colors.sectionPink, Colors.bg, Colors.sectionPink]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!result ? (
          <View style={styles.introWrap}>
            <View style={styles.header}>
              <Text style={styles.title}>今年の運勢</Text>
              <Text style={styles.subtitle}>{YEAR_FORTUNE_INTRO_TITLE}</Text>
            </View>

            <View style={styles.introCard}>
              <Text style={styles.introText}>{YEAR_FORTUNE_INTRO}</Text>
            </View>

            {/* 四季の対応表 */}
            <View style={styles.seasonCard}>
              {YEAR_FORTUNE_SEASONS.map((s) => (
                <View key={s.label} style={styles.seasonRow}>
                  <Text style={styles.seasonLabel}>{s.label}（{s.range}）</Text>
                  <Text style={styles.seasonDesc}>{s.desc}</Text>
                </View>
              ))}
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

              <TouchableOpacity style={styles.calcButton} onPress={handleCalc} activeOpacity={0.7}>
                <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.calcButtonGradient}>
                  <Text style={styles.calcButtonText}>運勢を占う</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.resultSection}>
            {/* 今年の運勢画像 */}
            <View style={styles.yearImageWrap}>
              <Image source={result.img} style={styles.yearImage} resizeMode="contain" />
            </View>

            {/* タイトル＋テーマ名 */}
            <Text style={styles.yearTitle}>{result.title}</Text>
            <Text style={styles.yearSubtitle}>― {result.subtitle} ―</Text>

            {/* 運勢指標5項目 */}
            <View style={styles.keywordCard}>
              {KEYWORD_LABELS.map(({ key, label }) => (
                <View key={key} style={styles.keywordRow}>
                  <Text style={styles.keywordLabel}>{label}</Text>
                  <Text style={styles.keywordValue}>{result.keywords[key]}</Text>
                </View>
              ))}
            </View>

            {/* 本文 */}
            <View style={styles.section}>
              <Text style={styles.sectionBody}>{result.body}</Text>
            </View>

            {/* ラッキーカラー */}
            <View style={styles.luckyCard}>
              <Text style={styles.luckyLabel}>◆ ラッキーカラー</Text>
              <Text style={styles.luckyColors}>{result.luckyColors}</Text>
              <Text style={styles.luckyDesc}>{result.luckyDesc}</Text>
            </View>

            {/* 各セクション（テーマ・開運アクション・サイン・控えたいこと・開運空間・お守りメッセージ） */}
            {result.sections.map((sec, i) => (
              <View key={i} style={styles.section}>
                <Text style={styles.sectionHeading}>{sec.heading}</Text>
                <Text style={styles.sectionBody}>{sec.body}</Text>
              </View>
            ))}

            {/* 課金誘導バナー */}
            <TouchableOpacity
              style={styles.upsellBanner}
              onPress={() => router.push('/subscription/plans' as never)}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.upsellGradient}>
                <Text style={styles.upsellTitle}>✨ 9年すべての流れを知る</Text>
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
              <Text style={styles.retryButtonText}>別の生年月日で占う</Text>
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

  introCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  introText: { fontSize: 14, color: Colors.ink, lineHeight: 26 },

  seasonCard: {
    backgroundColor: Colors.sectionCream, borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: Colors.border,
  },
  seasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  seasonLabel: { width: 92, fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  seasonDesc: { flex: 1, fontSize: 13, color: Colors.ink, lineHeight: 20 },

  inputSection: { width: '100%' },
  inputLabel: { fontSize: 16, fontWeight: '600', color: Colors.ink, marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  nativePicker: { flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: Colors.border },
  nativePickerText: { color: Colors.ink, fontSize: 14 },
  calcButton: { borderRadius: 16, overflow: 'hidden' },
  calcButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  calcButtonText: { fontSize: 16, fontWeight: 'bold', color: Colors.surface },

  resultSection: { alignItems: 'center', width: '100%' },
  yearImageWrap: {
    width: '100%', maxWidth: 420, aspectRatio: 1, borderRadius: 20, overflow: 'hidden',
    backgroundColor: Colors.surface, marginBottom: 16, borderWidth: 1, borderColor: Colors.border,
  },
  yearImage: { width: '100%', height: '100%' },
  yearTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.ink, marginBottom: 4 },
  yearSubtitle: { fontSize: 18, color: Colors.primaryDark, marginBottom: 20 },

  keywordCard: {
    width: '100%', backgroundColor: Colors.sectionPink, borderRadius: 12, padding: 16, marginBottom: 16,
  },
  keywordRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  keywordLabel: { width: 64, fontSize: 13, color: Colors.primaryDark, fontWeight: '700' },
  keywordValue: { flex: 1, fontSize: 13, color: Colors.ink, lineHeight: 20 },

  section: {
    width: '100%', backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  sectionHeading: { fontSize: 16, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 12 },
  sectionBody: { fontSize: 14, color: Colors.ink, lineHeight: 26 },

  luckyCard: {
    width: '100%', backgroundColor: Colors.sectionCream, borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  luckyLabel: { fontSize: 14, fontWeight: '700', color: Colors.accent, marginBottom: 6 },
  luckyColors: { fontSize: 18, fontWeight: 'bold', color: Colors.ink, marginBottom: 8 },
  luckyDesc: { fontSize: 14, color: Colors.ink, lineHeight: 24 },

  upsellBanner: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  upsellGradient: { padding: 20, alignItems: 'center' },
  upsellTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  upsellText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20, marginBottom: 14 },
  upsellButton: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, paddingVertical: 8, paddingHorizontal: 20 },
  upsellButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  retryButtonText: { color: Colors.primary, fontSize: 14 },
});
