import { prisma } from "@/lib/db";
import { cancelSubscription } from "@/lib/paystack";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: {
        paystackSubscriptionCode: true,
        paystackCustomerCode: true,
      },
    });

    if (!subscription?.paystackSubscriptionCode) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const emailToken: string | undefined = body.emailToken;

    if (!emailToken) {
      return NextResponse.json(
        { error: "emailToken is required to cancel subscription" },
        { status: 400 },
      );
    }

    await cancelSubscription(subscription.paystackSubscriptionCode, emailToken);

    return NextResponse.json({ cancelled: true });
  } catch (err) {
    console.error("[Paystack cancel] Error:", err);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
