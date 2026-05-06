import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PlanCard {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

const PLAN_DATA: PlanCard[] = [
  {
    id: 'free',
    name: 'フリー',
    price: '0円',
    features: [
      'キャラ診断（1回）',
      'おみくじ（月3回）',
      '基本占い',
      '相性診断（月1回）',
    ],
  },
  {
    id: 'standard',
    name: 'スタンダード',
    price: '980円/月',
    recommended: true,
    features: [
      'フリーの全機能',
      'おみくじ無制限',
      '全占いコンテンツ',
      '毎日のAIメッセージ',
      'キャラ詳細解説',
      '月次レポートPDF',
      '9年サイクル診断',
      'AIキャラチャット',
    ],
  },
  {
    id: 'premium',
    name: 'プレミアム',
    price: '3,980円/月',
    features: [
      'スタンダードの全機能',
      'LIVE鑑定（月1回）',
      'AI個別相談（月5回）',
      '家族・パートナー鑑定',
      '年間数秘カレンダー',
      '占い講座動画',
      '新キャラ先行解放',
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
      // Stripe Checkout redirect will be implemented here
      Alert.alert('決済画面へ', 'Stripe Checkoutに遷移します（実装予定）');
    } catch (error) {
      Alert.alert('エラー', '処理に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1A0A2E', '#2D1B4E', '#1A0A2E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>プランを選ぶ</Text>
        <Text style={styles.subtitle}>あなたに合ったプランで、むすび島の体験を広げましょう</Text>

        {PLAN_DATA.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.recommended && styles.planCardRecommended,
              currentPlan === plan.id && styles.planCardCurrent,
            ]}
          >
            {plan.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>おすすめ</Text>
              </View>
            )}
            {currentPlan === plan.id && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>現在のプラン</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>

            <View style={styles.featureList}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {plan.id !== 'free' && currentPlan !== plan.id && (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectPlan(plan.id)}
                disabled={isLoading}
              >
                <LinearGradient colors={['#F2D06B', '#E8A87C']} style={styles.selectButtonGradient}>
                  <Text style={styles.selectButtonText}>このプランを選ぶ</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F2D06B', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 24 },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  planCardRecommended: {
    borderColor: '#F2D06B',
    borderWidth: 2,
  },
  planCardCurrent: {
    borderColor: '#2ECC71',
    borderWidth: 2,
  },
  recommendedBadge: {
    backgroundColor: '#F2D06B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  recommendedText: { fontSize: 12, fontWeight: 'bold', color: '#1A0A2E' },
  currentBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  currentBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  planName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  planPrice: { fontSize: 28, fontWeight: 'bold', color: '#F2D06B', marginBottom: 16 },
  featureList: { marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureCheck: { color: '#2ECC71', marginRight: 8, fontSize: 16 },
  featureText: { color: '#ddd', fontSize: 14 },
  selectButton: { borderRadius: 12, overflow: 'hidden' },
  selectButtonGradient: { paddingVertical: 14, alignItems: 'center' },
  selectButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1A0A2E' },
});
