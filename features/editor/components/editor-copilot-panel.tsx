"use client";

import { UpgradePrompt } from "@/components/upgrade-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AIResultModal,
  AIResultModalData,
} from "@/features/ai/components/ai-result-modal";
import { getAIUsageSummary, getCurrentPlan } from "@/features/ai/actions/usage.action";
import { AISuggestion } from "@/features/ai/prompts/suggestion.prompt";
import { useModal } from "@/hooks/use-modal";
import { useResumeAI } from "@/hooks/use-resume-ai";
import useSimpleDebounce from "@/hooks/use-simple-debounce";
import { UsageSummaryItem } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { useAISuggestionStore } from "@/store/ai-suggestions.store";
import { Loader2, Lock, Sparkles, WandSparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEditorContext } from "../contexts/editor-context";
import { applySuggestion } from "../helpers/ai-helpers";
import { SuggestionList } from "./suggestion-list";

type EditorCopilotPanelProps = {
  mobile?: boolean;
};

const QUICK_ACTIONS = [
  {
    id: "rewrite",
    label: "Rewrite with AI",
    description: "Enhance clarity and impact",
    icon: WandSparkles,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/40",
    feature: "REWRITE" as const,
  },
  {
    id: "tailor",
    label: "Tailor to Job",
    description: "Match a specific role",
    icon: Zap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    feature: "TAILOR" as const,
  },
] as const;

export function EditorCopilotPanel({
  mobile = false,
}: EditorCopilotPanelProps) {
  const [activeTab, setActiveTab] = useState<"actions" | "suggestions">(
    "actions",
  );
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string | undefined>();
  const [upgradeUsage, setUpgradeUsage] = useState<{ used: number; limit: number } | undefined>();

  const [usageSummary, setUsageSummary] = useState<UsageSummaryItem[]>([]);
  const [isPro, setIsPro] = useState(false);

  const {
    stepper: { steps },
    editorState: { updateResumeMetadata },
    resumeMetadata: { jobDescription: resumeJobDescription },
    setSteps,
  } = useEditorContext();

  const [applyingId, setApplyingId] = useState<string | null>(null);
  const { suggestions, isSuggesting } = useAISuggestionStore();
  const removeSuggestion = useAISuggestionStore((s) => s.removeSuggestion);

  const [jobDescription, setJobDescription] = useState(resumeJobDescription);
  const {
    status: aiStatus,
    rewrite,
    tailor,
    getSuggestions,
  } = useResumeAI({ steps });

  const debouncedJobDescription = useSimpleDebounce(jobDescription, {
    delay: 500,
  });

  // Load plan & usage on mount
  useEffect(() => {
    Promise.all([getAIUsageSummary(), getCurrentPlan()]).then(
      ([summary, plan]) => {
        setUsageSummary(summary);
        setIsPro(plan === "PRO" || plan === "TEAM");
      },
    );
  }, []);

  useEffect(() => {
    if (debouncedJobDescription) {
      updateResumeMetadata({ jobDescription: debouncedJobDescription });
    }
  }, [debouncedJobDescription, updateResumeMetadata]);

  const aiModal = useModal<AIResultModalData>();

  const getUsageFor = (feature: "REWRITE" | "TAILOR" | "SUGGESTIONS") =>
    usageSummary.find((u) => u.feature === feature);

  /** Returns true and opens upgrade prompt if the action is blocked */
  const guardAction = (feature: "REWRITE" | "TAILOR" | "SUGGESTIONS", label: string): boolean => {
    const usage = getUsageFor(feature);
    if (!usage) return false;
    if (usage.hardBlocked || usage.used >= usage.limit) {
      setUpgradeFeature(label);
      setUpgradeUsage(
        usage.hardBlocked ? undefined : { used: usage.used, limit: usage.limit },
      );
      setUpgradeOpen(true);
      return true;
    }
    return false;
  };

  const handleAccept = (data: AIResultModalData) => {
    if (data.action === "rewrite" && data.newSteps) {
      setSteps(data.newSteps);
    }
  };

  const handleRewrite = async () => {
    if (guardAction("REWRITE", "AI Rewrite")) return;
    aiModal.open();
    aiModal.setIsLoading(true);
    try {
      const newSteps = await rewrite();
      if (newSteps) {
        aiModal.updateData({
          action: "rewrite",
          label: "AI Resume Rewrite",
          originalSteps: steps,
          newSteps,
        });
      } else {
        aiModal.close();
      }
    } catch {
      aiModal.close();
    } finally {
      aiModal.setIsLoading(false);
      // Refresh usage after action
      getAIUsageSummary().then(setUsageSummary);
    }
  };

  const handleAnalyzeAndOptimize = () => {
    if (!jobDescription.trim()) return;
    if (guardAction("SUGGESTIONS", "AI Suggestions")) return;
    getSuggestions(jobDescription).then(() => {
      getAIUsageSummary().then(setUsageSummary);
    });
  };

  const handleTailorJob = async () => {
    setIsTailorModalOpen(false);
    if (!jobDescription.trim()) return;
    if (guardAction("TAILOR", "AI Tailor to Job")) return;
    aiModal.open();
    aiModal.setIsLoading(true);
    try {
      const newSteps = await tailor(jobDescription);
      if (newSteps) {
        aiModal.updateData({
          action: "rewrite",
          label: "Tailored Resume",
          originalSteps: steps,
          newSteps,
        });
      } else {
        aiModal.close();
      }
    } catch {
      aiModal.close();
    } finally {
      aiModal.setIsLoading(false);
      getAIUsageSummary().then(setUsageSummary);
    }
  };

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    setApplyingId(suggestion.id);
    try {
      const { isUpdated, steps: newSteps } = await applySuggestion(
        suggestion,
        steps,
      );
      if (isUpdated) {
        setSteps(newSteps);
        toast.success("Suggestion applied successfully", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to apply suggestion", { position: "top-right" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply suggestion", { position: "top-right" });
    } finally {
      setTimeout(() => {
        removeSuggestion(suggestion.id);
        setApplyingId(null);
      }, 1200);
    }
  };

  const quickActionHandlers: Record<string, () => void> = {
    rewrite: handleRewrite,
    tailor: () => setIsTailorModalOpen(true),
  };

  const isAIRunning =
    aiModal.isOpen && aiModal.isLoading && aiStatus !== "idle";

  return (
    <>
      {/* ── Upgrade Prompt ── */}
      <UpgradePrompt
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        feature={upgradeFeature}
        usage={upgradeUsage}
      />

      {/* ── AI Result Modal ── */}
      <AIResultModal modal={aiModal} onAccept={handleAccept} />

      {/* ── Tailor to Job Modal ── */}
      <Dialog open={isTailorModalOpen} onOpenChange={setIsTailorModalOpen}>
        <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tailor to Job</DialogTitle>
            <DialogDescription>
              Paste the job description you are applying for. The AI will
              rewrite your resume to better match this specific role.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here…"
            className="h-full resize-none"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTailorModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
              onClick={handleTailorJob}
              disabled={aiStatus !== "idle" || !jobDescription.trim()}
            >
              <Sparkles className="size-4" />
              Tailor Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Panel Body ── */}
      <div className={cn("space-y-4", mobile && "space-y-5")}>
        {/* Header banner */}
        <div className="rounded-xl border bg-linear-to-br from-violet-50 to-blue-50 dark:from-violet-950/25 dark:to-blue-950/25 dark:border-violet-900/30 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-violet-500 to-blue-500 p-2 text-white shadow-sm">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">AI Copilot</p>
              <p className="text-xs text-muted-foreground">
                Your intelligent writing assistant
              </p>
            </div>
          </div>

          {/* Mobile tab switcher */}
          {mobile && (
            <div className="mt-4 rounded-full bg-background/70 p-1">
              <div className="grid grid-cols-2 gap-1">
                {(["actions", "suggestions"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-semibold capitalize transition-all duration-150",
                      activeTab === tab
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab === "actions" ? "Quick Actions" : "Suggestions"}
                    {tab === "suggestions" && suggestions.length > 0 && (
                      <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-violet-500 text-[10px] text-white">
                        {suggestions.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        {(!mobile || activeTab === "actions") && (
          <Card className="shadow-sm">
            <CardHeader className="border-b pb-3 pt-4 px-4">
              <CardTitle className="text-base font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const usage = getUsageFor(action.feature);
                const isBlocked = usage
                  ? usage.hardBlocked || usage.used >= usage.limit
                  : false;

                return (
                  <button
                    key={action.id}
                    type="button"
                    disabled={isAIRunning}
                    onClick={() => quickActionHandlers[action.id]?.()}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150",
                      "hover:bg-muted/50 hover:border-muted-foreground/20 hover:shadow-sm",
                      isAIRunning && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-lg p-2 shrink-0 transition-transform group-hover:scale-105",
                        action.bg,
                      )}
                    >
                      <Icon className={cn("size-4", action.color)} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{action.label}</p>
                        {isBlocked && (
                          <span className="inline-flex items-center gap-0.5 rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400">
                            <Lock className="size-2" />
                            {usage?.hardBlocked ? "Pro" : "Limit reached"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    {/* Usage chip */}
                    {usage && !usage.hardBlocked && (
                      <span className={cn(
                        "shrink-0 text-[10px] font-semibold tabular-nums",
                        usage.used >= usage.limit
                          ? "text-destructive"
                          : "text-muted-foreground",
                      )}>
                        {usage.used}/{usage.limit}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Upgrade nudge for free users */}
              {!isPro && (
                <button
                  type="button"
                  onClick={() => {
                    setUpgradeFeature(undefined);
                    setUpgradeUsage(undefined);
                    setUpgradeOpen(true);
                  }}
                  className="mt-1 w-full rounded-xl border border-dashed border-violet-300 bg-violet-50/50 px-4 py-2.5 text-center text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-100/60 dark:border-violet-800 dark:bg-violet-950/20 dark:text-violet-400 dark:hover:bg-violet-950/40"
                >
                  <Sparkles className="mr-1.5 inline size-3" />
                  Upgrade to Pro for more AI credits
                </button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Job description + suggestions */}
        {(!mobile || activeTab === "suggestions") && (
          <>
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-3 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    Job Description
                  </CardTitle>
                  {/* Suggestions usage chip */}
                  {(() => {
                    const u = getUsageFor("SUGGESTIONS");
                    if (!u || u.hardBlocked) return null;
                    return (
                      <span className={cn(
                        "text-[10px] font-semibold tabular-nums",
                        u.used >= u.limit ? "text-destructive" : "text-muted-foreground",
                      )}>
                        {u.used}/{u.limit} suggestions
                      </span>
                    );
                  })()}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <Textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste a job description to get AI-powered suggestions…"
                  className="resize-none text-sm max-h-48"
                />
                <Button
                  className="w-full bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
                  onClick={handleAnalyzeAndOptimize}
                  disabled={isSuggesting || !jobDescription.trim()}
                >
                  {isSuggesting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Analyze & Optimize
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="border-b pb-3 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  AI Suggestions
                  {suggestions.length > 0 && (
                    <span className="inline-flex items-center justify-center rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                      {suggestions.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <SuggestionList
                  suggestions={suggestions}
                  applyingId={applyingId}
                  onApply={handleApplySuggestion}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
