"use server";

import { AppError } from "@/lib/errors";
import { AIFeature } from "@/lib/generated/prisma";
import { parseAIJSON } from "@/lib/utils";
import { checkAIUsage, incrementAIUsage } from "@/lib/subscription";
import { getUserId } from "@/server/action";
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
  const userId = await getUserId();
  await checkAIUsage(userId, AIFeature.SUGGESTIONS);

  const provider = getMultiProvider();
  const prompt = buildSuggestionPrompt(jobDescription, resume);
  const response = await provider.generate(prompt, "suggestion");

  try {
    const parsed = parseAIJSON<AISuggestion[]>(response);
    await incrementAIUsage(userId, AIFeature.SUGGESTIONS);
    return parsed;
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}
