"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, GripVertical, Lock, Plus, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useEditorContext } from "../contexts/editor-context";
import { AddSectionModal } from "./add-section-modal";

import { FIXED_STEP_IDS } from "../providers/editor-provider";

type EditorDesktopRailProps = {
  className?: string;
  onSelectSection?: () => void;
};

export function EditorDesktopRail({
  className,
  onSelectSection,
}: EditorDesktopRailProps) {
  const { stepper } = useEditorContext();
  const {
    steps,
    current: currentStep,
    setCurrent: setCurrentStep,
    addStep,
    toggleStepEnabled,
    reorderStep,
    removeStep,
  } = stepper;
  const [filter, setFilter] = useState("");
  const [draggingStepId, setDraggingStepId] = useState<string | null>(null);
  const [dragOverStepId, setDragOverStepId] = useState<string | null>(null);
  const addSectionModal = useModal();

  const filteredSteps = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) {
      return steps;
    }
    return steps.filter((step) => step.title.toLowerCase().includes(term));
  }, [filter, steps]);

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      <div className="border-b px-5 py-5">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">
          RESUME SECTIONS
        </p>
        <input
          className="mt-3 h-9 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="Filter sections..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredSteps.map((step) => {
          const Icon = step.icon?.component;
          const isActive = currentStep?.id === step.id;
          const isSummary = FIXED_STEP_IDS.includes(step.id as any);
          const isEnabled = step.enabled !== false;

          return (
            <button
              key={step.id}
              type="button"
              draggable={!isSummary}
              onDragStart={(event) => {
                if (isSummary) {
                  return;
                }
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", step.id);
                setDraggingStepId(step.id);
              }}
              onDragOver={(event) => {
                if (isSummary) {
                  return;
                }
                event.preventDefault();
                setDragOverStepId(step.id);
              }}
              onDrop={(event) => {
                if (isSummary) {
                  return;
                }
                event.preventDefault();
                const activeStepId = event.dataTransfer.getData("text/plain");
                if (!activeStepId) {
                  return;
                }
                reorderStep(activeStepId as any, step.id);
                setDragOverStepId(null);
                setDraggingStepId(null);
              }}
              onDragEnd={() => {
                setDragOverStepId(null);
                setDraggingStepId(null);
              }}
              onClick={() => {
                setCurrentStep(step.id);
                onSelectSection?.();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left",
                isActive && "bg-blue-100 text-blue-700",
                !isEnabled && "opacity-60",
                draggingStepId === step.id && "opacity-60",
                dragOverStepId === step.id &&
                  !isSummary &&
                  "ring-2 ring-blue-300",
                !isSummary && "cursor-grab",
              )}
            >
              {!isSummary && (
                <GripVertical className="size-3.5 text-muted-foreground" />
              )}
              {Icon ? (
                <Icon className="size-5" />
              ) : (
                <Sparkles className="size-5" />
              )}
              <span className="flex-1 text-2xl font-medium">{step.title}</span>
              {isSummary ? (
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs text-muted-foreground">
                  <Lock className="size-3" />
                  Fixed
                </span>
              ) : (
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-8"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleStepEnabled(step.id);
                    }}
                    aria-label={
                      isEnabled
                        ? `Turn off ${step.title}`
                        : `Turn on ${step.title}`
                    }
                  >
                    {isEnabled ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </Button>
                  {step.id.startsWith("other-field-") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-8"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeStep(step.id);
                      }}
                      aria-label={`Remove ${step.title}`}
                    >
                      <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t px-5 py-4">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-blue-600"
          onClick={() => addSectionModal.open()}
        >
          <Plus className="size-4" />
          Add Custom Section
        </Button>
      </div>

      <AddSectionModal modal={addSectionModal} onSubmit={addStep} />
    </div>
  );
}
