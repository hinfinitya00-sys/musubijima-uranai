# むすび島 リリース前QA記録（2026-08-18）

## 判定

現時点は **条件付きリリース保留**。フロントエンドの修正と回帰試験、Supabase本番DB migration／Edge Functions反映は合格しているが、330円の実決済試験と本番フロントの最終回帰が未完了。未完了のまま正式リリース判定は出さない。

## 2026-08-20〜21 本番基盤検証

- Supabaseプロジェクトが `INACTIVE` で、APIドメインもDNS `NXDOMAIN` だったことを検出。オーナー操作で復元し、`ACTIVE_HEALTHY` とAPI応答を確認した。
- migration `20260818000100_profiles_subscription_security.sql` をドライラン後に本番適用した。
- `create-checkout-session` v4、`stripe-webhook` v3、`create-customer-portal` v1 を本番配備した。
- 本番異常系スモーク試験：未認証Checkout 401、未認証Customer Portal 401、署名なしWebhook 400を確認した。
- 本番登録・実決済試験前に、型検査、32件のVitest、本番Webビルド34ルートを再実行し合格した。
- Free Planの休止は公開サービスに不適合。正式公開前にPro化または休止防止を必須とする。
- Supabase AuthのSite URLが `http://localhost:3000`、Redirect URLが0件、Google ProviderがDisabledだったことを検出した。
- Site URLをGitHub Pages本番URLへ変更し、`/oauth/callback` を許可Redirect URLへ追加した。
- Google OAuth資格情報が未設定の間は壊れたGoogleボタンを表示しない機能フラグを追加。再検証は型検査、33件のVitest、本番Webビルド34ルートに合格した。
- 初回本番確認で全ルートにReact hydrationエラー `#419` を検出。WebのSafe Area初期値をSSR／ブラウザで0固定し、描画後に更新するよう修正。型検査、34件のVitest、本番Webビルド34ルートに合格した。
- Rootのtab anchorがログイン・占い直リンクの背面にもホーム画面を描画していたため撤去。静的ルートは約8KBずつ縮小し、不要な背景画面・画像読込を除去。型検査、35件のVitest、本番Webビルド34ルートに合格した。

## 自動試験

| ID | コマンド | 結果 |
|---|---|---|
| AUTO-001 | `pnpm check` | 合格（Webアプリ対象のTypeScriptエラー0） |
| AUTO-002 | `pnpm lint` | 合格（エラー0、既存warning 27） |
| AUTO-003 | `pnpm test` | 合格（32/32、skip 0） |
| AUTO-004 | `pnpm build:web` | 合格（静的34ルート出力） |
| AUTO-005 | `git diff --check` | 合格（空白エラー0） |
| AUTO-006 | 旧テーマ色コード全検索 | UI用の旧紫コード0件 |
| AUTO-007 | 旧価格全検索 | 実装・設定の旧価格0件 |
| AUTO-008 | 文字化けパターン全検索 | `�`、代表的なUTF-8誤変換パターン0件 |

回帰防止テスト `tests/release-guardrails.test.ts` では、旧デモ課金の復活、クライアント指定price/userの信用、Webhookイベント不足、profiles保護不足、認証callback不足を検知する。

## ブラウザ表示試験

本番相当の `expo export` を `pnpm preview:web` で配信し、実ブラウザで検査。

| ID | 条件 | 対象 | 結果 |
|---|---|---|---|
| UI-001 | 390×844 | 導カード、み・たま、今年の運勢、歌みくじ、ネガティブ神、むすび族 | 全6画面で横スクロール0、文字クリップ0 |
| UI-002 | 1440×900 | 同上 | 全6画面で横スクロール0、文字クリップ0 |
| UI-003 | 390×844 / 1440×900 | 同上 | 文字化け検出0、旧紫UI検出0 |
| UI-004 | 390×844 | 設定 | ピンク／白、330円、法的導線を目視確認 |
| UI-005 | 1440×900 | ログイン、プラン | 横崩れ0。ログイン幅をPC向けに制限 |
| UI-006 | 390×844 | 歌みくじ | 日本語本文・歌詞・再生UIを目視確認 |
| UI-007 | 本番静的JS | 全主要画面 | 最新bundleでReact error #419が0件 |

占い本文は変更していない。`app/fortune` と `constants` の差分確認では、導カードの画像型修正と歌みくじのSSR／音声初期化修正だけで、占いメッセージ本文の変更は0件。

## 修正した重大事項

1. 旧紫テーマを公開UI、テーマ設定、未使用画面から撤去。ピンク／白へ統一。
2. 旧価格・旧デモ課金（実決済なしのローカル解放）を撤去し、330円Stripe導線へ一本化。
3. ログイン画面から新規登録へ進める導線を追加。認証後の戻り先を保持。
4. OAuth callbackでhash tokenとPKCE codeの両方を処理。
5. Checkout関数がクライアントのuserId／email／priceIdを信用していた問題を修正。JWT本人確認とサーバーprice固定へ変更。
6. 二重契約を防止し、成功URLへCheckout Session IDを付与。
7. Stripe Webhookのsubscription更新・削除、invoice成功・失敗を処理し、DB更新失敗時は500で再送対象に変更。
8. 決済成功画面はprofilesの有料反映を確認するまで「利用可能」と表示しない。
9. Stripe Customer Portal導線を追加（契約、支払い方法、解約）。
10. auth.users作成時のprofiles生成、既存ユーザー補完、RLS／権限保護migrationを追加。
11. 公開されていた未実装admin／theme-labを無効化。
12. モバイルのImageBackground由来の横スクロールを解消。
13. Webで約31MBあった日本語TTF一括配信を分割Webフォントへ変更。フォント種別はNoto Sans JP／Noto Serif JPのまま維持。
14. `assets/site/hisae.png` を表示解像度に合わせて1.9MBから約0.7MBへ縮小（見た目・内容は維持）。

## 本番反映前の必須作業

1. Stripe Dashboardで `STRIPE_PRICE_STANDARD` が税込330円／月であることをCheckout表示と照合する。
2. Stripe Webhook購読イベントをコードの5系統と一致させる。
3. 新規メール登録、Google登録、ログイン復帰、330円実決済、有料解放、Customer Portal解約、解約後状態を実機確認する。
4. Supabaseを公開運用向けプランへ変更し、自動休止を防ぐ。
7. 上記が合格後にのみdevelopをpushし、GitHub Pages本番を再検査する。

## 実決済試験の合格条件

- Checkout表示金額が税込330円／月。
- 支払ったSupabase本人だけがstandardになる。
- 支払い完了直後に有料範囲が解放される。
- 再度「会員登録」を押しても二重契約にならない。
- Webhook処理失敗はStripe側で再送され、成功扱いで握りつぶさない。
- Portalから解約でき、契約終了イベント後にfreeへ戻る。
- 無関係なユーザーのplan／Stripe IDをブラウザから変更できない。
