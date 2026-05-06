import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/lib/app-context";
import { calculateGuideNumber, getGuideByNumber, GROUP_DESCRIPTIONS } from "@/constants/guides-data";

const { width, height } = Dimensions.get("window");

const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function OnboardingScreen() {
  const { setupProfile } = useApp();
  const [step, setStep] = useState<"input" | "result">("input");
  const [selectedYear, setSelectedYear] = useState(1990);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [guideNumber, setGuideNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    const num = calculateGuideNumber(selectedYear, selectedMonth, selectedDay);
    setGuideNumber(num);
    setStep("result");
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await setupProfile(selectedYear, selectedMonth, selectedDay);
      router.replace("/(tabs)");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const guide = guideNumber ? getGuideByNumber(guideNumber) : null;
  const groupInfo = guide ? GROUP_DESCRIPTIONS[guide.group] : null;

  const groupColors: Record<string, [string, string]> = {
    earth: ["#8B6914", "#C9A227"],
    wind: ["#2E8B57", "#52C78A"],
    water: ["#1E6FA8", "#4A9FD8"],
    fire: ["#C0392B", "#E74C3C"],
  };

  const gradientColors = guide
    ? groupColors[guide.groupEn] ?? ["#7B5EA7", "#9B7EC7"]
    : ["#7B5EA7", "#9B7EC7"];

  if (step === "result" && guide && groupInfo) {
    return (
      <LinearGradient colors={["#1A0A2E", "#2D1B4E", "#1A0A2E"] as const} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>あなたのガイドが見つかりました</Text>
          </View>

          {/* ガイド数 */}
          <LinearGradient colors={gradientColors as [string, string]} style={styles.guideNumberBadge}>
            <Text style={styles.guideNumberLabel}>ガイド数</Text>
            <Text style={styles.guideNumber}>{guideNumber}</Text>
          </LinearGradient>

          {/* グループ */}
          <View style={styles.groupCard}>
            <Text style={styles.groupEmoji}>{groupInfo.emoji}</Text>
            <Text style={[styles.groupName, { color: groupInfo.color }]}>{groupInfo.title}</Text>
            <Text style={styles.groupSubtitle}>「{groupInfo.subtitle}」</Text>
            <Text style={styles.groupDescription}>{groupInfo.description}</Text>
          </View>

          {/* ガイド名 */}
          <View style={styles.guideCard}>
            <Text style={styles.guideLabel}>あなたのガイド</Text>
            <Text style={styles.guideName}>{guide.name}</Text>
            <View style={styles.featuresContainer}>
              {guide.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✦</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.guideDescription}>{guide.description}</Text>
          </View>

          {/* ポジティブメッセージ */}
          <View style={styles.messageCard}>
            <Text style={styles.messageEmoji}>💫</Text>
            <Text style={styles.messageText}>{guide.positiveMessage}</Text>
          </View>

          {/* 開始ボタン */}
          <TouchableOpacity
            style={[styles.startButton, isLoading && styles.startButtonDisabled]}
            onPress={handleComplete}
            disabled={isLoading}
          >
            <LinearGradient colors={["#F2D06B", "#E8A87C"] as const} style={styles.startButtonGradient}>
              <Text style={styles.startButtonText}>
                {isLoading ? "設定中..." : "むすび島へ出発する ✨"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1A0A2E", "#2D1B4E", "#1A0A2E"] as const} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ロゴ・タイトル */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🏝️</Text>
          <Text style={styles.appTitle}>むすび島</Text>
          <Text style={styles.appSubtitle}>誕生日占い</Text>
          <Text style={styles.appDescription}>
            生年月日から、あなただけのガイドを見つけましょう
          </Text>
        </View>

        {/* 計算方法の説明 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ガイド数の計算方法</Text>
          <Text style={styles.infoText}>
            生年月日の数字をすべて足し合わせた合計が「ガイド数」です。
          </Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>例：1972年1月10日生まれの場合</Text>
            <Text style={styles.exampleCalc}>1+9+7+2+1+1+0 = 21</Text>
            <Text style={styles.exampleResult}>ガイド数：21</Text>
          </View>
        </View>

        {/* 誕生日入力 */}
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>あなたの生年月日を入力してください</Text>

          {/* 年 */}
          <View style={styles.pickerSection}>
            <Text style={styles.pickerLabel}>年</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerRow}
            >
              {YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[styles.pickerItem, selectedYear === y && styles.pickerItemSelected]}
                  onPress={() => setSelectedYear(y)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedYear === y && styles.pickerItemTextSelected,
                    ]}
                  >
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 月 */}
          <View style={styles.pickerSection}>
            <Text style={styles.pickerLabel}>月</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerRow}
            >
              {MONTHS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.pickerItem, selectedMonth === m && styles.pickerItemSelected]}
                  onPress={() => setSelectedMonth(m)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedMonth === m && styles.pickerItemTextSelected,
                    ]}
                  >
                    {m}月
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 日 */}
          <View style={styles.pickerSection}>
            <Text style={styles.pickerLabel}>日</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerRow}
            >
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.pickerItem, selectedDay === d && styles.pickerItemSelected]}
                  onPress={() => setSelectedDay(d)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedDay === d && styles.pickerItemTextSelected,
                    ]}
                  >
                    {d}日
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 選択中の日付表示 */}
          <View style={styles.selectedDateBox}>
            <Text style={styles.selectedDateText}>
              {selectedYear}年 {selectedMonth}月 {selectedDay}日
            </Text>
          </View>
        </View>

        {/* 占うボタン */}
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <LinearGradient colors={["#7B5EA7", "#9B7EC7"] as const} style={styles.calculateButtonGradient}>
            <Text style={styles.calculateButtonText}>ガイドを見つける ✨</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F2D06B",
    textAlign: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#F5EFE6",
    letterSpacing: 4,
  },
  appSubtitle: {
    fontSize: 18,
    color: "#F2D06B",
    marginTop: 4,
    letterSpacing: 2,
  },
  appDescription: {
    fontSize: 14,
    color: "#A89BC2",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.3)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F2D06B",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#A89BC2",
    lineHeight: 20,
    marginBottom: 12,
  },
  exampleBox: {
    backgroundColor: "rgba(242,208,107,0.1)",
    borderRadius: 12,
    padding: 12,
  },
  exampleText: {
    fontSize: 13,
    color: "#F5EFE6",
    marginBottom: 4,
  },
  exampleCalc: {
    fontSize: 16,
    color: "#F2D06B",
    fontWeight: "600",
    marginBottom: 4,
  },
  exampleResult: {
    fontSize: 14,
    color: "#E8A87C",
    fontWeight: "700",
  },
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(155,126,199,0.3)",
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F5EFE6",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerSection: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#A89BC2",
    marginBottom: 8,
    fontWeight: "600",
  },
  pickerRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(155,126,199,0.3)",
  },
  pickerItemSelected: {
    backgroundColor: "#7B5EA7",
    borderColor: "#F2D06B",
  },
  pickerItemText: {
    fontSize: 14,
    color: "#A89BC2",
  },
  pickerItemTextSelected: {
    color: "#F5EFE6",
    fontWeight: "700",
  },
  selectedDateBox: {
    backgroundColor: "rgba(242,208,107,0.15)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.4)",
  },
  selectedDateText: {
    fontSize: 18,
    color: "#F2D06B",
    fontWeight: "700",
  },
  calculateButton: {
    borderRadius: 30,
    overflow: "hidden",
  },
  calculateButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F5EFE6",
    letterSpacing: 1,
  },
  // Result screen styles
  guideNumberBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  guideNumber: {
    fontSize: 48,
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
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  groupSubtitle: {
    fontSize: 16,
    color: "#F2D06B",
    marginBottom: 12,
  },
  groupDescription: {
    fontSize: 14,
    color: "#A89BC2",
    textAlign: "center",
    lineHeight: 22,
  },
  guideCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(155,126,199,0.3)",
  },
  guideLabel: {
    fontSize: 13,
    color: "#A89BC2",
    textAlign: "center",
    marginBottom: 4,
  },
  guideName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F5EFE6",
    textAlign: "center",
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
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
  guideDescription: {
    fontSize: 14,
    color: "#A89BC2",
    lineHeight: 22,
    textAlign: "center",
  },
  messageCard: {
    backgroundColor: "rgba(242,208,107,0.15)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(242,208,107,0.4)",
  },
  messageEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 18,
    color: "#F2D06B",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
  },
  startButton: {
    borderRadius: 30,
    overflow: "hidden",
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C1654",
    letterSpacing: 1,
  },
});
