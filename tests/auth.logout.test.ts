import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('auth.logout', () => {
  it('signs out through Supabase and returns to the login screen', () => {
    const settings = readFileSync(
      new URL('../app/(tabs)/settings.tsx', import.meta.url),
      'utf8',
    );
    expect(settings).toContain('await supabase.auth.signOut()');
    expect(settings).toContain("router.replace('/(auth)/login'");
    expect(settings).toContain('ログアウト');
  });
});
