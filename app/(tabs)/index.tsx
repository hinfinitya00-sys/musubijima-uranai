import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { usePlanGate } from "@/hooks/usePlanGate";
import { TrialBanner } from "@/components/TrialBanner";

const GRID_GAP = 8;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { state } = useApp();
  const { canUse, isFree } = usePlanGate();
  const { subscription, isLoading } = state;
  const gridCardWidth = (width - 32 - GRID_GAP) / 2;

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
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logoText}>むすび島</Text>
            <Text style={styles.logoLabel}>数秘術占い</Text>
            <Text style={styles.logoSubtext}>MUSUBIJIMA</Text>
            <Text style={styles.dateText}>
              {todayStr}（{weekday}）
            </Text>
          </View>

          <TrialBanner />

          {/* Section Label */}
          <Text style={styles.sectionLabel}>今日のメニュー</Text>

          {/* Hero Card - みたまカード */}
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() => router.push('/fortune/mitama' as never)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#EDE9FE' }]}>
              <Text style={styles.iconEmoji}>🎴</Text>
            </View>
            <View style={styles.heroTextArea}>
              <Text style={styles.heroTitle}>み・たまカード</Text>
              <Text style={styles.heroSub}>今日の一枚を引く</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>毎日</Text>
            </View>
          </TouchableOpacity>

          {/* Grid Row 1 */}
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[styles.gridCard, { width: gridCardWidth }]}
              onPress={() => router.push('/fortune/omikuji' as never)}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconWrap, { backgroundColor: '#EDE9FE' }]}>
                <Text style={styles.gridIconEmoji}>🔮</Text>
              </View>
              <Text style={styles.gridTitle}>おみくじ</Text>
              <Text style={styles.gridSub}>今日の運勢</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, { width: gridCardWidth }]}
              onPress={() => {
                if (!canUse.negativeGod) {
                  router.push('/subscription/plans' as never);
                  return;
                }
                router.push('/fortune/negative-god' as never);
              }}
              activeOpacity={0.8}
            >
              {isFree && <Text style={styles.lockBadge}>🔒</Text>}
              <View style={[styles.gridIconWrap, { backgroundColor: '#1C1C2E' }]}>
                <Text style={styles.gridIconEmoji}>🌑</Text>
              </View>
              <Text style={styles.gridTitle}>ネガティブ神</Text>
              <Text style={styles.gridSub}>闇からの導き</Text>
            </TouchableOpacity>
          </View>

          {/* Grid Row 2 */}
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={[styles.gridCard, { width: gridCardWidth }]}
              onPress={() => router.push('/fortune/life-rhythm' as never)}
              activeOpacity={0.8}
            >
              <View style={[styles.gridIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <Text style={styles.gridIconEmoji}>🌿</Text>
              </View>
              <Text style={styles.gridTitle}>人生リズム</Text>
              <Text style={styles.gridSub}>今年の流れを知る</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, { width: gridCardWidth }]}
              onPress={() => {
                if (!canUse.musubian) {
                  router.push('/subscription/plans' as never);
                  return;
                }
                router.push('/fortune/musubian' as never);
              }}
              activeOpacity={0.8}
            >
              {isFree && <Text style={styles.lockBadge}>🔒</Text>}
              <View style={[styles.gridIconWrap, { backgroundColor: '#FFF7ED' }]}>
                <Text style={styles.gridIconEmoji}>🤝</Text>
              </View>
              <Text style={styles.gridTitle}>むすび族占い</Text>
              <Text style={styles.gridSub}>相性・縁を知る</Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          {!subscription.isSubscribed && (
            <TouchableOpacity
              style={styles.ctaSection}
              onPress={() => router.push("/subscription/plans")}
            >
              <LinearGradient colors={["#E8C547", "#F59E0B"]} style={styles.ctaGradient}>
                <Text style={styles.ctaTitle}>月額300円から全機能解放</Text>
                <Text style={styles.ctaSubtitle}>
                  スタンダードプランで全ての占いを無制限に
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* 占い師プロフィール */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Image
                source={require('../../assets/mitama/profile.jpg')}
                style={styles.profileAvatar}
                resizeMode="cover"
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>其田 寿枝（そのだ ひさえ）</Text>
                <Text style={styles.profileRole}>数秘術占い師・むすび島主宰</Text>
              </View>
            </View>
            <Text style={styles.profileMessage}>
              数字には、あなたの魂の声が宿っています。生年月日に秘められたリズムを読み解き、今このときのあなたに必要なメッセージをお届けします。
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {['占い歴20年以上', '延べ3,000人以上鑑定', '数秘術×神道の融合'].map((label) => (
                <View key={label} style={styles.pill}>
                  <Text style={styles.pillText}>{label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 18, color: "#4C1D95" },
  content: { paddingHorizontal: 12, paddingTop: 8, flex: 1 },

  // Header
  header: { alignItems: "center", marginBottom: 20, paddingTop: 8 },
  logoText: {
    fontSize: 36, fontWeight: "800", color: "#4C1D95", letterSpacing: 6,
  },
  logoLabel: {
    fontSize: 12, color: "#9CA3AF", letterSpacing: 2, marginTop: 2,
  },
  logoSubtext: {
    fontSize: 11, color: "#6D28D9", letterSpacing: 8, marginBottom: 8,
  },
  dateText: { fontSize: 14, color: "#9CA3AF" },

  // Section
  sectionLabel: {
    fontSize: 11, color: "#9CA3AF", letterSpacing: 1.5,
    marginBottom: 10, textTransform: "uppercase",
  },

  // Hero Card
  heroCard: {
    flexDirection: 'row', alignItems: 'center',
    height: 80, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14,
    paddingHorizontal: 16, marginBottom: 8,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 22 },
  heroTextArea: { flex: 1, marginLeft: 12 },
  heroTitle: { fontSize: 14, fontWeight: '500', color: '#374151' },
  heroSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  badge: {
    backgroundColor: '#EDE9FE', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { fontSize: 10, color: '#5B21B6', fontWeight: '600' },

  // Grid
  gridRow: { flexDirection: 'row', gap: GRID_GAP, marginTop: 0, marginBottom: 8 },
  gridCard: {
    height: 110, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    padding: 12,
  },
  gridIconWrap: {
    width: 36, height: 36, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  gridIconEmoji: { fontSize: 18 },
  lockBadge: { fontSize: 12, position: 'absolute' as const, top: 8, right: 8 },
  gridTitle: { fontSize: 13, fontWeight: '500', color: '#374151', marginTop: 8 },
  gridSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  // CTA
  ctaSection: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  ctaGradient: { padding: 20, alignItems: "center" },
  ctaTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937", marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, color: "#374151" },

  // Profile
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    padding: 20,
    marginTop: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4C1D95',
  },
  profileRole: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  profileMessage: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
    marginTop: 12,
  },
  pillScroll: {
    marginTop: 12,
  },
  pill: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  pillText: {
    fontSize: 11,
    color: '#5B21B6',
  },
});
