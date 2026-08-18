import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import type { DailyReading } from "@/lib/app-context";

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
}

function HistoryCard({ item }: { item: DailyReading }) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardHeader}>
        <Text style={styles.historyCardEmoji}>{item.cardEmoji}</Text>
        <View style={styles.historyCardHeaderText}>
          <Text style={styles.historyCardDate}>{formatDate(item.date)}</Text>
          <Text style={styles.historyCardTheme}>{item.cardTheme}</Text>
        </View>
      </View>
      <Text style={styles.historyCardTitle}>{item.cardTitle}</Text>
      <Text style={styles.historyCardMessage}>{item.cardMessage}</Text>
      <View style={styles.historyCardLucky}>
        <Text style={styles.historyCardLuckyText}>
          🎨 {item.luckyColor}　✨ {item.luckyItem}　🔢 {item.luckyNumber}
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { state } = useApp();
  const { readingHistory, isLoading } = state;

  // 新しい順に並べ替え
  const sortedHistory = [...readingHistory].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  if (isLoading) {
    return (
      <LinearGradient colors={["#FFFAF9", "#FDF1F3"] as const} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FFFAF9", "#FDF1F3", "#FFFAF9"] as const} style={styles.container}>
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>占い履歴</Text>
          <Text style={styles.pageSubtitle}>
            {sortedHistory.length > 0
              ? `${sortedHistory.length}日分の記録`
              : "まだ記録がありません"}
          </Text>
        </View>

        {sortedHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🃏</Text>
            <Text style={styles.emptyTitle}>まだカードを引いていません</Text>
            <Text style={styles.emptySubtitle}>
              毎日1枚カードを引くと、{"\n"}ここに履歴が表示されます
            </Text>
            <TouchableOpacity
              style={styles.drawButton}
              onPress={() => router.push("/card-reading")}
            >
              <LinearGradient
                colors={["#F2D06B", "#E8A87C"] as const}
                style={styles.drawButtonGradient}
              >
                <Text style={styles.drawButtonText}>今日のカードを引く</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sortedHistory}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => <HistoryCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3D1A1A",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#7A6A6A",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D1A1A",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#7A6A6A",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  drawButton: {
    borderRadius: 24,
    overflow: "hidden",
  },
  drawButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: "center",
  },
  drawButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3D1A1A",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F9C0CC",
  },
  historyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  historyCardEmoji: {
    fontSize: 36,
  },
  historyCardHeaderText: {
    flex: 1,
  },
  historyCardDate: {
    fontSize: 13,
    color: "#7A6A6A",
    marginBottom: 2,
  },
  historyCardTheme: {
    fontSize: 12,
    color: "#F2D06B",
    fontWeight: "600",
    letterSpacing: 1,
  },
  historyCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3D1A1A",
    marginBottom: 8,
  },
  historyCardMessage: {
    fontSize: 14,
    color: "#7A6A6A",
    lineHeight: 22,
    marginBottom: 12,
  },
  historyCardLucky: {
    backgroundColor: "rgba(242,208,107,0.1)",
    borderRadius: 10,
    padding: 10,
  },
  historyCardLuckyText: {
    fontSize: 13,
    color: "#F2D06B",
    textAlign: "center",
  },
});
