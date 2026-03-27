"use server";

import { TemplateResume } from "@/features/editor/components/resume-template-renderer";
import { Step } from "@/features/editor/types/editor-resume.type";
import { AppError } from "@/lib/errors";
import { sanitizeAndParseJson } from "@/lib/utils";
import { buildRewriteResumePrompt } from "../prompts/rewrite.prompt";
import { getMultiProvider } from "../providers/factory";

export async function rewriteResume(steps: Step[]) {
  const provider = getMultiProvider();
  const prompt = buildRewriteResumePrompt(getFieldsToRewriteFromSteps(steps));
  const response = await provider.generate(prompt, "rewrite");

  try {
    const parsed = sanitizeAndParseJson<Record<string, any>>(response);
    return merge(steps, parsed);
  } catch (error) {
    throw new AppError("Failed to parse AI response", {
      code: "AI_RESPONSE_PARSE_ERROR",
      cause: error,
    });
  }
}

function getFieldsToRewrite(resume: TemplateResume) {
  const fields: (keyof TemplateResume)[] = [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "awards",
    "otherFields",
  ];

  const fieldsToRewrite = Object.entries(resume).filter(([key]) =>
    fields.includes(key as keyof TemplateResume),
  );

  return Object.fromEntries(fieldsToRewrite);
}

function getFieldsToRewriteFromSteps(steps: Step[]) {
  const _steps = steps.filter((s) => s.enabled && s.id !== "header");

  return _steps.reduce(
    (acc, step) => {
      acc[step.id] = {
        sectionTitle: step.title,
        sectionData: step.data,
      };
      return acc;
    },
    {} as Record<string, any>,
  );
}

function merge(steps: Step[], data: Record<string, any>) {
  return steps.map((step) => ({
    ...step,
    data: data[step.id]?.sectionData ?? step.data,
  }));
}
