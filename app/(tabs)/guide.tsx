import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { GROUP_DESCRIPTIONS } from "@/constants/guides-data";

export default function GuideScreen() {
  const { state } = useApp();
  const { profile, isLoading } = state;

  if (isLoading) {
    return (
      <LinearGradient colors={["#1A0A2E", "#2D1B4E"] as const} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!profile?.setupCompleted) {
    return (
      <LinearGradient colors={["#1A0A2E", "#2D1B4E"] as const} style={styles.container}>
        <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🏝️</Text>
            <Text style={styles.emptyTitle}>まずは誕生日を登録しましょう</Text>
            <TouchableOpacity
              style={styles.setupButton}
              onPress={() => router.push("/onboarding")}
            >
              <LinearGradient colors={["#7B5EA7", "#9B7EC7"] as const} style={styles.setupButtonGradient}>
                <Text style={styles.setupButtonText}>登録する</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
      </LinearGradient>
    );
  }

  const guide = profile.guide;
  const groupInfo = guide ? GROUP_DESCRIPTIONS[guide.group] : null;

  const groupColors: Record<string, [string, string, string]> = {
    earth: ["#1A0A00", "#3D2B00", "#8B6914"],
    wind: ["#001A0A", "#002B1A", "#2E8B57"],
    water: ["#00101A", "#001B3D", "#1E6FA8"],
    fire: ["#1A0000", "#3D0000", "#C0392B"],
  };

  const bgColors = guide
    ? (groupColors[guide.groupEn] ?? ["#1A0A2E", "#2D1B4E", "#7B5EA7"])
    : ["#1A0A2E", "#2D1B4E", "#7B5EA7"];

  return (
    <LinearGradient colors={bgColors as [string, string, string]} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* タイトル */}
          <Text style={styles.pageTitle}>私のガイド</Text>

          {/* ガイド数バッジ */}
          {guide && groupInfo && (
            <>
              <LinearGradient
                colors={[groupInfo.color, "#F2D06B"] as [string, string]}
                style={styles.guideNumberBadge}
              >
                <Text style={styles.guideNumberLabel}>ガイド数</Text>
                <Text style={styles.guideNumber}>{profile.guideNumber}</Text>
              </LinearGradient>

              {/* グループカード */}
              <View style={styles.groupCard}>
                <Text style={styles.groupEmoji}>{groupInfo.emoji}</Text>
                <Text style={[styles.groupName, { color: groupInfo.color }]}>
                  {groupInfo.title}
                </Text>
                <Text style={styles.groupSubtitle}>「{groupInfo.subtitle}」</Text>
                <Text style={styles.groupDescription}>{groupInfo.description}</Text>
                <View style={styles.keywordsRow}>
                  {groupInfo.keywords.map((k, i) => (
                    <View key={i} style={styles.keywordBadge}>
                      <Text style={styles.keywordText}>{k}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* ガイドカード */}
              <View style={styles.guideCard}>
                <Text style={styles.guideCardLabel}>あなたのガイド</Text>
                <Text style={styles.guideName}>{guide.name}</Text>
                <Text style={styles.guideDescription}>{guide.description}</Text>

                <View style={styles.divider} />

                <Text style={styles.featuresTitle}>特徴</Text>
                {guide.features.map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Text style={styles.featureBullet}>✦</Text>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* ポジティブメッセージ */}
              <View style={styles.messageCard}>
                <Text style={styles.messageLabel}>✨ あなたへのメッセージ</Text>
                <Text style={styles.messageText}>{guide.positiveMessage}</Text>
              </View>

              {/* 誕生日情報 */}
              <View style={styles.birthdayCard}>
                <Text style={styles.birthdayLabel}>登録された誕生日</Text>
                <Text style={styles.birthdayText}>
                  {profile.birthYear}年 {profile.birthMonth}月 {profile.birthDay}日
                </Text>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => router.push("/onboarding")}
                >
                  <Text style={styles.changeButtonText}>変更する</Text>
                </TouchableOpacity>
              </View>
            </>
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
    fontSize: 16,
    color: "#F2D06B",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5EFE6",
    textAlign: "center",
  },
  setupButton: {
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 8,
  },
  setupButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: "center",
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F5EFE6",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F5EFE6",
    marginBottom: 24,
    textAlign: "center",
  },
  guideNumberBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  guideNumberLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  guideNumber: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  groupCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.3)",
  },
  groupEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  groupName: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  groupSubtitle: {
    fontSize: 15,
    color: "#F2D06B",
    marginBottom: 12,
  },
  groupDescription: {
    fontSize: 14,
    color: "#A89BC2",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  keywordsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  keywordBadge: {
    backgroundColor: "rgba(242,208,107,0.15)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.3)",
  },
  keywordText: {
    fontSize: 13,
    color: "#F2D06B",
    fontWeight: "600",
  },
  guideCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(155,126,199,0.3)",
  },
  guideCardLabel: {
    fontSize: 12,
    color: "#A89BC2",
    textAlign: "center",
    marginBottom: 4,
  },
  guideName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F5EFE6",
    textAlign: "center",
    marginBottom: 12,
  },
  guideDescription: {
    fontSize: 14,
    color: "#A89BC2",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F2D06B",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  featureBullet: {
    color: "#F2D06B",
    fontSize: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    color: "#F5EFE6",
    flex: 1,
    lineHeight: 20,
  },
  messageCard: {
    backgroundColor: "rgba(242,208,107,0.12)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.35)",
  },
  messageLabel: {
    fontSize: 13,
    color: "#E8A87C",
    fontWeight: "600",
    marginBottom: 12,
  },
  messageText: {
    fontSize: 17,
    color: "#F2D06B",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
  },
  birthdayCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 8,
  },
  birthdayLabel: {
    fontSize: 12,
    color: "#A89BC2",
  },
  birthdayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5EFE6",
  },
  changeButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  changeButtonText: {
    fontSize: 13,
    color: "#A89BC2",
    fontWeight: "600",
  },
});
