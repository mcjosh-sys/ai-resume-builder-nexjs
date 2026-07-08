"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Reads the ?payment= query param set by the Paystack callback route
 * and shows the appropriate toast notification.
 * Rendered inside the dashboard page (client island).
 */
export function PaymentToast() {
  const params = useSearchParams();
  const payment = params.get("payment");
  const reason = params.get("reason");

  useEffect(() => {
    if (!payment) return;

    if (payment === "success") {
      toast.success("🎉 You're now on Pro!", {
        description: "Your subscription is active. Enjoy unlimited access.",
        duration: 6000,
        position: "top-center",
      });
    } else if (payment === "failed") {
      const msg =
        reason === "no_reference"
          ? "Something went wrong with the payment redirect. Contact support if you were charged."
          : "Your payment was not completed. No charge was made.";
      toast.error("Payment not completed", {
        description: msg,
        duration: 8000,
        position: "top-center",
      });
    }

    // Remove params from URL without a re-render
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    url.searchParams.delete("reason");
    window.history.replaceState({}, "", url.toString());
  }, [payment, reason]);

  return null;
}
