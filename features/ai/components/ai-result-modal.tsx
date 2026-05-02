"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AISuggestion } from "@/features/ai/prompts/suggestion.prompt";
import { DiffTemplate } from "@/features/editor/components/templates/diff-template";
import { Step } from "@/features/editor/types/editor-resume.type";
import { Modal } from "@/hooks/use-modal";
import { CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AIResultAction = "rewrite" | "suggestions";

export type AIModalData = {
  action: AIResultAction;
  label: string;
  originalSteps: Step[];
  newSteps?: Step[];
  suggestions?: AISuggestion[];
};

export type AIResultModalData = {
  action: AIResultAction;
  label: string;
  originalSteps: Step[];
  newSteps?: Step[];
  suggestions?: AISuggestion[];
};

type AIResultModalProps = {
  modal: Modal<AIResultModalData>;
  onAccept: (data: AIResultModalData) => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AIResultModal({ modal, onAccept }: AIResultModalProps) {
  const { isOpen, isLoading, data, close } = modal;

  const handleAccept = () => {
    if (data) {
      onAccept(data);
    }
    close();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) close();
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-2xl">
        {/* ── Header ── */}
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-violet-500 to-blue-500 p-2 text-white">
              <Sparkles className="size-4" />
            </div>
            <DialogTitle className="text-lg">
              {isLoading ? "AI is thinking…" : (data?.label ?? "AI Result")}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* ── Scrollable body ── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-violet-200 opacity-60" />
                <div className="relative rounded-full bg-linear-to-br from-violet-100 to-blue-100 p-4">
                  <Loader2 className="size-8 animate-spin text-violet-500" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  Analyzing your resume
                </p>
                <p className="mt-0.5 animate-pulse text-sm text-muted-foreground">
                  This may take a few seconds…
                </p>
              </div>
            </div>
          )}

          {!isLoading && data && (
            <>
              {/* Legend */}
              <div className="mb-4 flex items-center gap-4 rounded-lg border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-100 outline outline-red-300" />
                  Removed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-100 outline outline-green-300" />
                  Added
                </span>
                <span className="ml-auto text-muted-foreground/70">
                  {data.action === "suggestions"
                    ? `${data.suggestions?.length ?? 0} suggestion${(data.suggestions?.length ?? 0) !== 1 ? "s" : ""}`
                    : "Full resume rewrite"}
                </span>
              </div>

              {/* Diff */}
              {data.action === "rewrite" ? (
                <DiffTemplate
                  type="rewrite"
                  originalSteps={data.originalSteps}
                  newSteps={data.newSteps!}
                />
              ) : (
                <DiffTemplate
                  type="suggestions"
                  suggestions={data.suggestions!}
                />
              )}
            </>
          )}

          {!isLoading && !data && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No result available.
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        {!isLoading && data && (
          <DialogFooter className="shrink-0 border-t px-6 py-4">
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1" onClick={close}>
                <XCircle className="size-4" />
                Reject
              </Button>
              <Button
                className="flex-1 bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                onClick={handleAccept}
              >
                <CheckCircle2 className="size-4" />
                Accept Changes
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
