import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { publicProcedure, protectedProcedure, router } from '../_core/trpc';
import { db } from '../db/client';
import { users } from '../db/schema';
import { calculateLifePathNumber, getCharacterIdByLifePath } from '../../lib/numerology';

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      birthDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      const birthDate = new Date(input.birthDate);
      const lifePathNum = calculateLifePathNumber(birthDate);
      const characterId = getCharacterIdByLifePath(lifePathNum);

      const [user] = await db.insert(users).values({
        email: input.email,
        name: input.name ?? null,
        birthDate: input.birthDate,
        lifePathNum,
        characterId,
        plan: 'free',
      }).returning();

      return { user, lifePathNum, characterId };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    return ctx.user;
  }),
});
