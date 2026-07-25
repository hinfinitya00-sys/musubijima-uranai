import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const DEBUG_UNLOCK_ALL = false;

export function usePlanGate() {
  const [plan, setPlan] = useState<string>('free');
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('plan_type, trial_ends_at')
          .eq('id', session.user.id)
          .single();
        if (data?.plan_type) setPlan(data.plan_type);
        if (data?.trial_ends_at) {
          const trialEnd = new Date(data.trial_ends_at);
          const now = new Date();
          if (trialEnd > now) {
            setIsTrialActive(true);
            setTrialDaysLeft(Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          }
        }
      }
    };
    load();
  }, []);

  const effectivePlan = DEBUG_UNLOCK_ALL ? 'standard' : (isTrialActive && plan === 'free' ? 'light' : plan);

  return {
    plan,
    effectivePlan,
    isTrialActive,
    trialDaysLeft,
    isFree: effectivePlan === 'free',
    isLight: effectivePlan === 'light' || effectivePlan === 'standard',
    isStandard: effectivePlan === 'standard',
    canUse: {
      omikuji: true,
      mitamaDaily: effectivePlan !== 'free',
      mitamaMonthly: true,
      lifeRhythmAll: effectivePlan !== 'free',
      lifeRhythmCurrent: true,
      negativeGod: effectivePlan !== 'free',
      musubian: effectivePlan !== 'free',
      lineDelivery: effectivePlan === 'standard',
      monthlyReport: effectivePlan === 'standard',
    },
  };
}
