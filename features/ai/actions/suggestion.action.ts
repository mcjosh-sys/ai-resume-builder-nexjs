"use server";

import { stepsToAIResume } from "@/features/editor/helpers/resume-helpers";
import { Step } from "@/features/editor/types/editor-resume.type";
import { AppError } from "@/lib/errors";
import { sanitizeAndParseJson } from "@/lib/utils";
import { AIResume } from "../prompts";
import { buildSuggestionPrompt } from "../prompts/suggestion.prompt";
import { getMultiProvider } from "../providers/factory";

export async function getAISuggestions(steps: Step[], jobDescription: string) {
  const provider = getMultiProvider();
  const prompt = buildSuggestionPrompt(
    jobDescription,
    stepsToAIResume(steps.filter((s) => s.enabled)),
  );
  const response = await provider.generate(prompt, "suggestion");

  try {
    const parsed = sanitizeAndParseJson<AIResume>(response);
    return parsed;
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}
