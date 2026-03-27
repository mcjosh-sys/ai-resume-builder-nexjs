import { PageWrapper } from "@/components/page-wrapper";
import { getUserResumes } from "@/features/resume/actions/resume.actions";
import { CreateResumeCard } from "@/features/resume/components/create-resume-card";
import { ResumesList } from "@/features/resume/components/resumes-list";
import { currentUser } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function ResumesListPage() {
  const user = (await currentUser())!;
  const resumes = await getUserResumes();

  return (
    <PageWrapper>
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/resumes"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="size-3" />
              Dashboard
            </Link>
          </div>
          <h1 className="text-xl font-bold">My Resumes</h1>
          <p className="text-sm text-muted-foreground">
            {resumes.length === 0
              ? "You haven't created any resumes yet."
              : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Create button — rendered as a small inline call-to-action */}
        {resumes.length > 0 && (
          <div className="shrink-0">
            <CreateResumeCard asButton />
          </div>
        )}
      </header>

      {/* Resume grid */}
      <ResumesList resumes={resumes} showCreateButton />
    </PageWrapper>
  );
}
