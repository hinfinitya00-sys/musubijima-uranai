import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const EMOTIONS = [
  { id: 'anxiety', label: '不安', emoji: '😰' },
  { id: 'anger', label: '怒り', emoji: '😤' },
  { id: 'sadness', label: '悲しみ', emoji: '😢' },
  { id: 'impatience', label: '焦り', emoji: '😖' },
  { id: 'jealousy', label: '嫉妬', emoji: '😒' },
  { id: 'emptiness', label: '虚しさ', emoji: '😶' },
];

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

export default function NegativeGodScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleDivine = () => {
    if (!selectedEmotion) return;

    setIsRevealing(true);
    const messages = NEGATIVE_GOD_RESPONSES[selectedEmotion];
    const message = messages[Math.floor(Math.random() * messages.length)];
    setResult(message);
  };

  const handleRelease = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setIsReleased(true);
    });
  };

  const handleReset = () => {
    setSelectedEmotion(null);
    setResult(null);
    setIsRevealing(false);
    setIsReleased(false);
    fadeAnim.setValue(1);
  };

  if (isReleased) {
    return (
      <LinearGradient colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']} style={styles.container}>
        <View style={styles.releasedContainer}>
          <Text style={styles.releasedEmoji}>🌈</Text>
          <Text style={styles.releasedTitle}>手放し完了！</Text>
          <Text style={styles.releasedMessage}>
            あなたのネガティブな感情は宇宙へ還りました。{'\n'}
            心が少し軽くなったはず。{'\n'}
            今日もあなたらしく過ごしてね。
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
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>👹</Text>
          <Text style={styles.title}>ネガティブ神占い</Text>
          <Text style={styles.subtitle}>
            ネガティブな感情を認めて、手放す。{'\n'}
            むすび島のネガティブ神があなたの闇を受け止めます。
          </Text>
        </View>

        {!isRevealing ? (
          <>
            {/* 感情選択 */}
            <Text style={styles.questionText}>今、どんな気持ち？</Text>
            <View style={styles.emotionGrid}>
              {EMOTIONS.map((emotion) => (
                <TouchableOpacity
                  key={emotion.id}
                  style={[
                    styles.emotionButton,
                    selectedEmotion === emotion.id && styles.emotionButtonSelected,
                  ]}
                  onPress={() => setSelectedEmotion(emotion.id)}
                >
                  <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                  <Text style={[
                    styles.emotionLabel,
                    selectedEmotion === emotion.id && styles.emotionLabelSelected,
                  ]}>
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 占うボタン */}
            <TouchableOpacity
              style={[styles.divineButton, !selectedEmotion && styles.divineButtonDisabled]}
              onPress={handleDivine}
              disabled={!selectedEmotion}
            >
              <LinearGradient
                colors={selectedEmotion ? ['#8B5CF6', '#6D28D9'] : ['#374151', '#1F2937']}
                style={styles.divineButtonGradient}
              >
                <Text style={styles.divineButtonText}>
                  ネガティブ神に占ってもらう 👹
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          /* 結果表示 */
          <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <View style={styles.resultCard}>
              <Text style={styles.resultGodEmoji}>😈</Text>
              <Text style={styles.resultIntro}>
                ネガティブ神からのお告げ
              </Text>
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
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#C4B5FD', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  questionText: { fontSize: 18, fontWeight: 'bold', color: '#E5E7EB', textAlign: 'center', marginBottom: 16 },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  emotionButton: {
    width: (width - 80) / 3,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emotionButtonSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139,92,246,0.15)',
  },
  emotionEmoji: { fontSize: 28, marginBottom: 6 },
  emotionLabel: { fontSize: 13, color: '#9CA3AF' },
  emotionLabelSelected: { color: '#C4B5FD', fontWeight: 'bold' },
  divineButton: { borderRadius: 16, overflow: 'hidden' },
  divineButtonDisabled: { opacity: 0.5 },
  divineButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  divineButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  resultContainer: { alignItems: 'center' },
  resultCard: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    marginBottom: 24,
  },
  resultGodEmoji: { fontSize: 40, textAlign: 'center', marginBottom: 12 },
  resultIntro: { fontSize: 14, color: '#A78BFA', textAlign: 'center', marginBottom: 16 },
  resultMessage: { fontSize: 16, color: '#E5E7EB', lineHeight: 28 },
  releaseButton: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  releaseButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  releaseButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  releasedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  releasedEmoji: { fontSize: 64, marginBottom: 16 },
  releasedTitle: { fontSize: 28, fontWeight: 'bold', color: '#E8C547', marginBottom: 16 },
  releasedMessage: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', lineHeight: 28, marginBottom: 32 },
  resetButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6D28D9',
  },
  resetButtonText: { color: '#C4B5FD', fontSize: 14 },
});
