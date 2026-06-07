import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';

const TOKUTEI_ITEMS = [
  { label: '販売業者', value: '其田彪' },
  { label: '所在地', value: '福岡県飯塚市（番地は請求があり次第開示します）' },
  { label: '電話番号', value: '請求があり次第開示します' },
  { label: 'メールアドレス', value: 'sokeiraku@gmail.com' },
  { label: 'サービス名', value: 'むすび島' },
  { label: '販売価格', value: 'ライトプラン：月額300円（税込）\nスタンダードプラン：月額980円（税込）' },
  { label: '支払い方法', value: 'クレジットカード（Stripe決済）' },
  { label: 'サービス提供時期', value: '決済完了後、即時提供' },
  { label: '解約・退会', value: 'マイページからいつでも解約可能。解約後は次回請求日まで利用可能' },
  { label: '返金ポリシー', value: 'デジタルコンテンツの性質上、決済完了後の返金は原則承っておりません' },
  { label: '動作環境', value: 'インターネット接続環境が必要です' },
];

export default function TokuteiScreen() {
  return (
    <ImageBackground
      source={require('../../assets/mitama/kirie.jpg')}
      style={styles.container}
      imageStyle={{ opacity: 0.07, resizeMode: 'cover' }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>特定商取引法に基づく表記</Text>

        <View style={styles.card}>
          {TOKUTEI_ITEMS.map((item, i) => (
            <View key={i}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.item}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          本表記は予告なく変更される場合があります。最新の情報は本ページをご確認ください。
        </Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: {
    fontSize: 20, fontWeight: 'bold', color: '#4C1D95',
    textAlign: 'center', marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 12, color: '#9CA3AF', marginBottom: 4,
  },
  value: {
    fontSize: 14, color: '#374151', lineHeight: 22,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  footer: {
    fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 24, lineHeight: 18,
  },
});
