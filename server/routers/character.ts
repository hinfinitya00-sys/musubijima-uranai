import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { publicProcedure, protectedProcedure, adminProcedure, router } from '../_core/trpc';
import { db } from '../db/client';
import { characters, users } from '../db/schema';

export const characterRouter = router({
  getMyCharacter: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) return null;

    const userRecord = await db.select().from(users).where(eq(users.email, user.email ?? '')).limit(1);
    if (!userRecord[0]?.characterId) return null;

    const [character] = await db.select().from(characters)
      .where(eq(characters.id, userRecord[0].characterId))
      .limit(1);

    if (!character) return null;

    const plan = userRecord[0].plan ?? 'free';
    if (plan === 'free') {
      return {
        ...character,
        descriptionFull: null,
        personality: null,
      };
    }

    return character;
  }),

  getAll: adminProcedure.query(async () => {
    return db.select().from(characters);
  }),

  upsert: adminProcedure
    .input(z.object({
      id: z.number().optional(),
      name: z.string(),
      nameJa: z.string().optional(),
      attribute: z.enum(['fire', 'water', 'wind', 'earth']),
      lifePathNumbers: z.array(z.number()).optional(),
      description: z.string().optional(),
      descriptionFull: z.string().optional(),
      imageUrl: z.string().optional(),
      personality: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      if (input.id) {
        const [updated] = await db.update(characters)
          .set({
            name: input.name,
            nameJa: input.nameJa,
            attribute: input.attribute,
            lifePathNumbers: input.lifePathNumbers,
            description: input.description,
            descriptionFull: input.descriptionFull,
            imageUrl: input.imageUrl,
            personality: input.personality,
          })
          .where(eq(characters.id, input.id))
          .returning();
        return updated;
      }

      const [created] = await db.insert(characters).values({
        name: input.name,
        nameJa: input.nameJa,
        attribute: input.attribute,
        lifePathNumbers: input.lifePathNumbers,
        description: input.description,
        descriptionFull: input.descriptionFull,
        imageUrl: input.imageUrl,
        personality: input.personality,
      }).returning();
      return created;
    }),
});
