import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LIFE_RHYTHM_INTRO,
  LIFE_RHYTHM_YEARS,
} from '../../constants/life-rhythm';
import { shareResult } from '../../lib/share';
import { usePlanGate } from '../../hooks/usePlanGate';
import { PlanGate } from '../../components/PlanGate';
import type { LifeRhythmYear } from '../../constants/life-rhythm';

function reduceToSingle(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b, 10), 0);
  }
  return n;
}

function calcPersonalYear(birthDate: Date): number {
  const currentYear = new Date().getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const sum = reduceToSingle(month) + reduceToSingle(day) + reduceToSingle(currentYear);
  return reduceToSingle(sum);
}

function parseBirthDate(input: string): Date | null {
  const clean = input.trim();

  // 8桁数字 YYYYMMDD
  if (/^\d{8}$/.test(clean)) {
    const year = parseInt(clean.slice(0, 4));
    const month = parseInt(clean.slice(4, 6));
    const day = parseInt(clean.slice(6, 8));
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      return date;
    }
    return null;
  }

  // スラッシュまたはハイフン区切り YYYY/MM/DD or YYYY-MM-DD
  const parts = clean.split(/[\/\-]/);
  if (parts.length === 3) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
      return date;
    }
  }

  return null;
}

const KEYWORD_LABELS = [
  { key: 'marriage' as const, label: '結婚' },
  { key: 'health' as const, label: '健康' },
  { key: 'money' as const, label: '金運' },
  { key: 'encounter' as const, label: '出会い' },
  { key: 'travel' as const, label: '旅行' },
];

function YearCard({ year, isHighlight }: { year: LifeRhythmYear; isHighlight: boolean }) {
  return (
    <View style={[s.yearCard, isHighlight && s.yearCardHighlight]}>
      <View style={[s.yearIconWrap, { backgroundColor: year.color }]}>
        <Text style={s.yearEmoji}>{year.emoji}</Text>
      </View>
      <Text style={s.yearTitle}>{year.title}「{year.subtitle}」</Text>

      <View style={s.keywordRow}>
        {KEYWORD_LABELS.map(({ key, label }) => (
          <View key={key} style={s.keywordPill}>
            <Text style={s.keywordLabel}>{label}</Text>
            <Text style={s.keywordValue}>{year.keywords[key]}</Text>
          </View>
        ))}
      </View>

      <Text style={s.yearBody}>{year.body}</Text>

      <View style={s.luckyRow}>
        <Text style={s.luckyLabel}>ラッキーカラー</Text>
        <Text style={s.luckyValue}>{year.luckyColors}</Text>
      </View>
    </View>
  );
}

export default function LifeRhythmScreen() {
  const { canUse } = usePlanGate();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState('');

  const handleCalc = () => {
    const date = parseBirthDate(input);
    if (!date) {
      setError('正しい形式で入力してください（例：19940128）');
      return;
    }
    setError('');
    setResult(calcPersonalYear(date));
  };

  const resultYear = result ? LIFE_RHYTHM_YEARS.find(y => y.num === result) : null;

  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={s.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Text style={s.title}>人生リズム</Text>
          <Text style={s.subtitle}>LIFE RHYTHM</Text>
        </View>

        {!result ? (
          <View style={s.inputSection}>
            <Text style={s.inputDesc}>
              生年月日を入力すると、今年があなたの{'\n'}
              人生サイクルの何年目かがわかります
            </Text>
            <TextInput
              style={s.textInput}
              placeholder="例：19940128 または 1994/01/28"
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              keyboardType="default"
              autoCapitalize="none"
            />
            {error ? <Text style={s.errorText}>{error}</Text> : null}
            <TouchableOpacity style={s.calcButton} onPress={handleCalc} activeOpacity={0.8}>
              <LinearGradient
                colors={['#E8758A', '#C45070']}
                style={s.calcButtonGradient}
              >
                <Text style={s.calcButtonText}>調べる</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : resultYear ? (
          <View style={s.resultSection}>
            <View style={s.announceBox}>
              <Text style={s.announceEmoji}>{resultYear.emoji}</Text>
              <Text style={s.announceText}>
                あなたは今
              </Text>
              <Text style={s.announceYear}>
                {resultYear.title}「{resultYear.subtitle}」
              </Text>
              <Text style={s.announceText}>にいます</Text>
            </View>

            <YearCard year={resultYear} isHighlight />

            <TouchableOpacity
              style={s.shareButton}
              onPress={() => shareResult({
                title: '私の今年の人生リズム',
                message: `【私の今年の人生リズム】\n${resultYear.title}「${resultYear.subtitle}」\n\n${resultYear.body.slice(0, 80)}...`,
              })}
              activeOpacity={0.8}
            >
              <Text style={s.shareButtonText}>今年のリズムをシェアする 🌿</Text>
            </TouchableOpacity>

            <PlanGate locked={!canUse.lifeRhythmAll}>
              <TouchableOpacity
                style={s.showAllButton}
                onPress={() => setShowAll(!showAll)}
                activeOpacity={0.8}
              >
                <Text style={s.showAllText}>
                  {showAll ? '閉じる' : '9年のサイクルを全部見る'}
                </Text>
              </TouchableOpacity>
            </PlanGate>

            {showAll && canUse.lifeRhythmAll && LIFE_RHYTHM_YEARS.filter(y => y.num !== result).map(year => (
              <YearCard key={year.num} year={year} isHighlight={false} />
            ))}

            <TouchableOpacity
              style={s.resetButton}
              onPress={() => { setResult(null); setShowAll(false); setInput(''); }}
              activeOpacity={0.8}
            >
              <Text style={s.resetText}>別の生年月日で調べる</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={s.footer}>
          <View style={s.footerDivider} />
          <Text style={s.footerText}>{LIFE_RHYTHM_INTRO}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFAF9' },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3D1A1A', marginBottom: 4 },
  subtitle: { fontSize: 11, color: '#C45070', letterSpacing: 6 },

  inputSection: { alignItems: 'center', marginBottom: 32 },
  inputDesc: { fontSize: 14, color: '#3D1A1A', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  textInput: {
    width: '80%', maxWidth: 280, height: 48,
    borderWidth: 1, borderColor: '#F5C0CC', borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: '#3D1A1A',
    backgroundColor: '#FFFAF9', textAlign: 'center',
  },
  errorText: { color: '#DC2626', fontSize: 12, marginTop: 8 },
  calcButton: { marginTop: 20, borderRadius: 50, overflow: 'hidden' },
  calcButtonGradient: { paddingHorizontal: 48, paddingVertical: 16, borderRadius: 50 },
  calcButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  resultSection: { alignItems: 'center' },
  announceBox: { alignItems: 'center', marginBottom: 24 },
  announceEmoji: { fontSize: 48, marginBottom: 12 },
  announceText: { fontSize: 14, color: '#3D1A1A' },
  announceYear: { fontSize: 24, fontWeight: 'bold', color: '#C45070', marginVertical: 4 },

  yearCard: {
    width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#F5C0CC',
  },
  yearCardHighlight: {
    borderColor: '#E8758A', borderWidth: 2,
    shadowColor: '#E8758A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  yearIconWrap: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  yearEmoji: { fontSize: 24 },
  yearTitle: { fontSize: 18, fontWeight: 'bold', color: '#3D1A1A', marginBottom: 12 },

  keywordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  keywordPill: {
    backgroundColor: '#FFE0E8', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  keywordLabel: { fontSize: 9, color: '#C45070', fontWeight: '600' },
  keywordValue: { fontSize: 11, color: '#3D1A1A', fontWeight: '500' },

  yearBody: { fontSize: 14, color: '#3D1A1A', lineHeight: 26, marginBottom: 16 },

  luckyRow: {
    backgroundColor: '#FFF8F0', borderRadius: 10, padding: 12,
  },
  luckyLabel: { fontSize: 11, color: '#7A6A6A', fontWeight: '600', marginBottom: 4 },
  luckyValue: { fontSize: 13, color: '#3D1A1A' },

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
    color: '#E8758A',
    fontSize: 14,
    fontWeight: '500',
  },

  showAllButton: {
    marginVertical: 16, paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 50, borderWidth: 1, borderColor: '#E8758A',
  },
  showAllText: { color: '#E8758A', fontSize: 14, fontWeight: '600', textAlign: 'center' },

  resetButton: { marginTop: 8, paddingVertical: 12 },
  resetText: { color: '#7A6A6A', fontSize: 13, textAlign: 'center' },

  footer: { marginTop: 48, alignItems: 'center' },
  footerDivider: {
    width: 80, height: 1, backgroundColor: 'rgba(232,117,138,0.2)', marginBottom: 24,
  },
  footerText: { fontSize: 13, color: '#3D1A1A', lineHeight: 24, textAlign: 'center' },
});
