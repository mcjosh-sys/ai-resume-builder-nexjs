import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getBillingData } from "./actions";
import { CancelSubscriptionButton } from "./cancel-button";

export const metadata = {
  title: "Billing — CVCopilot",
  description: "Manage your CVCopilot subscription and usage.",
};

function fmt(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BillingPage() {
  const { plan, resumeCount, resumeLimit, subscription, usage } =
    await getBillingData();

  const isPro = plan === "PRO" || plan === "TEAM";

  return (
    <PageWrapper>
      {/* ── Page header ── */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and view your usage.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─────────────────────────── Left column (2/3) ─────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Current plan card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Current plan
                </CardTitle>
                <Badge
                  variant={isPro ? "default" : "secondary"}
                  className={
                    isPro
                      ? "bg-linear-to-r from-violet-600 to-blue-600 text-white border-0"
                      : ""
                  }
                >
                  {isPro ? (
                    <>
                      <Zap className="mr-1 size-3" />
                      {plan === "TEAM" ? "Team" : "Pro"}
                    </>
                  ) : (
                    "Free"
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPro && subscription ? (
                <>
                  <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CalendarDays className="size-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 flex justify-between">
                        <span className="text-muted-foreground">
                          {subscription.cancelAtPeriodEnd
                            ? "Access until"
                            : "Next renewal"}
                        </span>
                        <span className="font-medium">
                          {fmt(subscription.currentPeriodEnd)}
                        </span>
                      </div>
                    </div>

                    {subscription.paystackPlanCode && (
                      <div className="flex items-center gap-3 text-sm">
                        <CreditCard className="size-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 flex justify-between">
                          <span className="text-muted-foreground">
                            Plan code
                          </span>
                          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                            {subscription.paystackPlanCode}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>

                  {subscription.cancelAtPeriodEnd ? (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                      <CalendarDays className="size-4 shrink-0" />
                      Your subscription is cancelled and will not renew. You
                      keep Pro access until{" "}
                      <strong>{fmt(subscription.currentPeriodEnd)}</strong>.
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Subscription renews automatically. Cancel anytime.
                      </p>
                      <CancelSubscriptionButton />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You&apos;re on the <strong>Free</strong> plan. Upgrade to
                    Pro to unlock unlimited resumes, all 13 templates, and 10×
                    more AI credits per month.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      asChild
                      className="bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
                    >
                      <Link href="/#pricing">
                        <Zap className="size-4" />
                        Upgrade to Pro
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI usage this month */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                AI usage this month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {usage.map((item) => {
                const pct = item.hardBlocked
                  ? 0
                  : item.limit === 0
                    ? 0
                    : Math.min(100, Math.round((item.used / item.limit) * 100));

                const isExhausted =
                  !item.hardBlocked && item.used >= item.limit;

                return (
                  <div key={item.feature} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      {item.hardBlocked ? (
                        <span className="text-xs text-muted-foreground">
                          Not included in Free plan
                        </span>
                      ) : (
                        <span
                          className={
                            isExhausted
                              ? "font-semibold text-destructive"
                              : "text-muted-foreground"
                          }
                        >
                          {item.used} / {item.limit}
                        </span>
                      )}
                    </div>
                    {!item.hardBlocked && (
                      <Progress
                        value={pct}
                        className={`h-2 ${isExhausted ? "[&>div]:bg-destructive" : "[&>div]:bg-violet-500"}`}
                      />
                    )}
                  </div>
                );
              })}

              <p className="text-xs text-muted-foreground pt-1">
                Usage resets on the 1st of each calendar month.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ─────────────────────────── Right column (1/3) ────────────────────── */}
        <div className="space-y-6">
          {/* Resume usage */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="size-4" />
                Resumes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{resumeCount}</span>
                <span className="text-sm text-muted-foreground mb-1">
                  {resumeLimit === Infinity ? "unlimited" : `/ ${resumeLimit}`}
                </span>
              </div>
              {resumeLimit !== Infinity && (
                <Progress
                  value={Math.min(100, (resumeCount / resumeLimit) * 100)}
                  className="h-2 [&>div]:bg-violet-500"
                />
              )}
              <p className="text-xs text-muted-foreground">
                {isPro
                  ? "Unlimited resumes on Pro."
                  : `Free plan includes ${resumeLimit} resumes.`}
              </p>
            </CardContent>
          </Card>

          {/* What's included */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="size-4" />
                {isPro ? "Pro includes" : "Free includes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(isPro
                  ? [
                      "Unlimited resumes",
                      "All 13 premium templates",
                      "All colour themes & borders",
                      "AI Rewrite — 10/month",
                      "AI Tailor to Job — 10/month",
                      "AI Suggestions — 20/month",
                      "AI Bullet Converter — unlimited",
                      "Priority AI processing",
                    ]
                  : [
                      "2 resumes",
                      "3 templates",
                      "Default colour theme",
                      "AI Suggestions — 1/month",
                      "AI Bullet Converter — unlimited",
                      "PDF export — unlimited",
                    ]
                ).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-muted/30">
            <CardContent className="pt-5 pb-4 space-y-2">
              <p className="text-sm font-semibold">Need help?</p>
              <p className="text-xs text-muted-foreground">
                If you were charged but your plan hasn&apos;t updated, contact
                us and we&apos;ll fix it immediately.
              </p>
              <a
                href="mailto:support@cvcopilot.app"
                className="text-xs font-medium text-primary hover:underline"
              >
                support@cvcopilot.app
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
