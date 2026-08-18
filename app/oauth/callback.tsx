import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function OAuthCallback() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (Platform.OS === 'web') {
          const code = new URLSearchParams(window.location.search).get('code');

          // SupabaseのPKCEフロー（?code=...）を明示的にセッションへ交換する。
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
          }

          // Web: URLのハッシュフラグメントからトークンを取得
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (error) throw error;
          }
        }

        // セッション確認
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setStatus('success');
          setTimeout(() => {
            const safeNext = typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
              ? next
              : '/(tabs)';
            router.replace(safeNext as never);
          }, 1000);
        } else {
          setStatus('error');
          setErrorMessage('セッションの取得に失敗しました');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : '認証処理に失敗しました'
        );
      }
    };

    handleCallback();
  }, [next, router]);

  return (
    <View style={styles.container}>
      {status === 'processing' && (
        <>
          <ActivityIndicator size="large" color="#E8758A" />
          <Text style={styles.text}>認証処理中...</Text>
        </>
      )}
      {status === 'success' && (
        <>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.text}>ログインしました</Text>
          <Text style={styles.subText}>リダイレクト中...</Text>
        </>
      )}
      {status === 'error' && (
        <>
          <Text style={styles.errorIcon}>✕</Text>
          <Text style={styles.errorTitle}>認証に失敗しました</Text>
          <Text style={styles.subText}>{errorMessage}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 24, backgroundColor: '#FFFFFF',
  },
  text: { fontSize: 16, color: '#C45070', marginTop: 16, fontWeight: '600' },
  subText: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  successIcon: { fontSize: 48, color: '#22C55E', fontWeight: 'bold' },
  errorIcon: { fontSize: 48, color: '#DC2626', fontWeight: 'bold' },
  errorTitle: { fontSize: 18, color: '#DC2626', fontWeight: 'bold', marginTop: 12 },
});
