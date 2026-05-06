import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { INITIAL_CHARACTERS } from "@/constants/characters";

const { width } = Dimensions.get("window");

const ATTRIBUTE_EMOJIS: Record<string, string> = {
  fire: '🔥',
  water: '💧',
  wind: '🌿',
  earth: '🌍',
  master: '⭐',
};

const ATTRIBUTE_COLORS: Record<string, string> = {
  fire: '#E74C3C',
  water: '#3498DB',
  wind: '#2ECC71',
  earth: '#F39C12',
  master: '#9B59B6',
};

interface FortuneMenuItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  route: string;
  requiresPlan?: boolean;
}

const FORTUNE_MENU: FortuneMenuItem[] = [
  {
    id: 'omikuji',
    emoji: '🎴',
    title: '今日のおみくじ',
    description: 'むすび島のおみくじを引こう',
    route: '/fortune/omikuji',
  },
  {
    id: 'negative-god',
    emoji: '👹',
    title: 'ネガティブ神占い',
    description: 'ネガティブな感情を手放す',
    route: '/fortune/negative-god',
  },
  {
    id: 'musubian',
    emoji: '🌀',
    title: 'むすび族占い（相性）',
    description: '気になる人との相性を診断',
    route: '/fortune/musubian',
    requiresPlan: true,
  },
  {
    id: 'mitama',
    emoji: '🃏',
    title: 'み・たまカード',
    description: '直感で選ぶメッセージカード',
    route: '/fortune/mitama',
    requiresPlan: true,
  },
];

export default function HomeScreen() {
  const { state, canReadToday, hasAccess } = useApp();
  const { profile, subscription, isLoading } = state;

  if (isLoading) {
    return (
      <LinearGradient colors={["#0D0B1E", "#1D1B4B"]} style={styles.loadingContainer}>
        <Text style={styles.loadingText}>✨ 読み込み中...</Text>
      </LinearGradient>
    );
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[today.getDay()];

  // キャラクター情報（ガイド数からむすび族を取得）
  const guideNumber = profile?.guideNumber ?? 1;
  const character = INITIAL_CHARACTERS.find(c =>
    c.lifePathNumbers.includes(guideNumber)
  ) ?? INITIAL_CHARACTERS[0];

  const hasSubscriptionAccess = hasAccess();

  return (
    <LinearGradient colors={["#0D0B1E", "#1D1B4B", "#0D0B1E"]} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>むすび島へようこそ</Text>
            <Text style={styles.dateText}>
              {todayStr}（{weekday}）
            </Text>
          </View>

          {/* あなたのむすび族 */}
          <View style={styles.characterSection}>
            <View style={[styles.characterIconContainer, {
              borderColor: ATTRIBUTE_COLORS[character.attribute] ?? '#9B59B6'
            }]}>
              <Text style={styles.characterEmoji}>
                {ATTRIBUTE_EMOJIS[character.attribute] ?? '⭐'}
              </Text>
            </View>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterNameJa}>{character.nameJa}</Text>
            <View style={[styles.attributeBadge, {
              backgroundColor: ATTRIBUTE_COLORS[character.attribute] ?? '#9B59B6'
            }]}>
              <Text style={styles.attributeBadgeText}>
                {character.attribute === 'fire' ? '火' :
                 character.attribute === 'water' ? '水' :
                 character.attribute === 'wind' ? '風' :
                 character.attribute === 'earth' ? '土' : 'マスター'} 属性
              </Text>
            </View>
          </View>

          {/* 今日のむすびメッセージ */}
          {hasSubscriptionAccess ? (
            <View style={styles.messageSection}>
              <Text style={styles.messageSectionTitle}>今日のむすびメッセージ</Text>
              <View style={styles.messageCard}>
                <Text style={styles.messageText}>
                  {character.description}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.upgradeSection}
              onPress={() => router.push("/subscription/plans")}
            >
              <LinearGradient colors={['#7F77DD', '#6D28D9']} style={styles.upgradeGradient}>
                <Text style={styles.upgradeTitle}>✨ スタンダードプランで毎日メッセージを受け取る</Text>
                <Text style={styles.upgradeSubtitle}>月額980円 ・ むすび族からの特別メッセージ</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* 占いメニュー */}
          <View style={styles.fortuneSection}>
            <Text style={styles.fortuneSectionTitle}>占いメニュー</Text>
            {FORTUNE_MENU.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.fortuneMenuItem}
                onPress={() => {
                  if (item.requiresPlan && !hasSubscriptionAccess) {
                    router.push("/subscription/plans");
                  } else {
                    router.push(item.route as never);
                  }
                }}
              >
                <Text style={styles.fortuneMenuEmoji}>{item.emoji}</Text>
                <View style={styles.fortuneMenuContent}>
                  <Text style={styles.fortuneMenuTitle}>{item.title}</Text>
                  <Text style={styles.fortuneMenuDescription}>{item.description}</Text>
                </View>
                {item.requiresPlan && !hasSubscriptionAccess && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>PRO</Text>
                  </View>
                )}
                <Text style={styles.fortuneMenuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* フリーユーザー向けプランCTA */}
          {!subscription.isSubscribed && (
            <TouchableOpacity
              style={styles.ctaSection}
              onPress={() => router.push("/subscription/plans")}
            >
              <LinearGradient colors={['#E8C547', '#F59E0B']} style={styles.ctaGradient}>
                <Text style={styles.ctaTitle}>むすび島の全機能を解放する</Text>
                <Text style={styles.ctaSubtitle}>
                  スタンダードプラン 月額980円
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 18, color: "#E8C547" },
  scrollContent: { padding: 20, paddingTop: 8 },

  // Header
  header: { marginBottom: 24 },
  welcomeText: { fontSize: 24, fontWeight: "800", color: "#E8C547", marginBottom: 4 },
  dateText: { fontSize: 14, color: "rgba(255,255,255,0.6)" },

  // Character Section
  characterSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 24,
    backgroundColor: "rgba(127,119,221,0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(127,119,221,0.3)",
  },
  characterIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  characterEmoji: { fontSize: 36 },
  characterName: { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 2 },
  characterNameJa: { fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 8 },
  attributeBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12 },
  attributeBadgeText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  // Message Section
  messageSection: { marginBottom: 24 },
  messageSectionTitle: { fontSize: 16, fontWeight: "700", color: "#E8C547", marginBottom: 12 },
  messageCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  messageText: { fontSize: 15, color: "#D1D5DB", lineHeight: 24 },

  // Upgrade CTA
  upgradeSection: { marginBottom: 24, borderRadius: 16, overflow: "hidden" },
  upgradeGradient: { padding: 20, alignItems: "center" },
  upgradeTitle: { fontSize: 15, fontWeight: "700", color: "#fff", marginBottom: 4 },
  upgradeSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.7)" },

  // Fortune Menu
  fortuneSection: { marginBottom: 24 },
  fortuneSectionTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 12 },
  fortuneMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  fortuneMenuEmoji: { fontSize: 28, marginRight: 14 },
  fortuneMenuContent: { flex: 1 },
  fortuneMenuTitle: { fontSize: 15, fontWeight: "700", color: "#fff", marginBottom: 2 },
  fortuneMenuDescription: { fontSize: 12, color: "rgba(255,255,255,0.5)" },
  fortuneMenuArrow: { fontSize: 24, color: "rgba(255,255,255,0.3)" },
  lockBadge: {
    backgroundColor: "rgba(232,197,71,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  lockBadgeText: { fontSize: 10, fontWeight: "700", color: "#E8C547" },

  // Bottom CTA
  ctaSection: { borderRadius: 16, overflow: "hidden" },
  ctaGradient: { padding: 20, alignItems: "center" },
  ctaTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937", marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, color: "#374151" },
});
