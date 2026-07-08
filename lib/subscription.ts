import { prisma } from "@/lib/db";
import { UpgradeRequiredError } from "@/lib/errors";
import { AIFeature, Plan } from "@/lib/generated/prisma";
import {
  AI_FEATURE_LABELS,
  AI_LIMITS,
  RESUME_LIMITS,
} from "@/lib/plans";

function currentPeriodStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function getUserPlan(userId: string): Promise<Plan> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true },
  });
  return sub?.plan ?? Plan.FREE;
}

export async function checkResumeLimit(userId: string): Promise<void> {
  const plan = await getUserPlan(userId);
  const limit = RESUME_LIMITS[plan];
  if (limit === Infinity) return;

  const count = await prisma.resume.count({
    where: { userId, isDeleted: false },
  });

  if (count >= limit) {
    throw new UpgradeRequiredError(
      `You've reached your ${limit}-resume limit on the Free plan.`,
      { feature: "resumes", requiredPlan: "PRO", usage: { used: count, limit } },
    );
  }
}

// ─── AI access & usage ────────────────────────────────────────────────────────

/**
 * Throws `UpgradeRequiredError` if the user's plan does not allow the feature
 * at all (limit === 0). Call this before any metered AI action.
 */
export async function checkAIAccess(
  userId: string,
  feature: AIFeature,
): Promise<void> {
  const plan = await getUserPlan(userId);
  const limit = AI_LIMITS[plan][feature];
  if (limit === 0) {
    throw new UpgradeRequiredError(
      `${AI_FEATURE_LABELS[feature]} requires a Pro plan.`,
      { feature, requiredPlan: "PRO" },
    );
  }
}

/**
 * Throws `UpgradeRequiredError` if the user has exhausted their monthly quota
 * for the given feature. Call this after `checkAIAccess`.
 */
export async function checkAIUsage(
  userId: string,
  feature: AIFeature,
): Promise<void> {
  const plan = await getUserPlan(userId);
  const limit = AI_LIMITS[plan][feature];
  if (limit === Infinity) return;

  const periodStart = currentPeriodStart();
  const record = await prisma.usageRecord.findUnique({
    where: { userId_feature_periodStart: { userId, feature, periodStart } },
    select: { count: true },
  });
  const used = record?.count ?? 0;

  if (used >= limit) {
    throw new UpgradeRequiredError(
      `You've used all ${limit} ${AI_FEATURE_LABELS[feature]} credits for this month.`,
      { feature, requiredPlan: "PRO", usage: { used, limit } },
    );
  }
}

/**
 * Increments the usage counter for the given feature in the current month.
 * Creates the record if it doesn't exist, resets if the month has rolled over.
 */
export async function incrementAIUsage(
  userId: string,
  feature: AIFeature,
): Promise<void> {
  const periodStart = currentPeriodStart();
  await prisma.usageRecord.upsert({
    where: { userId_feature_periodStart: { userId, feature, periodStart } },
    create: { userId, feature, periodStart, count: 1 },
    update: { count: { increment: 1 } },
  });
}

// ─── Usage summary (for UI display) ──────────────────────────────────────────

export type UsageSummaryItem = {
  feature: AIFeature;
  label: string;
  used: number;
  limit: number;
  /** true when the feature is hard-blocked (limit === 0) */
  hardBlocked: boolean;
};

/**
 * Returns the current month's AI usage for every feature,
 * shaped for direct consumption by the copilot panel UI.
 */
export async function getUsageSummary(
  userId: string,
): Promise<UsageSummaryItem[]> {
  const plan = await getUserPlan(userId);
  const periodStart = currentPeriodStart();

  const records = await prisma.usageRecord.findMany({
    where: { userId, periodStart },
    select: { feature: true, count: true },
  });

  const usageMap = Object.fromEntries(records.map((r) => [r.feature, r.count]));

  return (Object.values(AIFeature) as AIFeature[]).map((feature) => {
    const limit = AI_LIMITS[plan][feature];
    const used = usageMap[feature] ?? 0;
    return {
      feature,
      label: AI_FEATURE_LABELS[feature],
      used,
      limit,
      hardBlocked: limit === 0,
    };
  });
}
