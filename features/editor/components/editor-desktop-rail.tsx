"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useEditorContext } from "../contexts/editor-context";
import { FIXED_STEP_IDS } from "../resource/steps";
import { AddSectionModal } from "./add-section-modal";

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
    if (!term) return steps;
    return steps.filter((step) => step.title.toLowerCase().includes(term));
  }, [filter, steps]);

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* Header */}
      <div className="border-b px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Resume Sections
        </p>
        <input
          className="mt-2.5 h-9 w-full rounded-lg border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Filter sections…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Step list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {filteredSteps.map((step) => {
          const Icon = step.icon?.component;
          const isActive = currentStep?.id === step.id;
          const isFixed = FIXED_STEP_IDS.includes(step.id as any);
          const isEnabled = step.enabled !== false;
          const isCustom = step.id.startsWith("other-field-");

          return (
            <button
              key={step.id}
              type="button"
              draggable={!isFixed}
              onDragStart={(e) => {
                if (isFixed) return;
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", step.id);
                setDraggingStepId(step.id);
              }}
              onDragOver={(e) => {
                if (isFixed) return;
                e.preventDefault();
                setDragOverStepId(step.id);
              }}
              onDrop={(e) => {
                if (isFixed) return;
                e.preventDefault();
                const activeId = e.dataTransfer.getData("text/plain");
                if (activeId) reorderStep(activeId as any, step.id);
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
                "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted/60",
                !isEnabled && "opacity-50",
                draggingStepId === step.id && "opacity-40",
                dragOverStepId === step.id &&
                  !isFixed &&
                  "ring-2 ring-primary/40",
                !isFixed && "cursor-grab",
              )}
            >
              {/* Drag handle */}
              {!isFixed ? (
                <GripVertical className="size-3.5 shrink-0 text-muted-foreground/50" />
              ) : (
                <span className="size-3.5 shrink-0" />
              )}

              {/* Icon */}
              {Icon ? (
                <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              ) : (
                <Sparkles className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              )}

              {/* Title */}
              <span className="flex-1 truncate text-sm font-medium">
                {step.title}
              </span>

              {/* Right actions */}
              {isFixed ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  <Lock className="size-2.5" />
                  Fixed
                </span>
              ) : (
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepEnabled(step.id);
                    }}
                    aria-label={isEnabled ? `Hide ${step.title}` : `Show ${step.title}`}
                  >
                    {isEnabled ? (
                      <Eye className="size-3.5" />
                    ) : (
                      <EyeOff className="size-3.5" />
                    )}
                  </Button>
                  {isCustom && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStep(step.id);
                      }}
                      aria-label={`Remove ${step.title}`}
                    >
                      <Trash2 className="size-3.5 text-muted-foreground transition-colors hover:text-destructive" />
                    </Button>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t px-3 py-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-2 text-primary hover:bg-primary/8 hover:text-primary"
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
