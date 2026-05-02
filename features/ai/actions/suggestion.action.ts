"use server";

import { stepsToAIResume } from "@/features/editor/helpers/resume-helpers";
import { Step } from "@/features/editor/types/editor-resume.type";
import { AppError } from "@/lib/errors";
import { parseAIJSON } from "@/lib/utils";
import {
  AISuggestion,
  buildSuggestionPrompt,
} from "../prompts/suggestion.prompt";
import { getMultiProvider } from "../providers/factory";

export async function getAISuggestions(steps: Step[], jobDescription: string) {
  const provider = getMultiProvider();
  const prompt = buildSuggestionPrompt(
    jobDescription,
    stepsToAIResume(
      steps.filter(
        (s) =>
          s.enabled &&
          ["summary", "experience", "projects", "skills"].includes(s.id),
      ),
    ),
  );
  const response = await provider.generate(prompt, "suggestion");

  try {
    const parsed = parseAIJSON<AISuggestion[]>(response);
    return parsed;
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}
