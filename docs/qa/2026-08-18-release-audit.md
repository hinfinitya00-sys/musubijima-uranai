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
- WebのRoot Navigatorをネイティブ用Stackから静的Web用Slotへ分離。iOS/AndroidのモーダルStackは維持しつつ、Web共通の不要なNavigation Suspense境界を除去。型検査、36件のVitest、本番Webビルド34ルートに合格した。
- 最新bundle `entry-5fb4a02b...js` の本番反映をHTTP応答と実ブラウザの両方で確認したが、React error #419は1件残存した。Webでは不要なネイティブSplashScreen起動制御を分離し、再配備後に再判定する。
- 非圧縮の静的本番相当で#419を再現し、Expo Routerが生成するルート`Suspense`境界のSSR／初回クライアント差分であることを特定した。SplashScreen分離、Web Slot分離、React Compiler無効化比較、`expo-router`／Expo SDK 54最新パッチ比較でも残存。画面固有コードではなく静的Router境界の問題として、正式リリース判定は引き続き保留する。
- `expo-doctor`で欠落していた`expo-asset`、重複`expo-font`、SDK 54内へ混入していたSDK 55版`expo-linear-gradient`、各Expoモジュールのパッチ不一致を検出・是正。React NavigationはExpo Router内と同版へ統一し、公式診断18/18合格を確認した。
- 本番110件監査で、Supabaseを使う一部ルートの静的HTMLがCI上だけ空の中断済みSuspense境界になり、React error #419を出すことを再現。CIのNode 20をローカルと同じNode 24へ統一し、中断済みSSRを1件でも含むとデプロイを失敗させる`verify:static-export`を追加した。
- Webビルドが外部CloudFront上のfavicon取得失敗だけで停止する単一障害点を検出。本番で使用中の同一画像を`assets/images/favicon.png`へ同梱し、外部CDNに依存せず34ルートを生成できることを確認した。

## 2026-09-01 正式リリース監査

- Stripe本番アカウントの商品「むすび島 会員プラン」が月額330円（税込）、価格ID `price_1TuXMd2IxNJHi9mCpCwaIIu2` であり、アプリ設定値と一致することを管理画面で確認した。
- 本番StripeにWebhook送信先が存在せず、テスト環境にだけSupabase Edge Function送信先がある重大不備を検出。本番へ同一送信先を登録し、アクティブ状態を確認した。本番署名シークレットのSupabase設定は管理画面ログイン後に実施する。
- Stripeイベントは到着順が保証されないため、Webhook payloadの状態を直接反映する方式から、通知ごとにStripe API上の現在の契約を再取得して同期する方式へ強化した。再送・順序逆転で古い会員状態へ巻き戻ることを防止する。
- プライバシーポリシーと利用規約を追加。新規登録前に利用目的と規約を確認でき、料金画面には月額330円、自動更新、解約条件、利用規約・プライバシーポリシー・特商法表記への導線を明示した。
- 個人情報保護委員会の通則ガイドライン（利用目的の通知・公表、開示等、安全管理）と、消費者庁の通信販売広告・定期購入表示に関する一次資料を基準に実装した。法的適合性の最終判断は必要に応じて専門家へ確認する。
- 本番匿名アクセスでprofilesの他人データ取得0件、課金状態の直接更新はPostgreSQL権限エラーとなることを確認した。Service Roleでプロフィール総数1件、課金状態freeを確認した（個人情報は証跡へ記録していない）。
- GitHub Pagesへ200リクエスト・同時10接続の基礎負荷試験を実施し、失敗0件。これは静的配信の基礎確認であり、1万人同時接続を保証するものではない。決済・認証の容量はSupabase／Stripe契約プランと各社制限に依存する。
- 追加後の静的Webビルドは36ルート、Vitest 36/36、型検査、静的SSR検査に合格。公開24ルート×5表示条件のブラウザ監査は120/120合格した。

## 自動試験

| ID | コマンド | 結果 |
|---|---|---|
| AUTO-001 | `pnpm check` | 合格（Webアプリ対象のTypeScriptエラー0） |
| AUTO-002 | `pnpm lint` | 合格（エラー0、既存warning 27） |
| AUTO-003 | `pnpm test` | 合格（36/36、skip 0） |
| AUTO-004 | `pnpm build:web` | 合格（静的36ルート出力） |
| AUTO-005 | `git diff --check` | 合格（空白エラー0） |
| AUTO-006 | 旧テーマ色コード全検索 | UI用の旧紫コード0件 |
| AUTO-007 | 旧価格全検索 | 実装・設定の旧価格0件 |
| AUTO-008 | 文字化けパターン全検索 | `�`、代表的なUTF-8誤変換パターン0件 |
| AUTO-009 | `npx expo-doctor` | 合格（18/18、ネイティブ重複・SDK不一致0） |
| AUTO-010 | `pnpm verify:static-export` | 合格（中断済みSuspense境界0） |

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
| UI-007 | 本番静的JS | 全主要画面 | 合格：CIをNode 24へ統一後、React error #419は0件。中断済みSSR境界0件 |
| UI-008 | 320×568 / 390×844 / 768×1024 / 1440×900 / 720×450（200%幅相当） | 公開24ルート×5条件 | 120/120合格。横はみ出し、操作要素・画像の欠け、壊れた画像、異常サイズ画像、文字化け、旧980円、ページ例外、console errorを自動検査 |
| UI-009 | 390×844 / 1440×900 | 主要11画面 | 22/22合格。フルページ画像を保存し、ピンク／白、余白、画像比率、改行、可読性を目視確認 |
| UI-010 | 390×844 / 1440×900 | ログイン↔新規登録、導カード結果→会員限定→330円プラン、無料利用へ戻る | 操作フロー6/6合格 |
| UI-011 | 全5条件 | 公開22ルート | `document.fonts.ready`完了と、トップ画面表示要素へのNoto Sans JP／Noto Serif JP指定を検査 |
| UI-012 | GitHub Pages本番URL・全5条件 | 公開22ルート | 110条件すべて合格。長時間実行中の一時的な回線リセット／macOSブラウザ起動拒否条件は環境復旧後に個別再試験し合格 |
| UI-013 | GitHub Pages本番URL・390×844 / 1440×900 | ログイン↔新規登録、導カード結果→会員限定→330円プラン、無料利用へ戻る | 本番操作フロー6/6合格 |

UI-008で320px幅の新規登録画面における生年月日入力欄の横欠けを1件検出。`TextInput`のWeb最小幅をflex幅まで縮められるよう修正し、対象再試験および全条件回帰に合格した。また、無料トライアル表示に残っていた旧紫配色を検出し、ブランドのピンク／白へ統一した。

目視証跡は `artifacts/release-screenshots/`、自動検査は `e2e/release-visual-audit.spec.ts`、操作試験は `e2e/release-flows.spec.ts`、画像生成試験は `e2e/release-screenshots.spec.ts` に保存する。

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

1. 新規登録した本番Webhookの署名シークレットをSupabaseへ設定し、購読イベントをコードの7イベントと一致させる。
2. Supabase Authの本番SMTPとレート制限、プロジェクトプランを確認し、公開運用向けに自動休止を防ぐ。
3. 新規メール登録、ログイン復帰、330円実決済、有料解放、二重契約防止、Customer Portal解約、契約終了後状態を実機確認する。
4. Google OAuthは資格情報を設定して試験が完了するまで、現状どおり機能フラグで非表示を維持する。
5. 上記が合格後にのみ正式リリース判定を出す。

## 実決済試験の合格条件

- Checkout表示金額が税込330円／月。
- 支払ったSupabase本人だけがstandardになる。
- 支払い完了直後に有料範囲が解放される。
- 再度「会員登録」を押しても二重契約にならない。
- Webhook処理失敗はStripe側で再送され、成功扱いで握りつぶさない。
- Portalから解約でき、契約終了イベント後にfreeへ戻る。
- 無関係なユーザーのplan／Stripe IDをブラウザから変更できない。
