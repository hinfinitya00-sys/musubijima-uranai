import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;

interface FeatureRow {
  label: string;
  value: string;
  enabled: boolean;
}

interface PlanCard {
  id: string;
  name: string;
  price: string;
  priceId?: string;
  priceSub?: string;
  features: FeatureRow[];
  recommended?: boolean;
  badge?: string;
  badgeBg?: string;
  highlight?: string;
}

const PLAN_DATA: PlanCard[] = [
  {
    id: 'free',
    name: 'フリー',
    price: '0円',
    features: [
      { label: 'おみくじ', value: '毎日無制限', enabled: true },
      { label: 'み・たまカード', value: '月3回', enabled: true },
      { label: '人生リズム', value: '今年の年のみ', enabled: true },
      { label: 'ネガティブ神占い', value: '', enabled: false },
      { label: 'むすび族占い', value: '', enabled: false },
      { label: 'LINEおみくじ配信', value: '', enabled: false },
      { label: '月次レポートPDF', value: '', enabled: false },
    ],
  },
  {
    id: 'light',
    name: 'ライト',
    price: '300円/月',
    priceId: 'STRIPE_PRICE_LIGHT',
    priceSub: '1日わずか10円',
    recommended: true,
    badge: 'いちばん人気',
    badgeBg: '#F59E0B',
    highlight: '#F59E0B',
    features: [
      { label: 'おみくじ', value: '毎日無制限', enabled: true },
      { label: 'み・たまカード', value: '毎日引ける', enabled: true },
      { label: '人生リズム', value: '9年サイクル全部', enabled: true },
      { label: 'ネガティブ神占い', value: '使い放題', enabled: true },
      { label: 'むすび族占い', value: '使い放題', enabled: true },
      { label: 'LINEおみくじ配信', value: '', enabled: false },
      { label: '月次レポートPDF', value: '', enabled: false },
    ],
  },
  {
    id: 'standard',
    name: 'スタンダード',
    price: '980円/月',
    priceId: 'STRIPE_PRICE_STANDARD',
    badge: 'プレミアム',
    badgeBg: '#6D28D9',
    features: [
      { label: 'おみくじ', value: '毎日無制限', enabled: true },
      { label: 'み・たまカード', value: '毎日引ける', enabled: true },
      { label: '人生リズム', value: '9年サイクル全部', enabled: true },
      { label: 'ネガティブ神占い', value: '使い放題', enabled: true },
      { label: 'むすび族占い', value: '使い放題', enabled: true },
      { label: 'LINEおみくじ配信', value: '毎朝配信', enabled: true },
      { label: '月次レポートPDF', value: '毎月届く', enabled: true },
    ],
  },
];

export default function PlansScreen() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCurrentPlan = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('plan_type')
          .eq('id', session.user.id)
          .single();
        if (data?.plan_type) setCurrentPlan(data.plan_type);
      }
    };
    loadCurrentPlan();
  }, []);

  const handleSubscribe = async (priceId: string) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/(auth)/login' as never);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            priceId,
            userId: session.user.id,
            email: session.user.email,
          }),
        }
      );

      const { url, error } = await response.json();

      if (error) throw new Error(error);

      if (url) {
        if (Platform.OS === 'web') {
          window.location.href = url;
        } else {
          await Linking.openURL(url);
        }
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '決済の開始に失敗しました。';
      Alert.alert('エラー', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreePlan = () => {
    router.push('/' as never);
  };

  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>プランを選ぶ</Text>
        <Text style={styles.subtitle}>あなたに合ったプランで、むすび島の体験を広げましょう</Text>

        {PLAN_DATA.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.recommended && styles.planCardRecommended,
              plan.highlight ? { borderColor: plan.highlight, borderWidth: 2 } : null,
              currentPlan === plan.id && styles.planCardCurrent,
            ]}
          >
            {plan.badge && (
              <View style={[styles.badge, { backgroundColor: plan.badgeBg }]}>
                <Text style={styles.badgeText}>{plan.badge}</Text>
              </View>
            )}
            {currentPlan === plan.id && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>現在のプラン</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={[
              styles.planPrice,
              plan.recommended && { fontSize: 32, color: '#F59E0B' },
            ]}>
              {plan.price}
            </Text>
            {plan.priceSub && (
              <Text style={styles.priceSub}>{plan.priceSub}</Text>
            )}

            {plan.recommended && (
              <>
                <Text style={styles.trialPromo}>今すぐ登録で7日間無料体験</Text>
                <View style={styles.reasonBox}>
                  <Text style={styles.reasonTitle}>おすすめ理由</Text>
                  <Text style={styles.reasonText}>
                    全ての占いが使い放題になる最もコスパの良いプランです
                  </Text>
                </View>
              </>
            )}

            <View style={styles.featureList}>
              {plan.features.map((feat, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={feat.enabled ? styles.featureCheck : styles.featureCross}>
                    {feat.enabled ? '✓' : '✕'}
                  </Text>
                  <Text style={[styles.featureLabel, !feat.enabled && styles.featureDisabled]}>
                    {feat.label}
                  </Text>
                  {feat.enabled && feat.value ? (
                    <Text style={styles.featureValue}>{feat.value}</Text>
                  ) : null}
                </View>
              ))}
            </View>

            {currentPlan === plan.id ? (
              <View style={styles.currentPlanButton}>
                <Text style={styles.currentPlanText}>利用中</Text>
              </View>
            ) : plan.id === 'free' ? (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleFreePlan}
              >
                <View style={styles.freeButtonInner}>
                  <Text style={styles.freeButtonText}>このまま無料で使う</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.selectButton, isLoading && styles.buttonDisabled]}
                onPress={() => handleSubscribe(plan.priceId!)}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={plan.recommended ? ['#F59E0B', '#F97316'] : ['#4C1D95', '#6D28D9']}
                  style={styles.selectButtonGradient}
                >
                  <Text style={styles.selectButtonText}>
                    {isLoading ? '処理中...' : 'このプランを選ぶ'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.ctaBanner}>
          <Text style={styles.ctaBannerText}>月額300円から全機能解放</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4C1D95', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },

  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardRecommended: {
    paddingVertical: 28,
  },
  planCardCurrent: {
    borderColor: '#22C55E',
    borderWidth: 2,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  currentBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  currentBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },

  planName: { fontSize: 20, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  planPrice: { fontSize: 28, fontWeight: 'bold', color: '#4C1D95', marginBottom: 4 },
  priceSub: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },
  trialPromo: { fontSize: 12, color: '#F59E0B', fontWeight: '500', marginBottom: 8 },

  reasonBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reasonTitle: { fontSize: 12, fontWeight: '700', color: '#F59E0B', marginBottom: 4 },
  reasonText: { fontSize: 13, color: '#92400E', lineHeight: 20 },

  featureList: { marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureCheck: { color: '#22C55E', marginRight: 8, fontSize: 14, fontWeight: '700', width: 18 },
  featureCross: { color: '#D1D5DB', marginRight: 8, fontSize: 14, fontWeight: '700', width: 18 },
  featureLabel: { fontSize: 13, color: '#374151', flex: 1 },
  featureDisabled: { color: '#D1D5DB' },
  featureValue: { fontSize: 11, color: '#6D28D9', fontWeight: '500' },

  selectButton: { borderRadius: 12, overflow: 'hidden' },
  buttonDisabled: { opacity: 0.6 },
  selectButtonGradient: { paddingVertical: 14, alignItems: 'center' },
  selectButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },

  freeButtonInner: {
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12,
  },
  freeButtonText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },

  currentPlanButton: {
    paddingVertical: 14, alignItems: 'center',
    backgroundColor: '#F0FDF4', borderRadius: 12,
  },
  currentPlanText: { fontSize: 15, fontWeight: '600', color: '#22C55E' },

  ctaBanner: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBannerText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
});
