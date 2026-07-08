import { env } from "@/env";
import { initializeTransaction } from "@/lib/paystack";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { planCode, interval } = body as {
      planCode?: string;
      interval?: "monthly" | "annual";
    };

    const resolvedPlanCode =
      planCode ??
      (interval === "annual"
        ? env.PAYSTACK_PRO_ANNUAL_PLAN_CODE
        : env.PAYSTACK_PRO_MONTHLY_PLAN_CODE);

    const email =
      user.emailAddresses[0]?.emailAddress ?? `${userId}@cvcopilot.app`;

    // callback_url: Paystack redirects here after payment.
    // This activates the subscription immediately, acting as a fallback
    // if the webhook is delayed or fails.
    const callbackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/paystack/callback`;

    const transaction = await initializeTransaction(
      email,
      resolvedPlanCode,
      { userId },          // echoed back in webhook & callback metadata
      callbackUrl,
    );

    return NextResponse.json({ authorizationUrl: transaction.authorization_url });
  } catch (err) {
    console.error("[Paystack checkout] Error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
