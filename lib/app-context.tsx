import React, { createContext, useContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateGuideNumber, getGuideByNumber, type Guide } from "@/constants/guides-data";

// ユーザープロフィール
export interface UserProfile {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  guideNumber: number;
  guide: Guide | undefined;
  setupCompleted: boolean;
}

// 課金状態
export interface SubscriptionState {
  isSubscribed: boolean;
  trialStartDate: string | null; // ISO date string
  subscriptionStartDate: string | null;
  trialDaysRemaining: number;
}

// 今日の占い結果
export interface DailyReading {
  date: string; // YYYY-MM-DD
  cardId: string;
  cardTitle: string;
  cardEmoji: string;
  cardMessage: string;
  cardTheme: string;
  luckyColor: string;
  luckyItem: string;
  luckyNumber: number;
}

// アプリ全体の状態
export interface AppState {
  profile: UserProfile | null;
  subscription: SubscriptionState;
  readingHistory: DailyReading[];
  todayReading: DailyReading | null;
  isLoading: boolean;
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PROFILE"; payload: UserProfile }
  | { type: "SET_SUBSCRIPTION"; payload: SubscriptionState }
  | { type: "SET_READING_HISTORY"; payload: DailyReading[] }
  | { type: "SET_TODAY_READING"; payload: DailyReading }
  | { type: "RESET_ALL" };

const TRIAL_DAYS = 7;
const STORAGE_KEYS = {
  PROFILE: "@arigajima/profile",
  SUBSCRIPTION: "@arigajima/subscription",
  READING_HISTORY: "@arigajima/reading_history",
};

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getTrialDaysRemaining(trialStartDate: string | null): number {
  if (!trialStartDate) return TRIAL_DAYS;
  const start = new Date(trialStartDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - diffDays);
}

function initialState(): AppState {
  return {
    profile: null,
    subscription: {
      isSubscribed: false,
      trialStartDate: null,
      subscriptionStartDate: null,
      trialDaysRemaining: TRIAL_DAYS,
    },
    readingHistory: [],
    todayReading: null,
    isLoading: true,
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "SET_SUBSCRIPTION":
      return { ...state, subscription: action.payload };
    case "SET_READING_HISTORY": {
      const today = getTodayString();
      const todayReading = action.payload.find((r) => r.date === today) ?? null;
      return { ...state, readingHistory: action.payload, todayReading };
    }
    case "SET_TODAY_READING": {
      const updatedHistory = [
        ...state.readingHistory.filter((r) => r.date !== action.payload.date),
        action.payload,
      ];
      return { ...state, todayReading: action.payload, readingHistory: updatedHistory };
    }
    case "RESET_ALL":
      return initialState();
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  setupProfile: (year: number, month: number, day: number) => Promise<void>;
  startTrial: () => Promise<void>;
  subscribe: () => Promise<void>;
  saveReading: (reading: DailyReading) => Promise<void>;
  canReadToday: () => boolean;
  hasAccess: () => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, initialState);

  // 初期化：AsyncStorageからデータを読み込む
  useEffect(() => {
    async function loadData() {
      try {
        const [profileJson, subscriptionJson, historyJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION),
          AsyncStorage.getItem(STORAGE_KEYS.READING_HISTORY),
        ]);

        if (profileJson) {
          dispatch({ type: "SET_PROFILE", payload: JSON.parse(profileJson) });
        }

        if (subscriptionJson) {
          const sub: SubscriptionState = JSON.parse(subscriptionJson);
          // トライアル残日数を再計算
          sub.trialDaysRemaining = getTrialDaysRemaining(sub.trialStartDate);
          dispatch({ type: "SET_SUBSCRIPTION", payload: sub });
        }

        if (historyJson) {
          dispatch({ type: "SET_READING_HISTORY", payload: JSON.parse(historyJson) });
        }
      } catch (e) {
        console.error("Failed to load app data:", e);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
    loadData();
  }, []);

  async function setupProfile(year: number, month: number, day: number) {
    const guideNumber = calculateGuideNumber(year, month, day);
    const guide = getGuideByNumber(guideNumber);
    const profile: UserProfile = {
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      guideNumber,
      guide,
      setupCompleted: true,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    dispatch({ type: "SET_PROFILE", payload: profile });

    // 初回セットアップ時にトライアル開始
    const currentSub = state.subscription;
    if (!currentSub.trialStartDate) {
      await startTrial();
    }
  }

  async function startTrial() {
    const sub: SubscriptionState = {
      isSubscribed: false,
      trialStartDate: new Date().toISOString(),
      subscriptionStartDate: null,
      trialDaysRemaining: TRIAL_DAYS,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    dispatch({ type: "SET_SUBSCRIPTION", payload: sub });
  }

  async function subscribe() {
    const sub: SubscriptionState = {
      ...state.subscription,
      isSubscribed: true,
      subscriptionStartDate: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    dispatch({ type: "SET_SUBSCRIPTION", payload: sub });
  }

  async function saveReading(reading: DailyReading) {
    const updatedHistory = [
      ...state.readingHistory.filter((r) => r.date !== reading.date),
      reading,
    ];
    await AsyncStorage.setItem(STORAGE_KEYS.READING_HISTORY, JSON.stringify(updatedHistory));
    dispatch({ type: "SET_TODAY_READING", payload: reading });
  }

  function canReadToday(): boolean {
    const today = getTodayString();
    return !state.readingHistory.some((r) => r.date === today);
  }

  function hasAccess(): boolean {
    const { isSubscribed, trialDaysRemaining } = state.subscription;
    return isSubscribed || trialDaysRemaining > 0;
  }

  return (
    <AppContext.Provider
      value={{ state, setupProfile, startTrial, subscribe, saveReading, canReadToday, hasAccess }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
