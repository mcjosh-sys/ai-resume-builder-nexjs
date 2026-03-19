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
import { Eye, EyeOff, GripVertical, Lock, Plus, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Step, useEditorContext } from "../contexts/editor-context";
import { FIXED_STEP_IDS } from "../providers/editor-provider";
import { AddSectionModal } from "./add-section-modal";

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
  const addSectionModal = useModal();

  // useEffect(() => {
  //   if (!currentStep && steps.length > 0) {
  //     setCurrentStep(steps[0].id);
  //   }
  // }, [currentStep, setCurrentStep, steps]);

  const filteredSteps = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) {
      return steps;
    }
    return steps.filter((step) => step.title.toLowerCase().includes(term));
  }, [filter, steps]);

  const { disabledSteps, enabledSteps } = useMemo(() => {
    return {
      disabledSteps: filteredSteps.filter((step) => step.enabled === false),
      enabledSteps: filteredSteps.filter((step) => step.enabled !== false),
    };
  }, [filteredSteps]);

  return (
    <>
      <Sidebar
        variant="sidebar"
        className="bg-background overflow-x-hidden  xm:h-[calc(100vh-5rem)] xm:top-18"
      >
        <SidebarHeader className="gap-4 px-3">
          {/* Logo */}
          <Logo className="xm:hidden" />
          <div className="space-y-1 md:pt-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Resume Sections
            </p>
            <p className="text-sm font-semibold">Editor Outline</p>
          </div>
          <SidebarInput
            placeholder="Filter sections..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Sections ({enabledSteps.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {enabledSteps.map((step) => {
                  const Icon = step.icon?.component;
                  const isActive = currentStep?.id === step.id;
                  const isHeader = FIXED_STEP_IDS.includes(step.id as any);
                  const isEnabled = step.enabled !== false;
                  return (
                    <SidebarMenuItem key={step.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        draggable={!isHeader}
                        onDragStart={(event) => {
                          if (isHeader) {
                            return;
                          }
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", step.id);
                          setDraggingStepId(step.id);
                        }}
                        onDragOver={(event) => {
                          if (isHeader) {
                            return;
                          }
                          event.preventDefault();
                          setDragOverStepId(step.id);
                        }}
                        onDrop={(event) => {
                          if (isHeader) {
                            return;
                          }
                          event.preventDefault();
                          const activeStepId = event.dataTransfer.getData(
                            "text/plain",
                          ) as Step["id"];
                          if (!activeStepId) {
                            return;
                          }
                          reorderStep(activeStepId, step.id);
                          setDragOverStepId(null);
                          setDraggingStepId(null);
                        }}
                        onDragEnd={() => {
                          setDragOverStepId(null);
                          setDraggingStepId(null);
                        }}
                        onClick={() => setCurrentStep(step.id)}
                        tooltip={step.title}
                        className={cn(
                          "h-auto items-start gap-3 py-2.5",
                          !isEnabled && "opacity-60",
                          draggingStepId === step.id && "opacity-60",
                          dragOverStepId === step.id &&
                            !isHeader &&
                            "border border-primary/40 bg-primary/5",
                          step.sidebarDesc && "items-start",
                        )}
                      >
                        {!isHeader && (
                          <GripVertical className="mt-0.5 size-3.5 cursor-grab text-muted-foreground/70" />
                        )}
                        {Icon ? (
                          <Icon className="mt-0.5 text-muted-foreground" />
                        ) : (
                          <Sparkles className="mt-0.5 text-muted-foreground" />
                        )}
                        <span className="flex flex-1 flex-col gap-0.5 text-left">
                          <span className="text-sm font-medium">
                            {step.title}
                          </span>
                          {step.sidebarDesc && (
                            <span className="text-xs text-muted-foreground">
                              {step.sidebarDesc}
                            </span>
                          )}
                        </span>
                        {isHeader ? (
                          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                            <Lock className="size-2.5" />
                            Fixed
                          </span>
                        ) : (
                          <div className="flex items-center gap-0.5">
                            <Button
                              asChild
                              variant="ghost"
                              size="icon-sm"
                              className="size-7"
                            >
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleStepEnabled(step.id);
                                }}
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.stopPropagation();
                                    toggleStepEnabled(step.id);
                                  }
                                }}
                                aria-label={
                                  isEnabled
                                    ? `Turn off ${step.title}`
                                    : `Turn on ${step.title}`
                                }
                              >
                                <EyeOff className="size-3.5 text-muted-foreground" />
                              </span>
                            </Button>
                            {step.id.startsWith("other-field-") && (
                              <Button
                                asChild
                                variant="ghost"
                                size="icon-sm"
                                className="size-7"
                              >
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    removeStep(step.id);
                                  }}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.stopPropagation();
                                      removeStep(step.id);
                                    }
                                  }}
                                  aria-label={`Remove ${step.title}`}
                                >
                                  <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                                </span>
                              </Button>
                            )}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>
              Disabled Sections ({disabledSteps.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {disabledSteps.map((step) => (
                  <SidebarMenuItem key={step.id}>
                    <SidebarMenuButton
                      isActive={false}
                      tooltip={step.title}
                      className={cn(
                        "h-auto items-start gap-3 py-2.5 opacity-60",
                        step.sidebarDesc && "items-start",
                      )}
                    >
                      {step.icon?.component ? (
                        <step.icon.component className="mt-0.5 text-muted-foreground" />
                      ) : (
                        <Sparkles className="mt-0.5 text-muted-foreground" />
                      )}
                      <span className="flex flex-1 flex-col gap-0.5 text-left">
                        <span className="text-sm font-medium">
                          {step.title}
                        </span>
                        {step.sidebarDesc && (
                          <span className="text-xs text-muted-foreground">
                            {step.sidebarDesc}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          className="size-7"
                        >
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleStepEnabled(step.id);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.stopPropagation();
                                toggleStepEnabled(step.id);
                              }
                            }}
                            aria-label={`Turn on ${step.title}`}
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                          </span>
                        </Button>
                        {step.id.startsWith("other-field-") && (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon-sm"
                            className="size-7"
                          >
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(event) => {
                                event.stopPropagation();
                                removeStep(step.id);
                              }}
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter" ||
                                  event.key === " "
                                ) {
                                  event.stopPropagation();
                                  removeStep(step.id);
                                }
                              }}
                              aria-label={`Remove ${step.title}`}
                            >
                              <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                            </span>
                          </Button>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-3 px-3 pb-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addSectionModal.open()}
          >
            <Plus />
            Add Section
          </Button>
        </SidebarFooter>
      </Sidebar>

      <AddSectionModal modal={addSectionModal} onSubmit={addStep} />
    </>
  );
}
