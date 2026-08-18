import { Redirect } from 'expo-router';

// 管理機能は認証済みの別CMSで提供し、公開アプリからは利用させない。
export default function AdminCharactersDisabled() {
  return <Redirect href="/" />;
}
