import "@/global.css";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { AppProvider } from "@/lib/app-context";
import * as SplashScreen from "expo-splash-screen";
import { useAppFonts } from "../hooks/use-app-fonts";

// Webは静的HTMLから描画するため、ネイティブ専用のスプラッシュ制御を実行しない。
// SSR中に起動制御を走らせるとSuspense境界が完了せず、hydrationエラーになる。
if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export default function RootLayout() {
  // 静的HTML生成時とブラウザ初回描画時の値を一致させる。
  // WebでinitialWindowMetricsを直接使うと実画面サイズだけがクライアント側へ入り、
  // 全ルートでHydrationが失敗するため、初回は0固定してuseEffectで更新する。
  const initialInsets = Platform.OS === "web"
    ? DEFAULT_WEB_INSETS
    : initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = Platform.OS === "web"
    ? DEFAULT_WEB_FRAME
    : initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Noto Serif JP（見出し）/ Noto Sans JP（本文）のロード
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    if (Platform.OS !== "web" && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Ensure minimum 8px padding for top and bottom on mobile
  const providerInitialMetrics = useMemo(() => {
    const metrics = Platform.OS === "web"
      ? { insets: initialInsets, frame: initialFrame }
      : initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);

  // フォント未ロード時はスプラッシュを維持（描画しない）
  if (!fontsLoaded && !fontError) {
    return null;
  }

  const navigation = Platform.OS === "web" ? (
    <Slot />
  ) : (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="oauth/callback" />
      <Stack.Screen name="card-reading" options={{ presentation: "fullScreenModal" }} />
      <Stack.Screen name="subscription" options={{ presentation: "fullScreenModal" }} />
    </Stack>
  );

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
          {navigation}
          <StatusBar style="auto" />
      </AppProvider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={providerInitialMetrics}>
          <SafeAreaFrameContext.Provider value={frame}>
            <SafeAreaInsetsContext.Provider value={insets}>
              {content}
            </SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>
    </ThemeProvider>
  );
}
