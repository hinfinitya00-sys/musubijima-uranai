import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { usePlanGate } from "@/hooks/usePlanGate";
import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";

export default function SettingsScreen() {
  const { state } = useApp();
  const { profile } = state;
  const { isStandard, isTrialActive, trialDaysLeft } = usePlanGate();
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setIsSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('エラー', 'ログアウトできませんでした。もう一度お試しください。');
      return;
    }
    router.replace('/(auth)/login' as never);
  };

  const handleManageSubscription = async () => {
    if (!isStandard) {
      router.push('/subscription/plans' as never);
      return;
    }

    setIsOpeningPortal(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push({ pathname: '/(auth)/login', params: { next: '/settings' } } as never);
        return;
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-customer-portal`,
        { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error ?? '契約管理画面を開けませんでした。');
      if (Platform.OS === 'web') window.location.href = result.url;
      else await Linking.openURL(result.url);
    } catch (error) {
      Alert.alert('エラー', error instanceof Error ? error.message : '契約管理画面を開けませんでした。');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const handleChangeProfile = () => {
    Alert.alert(
      "誕生日を変更",
      "誕生日を変更すると、ガイドが変わる場合があります。変更しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "変更する", onPress: () => router.push("/(auth)/register") },
      ]
    );
  };

  return (
    <LinearGradient colors={["#FFFAF9", "#FDF1F3", "#FFFAF9"] as const} style={styles.container}>
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
              {isStandard ? (
                <>
                  <View style={styles.subscribedBadge}>
                    <Text style={styles.subscribedBadgeEmoji}>✅</Text>
                    <Text style={styles.subscribedBadgeText}>月額会員（¥330/月）</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.manageButton, isOpeningPortal && { opacity: 0.5 }]}
                    onPress={handleManageSubscription}
                    disabled={isOpeningPortal}
                  >
                    <Text style={styles.manageButtonText}>{isOpeningPortal ? '読み込み中...' : '契約・支払い方法・解約を管理'}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {isTrialActive ? (
                    <View style={styles.trialInfo}>
                      <Text style={styles.trialInfoEmoji}>⏱️</Text>
                      <Text style={styles.trialInfoText}>
                        トライアル期間中（残り{trialDaysLeft}日）
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.trialExpired}>
                      <Text style={styles.trialExpiredText}>無料プラン利用中</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={handleManageSubscription}
                  >
                    <LinearGradient
                      colors={["#E8758A", "#C45070"] as const}
                      style={styles.subscribeButtonGradient}
                    >
                      <Text style={styles.subscribeButtonText}>月額330円で始める ✨</Text>
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

          {/* 法的情報 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>法的情報</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => router.push('/legal/tokutei' as never)}
              >
                <Text style={styles.linkRowText}>特定商取引法に基づく表記</Text>
                <Text style={styles.linkRowArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isSignedIn && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>ログアウト</Text>
            </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3D1A1A",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C45070",
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F9C0CC",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#7A6A6A",
  },
  infoValue: {
    fontSize: 14,
    color: "#3D1A1A",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#FDF1F3",
  },
  changeButton: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FDF1F3",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F9C0CC",
    marginTop: 4,
  },
  changeButtonText: {
    fontSize: 14,
    color: "#C45070",
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
    color: "#16803A",
  },
  subscriptionDate: {
    fontSize: 13,
    color: "#7A6A6A",
    textAlign: "center",
  },
  manageButton: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FDF1F3",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F9C0CC",
  },
  manageButtonText: {
    fontSize: 14,
    color: "#C45070",
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
    color: "#FFFFFF",
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
    color: "#3D1A1A",
  },
  appInfoVersion: {
    fontSize: 13,
    color: "#7A6A6A",
  },
  appInfoDescription: {
    fontSize: 13,
    color: "#7A6A6A",
    lineHeight: 22,
  },
  copyrightText: {
    fontSize: 12,
    color: "#9C8A8A",
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  linkRowText: {
    fontSize: 14,
    color: "#C45070",
    fontWeight: "500",
  },
  linkRowArrow: {
    fontSize: 18,
    color: "#C45070",
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F9C0CC',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  logoutButtonText: { color: '#C45070', fontSize: 14, fontWeight: '600' },
});
