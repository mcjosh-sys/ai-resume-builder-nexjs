import { AIFeature, Plan } from "@/lib/generated/prisma";

export const FREE_TEMPLATES = ["aurora", "ledger", "slate"] as const;

export const FREE_COLOR = "default";
export const FREE_BORDER_STYLE = "SQUIRCLE";

export const RESUME_LIMITS: Record<Plan, number> = {
  FREE: 2,
  PRO: Infinity,
  TEAM: Infinity,
};

export const AI_LIMITS: Record<Plan, Record<AIFeature, number>> = {
  FREE: {
    REWRITE: 0,
    TAILOR: 0,
    SUGGESTIONS: 1,
  },
  PRO: {
    REWRITE: 10,
    TAILOR: 10,
    SUGGESTIONS: 20,
  },
  TEAM: {
    REWRITE: 10,
    TAILOR: 10,
    SUGGESTIONS: 20,
  },
};

export const AI_FEATURE_LABELS: Record<AIFeature, string> = {
  REWRITE: "AI Rewrite",
  TAILOR: "AI Tailor to Job",
  SUGGESTIONS: "AI Suggestions",
};
