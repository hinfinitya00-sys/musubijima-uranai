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
  standard: {
    id: 'standard',
    name: 'スタンダード',
    price: 980,
    stripePriceId: process.env.STRIPE_STANDARD_PRICE_ID,
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
  premium: {
    id: 'premium',
    name: 'プレミアム',
    price: 3980,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    maxUsers: 20,
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
      liveSession: 1,
      aiConsult: 5,
      familyReading: true,
      yearlyCalendar: true,
      courseArchive: true,
      newCharacterEarly: true,
    },
  },
};
