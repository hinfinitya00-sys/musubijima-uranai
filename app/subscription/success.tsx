import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SubscriptionSuccessScreen() {
  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>ご登録ありがとうございます！</Text>
        <Text style={styles.desc}>
          むすび島の全機能をお楽しみください。{'\n'}
          いつでもプランの変更・解約が可能です。
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/' as never)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4C1D95', '#6D28D9']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>占いを始める</Text>
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
    fontSize: 22, fontWeight: 'bold', color: '#4C1D95',
    textAlign: 'center', marginBottom: 16,
  },
  desc: {
    fontSize: 14, color: '#6B7280', textAlign: 'center',
    lineHeight: 24, marginBottom: 40,
  },
  button: { borderRadius: 50, overflow: 'hidden', width: '80%', maxWidth: 300 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center', borderRadius: 50 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
