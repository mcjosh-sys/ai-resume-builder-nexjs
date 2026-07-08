"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
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
import { Step } from "../types/editor-resume.type";
import { AddSectionModal } from "./add-section-modal";

// ─── Shared Step Item ────────────────────────────────────────────────────────

type StepItemConfig = {
  step: Step;
  isActive: boolean;
  isHeader: boolean;
  isEnabled: boolean;
  draggingStepId: string | null;
  dragOverStepId: string | null;
  onSelect: (id: Step["id"]) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, targetId: Step["id"]) => void;
  onDragEnd: () => void;
  onToggleEnabled: (id: Step["id"]) => void;
  onRemove: (id: Step["id"]) => void;
};

function SidebarStepItem({
  step,
  isActive,
  isHeader,
  isEnabled,
  draggingStepId,
  dragOverStepId,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleEnabled,
  onRemove,
}: StepItemConfig) {
  const Icon = step.icon?.component;
  const isCustom = step.id.startsWith("other-field-");

  return (
    <SidebarMenuItem key={step.id}>
      <SidebarMenuButton
        isActive={isActive}
        draggable={!isHeader}
        onDragStart={(e) => !isHeader && onDragStart(e, step.id)}
        onDragOver={(e) => !isHeader && onDragOver(e, step.id)}
        onDrop={(e) => !isHeader && onDrop(e, step.id)}
        onDragEnd={onDragEnd}
        onClick={() => onSelect(step.id)}
        tooltip={step.title}
        className={cn(
          "h-auto items-start gap-2.5 py-2.5 rounded-lg transition-colors",
          !isEnabled && "opacity-50",
          draggingStepId === step.id && "opacity-40",
          dragOverStepId === step.id &&
            !isHeader &&
            "border border-primary/50 bg-primary/5",
          isActive && "font-medium",
        )}
      >
        {/* Drag handle */}
        {!isHeader ? (
          <GripVertical className="mt-0.5 size-3.5 shrink-0 cursor-grab text-muted-foreground/50" />
        ) : (
          <span className="size-3.5 shrink-0" />
        )}

        {/* Section icon */}
        {Icon ? (
          <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        ) : (
          <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        )}

        {/* Title + description */}
        <span className="flex flex-1 flex-col gap-0.5 text-left min-w-0">
          <span className="truncate text-sm font-medium leading-tight">
            {step.title}
          </span>
          {step.sidebarDesc && (
            <span className="truncate text-xs text-muted-foreground">
              {step.sidebarDesc}
            </span>
          )}
        </span>

        {/* Right action area */}
        {isHeader ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Lock className="size-2.5" />
            Fixed
          </span>
        ) : (
          <div className="flex shrink-0 items-center gap-0.5">
            <Button asChild variant="ghost" size="icon-sm" className="size-6">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEnabled(step.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onToggleEnabled(step.id);
                  }
                }}
                aria-label={
                  isEnabled ? `Hide ${step.title}` : `Show ${step.title}`
                }
              >
                {isEnabled ? (
                  <Eye className="size-3.5 text-muted-foreground" />
                ) : (
                  <EyeOff className="size-3.5 text-muted-foreground" />
                )}
              </span>
            </Button>
            {isCustom && (
              <Button asChild variant="ghost" size="icon-sm" className="size-6">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(step.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onRemove(step.id);
                    }
                  }}
                  aria-label={`Remove ${step.title}`}
                >
                  <Trash2 className="size-3.5 text-muted-foreground transition-colors hover:text-destructive" />
                </span>
              </Button>
            )}
          </div>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ─── Sidebar Component ────────────────────────────────────────────────────────

export function EditorSidebar() {
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
  const [disabledOpen, setDisabledOpen] = useState(false);
  const addSectionModal = useModal();

  const filteredSteps = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return steps;
    return steps.filter((step) => step.title.toLowerCase().includes(term));
  }, [filter, steps]);

  const { disabledSteps, enabledSteps } = useMemo(
    () => ({
      disabledSteps: filteredSteps.filter((s) => s.enabled === false),
      enabledSteps: filteredSteps.filter((s) => s.enabled !== false),
    }),
    [filteredSteps],
  );

  const dragHandlers = {
    onDragStart: (e: React.DragEvent, id: string) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
      setDraggingStepId(id);
    },
    onDragOver: (e: React.DragEvent, id: string) => {
      e.preventDefault();
      setDragOverStepId(id);
    },
    onDrop: (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const activeId = e.dataTransfer.getData("text/plain") as Step["id"];
      if (activeId) reorderStep(activeId, targetId as Step["id"]);
      setDragOverStepId(null);
      setDraggingStepId(null);
    },
    onDragEnd: () => {
      setDragOverStepId(null);
      setDraggingStepId(null);
    },
  };

  const sharedItemProps = {
    draggingStepId,
    dragOverStepId,
    onSelect: setCurrentStep,
    onToggleEnabled: toggleStepEnabled,
    onRemove: removeStep,
    ...dragHandlers,
  };

  return (
    <>
      <Sidebar
        variant="sidebar"
        className="bg-background overflow-x-hidden xm:h-[calc(100vh-4rem)] xm:top-16"
      >
        <SidebarHeader className="gap-3 px-3 pt-4 pb-2">
          <Logo className="xm:hidden" link="/dashboard" />
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Editor
            </p>
            <p className="text-sm font-semibold">Resume Outline</p>
          </div>
          <SidebarInput
            placeholder="Filter sections…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          {/* Enabled sections */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
              Sections ({enabledSteps.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {enabledSteps.map((step) => (
                  <SidebarStepItem
                    key={step.id}
                    step={step}
                    isActive={currentStep?.id === step.id}
                    isHeader={FIXED_STEP_IDS.includes(step.id as any)}
                    isEnabled={step.enabled !== false}
                    {...sharedItemProps}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Disabled sections — collapsible */}
          {disabledSteps.length > 0 && (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <button
                  type="button"
                  onClick={() => setDisabledOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Hidden ({disabledSteps.length})</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      disabledOpen && "rotate-180",
                    )}
                  />
                </button>
                {disabledOpen && (
                  <SidebarGroupContent className="mt-1">
                    <SidebarMenu>
                      {disabledSteps.map((step) => (
                        <SidebarStepItem
                          key={step.id}
                          step={step}
                          isActive={false}
                          isHeader={false}
                          isEnabled={false}
                          {...sharedItemProps}
                        />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarGroup>
            </>
          )}
        </SidebarContent>

        <SidebarFooter className="px-3 pb-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => addSectionModal.open()}
          >
            <Plus className="size-4" />
            Add Section
          </Button>
        </SidebarFooter>
      </Sidebar>

      <AddSectionModal modal={addSectionModal} onSubmit={addStep} />
    </>
  );
}
