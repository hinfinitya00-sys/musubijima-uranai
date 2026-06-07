export interface PlanFeatures {
  characterReveal: boolean;
  omikuji: number;
  fortuneBasic: boolean;
  fortuneFull?: boolean;
  compatibilityCheck: number;
  dailyMessage: boolean;
  characterDetail?: boolean;
  monthlyReport: boolean;
  nineYearCycle?: boolean;
  aiChat: boolean;
  liveSession: boolean | number;
  aiConsult?: number;
  familyReading?: boolean;
  yearlyCalendar?: boolean;
  courseArchive?: boolean;
  newCharacterEarly?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  stripePriceId?: string;
  maxUsers?: number;
  features: PlanFeatures;
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'フリー',
    price: 0,
    features: {
      characterReveal: true,
      omikuji: 3,
      fortuneBasic: true,
      compatibilityCheck: 1,
      dailyMessage: false,
      monthlyReport: false,
      aiChat: false,
      liveSession: false,
    },
  },
  light: {
    id: 'light',
    name: 'ライト',
    price: 300,
    stripePriceId: process.env.STRIPE_STANDARD_PRICE_ID,
    features: {
      characterReveal: true,
      omikuji: Infinity,
      fortuneBasic: true,
      fortuneFull: true,
      compatibilityCheck: Infinity,
      dailyMessage: false,
      characterDetail: true,
      monthlyReport: false,
      nineYearCycle: true,
      aiChat: false,
      liveSession: false,
    },
  },
  standard: {
    id: 'standard',
    name: 'スタンダード',
    price: 980,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: {
      characterReveal: true,
      omikuji: Infinity,
      fortuneBasic: true,
      fortuneFull: true,
      compatibilityCheck: Infinity,
      dailyMessage: true,
      characterDetail: true,
      monthlyReport: true,
      nineYearCycle: true,
      aiChat: true,
      liveSession: false,
    },
  },
};

// 新プラン機能ゲーティング定義（Stripe連携後に実際のゲーティングロジックで使用）
export type PlanType = 'free' | 'light' | 'standard';

export const PLAN_FEATURES = {
  free: {
    omikuji: true,
    mitama: 3,
    lifeRhythm: 'current' as const,
    negativeGod: false,
    musubian: false,
    lineDelivery: false,
    monthlyReport: false,
  },
  light: {
    omikuji: true,
    mitama: true,
    lifeRhythm: 'all' as const,
    negativeGod: true,
    musubian: true,
    lineDelivery: false,
    monthlyReport: false,
  },
  standard: {
    omikuji: true,
    mitama: true,
    lifeRhythm: 'all' as const,
    negativeGod: true,
    musubian: true,
    lineDelivery: true,
    monthlyReport: true,
  },
};
