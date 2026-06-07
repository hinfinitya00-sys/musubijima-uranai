# CLAUDE.md — むすび島サブスクアプリ 開発指示書

このファイルはClaude Codeが自動で読む設定ファイルです。
常にこの指示に従って開発を進めてください。

---

## プロジェクト概要

占い師・其田寿枝（むすび島）の数秘術占いをサブスクリプションアプリ化する。
ベースは `arigajima-uranai` リポジトリ。むすび島向けに全面リブランド・機能追加する。

**リポジトリ:** https://github.com/hinfinitya00-sys/musubijima-uranai  
**設計書:** `DESIGN.md` を必ず参照すること

---

## 技術スタック

```
フロントエンド: React Native + Expo Router v6 + NativeWind v4
バックエンド:   Express + tRPC v11
DB:            Supabase (PostgreSQL) + Drizzle ORM
課金:          Stripe Billing
AI:            Claude API (claude-sonnet-4-20250514)
メール:         Resend
ホスティング:   Vercel (Web) / Supabase (Backend)
パッケージ管理: pnpm
```

---

## 開発ルール（必ず守ること）

### コーディング規則
- TypeScript strict モードを維持する
- `any` 型は使わない。必ず型定義をする
- コンポーネントは関数コンポーネントのみ（classは使わない）
- 非同期処理は async/await を使う（.then()チェーンは使わない）
- エラーハンドリングを必ず実装する（try/catch）
- console.log はデバッグ後に必ず削除する

### ファイル命名規則
- コンポーネント: PascalCase（例: `CharacterCard.tsx`）
- ユーティリティ・hooks: camelCase（例: `useSubscription.ts`）
- 定数: camelCase（例: `plans.ts`）
- 型定義: PascalCase + Type/Interface suffix

### Gitルール
- コミットメッセージは日本語OK、プレフィックスをつける
  - `feat:` 新機能
  - `fix:` バグ修正
  - `refactor:` リファクタリング
  - `docs:` ドキュメント
  - `chore:` 設定・パッケージ
- 直接 `main` にプッシュしない
- `develop` ブランチで開発 → PR → `main`

### テスト
- 各機能実装後に `pnpm test` を実行する
- 数秘術計算ロジックは必ずテストを書く（コアロジックのため）
- Stripe webhookのテストは `stripe listen` を使う

---

## 禁止事項

- `arigajima`、`ありが島`、`ariga` という文字列を残してはいけない
- `mysql2` パッケージを使ってはいけない（Supabase/postgresに変更済みのはず）
- ハードコードされた秘密鍵・APIキーをコードに書いてはいけない（必ず `.env.local` 経由）
- `TODO` コメントを残したままコミットしてはいけない（issueに起こすこと）

---

## 環境変数

`.env.local` に以下が必要（`.env.example` を参照）：

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_STANDARD_PRICE_ID
STRIPE_PREMIUM_PRICE_ID
ANTHROPIC_API_KEY
RESEND_API_KEY
EMAIL_FROM
EXPO_PUBLIC_API_URL
```

---

## よく使うコマンド

```bash
pnpm dev          # 開発サーバー起動（サーバー + Metro同時起動）
pnpm dev:server   # サーバーのみ起動
pnpm dev:metro    # Expo Metroのみ起動
pnpm db:push      # DBスキーマをSupabaseに適用
pnpm test         # テスト実行
pnpm lint         # Lintチェック
pnpm format       # コードフォーマット
pnpm build        # サーバービルド
```

---

## DBスキーマ変更時の手順

1. `server/db/schema.ts` を編集
2. `pnpm db:push` でSupabaseに反映
3. 変更内容をコミット

---

## 作業が詰まったとき

1. `DESIGN.md` を読み直す
2. エラーメッセージを確認してから修正する
3. 不明な仕様は実装を止めて質問する（勝手に決めない）
