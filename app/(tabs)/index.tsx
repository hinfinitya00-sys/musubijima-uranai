import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { GROUP_DESCRIPTIONS } from "@/constants/guides-data";
import { getDailyCard } from "@/constants/daily-cards";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { state, canReadToday, hasAccess } = useApp();
  const { profile, subscription, todayReading, isLoading } = state;

  // 初回セットアップが未完了の場合はオンボーディングへ
  useEffect(() => {
    if (!isLoading && !profile?.setupCompleted) {
      router.replace("/onboarding");
    }
  }, [isLoading, profile]);

  if (isLoading || !profile) {
    return (
      <LinearGradient colors={["#1A0A2E", "#2D1B4E"] as const} style={styles.loadingContainer}>
        <Text style={styles.loadingText}>✨ 読み込み中...</Text>
      </LinearGradient>
    );
  }

  const guide = profile.guide;
  const groupInfo = guide ? GROUP_DESCRIPTIONS[guide.group] : null;
  const today = new Date();
  const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[today.getDay()];

  const groupColors: Record<string, [string, string, string]> = {
    earth: ["#3D2B00", "#8B6914", "#C9A227"],
    wind: ["#002B1A", "#2E8B57", "#52C78A"],
    water: ["#001B3D", "#1E6FA8", "#4A9FD8"],
    fire: ["#3D0000", "#C0392B", "#E74C3C"],
  };

  const bgColors = guide
    ? (groupColors[guide.groupEn] ?? ["#1A0A2E", "#7B5EA7", "#9B7EC7"])
    : ["#1A0A2E", "#2D1B4E", "#3D2B5E"];

  const canRead = canReadToday();
  const hasSubscriptionAccess = hasAccess();

  return (
    <LinearGradient colors={bgColors as [string, string, string]} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 日付ヘッダー */}
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>
              {todayStr}（{weekday}）
            </Text>
            {!hasSubscriptionAccess && (
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>
                  トライアル残り{subscription.trialDaysRemaining}日
                </Text>
              </View>
            )}
            {subscription.isSubscribed && (
              <View style={styles.subscribedBadge}>
                <Text style={styles.subscribedBadgeText}>✦ 月額会員</Text>
              </View>
            )}
          </View>

          {/* ガイド情報 */}
          {guide && groupInfo && (
            <View style={styles.guideSection}>
              <Text style={styles.guideGroupEmoji}>{groupInfo.emoji}</Text>
              <Text style={[styles.guideGroupName, { color: groupInfo.color }]}>
                {groupInfo.title}
              </Text>
              <Text style={styles.guideName}>{guide.name}</Text>
              <Text style={styles.guideNumber}>ガイド {profile.guideNumber}</Text>
            </View>
          )}

          {/* 今日のカード */}
          {hasSubscriptionAccess ? (
            <>
              {todayReading ? (
                // 今日すでに引いた場合
                <View style={styles.todayCardSection}>
                  <Text style={styles.sectionTitle}>今日のカード</Text>
                  <View style={styles.readCardContainer}>
                    <Text style={styles.readCardEmoji}>{todayReading.cardEmoji}</Text>
                    <Text style={styles.readCardTheme}>{todayReading.cardTheme}</Text>
                    <Text style={styles.readCardTitle}>{todayReading.cardTitle}</Text>
                    <Text style={styles.readCardMessage}>{todayReading.cardMessage}</Text>
                    <View style={styles.luckyRow}>
                      <View style={styles.luckyItem}>
                        <Text style={styles.luckyLabel}>ラッキーカラー</Text>
                        <Text style={styles.luckyValue}>{todayReading.luckyColor}</Text>
                      </View>
                      <View style={styles.luckyItem}>
                        <Text style={styles.luckyLabel}>ラッキーアイテム</Text>
                        <Text style={styles.luckyValue}>{todayReading.luckyItem}</Text>
                      </View>
                      <View style={styles.luckyItem}>
                        <Text style={styles.luckyLabel}>ラッキーナンバー</Text>
                        <Text style={styles.luckyValue}>{todayReading.luckyNumber}</Text>
                      </View>
                    </View>
                    <Text style={styles.tomorrowText}>また明日、カードを引きましょう ✨</Text>
                  </View>
                </View>
              ) : (
                // まだ引いていない場合
                <View style={styles.drawCardSection}>
                  <Text style={styles.sectionTitle}>今日のカードを引く</Text>
                  <Text style={styles.drawCardDescription}>
                    毎日1枚、あなたへのメッセージが届きます
                  </Text>
                  <TouchableOpacity
                    style={styles.drawCardButton}
                    onPress={() => router.push("/card-reading")}
                  >
                    <LinearGradient
                      colors={["#F2D06B", "#E8A87C"] as const}
                      style={styles.drawCardButtonGradient}
                    >
                      <Text style={styles.drawCardButtonEmoji}>🃏</Text>
                      <Text style={styles.drawCardButtonText}>カードを引く</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            // アクセス権なし（トライアル終了・未課金）
            <View style={styles.subscribeSection}>
              <Text style={styles.subscribeSectionTitle}>✨ 月額会員になる</Text>
              <Text style={styles.subscribeSectionText}>
                毎日のカード占いを続けるには、月額会員への登録が必要です。
              </Text>
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => router.push("/subscription")}
              >
                <LinearGradient
                  colors={["#7B5EA7", "#9B7EC7"] as const}
                  style={styles.subscribeButtonGradient}
                >
                  <Text style={styles.subscribeButtonText}>月額980円で始める</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* グループの今日のメッセージ */}
          {guide && groupInfo && (
            <View style={styles.groupMessageCard}>
              <Text style={styles.groupMessageTitle}>{groupInfo.title}からのメッセージ</Text>
              <Text style={styles.groupMessageText}>
                {groupInfo.keywords.map((k) => `✦ ${k}`).join("  ")}
              </Text>
              <Text style={styles.groupMessageDescription}>{groupInfo.description}</Text>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#F2D06B",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: "rgba(245,239,230,0.8)",
    fontWeight: "600",
  },
  trialBadge: {
    backgroundColor: "rgba(232,168,124,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(232,168,124,0.5)",
  },
  trialBadgeText: {
    fontSize: 11,
    color: "#E8A87C",
    fontWeight: "600",
  },
  subscribedBadge: {
    backgroundColor: "rgba(242,208,107,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.5)",
  },
  subscribedBadgeText: {
    fontSize: 11,
    color: "#F2D06B",
    fontWeight: "700",
  },
  guideSection: {
    alignItems: "center",
    marginBottom: 28,
    paddingVertical: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  guideGroupEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  guideGroupName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  guideName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F5EFE6",
    marginBottom: 4,
  },
  guideNumber: {
    fontSize: 13,
    color: "rgba(245,239,230,0.6)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5EFE6",
    marginBottom: 16,
    textAlign: "center",
  },
  todayCardSection: {
    marginBottom: 24,
  },
  readCardContainer: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.3)",
  },
  readCardEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  readCardTheme: {
    fontSize: 12,
    color: "#F2D06B",
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 1,
  },
  readCardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F5EFE6",
    marginBottom: 12,
    textAlign: "center",
  },
  readCardMessage: {
    fontSize: 15,
    color: "#A89BC2",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  luckyRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  luckyItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(242,208,107,0.1)",
    borderRadius: 12,
    padding: 10,
  },
  luckyLabel: {
    fontSize: 10,
    color: "#A89BC2",
    marginBottom: 4,
    textAlign: "center",
  },
  luckyValue: {
    fontSize: 13,
    color: "#F2D06B",
    fontWeight: "700",
    textAlign: "center",
  },
  tomorrowText: {
    fontSize: 13,
    color: "rgba(245,239,230,0.5)",
    textAlign: "center",
  },
  drawCardSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  drawCardDescription: {
    fontSize: 14,
    color: "#A89BC2",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  drawCardButton: {
    width: width - 80,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#F2D06B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  drawCardButtonGradient: {
    paddingVertical: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  drawCardButtonEmoji: {
    fontSize: 28,
  },
  drawCardButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C1654",
    letterSpacing: 1,
  },
  subscribeSection: {
    backgroundColor: "rgba(123,94,167,0.2)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(155,126,199,0.4)",
  },
  subscribeSectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F2D06B",
    marginBottom: 12,
  },
  subscribeSectionText: {
    fontSize: 14,
    color: "#A89BC2",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  subscribeButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },
  subscribeButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F5EFE6",
  },
  groupMessageCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  groupMessageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F2D06B",
    marginBottom: 8,
  },
  groupMessageText: {
    fontSize: 12,
    color: "#E8A87C",
    marginBottom: 10,
    lineHeight: 18,
  },
  groupMessageDescription: {
    fontSize: 13,
    color: "rgba(245,239,230,0.6)",
    lineHeight: 20,
  },
});
