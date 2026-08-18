import { Redirect } from 'expo-router';

// 開発用テーマ確認画面は本番公開しない。
export default function ThemeLabDisabled() {
  return <Redirect href="/" />;
}
