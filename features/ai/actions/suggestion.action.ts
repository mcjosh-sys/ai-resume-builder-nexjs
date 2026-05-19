"use server";

import { AppError } from "@/lib/errors";
import { parseAIJSON } from "@/lib/utils";
import { AIResume } from "../prompts";
import {
  AISuggestion,
  buildSuggestionPrompt,
} from "../prompts/suggestion.prompt";
import { getMultiProvider } from "../providers/factory";

export async function getAISuggestions(
  resume: AIResume,
  jobDescription: string,
) {
  const provider = getMultiProvider();
  const prompt = buildSuggestionPrompt(jobDescription, resume);
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
