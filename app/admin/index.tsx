import { Redirect } from 'expo-router';

// 公開アプリには管理ダッシュボードを露出しない。
export default function AdminDisabled() {
  return <Redirect href="/" />;
}
