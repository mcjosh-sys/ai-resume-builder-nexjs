"use client";
import { getCurrentPlan } from "@/features/ai/actions/usage.action";
import { UserButton } from "@clerk/nextjs";
import { CreditCard, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

function PlanBadge() {
  const [plan, setPlan] = useState<"FREE" | "PRO" | "TEAM" | null>(null);

  useEffect(() => {
    getCurrentPlan().then((p) => setPlan(p as "FREE" | "PRO" | "TEAM"));
  }, []);

  if (!plan) return null;

  if (plan === "FREE") {
    return (
      <Link
        href="/#pricing"
        className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400 dark:hover:bg-violet-950/60"
      >
        <Sparkles className="size-3" />
        Upgrade to Pro
      </Link>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
      <Zap className="size-3" />
      {plan === "TEAM" ? "Team" : "Pro"}
    </span>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const isEditorRoute = pathname.startsWith("/editor");
  if (isEditorRoute) return null;
  return (
    <nav className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 sm:px-6 py-3 shadow-sm dark:shadow-slate-900">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            alt="logo"
            src="/images/logo.png"
            height="40"
            width="40"
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <p className="font-bold text-lg sm:text-xl">CVCopilot</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <PlanBadge />
          <ThemeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 35, height: 35 },
                userButtonBox:
                  "border-blue-500 hover:bg-blue-600/10 border-2 rounded-full",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard size={16} />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </nav>
  );
}
