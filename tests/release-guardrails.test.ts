import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

describe('release guardrails', () => {
  it('does not expose the legacy demo checkout or old price', () => {
    const legacyRoute = read('app/subscription.tsx');
    const settings = read('app/(tabs)/settings.tsx');
    expect(legacyRoute).toContain('<Redirect href="/subscription/plans"');
    expect(legacyRoute).not.toContain('subscribe()');
    expect(settings).toContain('月額330円');
    expect(settings).not.toContain(String(98 * 10));
  });

  it('derives checkout identity and price on the server', () => {
    const checkout = read('supabase/functions/create-checkout-session/index.ts');
    expect(checkout).toContain('supabase.auth.getUser(token)');
    expect(checkout).toContain("Deno.env.get('STRIPE_PRICE_STANDARD')");
    expect(checkout).not.toContain('const { priceId, userId, email }');
    expect(checkout).toContain('hasLiveSubscription');
  });

  it('keeps paid access synchronized across Stripe lifecycle events', () => {
    const webhook = read('supabase/functions/stripe-webhook/index.ts');
    expect(webhook).toContain("case 'checkout.session.completed'");
    expect(webhook).toContain("case 'customer.subscription.updated'");
    expect(webhook).toContain("case 'customer.subscription.deleted'");
    expect(webhook).toContain("case 'invoice.paid'");
    expect(webhook).toContain("case 'invoice.payment_failed'");
    expect(webhook).toContain('stripe.subscriptions.list');
    expect(webhook).toContain('syncCurrentSubscription');
    expect(webhook).toContain("status: 500");
  });

  it('creates a profile for every authenticated user and protects billing fields', () => {
    const migration = read('supabase/migrations/20260818000100_profiles_subscription_security.sql');
    expect(migration).toContain('create trigger on_auth_user_created');
    expect(migration).toContain('revoke insert, update, delete');
    expect(migration).toContain('Users can read their own profile');
  });

  it('keeps the login screen connected to an explicit registration flow', () => {
    const login = read('app/(auth)/login.tsx');
    const callback = read('app/oauth/callback.tsx');
    expect(login).toContain('初めての方は新規登録へ');
    expect(callback).toContain('exchangeCodeForSession');
    expect(callback).toContain("next.startsWith('/')");
  });

  it('does not expose Google auth before the provider is configured', () => {
    for (const file of ['app/(auth)/login.tsx', 'app/(auth)/register.tsx']) {
      const source = read(file);
      expect(source).toContain("process.env.EXPO_PUBLIC_GOOGLE_AUTH_ENABLED === 'true'");
      expect(source).toContain('isGoogleAuthEnabled &&');
    }
  });

  it('keeps web safe-area metrics deterministic during hydration', () => {
    const layout = read('app/_layout.tsx');
    expect(layout).toContain('Platform.OS === "web"');
    expect(layout).toContain('? DEFAULT_WEB_INSETS');
    expect(layout).toContain('? DEFAULT_WEB_FRAME');
  });

  it('does not render the tab home behind every direct route', () => {
    const layout = read('app/_layout.tsx');
    expect(layout).not.toContain('anchor: "(tabs)"');
  });

  it('uses a synchronous root slot for static web routes', () => {
    const layout = read('app/_layout.tsx');
    expect(layout).toContain('Platform.OS === "web" ? (');
    expect(layout).toContain('<Slot />');
  });
});
