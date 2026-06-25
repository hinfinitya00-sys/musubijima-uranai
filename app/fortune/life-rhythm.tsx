import React, { useState, useEffect, useRef } from 'react';
import { noCopy, Fonts } from '@/constants/Typography';
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
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { calculateThisYearNumber } from '@/lib/numerology';
import {
  LIFE_RHYTHM_INTRO,
  LIFE_RHYTHM_SEASONS,
  YEAR_FORTUNES,
} from '@/constants/year-fortune';
import type { YearFortune } from '@/constants/year-fortune';
import { fetchOverlay } from '@/lib/cms';

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
          fontSize: 16,
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

const FORTUNE_LABELS = [
  { key: 'marriage' as const, label: '結婚' },
  { key: 'health' as const, label: '健康' },
  { key: 'money' as const, label: '金運' },
  { key: 'meeting' as const, label: '出会い' },
  { key: 'travel' as const, label: '旅行' },
];

/** docxの各セクションは「見出し行 + 本文」。先頭行を見出しとして表示する。 */
function SectionBlock({ text }: { text: string }) {
  const idx = text.indexOf('\n');
  const heading = idx === -1 ? text : text.slice(0, idx);
  const body = idx === -1 ? '' : text.slice(idx + 1);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {body ? <Text style={styles.sectionBody}>{body}</Text> : null}
    </View>
  );
}

export default function LifeRhythmScreen() {
  // 今年の運勢は currentYear を自動使用するため、入力は「月・日」のみ。
  // ホーム画面から month・day が渡された場合はそれを初期値にする。
  const params = useLocalSearchParams<{ month?: string; day?: string }>();
  const now = new Date();
  const currentYear = now.getFullYear(); // 毎年1/1に自動で 2027, 2028 … と更新される
  const [month, setMonth] = useState(params.month ? String(params.month) : String(now.getMonth() + 1));
  const [day, setDay] = useState(params.day ? String(params.day) : String(now.getDate()));
  const [resultNum, setResultNum] = useState<number | null>(null);

  // Supabase(year_fortune)のテキスト列をローカルデータに number で上書き。失敗時はローカルのまま。
  const [fortunes, setFortunes] = useState<YearFortune[]>(YEAR_FORTUNES);
  useEffect(() => {
    fetchOverlay('year_fortune', YEAR_FORTUNES, (y) => y.year, (y, r) => ({
      ...y,
      theme: r.title ?? y.theme,
      description: r.description ?? y.description,
    })).then(setFortunes).catch(() => {});
  }, []);

  // 月・日から今年の運勢番号を算出（年は currentYear を自動使用＝birthDateの年は無視される）
  const calcNum = (m: string, d: string) =>
    calculateThisYearNumber(new Date(2000, parseInt(m) - 1, parseInt(d)));

  // ホーム画面から月・日が渡されたら自動で結果表示（入力欄の二重表示を回避）
  const autoRan = useRef(false);
  useEffect(() => {
    if (!autoRan.current && params.month && params.day) {
      autoRan.current = true;
      setResultNum(calcNum(String(params.month), String(params.day)));
    }
  }, [params.month, params.day]);

  const handleCalc = () => setResultNum(calcNum(month, day));

  // 現在の fortunes（DB上書き反映）から結果を導出
  const result = resultNum != null ? (fortunes.find(y => y.year === resultNum) ?? fortunes[0]) : null;

  // ラッキーカラー: 先頭行＝色名、残り＝説明
  const luckyColorName = result ? (result.luckyColor.split('\n')[0]) : '';
  const luckyColorDesc = result ? result.luckyColor.split('\n').slice(1).join('\n') : '';

  return (
    <LinearGradient colors={[Colors.sectionPink, Colors.bg, Colors.sectionPink]} style={[styles.container, noCopy]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!result ? (
          <View style={styles.introWrap}>
            <View style={styles.header}>
              <Text style={styles.title}>今年の運勢</Text>
              <Text style={styles.subtitle}>9年サイクルで、今いる季節を読み解きます</Text>
            </View>

            <View style={styles.introCard}>
              <Text style={styles.introText}>{LIFE_RHYTHM_INTRO}</Text>
            </View>

            {/* 四季の対応表 */}
            <View style={styles.seasonCard}>
              {LIFE_RHYTHM_SEASONS.map((s) => (
                <View key={s.label} style={styles.seasonRow}>
                  <Text style={styles.seasonLabel}>{s.label}（{s.range}）</Text>
                  <Text style={styles.seasonDesc}>{s.desc}</Text>
                </View>
              ))}
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>誕生日（月・日）</Text>
              {/* 年表示（読み取り専用） */}
              <View style={styles.yearDisplay}>
                <Text style={styles.yearText}>{currentYear}年</Text>
              </View>
              <View style={styles.dateRow}>
                <WebSelect value={month} onChange={setMonth} items={months} />
                <View style={{ width: 8 }} />
                <WebSelect value={day} onChange={setDay} items={days} />
              </View>
              <Text style={styles.inputNote}>※ 誕生日（月・日）から、今年の運勢を占います</Text>

              <TouchableOpacity style={styles.primaryButton} onPress={handleCalc} activeOpacity={0.7}>
                <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.primaryButtonGradient}>
                  <Text style={styles.primaryButtonText}>{currentYear}年の運勢を占う</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.resultSection}>
            {/* 今年の運勢画像 */}
            <View style={styles.yearImageWrap}>
              <Image source={result.image} style={styles.yearImage} resizeMode="contain" />
            </View>

            {/* タイトル（今年の年号を明記） */}
            <Text style={styles.yearLead}>あなたの{currentYear}年は</Text>
            <Text style={styles.yearTitle}>{result.year}の年 ― {result.theme}</Text>

            {/* 運勢指標5項目 */}
            <View style={styles.fortuneCard}>
              {FORTUNE_LABELS.map(({ key, label }) => (
                <View key={key} style={styles.fortuneRow}>
                  <Text style={styles.fortuneLabel}>{label}</Text>
                  <Text style={styles.fortuneValue}>{result.fortune[key]}</Text>
                </View>
              ))}
            </View>

            {/* 本文 */}
            <View style={styles.section}>
              <Text style={styles.sectionBody}>{result.description}</Text>
            </View>

            {/* ラッキーカラー */}
            <View style={styles.luckyCard}>
              <Text style={styles.luckyLabel}>◆ ラッキーカラー</Text>
              <Text style={styles.luckyColors}>{luckyColorName}</Text>
              {luckyColorDesc ? <Text style={styles.luckyDesc}>{luckyColorDesc}</Text> : null}
            </View>

            {/* 今年のテーマ・開運アクション・サイン・控えたいこと・開運空間・お守りメッセージ */}
            <SectionBlock text={result.yearTheme} />
            <SectionBlock text={result.actions} />
            <SectionBlock text={result.signs} />
            <SectionBlock text={result.caution} />
            <SectionBlock text={result.space} />
            <SectionBlock text={result.message} />

            {/* 戻るボタン */}
            <TouchableOpacity style={styles.retryButton} onPress={() => setResultNum(null)} activeOpacity={0.7}>
              <Text style={styles.retryButtonText}>別の月日で占う</Text>
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
  subtitle: { fontSize: 20, color: Colors.muted, textAlign: 'center', lineHeight: 22 },

  introCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  introText: { fontSize: 16, color: Colors.ink, lineHeight: 26 },

  seasonCard: { backgroundColor: Colors.sectionCream, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  seasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  seasonLabel: { width: 92, fontSize: 16, fontWeight: '700', color: Colors.primaryDark },
  seasonDesc: { flex: 1, fontSize: 16, color: Colors.ink, lineHeight: 20 },

  inputSection: { width: '100%' },
  inputLabel: { fontSize: 18, fontWeight: '600', color: Colors.ink, marginBottom: 12 },
  inputNote: { fontSize: 16, color: Colors.muted, marginTop: 10 },
  yearDisplay: {
    alignItems: 'center',
    marginBottom: 8,
  },
  yearText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#C45070',
    fontFamily: Fonts.serifBold,
    letterSpacing: 2,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  nativePicker: { flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: Colors.border },
  nativePickerText: { color: Colors.ink, fontSize: 16 },
  primaryButton: { borderRadius: 16, overflow: 'hidden' },
  primaryButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  primaryButtonText: { fontSize: 18, fontWeight: 'bold', color: Colors.surface },

  resultSection: { alignItems: 'center', width: '100%' },
  yearImageWrap: { width: '100%', maxWidth: 420, aspectRatio: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: Colors.surface, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  yearImage: { width: '100%', height: '100%' },
  yearLead: { fontSize: 16, color: Colors.muted, textAlign: 'center', marginBottom: 6 },
  yearTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.ink, marginBottom: 20, textAlign: 'center' },

  fortuneCard: { width: '100%', backgroundColor: Colors.sectionPink, borderRadius: 12, padding: 16, marginBottom: 16 },
  fortuneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  fortuneLabel: { width: 64, fontSize: 16, color: Colors.primaryDark, fontWeight: '700' },
  fortuneValue: { flex: 1, fontSize: 16, color: Colors.ink, lineHeight: 20 },

  section: { width: '100%', backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionHeading: { fontSize: 20, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 12 },
  sectionBody: { fontSize: 16, color: Colors.ink, lineHeight: 26 },

  luckyCard: { width: '100%', backgroundColor: Colors.sectionCream, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  luckyLabel: { fontSize: 16, fontWeight: '700', color: Colors.accent, marginBottom: 6 },
  luckyColors: { fontSize: 20, fontWeight: 'bold', color: Colors.ink, marginBottom: 8 },
  luckyDesc: { fontSize: 16, color: Colors.ink, lineHeight: 24 },


  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  retryButtonText: { color: Colors.primary, fontSize: 16 },
});
