import { activateFromReference } from "@/lib/paystack-subscription";
import { NextRequest, NextResponse } from "next/server";

/**
 * Paystack payment callback — fires when the user is redirected back from
 * Paystack's hosted payment page after a successful (or failed) payment.
 *
 * This is the FIRST LINE OF DEFENCE against webhook delivery failures.
 * The activation is idempotent: if the webhook already ran, the upsert is
 * a no-op. If the webhook hasn't run yet, this ensures the user's plan is
 * upgraded immediately.
 *
 * URL: /api/paystack/callback?reference=<trxref>
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Paystack sends both `reference` and `trxref` (they're the same value)
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");

  if (!reference) {
    // No reference — something went wrong on Paystack's side
    return NextResponse.redirect(
      new URL("/dashboard?payment=failed&reason=no_reference", req.url),
    );
  }

  const activated = await activateFromReference(reference);

  if (activated) {
    // Plan is now live — redirect to dashboard with a success flash
    return NextResponse.redirect(
      new URL("/dashboard?payment=success", req.url),
    );
  }

  // Transaction exists but wasn't successful (abandoned, failed, etc.)
  return NextResponse.redirect(
    new URL("/dashboard?payment=failed&reason=not_successful", req.url),
  );
}
