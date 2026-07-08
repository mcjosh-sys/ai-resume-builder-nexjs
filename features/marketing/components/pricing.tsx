"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

const FREE_FEATURES = [
  "2 resumes",
  "3 templates (Aurora, Ledger, Slate)",
  "Default colour theme",
  "PDF export — unlimited",
  "ATS score per resume",
  "AI Bullet Converter — unlimited",
  "AI Suggestions — 1 per month",
  "Photo upload & custom sections",
];

const PRO_FEATURES = [
  "Unlimited resumes",
  "All 13 templates",
  "All colour themes & border styles",
  "PDF export — unlimited",
  "ATS score per resume",
  "AI Rewrite — 10 per month",
  "AI Tailor to Job — 10 per month",
  "AI Bullet Converter — unlimited",
  "AI Suggestions — 20 per month",
  "Priority AI processing",
];

type Interval = "monthly" | "annual";

async function startCheckout(interval: Interval) {
  const res = await fetch("/api/paystack/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interval }),
  });
  const data = await res.json();
  if (data.authorizationUrl) {
    window.location.href = data.authorizationUrl;
  }
}

export function PricingSection({ id }: { id?: string }) {
  const [interval, setInterval] = useState<Interval>("annual");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    await startCheckout(interval).finally(() => setLoading(false));
  };

  const price = interval === "annual" ? 79 : 9;
  const perLabel = interval === "annual" ? "/year" : "/month";

  return (
    <section id={id} className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 mb-4">
            <Sparkles className="size-3" />
            Simple pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Start free. Upgrade when you need it.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Everything you need to build a standout resume. No hidden fees.
          </p>

          {/* Interval toggle */}
          <div className="mt-6 inline-flex items-center rounded-full border bg-muted/50 p-1">
            {(["monthly", "annual"] as Interval[]).map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInterval(i)}
                className={cn(
                  "rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition-all",
                  interval === i
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {i === "annual" ? (
                  <span className="flex items-center gap-1.5">
                    Annual
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      SAVE 27%
                    </span>
                  </span>
                ) : (
                  "Monthly"
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {/* Free card */}
          <PricingCard
            name="Free"
            description="For anyone getting started"
            price="$0"
            perLabel="forever"
            features={FREE_FEATURES}
            cta={
              <Button variant="outline" className="w-full" asChild>
                <a href="/sign-up">Get started free</a>
              </Button>
            }
          />

          {/* Pro card */}
          <PricingCard
            name="Pro"
            description="For serious job seekers"
            price={`$${price}`}
            perLabel={perLabel}
            features={PRO_FEATURES}
            highlighted
            cta={
              <Button
                id="pricing-upgrade-pro"
                className="w-full bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
                onClick={handleUpgrade}
                disabled={loading}
              >
                <Zap className="size-4" />
                {loading ? "Redirecting…" : "Upgrade to Pro"}
              </Button>
            }
          />

          {/* Team card — coming soon, hidden tier */}
          <PricingCard
            name="Team"
            description="For career coaches & recruiters"
            price="Coming soon"
            perLabel=""
            features={[
              "Everything in Pro",
              "3 seats included",
              "Team dashboard",
              "Seat management",
            ]}
            comingSoon
            cta={
              <Button variant="outline" className="w-full" disabled>
                Notify me
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  description,
  price,
  perLabel,
  features,
  highlighted = false,
  comingSoon = false,
  cta,
}: {
  name: string;
  description: string;
  price: string;
  perLabel: string;
  features: string[];
  highlighted?: boolean;
  comingSoon?: boolean;
  cta: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 flex flex-col gap-6 transition-shadow",
        highlighted
          ? "border-violet-300 bg-linear-to-b from-violet-50/60 to-blue-50/30 shadow-xl shadow-violet-100/50 dark:border-violet-700 dark:from-violet-950/30 dark:to-blue-950/20 dark:shadow-violet-950/30"
          : "bg-card shadow-sm",
        comingSoon && "opacity-70",
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-violet-600 to-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow">
            <Sparkles className="size-2.5" />
            Most popular
          </span>
        </div>
      )}
      {comingSoon && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-[11px] font-bold text-muted-foreground shadow-sm">
            Coming soon
          </span>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          {name}
        </p>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          {perLabel && (
            <span className="mb-1 text-sm text-muted-foreground">
              {perLabel}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <ul className="flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {cta}
    </div>
  );
}
