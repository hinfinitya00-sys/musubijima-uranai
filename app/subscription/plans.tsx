import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;

// むすび島パレット
const Colors = {
  primary: '#E8758A',
  primaryDark: '#C45070',
  bg: '#FFFAF9',
  ink: '#3D1A1A',
  accent: '#C9A84C',
};

interface FeatureRow {
  label: string;
  enabled: boolean;
}

const FEATURES: FeatureRow[] = [
  { label: '導カード（毎日）', enabled: true },
  { label: 'むすび族占い', enabled: true },
  { label: '今年の運勢（9年全部）', enabled: true },
  { label: 'み・たまカード（毎日）', enabled: true },
  { label: 'ネガティブ神占い', enabled: true },
  { label: '歌みくじ', enabled: true },
];

const PAYMENT_METHODS = ['💳 クレジットカード', 'Link'];

export default function PlansScreen() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(true);

  useEffect(() => {
    const loadCurrentPlan = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      try {
        if (session) {
          const { data } = await supabase
            .from('profiles')
            .select('plan_type')
            .eq('id', session.user.id)
            .single();
          if (data?.plan_type) setCurrentPlan(data.plan_type);
        }
      } finally {
        setIsPlanLoading(false);
      }
    };
    loadCurrentPlan();
  }, []);

  const handleSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push({
        pathname: '/(auth)/login',
        params: { next: '/subscription/plans' },
      } as never);
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
          body: JSON.stringify({}),
        }
      );

      const { url, error } = await response.json();

      if (!response.ok || error) throw new Error(error ?? '決済の開始に失敗しました。');

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

  const isSubscribed = currentPlan !== 'free';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.header}>結び島 会員プラン</Text>

        <Text style={styles.price}>
          月額<Text style={styles.priceNum}>330</Text>円<Text style={styles.priceTax}>（税込）</Text>
        </Text>
        <Text style={styles.priceSub}>1日わずか11円</Text>

        <View style={styles.paymentRow}>
          {PAYMENT_METHODS.map((m) => (
            <Text key={m} style={styles.paymentItem}>{m}</Text>
          ))}
        </View>

        <View style={styles.featureList}>
          {FEATURES.map((feat) => (
            <View key={feat.label} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureLabel}>{feat.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, (isLoading || isPlanLoading || isSubscribed) && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={isLoading || isPlanLoading || isSubscribed}
          activeOpacity={0.85}
        >
          <Text style={styles.subscribeButtonText}>
            {isSubscribed ? 'ご利用中です' : isLoading || isPlanLoading ? '確認中...' : '会員登録する'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.freeLink} onPress={handleFreePlan} activeOpacity={0.7}>
          <Text style={styles.freeLinkText}>このまま無料で使う</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { padding: 20, paddingTop: 48, paddingBottom: 40, alignItems: 'center' },

  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1E3E5',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: 20,
  },

  price: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.ink,
    textAlign: 'center',
  },
  priceNum: { fontSize: 44, fontWeight: 'bold', color: Colors.primary },
  priceTax: { fontSize: 13, fontWeight: '500', color: '#9C8A8A' },
  priceSub: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },

  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  paymentItem: {
    fontSize: 12,
    color: Colors.ink,
    backgroundColor: '#FDF1F3',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: 'hidden',
  },

  featureList: { marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureCheck: {
    color: Colors.primary,
    marginRight: 10,
    fontSize: 15,
    fontWeight: '700',
    width: 18,
  },
  featureLabel: { fontSize: 15, color: Colors.ink, flex: 1 },

  subscribeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: { opacity: 0.6 },
  subscribeButtonText: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },

  freeLink: { marginTop: 16, alignItems: 'center', paddingVertical: 8 },
  freeLinkText: {
    fontSize: 14,
    color: '#9C8A8A',
    textDecorationLine: 'underline',
  },
});
