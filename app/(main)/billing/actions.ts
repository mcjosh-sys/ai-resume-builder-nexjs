"use server";

import { prisma } from "@/lib/db";
import { getUsageSummary, getUserPlan } from "@/lib/subscription";
import { getUserId } from "@/server/action";
import { fetchSubscription } from "@/lib/paystack";

export type BillingData = {
  plan: "FREE" | "PRO" | "TEAM";
  resumeCount: number;
  resumeLimit: number;
  subscription: {
    paystackSubscriptionCode: string | null;
    paystackPlanCode: string | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  usage: {
    feature: string;
    label: string;
    used: number;
    limit: number;
    hardBlocked: boolean;
  }[];
};

export async function getBillingData(): Promise<BillingData> {
  const userId = await getUserId();
  const [plan, sub, resumes, usage] = await Promise.all([
    getUserPlan(userId),
    prisma.subscription.findUnique({
      where: { userId },
      select: {
        paystackSubscriptionCode: true,
        paystackPlanCode: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
    prisma.resume.count({ where: { userId, isDeleted: false } }),
    getUsageSummary(userId),
  ]);

  const resumeLimit = plan === "FREE" ? 2 : Infinity;

  return {
    plan: plan as "FREE" | "PRO" | "TEAM",
    resumeCount: resumes,
    resumeLimit,
    subscription: sub,
    usage,
  };
}

export async function cancelSubscriptionAction(): Promise<{ ok: boolean; error?: string }> {
  const userId = await getUserId();
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { paystackSubscriptionCode: true },
  });

  if (!sub?.paystackSubscriptionCode) {
    return { ok: false, error: "No active subscription found" };
  }

  // Fetch the email_token from Paystack on demand (not stored, but always retrievable)
  let emailToken: string;
  try {
    const paystackSub = await fetchSubscription(sub.paystackSubscriptionCode);
    emailToken = (paystackSub as any).email_token;
    if (!emailToken) throw new Error("No email_token in Paystack response");
  } catch (err) {
    return { ok: false, error: "Could not retrieve subscription details from Paystack" };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailToken }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? "Cancellation failed" };
  }

  return { ok: true };
}
