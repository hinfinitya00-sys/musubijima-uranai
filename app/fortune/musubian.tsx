import React, { useState, useEffect } from 'react';
import { noCopy } from '@/constants/Typography';
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
import { calculateMusubiNumber } from '@/lib/numerology';
import {
  MUSUBIZOKU_INTRO,
  MUSUBI_CHARACTERS,
} from '@/constants/musubizoku';
import type { MusubiCharacter } from '@/constants/musubizoku';
import { fetchOverlay } from '@/lib/cms';

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

/** 数秘番号からむすび族を取得。範囲外は最も近い番号にフォールバック。 */
function findCharacter(num: number, list: MusubiCharacter[]): MusubiCharacter {
  const exact = list.find(c => c.num === num);
  if (exact) return exact;
  return list.reduce((best, c) =>
    Math.abs(c.num - num) < Math.abs(best.num - num) ? c : best,
  list[0]);
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
  const params = useLocalSearchParams<{ year?: string; month?: string; day?: string }>();
  const [result, setResult] = useState<{ num: number; character: MusubiCharacter } | null>(null);
  // SSR(静的書き出し)とクライアント初回描画を一致させ、ハイドレーション不一致を防ぐ
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Supabase(musubizoku)のテキスト列をローカルデータに number で上書き。失敗時はローカルのまま。
  const [characters, setCharacters] = useState<MusubiCharacter[]>(MUSUBI_CHARACTERS);
  useEffect(() => {
    fetchOverlay('musubizoku', MUSUBI_CHARACTERS, (c) => c.num, (c, r) => ({
      ...c,
      name: r.name ?? c.name,
      element: r.element ?? c.element,
      description: r.description ?? c.description,
      keywords: r.keywords ?? c.keywords,
      luckyColor: r.lucky_color ?? c.luckyColor,
      subColor: r.sub_color ?? c.subColor,
      gift: r.gift ?? c.gift,
      weakness: r.weakness ?? c.weakness,
      happiness: r.happiness ?? c.happiness,
      letter: r.letter ?? c.letter,
      letterSigner: r.letter_signer ?? c.letterSigner,
      bindingWord: r.binding_word ?? c.bindingWord,
      growth: {
        young: r.growth_young ?? c.growth?.young,
        middle: r.growth_middle ?? c.growth?.middle,
        mature: r.growth_mature ?? c.growth?.mature,
      },
    })).then(setCharacters).catch(() => {});
  }, []);

  // ホームから生年月日が渡されたら自動で鑑定（characters 読込後にも反映）
  useEffect(() => {
    const py = params.year as string;
    const pm = params.month as string;
    const pd = params.day as string;
    if (py && pm && pd) {
      setYear(py);
      setMonth(pm);
      setDay(pd);
      const dateObj = new Date(parseInt(py), parseInt(pm) - 1, parseInt(pd));
      const num = calculateMusubiNumber(dateObj);
      const found = findCharacter(num, characters);
      if (found) setResult({ num, character: found });
    }
  }, [characters]);

  const handleDiagnose = () => {
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const num = calculateMusubiNumber(date);
    setResult({ num, character: findCharacter(num, characters) });
  };

  return (
    <LinearGradient colors={[Colors.sectionPink, Colors.bg, Colors.sectionPink]} style={[styles.container, noCopy]}>
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

            {(!mounted || !params.year) && (
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
            )}
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
  subtitle: { fontSize: 20, color: Colors.muted, textAlign: 'center', lineHeight: 22 },

  introCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  introText: { fontSize: 16, color: Colors.ink, lineHeight: 26 },

  inputSection: { width: '100%' },
  inputLabel: { fontSize: 18, fontWeight: '600', color: Colors.ink, marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  nativePicker: { flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: 10, borderWidth: 1, borderColor: Colors.border },
  nativePickerText: { color: Colors.ink, fontSize: 16 },
  primaryButton: { borderRadius: 16, overflow: 'hidden' },
  primaryButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  primaryButtonText: { fontSize: 18, fontWeight: 'bold', color: Colors.surface },

  resultSection: { alignItems: 'center', width: '100%' },
  charImageWrap: { width: '100%', maxWidth: 360, aspectRatio: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: Colors.surface, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  charImage: { width: '100%', height: '100%' },
  charName: { fontSize: 28, fontWeight: 'bold', color: Colors.ink, marginBottom: 4 },
  charMeta: { fontSize: 16, color: Colors.primaryDark, marginBottom: 20 },

  keywordCard: { width: '100%', backgroundColor: Colors.sectionPink, borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
  keywordLabel: { fontSize: 16, color: Colors.primaryDark, fontWeight: '600', marginBottom: 4 },
  keywordValue: { fontSize: 17, color: Colors.ink, fontWeight: '500', textAlign: 'center' },

  colorRow: { flexDirection: 'row', width: '100%', marginBottom: 24 },
  colorBox: { flex: 1, backgroundColor: Colors.sectionCream, borderRadius: 12, padding: 14 },
  colorBoxLabel: { fontSize: 16, color: Colors.muted, fontWeight: '600', marginBottom: 4 },
  colorBoxValue: { fontSize: 16, color: Colors.ink, lineHeight: 20 },

  section: { width: '100%', backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionHeading: { fontSize: 20, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 12 },
  sectionBody: { fontSize: 16, color: Colors.ink, lineHeight: 26 },

  letterCard: { width: '100%', backgroundColor: Colors.sectionPink, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  letterHeading: { fontSize: 20, fontWeight: 'bold', color: Colors.primaryDark, marginBottom: 8 },
  letterSigner: { fontSize: 16, color: Colors.muted, marginBottom: 8 },
  letterBody: { fontSize: 16, color: Colors.ink, lineHeight: 26, fontStyle: 'italic' },

  kotobaText: { fontSize: 16, color: Colors.primaryDark, textAlign: 'center', lineHeight: 24, marginBottom: 16 },

  growthCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  growthTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.ink, marginBottom: 16, textAlign: 'center' },
  growthStage: { marginBottom: 14 },
  growthStageLabel: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  growthStageBody: { fontSize: 16, color: Colors.ink, lineHeight: 24 },
  growthDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  growthWordsLabel: { fontSize: 16, fontWeight: '700', color: Colors.accent, marginBottom: 6 },
  growthWordsBody: { fontSize: 16, color: Colors.ink, lineHeight: 24 },

  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  retryButtonText: { color: Colors.primary, fontSize: 16 },
});
