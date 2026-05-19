"use client";

import {
  rewriteResume,
  tailorResume,
} from "@/features/ai/actions/rewrite.action";
import { getAISuggestions } from "@/features/ai/actions/suggestion.action";
import { AIResume } from "@/features/ai/prompts";
import { stepsToAIResume } from "@/features/editor/helpers/resume-helpers";
import { Step } from "@/features/editor/types/editor-resume.type";
import { AppError } from "@/lib/errors";
import { useAISuggestionStore } from "@/store/ai-suggestions.store";
import { useState } from "react";
import { useAlertErrors } from "./use-alert-error";

type Status = "idle" | "rewriting" | "suggesting" | "error";

function merge(steps: Step[], data: AIResume) {
  return steps.map((step) => ({
    ...step,
    data: data.find((s) => s.id === step.id)?.content ?? step.data,
  }));
}

export function useResumeAI({ steps }: { steps: Step[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<AppError | null>(null);
  const suggestionError = useAISuggestionStore((state) => state.error);
  const setSuggestions = useAISuggestionStore((state) => state.setSuggestions);
  const setIsSuggesting = useAISuggestionStore(
    (state) => state.setIsSuggesting,
  );
  const setSuggestionError = useAISuggestionStore((state) => state.setError);

  useAlertErrors([error, suggestionError]);

  const rewrite = async () => {
    setStatus("rewriting");
    setError(null);
    try {
      const response = await rewriteResume(
        stepsToAIResume(steps.filter((s) => s.enabled && s.id !== "header")),
      );
      return merge(steps, response);
    } catch (error) {
      const err =
        error instanceof AppError
          ? error
          : new AppError("Failed to rewrite resume");
      setError(err);
      setStatus("error");
      console.log(err);
    } finally {
      setStatus("idle");
    }
  };

  const tailor = async (jobDescription: string) => {
    setStatus("rewriting");
    setError(null);
    try {
      const response = await tailorResume(
        jobDescription,
        stepsToAIResume(steps.filter((s) => s.enabled && s.id !== "header")),
      );
      return merge(steps, response);
    } catch (error) {
      const err =
        error instanceof AppError
          ? error
          : new AppError("Failed to tailor resume");
      setError(err);
      setStatus("error");
      console.log(err);
    } finally {
      setStatus("idle");
    }
  };

  const getSuggestions = async (jobDescription: string) => {
    setIsSuggesting(true);
    setSuggestionError(null);
    try {
      const response = await getAISuggestions(
        stepsToAIResume(
          steps.filter(
            (s) =>
              s.enabled &&
              ["summary", "experience", "projects", "skills"].includes(s.id),
          ),
        ),
        jobDescription,
      );
      setSuggestions(response);
      if (!response?.length) {
        setSuggestionError(
          new AppError("No suggestions found", null, { severity: "info" }),
        );
      }
      return response;
    } catch (error) {
      const err =
        error instanceof AppError
          ? error
          : new AppError("Failed to get suggestions");
      setSuggestionError(err);
      setStatus("error");
      console.log(err);
    } finally {
      setIsSuggesting(false);
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
