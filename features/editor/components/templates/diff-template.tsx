"use client";

import { AISuggestion } from "@/features/ai/prompts/suggestion.prompt";
import { Step } from "@/features/editor/types/editor-resume.type";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Word-level LCS diff
// ---------------------------------------------------------------------------

type DiffToken = { text: string; type: "same" | "removed" | "added" };

function computeWordDiff(original: string, revised: string): DiffToken[] {
  // Tokenise preserving whitespace so we can reconstruct the string
  const origTokens = original.split(/(\s+)/);
  const revTokens = revised.split(/(\s+)/);

  const m = origTokens.length;
  const n = revTokens.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        origTokens[i - 1] === revTokens[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack
  const result: DiffToken[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origTokens[i - 1] === revTokens[j - 1]) {
      result.unshift({ text: origTokens[i - 1], type: "same" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ text: revTokens[j - 1], type: "added" });
      j--;
    } else {
      result.unshift({ text: origTokens[i - 1], type: "removed" });
      i--;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Strip HTML tags from rich-text fields
// ---------------------------------------------------------------------------

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Extract a flat, human-readable text string from any Step
// ---------------------------------------------------------------------------

function extractStepText(step: Step): string {
  const data = step.data as Record<string, unknown> | undefined;
  if (!data) return "";

  const lines: string[] = [];

  switch (step.id) {
    case "summary": {
      const s = stripHtml(data.summary as string | undefined);
      if (s) lines.push(s);
      break;
    }
    case "experience": {
      const exps = (data.workExperiences as Record<string, unknown>[]) ?? [];
      exps.forEach((exp) => {
        const header = [exp.position, exp.company].filter(Boolean).join(" at ");
        if (header) lines.push(header);
        const desc = stripHtml(exp.description as string | undefined);
        if (desc) lines.push(desc);
      });
      break;
    }
    case "education": {
      const edus = (data.educations as Record<string, unknown>[]) ?? [];
      edus.forEach((edu) => {
        const header = [edu.degree, edu.school].filter(Boolean).join(" — ");
        if (header) lines.push(header);
        const desc = stripHtml(edu.description as string | undefined);
        if (desc) lines.push(desc);
      });
      break;
    }
    case "skills": {
      const skills = (data.skills as Record<string, unknown>[]) ?? [];
      const names = skills.map((s) => s.name as string).filter(Boolean);
      if (names.length) lines.push(names.join(", "));
      break;
    }
    case "projects": {
      const projects = (data.projects as Record<string, unknown>[]) ?? [];
      projects.forEach((p) => {
        if (p.title) lines.push(p.title as string);
        const desc = stripHtml(p.description as string | undefined);
        if (desc) lines.push(desc);
      });
      break;
    }
    case "certifications": {
      const certs = (data.certifications as Record<string, unknown>[]) ?? [];
      certs.forEach((c) => {
        const label = [c.name, c.issuer].filter(Boolean).join(" — ");
        if (label) lines.push(label);
      });
      break;
    }
    case "awards": {
      const awards = (data.awards as Record<string, unknown>[]) ?? [];
      awards.forEach((a) => {
        if (a.title) lines.push(a.title as string);
        const desc = stripHtml(a.description as string | undefined);
        if (desc) lines.push(desc);
      });
      break;
    }
    default: {
      // other-field-* sections
      const title = data.title as string | undefined;
      const desc = stripHtml(data.description as string | undefined);
      if (title) lines.push(title);
      if (desc) lines.push(desc);
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function InlineDiff({ original, revised }: { original: string; revised: string }) {
  const tokens = computeWordDiff(original, revised);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">
      {tokens.map((tok, i) => (
        <span
          key={i}
          className={cn(
            tok.type === "removed" &&
              "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 line-through rounded-sm px-0.5",
            tok.type === "added" &&
              "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-sm px-0.5 font-medium",
          )}
        >
          {tok.text}
        </span>
      ))}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Suggestion card (for "Analyze & Optimize" / suggestions mode)
// ---------------------------------------------------------------------------

function safeString(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (Array.isArray(val)) return val.map(safeString).join(", ");
    
    const v = val as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof v.name === "string") parts.push(v.name);
    else if (typeof v.title === "string") parts.push(v.title);
    else if (typeof v.position === "string") parts.push(v.position);
    else if (typeof v.degree === "string") parts.push(v.degree);
    
    if (typeof v.company === "string") parts.push(`at ${v.company}`);
    else if (typeof v.school === "string") parts.push(`at ${v.school}`);
    else if (typeof v.issuer === "string") parts.push(`— ${v.issuer}`);
    
    if (typeof v.level === "string") parts.push(`(${v.level})`);
    
    const header = parts.join(" ");
    const desc = typeof v.description === "string" ? v.description : (typeof v.summary === "string" ? v.summary : "");
    
    if (header && desc) return `${header}\n${desc}`;
    if (header) return header;
    if (desc) return desc;
    
    try {
      return JSON.stringify(val);
    } catch {
      return "[Object]";
    }
  }
  return String(val);
}

function SuggestionDiffCard({ suggestion }: { suggestion: AISuggestion }) {
  const originalStr = safeString(suggestion.original);
  const suggestedStr = safeString(suggestion.suggested);
  const labelStr = safeString(suggestion.label);

  const accentColor =
    suggestion.type === "replace"
      ? "bg-amber-400"
      : suggestion.type === "insert"
        ? "bg-green-400"
        : "bg-red-400";

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full shrink-0", accentColor)} />
          <p className="text-sm font-medium">{labelStr}</p>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
          {suggestion.type}
        </span>
      </div>

      {/* Diff body */}
      <div className="px-4 py-3 space-y-3">
        {originalStr && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Original
            </p>
            <p className="text-sm leading-relaxed bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-3 py-2 rounded-lg line-through opacity-80 whitespace-pre-wrap">
              {originalStr}
            </p>
          </div>
        )}

        {suggestedStr && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested
            </p>
            <p className="text-sm leading-relaxed bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-2 rounded-lg whitespace-pre-wrap">
              {suggestedStr}
            </p>
          </div>
        )}

        {/* Word-level inline diff */}
        {originalStr && suggestedStr && (
          <div className="space-y-1 border-t pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Inline diff
            </p>
            <div className="px-3 py-2 bg-muted/30 rounded-lg">
              <InlineDiff
                original={originalStr}
                revised={suggestedStr}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rewrite section card
// ---------------------------------------------------------------------------

function RewriteDiffCard({
  title,
  originalText,
  newText,
}: {
  title: string;
  originalText: string;
  newText: string;
}) {
  if (originalText === newText) return null;

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="border-b bg-muted/40 px-4 py-2.5 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-violet-400 shrink-0" />
        <p className="text-sm font-medium capitalize">{title}</p>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-2 divide-x">
        <div className="px-4 py-3 space-y-1 bg-red-50/40 dark:bg-red-900/20">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400 dark:text-red-400">
            Before
          </p>
          <p className="text-sm leading-relaxed text-red-800 dark:text-red-300 whitespace-pre-wrap">
            {originalText}
          </p>
        </div>
        <div className="px-4 py-3 space-y-1 bg-green-50/40 dark:bg-green-900/20">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-green-500 dark:text-green-400">
            After
          </p>
          <p className="text-sm leading-relaxed text-green-800 dark:text-green-300 whitespace-pre-wrap">
            {newText}
          </p>
        </div>
      </div>

      {/* Inline diff row */}
      <div className="border-t px-4 py-3 space-y-1 bg-muted/20">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Inline diff
        </p>
        <InlineDiff original={originalText} revised={newText} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export type DiffTemplateProps =
  | {
      type: "rewrite";
      originalSteps: Step[];
      newSteps: Step[];
    }
  | {
      type: "suggestions";
      suggestions: AISuggestion[];
    };

export function DiffTemplate(props: DiffTemplateProps) {
  // ---- Suggestions mode ----
  if (props.type === "suggestions") {
    const { suggestions } = props;
    if (!suggestions.length) {
      return (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No suggestions found — your resume looks great!
        </p>
      );
    }
    return (
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <SuggestionDiffCard key={i} suggestion={s} />
        ))}
      </div>
    );
  }

  // ---- Rewrite mode ----
  const { originalSteps, newSteps } = props;
  const cards: React.ReactNode[] = [];

  for (const origStep of originalSteps) {
    const newStep = newSteps.find((s) => s.id === origStep.id);
    if (!newStep) continue;

    const origText = extractStepText(origStep);
    const newText = extractStepText(newStep);

    if (!origText && !newText) continue;
    if (origText === newText) continue;

    cards.push(
      <RewriteDiffCard
        key={origStep.id}
        title={origStep.title}
        originalText={origText}
        newText={newText}
      />,
    );
  }

  if (!cards.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No changes were detected.
      </p>
    );
  }

  return <div className="space-y-3">{cards}</div>;
}
