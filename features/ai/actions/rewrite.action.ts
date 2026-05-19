"use server";

import { AppError } from "@/lib/errors";
import { parseAIHTML, parseAIJSON } from "@/lib/utils";
import { AIResume } from "../prompts";
import {
  buildConvertToBulletsPrompt,
  buildRewriteResumePrompt,
  buildTailorToJobPrompt,
} from "../prompts/rewrite.prompt";
import { getMultiProvider } from "../providers/factory";

export async function rewriteResume(resume: AIResume) {
  const provider = getMultiProvider();
  const prompt = buildRewriteResumePrompt(resume);
  const response = await provider.generate(prompt, "rewrite");

  try {
    const parsed = parseAIJSON<AIResume>(response);
    return parsed;
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}

export async function tailorResume(jobDescription: string, resume: AIResume) {
  const provider = getMultiProvider();
  const prompt = buildTailorToJobPrompt(jobDescription, resume);
  const response = await provider.generate(prompt, "analyze");

  try {
    const parsed = parseAIJSON<AIResume>(response);
    return parsed;
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}

export async function convertToBullets(content: string) {
  const provider = getMultiProvider();
  const response = await provider.generate(
    buildConvertToBulletsPrompt({ content }),
    "rewrite",
  );

  try {
    return parseAIHTML(response);
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}
