import { z } from 'zod';
import { eq, and, gte, sql } from 'drizzle-orm';
import { protectedProcedure, router } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db/client';
import { omikujiResults, dailyMessages, users } from '../db/schema';

const OMIKUJI_RESULTS = ['daikichi', 'kichi', 'suekichi', 'kyo'] as const;
const OMIKUJI_MESSAGES: Record<string, string[]> = {
  daikichi: [
    'すべてが順調に進む兆し。自信を持って前に進みましょう。',
    '大きな幸運が訪れる日。新しいことを始めるのに最適です。',
  ],
  kichi: [
    '穏やかな幸せが続きます。今の歩みを大切に。',
    '小さな喜びが積み重なる日。感謝の気持ちを忘れずに。',
  ],
  suekichi: [
    '少しずつ運気が上昇中。焦らず待���ましょう。',
    'じっくり取り���むことで、良い結果が得られるでしょう。',
  ],
  kyo: [
    '今は力を蓄えるとき。無理せず休息を取りましょう。',
    '試練は成長のチャンス。乗り越えた先に光があります。',
  ],
};

export const fortuneRouter = router({
  getOmikuji: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const userRecord = await db.select().from(users).where(eq(users.email, user.email ?? '')).limit(1);
    if (!userRecord[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const plan = userRecord[0].plan ?? 'free';

    if (plan === 'free') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await db.select({ count: sql<number>`count(*)` })
        .from(omikujiResults)
        .where(and(
          eq(omikujiResults.userId, userRecord[0].id),
          gte(omikujiResults.drawnAt, startOfMonth),
        ));

      if ((monthlyCount[0]?.count ?? 0) >= 3) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'フリープランでは月3回までおみくじを引けます。スタンダ���ドプランで無制限に。',
        });
      }
    }

    const resultType = OMIKUJI_RESULTS[Math.floor(Math.random() * OMIKUJI_RESULTS.length)];
    const messages = OMIKUJI_MESSAGES[resultType];
    const message = messages[Math.floor(Math.random() * messages.length)];

    const [omikuji] = await db.insert(omikujiResults).values({
      userId: userRecord[0].id,
      result: resultType,
      message,
    }).returning();

    return omikuji;
  }),

  getDailyMessage: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const userRecord = await db.select().from(users).where(eq(users.email, user.email ?? '')).limit(1);
    if (!userRecord[0]) throw new TRPCError({ code: 'NOT_FOUND' });

    const plan = userRecord[0].plan ?? 'free';
    if (plan === 'free') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: '毎日のメッセージはスタンダードプラン以上で利用できます。',
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const [message] = await db.select().from(dailyMessages)
      .where(and(
        eq(dailyMessages.characterId, userRecord[0].characterId ?? 0),
        eq(dailyMessages.date, today),
      ))
      .limit(1);

    return message ?? null;
  }),
});
