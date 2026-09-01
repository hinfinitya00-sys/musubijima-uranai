import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing Stripe signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    );
  } catch (error) {
    return new Response(`Webhook Error: ${(error as Error).message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const updateByCustomer = async (customerId: string, values: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('stripe_customer_id', customerId)
      .select('id');
    if (error) throw error;
    if (!data?.length) throw new Error(`Profile not found for Stripe customer ${customerId}`);
  };

  // StripeはWebhookの到着順を保証しない。イベントのpayloadだけで状態を
  // 上書きせず、Stripe上の現在値を取得してから権限を同期する。
  const syncCurrentSubscription = async (customerId: string) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    });
    const activeSubscription = subscriptions.data.find((subscription) =>
      ['active', 'trialing'].includes(subscription.status)
    );
    await updateByCustomer(customerId, {
      plan_type: activeSubscription ? 'standard' : 'free',
      stripe_subscription_id: activeSubscription?.id ?? null,
    });
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.customer || !session.subscription) throw new Error('Checkout session is missing subscription data');
        await syncCurrentSubscription(session.customer as string);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await syncCurrentSubscription(subscription.customer as string);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) await syncCurrentSubscription(invoice.customer as string);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) await syncCurrentSubscription(invoice.customer as string);
        break;
      }
    }
  } catch (error) {
    console.error(`stripe-webhook ${event.id} failed`, error);
    return new Response('Webhook processing failed', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
