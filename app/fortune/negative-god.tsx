import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Animated, Dimensions, Platform, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ===== 数秘術ロジック（生年月日+時刻 → 神様番号1〜19） =====
function reduceToRange(n: number, max: number): number {
  let num = Math.abs(n);
  while (num > max) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b), 0);
    if (num > max) num = ((num - 1) % max) + 1;
  }
  return num || 1;
}

function calcGodNumber(year: number, month: number, day: number, hour: number): number {
  const sum = year + month + day + hour;
  return reduceToRange(sum, 19);
}

// ===== 本家むすび島オリジナルコンテンツ（全19体） =====
const NEGATIVE_GODS = [
  {
    num: 1,
    name: 'キョーフ',
    negDesc: '人間の意識の中に入り込み「恐怖の種」を植えつけて育てます。種が大きく成長するほど人間の恐怖におびえるようになり、やがて、あなたの心を支配していきます。',
    handle: '希望を持って行動をする時、ネガティブ神は人間に近づくことが出来ません。あなたの内なる神（むすび族）は太陽のエネルギーを使い、あなたを光で包み、「希望」を強く燃やすように働きかけています。目を瞑りその光景を強くイメージしてください。それによりあなたは、積極的な力がみなぎり自発的な行動を起せるようになります。希望の光で恐怖の種を焼き払い、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_01.jpg',
  },
  {
    num: 2,
    name: 'タイダー',
    negDesc: '考えること、行動することに対し「めんどくさい」と思うように思考を操作します。思考力、行動力を奪い、チャンスを逃がすように仕向けます。',
    handle: '他に影響されず、前向きな自分の考えでチャンスを手に入れようと行動するとき、ネガティブ神は手を出すことはできません。あなたの内なる神（むすび族）は、火と水のエネルギーを融合させ、生命に息吹を与え、聴覚や思考能力が活発になるよう働きかけています。前向きな思考を巡らせ、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_02.jpg',
  },
  {
    num: 3,
    name: 'ヒテー',
    negDesc: '「繰り返す思考は現実を引き寄せることができる」という大自然の法則を利用し、否定的な考えを繰り返す種を心に植え付け不幸におとしいれます。',
    handle: '明確な目標に向かって行動するとき、ネガティブ神は手を出すことはできません。あなたの内なる神（むすび族）は、水と火のエネルギーを使い、求心力、引き寄せる力を持つよう働きかけています。明確な目標をかかげ、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_03.jpg',
  },
  {
    num: 4,
    name: 'ウーン',
    negDesc: '「貧しさを恐れれば貧しさを引き寄せる」という大自然の法則を利用し、人間を不のリズムに同調させ、不幸におとしいれます。',
    handle: '豊かさに感謝し、与えることに喜びを感じるとき、ネガティブ神は近づくことができません。あなたの内なる神（むすび族）は豊かさのエネルギーを引き寄せるよう働きかけています。感謝の心で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_04.jpg',
  },
  {
    num: 5,
    name: 'ウラミー',
    negDesc: '憎しみを抱かせ、常に怒りの感情を起こさせ心を支配し、敵対関係に発展させ争わせるように仕向けます。',
    handle: '愛と許しの心を持つとき、ネガティブ神は力を失います。あなたの内なる神（むすび族）は愛のエネルギーで心を満たし、和解と調和をもたらすよう働きかけています。許しの力で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_05.jpg',
  },
  {
    num: 6,
    name: 'ムジヒ',
    negDesc: '助けが必要な人に背を向けるように仕向けます。残酷な自分を見せて魂をすくませ、身動きが取れないようにします。',
    handle: '思いやりを持って行動するとき、ネガティブ神は近づけません。あなたの内なる神（むすび族）は慈悲のエネルギーを与え、他者への共感と優しさが自然に湧き出るよう働きかけています。思いやりの心で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_06.jpg',
  },
  {
    num: 7,
    name: 'ゴーヨク',
    negDesc: '他人の立場を考えず、自分の利益だけを中心に考えさせ、その目的のために他人をコントロールする技を教えます。',
    handle: '与えることを喜びとするとき、ネガティブ神は力を失います。あなたの内なる神（むすび族）は、与え合う豊かさのエネルギーで心を満たすよう働きかけています。分かち合いの精神で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_07.jpg',
  },
  {
    num: 8,
    name: 'ガイ',
    negDesc: '好きなものを好きなだけ食べるよう物を与え続け、消化できない物を毒に変えていきます。そして、肉体的苦痛を与えながら判断力を奪っていきます。',
    handle: '節制と感謝の心を持つとき、ネガティブ神は手出しできません。あなたの内なる神（むすび族）は、体と心のバランスを整えるエネルギーを与えています。節度ある生活で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_08.jpg',
  },
  {
    num: 9,
    name: 'シット',
    negDesc: '愛するものに裏切られ失う幻覚を見せ、嫉妬や恨みを抱かせる罠を仕掛け、人々の調和を乱していきます。',
    handle: '自分の価値を信じ、他者の幸せを祝福できるとき、ネガティブ神は退散します。あなたの内なる神（むすび族）は、あなた固有の輝きを認識させ、自信と信頼のエネルギーを与えています。自己肯定の心で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_09.jpg',
  },
  {
    num: 10,
    name: 'キョエー',
    negDesc: 'いやしく下品な物の考え方を巡らせるように仕向け、うわべだけを飾る人間にし、心を腐らせていきます。',
    handle: '真の美しさと誠実さを大切にするとき、ネガティブ神は力を失います。あなたの内なる神（むすび族）は、本質的な美しさと品格を高めるエネルギーを与えています。誠実な心で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_10.jpg',
  },
  {
    num: 11,
    name: 'リコ',
    negDesc: '自分のためになることばかりを考えさせ、他者への配慮を失わせます。孤立した自己中心的な思考に閉じ込め、真の豊かさから遠ざけます。',
    handle: '他者への貢献に喜びを見出すとき、ネガティブ神は手を出せません。あなたの内なる神（むすび族）は、つながりと協調のエネルギーを与えています。利他の心で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_11.jpg',
  },
  {
    num: 12,
    name: 'ナマケ',
    negDesc: '現状に甘え、成長の機会を逃がすよう誘導します。「今のままでいい」という思考を植え付け、可能性の芽を摘んでいきます。',
    handle: '小さな一歩を踏み出す勇気を持つとき、ネガティブ神は退散します。あなたの内なる神（むすび族）は、成長と前進のエネルギーを与えています。挑戦の精神で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_12.jpg',
  },
  {
    num: 13,
    name: 'フアン',
    negDesc: '未来への不安を増幅させ、一歩踏み出すことを妨げます。想像の中で最悪の事態を描かせ、行動力を麻痺させます。',
    handle: '今この瞬間に集中し、現在の豊かさに感謝するとき、ネガティブ神は力を失います。あなたの内なる神（むすび族）は、安心と信頼のエネルギーを与えています。今ここに在る力で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_13.jpg',
  },
  {
    num: 14,
    name: 'ヒカク',
    negDesc: '他者と自分を比較させ、劣等感や優越感の罠に引き込みます。比較の苦しみの中で自己価値を見失わせます。',
    handle: '自分だけの固有の価値と歩みを信じるとき、ネガティブ神は近づけません。あなたの内なる神（むすび族）は、あなた唯一の輝きを引き出すエネルギーを与えています。自分らしさを大切に、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_14.jpg',
  },
  {
    num: 15,
    name: 'カコ',
    negDesc: '過去の失敗や後悔に囚われさせ、前に進む力を奪います。「あの時こうしていれば」という思考の繰り返しで現在を生きることを妨げます。',
    handle: '過去を学びとして受け入れ、今を生きることを選ぶとき、ネガティブ神は力を失います。あなたの内なる神（むすび族）は、解放と再生のエネルギーを与えています。今を生きる力で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_15.jpg',
  },
  {
    num: 16,
    name: 'ムキリョク',
    negDesc: '何もする気が起きない無力感を植え付け、生きる喜びを奪います。すべてが無意味に感じさせ、魂の輝きを曇らせます。',
    handle: '小さな喜びに気づき、感謝する心を取り戻すとき、ネガティブ神は退散します。あなたの内なる神（むすび族）は、生命力と情熱のエネルギーを与えています。生きる喜びを取り戻し、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_16.jpg',
  },
  {
    num: 17,
    name: 'ギセキ',
    negDesc: '自分を犠牲にすることが美徳だと信じ込ませ、自己を痛めつけるよう誘導します。自己否定の連鎖で魂を蝕んでいきます。',
    handle: '自分を大切にすることが、他者への真の貢献につながると気づくとき、ネガティブ神は力を失います。あなたの内なる神（むすび族）は、自己愛と自己尊重のエネルギーを与えています。自分を愛する力で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_17.jpg',
  },
  {
    num: 18,
    name: 'カンシン',
    negDesc: '他者の目を常に気にさせ、本来の自分を見失わせます。承認欲求の罠に引き込み、真の自己表現を封じ込めます。',
    handle: '自分の内なる声に従い、真実を生きることを選ぶとき、ネガティブ神は退散します。あなたの内なる神（むすび族）は、自己表現と解放のエネルギーを与えています。本来の自分で生きる力で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_18.jpg',
  },
  {
    num: 19,
    name: 'キョリョ',
    negDesc: '対立する考えを常に与え続け、人を受け入れる心を狭くし、最後に心を閉じさせ孤独にさせます。',
    handle: '違いを認め、多様性を受け入れるとき、ネガティブ神は力を失います。あなたの内なる神（むすび族）は、つながりと調和のエネルギーで心を広げるよう働きかけています。受容の心で、心に潜むネガティブ神を出し抜きましょう。',
    img: 'https://musubijima.com/wp-content/uploads/2021/05/musubi_negativ_19.jpg',
  },
];

// ===== セレクタコンポーネント（Web用） =====
const years = Array.from({ length: 111 }, (_, i) => ({ value: String(1920 + i), label: `${1920 + i}年` }));
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
      <Text style={styles.nativePickerText}>{value}</Text>
    </TouchableOpacity>
  );
}

// ===== メインコンポーネント =====
export default function NegativeGodScreen() {
  const now = new Date();
  const [birthYear, setBirthYear] = useState('1990');
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');
  const [currentTime, setCurrentTime] = useState(now);
  const [result, setResult] = useState<typeof NEGATIVE_GODS[0] | null>(null);
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
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleDivine = () => {
    const godNum = calcGodNumber(
      parseInt(birthYear), parseInt(birthMonth),
      parseInt(birthDay), currentTime.getHours()
    );
    const god = NEGATIVE_GODS.find(g => g.num === godNum) || NEGATIVE_GODS[0];
    setResult(god);
    setIsRevealing(true);
  };

  const handleRelease = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 1500, useNativeDriver: true }).start(() => setIsReleased(true));
  };

  const handleReset = () => {
    setResult(null); setIsRevealing(false); setIsReleased(false); fadeAnim.setValue(1);
  };

  // ===== 完了画面 =====
  if (isReleased) {
    return (
      <LinearGradient colors={['#0D0B1E', '#1D1B4B', '#0D0B1E']} style={styles.container}>
        <View style={styles.releasedContainer}>
          <Text style={styles.releasedEmoji}>🌈</Text>
          <Text style={styles.releasedTitle}>出し抜き完了！</Text>
          <Text style={styles.releasedMessage}>
            あなたの心に潜んでいたネガティブ神が出ていきました。{'\n'}
            むすび族があなたを光で包んでいます。{'\n'}
            今日もあなたらしく進んでいきましょう。
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>もう一度占う</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0D0B1E', '#1a0a2e', '#0D0B1E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ① ヘッダー（本家画像） */}
        <View style={styles.heroContainer}>
          {Platform.OS === 'web' ? (
            <img
              src="https://musubijima.com/wp-content/uploads/2021/02/musubi_negativ_head.png"
              alt="ネガティブ神占い"
              style={{ width: '100%', display: 'block' } as any}
            />
          ) : (
            <Image
              source={{ uri: 'https://musubijima.com/wp-content/uploads/2021/02/musubi_negativ_head.png' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          )}
        </View>

        {!isRevealing ? (
          <>
            {/* ② 入力フォーム（本家スタイル） */}
            <View style={styles.formCard}>
              <Text style={styles.formInstruction}>生年月日と現在の時刻をご入力ください。</Text>
              <Text style={styles.formLabel}>生年月日：</Text>
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

            {/* ③ うらなうボタン */}
            <Animated.View style={[styles.divineButtonWrap, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity style={styles.divineButton} onPress={handleDivine}>
                <LinearGradient colors={['#6B21A8', '#3B0764']} style={styles.divineButtonGradient}>
                  <Text style={styles.divineButtonText}>うらなう</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* ④ 説明テキスト（本家のまま） */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>
                この占いは、あなたの心に潜むネガティブな感情に気づき、その思いを心の中から出し抜くための占いです。
              </Text>
              <Text style={styles.descriptionText}>
                気持ちが落ち込んでいる時、心配ばかりしてしまう時、嫌な予感がする時、辛く悲しい時、物事が上手く運ばない時…など、マイナスな感情で元気が出ない時に占うと効果的です。
              </Text>
              <Text style={styles.descriptionWarning}>
                ただし、同じ時間に何度も繰り返し占うと、それに囚われ逆にマイナスな出来事を引き寄せてしまう恐れがあります。やりすぎには注意しましょう。
              </Text>
            </View>
          </>
        ) : (
          // ===== 結果表示 =====
          result && (
            <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
              {/* 神様画像 */}
              <View style={styles.godImageContainer}>
                {Platform.OS === 'web' ? (
                  <img
                    src={result.img}
                    alt={result.name}
                    style={{ width: 200, height: 280, objectFit: 'contain' } as any}
                  />
                ) : (
                  <Image source={{ uri: result.img }} style={styles.godImage} resizeMode="contain" />
                )}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultGodName}>【{result.name}/ネガティブ神】</Text>
                <Text style={styles.resultNegDesc}>{result.negDesc}</Text>

                <View style={styles.divider} />

                <Text style={styles.handleTitle}>【対処法】</Text>
                <Text style={styles.resultHandle}>{result.handle}</Text>
              </View>

              <TouchableOpacity style={styles.releaseButton} onPress={handleRelease}>
                <LinearGradient colors={['#7C3AED', '#4C1D95']} style={styles.releaseButtonGradient}>
                  <Text style={styles.releaseButtonText}>心に潜むネガティブ神を出し抜く ✨</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 80 },

  // ヘッダー
  heroContainer: { width: '100%', backgroundColor: '#000' },
  heroImage: { width: '100%', height: 300 },

  // フォーム
  formCard: {
    margin: 20, marginBottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: 'rgba(196,181,253,0.25)',
  },
  formInstruction: { fontSize: 15, color: '#E5E7EB', marginBottom: 16, lineHeight: 22 },
  formLabel: { fontSize: 13, color: '#9CA3AF', marginBottom: 10 },
  birthdayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  nativePicker: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8, padding: 10, borderWidth: 1, borderColor: 'rgba(196,181,253,0.3)',
  },
  nativePickerText: { color: '#E5E7EB', fontSize: 14 },
  timeRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  timeLabel: { fontSize: 14, color: '#9CA3AF' },
  timeValue: { fontSize: 18, color: '#C4B5FD', fontWeight: 'bold', marginLeft: 4 },

  // うらなうボタン
  divineButtonWrap: { margin: 20, marginTop: 24 },
  divineButton: { borderRadius: 16, overflow: 'hidden' },
  divineButtonGradient: { paddingVertical: 20, alignItems: 'center' },
  divineButtonText: { fontSize: 22, fontWeight: 'bold', color: '#fff', letterSpacing: 8 },

  // 説明
  descriptionCard: {
    margin: 20, marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  descriptionText: { fontSize: 13, color: '#9CA3AF', lineHeight: 22, marginBottom: 14 },
  descriptionWarning: { fontSize: 13, color: '#F59E0B', lineHeight: 22 },

  // 結果
  resultContainer: { alignItems: 'center', padding: 20, paddingTop: 32 },
  godImageContainer: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 20, elevation: 8,
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
  },
  godImage: { width: 200, height: 280 },
  resultCard: {
    backgroundColor: 'rgba(109,33,79,0.2)',
    borderRadius: 20, padding: 24, width: '100%',
    borderWidth: 1, borderColor: 'rgba(196,181,253,0.3)', marginBottom: 20,
  },
  resultGodName: { fontSize: 18, color: '#E9D5FF', fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  resultNegDesc: { fontSize: 15, color: '#E5E7EB', lineHeight: 26, marginBottom: 16 },
  divider: { height: 1, backgroundColor: 'rgba(196,181,253,0.3)', marginBottom: 16 },
  handleTitle: { fontSize: 15, color: '#C4B5FD', fontWeight: 'bold', marginBottom: 10 },
  resultHandle: { fontSize: 14, color: '#D1D5DB', lineHeight: 24 },

  releaseButton: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  releaseButtonGradient: { paddingVertical: 18, alignItems: 'center', paddingHorizontal: 20 },
  releaseButtonText: { fontSize: 15, fontWeight: 'bold', color: '#fff', textAlign: 'center' },

  // 完了画面
  releasedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, minHeight: 500 },
  releasedEmoji: { fontSize: 64, marginBottom: 16 },
  releasedTitle: { fontSize: 26, fontWeight: 'bold', color: '#E8C547', marginBottom: 16 },
  releasedMessage: { fontSize: 16, color: '#D1D5DB', textAlign: 'center', lineHeight: 28, marginBottom: 32 },
  resetButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#7C3AED' },
  resetButtonText: { color: '#C4B5FD', fontSize: 14 },
});
