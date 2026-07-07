"use client";

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
import { AISuggestion } from "@/features/ai/prompts/suggestion.prompt";
import { useModal } from "@/hooks/use-modal";
import { useResumeAI } from "@/hooks/use-resume-ai";
import useSimpleDebounce from "@/hooks/use-simple-debounce";
import { cn } from "@/lib/utils";
import { useAISuggestionStore } from "@/store/ai-suggestions.store";
import { Loader2, Sparkles, WandSparkles, Zap } from "lucide-react";
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
  },
  {
    id: "tailor",
    label: "Tailor to Job",
    description: "Match a specific role",
    icon: Zap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
] as const;

export function EditorCopilotPanel({
  mobile = false,
}: EditorCopilotPanelProps) {
  const [activeTab, setActiveTab] = useState<"actions" | "suggestions">(
    "actions",
  );
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
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

  useEffect(() => {
    if (debouncedJobDescription) {
      updateResumeMetadata({ jobDescription: debouncedJobDescription });
    }
  }, [debouncedJobDescription, updateResumeMetadata]);

  const aiModal = useModal<AIResultModalData>();

  const handleAccept = (data: AIResultModalData) => {
    if (data.action === "rewrite" && data.newSteps) {
      setSteps(data.newSteps);
    }
  };

  const handleRewrite = async () => {
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
    }
  };

  const handleAnalyzeAndOptimize = () => {
    if (!jobDescription.trim()) return;
    getSuggestions(jobDescription);
  };

  const handleTailorJob = async () => {
    setIsTailorModalOpen(false);
    if (!jobDescription.trim()) return;
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
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Job description + suggestions */}
        {(!mobile || activeTab === "suggestions") && (
          <>
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-3 pt-4 px-4">
                <CardTitle className="text-base font-semibold">
                  Job Description
                </CardTitle>
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
