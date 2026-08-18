import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) return json({ error: '認証が必要です。' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const token = authorization.slice('Bearer '.length);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return json({ error: 'ログイン情報を確認できませんでした。' }, 401);

    const priceId = Deno.env.get('STRIPE_PRICE_ID');
    if (!priceId) throw new Error('STRIPE_PRICE_ID is not configured');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, plan_type')
      .eq('id', user.id)
      .single();
    if (profileError || !profile) throw new Error('会員プロフィールを確認できませんでした。');
    if (profile.plan_type === 'standard' || profile.stripe_subscription_id) {
      return json({ error: 'すでに会員プランをご利用中です。' }, 409);
    }

    let customerId = profile.stripe_customer_id as string | null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      const { error } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
      if (error) throw error;
    }

    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 10 });
    const hasLiveSubscription = subscriptions.data.some(({ status }) =>
      ['active', 'trialing', 'past_due', 'unpaid', 'paused'].includes(status)
    );
    if (hasLiveSubscription) return json({ error: '有効な定期購入がすでに存在します。' }, 409);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id },
      payment_method_types: ['card', 'link'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://hinfinitya00-sys.github.io/musubijima-uranai/subscription/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://hinfinitya00-sys.github.io/musubijima-uranai/subscription/plans',
      locale: 'ja',
      payment_method_collection: 'if_required',
    });

    return json({ url: session.url });
  } catch (error) {
    console.error('create-checkout-session failed', error);
    return json({ error: '決済の開始に失敗しました。時間をおいて再度お試しください。' }, 500);
  }
});
