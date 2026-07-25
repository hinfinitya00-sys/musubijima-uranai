import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLink = async () => {
    if (!email) {
      Alert.alert('入力エラー', 'メールアドレスを入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const redirectTo = Platform.OS === 'web'
        ? `${window.location.origin}/musubijima-uranai/oauth/callback`
        : Linking.createURL('/oauth/callback');

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '送信に失敗しました。';
      Alert.alert('エラー', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const redirectTo = Platform.OS === 'web'
        ? `${window.location.origin}/musubijima-uranai/oauth/callback`
        : Linking.createURL('/oauth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });

      if (error) throw error;

      if (data.url && Platform.OS === 'web') {
        window.location.href = data.url;
      } else if (data.url) {
        await Linking.openURL(data.url);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Googleログインに失敗しました。';
      Alert.alert('エラー', message);
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <ImageBackground
        source={require('../../assets/mitama/kirie.jpg')}
        style={styles.container}
        imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>むすび島</Text>
          <Text style={styles.sentIcon}>✉️</Text>
          <Text style={styles.sentTitle}>メールを送信しました</Text>
          <Text style={styles.sentDesc}>
            {email} にログインリンクを送信しました。{'\n'}
            メール内のリンクをクリックしてログインしてください。
          </Text>
          <TouchableOpacity onPress={() => setMagicLinkSent(false)}>
            <Text style={styles.linkText}>別のメールアドレスで試す</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>むすび島</Text>
        <Text style={styles.subtitle}>ログイン / 新規登録</Text>

        {/* Magic Link */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="mail@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleMagicLink}
          disabled={isLoading}
        >
          <LinearGradient colors={['#E8758A', '#C45070']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>
              {isLoading ? '送信中...' : 'ログインリンクを送信'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.magicLinkHint}>
          パスワード不要。メールに届くリンクでログインできます
        </Text>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>または</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google OAuth */}
        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.buttonDisabled]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleText}>Googleでログイン</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)' as never)}>
          <Text style={styles.skipText}>ログインせずに使う</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFAF9' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#C45070', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#7A6A6A', textAlign: 'center', marginBottom: 40 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#3D1A1A', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#3D1A1A',
    borderWidth: 1,
    borderColor: '#F9C0CC',
  },
  button: { marginTop: 8, borderRadius: 12, overflow: 'hidden' },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  magicLinkHint: { fontSize: 12, color: '#7A6A6A', textAlign: 'center', marginTop: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F9C0CC' },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: '#7A6A6A' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F9C0CC',
    borderRadius: 12,
    paddingVertical: 14,
  },
  googleIcon: {
    fontSize: 18, fontWeight: 'bold', color: '#4285F4', marginRight: 10,
  },
  googleText: { fontSize: 15, fontWeight: '600', color: '#3D1A1A' },
  linkText: { color: '#C45070', textAlign: 'center', marginTop: 20, fontSize: 14 },
  skipText: { color: '#7A6A6A', textAlign: 'center', marginTop: 24, fontSize: 13 },
  sentIcon: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  sentTitle: { fontSize: 20, fontWeight: 'bold', color: '#C45070', textAlign: 'center', marginBottom: 12 },
  sentDesc: { fontSize: 14, color: '#7A6A6A', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
});
