import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateResumeCard } from "@/features/resume/components/create-resume-card";
import { currentUser } from "@clerk/nextjs/server";
import { FaArrowRight, FaWandMagic } from "react-icons/fa6";

export default async function DashboardPage() {
  const user = (await currentUser())!;
  const isFirstSignIn =
    !user.lastSignInAt || user.createdAt === user.lastSignInAt;
  return (
    <PageWrapper>
      <header>
        <h1 className="text-xl font-bold">
          Welcome{isFirstSignIn ? "," : " back,"} {user.firstName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here’s what CV Copilot has prepared for your job search today.
        </p>
      </header>
      <main>
        <div className="grid gap-5 sm:grid-cols-2 cursor-pointer">
          <CreateResumeCard />
          <Card className="group hover:border-violet-200 dark:hover:shadow-accent hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="rounded-md bg-violet-100 p-3 text-violet-600 transition-all duration-200 group-hover:scale-110">
                  <FaWandMagic className="size-6 " />
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
      </main>
    </PageWrapper>
  );
}
