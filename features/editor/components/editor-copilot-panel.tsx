"use client";

import { LoadingButton } from "@/components/loading-button";
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
import { Loader2, Sparkles, WandSparkles, Zap } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useEditorContext } from "../contexts/editor-context";
import { applySuggestion } from "../helpers/ai-helpers";

type EditorCopilotPanelProps = {
  mobile?: boolean;
};

const SUGGESTION_COLORS = {
  insert: "bg-emerald-50 border-emerald-200",
  replace: "bg-blue-50 border-blue-200",
  delete: "bg-amber-50 border-amber-200",
} as const;

const QUICK_ACTIONS = [
  { id: "rewrite", label: "Rewrite with AI", icon: WandSparkles },
  { id: "bullets", label: "Improve Bullet Points", icon: Zap },
  { id: "tailor", label: "Tailor to Job", icon: Sparkles },
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

  const [status, setStatus] = useState<
    "idle" | "suggesting" | `applying-${number | string}`
  >("idle");

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const [jobDescription, setJobDescription] = useState(resumeJobDescription);

  const [isPending, startTransition] = useTransition();

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

  // ── Modal ──────────────────────────────────────────────────────────────────
  const aiModal = useModal<AIResultModalData>();

  const handleAccept = (data: AIResultModalData) => {
    if (data.action === "rewrite" && data.newSteps) {
      setSteps(data.newSteps);
    }
    // "suggestions" are informational — user has already read the diff
  };

  // ── Quick action handlers ──────────────────────────────────────────────────
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

  const handleAnalyzeAndOptimize = async () => {
    if (!jobDescription.trim()) return;
    setStatus("suggesting");
    try {
      const suggestions = await getSuggestions(jobDescription);
      if (suggestions?.length) {
        setSuggestions(suggestions);
      } else {
        toast.info("No suggestions found.", { position: "top-right" });
      }
    } catch {
      toast.error("Failed to get suggestions", { position: "top-right" });
    } finally {
      setStatus("idle");
    }
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
    setStatus(`applying-${suggestion.id}`);
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
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
      setStatus("idle");
    }
  };

  const quickActionHandlers: Record<string, () => void> = {
    rewrite: handleRewrite,
    bullets: handleRewrite, // same action — rewrite focuses on bullets
    tailor: () => setIsTailorModalOpen(true),
  };

  return (
    <>
      {/* ── AI Result Modal ── */}
      <AIResultModal modal={aiModal} onAccept={handleAccept} />

      {/* ── Tailor Job Modal ── */}
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
            placeholder="Paste job description here..."
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
              className="bg-linear-to-r from-violet-600 to-blue-600"
              onClick={handleTailorJob}
              disabled={aiStatus !== "idle" || !jobDescription.trim()}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Tailor Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Panel body ── */}
      <div className={cn("space-y-4", mobile && "space-y-5")}>
        <div
          className={cn(
            "rounded-xl border bg-violet-50/60 p-4",
            mobile && "bg-violet-50",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-violet-500 to-blue-500 p-2 text-white">
              <Sparkles className="size-6" />
            </div>
            <div>
              <p className="text-3xl font-semibold">AI Copilot</p>
              <p className="text-muted-foreground">
                Your intelligent writing assistant
              </p>
            </div>
          </div>

          {mobile && (
            <div className="mt-4 rounded-full bg-muted p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("actions")}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-semibold",
                    activeTab === "actions" && "bg-background",
                  )}
                >
                  Quick Actions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("suggestions")}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-semibold",
                    activeTab === "suggestions" && "bg-background",
                  )}
                >
                  Suggestions
                </button>
              </div>
            </div>
          )}
        </div>

        {(!mobile || activeTab === "actions") && (
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isRunning =
                  aiModal.isOpen && aiModal.isLoading && aiStatus !== "idle";
                return (
                  <button
                    key={action.id}
                    type="button"
                    disabled={isRunning}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-lg font-medium transition-colors hover:bg-muted/40",
                      isRunning && "cursor-not-allowed opacity-60",
                    )}
                    onClick={() => quickActionHandlers[action.id]?.()}
                  >
                    <span className="rounded-lg bg-muted p-2">
                      <Icon className="size-4" />
                    </span>
                    {action.label}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {(!mobile || activeTab === "suggestions") && (
          <>
            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-xl">Job Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get AI-powered suggestions..."
                  className="resize-none"
                />
                <Button
                  className="w-full bg-linear-to-r from-violet-600 to-blue-600"
                  onClick={handleAnalyzeAndOptimize}
                  disabled={aiStatus === "suggesting" || !jobDescription.trim()}
                >
                  {status === "suggesting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles />
                      Analyze &amp; Optimize
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-xl">
                  AI Suggestions{" "}
                  {suggestions.length > 0 && `(${suggestions.length})`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {suggestions.length > 0 ? (
                  suggestions.map((s) => (
                    <div
                      key={s.id}
                      className={cn(
                        "rounded-xl border p-4 py-6 relative",
                        SUGGESTION_COLORS[s.type],
                      )}
                    >
                      <span className="absolute top-1 right-1 p-1 text-xs border bg-muted text-muted-foreground rounded-xl">
                        {s.sectionId}
                      </span>
                      <p className="text-lg text-slate-700">{s.label}</p>
                      <LoadingButton
                        variant="outline"
                        className="mt-3 w-full"
                        onClick={() => handleApplySuggestion(s)}
                        disabled={isPending}
                        isLoading={status === `applying-${s.id}`}
                      >
                        Apply Suggestion
                      </LoadingButton>
                    </div>
                  ))
                ) : (
                  <div className="w-full p-4 flex items-center justify-center italic rounded-xl bg-muted border">
                    No suggestions
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
