import { Redirect } from 'expo-router';

// 旧デモ課金画面（誤った旧価格・即時ローカル解放）は使用しない。
// 課金導線はStripeを使う正式な330円プラン画面へ一本化する。
export default function SubscriptionRedirect() {
  return <Redirect href="/subscription/plans" />;
}
