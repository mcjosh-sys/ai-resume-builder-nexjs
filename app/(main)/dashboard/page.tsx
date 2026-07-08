import { PageWrapper } from "@/components/page-wrapper";
import { PaymentToast } from "@/components/payment-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserResumes } from "@/features/resume/actions/resume.actions";
import { CreateResumeCard } from "@/features/resume/components/create-resume-card";
import { ResumesList } from "@/features/resume/components/resumes-list";
import { currentUser } from "@clerk/nextjs/server";
import { FileText, Layers } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { FaArrowRight, FaWandMagic } from "react-icons/fa6";

export default async function DashboardPage() {
  const user = (await currentUser())!;
  const isFirstSignIn =
    !user.lastSignInAt || user.createdAt === user.lastSignInAt;

  const recentResumes = await getUserResumes(4);

  return (
    <PageWrapper>
      <Suspense fallback={null}>
        <PaymentToast />
      </Suspense>

      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {isFirstSignIn ? "Welcome," : "Welcome back,"} {user.firstName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what CV Copilot has prepared for your job search today.
        </p>
      </header>

      {/* ── Quick-action cards ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <CreateResumeCard />
          <Card className="group cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all duration-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="rounded-xl bg-violet-100 dark:bg-violet-900/40 p-3 text-violet-600 dark:text-violet-400 transition-transform duration-200 group-hover:scale-110">
                  <FaWandMagic className="size-5" />
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground cursor-pointer group-hover:text-violet-600 transition-colors"
                  asChild
                >
                  <span aria-hidden="true">
                    <FaArrowRight className="size-3.5" />
                  </span>
                </Button>
              </div>
              <CardTitle className="mt-4 text-lg">Improve Existing</CardTitle>
              <CardDescription>
                Upload your current CV for AI-powered analysis and improvement.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* ── Recent Resumes ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recent Resumes
            </h2>
          </div>
          {recentResumes.length > 0 && (
            <Link
              href="/resumes"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-colors"
            >
              View all <FaArrowRight className="size-2.5" />
            </Link>
          )}
        </div>
        <ResumesList resumes={recentResumes} showCreateButton view="list" />
      </section>
    </PageWrapper>
  );
}
