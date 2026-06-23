import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  TextInput,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { usePlanGate } from "@/hooks/usePlanGate";
import { TrialBanner } from "@/components/TrialBanner";

function useFloatAnim(duration: number, delay: number = 0) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: -7, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return anim;
}

function usePulseAnim(duration: number, delay: number = 0) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 0.9, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: duration / 2, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return anim;
}

function useSpinAnim(duration: number, reverse: boolean = false) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? ['0deg', '-360deg'] : ['0deg', '360deg'],
  });
  return rotate;
}

export default function HomeScreen() {
  const { state } = useApp();
  const { canUse, isFree } = usePlanGate();
  const { subscription, isLoading } = state;

  const float1 = useFloatAnim(3200, 0);
  const float2 = useFloatAnim(3800, 400);
  const float3 = useFloatAnim(4000, 200);

  const pulse1 = usePulseAnim(3000, 0);

  const spin1 = useSpinAnim(26000, false);
  const spin2 = useSpinAnim(34000, true);

  const sparkle1 = usePulseAnim(2000, 0);
  const sparkle2 = usePulseAnim(2500, 500);
  const sparkle3 = usePulseAnim(2000, 1000);
  const sparkle4 = usePulseAnim(2500, 1500);

  // 結び族セクションの生年月日フォーム（鑑定本体はmusubian側で再取得）
  const [bYear, setBYear] = useState('');
  const [bMonth, setBMonth] = useState('');
  const [bDay, setBDay] = useState('');

  // 今年の運勢（life-rhythm）セクションの生年月日フォーム
  const [lrYear, setLrYear] = useState('');
  const [lrMonth, setLrMonth] = useState('');
  const [lrDay, setLrDay] = useState('');

  const goMusubian = () => {
    if (!canUse.musubian) { router.push('/subscription/plans' as never); return; }
    router.push({ pathname: '/fortune/musubian', params: { year: bYear, month: bMonth, day: bDay } } as never);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[today.getDay()];

  const winW = Math.min(Dimensions.get('window').width || 375, 600);
  const hisaeW = winW * 0.55;
  const hisaeH = hisaeW * 1.4;
  const ringSize = hisaeW * 1.02;

  return (
    <ImageBackground
      source={require('../../assets/site/shima.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.12, resizeMode: 'cover' }}
    >
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {/* ① ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.logoText}>結び島 占い</Text>
              <Text style={styles.logoSubtext}>MUSUBIJIMA</Text>
              <Text style={styles.dateText}>{todayStr}（{weekday}）</Text>
              <Text style={styles.catchName}>占いカウンセラー　其田寿枝</Text>
              <Text style={styles.catchText}>あなたの「今」と「これから」をやさしく読み解く占いサイト</Text>
            </View>

            <TrialBanner />

            {/* ② ひさえと龍イラスト＋バブルメニュー */}
            <View style={[styles.hisaeZone, { height: hisaeH + 24 }]}>
              <Animated.View
                style={[
                  styles.hisaeRing,
                  { width: ringSize, height: ringSize, borderRadius: ringSize / 2, marginLeft: -ringSize / 2, marginTop: -ringSize / 2, transform: [{ rotate: spin1 }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.hisaeRing2,
                  { width: ringSize * 0.86, height: ringSize * 0.86, borderRadius: (ringSize * 0.86) / 2, marginLeft: -(ringSize * 0.86) / 2, marginTop: -(ringSize * 0.86) / 2, opacity: pulse1, transform: [{ rotate: spin2 }] },
                ]}
              />
              <Image
                source={require('../../assets/site/hisae.png')}
                style={{ width: hisaeW, height: hisaeH }}
                resizeMode="contain"
              />

              <Animated.View style={[styles.sparkleGold, { top: '4%', left: '50%', marginLeft: -4, opacity: sparkle1 }]} />
              <Animated.View style={[styles.sparklePink, { bottom: '6%', left: '46%', opacity: sparkle2 }]} />
              <Animated.View style={[styles.sparklePink, { top: '46%', left: '8%', opacity: sparkle3 }]} />
              <Animated.View style={[styles.sparkleGold, { top: '40%', right: '8%', opacity: sparkle4 }]} />

              <Animated.View style={[styles.bubble, styles.bubbleTL, { transform: [{ translateY: float1 }] }]}>
                <Text style={styles.bubbleText}>なぜ同じ悩みを{'\n'}繰り返す？</Text>
              </Animated.View>
              <Animated.View style={[styles.bubble, styles.bubbleTR, { transform: [{ translateY: float2 }] }]}>
                <Text style={styles.bubbleText}>未来へのヒント{'\n'}生まれ持った力を知る</Text>
              </Animated.View>
              <Animated.View style={[styles.bubble, styles.bubbleBR, { transform: [{ translateY: float3 }] }]}>
                <Text style={styles.bubbleText}>今は進む時？{'\n'}整える時？</Text>
              </Animated.View>
            </View>
            <Text style={styles.hisaeCaption}>5つの占いで今の流れ・性質・未来のヒントを受け取れます。</Text>

            {/* ③ 導カードセクション */}
            <View style={styles.section}>
              <Image source={require('../../assets/site/logo-shirube.jpg')} style={styles.sectionLogo} resizeMode="contain" />
              <Text style={styles.titleGold}>導カード</Text>
              <Text style={styles.roman}>shirube card</Text>
              <Text style={styles.sectionDesc}>今日の意気や心の流れ、気を付けたいこと、心が軽くなるアドバイスが受け取れます。</Text>
              <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={() => router.push('/fortune/omikuji' as never)}>
                <Text style={styles.pinkButtonText}>無料で引く</Text>
              </TouchableOpacity>
            </View>

            {/* ④ 結び族セクション */}
            <View style={styles.section}>
              <Image source={require('../../assets/site/logo-musubizoku.jpg')} style={styles.sectionLogo} resizeMode="contain" />
              <Text style={styles.titlePink}>結び族</Text>
              <Text style={styles.subPink}>生まれ持った性質と才能を知る</Text>
              <Text style={styles.sectionDesc}>生まれ持った性質や本質・性格の特徴、強味・才能 得意なことなど向いている生き方のヒントが分かります。</Text>
              <View style={styles.birthRow}>
                <TextInput style={styles.birthInput} value={bYear} onChangeText={setBYear} placeholder="年" placeholderTextColor="#D6A9B2" keyboardType="number-pad" maxLength={4} />
                <Text style={styles.birthSep}>年</Text>
                <TextInput style={styles.birthInputSm} value={bMonth} onChangeText={setBMonth} placeholder="月" placeholderTextColor="#D6A9B2" keyboardType="number-pad" maxLength={2} />
                <Text style={styles.birthSep}>月</Text>
                <TextInput style={styles.birthInputSm} value={bDay} onChangeText={setBDay} placeholder="日" placeholderTextColor="#D6A9B2" keyboardType="number-pad" maxLength={2} />
                <Text style={styles.birthSep}>日</Text>
              </View>
              <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={goMusubian}>
                <Text style={styles.pinkButtonText}>鑑定する{!canUse.musubian ? '　🔒' : ''}</Text>
              </TouchableOpacity>
            </View>

            {/* ⑤ み・たまカードセクション */}
            <View style={styles.section}>
              <Image source={require('../../assets/site/logo-mitama.jpg')} style={styles.logoMitama} resizeMode="contain" />
              <Text style={styles.mitamaHeading}>なぜ同じ悩みを繰り返す？</Text>
              <Text style={styles.sectionDesc}>心の奥にある想いやブロックに気づき、次の一歩のヒントが分かります。</Text>
              <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={() => router.push('/fortune/mitama' as never)}>
                <Text style={styles.pinkButtonText}>無料で引く</Text>
              </TouchableOpacity>
            </View>

            {/* ⑥ 今年の運勢セクション */}
            <ImageBackground
              source={require('../../assets/site/frame-pink.png')}
              style={styles.frameSection}
              imageStyle={{ resizeMode: 'stretch', borderRadius: 20 }}
            >
              <View style={styles.frameInner}>
                <Text style={styles.frameTitle}>今年の運勢</Text>
                <Text style={styles.frameSub}>今は進む時？{'\n'}整える時？</Text>
                <Text style={styles.frameDesc}>1年の流れや、行動のタイミングが分かります。{'\n'}*やるべきこと、さけるべきことを見極める*</Text>
                <View style={styles.birthRow}>
                  <TextInput style={styles.birthInput} value={lrYear} onChangeText={setLrYear} placeholder="年" placeholderTextColor="#D6A9B2" keyboardType="number-pad" maxLength={4} />
                  <Text style={styles.birthSep}>年</Text>
                  <TextInput style={styles.birthInputSm} value={lrMonth} onChangeText={setLrMonth} placeholder="月" placeholderTextColor="#D6A9B2" keyboardType="number-pad" maxLength={2} />
                  <Text style={styles.birthSep}>月</Text>
                  <TextInput style={styles.birthInputSm} value={lrDay} onChangeText={setLrDay} placeholder="日" placeholderTextColor="#D6A9B2" keyboardType="number-pad" maxLength={2} />
                  <Text style={styles.birthSep}>日</Text>
                </View>
                <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={() => router.push({ pathname: '/fortune/life-rhythm', params: { year: lrYear, month: lrMonth, day: lrDay } } as never)}>
                  <Text style={styles.pinkButtonText}>運勢を占う</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>

            {/* ⑦ ネガティブ神セクション */}
            <View style={styles.section}>
              <Image source={require('../../assets/site/logo-negative.jpg')} style={styles.sectionLogo} resizeMode="contain" />
              <Text style={styles.negDesc}>心の影やブロックを見つめ、手放し、新しい自分へ{'\n'}生まれ変わるサポートをいたします。</Text>
              <TouchableOpacity
                style={styles.pinkButton}
                activeOpacity={0.9}
                onPress={() => { if (!canUse.negativeGod) { router.push('/subscription/plans' as never); return; } router.push('/fortune/negative-god' as never); }}
              >
                <Text style={styles.pinkButtonText}>影を知り光へ変える{isFree && !canUse.negativeGod ? '　🔒' : ''}</Text>
              </TouchableOpacity>
            </View>

            {/* ⑧ CTAバナー（未課金時のみ） */}
            {!subscription.isSubscribed && (
              <TouchableOpacity
                style={styles.ctaSection}
                onPress={() => router.push("/subscription/plans" as never)}
                activeOpacity={0.9}
              >
                <LinearGradient colors={['#E8758A', '#C45070']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
                  <Text style={styles.ctaTitle}>月額330円で全機能解放</Text>
                  <Text style={styles.ctaSubtitle}>7日間無料トライアル実施中</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

          </View>
        </ScrollView>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFAF9' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFAF9' },
  loadingText: { fontSize: 18, color: '#E8758A', fontWeight: '700' },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },

  // ① ヘッダー
  header: { alignItems: 'center', marginBottom: 12, paddingTop: 8 },
  logoText: { fontSize: 32, fontWeight: '800', color: '#E8758A', letterSpacing: 4 },
  logoSubtext: { fontSize: 10, color: '#C9A84C', letterSpacing: 8, marginTop: 4 },
  dateText: { fontSize: 12, color: '#B08A8F', marginTop: 8 },
  catchName: { fontSize: 13, fontWeight: '700', color: '#3D1A1A', marginTop: 10 },
  catchText: { fontSize: 11, color: '#6E4A4A', marginTop: 4, textAlign: 'center', lineHeight: 18 },

  // ② ひさえゾーン
  hisaeZone: { width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: 8 },
  hisaeRing: {
    position: 'absolute', top: '50%', left: '50%',
    borderWidth: 1.5, borderColor: 'rgba(232,117,138,0.35)', borderStyle: 'dashed',
  } as any,
  hisaeRing2: {
    position: 'absolute', top: '50%', left: '50%',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', borderStyle: 'dashed',
  } as any,
  sparkleGold: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#C9A84C' },
  sparklePink: { position: 'absolute', width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#E8758A' },

  bubble: {
    position: 'absolute',
    backgroundColor: '#F9C0CC',
    borderRadius: 60,
    paddingVertical: 12,
    paddingHorizontal: 14,
    maxWidth: 140,
    shadowColor: '#E8758A',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bubbleTL: { top: '6%', left: -2 },
  bubbleTR: { top: 0, right: -2 },
  bubbleBR: { bottom: '8%', right: 2 },
  bubbleText: { color: '#C45070', fontSize: 12, fontWeight: '700', textAlign: 'center', lineHeight: 17 },
  hisaeCaption: { fontSize: 12, color: '#6E4A4A', textAlign: 'center', marginTop: 4, marginBottom: 20, lineHeight: 18 },

  // 共通セクション
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F6D7DE',
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#E8758A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionLogo: { width: '100%', height: 150, marginBottom: 10 },
  titleGold: { fontSize: 26, fontWeight: '800', color: '#C9A84C', letterSpacing: 2 },
  titlePink: { fontSize: 26, fontWeight: '800', color: '#E8758A', letterSpacing: 2 },
  roman: { fontSize: 11, color: '#A89A8A', letterSpacing: 2, marginTop: 2 },
  subPink: { fontSize: 14, fontWeight: '700', color: '#3D1A1A', marginTop: 4 },
  sectionDesc: { fontSize: 13, color: '#6E4A4A', lineHeight: 21, textAlign: 'center', marginTop: 10 },

  // ⑤ み・たまカード
  logoMitama: { width: '100%', height: 120, marginBottom: 10 },
  mitamaHeading: { fontSize: 18, fontWeight: '800', color: '#E8758A', textAlign: 'center' },

  // ⑥ 今年の運勢（フレーム）
  frameSection: { marginBottom: 16, borderRadius: 20, overflow: 'hidden' },
  frameInner: { padding: 24, alignItems: 'center' },
  frameTitle: { fontSize: 28, fontWeight: '900', color: '#C45070', letterSpacing: 2 },
  frameSub: { fontSize: 16, color: '#E8758A', textAlign: 'center', marginTop: 4, lineHeight: 24 },
  frameDesc: { fontSize: 13, color: '#3D1A1A', textAlign: 'center', marginTop: 10, lineHeight: 20 },

  // ⑦ ネガティブ神
  negDesc: { fontSize: 13, color: '#3D1A1A', lineHeight: 21, textAlign: 'center', marginTop: 10 },

  pinkButton: {
    backgroundColor: '#E8758A',
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 44,
    marginTop: 16,
    shadowColor: '#C45070',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pinkButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 1 },

  // 生年月日フォーム
  birthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  birthInput: {
    width: 72, borderWidth: 1, borderColor: '#F0C4CC', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 8, fontSize: 15, color: '#3D1A1A',
    textAlign: 'center', backgroundColor: '#FFF5F0',
  },
  birthInputSm: {
    width: 52, borderWidth: 1, borderColor: '#F0C4CC', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 8, fontSize: 15, color: '#3D1A1A',
    textAlign: 'center', backgroundColor: '#FFF5F0',
  },
  birthSep: { fontSize: 13, color: '#6E4A4A', marginHorizontal: 5 },

  // ⑤ 3占いアイコン
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  miniCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F6D7DE',
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#E8758A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  miniLogoWrap: { position: 'relative' },
  lockedWrap: { opacity: 0.5 },
  miniLogo: { width: 60, height: 60, borderRadius: 12 },
  miniEmojiWrap: {
    width: 60, height: 60, borderRadius: 12, backgroundColor: '#EAF3EC',
    alignItems: 'center', justifyContent: 'center',
  },
  miniEmoji: { fontSize: 30 },
  lockBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#FFF5F0', borderRadius: 9, width: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  lockText: { fontSize: 10 },
  miniLabel: { fontSize: 11, fontWeight: '700', color: '#3D1A1A', textAlign: 'center', marginTop: 8 },

  // ⑥ CTA
  ctaSection: { borderRadius: 16, overflow: 'hidden', shadowColor: '#C45070', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  ctaGradient: {
    paddingVertical: 16, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ctaTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  ctaSubtitle: { fontSize: 11, color: '#FFF0D8', marginTop: 2 },
});
