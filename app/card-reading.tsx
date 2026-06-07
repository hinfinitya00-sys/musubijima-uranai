import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { getDailyCard, GROUP_DAILY_MESSAGES } from "@/constants/daily-cards";
import type { DailyReading } from "@/lib/app-context";

const { width, height } = Dimensions.get("window");

type ReadingStep = "intro" | "drawing" | "reveal" | "done";

export default function CardReadingScreen() {
  const { state, saveReading, canReadToday } = useApp();
  const { profile } = state;
  const [step, setStep] = useState<ReadingStep>("intro");
  const [card, setCard] = useState<ReturnType<typeof getDailyCard> | null>(null);
  const [groupMessage, setGroupMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const startDrawing = () => {
    setStep("drawing");
    // カードを決定
    const today = new Date();
    const guideNum = profile?.guideNumber ?? 1;
    const drawnCard = getDailyCard(today, guideNum);
    setCard(drawnCard);

    // グループメッセージをランダムに選ぶ
    const group = profile?.guide?.group ?? "土";
    const messages = GROUP_DAILY_MESSAGES[group] ?? [];
    const msgIndex = (today.getDate() + guideNum) % messages.length;
    setGroupMessage(messages[msgIndex] ?? "");

    // アニメーション
    setTimeout(() => {
      setStep("reveal");
      Animated.parallel([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.6, duration: 400, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]),
      ]).start();
    }, 1500);
  };

  const handleSave = async () => {
    if (!card || !profile) return;
    setIsSaving(true);
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const reading: DailyReading = {
        date: dateStr,
        cardId: card.id,
        cardTitle: card.title,
        cardEmoji: card.emoji,
        cardMessage: card.message,
        cardTheme: card.themeLabel,
        luckyColor: card.luckyColor,
        luckyItem: card.luckyItem,
        luckyNumber: card.luckyNumber,
      };
      await saveReading(reading);
      setStep("done");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const cardScale = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.05, 1],
  });

  const cardOpacity = flipAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  const glowOpacity = glowAnim;

  if (step === "done") {
    return (
      <LinearGradient colors={["#1A0A2E", "#2D1B4E", "#1A0A2E"] as const} style={styles.container}>
        <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
          <View style={styles.doneContainer}>
            <Text style={styles.doneEmoji}>✨</Text>
            <Text style={styles.doneTitle}>今日のカードを受け取りました</Text>
            <Text style={styles.doneSubtitle}>また明日、新しいカードが届きます</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.replace("/(tabs)")}
            >
              <LinearGradient
                colors={["#F2D06B", "#E8A87C"] as const}
                style={styles.closeButtonGradient}
              >
                <Text style={styles.closeButtonText}>ホームに戻る</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1A0A2E", "#2D1B4E", "#1A0A2E"] as const} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>今日のカード</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {step === "intro" && (
            <View style={styles.introContainer}>
              <Text style={styles.introEmoji}>🃏</Text>
              <Text style={styles.introTitle}>
                今日のメッセージを{"\n"}受け取りましょう
              </Text>
              <Text style={styles.introSubtitle}>
                心を静めて、カードに触れてください。{"\n"}
                今日のあなたへの言葉が届きます。
              </Text>
              <TouchableOpacity style={styles.drawButton} onPress={startDrawing}>
                <LinearGradient
                  colors={["#F2D06B", "#E8A87C"] as const}
                  style={styles.drawButtonGradient}
                >
                  <Text style={styles.drawButtonText}>カードに触れる</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {step === "drawing" && (
            <View style={styles.drawingContainer}>
              <Text style={styles.drawingEmoji}>✨</Text>
              <Text style={styles.drawingText}>カードを引いています...</Text>
              <View style={styles.cardBack}>
                <Text style={styles.cardBackEmoji}>🌟</Text>
              </View>
            </View>
          )}

          {(step === "reveal") && card && (
            <>
              <Animated.View
                style={[
                  styles.revealContainer,
                  { transform: [{ scale: cardScale }], opacity: cardOpacity },
                ]}
              >
                {/* グロー効果 */}
                <Animated.View
                  pointerEvents="none"
                  style={[styles.glowEffect, { opacity: glowOpacity }]}
                />

                {/* カード */}
                <View style={styles.revealCard}>
                  <LinearGradient
                    colors={["rgba(242,208,107,0.2)", "rgba(123,94,167,0.3)"] as const}
                    style={styles.revealCardGradient}
                  >
                    <Text style={styles.revealCardEmoji}>{card.emoji}</Text>
                    <Text style={styles.revealCardTheme}>{card.themeLabel}</Text>
                    <Text style={styles.revealCardTitle}>{card.title}</Text>
                    <Text style={styles.revealCardMessage}>{card.message}</Text>
                    <Text style={styles.revealCardAdvice}>{card.advice}</Text>

                    {groupMessage ? (
                      <View style={styles.groupMessageBox}>
                        <Text style={styles.groupMessageText}>{groupMessage}</Text>
                      </View>
                    ) : null}

                    <View style={styles.luckySection}>
                      <View style={styles.luckyItem}>
                        <Text style={styles.luckyLabel}>ラッキーカラー</Text>
                        <Text style={styles.luckyValue}>{card.luckyColor}</Text>
                      </View>
                      <View style={styles.luckyDivider} />
                      <View style={styles.luckyItem}>
                        <Text style={styles.luckyLabel}>ラッキーアイテム</Text>
                        <Text style={styles.luckyValue}>{card.luckyItem}</Text>
                      </View>
                      <View style={styles.luckyDivider} />
                      <View style={styles.luckyItem}>
                        <Text style={styles.luckyLabel}>ラッキーナンバー</Text>
                        <Text style={styles.luckyValue}>{card.luckyNumber}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </Animated.View>

              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={["#7B5EA7", "#9B7EC7"] as const}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? "保存中..." : "このメッセージを受け取る ✨"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  introContainer: {
    alignItems: "center",
    gap: 16,
  },
  introEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F5EFE6",
    textAlign: "center",
    lineHeight: 34,
  },
  introSubtitle: {
    fontSize: 15,
    color: "#A89BC2",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  drawButton: {
    width: width - 80,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#F2D06B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  drawButtonGradient: {
    paddingVertical: 20,
    alignItems: "center",
  },
  drawButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C1654",
  },
  drawingContainer: {
    alignItems: "center",
    gap: 20,
  },
  drawingEmoji: {
    fontSize: 40,
  },
  drawingText: {
    fontSize: 18,
    color: "#F2D06B",
    fontWeight: "600",
  },
  cardBack: {
    width: 160,
    height: 240,
    backgroundColor: "rgba(123,94,167,0.4)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(242,208,107,0.4)",
  },
  cardBackEmoji: {
    fontSize: 60,
  },
  revealContainer: {
    alignItems: "center",
    width: "100%",
    gap: 20,
  },
  glowEffect: {
    position: "absolute",
    width: width - 40,
    height: height * 0.6,
    backgroundColor: "rgba(242,208,107,0.05)",
    borderRadius: 30,
  },
  revealCard: {
    width: width - 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.4)",
    shadowColor: "#F2D06B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  revealCardGradient: {
    padding: 28,
    alignItems: "center",
  },
  revealCardEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  revealCardTheme: {
    fontSize: 12,
    color: "#F2D06B",
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },
  revealCardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F5EFE6",
    textAlign: "center",
    marginBottom: 16,
  },
  revealCardMessage: {
    fontSize: 15,
    color: "#D4C5E8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 12,
  },
  revealCardAdvice: {
    fontSize: 14,
    color: "#E8A87C",
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 16,
  },
  groupMessageBox: {
    backgroundColor: "rgba(242,208,107,0.1)",
    borderRadius: 12,
    padding: 12,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.3)",
  },
  groupMessageText: {
    fontSize: 14,
    color: "#F2D06B",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
  },
  luckySection: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  luckyItem: {
    flex: 1,
    alignItems: "center",
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
  luckyDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  saveButton: {
    width: width - 80,
    borderRadius: 30,
    overflow: "hidden",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F5EFE6",
  },
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  doneEmoji: {
    fontSize: 80,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F5EFE6",
    textAlign: "center",
  },
  doneSubtitle: {
    fontSize: 15,
    color: "#A89BC2",
    textAlign: "center",
    lineHeight: 24,
  },
  closeButton: {
    width: width - 80,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 16,
  },
  closeButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C1654",
  },
});
