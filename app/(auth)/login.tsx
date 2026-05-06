import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('入力エラー', 'メールアドレスとパスワードを入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      // Supabase Auth login will be implemented here
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('エラー', 'ログインに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1A0A2E', '#2D1B4E', '#1A0A2E']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>むすび島</Text>
        <Text style={styles.subtitle}>ログイン</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>メールアドレス</Text>
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
          <Text style={styles.label}>パスワード</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="パスワード"
            placeholderTextColor="#888"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient colors={['#F2D06B', '#E8A87C']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>新規登録はこちら</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#F2D06B', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 40 },
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
  button: { marginTop: 24, borderRadius: 12, overflow: 'hidden' },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#1A0A2E' },
  linkText: { color: '#F2D06B', textAlign: 'center', marginTop: 20, fontSize: 14 },
});
