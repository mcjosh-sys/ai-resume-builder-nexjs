import { env } from "@/env";
import { prisma } from "@/lib/db";
import { Plan } from "@/lib/generated/prisma";
import { PaystackTransaction, verifyTransaction } from "@/lib/paystack";

// ─── Plan resolution ──────────────────────────────────────────────────────────

export function resolvePlanFromCode(planCode: string): Plan {
  const proPlanCodes = [
    env.PAYSTACK_PRO_MONTHLY_PLAN_CODE,
    env.PAYSTACK_PRO_ANNUAL_PLAN_CODE,
  ];
  const teamPlanCodes = [
    env.PAYSTACK_TEAM_MONTHLY_PLAN_CODE,
    env.PAYSTACK_TEAM_ANNUAL_PLAN_CODE,
  ].filter(Boolean);

  if (proPlanCodes.includes(planCode)) return Plan.PRO;
  if (teamPlanCodes.includes(planCode)) return Plan.TEAM;
  return Plan.FREE;
}


type UpsertInput = {
  userId: string;
  customerCode: string;
  subscriptionCode?: string;
  planCode?: string;
  nextPaymentDate?: string;
};

export async function upsertSubscription({
  userId,
  customerCode,
  subscriptionCode,
  planCode,
  nextPaymentDate,
}: UpsertInput): Promise<void> {
  const plan = planCode ? resolvePlanFromCode(planCode) : Plan.PRO;
  const currentPeriodEnd = nextPaymentDate
    ? new Date(nextPaymentDate)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      paystackCustomerCode: customerCode,
      paystackSubscriptionCode: subscriptionCode,
      paystackPlanCode: planCode,
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
    },
    update: {
      plan,
      paystackCustomerCode: customerCode,
      ...(subscriptionCode && { paystackSubscriptionCode: subscriptionCode }),
      ...(planCode && { paystackPlanCode: planCode }),
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
    },
  });
}

export async function activateFromReference(reference: string): Promise<boolean> {
  let tx: PaystackTransaction;
  try {
    tx = await verifyTransaction(reference);
  } catch (err) {
    console.error("[activateFromReference] Verification failed:", err);
    return false;
  }

  if (tx.status !== "success") {
    console.warn("[activateFromReference] Transaction not successful:", tx.status);
    return false;
  }

  const userId: string | undefined = (tx as any).metadata?.userId;
  if (!userId) {
    console.error("[activateFromReference] No userId in transaction metadata");
    return false;
  }

  await upsertSubscription({
    userId,
    customerCode: tx.customer.customer_code,
    subscriptionCode: tx.subscription?.subscription_code,
    planCode: tx.plan?.plan_code,
    nextPaymentDate: tx.subscription?.next_payment_date,
  });

  return true;
}
