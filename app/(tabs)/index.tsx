import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
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
  const float4 = useFloatAnim(3500, 600);
  const float5 = useFloatAnim(3600, 1000);

  const pulse1 = usePulseAnim(3000, 0);
  const pulse2 = usePulseAnim(3000, 800);
  const pulse3 = usePulseAnim(3500, 400);
  const pulse4 = usePulseAnim(3000, 200);
  const pulse5 = usePulseAnim(3000, 600);

  const spin1 = useSpinAnim(18000, false);
  const spin2 = useSpinAnim(24000, true);

  const sparkle1 = usePulseAnim(2000, 0);
  const sparkle2 = usePulseAnim(2500, 500);
  const sparkle3 = usePulseAnim(2000, 1000);
  const sparkle4 = usePulseAnim(2500, 1500);

  if (isLoading) {
    return (
      <LinearGradient colors={["#0D0B1E", "#1D1B4B"]} style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </LinearGradient>
    );
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[today.getDay()];

  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.logoText}>むすび島</Text>
              <Text style={styles.logoLabel}>数秘術占い</Text>
              <Text style={styles.logoSubtext}>MUSUBIJIMA</Text>
              <Text style={styles.dateText}>{todayStr}（{weekday}）</Text>
            </View>

            <TrialBanner />

            {/* オラクルレイアウト */}
            <View style={styles.oracleWrap}>

              {/* 上段：おみくじ・み・たまカード */}
              <View style={styles.rowTop}>
                <Animated.View style={{ transform: [{ translateY: float1 }] }}>
                  <TouchableOpacity
                    style={styles.orb}
                    onPress={() => router.push('/fortune/omikuji' as never)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.iconWrap}>
                      <LinearGradient colors={['#7C3AED', '#4C1D95']} style={styles.iconCircle}>
                        <Text style={styles.iconEmoji}>🔮</Text>
                      </LinearGradient>
                      <Animated.View style={[styles.glowRing, { opacity: pulse1 }]} />
                    </View>
                    <Text style={styles.orbLabel}>おみくじ</Text>
                    <Text style={styles.orbSub}>今日の運勢</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: float2 }] }}>
                  <TouchableOpacity
                    style={styles.orb}
                    onPress={() => router.push('/fortune/mitama' as never)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.iconWrap}>
                      <LinearGradient colors={['#9333EA', '#6D28D9']} style={styles.iconCircle}>
                        <Text style={styles.iconEmoji}>🎴</Text>
                      </LinearGradient>
                      <Animated.View style={[styles.glowRing, { opacity: pulse2, borderColor: 'rgba(216,180,254,0.6)' }]} />
                    </View>
                    <Text style={styles.orbLabel}>み・たまカード</Text>
                    <Text style={styles.orbSub}>今日の一枚</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* 中央：寿枝さん */}
              <View style={styles.centerZone}>
                <View style={styles.avatarOuter}>
                  <Animated.View style={[styles.orbitRing1, { transform: [{ rotate: spin1 }] }]} />
                  <Animated.View style={[styles.orbitRing2, { transform: [{ rotate: spin2 }] }]} />
                  <View style={styles.avatarCircle}>
                    <Image
                      source={require('../../assets/mitama/profile.jpg')}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Animated.View style={[styles.dotGold, { top: 3, left: '50%', marginLeft: -4, opacity: sparkle1 }]} />
                  <Animated.View style={[styles.dotPurple, { bottom: 3, left: '50%', marginLeft: -3, opacity: sparkle2 }]} />
                  <Animated.View style={[styles.dotPurple, { top: '50%', marginTop: -3, left: 3, opacity: sparkle3 }]} />
                  <Animated.View style={[styles.dotGold, { top: '50%', marginTop: -4, right: 3, opacity: sparkle4 }]} />
                </View>
                <Text style={styles.centerName}>其田 寿枝</Text>
                <Text style={styles.centerRole}>数秘術占い師 · むすび島主宰</Text>
              </View>

              {/* 下段：ネガティブ神・人生リズム・むすび族 */}
              <View style={styles.rowBottom}>
                <Animated.View style={{ transform: [{ translateY: float3 }] }}>
                  <TouchableOpacity
                    style={styles.orbSm}
                    onPress={() => { if (!canUse.negativeGod) { router.push('/subscription/plans' as never); return; } router.push('/fortune/negative-god' as never); }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.iconWrapSm}>
                      <LinearGradient colors={['#1C1C2E', '#312E81']} style={styles.iconCircleSm}>
                        <Text style={styles.iconEmojiSm}>🌑</Text>
                      </LinearGradient>
                      <Animated.View style={[styles.glowRingSm, { opacity: pulse3, borderColor: 'rgba(99,102,241,0.5)' }]} />
                      {isFree && <View style={styles.lockBadge}><Text style={styles.lockText}>🔒</Text></View>}
                    </View>
                    <Text style={styles.orbLabelSm}>ネガティブ神</Text>
                    <Text style={styles.orbSubSm}>闇の導き</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: float4 }] }}>
                  <TouchableOpacity
                    style={styles.orbSm}
                    onPress={() => router.push('/fortune/life-rhythm' as never)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.iconWrapSm}>
                      <LinearGradient colors={['#065F46', '#10B981']} style={styles.iconCircleSm}>
                        <Text style={styles.iconEmojiSm}>🌿</Text>
                      </LinearGradient>
                      <Animated.View style={[styles.glowRingSm, { opacity: pulse4, borderColor: 'rgba(52,211,153,0.5)' }]} />
                    </View>
                    <Text style={styles.orbLabelSm}>人生リズム</Text>
                    <Text style={styles.orbSubSm}>9年の流れ</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateY: float5 }] }}>
                  <TouchableOpacity
                    style={styles.orbSm}
                    onPress={() => { if (!canUse.musubian) { router.push('/subscription/plans' as never); return; } router.push('/fortune/musubian' as never); }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.iconWrapSm}>
                      <LinearGradient colors={['#92400E', '#F59E0B']} style={styles.iconCircleSm}>
                        <Text style={styles.iconEmojiSm}>🤝</Text>
                      </LinearGradient>
                      <Animated.View style={[styles.glowRingSm, { opacity: pulse5, borderColor: 'rgba(251,191,36,0.5)' }]} />
                      {isFree && <View style={styles.lockBadge}><Text style={styles.lockText}>🔒</Text></View>}
                    </View>
                    <Text style={styles.orbLabelSm}>むすび族</Text>
                    <Text style={styles.orbSubSm}>相性・縁</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>

            </View>

            {/* 区切り線 */}
            <View style={styles.divider} />

            {/* CTA */}
            {!subscription.isSubscribed && (
              <TouchableOpacity
                style={styles.ctaSection}
                onPress={() => router.push("/subscription/plans" as never)}
                activeOpacity={0.9}
              >
                <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.ctaGradient}>
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
  container: { flex: 1, backgroundColor: '#F8F6FF' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 18, color: '#4C1D95' },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: 16, paddingTop: 8 },
  logoText: { fontSize: 34, fontWeight: '800', color: '#4C1D95', letterSpacing: 6 },
  logoLabel: { fontSize: 11, color: '#9CA3AF', letterSpacing: 2, marginTop: 2 },
  logoSubtext: { fontSize: 10, color: '#6D28D9', letterSpacing: 8, marginBottom: 6 },
  dateText: { fontSize: 13, color: '#C4B5FD' },

  oracleWrap: { alignItems: 'center', width: '100%', paddingVertical: 8 },

  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 4,
  },

  orb: { alignItems: 'center', width: 92 },
  orbSm: { alignItems: 'center', width: 82 },

  iconWrap: { position: 'relative', marginBottom: 8 },
  iconWrapSm: { position: 'relative', marginBottom: 6 },

  iconCircle: {
    width: 68, height: 68, borderRadius: 34,
    alignItems: 'center', justifyContent: 'center',
  },
  iconCircleSm: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 28 },
  iconEmojiSm: { fontSize: 22 },

  glowRing: {
    position: 'absolute',
    top: -5, left: -5, right: -5, bottom: -5,
    borderRadius: 39,
    borderWidth: 1.5,
    borderColor: 'rgba(196,181,253,0.6)',
  },
  glowRingSm: {
    position: 'absolute',
    top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.5)',
  },

  lockBadge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#EDE9FE', borderRadius: 8,
    width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  lockText: { fontSize: 9 },

  orbLabel: { fontSize: 12, fontWeight: '700', color: '#374151', textAlign: 'center' },
  orbSub: { fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 2 },
  orbLabelSm: { fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'center' },
  orbSubSm: { fontSize: 9, color: '#9CA3AF', textAlign: 'center', marginTop: 1 },

  centerZone: { alignItems: 'center', paddingVertical: 8 },
  avatarOuter: { width: 120, height: 120, position: 'relative' },

  orbitRing1: {
    position: 'absolute', inset: 0,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: 'rgba(196,181,253,0.45)',
    borderStyle: 'dashed',
  } as any,
  orbitRing2: {
    position: 'absolute', top: 6, left: 6, right: 6, bottom: 6,
    borderRadius: 54,
    borderWidth: 1,
    borderColor: 'rgba(232,197,71,0.35)',
    borderStyle: 'dashed',
  } as any,

  avatarCircle: {
    position: 'absolute', top: 13, left: 13, right: 13, bottom: 13,
    borderRadius: 47,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#C4B5FD',
  },
  avatarImage: { width: '100%', height: '100%' },

  dotGold: {
    position: 'absolute', width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E8C547',
  },
  dotPurple: {
    position: 'absolute', width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#C4B5FD',
  },

  centerName: {
    fontSize: 15, fontWeight: '800', color: '#4C1D95',
    marginTop: 10, letterSpacing: 1.5,
  },
  centerRole: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },

  divider: {
    height: 1,
    backgroundColor: '#DDD6FE',
    opacity: 0.5,
    marginVertical: 16,
    marginHorizontal: 20,
  },

  ctaSection: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: {
    paddingVertical: 14, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ctaTitle: { fontSize: 13, fontWeight: '800', color: '#E8C547' },
  ctaSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
});
