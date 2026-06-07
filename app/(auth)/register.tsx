import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleRegister = async () => {
    if (!email || !birthYear || !birthMonth || !birthDay) {
      Alert.alert('入力エラー', 'メールアドレスと生年月日を入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

      const redirectTo = Platform.OS === 'web'
        ? `${window.location.origin}/musubijima-uranai/oauth/callback`
        : Linking.createURL('/oauth/callback');

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: name || undefined,
            birth_date: birthDate,
          },
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '登録に失敗しました。';
      Alert.alert('エラー', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
      const message = error instanceof Error ? error.message : 'Google登録に失敗しました。';
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
        <View style={styles.sentContent}>
          <Text style={styles.sentIcon}>✉️</Text>
          <Text style={styles.sentTitle}>メールを送信しました</Text>
          <Text style={styles.sentDesc}>
            {email} に登録リンクを送信しました。{'\n'}
            メール内のリンクをクリックして登録を完了してください。
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>むすび島に登録</Text>
        <Text style={styles.subtitle}>生年月日であなたのむすび族キャラを発見しましょう</Text>

        {/* Google OAuth */}
        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.buttonDisabled]}
          onPress={handleGoogleRegister}
          disabled={isLoading}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleText}>Googleで登録</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>またはメールで登録</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>お名前</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="お名前（任意）"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>メールアドレス *</Text>
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>生年月日 *</Text>
          <View style={styles.dateRow}>
            <TextInput
              style={[styles.input, styles.dateInput]}
              value={birthYear}
              onChangeText={setBirthYear}
              placeholder="1990"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={4}
            />
            <Text style={styles.dateSeparator}>年</Text>
            <TextInput
              style={[styles.input, styles.dateInputSmall]}
              value={birthMonth}
              onChangeText={setBirthMonth}
              placeholder="1"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.dateSeparator}>月</Text>
            <TextInput
              style={[styles.input, styles.dateInputSmall]}
              value={birthDay}
              onChangeText={setBirthDay}
              placeholder="1"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.dateSeparator}>日</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <LinearGradient colors={['#4C1D95', '#6D28D9']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>
              {isLoading ? '送信中...' : '登録リンクを送信'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.magicLinkHint}>
          パスワード不要。メールに届くリンクで登録できます
        </Text>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.linkText}>すでにアカウントをお持ちの方はこちら</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4C1D95', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 28 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateInput: { flex: 2 },
  dateInputSmall: { flex: 1, marginLeft: 8 },
  dateSeparator: { color: '#6B7280', marginHorizontal: 4, fontSize: 14 },
  button: { marginTop: 16, borderRadius: 12, overflow: 'hidden' },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  magicLinkHint: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: '#9CA3AF' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 14,
  },
  googleIcon: { fontSize: 18, fontWeight: 'bold', color: '#4285F4', marginRight: 10 },
  googleText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  linkText: { color: '#6D28D9', textAlign: 'center', marginTop: 20, fontSize: 14 },
  sentContent: { flex: 1, padding: 24, justifyContent: 'center' },
  sentIcon: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  sentTitle: { fontSize: 20, fontWeight: 'bold', color: '#4C1D95', textAlign: 'center', marginBottom: 12 },
  sentDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
});
