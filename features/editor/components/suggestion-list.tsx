"use client";

import { LoadingButton } from "@/components/loading-button";
import { AISuggestion } from "@/features/ai/prompts/suggestion.prompt";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  CheckCircle2,
  Lightbulb,
  PlusCircle,
  Trash2,
  Wand2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type SuggestionType = AISuggestion["type"];

// ─── Config ─────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  SuggestionType,
  {
    label: string;
    icon: React.ElementType;
    gradient: string;
    badge: string;
    iconBg: string;
  }
> = {
  insert: {
    label: "Insert",
    icon: PlusCircle,
    gradient:
      "from-emerald-50 to-teal-50 border-emerald-200/80 dark:from-emerald-950/30 dark:to-teal-950/30 dark:border-emerald-800/50",
    badge:
      "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:ring-emerald-700",
    iconBg: "bg-emerald-500",
  },
  replace: {
    label: "Replace",
    icon: ArrowLeftRight,
    gradient:
      "from-blue-50 to-indigo-50 border-blue-200/80 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800/50",
    badge:
      "bg-blue-100 text-blue-700 ring-1 ring-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:ring-blue-700",
    iconBg: "bg-blue-500",
  },
  delete: {
    label: "Remove",
    icon: Trash2,
    gradient:
      "from-amber-50 to-orange-50 border-amber-200/80 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800/50",
    badge:
      "bg-amber-100 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:ring-amber-700",
    iconBg: "bg-amber-500",
  },
};

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/20 px-6 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Lightbulb className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          No suggestions yet
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/60">
          Paste a job description above and click &quot;Analyze &amp;
          Optimize&quot;
        </p>
      </div>
    </div>
  );
}

// ─── Suggestion Item ─────────────────────────────────────────────────────────

type SuggestionItemProps = {
  suggestion: AISuggestion;
  isApplying: boolean;
  isAnyApplying: boolean;
  onApply: (suggestion: AISuggestion) => void;
};

function SuggestionItem({
  suggestion: s,
  isApplying,
  isAnyApplying,
  onApply,
}: SuggestionItemProps) {
  const [removing, setRemoving] = useState(false);
  const [applied, setApplied] = useState(false);
  const prevIsApplyingRef = useRef(isApplying);

  // Detect when applying transitions from true → false (apply finished)
  useEffect(() => {
    if (prevIsApplyingRef.current && !isApplying) {
      setApplied(true);
      const t = setTimeout(() => setRemoving(true), 600);
      return () => clearTimeout(t);
    }
    prevIsApplyingRef.current = isApplying;
  }, [isApplying]);

  const config = TYPE_CONFIG[s.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        // base layout
        "relative overflow-hidden rounded-2xl border bg-linear-to-br p-4 shadow-sm",
        "transition-all duration-500 ease-in-out",
        config.gradient,
        // removal animation
        removing
          ? "pointer-events-none max-h-0 scale-95 border-0 p-0 opacity-0"
          : "max-h-125 opacity-100",
        // applied flash
        applied && !removing && "ring-2 ring-emerald-400 ring-offset-1",
      )}
    >
      {/* ── Header row ── */}
      <div className="mb-3 flex items-start gap-3">
        {/* type icon bubble */}
        <div
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
            config.iconBg,
          )}
        >
          <Icon className="size-3.5" />
        </div>

        {/* label + badges */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground/90">
            {s.label}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {/* type badge */}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                config.badge,
              )}
            >
              {config.label}
            </span>
            {/* section badge */}
            <span className="inline-flex items-center rounded-full bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-black/5">
              {s.sectionId}
            </span>
          </div>
        </div>

        {/* success checkmark */}
        <div
          className={cn(
            "shrink-0 transition-all duration-300",
            applied && !removing
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0",
          )}
        >
          <CheckCircle2 className="size-5 text-emerald-500" />
        </div>
      </div>

      {/* ── Suggested content preview ── */}
      {s.suggested && typeof s.suggested === "string" && (
        <div className="mb-3 rounded-xl bg-background/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground backdrop-blur-sm ring-1 ring-black/5">
          <span className="mr-1 font-semibold text-foreground/70">
            Suggested:
          </span>
          <span className="line-clamp-3">{s.suggested}</span>
        </div>
      )}

      {/* ── Apply button ── */}
      <LoadingButton
        variant="default"
        size="sm"
        className={cn(
          "w-full gap-2 rounded-xl font-semibold transition-all",
          "bg-foreground/90 text-background hover:bg-foreground",
          applied && "bg-emerald-500 hover:bg-emerald-500",
        )}
        onClick={() => onApply(s)}
        disabled={isAnyApplying && !isApplying}
        isLoading={isApplying}
      >
        <div className="flex items-center gap-2">
          {!isApplying && <Wand2 className="size-3.5" />}
          {applied ? "Applied!" : "Apply Suggestion"}
        </div>
      </LoadingButton>
    </div>
  );
}

// ─── Suggestion List ─────────────────────────────────────────────────────────

export type SuggestionListProps = {
  suggestions: AISuggestion[];
  applyingId: string | null;
  onApply: (suggestion: AISuggestion) => void;
};

export function SuggestionList({
  suggestions,
  applyingId,
  onApply,
}: SuggestionListProps) {
  const handleApply = useCallback((s: AISuggestion) => onApply(s), [onApply]);

  if (suggestions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {suggestions.map((s) => (
        <SuggestionItem
          key={s.id}
          suggestion={s}
          isApplying={applyingId === s.id}
          isAnyApplying={applyingId !== null}
          onApply={handleApply}
        />
      ))}
    </div>
  );
}
