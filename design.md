# むすび島サブスクアプリ 設計書
**プロジェクト名:** musubijima-uranai  
**バージョン:** 1.0.0  
**作成日:** 2026-05-06  
**作成者:** 其田彪（開発担当）  
**ベースリポジトリ:** hinfinitya00-sys/arigajima-uranai → musubijima-uranai にリネーム

> 2026-08-18更新: 旧複数プラン・旧テーマの記述を廃止。現行仕様はピンク／白、月額会員330円の単一有料プランです。

---

## 1. プロジェクト概要

### ミッション
占い師・其田寿枝（むすび島）のコンテンツをサブスクリプションアプリ化し、全国展開の自動収益基盤を構築する。

### ターゲット
- メインユーザー：20〜40代女性（自己理解・スピリチュアルに関心のある層）
- サブターゲット：既存の「むすび島」アプリユーザー・Instagram/SNSフォロワー

### 収益指標
- 月額売上 = 有料会員数 × ¥330（税込）
- 登録者目標：まず全国1万人

### コアコンセプト
- むすび族キャラクター（45体以上、火・水・風・土属性）が体験の中心
- 数秘術ベースの誕生日占いで「自分のキャラクター」が分かる
- AIが毎日コンテンツを自動配信 → 寿枝さんの稼働を最小化

---

## 2. 既存コード（arigajima-uranai）評価

### ✅ 使えるもの（そのまま継承）
| 項目 | 理由 |
|------|------|
| Expo Router 構成（app/） | そのまま使える。Webも対応済み |
| tRPC セットアップ | 型安全API設計として最適。継続使用 |
| NativeWind + TailwindCSS | スタイリングとして優秀。継続使用 |
| TypeScript 設定 | tsconfig, eslint設定そのまま |
| Drizzle ORM | DBORMとして継続。接続先だけ変更 |
| Express サーバー（server/） | Stripeのwebhookなど、サーバー処理に必要 |
| expo-notifications | プッシュ通知機能に使用 |
| vitest テスト設定 | そのまま継続 |
| pnpm + concurrently | 開発環境コマンドとして継続 |

### ❌ 削除・置き換えするもの
| 項目 | 理由 | 代替 |
|------|------|------|
| mysql2 | ローカルMySQLに依存 | Supabase（PostgreSQL）に変更 |
| ありが島関連コンテンツ一切 | テーマ変更 | むすび島コンテンツに置き換え |
| arigajima という名称 | musubijima に変更 | 全ファイル一括置換 |
| drizzle/（既存migration） | スキーマ変更のため削除 | 新規スキーマで作り直す |
| assets/images/（ありが島画像） | コンテンツ差し替え | むすび族キャラ画像を親が追加 |

### 変更点サマリー
```
arigajima-uranai → musubijima-uranai（リポジトリ名）
mysql2 → postgres (Supabase)
既存DBスキーマ → 新規設計（下記参照）
ありが島コンテンツ → むすび島コンテンツ
```

---

## 3. 技術スタック（最終決定）

```
【フロントエンド / モバイル】
- React Native 0.81.5 + Expo SDK 54
- Expo Router v6（ファイルベースルーティング）
- NativeWind v4（TailwindCSS for RN）
- @tanstack/react-query（データフェッチ）
- tRPC client（型安全API呼び出し）

【バックエンド】
- Express.js（tRPC サーバー + Stripe webhook）
- tRPC server v11（型安全API定義）
- Drizzle ORM（DBアクセス）
- postgres ドライバ（Supabase接続）

【データベース / インフラ】
- Supabase（PostgreSQL）
  - 認証（Auth）
  - データベース
  - ストレージ（キャラ画像など）
  - Edge Functions（定期バッチ処理）

【課金】
- Stripe Billing
  - サブスク管理
  - Webhook（課金イベント受信）
  - Customer Portal（マイページ）

【AI】
- Claude API (claude-sonnet-4-20250514)
  - むすびキャラAIチャット
  - 毎日のメッセージ自動生成
  - 月次レポート文章生成

【メール配信】
- Resend（トランザクションメール）

【ホスティング】
- Vercel（Webアプリ）
- Supabase（バックエンド・DB）
- Expo EAS（iOS/Android ビルド ※後で追加）

【開発ツール】
- GitHub（バージョン管理）
- pnpm（パッケージ管理）
- vitest（テスト）
- TypeScript 5.9
```

---

## 4. フォルダ構成

```
musubijima-uranai/
├── app/                          # 画面（Expo Router）
│   ├── (auth)/                   # 認証フロー
│   │   ├── login.tsx             # ログイン
│   │   ├── register.tsx          # 新規登録（生年月日入力含む）
│   │   └── forgot-password.tsx   # パスワードリセット
│   ├── (tabs)/                   # メインタブ（要ログイン）
│   │   ├── index.tsx             # ホーム（今日のおみくじ・キャラ表示）
│   │   ├── fortune.tsx           # 占いメニュー
│   │   ├── character.tsx         # 自分のキャラ詳細
│   │   ├── chat.tsx              # AIキャラチャット（スタンダード以上）
│   │   └── settings.tsx          # 設定・プラン変更
│   ├── admin/                    # 管理画面（寿枝さん用）
│   │   ├── index.tsx             # ダッシュボード（会員数・売上）
│   │   ├── characters.tsx        # キャラ管理（追加・編集・画像）
│   │   ├── content.tsx           # おみくじ文言・コンテンツ管理
│   │   └── users.tsx             # ユーザー一覧
│   ├── fortune/                  # 各占いページ
│   │   ├── musubian.tsx          # むすび族占い
│   │   ├── omikuji.tsx           # 今日のおみくじ
│   │   ├── mitama.tsx            # み・たまカード
│   │   └── negative-god.tsx      # ネガティブ神占い
│   ├── subscription/             # 課金フロー
│   │   ├── plans.tsx             # プラン選択
│   │   └── success.tsx           # 決済完了
│   └── _layout.tsx               # ルートレイアウト
│
├── components/                   # 再利用UIコンポーネント
│   ├── ui/                       # 汎用UI（Button, Card, Badge等）
│   ├── character/                # キャラ関連コンポーネント
│   ├── fortune/                  # 占い関連コンポーネント
│   └── subscription/             # 課金関連コンポーネント
│
├── lib/                          # クライアント側ライブラリ
│   ├── supabase.ts               # Supabase クライアント
│   ├── trpc.ts                   # tRPC クライアント
│   ├── stripe.ts                 # Stripe クライアント（Web決済用）
│   └── numerology.ts             # 数秘術計算ロジック（コア）
│
├── constants/                    # 定数定義
│   ├── characters.ts             # むすび族キャラデータ（初期）
│   ├── plans.ts                  # プラン定義（価格・機能）
│   └── fortune-types.ts          # 占い種別定義
│
├── hooks/                        # カスタムフック
│   ├── useAuth.ts                # 認証状態
│   ├── useSubscription.ts        # サブスク状態
│   └── useCharacter.ts           # キャラデータ取得
│
├── server/                       # バックエンド（Express + tRPC）
│   ├── _core/
│   │   └── index.ts              # サーバーエントリー
│   ├── routers/                  # tRPCルーター
│   │   ├── auth.ts               # 認証系
│   │   ├── fortune.ts            # 占い系
│   │   ├── character.ts          # キャラ系
│   │   ├── subscription.ts       # 課金系
│   │   ├── ai.ts                 # AI（Claude API）
│   │   └── admin.ts              # 管理者系
│   ├── webhooks/
│   │   └── stripe.ts             # Stripe Webhook処理
│   ├── services/
│   │   ├── claude.ts             # Claude API サービス
│   │   ├── resend.ts             # メール送信サービス
│   │   └── numerology.ts         # 数秘術計算（サーバー側）
│   └── db/
│       └── schema.ts             # Drizzle スキーマ定義
│
├── shared/                       # クライアント/サーバー共通型
│   └── types.ts                  # 共通型定義
│
├── assets/
│   └── images/
│       └── characters/           # むすび族キャラ画像（親が追加）
│
├── drizzle/                      # DBマイグレーション（自動生成）
├── scripts/                      # ユーティリティスクリプト
├── tests/                        # テスト
│
├── app.config.ts                 # Expo設定
├── tailwind.config.js            # TailwindCSS設定
├── .env.local                    # 環境変数（Gitに入れない）
└── .env.example                  # 環境変数サンプル（Gitに入れる）
```

---

## 5. データベーススキーマ（Supabase / PostgreSQL）

### users（ユーザー）
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  birth_date    DATE NOT NULL,           -- 生年月日（必須）
  life_path_num INTEGER,                 -- ライフパス数（計算値）
  character_id  INTEGER,                 -- むすび族キャラID
  plan          TEXT DEFAULT 'free',     -- 'free' | 'standard' | 'premium'
  stripe_customer_id TEXT,              -- Stripe顧客ID
  stripe_subscription_id TEXT,          -- StripeサブスクID
  subscription_status TEXT,             -- 'active' | 'canceled' | 'past_due'
  is_admin      BOOLEAN DEFAULT false,  -- 管理者フラグ
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);
```

### characters（むすび族キャラクター）
```sql
CREATE TABLE characters (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,           -- キャラ名（例：Gola）
  name_ja       TEXT,                    -- 日本語名（任意）
  attribute     TEXT NOT NULL,           -- 'fire' | 'water' | 'wind' | 'earth'
  life_path_numbers INTEGER[],           -- 対応するライフパス数
  description   TEXT,                    -- キャラ説明（フリー向け）
  description_full TEXT,                 -- 詳細説明（スタンダード以上）
  image_url     TEXT,                    -- Supabase Storage URL
  personality   TEXT,                    -- AIチャット用パーソナリティ
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

### daily_messages（毎日メッセージ）
```sql
CREATE TABLE daily_messages (
  id            SERIAL PRIMARY KEY,
  character_id  INTEGER REFERENCES characters(id),
  date          DATE NOT NULL,
  message       TEXT NOT NULL,           -- AI生成メッセージ
  lucky_color   TEXT,
  lucky_number  INTEGER,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(character_id, date)
);
```

### omikuji_results（おみくじ結果）
```sql
CREATE TABLE omikuji_results (
  id            SERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  result        TEXT NOT NULL,           -- 'daikichi' | 'kichi' | 'suekichi' | 'kyo'
  message       TEXT NOT NULL,
  drawn_at      TIMESTAMP DEFAULT NOW()
);
```

### fortune_sessions（占いセッション）
```sql
CREATE TABLE fortune_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  type          TEXT NOT NULL,           -- 'musubian' | 'negative_god' | 'mitama'
  input_data    JSONB,                   -- 入力データ（生年月日、時刻など）
  result        JSONB,                   -- 占い結果
  created_at    TIMESTAMP DEFAULT NOW()
);
```

### chat_messages（AIチャット履歴）
```sql
CREATE TABLE chat_messages (
  id            SERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  role          TEXT NOT NULL,           -- 'user' | 'assistant'
  content       TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

### monthly_reports（月次鑑定レポート）
```sql
CREATE TABLE monthly_reports (
  id            SERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  year          INTEGER NOT NULL,
  month         INTEGER NOT NULL,
  report_text   TEXT,                    -- AI生成レポート本文
  nine_year_cycle_year INTEGER,          -- 9年サイクルの何年目か
  theme         TEXT,                    -- その月のテーマ
  lucky_days    INTEGER[],               -- ラッキーデー
  pdf_url       TEXT,                    -- 生成済みPDFのURL
  generated_at  TIMESTAMP,
  UNIQUE(user_id, year, month)
);
```

### live_sessions（LIVE鑑定予約）
```sql
CREATE TABLE live_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  scheduled_at  TIMESTAMP NOT NULL,
  zoom_url      TEXT,
  status        TEXT DEFAULT 'scheduled', -- 'scheduled' | 'completed' | 'canceled'
  notes         TEXT,                    -- 寿枝さん用メモ
  created_at    TIMESTAMP DEFAULT NOW()
);
```

---

## 6. プラン定義

```typescript
// constants/plans.ts
export const PLANS = {
  free: {
    id: 'free',
    name: 'フリー',
    price: 0,
    features: {
      characterReveal: true,        // キャラ判定（1回）
      omikuji: 3,                   // おみくじ（月3回）
      fortuneBasic: true,           // 基本占い
      compatibilityCheck: 1,        // 相性診断（月1回）
      dailyMessage: false,
      monthlyReport: false,
      aiChat: false,
      liveSession: false,
    }
  },
  standard: {
    id: 'standard',
    name: '月額会員',
    price: 330,
    stripePriceId: process.env.STRIPE_PRICE_ID,
    features: {
      characterReveal: true,
      omikuji: Infinity,            // 無制限
      fortuneBasic: true,
      fortuneFull: true,            // 全占いコンテンツ
      compatibilityCheck: Infinity,
      dailyMessage: true,           // 毎日AIメッセージ
      characterDetail: true,        // キャラ詳細解説
      monthlyReport: true,          // 月次PDF
      nineYearCycle: true,          // 9年サイクル
      aiChat: true,                 // AIチャット
      liveSession: false,
    }
  }
};
```

---

## 7. 数秘術計算ロジック（コア）

```typescript
// lib/numerology.ts

/**
 * ライフパス数を計算する
 * 生年月日の全桁を1桁になるまで足す
 * マスターナンバー（11, 22, 33）は保持する
 */
export function calculateLifePathNumber(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  const sum = [...`${year}${month}${day}`]
    .reduce((acc, digit) => acc + parseInt(digit), 0);
  
  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(n: number): number {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n;
  const sum = [...`${n}`].reduce((acc, d) => acc + parseInt(d), 0);
  return reduceToSingleDigit(sum);
}

/**
 * ライフパス数からむすび族キャラIDを取得
 */
export function getCharacterByLifePath(lifePathNum: number): number {
  // キャラクターマッピング（DBから取得するが、初期値として定義）
  const mapping: Record<number, number> = {
    1: 1,   // Gola（火属性）
    2: 2,   // Pooch（水属性）
    3: 3,   // Geene（風属性）
    4: 4,   // Neo（土属性）
    5: 5,   // Gria（火属性）
    6: 6,   // Pante（水属性）
    7: 7,   // Leesa（風属性）
    8: 8,   // Pallecia（土属性）
    9: 9,   // Jori（火属性）
    11: 11, // Gre（マスターナンバー）
    22: 22, // Coola（マスターナンバー）
    33: 33, // Kastro（マスターナンバー）
  };
  return mapping[lifePathNum] ?? 1;
}

/**
 * 9年サイクルの現在の年数を取得
 */
export function getNineYearCycle(birthDate: Date, targetYear: number): number {
  const lifePathNum = calculateLifePathNumber(birthDate);
  const cycleYear = (targetYear - birthDate.getFullYear()) % 9;
  return ((lifePathNum + cycleYear - 1) % 9) + 1;
}
```

---

## 8. 画面フロー

```
【未ログイン】
  landing（むすび島トップ）
    ↓ 「無料で診断する」
  register（生年月日入力 → メール登録）
    ↓ 認証完了
  character-reveal（あなたのキャラは〇〇！）
    ↓ シェアボタン or 続ける
  free-dashboard（フリープランホーム）
    ↓ 「もっと詳しく見る」
  plan-comparison（プラン比較）
    ↓ スタンダード選択
  stripe-checkout（Stripe決済）
    ↓ 完了
  standard-dashboard（スタンダードホーム）

【ログイン済み】
  ホーム
  ├── 今日のおみくじ（毎日）
  ├── 今日のキャラメッセージ（AI生成）
  ├── 占いメニュー
  │   ├── むすび族占い（相性診断）
  │   ├── ネガティブ神占い
  │   └── み・たまカード
  ├── AIキャラチャット（スタンダード以上）
  └── マイページ
      ├── プラン確認・変更
      ├── 月次レポートPDF
      ├── LIVE鑑定予約（プレミアム）
      └── ログアウト

【管理者（寿枝さん）】
  admin/
  ├── ダッシュボード（売上・会員数）
  ├── キャラ管理（画像・テキスト）
  ├── コンテンツ管理（おみくじ文言）
  └── ユーザー一覧
```

---

## 9. API エンドポイント（tRPC）

```typescript
// サーバーのルーター構成

appRouter = {
  // 認証
  auth: {
    register,        // 新規登録（メール + 生年月日）
    login,           // ログイン
    me,              // ログインユーザー情報
  },
  
  // キャラクター
  character: {
    getMyCharacter,  // 自分のキャラ取得
    getById,         // キャラ詳細（スタンダード以上）
    getAll,          // キャラ一覧（管理者用）
    upsert,          // キャラ作成・更新（管理者用）
  },
  
  // 占い
  fortune: {
    getOmikuji,      // おみくじを引く
    getMusubian,     // むすび族占い（相性）
    getNegativeGod,  // ネガティブ神占い
    getMitama,       // み・たまカード
    getDailyMessage, // 今日のAIメッセージ（スタンダード以上）
  },
  
  // AIチャット
  ai: {
    chat,            // キャラAIチャット（スタンダード以上）
    generateReport,  // 月次レポート生成（バッチ用）
  },
  
  // サブスク・課金
  subscription: {
    createCheckout,  // Stripe Checkoutセッション作成
    getPortalUrl,    // Stripe Customer Portal URL
    getStatus,       // 現在のプラン情報
  },
  
  // 月次レポート
  report: {
    getByMonth,      // 月次レポート取得
    generate,        // 手動生成（管理者用）
  },
  
  // LIVE鑑定（プレミアム）
  liveSession: {
    getAvailable,    // 予約可能枠取得
    book,            // 予約
    cancel,          // キャンセル
  },
  
  // 管理者
  admin: {
    getDashboard,    // 売上・会員数
    getUsers,        // ユーザー一覧
    updateContent,   // コンテンツ更新
  },
}
```

---

## 10. 環境変数一覧

```bash
# .env.example（このファイルはGitに入れる）

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # サーバー側のみ
DATABASE_URL=postgresql://postgres:xxxx@db.xxxx.supabase.co:5432/postgres

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxx        # 本番
STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_STANDARD_PRICE_ID=price_xxxx
STRIPE_PREMIUM_PRICE_ID=price_xxxx

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxx

# Resend（メール）
RESEND_API_KEY=re_xxxx
EMAIL_FROM=noreply@musubijima.com

# App
EXPO_PUBLIC_API_URL=https://api.musubijima.com
NODE_ENV=production
```

---

## 11. Gitブランチ戦略

```
main          ← 本番環境（直接プッシュ禁止）
  └── develop ← 開発統合ブランチ
        ├── feature/auth-flow         # 認証フロー実装
        ├── feature/character-system  # キャラクターシステム
        ├── feature/stripe-billing    # Stripe課金
        ├── feature/ai-chat           # AIチャット機能
        ├── feature/admin-panel       # 管理画面
        └── fix/xxxx                  # バグ修正
```

### コミットメッセージ規則
```
feat: キャラ選択画面を追加
fix: おみくじが2回引ける不具合を修正
refactor: 数秘術計算ロジックを整理
docs: 設計書を更新
chore: パッケージを更新
```

---

## 12. MVPスコープ（Phase 1 ／ まず30人テスト）

### 作るもの（Phase 1）
- [x] プロジェクトセットアップ（arigajima → musubijima リネーム）
- [ ] Supabase セットアップ（DBスキーマ適用）
- [ ] 認証フロー（メール + 生年月日登録）
- [ ] 数秘術計算 → むすび族キャラ判定
- [ ] フリー / スタンダード プラン分岐
- [ ] Stripe 課金フロー（月額会員 ¥330/月）
- [ ] 今日のおみくじ（スタンダード以上：毎日 / フリー：月3回）
- [ ] キャラ詳細画面（スタンダード以上で全情報解放）
- [ ] 管理画面（シンプル版：キャラ画像・テキスト編集）
- [ ] SNSシェア用キャラ画像生成

### 作らない（Phase 2以降）
- AIキャラチャット（Claude API連携）
- 月次レポートPDF自動生成
- ネガティブ神占い・み・たまカード
- プレミアムプラン・LIVE鑑定
- プッシュ通知
- 占い講座動画配信

---

## 13. 開発手順（セットアップから最初のデプロイまで）

```bash
# 1. リポジトリ名変更（GitHub設定から）
# arigajima-uranai → musubijima-uranai

# 2. クローン
git clone https://github.com/hinfinitya00-sys/musubijima-uranai
cd musubijima-uranai

# 3. 依存インストール
pnpm install

# 4. mysql2 を削除 → postgres に変更
pnpm remove mysql2
pnpm add postgres @supabase/supabase-js

# 5. 環境変数設定
cp .env.example .env.local
# → Supabase, Stripe, Claude API キーを入力

# 6. DBスキーマ適用
pnpm db:push

# 7. 開発サーバー起動
pnpm dev

# 8. ビルド・デプロイ
# Webアプリ: Vercel にプッシュで自動デプロイ
# アプリ: expo build（Phase 2以降）
```

---

## 14. 自動化設計（寿枝さんの稼働最小化）

| 業務 | 方法 | 頻度 | 寿枝さん稼働 |
|------|------|------|-------------|
| 毎日のキャラメッセージ | Claude API → DB保存 → 配信 | 毎朝6時 | なし |
| 月次レポートPDF | Supabase Edge Functions | 毎月1日 | なし |
| 課金・請求 | Stripe自動 | 随時 | なし |
| おみくじ結果 | アプリ内で完結 | 随時 | なし |
| ウェルカムメール | Resend自動 | 登録時 | なし |
| LIVE鑑定予約受付 | Calendly連携 | 随時 | 鑑定20回/月 |
| SNSコンテンツ | Buffer等で事前スケジュール | 週1確認 | 週2〜3時間 |
| 問い合わせ対応 | AI一次対応 → 必要時エスカレ | 随時 | 月5時間以下 |

**寿枝さんの月間稼働目標：25〜30時間以内**

---

## 15. 収益分配（契約メモ）

- 月次サブスク売上の **30%** を其田彪に支払う
- 支払いタイミング：毎月末締め → 翌月10日振込
- サーバー・ツール費用（Supabase, Stripe, Zoom等）は事業経費として売上から先引き
- アプリのコード著作権：其田彪
- コンテンツ著作権（キャラ・占いデータ）：其田寿枝

---

*このドキュメントは開発の北極星です。迷ったらここに戻る。*  
*更新するときはGitでコミット履歴を残す。*
