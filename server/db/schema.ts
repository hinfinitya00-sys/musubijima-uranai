import { pgTable, text, integer, boolean, timestamp, date, uuid, serial, jsonb } from 'drizzle-orm/pg-core';

// ユーザーテーブル
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  birthDate: date('birth_date').notNull(),
  lifePathNum: integer('life_path_num'),
  characterId: integer('character_id'),
  plan: text('plan').default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status'),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// むすび族キャラクター
export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  nameJa: text('name_ja'),
  attribute: text('attribute').notNull(),
  lifePathNumbers: integer('life_path_numbers').array(),
  description: text('description'),
  descriptionFull: text('description_full'),
  imageUrl: text('image_url'),
  personality: text('personality'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 毎日のAIメッセージ
export const dailyMessages = pgTable('daily_messages', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  date: date('date').notNull(),
  message: text('message').notNull(),
  luckyColor: text('lucky_color'),
  luckyNumber: integer('lucky_number'),
  createdAt: timestamp('created_at').defaultNow(),
});

// おみくじ結果
export const omikujiResults = pgTable('omikuji_results', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  result: text('result').notNull(),
  message: text('message').notNull(),
  drawnAt: timestamp('drawn_at').defaultNow(),
});

// 占いセッション
export const fortuneSessions = pgTable('fortune_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(),
  inputData: jsonb('input_data'),
  result: jsonb('result'),
  createdAt: timestamp('created_at').defaultNow(),
});

// AIチャット履歴
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 月次鑑定レポート
export const monthlyReports = pgTable('monthly_reports', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  reportText: text('report_text'),
  nineYearCycleYear: integer('nine_year_cycle_year'),
  theme: text('theme'),
  luckyDays: integer('lucky_days').array(),
  pdfUrl: text('pdf_url'),
  generatedAt: timestamp('generated_at'),
});

// LIVE鑑定予約
export const liveSessions = pgTable('live_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  scheduledAt: timestamp('scheduled_at').notNull(),
  zoomUrl: text('zoom_url'),
  status: text('status').default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});
