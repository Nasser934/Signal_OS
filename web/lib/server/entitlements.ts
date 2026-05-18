import { AppError } from '@/lib/observability/logger';
import type { Plan } from '@/lib/server/auth';

export type PaidFeature =
  | 'command_center'
  | 'reply_assistant'
  | 'weekly_report'
  | 'advanced_tracking';

const FEATURE_MIN_PLAN: Record<PaidFeature, Plan> = {
  command_center: 'creator',
  reply_assistant: 'creator',
  weekly_report: 'creator',
  advanced_tracking: 'pro',
};

const PLAN_RANK: Record<Plan, number> = {
  free: 0,
  creator: 1,
  pro: 2,
  agency: 3,
};

export function assertEntitled(plan: Plan, feature: PaidFeature): void {
  if (PLAN_RANK[plan] < PLAN_RANK[FEATURE_MIN_PLAN[feature]]) {
    throw new AppError('Upgrade required for this feature', 'UNAUTHORIZED', 402, {
      feature,
      requiredPlan: FEATURE_MIN_PLAN[feature],
      currentPlan: plan,
    });
  }
}
