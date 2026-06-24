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
import { Colors } from "@/constants/Colors";
import { Typography, Fonts } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { MizuhikiKnot } from "@/components/MizuhikiKnot";
import { MizuhikiDivider } from "@/components/MizuhikiDivider";
import { Reveal } from "@/components/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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

export default function HomeScreen() {
  const { state } = useApp();
  const { canUse, isFree } = usePlanGate();
  const { subscription, isLoading } = state;

  // 常時ループは静かに：吹き出しの浮遊を1つ、スパークル2つ、リングの脈動のみ
  const float1 = useFloatAnim(3200, 0);
  const pulse1 = usePulseAnim(3000, 0);
  const sparkle1 = usePulseAnim(2000, 0);
  const sparkle2 = usePulseAnim(2500, 500);

  // 視差効果オフ設定の尊重
  const reduced = useReducedMotion();

  // スクロールリビール用の共有スクロール量
  const scrollY = useRef(new Animated.Value(0)).current;
  const winH = Dimensions.get('window').height || 800;

  // ヒーロー入場シーケンス：ブランド名 → 水引が結ばれる → サブ情報
  const heroBrand = useRef(new Animated.Value(0)).current;
  const knotProgress = useRef(new Animated.Value(0)).current;
  const heroSub = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) {
      heroBrand.setValue(1);
      knotProgress.setValue(1);
      heroSub.setValue(1);
      return;
    }
    heroBrand.setValue(0);
    knotProgress.setValue(0);
    heroSub.setValue(0);
    Animated.sequence([
      Animated.timing(heroBrand, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(knotProgress, { toValue: 1, duration: 900, useNativeDriver: false }),
      Animated.timing(heroSub, { toValue: 1, duration: 500, useNativeDriver: false }),
    ]).start();
  }, [reduced]);

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
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        >
          <View style={styles.content}>

            {/* ① ヘッダー（結ばれる演出） */}
            <View style={styles.header}>
              <Animated.View
                style={{
                  alignItems: 'center',
                  opacity: heroBrand,
                  transform: [{ translateY: heroBrand.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
                }}
              >
                <Text style={styles.logoText}>むすび島</Text>
              </Animated.View>

              <View style={styles.knotWrap}>
                <MizuhikiKnot size={148} progress={knotProgress} />
              </View>

              <Animated.View style={{ alignItems: 'center', opacity: heroSub }}>
                <Text style={styles.logoSubtext}>MUSUBIJIMA</Text>
                <Text style={styles.dateText}>{todayStr}（{weekday}）</Text>
                <Text style={styles.catchName}>占いカウンセラー　其田寿枝</Text>
                <Text style={styles.catchText}>あなたの「今」と「これから」をやさしく読み解く占いサイト</Text>
              </Animated.View>
            </View>

            <TrialBanner />

            {/* ② ひさえと龍イラスト＋バブルメニュー */}
            <View style={[styles.hisaeZone, { height: hisaeH + Spacing.lg }]}>
              <View
                style={[
                  styles.hisaeRing,
                  { width: ringSize, height: ringSize, borderRadius: ringSize / 2, marginLeft: -ringSize / 2, marginTop: -ringSize / 2 },
                ]}
              />
              <Animated.View
                style={[
                  styles.hisaeRing2,
                  { width: ringSize * 0.86, height: ringSize * 0.86, borderRadius: (ringSize * 0.86) / 2, marginLeft: -(ringSize * 0.86) / 2, marginTop: -(ringSize * 0.86) / 2, opacity: pulse1 },
                ]}
              />
              <Image
                source={require('../../assets/site/hisae.png')}
                style={{ width: hisaeW, height: hisaeH }}
                resizeMode="contain"
              />

              <Animated.View style={[styles.sparkleGold, { top: '4%', left: '50%', marginLeft: -4, opacity: sparkle1 }]} />
              <Animated.View style={[styles.sparklePink, { bottom: '6%', left: '46%', opacity: sparkle2 }]} />

              <Animated.View style={[styles.bubble, styles.bubbleTL, { transform: [{ translateY: float1 }] }]}>
                <Text style={styles.bubbleText}>なぜ同じ悩みを{'\n'}繰り返す？</Text>
              </Animated.View>
              <View style={[styles.bubble, styles.bubbleTR]}>
                <Text style={styles.bubbleText}>未来へのヒント{'\n'}生まれ持った力を知る</Text>
              </View>
              <View style={[styles.bubble, styles.bubbleBR]}>
                <Text style={styles.bubbleText}>今は進む時？{'\n'}整える時？</Text>
              </View>
            </View>
            <Text style={styles.hisaeCaption}>5つの占いで今の流れ・性質・未来のヒントを受け取れます。</Text>

            {/* ③ 導カードセクション */}
            <MizuhikiDivider color={Colors.accent} />
            <Reveal scrollY={scrollY} viewportH={winH} reduced={reduced} style={styles.section}>
              <Image source={require('../../assets/site/logo-shirube.jpg')} style={styles.sectionLogo} resizeMode="contain" />
              <Text style={styles.titleGold}>導カード</Text>
              <Text style={styles.roman}>SHIRUBE CARD</Text>
              <Text style={styles.sectionDesc}>今日の意気や心の流れ、気を付けたいこと、心が軽くなるアドバイスが受け取れます。</Text>
              <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={() => router.push('/fortune/omikuji' as never)}>
                <Text style={styles.pinkButtonText}>無料で引く</Text>
              </TouchableOpacity>
            </Reveal>

            {/* ④ 結び族セクション */}
            <MizuhikiDivider color={Colors.primary} />
            <Reveal scrollY={scrollY} viewportH={winH} reduced={reduced} style={styles.section}>
              <Image source={require('../../assets/site/logo-musubizoku.jpg')} style={styles.sectionLogo} resizeMode="contain" />
              <Text style={styles.titlePink}>結び族</Text>
              <Text style={styles.subPink}>生まれ持った性質と才能を知る</Text>
              <Text style={styles.sectionDesc}>生まれ持った性質や本質・性格の特徴、強味・才能 得意なことなど向いている生き方のヒントが分かります。</Text>
              <View style={styles.birthRow}>
                <TextInput style={styles.birthInput} value={bYear} onChangeText={setBYear} placeholder="年" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={4} />
                <Text style={styles.birthSep}>年</Text>
                <TextInput style={styles.birthInputSm} value={bMonth} onChangeText={setBMonth} placeholder="月" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={2} />
                <Text style={styles.birthSep}>月</Text>
                <TextInput style={styles.birthInputSm} value={bDay} onChangeText={setBDay} placeholder="日" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={2} />
                <Text style={styles.birthSep}>日</Text>
              </View>
              <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={goMusubian}>
                <Text style={styles.pinkButtonText}>鑑定する{!canUse.musubian ? '　🔒' : ''}</Text>
              </TouchableOpacity>
            </Reveal>

            {/* ⑤ み・たまカードセクション */}
            <MizuhikiDivider color={Colors.primaryDark} />
            <Reveal scrollY={scrollY} viewportH={winH} reduced={reduced} style={styles.section}>
              <Image source={require('../../assets/site/logo-mitama.jpg')} style={styles.logoMitama} resizeMode="contain" />
              <Text style={styles.mitamaHeading}>なぜ同じ悩みを繰り返す？</Text>
              <Text style={styles.sectionDesc}>心の奥にある想いやブロックに気づき、次の一歩のヒントが分かります。</Text>
              <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={() => router.push('/fortune/mitama' as never)}>
                <Text style={styles.pinkButtonText}>無料で引く</Text>
              </TouchableOpacity>
            </Reveal>

            {/* ⑥ 今年の運勢セクション */}
            <MizuhikiDivider color={Colors.primary} />
            <Reveal scrollY={scrollY} viewportH={winH} reduced={reduced}>
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
                  <TextInput style={styles.birthInput} value={lrYear} onChangeText={setLrYear} placeholder="年" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={4} />
                  <Text style={styles.birthSep}>年</Text>
                  <TextInput style={styles.birthInputSm} value={lrMonth} onChangeText={setLrMonth} placeholder="月" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={2} />
                  <Text style={styles.birthSep}>月</Text>
                  <TextInput style={styles.birthInputSm} value={lrDay} onChangeText={setLrDay} placeholder="日" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={2} />
                  <Text style={styles.birthSep}>日</Text>
                </View>
                <TouchableOpacity style={styles.pinkButton} activeOpacity={0.9} onPress={() => router.push({ pathname: '/fortune/life-rhythm', params: { year: lrYear, month: lrMonth, day: lrDay } } as never)}>
                  <Text style={styles.pinkButtonText}>運勢を占う</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
            </Reveal>

            {/* ⑦ ネガティブ神セクション */}
            <MizuhikiDivider color={Colors.primaryDark} />
            <Reveal scrollY={scrollY} viewportH={winH} reduced={reduced} style={styles.section}>
              <Image source={require('../../assets/site/logo-negative.jpg')} style={styles.sectionLogo} resizeMode="contain" />
              <Text style={styles.negDesc}>心の影やブロックを見つめ、手放し、新しい自分へ{'\n'}生まれ変わるサポートをいたします。</Text>
              <TouchableOpacity
                style={styles.pinkButton}
                activeOpacity={0.9}
                onPress={() => { if (!canUse.negativeGod) { router.push('/subscription/plans' as never); return; } router.push('/fortune/negative-god' as never); }}
              >
                <Text style={styles.pinkButtonText}>影を知り光へ変える{isFree && !canUse.negativeGod ? '　🔒' : ''}</Text>
              </TouchableOpacity>
            </Reveal>

            {/* ⑧ CTAバナー（未課金時のみ） */}
            {!subscription.isSubscribed && (
              <>
                <MizuhikiDivider color={Colors.primary} />
                <Reveal scrollY={scrollY} viewportH={winH} reduced={reduced}>
                  <TouchableOpacity
                    style={styles.ctaSection}
                    onPress={() => router.push("/subscription/plans" as never)}
                    activeOpacity={0.9}
                  >
                    <LinearGradient colors={[Colors.primary, Colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
                      <Text style={styles.ctaTitle}>月額330円で全機能解放</Text>
                      <Text style={styles.ctaSubtitle}>7日間無料トライアル実施中</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Reveal>
              </>
            )}

          </View>
        </Animated.ScrollView>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
  loadingText: { ...Typography.h3, color: Colors.primary },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.section },

  // ① ヘッダー
  header: { alignItems: 'center', marginBottom: Spacing.lg, paddingTop: Spacing.sm },
  knotWrap: { alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xs },
  logoText: { ...Typography.brand, color: Colors.primary },
  logoSubtext: { ...Typography.brandSub, color: Colors.accent, marginTop: Spacing.xs },
  dateText: { ...Typography.caption, color: Colors.muted, marginTop: Spacing.sm },
  catchName: { ...Typography.label, color: Colors.ink, marginTop: Spacing.sm },
  catchText: { ...Typography.caption, color: Colors.muted, marginTop: Spacing.xs, textAlign: 'center' },

  // ② ひさえゾーン
  hisaeZone: { width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: Spacing.sm },
  hisaeRing: {
    position: 'absolute', top: '50%', left: '50%',
    borderWidth: 1.5, borderColor: 'rgba(232,117,138,0.30)', borderStyle: 'dashed',
  } as any,
  hisaeRing2: {
    position: 'absolute', top: '50%', left: '50%',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.35)', borderStyle: 'dashed',
  } as any,
  sparkleGold: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  sparklePink: { position: 'absolute', width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.primary },

  bubble: {
    position: 'absolute',
    backgroundColor: Colors.primaryLight,
    borderRadius: 60,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    maxWidth: 140,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bubbleTL: { top: '6%', left: -2 },
  bubbleTR: { top: 0, right: -2 },
  bubbleBR: { bottom: '8%', right: 2 },
  bubbleText: { ...Typography.caption, color: Colors.primaryDark, textAlign: 'center' },
  hisaeCaption: { ...Typography.caption, color: Colors.muted, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },

  // 共通セクション
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionLogo: { width: '100%', height: 150, marginBottom: Spacing.sm },
  titleGold: { ...Typography.h1, color: Colors.accent },
  titlePink: { ...Typography.h1, color: Colors.primary },
  roman: { ...Typography.caption, color: Colors.muted, letterSpacing: 2, marginTop: Spacing.xs },
  subPink: { ...Typography.label, color: Colors.ink, marginTop: Spacing.xs },
  sectionDesc: { ...Typography.body, color: Colors.muted, textAlign: 'center', marginTop: Spacing.sm },

  // ⑤ み・たまカード
  logoMitama: { width: '100%', height: 120, marginBottom: Spacing.sm },
  mitamaHeading: { ...Typography.h3, color: Colors.primary, textAlign: 'center' },

  // ⑥ 今年の運勢（フレーム）
  frameSection: { borderRadius: 20, overflow: 'hidden' },
  frameInner: { padding: Spacing.lg, alignItems: 'center' },
  frameTitle: { ...Typography.h1, color: Colors.primaryDark },
  frameSub: { ...Typography.h3, color: Colors.primary, textAlign: 'center', marginTop: Spacing.xs },
  frameDesc: { ...Typography.body, color: Colors.ink, textAlign: 'center', marginTop: Spacing.sm },

  // ⑦ ネガティブ神
  negDesc: { ...Typography.body, color: Colors.ink, textAlign: 'center', marginTop: Spacing.sm },

  pinkButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 44,
    marginTop: Spacing.md,
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pinkButtonText: { ...Typography.label, color: Colors.surface, letterSpacing: 1, textAlign: 'center' },

  // 生年月日フォーム
  birthRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md },
  birthInput: {
    width: 72, borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: Spacing.sm, fontFamily: Fonts.sansRegular, fontSize: 16, color: Colors.ink,
    textAlign: 'center', backgroundColor: Colors.sectionCream,
  },
  birthInputSm: {
    width: 52, borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: Spacing.sm, fontFamily: Fonts.sansRegular, fontSize: 16, color: Colors.ink,
    textAlign: 'center', backgroundColor: Colors.sectionCream,
  },
  birthSep: { ...Typography.caption, color: Colors.muted, marginHorizontal: Spacing.xs },

  // ⑧ CTA
  ctaSection: { borderRadius: 16, overflow: 'hidden', shadowColor: Colors.primaryDark, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  ctaGradient: {
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ctaTitle: { fontFamily: Fonts.sansMedium, fontSize: 15, color: Colors.surface },
  ctaSubtitle: { ...Typography.caption, color: Colors.bg, marginTop: Spacing.xs },
});
