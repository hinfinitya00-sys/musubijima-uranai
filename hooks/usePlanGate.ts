import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function usePlanGate() {
  const [plan, setPlan] = useState<string>('free');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('plan_type')
          .eq('id', session.user.id)
          .single();
        if (data?.plan_type) setPlan(data.plan_type);
      }
    };
    load();
  }, []);

  return {
    plan,
    isFree: plan === 'free',
    isLight: plan === 'light' || plan === 'standard',
    isStandard: plan === 'standard',
    canUse: {
      omikuji: true,
      mitamaDaily: plan !== 'free',
      mitamaMonthly: true,
      lifeRhythmAll: plan !== 'free',
      lifeRhythmCurrent: true,
      negativeGod: plan !== 'free',
      musubian: plan !== 'free',
      lineDelivery: plan === 'standard',
      monthlyReport: plan === 'standard',
    },
  };
}
