import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { protectedProcedure, router } from '../_core/trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db/client';
import { users } from '../db/schema';
import Stripe from 'stripe';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Stripe not configured' });
  return new Stripe(key, { apiVersion: '2025-04-30.basil' });
}

export const subscriptionRouter = router({
  createCheckout: protectedProcedure
    .input(z.object({
      plan: z.enum(['standard', 'premium']),
      successUrl: z.string(),
      cancelUrl: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const stripe = getStripe();

      const userRecord = await db.select().from(users).where(eq(users.email, user.email ?? '')).limit(1);
      if (!userRecord[0]) throw new TRPCError({ code: 'NOT_FOUND' });

      let customerId = userRecord[0].stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: userRecord[0].email,
          name: userRecord[0].name ?? undefined,
        });
        customerId = customer.id;
        await db.update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, userRecord[0].id));
      }

      const priceId = input.plan === 'standard'
        ? process.env.STRIPE_STANDARD_PRICE_ID
        : process.env.STRIPE_PREMIUM_PRICE_ID;

      if (!priceId) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Price ID not configured' });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      });

      return { url: session.url };
    }),

  getPortalUrl: protectedProcedure
    .input(z.object({ returnUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const userRecord = await db.select().from(users).where(eq(users.email, user.email ?? '')).limit(1);
      if (!userRecord[0]?.stripeCustomerId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No subscription found' });
      }

      const stripe = getStripe();
      const session = await stripe.billingPortal.sessions.create({
        customer: userRecord[0].stripeCustomerId,
        return_url: input.returnUrl,
      });

      return { url: session.url };
    }),

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const userRecord = await db.select().from(users).where(eq(users.email, user.email ?? '')).limit(1);
    if (!userRecord[0]) throw new TRPCError({ code: 'NOT_FOUND' });

    return {
      plan: userRecord[0].plan ?? 'free',
      subscriptionStatus: userRecord[0].subscriptionStatus,
      stripeSubscriptionId: userRecord[0].stripeSubscriptionId,
    };
  }),
});
