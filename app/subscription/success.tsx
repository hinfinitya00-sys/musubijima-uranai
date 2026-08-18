import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

export default function SubscriptionSuccessScreen() {
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'error'>('checking');

  useEffect(() => {
    let cancelled = false;

    const confirmSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelled) setStatus('error');
        return;
      }

      for (let attempt = 0; attempt < 12 && !cancelled; attempt += 1) {
        const { data, error } = await supabase
          .from('profiles')
          .select('plan_type')
          .eq('id', session.user.id)
          .single();
        if (!error && data?.plan_type === 'standard') {
          setStatus('confirmed');
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (!cancelled) setStatus('error');
    };

    confirmSubscription();
    return () => { cancelled = true; };
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <View style={styles.content}>
        {status === 'checking' ? (
          <>
            <ActivityIndicator size="large" color="#E8758A" />
            <Text style={styles.title}>決済を確認しています</Text>
            <Text style={styles.desc}>この画面を閉じずに少々お待ちください。</Text>
          </>
        ) : status === 'confirmed' ? (
          <>
            <Text style={styles.icon}>✅</Text>
            <Text style={styles.title}>ご登録ありがとうございます！</Text>
            <Text style={styles.desc}>
              むすび島の全機能をお楽しみください。{'\n'}
              いつでもプランの変更・解約が可能です。
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.icon}>⏳</Text>
            <Text style={styles.title}>決済状態を確認できませんでした</Text>
            <Text style={styles.desc}>少し時間をおいてから、もう一度ご確認ください。</Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.button, status === 'checking' && styles.buttonDisabled]}
          onPress={() => status === 'error'
            ? router.replace('/subscription/plans' as never)
            : router.replace('/' as never)}
          disabled={status === 'checking'}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#E8758A', '#C45070']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{status === 'error' ? 'プラン画面へ戻る' : '占いを始める'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center',
  },
  icon: { fontSize: 64, marginBottom: 24 },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#C45070',
    textAlign: 'center', marginBottom: 16,
  },
  desc: {
    fontSize: 14, color: '#6B7280', textAlign: 'center',
    lineHeight: 24, marginBottom: 40,
  },
  button: { borderRadius: 50, overflow: 'hidden', width: '80%', maxWidth: 300 },
  buttonDisabled: { opacity: 0.5 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center', borderRadius: 50 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
