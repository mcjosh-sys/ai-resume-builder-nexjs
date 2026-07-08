import { env } from "@/env";

const PAYSTACK_BASE = "https://api.paystack.co";


async function paystackFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(
      `Paystack error [${res.status}]: ${json.message ?? "Unknown error"}`,
    );
  }
  return json.data as T;
}

export type PaystackTransactionInit = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type PaystackTransaction = {
  id: number;
  reference: string;
  status: "success" | "failed" | "abandoned";
  amount: number;
  customer: {
    id: number;
    customer_code: string;
    email: string;
  };
  plan?: {
    plan_code: string;
    name: string;
  };
  subscription?: {
    subscription_code: string;
    email_token: string;
    next_payment_date: string;
  };
};

export type PaystackSubscription = {
  id: number;
  subscription_code: string;
  email_token: string;
  status: "active" | "non-renewing" | "attention" | "cancelled" | "completed";
  next_payment_date: string;
};

/**
 * Creates a Paystack transaction and returns the authorization URL to redirect
 * the user to for payment.
 *
 * @param callbackUrl - Where Paystack redirects after payment (our /api/paystack/callback).
 *                      Acts as a fallback if the webhook is never delivered.
 */
export async function initializeTransaction(
  email: string,
  planCode: string,
  metadata: Record<string, unknown> = {},
  callbackUrl?: string,
): Promise<PaystackTransactionInit> {
  return paystackFetch<PaystackTransactionInit>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email,
      plan: planCode,
      amount: 10000, //Just a dummy
      metadata,
      ...(callbackUrl && { callback_url: callbackUrl }),
    }),
  });
}

export async function verifyTransaction(
  reference: string,
): Promise<PaystackTransaction> {
  return paystackFetch<PaystackTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}

export async function cancelSubscription(
  subscriptionCode: string,
  emailToken: string,
): Promise<{ status: boolean }> {
  return paystackFetch("/subscription/disable", {
    method: "POST",
    body: JSON.stringify({
      code: subscriptionCode,
      token: emailToken,
    }),
  });
}

export async function fetchSubscription(
  subscriptionCode: string,
): Promise<PaystackSubscription> {
  return paystackFetch<PaystackSubscription>(
    `/subscription/${encodeURIComponent(subscriptionCode)}`,
  );
}
