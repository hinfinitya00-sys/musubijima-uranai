import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";

const { width } = Dimensions.get("window");

const FEATURES = [
  { emoji: "🃏", title: "毎日のカード占い", desc: "毎日1枚、あなただけのメッセージカードを引けます" },
  { emoji: "✨", title: "ガイドからのメッセージ", desc: "あなたのガイドからの特別なメッセージが届きます" },
  { emoji: "📅", title: "占い履歴の保存", desc: "過去のカード占い結果をいつでも振り返れます" },
  { emoji: "🌟", title: "ポジティブな言葉だけ", desc: "気持ちが上がる言葉だけをお届けします" },
  { emoji: "🏝️", title: "ありが島の世界観", desc: "4つの島（土・風・水・火）の神秘的な世界を体験" },
];

export default function SubscriptionScreen() {
  const { state, subscribe } = useApp();
  const { subscription } = state;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      // 実際のアプリではApp Store/Google Playの課金処理を実装
      // ここではデモとして即時課金済みにする
      await subscribe();
      Alert.alert(
        "ご登録ありがとうございます！",
        "月額会員へのご登録が完了しました。\nありが島の世界をお楽しみください ✨",
        [
          {
            text: "ありが島へ",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    } catch (e) {
      Alert.alert("エラー", "登録処理中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LinearGradient colors={["#1A0A2E", "#2D1B4E", "#1A0A2E"] as const} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>月額会員</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* メインビジュアル */}
          <View style={styles.heroSection}>
            <Text style={styles.heroEmoji}>🏝️</Text>
            <Text style={styles.heroTitle}>ありが島 月額会員</Text>
            <Text style={styles.heroSubtitle}>
              毎日の占いで、あなたの可能性を{"\n"}最大限に引き出しましょう
            </Text>
          </View>

          {/* 価格 */}
          <LinearGradient
            colors={["rgba(242,208,107,0.2)", "rgba(232,168,124,0.2)"] as const}
            style={styles.priceCard}
          >
            <Text style={styles.priceLabel}>月額料金</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceCurrency}>¥</Text>
              <Text style={styles.priceAmount}>980</Text>
              <Text style={styles.pricePeriod}>/月</Text>
            </View>
            <Text style={styles.priceTax}>（税込）</Text>
            {subscription.trialDaysRemaining > 0 && !subscription.isSubscribed && (
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>
                  ✨ 現在トライアル期間中（残り{subscription.trialDaysRemaining}日）
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* 機能一覧 */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresSectionTitle}>会員特典</Text>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 登録ボタン */}
          {subscription.isSubscribed ? (
            <View style={styles.alreadySubscribed}>
              <Text style={styles.alreadySubscribedEmoji}>✅</Text>
              <Text style={styles.alreadySubscribedText}>月額会員に登録済みです</Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/(tabs)")}
              >
                <Text style={styles.backButtonText}>ホームに戻る</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.subscribeButton, isProcessing && styles.subscribeButtonDisabled]}
              onPress={handleSubscribe}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={["#F2D06B", "#E8A87C"] as const}
                style={styles.subscribeButtonGradient}
              >
                <Text style={styles.subscribeButtonText}>
                  {isProcessing ? "処理中..." : "月額980円で始める ✨"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* 注意事項 */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>ご利用について</Text>
            <Text style={styles.notesText}>
              • 月額980円（税込）が毎月自動更新されます{"\n"}
              • いつでもキャンセル可能です{"\n"}
              • 解約後も当月末まではご利用いただけます{"\n"}
              • 課金はApp Store / Google Playを通じて行われます
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  closeBtnText: {
    fontSize: 16,
    color: "#F5EFE6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5EFE6",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F5EFE6",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#A89BC2",
    textAlign: "center",
    lineHeight: 24,
  },
  priceCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.4)",
  },
  priceLabel: {
    fontSize: 14,
    color: "#A89BC2",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  priceCurrency: {
    fontSize: 24,
    color: "#F2D06B",
    fontWeight: "700",
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 56,
    fontWeight: "800",
    color: "#F2D06B",
    lineHeight: 64,
  },
  pricePeriod: {
    fontSize: 18,
    color: "#A89BC2",
    marginBottom: 10,
  },
  priceTax: {
    fontSize: 12,
    color: "#A89BC2",
    marginTop: 4,
  },
  trialBadge: {
    marginTop: 12,
    backgroundColor: "rgba(123,94,167,0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(155,126,199,0.4)",
  },
  trialBadgeText: {
    fontSize: 13,
    color: "#9B7EC7",
    fontWeight: "600",
    textAlign: "center",
  },
  featuresSection: {
    marginBottom: 28,
  },
  featuresSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5EFE6",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F5EFE6",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: "#A89BC2",
    lineHeight: 20,
  },
  alreadySubscribed: {
    alignItems: "center",
    backgroundColor: "rgba(34,197,94,0.1)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
    gap: 12,
  },
  alreadySubscribedEmoji: {
    fontSize: 40,
  },
  alreadySubscribedText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4ADE80",
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 15,
    color: "#F5EFE6",
    fontWeight: "600",
  },
  subscribeButton: {
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#F2D06B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonGradient: {
    paddingVertical: 20,
    alignItems: "center",
  },
  subscribeButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C1654",
    letterSpacing: 0.5,
  },
  notesSection: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A89BC2",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 13,
    color: "rgba(245,239,230,0.5)",
    lineHeight: 22,
  },
});
