"use client";
import { UpgradePrompt } from "@/components/upgrade-prompt";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentPlan } from "@/features/ai/actions/usage.action";
import { getUserResumes } from "@/features/resume/actions/resume.actions";
import { useModal } from "@/hooks/use-modal";
import { RESUME_LIMITS } from "@/lib/plans";
import { Lock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FaArrowRight, FaFileCirclePlus } from "react-icons/fa6";
import { CreateResumeModal } from "./modals/create-resume-modal";

export const CreateResumeCard: React.FC<{ asButton?: boolean }> = ({
  asButton = false,
}) => {
  const modal = useModal();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [resumeCount, setResumeCount] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(Infinity);

  useEffect(() => {
    Promise.all([
      getUserResumes(),
      getCurrentPlan(),
    ]).then(([resumes, plan]) => {
      setResumeCount(resumes.length);
      setLimit(RESUME_LIMITS[plan as keyof typeof RESUME_LIMITS] ?? 2);
    });
  }, []);

  const isAtLimit =
    resumeCount !== null && limit !== Infinity && resumeCount >= limit;

  const handleClick = () => {
    if (isAtLimit) {
      setUpgradeOpen(true);
      return;
    }
    modal.open();
  };

  return (
    <>
      <UpgradePrompt
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        feature="unlimited resumes"
        usage={
          resumeCount !== null && limit !== Infinity
            ? { used: resumeCount, limit }
            : undefined
        }
      />

      {asButton ? (
        <Button onClick={handleClick} size="sm" className="gap-2">
          {isAtLimit ? (
            <Lock className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          Create Resume
        </Button>
      ) : (
        <Card
          className="group dark:hover:shadow-accent hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={handleClick}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div
                className={`rounded-md p-3 transition-all duration-200 group-hover:scale-110 ${
                  isAtLimit
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isAtLimit ? (
                  <Lock className="size-6" />
                ) : (
                  <FaFileCirclePlus className="size-6" />
                )}
              </div>
              <Button
                variant="link"
                size="icon-sm"
                className="text-muted-foreground cursor-pointer group-hover:text-primary"
              >
                <FaArrowRight />
              </Button>
            </div>
            <CardTitle className="text-xl mt-4">Create New Resume</CardTitle>
            <CardDescription>
              {isAtLimit
                ? `You've reached your ${limit}-resume limit. Upgrade to Pro for unlimited resumes.`
                : "Design a polished, professional resume using our easy-to-use builder."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <CreateResumeModal modal={modal} />
    </>
  );
};
