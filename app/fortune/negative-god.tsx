import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

function reduceToSingleDigit(n: number): number {
  let num = n;
  while (num > 9) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return num || 1;
}

function calcEmotionType(year: number, month: number, day: number, hour: number): string {
  const sum = year + month + day + hour;
  const rootNum = reduceToSingleDigit(sum);
  const emotions = ['anxiety', 'anger', 'sadness', 'impatience', 'jealousy', 'emptiness'];
  return emotions[(rootNum - 1) % emotions.length];
}

const EMOTIONS = [
  { id: 'anxiety', label: '不安', emoji: '😰' },
  { id: 'anger', label: '怒り', emoji: '😤' },
  { id: 'sadness', label: '悲しみ', emoji: '😢' },
  { id: 'impatience', label: '焦り', emoji: '😖' },
  { id: 'jealousy', label: '嫉妬', emoji: '😒' },
  { id: 'emptiness', label: '虚しさ', emoji: '😶' },
];

const EMOTION_LABELS: Record<string, string> = {
  anxiety: '不安', anger: '怒り', sadness: '悲しみ',
  impatience: '焦り', jealousy: '嫉妬', emptiness: '虚しさ',
};

const NEGATIVE_GOD_RESPONSES: Record<string, string[]> = {
  anxiety: [
    'おやおや、不安に飲まれているな？でもな、不安ってのは「まだ起きていないこと」への反応なんだ。今この瞬間、お前は無事だろう？その事実だけで十分すごいことなんだぜ。',
    'ヒヒヒ、不安か。実はな、不安を感じられるってことは、お前がちゃんと未来のことを考えられる証拠なんだ。そんな自分を褒めてやれよ。',
    '不安？上等じゃねえか！お前の中のネガティブ神様（つまりオレ）が言うんだ、「その不安、認めたぞ」って。認めたら半分は消えるもんだ。',
  ],
  anger: [
    'おお、怒りか！いいエネルギーだ！でもな、怒りってのは「大切なものを守りたい」って気持ちの裏返しなんだ。お前が何を守りたいのか、そこに気づいたら怒りは味方になるぜ。',
    'カッカしてるな？ヒヒヒ。怒りは使い方次第で最強の推進力になる。でも今は一回深呼吸して、その炎を小さくしてみな。明日また使えるように取っておけ。',
    'おいおい、そんなに怒って。でもな、お前が怒れるってことは、まだ諦めてない証拠だ。その情熱、オレは嫌いじゃないぜ。',
  ],
  sadness: [
    'しょぼくれた顔してんな。でもな、悲しめるってことは、お前が何かを深く愛した証拠なんだ。愛せる心を持ってるお前は、十分すごいんだぜ。',
    '泣きたい時は泣けよ。ネガティブ神のオレが許可する。涙は心の浄化だ。流し終わったら、きっと空が少し明るく見えるから。',
    '悲しみか...。実はな、悲しみの底には必ず新しい種が埋まってるんだ。今は暗いかもしれないが、その種はいつか芽を出す。オレが保証するぜ。',
  ],
  impatience: [
    'せっかちだなぁ！ヒヒヒ。でもな、焦りってのは「もっと良くなりたい」って気持ちだろ？その向上心は素晴らしいが、今のお前だって十分いい線いってるぜ。',
    'おいおい、そんなに急いでどこへ行く？宇宙の時間は人間が思うより遥かにゆっくりだ。お前のタイミングは、必ず来る。オレが言うんだから間違いない。',
    '焦り？わかるわかる。でもな、花は引っ張っても早く咲かない。今は根を張る時期なんだ。地味だけど、一番大事な時期だぜ。',
  ],
  jealousy: [
    'おっと、嫉妬か。実はこれ、お前の「本当に欲しいもの」を教えてくれるコンパスなんだ。嫉妬した相手が持ってるもの、それがお前の進む方向だ。ありがたく受け取れよ。',
    'ヒヒヒ、人を羨んでるな？でもな、お前が羨むその人も、きっと誰かを羨んでる。みんな隣の芝生が青く見えるもんだ。お前の芝生も、誰かからは眩しいんだぜ。',
    '嫉妬を感じるってことは、お前にもそれを手に入れる可能性があるってことだ。不可能なことには嫉妬しないからな。その気持ち、エンジンに変えてやれ。',
  ],
  emptiness: [
    '虚しさか...。実はな、空っぽってのは「次に何を入れるか選べる」ってことなんだ。コップが満杯じゃ新しいものは入らないだろ？お前は今、可能性に満ちてるんだぜ。',
    'なーんにも感じない？それはお前の心が休息を求めてるサインだ。感情を使いすぎたんだよ。しばらくぼーっとしてていい。オレが許可する。',
    '虚しさの正体はな、「本当の自分で生きたい」って魂の叫びなんだ。何かを演じるのに疲れたんだろ？もっと素のお前でいていいんだぜ。',
  ],
};

const years = Array.from({ length: 131 }, (_, i) => ({ value: String(1900 + i), label: `${1900 + i}年` }));
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
          backgroundColor: 'rgba(255,255,255,0.08)',
          color: '#E5E7EB',
          border: '1px solid rgba(196,181,253,0.3)',
          borderRadius: 8,
          padding: '10px 8px',
          fontSize: 14,
          cursor: 'pointer',
          outline: 'none',
        } as any}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value} style={{ background: '#1D1B4B', color: '#E5E7EB' }}>
            {item.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <TouchableOpacity style={styles.nativePicker}>
      <Text style={styles.nativePickerText}>{value}</Text>
    </TouchableOpacity>
  );
}

function MandalaHeader() {
  return (
    <View style={styles.heroContainer}>
      <LinearGradient colors={['#000000', '#0a0618', '#0D0B1E']} style={styles.heroGradient}>
        <View style={styles.mandalaOuter}>
          <View style={styles.mandalaMiddle}>
            <View style={styles.mandalaInner}>
              <Text style={styles.mandalaEmoji}>👹</Text>
            </View>
          </View>
        </View>
        <Text style={styles.heroSubtitle}>あなたの心に潜むネガティブな感情を占う</Text>
        <Text style={styles.heroTitle}>ネガティブ神占い</Text>
      </LinearGradient>
    </View>
  );
}

export default function NegativeGodScreen() {
  const now = new Date();
  const [birthYear, setBirthYear] = useState('1990');
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');
  const [currentTime, setCurrentTime] = useState(now);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [resultEmotion, setResultEmotion] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleDivine = () => {
    const emotionType = selectedEmotion || calcEmotionType(
      parseInt(birthYear), parseInt(birthMonth), parseInt(birthDay), currentTime.getHours()
    );
    const messages = NEGATIVE_GOD_RESPONSES[emotionType];
    setResult(messages[Math.floor(Math.random() * messages.length)]);
    setResultEmotion(emotionType);
    setIsRevealing(true);
  };

  const handleRelease = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 1500, useNativeDriver: true }).start(() => setIsReleased(true));
  };

  const handleReset = () => {
    setSelectedEmotion(null); setResult(null); setIsRevealing(false);
    setIsReleased(false); fadeAnim.setValue(1);
  };

  if (isReleased) {
    return (
      <LinearGradient colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']} style={styles.container}>
        <View style={styles.releasedContainer}>
          <Text style={styles.releasedEmoji}>🌈</Text>
          <Text style={styles.releasedTitle}>手放し完了！</Text>
          <Text style={styles.releasedMessage}>
            あなたのネガティブな感情は宇宙へ還りました。{'\n'}心が少し軽くなったはず。{'\n'}今日もあなたらしく過ごしてね。
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>もう一度占う</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MandalaHeader />
        {!isRevealing ? (
          <>
            <View style={styles.formCard}>
              <Text style={styles.formSectionTitle}>生年月日：</Text>
              <View style={styles.birthdayRow}>
                <WebSelect value={birthYear} onChange={setBirthYear} items={years} />
                <View style={{ width: 8 }} />
                <WebSelect value={birthMonth} onChange={setBirthMonth} items={months} />
                <View style={{ width: 8 }} />
                <WebSelect value={birthDay} onChange={setBirthDay} items={days} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>現在時刻：</Text>
                <Text style={styles.timeValue}>
                  {currentTime.getHours()}時{String(currentTime.getMinutes()).padStart(2, '0')}分
                </Text>
              </View>
            </View>

            <View style={styles.emotionSection}>
              <Text style={styles.questionText}>今、どんな気持ち？</Text>
              <Text style={styles.questionSubText}>選ぶとより精度が高まります（任意）</Text>
              <View style={styles.emotionGrid}>
                {EMOTIONS.map((emotion) => (
                  <TouchableOpacity
                    key={emotion.id}
                    style={[styles.emotionButton, selectedEmotion === emotion.id && styles.emotionButtonSelected]}
                    onPress={() => setSelectedEmotion(selectedEmotion === emotion.id ? null : emotion.id)}
                  >
                    <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                    <Text style={[styles.emotionLabel, selectedEmotion === emotion.id && styles.emotionLabelSelected]}>
                      {emotion.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Animated.View style={[styles.divineButtonWrap, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity style={styles.divineButton} onPress={handleDivine}>
                <LinearGradient colors={['#7C3AED', '#4C1D95']} style={styles.divineButtonGradient}>
                  <Text style={styles.divineButtonText}>うらなう</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>
                この占いは、あなたの心に潜むネガティブな感情に気づき、その思いを心の中から出し抜くための占いです。
              </Text>
              <Text style={styles.descriptionText}>
                気持ちが落ち込んでいる時、心配ばかりしてしまう時、嫌な予感がする時、辛く悲しい時、物事が上手く運ばない時…など、マイナスな感情で元気が出ない時に占うと効果的です。
              </Text>
              <Text style={styles.descriptionTextWarning}>
                ただし、同じ時間に何度も繰り返し占うと、それに囚われ逆にマイナスな出来事を引き寄せてしまう恐れがあります。やりすぎには注意しましょう。
              </Text>
            </View>
          </>
        ) : (
          <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <View style={styles.resultCard}>
              <Text style={styles.resultGodEmoji}>😈</Text>
              <Text style={styles.resultIntro}>ネガティブ神からのお告げ</Text>
              {resultEmotion && (
                <View style={styles.emotionTag}>
                  <Text style={styles.emotionTagText}>
                    {EMOTIONS.find((e) => e.id === resultEmotion)?.emoji} {EMOTION_LABELS[resultEmotion]}
                  </Text>
                </View>
              )}
              <Text style={styles.resultMessage}>{result}</Text>
            </View>
            <TouchableOpacity style={styles.releaseButton} onPress={handleRelease}>
              <LinearGradient colors={['#E8C547', '#F59E0B']} style={styles.releaseButtonGradient}>
                <Text style={styles.releaseButtonText}>この感情を手放す ✨</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  heroContainer: { overflow: 'hidden' },
  heroGradient: { paddingVertical: 60, paddingHorizontal: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.4)' },
  mandalaOuter: { width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(139,92,246,0.08)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  mandalaMiddle: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(139,92,246,0.1)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.25)', alignItems: 'center', justifyContent: 'center' },
  mandalaInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(20,18,60,0.8)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.4)', alignItems: 'center', justifyContent: 'center' },
  mandalaEmoji: { fontSize: 32 },
  heroSubtitle: { fontSize: 13, color: 'rgba(196,181,253,0.7)', marginBottom: 10, letterSpacing: 1 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', letterSpacing: 3 },
  formCard: { margin: 20, marginBottom: 0, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(196,181,253,0.2)' },
  formSectionTitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 12 },
  birthdayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  nativePicker: { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: 'rgba(196,181,253,0.3)' },
  nativePickerText: { color: '#E5E7EB', fontSize: 14 },
  timeRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  timeLabel: { fontSize: 14, color: '#9CA3AF' },
  timeValue: { fontSize: 18, color: '#C4B5FD', fontWeight: 'bold', marginLeft: 4 },
  emotionSection: { margin: 20, marginBottom: 0 },
  questionText: { fontSize: 18, fontWeight: 'bold', color: '#E5E7EB', textAlign: 'center', marginBottom: 4 },
  questionSubText: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: 16 },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  emotionButton: { width: (width - 80) / 3, paddingVertical: 14, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  emotionButtonSelected: { borderColor: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.15)' },
  emotionEmoji: { fontSize: 26, marginBottom: 4 },
  emotionLabel: { fontSize: 12, color: '#9CA3AF' },
  emotionLabelSelected: { color: '#C4B5FD', fontWeight: 'bold' },
  divineButtonWrap: { margin: 20, marginTop: 24 },
  divineButton: { borderRadius: 16, overflow: 'hidden' },
  divineButtonGradient: { paddingVertical: 20, alignItems: 'center' },
  divineButtonText: { fontSize: 20, fontWeight: 'bold', color: '#fff', letterSpacing: 6 },
  descriptionCard: { margin: 20, marginTop: 4, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  descriptionText: { fontSize: 13, color: '#9CA3AF', lineHeight: 22, marginBottom: 14 },
  descriptionTextWarning: { fontSize: 13, color: '#F59E0B', lineHeight: 22 },
  resultContainer: { alignItems: 'center', padding: 20, paddingTop: 40 },
  resultCard: { backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: 20, padding: 24, width: '100%', borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)', marginBottom: 24 },
  resultGodEmoji: { fontSize: 40, textAlign: 'center', marginBottom: 12 },
  resultIntro: { fontSize: 14, color: '#A78BFA', textAlign: 'center', marginBottom: 12 },
  emotionTag: { alignSelf: 'center', backgroundColor: 'rgba(139,92,246,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 16 },
  emotionTagText: { fontSize: 14, color: '#C4B5FD' },
  resultMessage: { fontSize: 16, color: '#E5E7EB', lineHeight: 28 },
  releaseButton: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  releaseButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  releaseButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  releasedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, minHeight: 500 },
  releasedEmoji: { fontSize: 64, marginBottom: 16 },
  releasedTitle: { fontSize: 28, fontWeight: 'bold', color: '#E8C547', marginBottom: 16 },
  releasedMessage: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', lineHeight: 28, marginBottom: 32 },
  resetButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#6D28D9' },
  resetButtonText: { color: '#C4B5FD', fontSize: 14 },
});
