import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FeatureRow {
  label: string;
  value: string;
  enabled: boolean;
}

interface PlanCard {
  id: string;
  name: string;
  price: string;
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
  const [currentPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return;
    setIsLoading(true);
    try {
      Alert.alert('決済画面へ', 'Stripe Checkoutに遷移します（実装予定）');
    } catch {
      Alert.alert('エラー', '処理に失敗しました。');
    } finally {
      setIsLoading(false);
    }
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
              <View style={styles.reasonBox}>
                <Text style={styles.reasonTitle}>おすすめ理由</Text>
                <Text style={styles.reasonText}>
                  全ての占いが使い放題になる最もコスパの良いプランです
                </Text>
              </View>
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

            {plan.id !== 'free' && currentPlan !== plan.id && (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectPlan(plan.id)}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={plan.recommended ? ['#F59E0B', '#F97316'] : ['#4C1D95', '#6D28D9']}
                  style={styles.selectButtonGradient}
                >
                  <Text style={[
                    styles.selectButtonText,
                    plan.recommended && { color: '#FFFFFF' },
                  ]}>
                    このプランを選ぶ
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
  selectButtonGradient: { paddingVertical: 14, alignItems: 'center' },
  selectButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },

  ctaBanner: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBannerText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
});
