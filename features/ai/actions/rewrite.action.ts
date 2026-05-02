"use server";

import { stepsToAIResume } from "@/features/editor/helpers/resume-helpers";
import { Step } from "@/features/editor/types/editor-resume.type";
import { AppError } from "@/lib/errors";
import { parseAIHTML, parseAIJSON } from "@/lib/utils";
import { AIResume } from "../prompts";
import {
  buildConvertToBulletsPrompt,
  buildRewriteResumePrompt,
  buildTailorToJobPrompt,
} from "../prompts/rewrite.prompt";
import { getMultiProvider } from "../providers/factory";

export async function rewriteResume(steps: Step[]) {
  const provider = getMultiProvider();
  const prompt = buildRewriteResumePrompt(
    stepsToAIResume(steps.filter((s) => s.enabled && s.id !== "header")),
  );
  const response = await provider.generate(prompt, "rewrite");

  try {
    const parsed = parseAIJSON<AIResume>(response);
    return merge(steps, parsed);
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}

export async function tailorResume(jobDescription: string, steps: Step[]) {
  const provider = getMultiProvider();
  const prompt = buildTailorToJobPrompt(
    jobDescription,
    stepsToAIResume(steps.filter((s) => s.enabled && s.id !== "header")),
  );
  const response = await provider.generate(prompt, "analyze");

  try {
    const parsed = parseAIJSON<AIResume>(response);
    return merge(steps, parsed);
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

function merge(steps: Step[], data: AIResume) {
  return steps.map((step) => ({
    ...step,
    data: data.find((s) => s.id === step.id)?.content ?? step.data,
  }));
}
