import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";

export default function SettingsScreen() {
  const { state, subscribe } = useApp();
  const { profile, subscription } = state;

  const handleManageSubscription = () => {
    router.push("/subscription");
  };

  const handleChangeProfile = () => {
    Alert.alert(
      "誕生日を変更",
      "誕生日を変更すると、ガイドが変わる場合があります。変更しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "変更する", onPress: () => router.push("/onboarding") },
      ]
    );
  };

  return (
    <LinearGradient colors={["#1A0A2E", "#2D1B4E", "#1A0A2E"] as const} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>設定</Text>

          {/* プロフィール情報 */}
          {profile?.setupCompleted && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>プロフィール</Text>
              <View style={styles.card}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>誕生日</Text>
                  <Text style={styles.infoValue}>
                    {profile.birthYear}年 {profile.birthMonth}月 {profile.birthDay}日
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ガイド数</Text>
                  <Text style={styles.infoValue}>{profile.guideNumber}</Text>
                </View>
                {profile.guide && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>ガイド</Text>
                      <Text style={styles.infoValue}>{profile.guide.name}</Text>
                    </View>
                  </>
                )}
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={handleChangeProfile}
                >
                  <Text style={styles.changeButtonText}>誕生日を変更する</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* サブスクリプション */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>サブスクリプション</Text>
            <View style={styles.card}>
              {subscription.isSubscribed ? (
                <>
                  <View style={styles.subscribedBadge}>
                    <Text style={styles.subscribedBadgeEmoji}>✅</Text>
                    <Text style={styles.subscribedBadgeText}>月額会員（¥980/月）</Text>
                  </View>
                  {subscription.subscriptionStartDate && (
                    <Text style={styles.subscriptionDate}>
                      登録日：{new Date(subscription.subscriptionStartDate).toLocaleDateString("ja-JP")}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.manageButton}
                    onPress={handleManageSubscription}
                  >
                    <Text style={styles.manageButtonText}>サブスクリプションを管理</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {subscription.trialDaysRemaining > 0 ? (
                    <View style={styles.trialInfo}>
                      <Text style={styles.trialInfoEmoji}>⏱️</Text>
                      <Text style={styles.trialInfoText}>
                        トライアル期間中（残り{subscription.trialDaysRemaining}日）
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.trialExpired}>
                      <Text style={styles.trialExpiredText}>
                        トライアル期間が終了しました
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={handleManageSubscription}
                  >
                    <LinearGradient
                      colors={["#7B5EA7", "#9B7EC7"] as const}
                      style={styles.subscribeButtonGradient}
                    >
                      <Text style={styles.subscribeButtonText}>月額980円で始める ✨</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* アプリ情報 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>アプリについて</Text>
            <View style={styles.card}>
              <View style={styles.appInfoHeader}>
                <Text style={styles.appInfoEmoji}>🏝️</Text>
                <View>
                  <Text style={styles.appInfoTitle}>むすび島 数秘術占い</Text>
                  <Text style={styles.appInfoVersion}>バージョン 1.0.0</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.appInfoDescription}>
                「むすび島数秘術占い」は、生年月日から算出したライフパス数をもとに、
                あなただけのむすび族キャラクターとつながり、毎日ポジティブなメッセージをお届けするアプリです。
              </Text>
              <View style={styles.divider} />
              <Text style={styles.copyrightText}>
                占いコンテンツ：むすび島{"\n"}
                © 2024 むすび島 数秘術占い
              </Text>
            </View>
          </View>

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
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F5EFE6",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A89BC2",
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(155,126,199,0.25)",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#A89BC2",
  },
  infoValue: {
    fontSize: 14,
    color: "#F5EFE6",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  changeButton: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginTop: 4,
  },
  changeButtonText: {
    fontSize: 14,
    color: "#A89BC2",
    fontWeight: "600",
  },
  subscribedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(34,197,94,0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  subscribedBadgeEmoji: {
    fontSize: 20,
  },
  subscribedBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4ADE80",
  },
  subscriptionDate: {
    fontSize: 13,
    color: "#A89BC2",
    textAlign: "center",
  },
  manageButton: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  manageButtonText: {
    fontSize: 14,
    color: "#A89BC2",
    fontWeight: "600",
  },
  trialInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(232,168,124,0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(232,168,124,0.3)",
  },
  trialInfoEmoji: {
    fontSize: 20,
  },
  trialInfoText: {
    fontSize: 14,
    color: "#E8A87C",
    fontWeight: "600",
  },
  trialExpired: {
    backgroundColor: "rgba(192,57,43,0.1)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(192,57,43,0.3)",
  },
  trialExpiredText: {
    fontSize: 14,
    color: "#E74C3C",
    fontWeight: "600",
    textAlign: "center",
  },
  subscribeButton: {
    borderRadius: 24,
    overflow: "hidden",
  },
  subscribeButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F5EFE6",
  },
  appInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  appInfoEmoji: {
    fontSize: 36,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F5EFE6",
  },
  appInfoVersion: {
    fontSize: 13,
    color: "#A89BC2",
  },
  appInfoDescription: {
    fontSize: 13,
    color: "rgba(245,239,230,0.6)",
    lineHeight: 22,
  },
  copyrightText: {
    fontSize: 12,
    color: "rgba(245,239,230,0.4)",
    lineHeight: 20,
  },
});
