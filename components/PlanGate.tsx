import React from 'react';
import { MembershipContinuation } from './MembershipContinuation';

interface PlanGateProps {
  locked: boolean;
  children: React.ReactNode;
}

/** @deprecated 新規実装ではMembershipContinuationを直接使用する。 */
export function PlanGate({ locked, children }: PlanGateProps) {
  return <MembershipContinuation locked={locked}>{children}</MembershipContinuation>;
}
