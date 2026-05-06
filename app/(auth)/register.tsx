import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !birthYear || !birthMonth || !birthDay || !password) {
      Alert.alert('入力エラー', '必須項目をすべて入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trpc/auth.register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: { email, name, birthDate },
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('エラー', '登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1A0A2E', '#2D1B4E', '#1A0A2E']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>むすび島に登録</Text>
        <Text style={styles.subtitle}>生年月日であなたのむすび族キャラを発見しましょう</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>お名前</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="お名前（任意）"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>メールア���レス *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="mail@example.com"
            placeholderTextColor="#888"
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
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={4}
            />
            <Text style={styles.dateSeparator}>年</Text>
            <TextInput
              style={[styles.input, styles.dateInputSmall]}
              value={birthMonth}
              onChangeText={setBirthMonth}
              placeholder="1"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.dateSeparator}>月</Text>
            <TextInput
              style={[styles.input, styles.dateInputSmall]}
              value={birthDay}
              onChangeText={setBirthDay}
              placeholder="1"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.dateSeparator}>日</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>パスワード *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="8文字以上"
            placeholderTextColor="#888"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <LinearGradient colors={['#F2D06B', '#E8A87C']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>
              {isLoading ? '登録中...' : '登録してキャラを診断する'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.linkText}>すでにアカウントをお持ちの方はこちら</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F2D06B', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#ddd', marginBottom: 8 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateInput: { flex: 2 },
  dateInputSmall: { flex: 1, marginLeft: 8 },
  dateSeparator: { color: '#ccc', marginHorizontal: 4, fontSize: 14 },
  button: { marginTop: 24, borderRadius: 12, overflow: 'hidden' },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#1A0A2E' },
  linkText: { color: '#F2D06B', textAlign: 'center', marginTop: 20, fontSize: 14 },
});
