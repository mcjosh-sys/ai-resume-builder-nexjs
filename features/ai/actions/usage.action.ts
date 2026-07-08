"use server";

import { getUsageSummary, getUserPlan } from "@/lib/subscription";
import { getUserId } from "@/server/action";

export async function getAIUsageSummary() {
  const userId = await getUserId();
  return getUsageSummary(userId);
}

export async function getCurrentPlan() {
  const userId = await getUserId();
  return getUserPlan(userId);
}
