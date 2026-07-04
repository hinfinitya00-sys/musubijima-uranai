import React, { useRef, useEffect, useState } from "react";
import { noCopy } from '@/constants/Typography';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  TextInput,
  Dimensions,
  Platform,
  AccessibilityInfo,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, G } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { supabase } from "@/lib/supabase";
import { usePlanGate } from "@/hooks/usePlanGate";
import { TrialBanner } from "@/components/TrialBanner";
import { Colors } from "@/constants/Colors";
import { Typography, Fonts } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

// ネガティブ神セクションの薄いグレー背景（パレット外の一回限りの背景色）
const SECTION_GRAY = "#F5F0F0";

// ─────────────────────────────────────────────
// 視差効果オフ設定の尊重
// ─────────────────────────────────────────────
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted) setReduced(!!v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => setReduced(!!v));
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

// ─────────────────────────────────────────────
// 控えめな常時アニメ（reduced時は停止）
// ─────────────────────────────────────────────
function useFloatAnim(duration: number, delay: number, enabled: boolean) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!enabled) {
      anim.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: -7, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [enabled]);
  return anim;
}

function usePulseAnim(duration: number, delay: number, enabled: boolean) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    if (!enabled) {
      anim.setValue(0.7);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 0.9, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: duration / 2, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [enabled]);
  return anim;
}

// ─────────────────────────────────────────────
// 署名要素：水引の結び目（シンプルな線画・幅112px）
// ─────────────────────────────────────────────
const KNOT_D =
  "M 44 60 C 48 48, 20 47, 24 30 C 27 17, 52 19, 58 33 C 60 37, 60 37, 62 33 C 68 19, 93 17, 96 30 C 100 47, 72 48, 76 60";

function MizuhikiMark() {
  return (
    <Svg width={112} height={65} viewBox="0 0 120 70" accessibilitylabel="水引の結び目">
      <G transform="translate(0,3)">
        <Path d={KNOT_D} stroke={Colors.accent} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      </G>
      <Path d={KNOT_D} stroke={Colors.primary} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// 入場演出＋スクロールリビール
// 上部要素はロード時にstaggerで登場、下部はスクロールで一度だけ登場。
// ─────────────────────────────────────────────
type RevealProps = {
  index: number;
  scrollY: Animated.Value;
  winH: number;
  reduced: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

function RevealBlock({ index, scrollY, winH, reduced, style, children }: RevealProps) {
  const topRef = useRef<number | null>(null);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [delay, setDelay] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  const tryReveal = (scroll: number) => {
    if (revealedRef.current || topRef.current == null) return;
    if (topRef.current < scroll + winH - 40) {
      revealedRef.current = true;
      setDelay(scroll <= 1 ? index * 100 : 0); // ロード時のみ100msずつのstagger
      setRevealed(true);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    topRef.current = e.nativeEvent.layout.y;
    if (!reduced) tryReveal(0);
  };

  useEffect(() => {
    if (reduced) return;
    const id = scrollY.addListener(({ value }) => tryReveal(value));
    return () => scrollY.removeListener(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    if (revealed) {
      Animated.timing(anim, { toValue: 1, duration: 420, delay, useNativeDriver: true }).start();
    }
  }, [revealed, reduced]);

  if (reduced) {
    return (
      <Animated.View onLayout={onLayout} style={style}>
        {children}
      </Animated.View>
    );
  }

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  return (
    <Animated.View onLayout={onLayout} style={[style, { opacity: anim, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
// ボタンのマイクロインタラクション（pressInでscale0.97 + 触覚 + webホバー）
// ─────────────────────────────────────────────
type AnimatedPressableProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  hoverOpacity?: number;
};

function AnimatedPressable({ onPress, style, children, hoverOpacity = 0.9 }: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [hover, setHover] = useState(false);

  const pressIn = () => Animated.timing(scale, { toValue: 0.97, duration: 90, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  const handlePress = () => {
    if (Platform.OS !== "web") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    onPress();
  };

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={handlePress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
    >
      <Animated.View style={[style, { transform: [{ scale }], opacity: Platform.OS === "web" && hover ? hoverOpacity : 1 }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

/**
 * 今日のメッセージ（其田寿枝より）。
 * daily_messages_cms から今日（JST）の日付のメッセージを取得し、ヒーロー直下に表示。
 * データが無い日はセクションごと非表示（null を返す）。既存レイアウトには影響しない追加要素。
 */
function TodayMessage() {
  const [message, setMessage] = useState<string | null>(null);
  const tickerAnim = useRef(new Animated.Value(0)).current; // テロップの横スクロール

  useEffect(() => {
    let active = true;
    // JST（UTC+9）の今日の日付 YYYY-MM-DD
    const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const today = jst.toISOString().slice(0, 10);
    supabase
      .from("daily_messages_cms")
      .select("message")
      .eq("date", today)
      .limit(1)
      .then(({ data }) => {
        if (!active) return;
        const m = data?.[0]?.message;
        if (typeof m === "string" && m.trim().length > 0) setMessage(m);
      });
    return () => {
      active = false;
    };
  }, []);

  // メッセージ到着時：テロップをループ再生
  useEffect(() => {
    if (!message) return;

    // アニメをリセット
    tickerAnim.stopAnimation();
    tickerAnim.setValue(0);

    // 少し遅延してからループ開始（レンダー完了待ち）
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(tickerAnim, {
            toValue: 1,
            duration: 30000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 300);

    return () => {
      clearTimeout(timer);
      tickerAnim.stopAnimation();
    };
  }, [message, tickerAnim]);

  // データが無い日は何も表示しない（従来通り）
  if (!message) return null;

  return (
    <View style={styles.tickerWrapper}>
      <View style={styles.tickerBar}>
        <View style={styles.tickerLabel}>
          <Text style={styles.tickerLabelText}>今日のおくりもの</Text>
          <Text style={styles.tickerUpdateText}>毎日7時更新</Text>
        </View>
        <View style={styles.tickerTrack}>
          <Animated.Text style={[styles.tickerText, { transform: [{
            translateX: tickerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, -1200],
            })
          }] }]}>
            {message}{'　　　　　'}{message}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { state } = useApp();
  const { canUse, isFree } = usePlanGate();
  const { subscription, isLoading } = state;

  const reduced = useReducedMotion();

  // 控えめな常時アニメ（reduced時は停止）
  const float1 = useFloatAnim(3200, 0, !reduced);
  const float2 = useFloatAnim(2800, 400, !reduced);
  const float3 = useFloatAnim(3500, 200, !reduced);
  const float4 = useFloatAnim(3000, 600, !reduced);
  const float5 = useFloatAnim(2600, 100, !reduced);
  const float6 = useFloatAnim(3300, 300, !reduced);

  // スクロールリビール用の共有スクロール量
  const scrollY = useRef(new Animated.Value(0)).current;
  const winH = Dimensions.get("window").height || 800;

  // 結び族セクションの生年月日フォーム
  const [bYear, setBYear] = useState("");
  const [bMonth, setBMonth] = useState("");
  const [bDay, setBDay] = useState("");

  const goMusubian = () => {
    if (!canUse.musubian) {
      router.push("/subscription/plans" as never);
      return;
    }
    router.push({ pathname: "/fortune/musubian", params: { year: bYear, month: bMonth, day: bDay } } as never);
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

  const winW = Math.min(Dimensions.get("window").width || 375, 600);
  const hisaeW = winW * 0.44;
  const hisaeH = hisaeW * 1.15;

  const revealProps = { scrollY, winH, reduced };

  return (
    <ImageBackground
      source={require("../../assets/site/shima.jpg")}
      style={[styles.container, noCopy]}
      imageStyle={{ opacity: 0.12, resizeMode: "cover" }}
    >
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        >
          <View style={styles.content}>

            {/* 今日のメッセージ（其田寿枝より）— ホーム最上部・伝言板スタイル。データがある日のみ表示 */}
            <TodayMessage />

            {/* はじめての方へ */}
            <TouchableOpacity style={styles.hajimeteBtn} onPress={() => router.push('/hajimete' as never)}>
              <Text style={styles.hajimeteBtnText}>✦ はじめての方へ</Text>
            </TouchableOpacity>

            {/* ① ヘッダー */}
            <RevealBlock index={0} {...revealProps} style={styles.header}>
              <Image
                source={require('../../assets/site/musubijima-logo-text.jpg')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.dateText}>{todayStr}（{weekday}）</Text>
              <Text style={styles.catchName}>占いカウンセラー　其田寿枝</Text>
              <Text style={styles.catchText}>あなたの「今」と「これから」をやさしく読み解く占いサイト</Text>
            </RevealBlock>

            <TrialBanner />

            {/* ② 水引モチーフ＋ひさえと龍イラスト＋バブルメニュー */}
            <RevealBlock index={1} {...revealProps}>
              <View style={styles.knotWrap}>
                <MizuhikiMark />
              </View>

              <View style={styles.hisaeRow}>
                {/* 左列 */}
                <View style={styles.bubbleCol}>
                  <TouchableOpacity onPress={() => router.push('/fortune/omikuji' as never)}>
                    <Animated.View style={[styles.bubble, { transform: [{ translateY: float1 }], zIndex: 1 }]}>
                      <Text style={styles.bubbleText}>今日を軽やかに{"\n"}歩むための言葉</Text>
                    </Animated.View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/fortune/negative-god' as never)}>
                    <Animated.View style={[styles.bubble, { transform: [{ translateY: float3 }], zIndex: 1 }]}>
                      <Text style={styles.bubbleText}>心の影</Text>
                    </Animated.View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/fortune/utamikuji' as never)}>
                    <Animated.View style={[styles.bubble, { transform: [{ translateY: float5 }], zIndex: 1 }]}>
                      <Text style={styles.bubbleText}>音楽とともに</Text>
                    </Animated.View>
                  </TouchableOpacity>
                </View>

                {/* 中央：ひさえ画像 */}
                <View style={[styles.hisaeCenterCol, { zIndex: 0 }]}>
                  <Image
                    source={require('../../assets/site/hisae.png')}
                    style={{ width: hisaeW, height: hisaeH }}
                    resizeMode="contain"
                  />
                </View>

                {/* 右列 */}
                <View style={styles.bubbleCol}>
                  <TouchableOpacity onPress={() => router.push('/fortune/life-rhythm' as never)}>
                    <Animated.View style={[styles.bubble, { transform: [{ translateY: float2 }], zIndex: 1 }]}>
                      <Text style={styles.bubbleText}>今は進む時？{"\n"}整える時？</Text>
                    </Animated.View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/fortune/musubian' as never)}>
                    <Animated.View style={[styles.bubble, { transform: [{ translateY: float4 }], zIndex: 1 }]}>
                      <Text style={styles.bubbleText}>自分らしい{"\n"}活かし方</Text>
                    </Animated.View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/fortune/mitama' as never)}>
                    <Animated.View style={[styles.bubble, { transform: [{ translateY: float6 }], zIndex: 1 }]}>
                      <Text style={styles.bubbleText}>本当の願いに{"\n"}気づく</Text>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.hisaeCaption}>5つの占いで今の流れ・性質・未来のヒントを受け取れます。</Text>
            </RevealBlock>

            {/* ③ 導カード — sectionPink・左寄せ／画像右 */}
            <RevealBlock index={2} {...revealProps} style={[styles.card, { backgroundColor: Colors.sectionPink }]}>
              <View style={styles.rowLayout}>
                <View style={styles.colLeft}>
                  <Text style={styles.titleGold}>導カード</Text>
                  <Text style={styles.roman}>SHIRUBE CARD</Text>
                  <Text style={[styles.sectionDesc, styles.textLeft]}>今日の意気や心の流れ、気を付けたいこと、心が軽くなるアドバイスが受け取れます。</Text>
                  <AnimatedPressable style={[styles.pinkButton, styles.btnLeft]} onPress={() => router.push("/fortune/omikuji" as never)}>
                    <Text style={styles.pinkButtonText}>無料で引く</Text>
                  </AnimatedPressable>
                </View>
                <Image source={require("../../assets/site/logo-shirube.jpg")} style={styles.sideImage} resizeMode="contain" />
              </View>
            </RevealBlock>

            {/* ④ 結び族 — sectionCream・中央／フォーム強調 */}
            <RevealBlock index={3} {...revealProps} style={[styles.card, styles.cardCenter, { backgroundColor: Colors.sectionCream }]}>
              <Image source={require("../../assets/site/musubizoku-logo.jpg")} style={styles.sectionLogo} resizeMode="contain" />
              <Text style={styles.titlePink}>結び族</Text>
              <Text style={styles.subPink}>生まれ持った性質と才能を知る</Text>
              <Text style={[styles.sectionDesc, styles.textCenter]}>生まれ持った性質や本質・性格の特徴、強味・才能 得意なことなど向いている生き方のヒントが分かります。</Text>
              <View style={styles.formCard}>
                <Text style={styles.formLabel}>生年月日を入力</Text>
                <View style={styles.birthRow}>
                  <TextInput style={styles.birthInput} value={bYear} onChangeText={setBYear} placeholder="年" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={4} />
                  <Text style={styles.birthSep}>年</Text>
                  <TextInput style={styles.birthInputSm} value={bMonth} onChangeText={setBMonth} placeholder="月" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={2} />
                  <Text style={styles.birthSep}>月</Text>
                  <TextInput style={styles.birthInputSm} value={bDay} onChangeText={setBDay} placeholder="日" placeholderTextColor={Colors.primaryLight} keyboardType="number-pad" maxLength={2} />
                  <Text style={styles.birthSep}>日</Text>
                </View>
              </View>
              <AnimatedPressable style={styles.pinkButton} onPress={goMusubian}>
                <Text style={styles.pinkButtonText}>鑑定する{!canUse.musubian ? "　🔒" : ""}</Text>
              </AnimatedPressable>
            </RevealBlock>

            {/* ⑤ み・たまカード — surface・右寄せ／画像左（③と逆） */}
            <RevealBlock index={4} {...revealProps} style={[styles.card, { backgroundColor: Colors.surface }]}>
              <View style={[styles.rowLayout, { flexDirection: "row-reverse" }]}>
                <View style={styles.colRight}>
                  <Text style={[styles.mitamaHeading, styles.textRight]}>なぜ同じ悩みを繰り返す？</Text>
                  <Text style={[styles.sectionDesc, styles.textRight]}>心の奥にある想いやブロックに気づき、次の一歩のヒントが分かります。</Text>
                  <AnimatedPressable style={[styles.pinkButton, styles.btnRight]} onPress={() => router.push("/fortune/mitama" as never)}>
                    <Text style={styles.pinkButtonText}>無料で引く</Text>
                  </AnimatedPressable>
                </View>
                <Image source={require("../../assets/site/logo-mitama.jpg")} style={styles.sideImage} resizeMode="contain" />
              </View>
            </RevealBlock>

            {/* ⑥ 今年の運勢 — frame-pink.png背景 */}
            <RevealBlock index={5} {...revealProps}>
              <ImageBackground
                source={require("../../assets/site/frame-pink.png")}
                style={styles.frameSection}
                imageStyle={{ resizeMode: "stretch", borderRadius: 20 }}
              >
                <View style={styles.frameInner}>
                  <Image
                    source={require('../../assets/site/year-fortune-logo.jpg')}
                    style={styles.sectionLogoLarge}
                    resizeMode="contain"
                  />
                  <Text style={styles.frameTitle}>今年の運勢</Text>
                  <Text style={styles.frameSub}>今は進む時？{"\n"}整える時？</Text>
                  <Text style={styles.frameDesc}>1年の流れや、行動のタイミングが分かります。{"\n"}*やるべきこと、さけるべきことを見極める*</Text>
                  {/* 年表示（読み取り専用） */}
                  <Text style={styles.frameYear}>{new Date().getFullYear()}年</Text>
                  <AnimatedPressable style={styles.pinkButton} onPress={() => router.push('/fortune/life-rhythm' as never)}>
                    <Text style={styles.pinkButtonText}>運勢を占う</Text>
                  </AnimatedPressable>
                </View>
              </ImageBackground>
            </RevealBlock>

            {/* ⑦ ネガティブ神 — 薄いグレー・中央・神秘感 */}
            <RevealBlock index={6} {...revealProps} style={[styles.card, styles.cardCenter, { backgroundColor: SECTION_GRAY }]}>
              <Image source={require("../../assets/site/logo-negative.jpg")} style={styles.sectionLogo} resizeMode="contain" />
              <View style={styles.negAccent} />
              <Text style={[styles.negDesc, styles.textCenter]}>心の影やブロックを見つめ、手放し、新しい自分へ{"\n"}生まれ変わるサポートをいたします。</Text>
              <AnimatedPressable
                style={styles.pinkButton}
                onPress={() => {
                  if (!canUse.negativeGod) {
                    router.push("/subscription/plans" as never);
                    return;
                  }
                  router.push("/fortune/negative-god" as never);
                }}
              >
                <Text style={styles.pinkButtonText}>影を知り光へ変える{isFree && !canUse.negativeGod ? "　🔒" : ""}</Text>
              </AnimatedPressable>
            </RevealBlock>

            {/* ⑧ 歌みくじ — sectionCream・中央 */}
            <RevealBlock index={7} {...revealProps} style={[styles.card, styles.cardCenter, { backgroundColor: Colors.sectionCream }]}>
              <Text style={styles.titlePink}>歌みくじ</Text>
              <Text style={styles.roman}>UTA MIKUJI</Text>
              <Text style={[styles.sectionDesc, styles.textCenter]}>今日のあなたに贈る一曲。歌詞とメロディーから、今日のメッセージを受け取れます。</Text>
              <AnimatedPressable style={styles.pinkButton} onPress={() => router.push("/fortune/utamikuji" as never)}>
                <Text style={styles.pinkButtonText}>今日の歌を聴く</Text>
              </AnimatedPressable>
            </RevealBlock>

            {/* ⑨ CTAバナー（未課金時のみ） */}
            {!subscription.isSubscribed && (
              <RevealBlock index={8} {...revealProps}>
                <AnimatedPressable style={styles.ctaSection} onPress={() => router.push("/subscription/plans" as never)}>
                  <LinearGradient colors={[Colors.primary, Colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
                    <Text style={styles.ctaTitle}>月額330円で全機能解放</Text>
                    <Text style={styles.ctaSubtitle}>7日間無料トライアル実施中</Text>
                  </LinearGradient>
                </AnimatedPressable>
              </RevealBlock>
            )}

            {/* プロフィール */}
            <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile' as never)}>
              <Text style={styles.profileBtnText}>占いカウンセラー 其田寿枝について</Text>
            </TouchableOpacity>

          </View>
        </Animated.ScrollView>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.bg },
  loadingText: { ...Typography.h3, color: Colors.primary },
  content: { width: "100%", maxWidth: 600, alignSelf: "center", paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.section },

  // ① ヘッダー
  header: { alignItems: "center", marginBottom: Spacing.md, paddingTop: Spacing.sm },
  logoImage: {
    width: 240,
    height: 80,
    marginBottom: Spacing.xs,
  },
  logoText: { ...Typography.brand, color: Colors.primary },
  logoSubtext: { ...Typography.brandSub, color: Colors.accent, marginTop: Spacing.xs },
  dateText: { ...Typography.caption, color: Colors.muted, marginTop: Spacing.sm },
  catchName: { ...Typography.label, color: Colors.ink, marginTop: Spacing.sm },
  catchText: { ...Typography.caption, color: Colors.muted, marginTop: Spacing.xs, textAlign: "center" },

  // ② 水引＋ひさえゾーン
  knotWrap: { alignItems: "center", marginTop: Spacing.sm, marginBottom: Spacing.xs },
  hisaeRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: 0,
    marginTop: Spacing.sm,
  },
  bubbleCol: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 16,
    paddingVertical: 24,
    zIndex: 1,
  },
  hisaeCenterCol: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    maxWidth: '50%',
  },
  bubble: {
    backgroundColor: 'rgba(249, 192, 204, 0.95)',
    borderRadius: 60,
    paddingVertical: 14,
    paddingHorizontal: 12,
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bubbleText: {
    fontSize: 12,
    color: Colors.primaryDark,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
  },
  hisaeCaption: { ...Typography.caption, color: Colors.muted, textAlign: "center", marginTop: Spacing.sm, marginBottom: Spacing.lg },

  // 共通カード（背景色はセクションごとに指定）
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.section,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardCenter: { alignItems: "center" },

  // 今日のメッセージ（ホーム最上部・伝言板スタイル）
  tickerWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  tickerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8758A',
    height: 40,
    overflow: 'hidden',
    width: '100%',
  },
  tickerLabel: {
    backgroundColor: '#C45070',
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 110,
  },
  tickerLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Fonts.serifBold,
    letterSpacing: 1,
  },
  tickerTrack: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
  },
  tickerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.sansRegular,
    whiteSpace: 'nowrap',
    paddingLeft: 16,
  },
  tickerUpdateText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 2,
  },

  hajimeteBtn: {
    backgroundColor: '#FFF0F3',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E8758A',
  },
  hajimeteBtnText: {
    fontSize: 13,
    color: '#E8758A',
    fontWeight: '700',
  },
  profileBtn: {
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#C9A84C',
  },
  profileBtnText: {
    fontSize: 14,
    color: '#C9A84C',
    fontWeight: '700',
  },

  // 編集的レイアウト用
  rowLayout: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  colLeft: { flex: 1, alignItems: "flex-start" },
  colRight: { flex: 1, alignItems: "flex-end" },
  sideImage: { width: 116, height: 116 },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  btnLeft: { alignSelf: "flex-start" },
  btnRight: { alignSelf: "flex-end" },

  sectionLogo: { width: "100%", height: 150, marginBottom: Spacing.sm },
  sectionLogoLarge: {
    width: 200,
    height: 70,
    marginBottom: 8,
    alignSelf: 'center',
  },
  titleGold: { ...Typography.h1, color: Colors.accent },
  titlePink: { ...Typography.h1, color: Colors.primary },
  roman: { ...Typography.caption, color: Colors.muted, letterSpacing: 2, marginTop: Spacing.xs },
  subPink: { ...Typography.label, color: Colors.ink, marginTop: Spacing.xs },
  sectionDesc: { ...Typography.body, color: Colors.muted, marginTop: Spacing.sm },

  mitamaHeading: { ...Typography.h3, color: Colors.primary },

  // 結び族のフォーム強調
  formCard: {
    alignSelf: "stretch",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    alignItems: "center",
  },
  formLabel: { ...Typography.label, color: Colors.primaryDark, marginBottom: Spacing.sm },

  // ⑥ 今年の運勢（フレーム）
  frameSection: { marginBottom: Spacing.section, borderRadius: 20, overflow: "hidden" },
  frameInner: { padding: Spacing.lg, alignItems: "center" },
  frameTitle: { ...Typography.h1, color: Colors.primaryDark },
  frameSub: { ...Typography.h3, color: Colors.primary, textAlign: "center", marginTop: Spacing.xs },
  frameDesc: { ...Typography.body, color: Colors.ink, textAlign: "center", marginTop: Spacing.sm },
  frameYear: {
    fontSize: 22,
    fontWeight: '700',
    color: '#C45070',
    fontFamily: Fonts.serifBold,
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },

  // ⑦ ネガティブ神
  negAccent: { width: 40, height: 2, backgroundColor: Colors.primaryDark, opacity: 0.5, marginTop: Spacing.sm, borderRadius: 1 },
  negDesc: { ...Typography.body, color: Colors.ink, marginTop: Spacing.md },

  pinkButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 44,
    marginTop: Spacing.md,
    minHeight: 48,
    justifyContent: "center",
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pinkButtonText: { ...Typography.label, color: Colors.surface, letterSpacing: 1, textAlign: "center" },

  // 生年月日フォーム（タッチターゲット44px以上）
  birthRow: { flexDirection: "row", alignItems: "center", marginTop: Spacing.sm },
  birthInput: {
    width: 72, minHeight: 44, borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: Spacing.sm, fontFamily: Fonts.sansRegular, fontSize: 18, color: Colors.ink,
    textAlign: "center", backgroundColor: Colors.sectionCream,
  },
  birthInputSm: {
    width: 52, minHeight: 44, borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: Spacing.sm, fontFamily: Fonts.sansRegular, fontSize: 18, color: Colors.ink,
    textAlign: "center", backgroundColor: Colors.sectionCream,
  },
  birthSep: { ...Typography.caption, color: Colors.muted, marginHorizontal: Spacing.xs },

  // ⑧ CTA
  ctaSection: { borderRadius: 16, overflow: "hidden", shadowColor: Colors.primaryDark, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  ctaGradient: {
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  ctaTitle: { fontFamily: Fonts.sansMedium, fontSize: 20, color: Colors.surface },
  ctaSubtitle: { ...Typography.caption, color: Colors.bg, marginTop: Spacing.xs },
});
