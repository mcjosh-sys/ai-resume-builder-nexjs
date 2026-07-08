"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UpgradePromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Human-readable feature name, e.g. "AI Rewrite" */
  feature?: string;
  /** Optional usage context, e.g. { used: 10, limit: 10 } */
  usage?: { used: number; limit: number };
};

export function UpgradePrompt({
  open,
  onOpenChange,
  feature,
  usage,
}: UpgradePromptProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (interval: "monthly" | "annual") => {
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      console.error("[UpgradePrompt]", err);
    } finally {
      setLoading(false);
    }
  };

  const isQuotaExhausted =
    usage && usage.used >= usage.limit && usage.limit > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-blue-500 text-white shadow-lg">
            <Zap className="size-7" />
          </div>
          <DialogTitle className="text-center text-xl">
            {isQuotaExhausted
              ? `${feature ?? "Feature"} limit reached`
              : `Upgrade to unlock ${feature ?? "this feature"}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isQuotaExhausted ? (
              <>
                You&apos;ve used{" "}
                <span className="font-semibold text-foreground">
                  {usage.used}/{usage.limit}
                </span>{" "}
                {feature} credits this month. Upgrade to Pro for 10× more.
              </>
            ) : (
              <>
                {feature ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {feature}
                    </span>{" "}
                    is a Pro feature.{" "}
                  </>
                ) : null}
                Get unlimited access to all AI tools, 13 templates, and
                unlimited resumes.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Feature highlights */}
        <ul className="space-y-2 rounded-xl border bg-muted/40 p-4 text-sm">
          {[
            "All 13 premium templates",
            "10 AI Rewrites & Tailors per month",
            "20 AI Suggestions per month",
            "Unlimited resumes",
            "All colour themes & border styles",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Sparkles className="size-3.5 shrink-0 text-violet-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            id="upgrade-pro-annual"
            className="w-full bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
            onClick={() => handleUpgrade("annual")}
            disabled={loading}
          >
            <Zap className="size-4" />
            Upgrade to Pro — $79/year{" "}
            <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
              SAVE 27%
            </span>
          </Button>
          <Button
            id="upgrade-pro-monthly"
            variant="outline"
            className="w-full"
            onClick={() => handleUpgrade("monthly")}
            disabled={loading}
          >
            $9/month — billed monthly
          </Button>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
