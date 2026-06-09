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

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { state } = useApp();
  const { canUse, isFree } = usePlanGate();
  const { subscription, isLoading } = state;

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

          {/* Oracle Layout */}
          <View style={styles.oracleContainer}>
            {/* 上段：2つ */}
            <View style={styles.oracleRow}>
              <TouchableOpacity style={styles.orbCard} onPress={() => router.push('/fortune/omikuji' as never)} activeOpacity={0.85}>
                <View style={[styles.orbIcon, { backgroundColor: '#EDE9FE' }]}>
                  <Text style={styles.orbEmoji}>🔮</Text>
                </View>
                <Text style={styles.orbTitle}>おみくじ</Text>
                <Text style={styles.orbSub}>今日の運勢</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.orbCard} onPress={() => router.push('/fortune/mitama' as never)} activeOpacity={0.85}>
                <View style={[styles.orbIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Text style={styles.orbEmoji}>🎴</Text>
                </View>
                <Text style={styles.orbTitle}>み・たまカード</Text>
                <Text style={styles.orbSub}>今日の一枚</Text>
              </TouchableOpacity>
            </View>

            {/* 中央：寿枝さん */}
            <View style={styles.centerOracle}>
              <View style={styles.centerRing}>
                <Image
                  source={{ uri: 'https://musubijima.com/wp-content/uploads/2021/03/contents_header.jpg' }}
                  style={styles.centerImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.centerName}>其田 寿枝</Text>
              <Text style={styles.centerRole}>数秘術占い師</Text>
            </View>

            {/* 下段：3つ */}
            <View style={styles.oracleRow}>
              <TouchableOpacity
                style={styles.orbCard}
                onPress={() => {
                  if (!canUse.negativeGod) { router.push('/subscription/plans' as never); return; }
                  router.push('/fortune/negative-god' as never);
                }}
                activeOpacity={0.85}
              >
                {isFree && <Text style={styles.lockBadge}>🔒</Text>}
                <View style={[styles.orbIcon, { backgroundColor: '#1C1C2E' }]}>
                  <Text style={styles.orbEmoji}>🌑</Text>
                </View>
                <Text style={styles.orbTitle}>ネガティブ神</Text>
                <Text style={styles.orbSub}>闇の導き</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.orbCard} onPress={() => router.push('/fortune/life-rhythm' as never)} activeOpacity={0.85}>
                <View style={[styles.orbIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Text style={styles.orbEmoji}>🌿</Text>
                </View>
                <Text style={styles.orbTitle}>人生リズム</Text>
                <Text style={styles.orbSub}>9年の流れ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.orbCard}
                onPress={() => {
                  if (!canUse.musubian) { router.push('/subscription/plans' as never); return; }
                  router.push('/fortune/musubian' as never);
                }}
                activeOpacity={0.85}
              >
                {isFree && <Text style={styles.lockBadge}>🔒</Text>}
                <View style={[styles.orbIcon, { backgroundColor: '#FFF7ED' }]}>
                  <Text style={styles.orbEmoji}>🤝</Text>
                </View>
                <Text style={styles.orbTitle}>むすび族</Text>
                <Text style={styles.orbSub}>相性・縁</Text>
              </TouchableOpacity>
            </View>
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

  // Oracle Layout
  oracleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  oracleRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 8,
  },
  orbCard: {
    alignItems: 'center' as const,
    width: 88,
    position: 'relative' as const,
  },
  orbIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 6,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  orbEmoji: { fontSize: 28 },
  orbTitle: { fontSize: 11, fontWeight: '600' as const, color: '#374151', textAlign: 'center' as const },
  orbSub: { fontSize: 10, color: '#9CA3AF', textAlign: 'center' as const, marginTop: 1 },
  lockBadge: { fontSize: 12, position: 'absolute' as const, top: -2, right: 2 },

  // Center Profile
  centerOracle: {
    alignItems: 'center' as const,
    marginVertical: 4,
  },
  centerRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2.5,
    borderColor: '#C4B5FD',
    padding: 3,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  centerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 53,
  },
  centerName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#4C1D95',
    marginTop: 8,
    letterSpacing: 1,
  },
  centerRole: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // CTA
  ctaSection: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  ctaGradient: { padding: 20, alignItems: "center" },
  ctaTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937", marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, color: "#374151" },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    padding: 20,
    marginTop: 16,
  },
  profileMessage: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
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
