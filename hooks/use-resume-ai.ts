"use client";

import {
  rewriteResume,
  tailorResume,
} from "@/features/ai/actions/rewrite.action";
import { getAISuggestions } from "@/features/ai/actions/suggestion.action";
import { Step } from "@/features/editor/types/editor-resume.type";
import { AppError } from "@/lib/errors";
import { useState } from "react";
import { toast } from "sonner";

type Status = "idle" | "rewriting" | "suggesting" | "error";

export function useResumeAI({ steps }: { steps: Step[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<AppError | null>(null);

  const rewrite = async () => {
    setStatus("rewriting");
    setError(null);
    try {
      const response = await rewriteResume(steps);
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

  const tailor = async (jobDescription: string) => {
    setStatus("rewriting");
    setError(null);
    try {
      const response = await tailorResume(jobDescription, steps);
      return response;
    } catch (error) {
      const err =
        error instanceof AppError
          ? error
          : new AppError("Failed to tailor resume");
      setError(err);
      setStatus("error");
      console.log(err);
      toast.error("Failed to tailor resume");
    } finally {
      setStatus("idle");
    }
  };

  const getSuggestions = async (jobDescription: string) => {
    setStatus("suggesting");
    setError(null);
    try {
      const response = await getAISuggestions(steps, jobDescription);
      return response;
    } catch (error) {
      const err =
        error instanceof AppError
          ? error
          : new AppError("Failed to get suggestions");
      setError(err);
      setStatus("error");
      console.log(err);
      toast.error("Failed to get suggestions");
    } finally {
      setStatus("idle");
    }
  };

  return {
    status,
    error,
    rewrite,
    tailor,
    getSuggestions,
  };
}
