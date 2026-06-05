import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2;

interface FortuneCard {
  id: string;
  title: string;
  description: string;
  route: string;
  imageUrl: string;
}

const FORTUNE_CARDS: FortuneCard[] = [
  {
    id: "omikuji",
    title: "おみくじ",
    description: "今日の運勢を占う",
    route: "/fortune/omikuji",
    imageUrl: "https://musubijima.com/wp-content/uploads/2021/04/musubi_top_omikuji.jpg",
  },
  {
    id: "negative-god",
    title: "ネガティブ神占い",
    description: "心のネガティブを出し抜く",
    route: "/fortune/negative-god",
    imageUrl: "https://musubijima.com/wp-content/uploads/2021/04/musubi_top_negativ.jpg",
  },
  {
    id: "mitama",
    title: "み・たまカード",
    description: "直感でメッセージを受け取る",
    route: "/fortune/mitama",
    imageUrl: "https://musubijima.com/wp-content/uploads/2021/04/musubi_top_mitama.jpg",
  },
  {
    id: "musubian",
    title: "むすび族占い",
    description: "相性を診断する",
    route: "/fortune/musubian",
    imageUrl: "https://musubijima.com/wp-content/uploads/2021/03/contents_header.jpg",
  },
];

function CardImage({ uri, alt }: { uri: string; alt: string }) {
  if (Platform.OS === "web") {
    return (
      <img
        src={uri}
        alt={alt}
        style={{
          width: "100%",
          height: CARD_WIDTH * 0.7,
          objectFit: "cover",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: "block",
        } as any}
      />
    );
  }
  return (
    <Image
      source={{ uri }}
      style={styles.cardImage}
      resizeMode="cover"
    />
  );
}

export default function HomeScreen() {
  const { state, hasAccess } = useApp();
  const { subscription, isLoading } = state;

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

  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ロゴ＋日付ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.logoText}>むすび島</Text>
            <Text style={styles.logoSubtext}>MUSUBIJIMA</Text>
            <Text style={styles.dateText}>
              {todayStr}（{weekday}）
            </Text>
          </View>

          {/* 占いカードグリッド */}
          <View style={styles.cardGrid}>
            {FORTUNE_CARDS.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.card}
                onPress={() => router.push(card.route as never)}
                activeOpacity={0.8}
              >
                <CardImage uri={card.imageUrl} alt={card.title} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 下部CTA */}
          {!subscription.isSubscribed && (
            <TouchableOpacity
              style={styles.ctaSection}
              onPress={() => router.push("/subscription/plans")}
            >
              <LinearGradient colors={["#E8C547", "#F59E0B"]} style={styles.ctaGradient}>
                <Text style={styles.ctaTitle}>月額980円で全機能解放</Text>
                <Text style={styles.ctaSubtitle}>
                  スタンダードプランで全ての占いを無制限に
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 18, color: "#4C1D95" },
  scrollContent: { padding: 20, paddingTop: 8 },

  // Header
  header: { alignItems: "center", marginBottom: 28, paddingTop: 8 },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#4C1D95",
    letterSpacing: 6,
  },
  logoSubtext: {
    fontSize: 11,
    color: "#6D28D9",
    letterSpacing: 8,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Card Grid
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    marginBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 0.7,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardBody: {
    padding: 12,
    paddingTop: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
  },

  // CTA
  ctaSection: { borderRadius: 16, overflow: "hidden" },
  ctaGradient: { padding: 20, alignItems: "center" },
  ctaTitle: { fontSize: 16, fontWeight: "800", color: "#1F2937", marginBottom: 4 },
  ctaSubtitle: { fontSize: 13, color: "#374151" },
});
