import { env } from "@/env";
import { prisma } from "@/lib/db";
import { Plan } from "@/lib/generated/prisma";
import {
  upsertSubscription
} from "@/lib/paystack-subscription";
import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function verifyPaystackSignature(rawBody: string, signature: string): boolean {
  const computedHash = createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  if (computedHash.length !== signature.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(computedHash, "hex"),
      Buffer.from(signature, "hex"),
    );
  } catch {
    return false;
  }
}


async function handleChargeSuccess(data: any) {
  const userId: string | undefined = data.metadata?.userId;
  if (!userId) return;

  const customerCode: string = data.customer?.customer_code;
  const subscriptionCode: string | undefined =
    data.subscription_code ?? data.subscription?.subscription_code;
  const planCode: string | undefined =
    data.plan?.plan_code ?? data.plan_object?.plan_code;
  const nextPaymentDate: string | undefined =
    data.subscription?.next_payment_date ?? data.next_payment_date;

  await upsertSubscription({
    userId,
    customerCode,
    subscriptionCode,
    planCode,
    nextPaymentDate,
  });
}

async function handleSubscriptionCreate(data: any) {
  const subscriptionCode: string = data.subscription_code;
  const customerCode: string = data.customer?.customer_code;
  const nextPaymentDate: string | undefined = data.next_payment_date;

  if (!subscriptionCode || !nextPaymentDate || !customerCode) return;

  await prisma.subscription.updateMany({
    where: { paystackCustomerCode: customerCode },
    data: {
      currentPeriodEnd: new Date(nextPaymentDate),
      paystackSubscriptionCode: subscriptionCode,
    },
  });
}

async function handleSubscriptionDisable(data: any) {
  const subscriptionCode: string = data.subscription_code;
  if (!subscriptionCode) return;

  await prisma.subscription.updateMany({
    where: { paystackSubscriptionCode: subscriptionCode },
    data: {
      plan: Plan.FREE,
      cancelAtPeriodEnd: true,
    },
  });
}

async function handleInvoicePaymentFailed(data: any) {
  // Log only — do not downgrade immediately (give user a grace period)
  console.warn("[Paystack] Invoice payment failed:", {
    subscriptionCode: data.subscription_code,
    customer: data.customer?.email,
    amount: data.amount,
  });
}


export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  if (!verifyPaystackSignature(rawBody, signature)) {
    console.warn("[Paystack webhook] Invalid signature — rejected");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event: string; data: any };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(event.data);
        break;
      case "subscription.create":
        await handleSubscriptionCreate(event.data);
        break;
      case "subscription.disable":
        await handleSubscriptionDisable(event.data);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[Paystack webhook] Handler error:", err);
    // Return 500 so Paystack retries (up to 5× over 72h)
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
