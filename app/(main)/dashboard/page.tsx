import { PageWrapper } from "@/components/page-wrapper";
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
import { FileText } from "lucide-react";
import Link from "next/link";
import { FaArrowRight, FaWandMagic } from "react-icons/fa6";

export default async function DashboardPage() {
  const user = (await currentUser())!;
  const isFirstSignIn =
    !user.lastSignInAt || user.createdAt === user.lastSignInAt;

  const recentResumes = await getUserResumes(4);
  const totalCount = recentResumes.length; // will be overridden below if list > 4

  return (
    <PageWrapper>
      {/* Header */}
      <header>
        <h1 className="text-xl font-bold">
          Welcome{isFirstSignIn ? "," : " back,"} {user.firstName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what CV Copilot has prepared for your job search today.
        </p>
      </header>

      {/* Quick-action cards */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 cursor-pointer">
          <CreateResumeCard />
          <Card className="group hover:border-violet-200 dark:hover:shadow-accent hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="rounded-md bg-violet-100 p-3 text-violet-600 transition-all duration-200 group-hover:scale-110">
                  <FaWandMagic className="size-6" />
                </div>
                <Button
                  variant="link"
                  size="icon-sm"
                  className="text-muted-foreground cursor-pointer group-hover:text-violet-600"
                >
                  <FaArrowRight />
                </Button>
              </div>
              <CardTitle className="text-xl mt-4">Improve Existing</CardTitle>
              <CardDescription>
                Upload your current CV for AI analysis.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Recent Resumes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Resumes
            </h2>
          </div>
          {recentResumes.length > 0 && (
            <Link
              href="/resumes"
              className="text-xs text-primary hover:underline flex items-center gap-1"
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
