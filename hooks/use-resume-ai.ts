"use client";

import { rewriteResume } from "@/features/ai/actions/rewrite.action";
import { stepsToTemplateResume } from "@/features/editor/helpers/resume-helpers";
import { Step } from "@/features/editor/types/editor-resume.type";
import { AppError } from "@/lib/errors";
import { useState } from "react";
import { toast } from "sonner";

type Status = "idle" | "rewriting" | "error";

export function useResumeAI({
  steps,
  template,
  colorHex,
}: {
  steps: Step[];
  template?: string | null;
  colorHex?: string | null;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<AppError | null>(null);

  const rewrite = async () => {
    const resume = stepsToTemplateResume(steps);
    setStatus("rewriting");
    setError(null);
    try {
      const response = await rewriteResume(steps);
      console.log(response);
      return response;
    } catch (error) {
      const err =
        error instanceof AppError
          ? error
          : new AppError("Failed to rewrite resume");
      setError(err);
      setStatus("error");
      console.log(err);
      toast.error("Failed to rewrite resume");
    } finally {
      setStatus("idle");
    }
  };

  return {
    status,
    error,
    rewrite,
  };
}
