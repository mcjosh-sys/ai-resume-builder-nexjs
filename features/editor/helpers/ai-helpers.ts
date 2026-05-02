import { convertToBullets } from "@/features/ai/actions/rewrite.action";
import { AISuggestion } from "@/features/ai/prompts";
import { SkillCategory, SkillLevel } from "@/lib/generated/prisma";
import { normalizeString } from "@/lib/utils";
import { ExtractStepData } from "@/types";
import { Step } from "../types/editor-resume.type";
import { entriesToHTML, extractListItems, isBullet } from "./bullet-helpers";

export async function applySuggestion(suggestion: AISuggestion, steps: Step[]) {
  let isUpdated = false;
  const updatedSteps = await Promise.all(
    steps.map(async (s) => {
      if (s.id === suggestion.sectionId) {
        switch (s.id) {
          case "summary":
            s.data;
            switch (suggestion.type) {
              case "replace":
                isUpdated = true;
                return { ...s, data: { summary: suggestion.suggested } };
            }
            break;
          case "experience":
            return {
              ...s,
              data: {
                workExperiences: s.data?.workExperiences
                  ? ((await Promise.all(
                      s.data.workExperiences.map(async (e) => {
                        if (e.id === suggestion.itemId && e.description) {
                          const updated = await applyBulletSuggestion(
                            suggestion,
                            e,
                          );
                          if (!updated) return e;
                          isUpdated = true;
                          return updated;
                        }
                        return e;
                      }),
                    )) as typeof s.data.workExperiences)
                  : undefined,
              },
            };
          case "projects":
            return {
              ...s,
              data: {
                projects: s.data?.projects
                  ? ((await Promise.all(
                      s.data.projects.map(async (p) => {
                        if (p.id === suggestion.itemId && p.description) {
                          const updated = await applyBulletSuggestion(
                            suggestion,
                            p,
                          );
                          if (!updated) return p;
                          isUpdated = true;
                          return updated;
                        }
                        return p;
                      }),
                    )) as typeof s.data.projects)
                  : undefined,
              },
            };
          case "skills":
            const updated = applySkillSuggestion(
              suggestion,
              s.data?.skills ?? [],
            );
            if (!updated) return s;
            isUpdated = true;
            return {
              ...s,
              data: {
                skills: updated,
              },
            };
        }
      }
      return s;
    }),
  );
  return { isUpdated, steps: updatedSteps as Step[] };
}

function applySkillSuggestion(
  suggestion: AISuggestion<{
    category: SkillCategory;
    level: SkillLevel;
    name: string;
  }>,
  skills: NonNullable<ExtractStepData<"skills">>["skills"],
) {
  const skill = suggestion.suggested;
  const validIndex = getValidIndex(suggestion.subIndex, skills.length);
  switch (suggestion.type) {
    case "insert":
      skills.splice(validIndex, 0, { ...skill, order: validIndex });
      break;
    case "replace":
      if (validIndex >= skills.length) return null;
      skills[validIndex] = { ...skill, order: validIndex };
      break;
    case "delete":
      if (validIndex >= skills.length) return null;
      skills.splice(validIndex, 1);
      break;
  }
  return skills;
}

async function applyBulletSuggestion<T extends { description?: string | null }>(
  suggestion: AISuggestion,
  item: T,
): Promise<T | null> {
  switch (suggestion.type) {
    case "replace":
      return applyBulletReplaceSuggestion(suggestion, item);
    case "insert":
      return applyBulletInsertSuggestion(suggestion, item);
    case "delete":
      return applyBulletDeleteSuggestion(suggestion, item);
    default:
      return null;
  }
}

async function extractEntries(item: { description?: string | null }) {
  if (!item.description) return [];
  const entries = extractListItems(
    isBullet(item.description)
      ? item.description
      : await convertToBullets(item.description),
  );
  return entries;
}

async function applyBulletReplaceSuggestion<
  T extends { description?: string | null },
>(suggestion: AISuggestion, item: T): Promise<T | null> {
  if (typeof suggestion.subIndex !== "number" || suggestion.subIndex < 0)
    return null;
  const entries = await extractEntries(item);
  if (!entries.length || suggestion.subIndex >= entries.length) return null;
  const validIndex = getValidIndex(suggestion.subIndex, entries.length);
  const entry = entries?.[validIndex];
  if (entry && isCloseMatch(entry, suggestion.original)) {
    entries[validIndex] = suggestion.suggested;
  } else {
    const index = findBestMatchIndex(entries, suggestion.original);
    if (index < 0) return null;
    entries[index] = suggestion.suggested;
  }
  return {
    ...item,
    description: entriesToHTML(entries),
  };
}

async function applyBulletInsertSuggestion<
  T extends { description?: string | null },
>(suggestion: AISuggestion, item: T): Promise<T | null> {
  if (typeof suggestion.subIndex !== "number") return null;
  const entries = await extractEntries(item);
  if (!entries.length) return null;
  const validIndex = getValidIndex(suggestion.subIndex, entries.length);
  entries.splice(validIndex, 0, suggestion.suggested);
  return {
    ...item,
    description: entriesToHTML(entries),
  };
}

async function applyBulletDeleteSuggestion<
  T extends { description?: string | null },
>(suggestion: AISuggestion, item: T): Promise<T | null> {
  if (typeof suggestion.subIndex !== "number" || suggestion.subIndex < 0)
    return null;
  const entries = await extractEntries(item);
  if (!entries.length) return null;
  if (suggestion.subIndex >= entries.length) return null;
  entries.splice(suggestion.subIndex, 1);
  return {
    ...item,
    description: entriesToHTML(entries),
  };
}

function similarity(a: string, b: string): number {
  const na = normalizeString(a);
  const nb = normalizeString(b);

  if (!na || !nb) return 0;

  if (na === nb) return 1;

  const aWords = new Set(na.split(" "));
  const bWords = new Set(nb.split(" "));

  let match = 0;

  for (const word of aWords) {
    if (bWords.has(word)) match++;
  }

  return match / Math.max(aWords.size, bWords.size);
}

function findBestMatchIndex(entries: string[], target: string): number {
  let bestIndex = -1;
  let bestScore = 0;

  for (let i = 0; i < entries.length; i++) {
    const score = similarity(entries[i], target);

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestScore > 0.5 ? bestIndex : -1;
}

function isCloseMatch(a: string, b: string) {
  return (
    normalizeString(a).includes(normalizeString(b)) ||
    normalizeString(b).includes(normalizeString(a))
  );
}

function getValidIndex(index: any, length: number) {
  if (typeof index !== "number") return length;
  return Math.max(0, Math.min(index, length));
}
