"use client";

import { useAppSearchParams } from "@/hooks/use-app-search-params";
import { useResume } from "@/hooks/use-resume";
import { BaseProps } from "@/types/component.types";
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "sonner";
import { MobileEditorMode } from "../components/editor-bottom-nav";
import { EditorContext } from "../contexts/editor-context";
import { useStepper } from "../hooks/use-stepper";
import { DEFAULT_STEPS, FIXED_STEP_IDS } from "../resource/steps";
import { AddStepInput } from "../types/editor-resume.type";

export default function EditorProvider({ children }: BaseProps) {
  const [activeMobileMode, setActiveMobileMode] =
    useState<MobileEditorMode>("edit");
  const [activeDesktopWorkspaceTab, setActiveDesktopWorkspaceTab] = useState<
    "edit" | "preview"
  >("edit");
  const {
    watchValues: { id: resumeId },
    setValues,
  } = useAppSearchParams({ watchKeys: ["id"] });
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(false);
  const resume = useResume({ resumeId, defaultSteps: DEFAULT_STEPS });
  const stepper = useStepper(resume.steps);

  useEffect(() => {
    setValues({ id: resume.currentResumeId });
  }, [resume.currentResumeId]);

  useEffect(() => {
    const status = resume.error?.data?.status;
    if ([404, 500].includes(status)) {
      toast.error(
        status === 404 ? "Resume not found" : "Could not load resume",
      );
    }
  }, [resume.error]);

  if (resume.isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center text-primary">
        <ImSpinner2 className="animate-spin" size={32} />
      </div>
    );
  }

  const addStep = (input: AddStepInput) => {
    const newSection = resume.addSection(input);
    stepper.setCurrent(newSection.id);
  };

  const toggleStepEnabled = (stepId: string) => {
    if (FIXED_STEP_IDS.includes(stepId as any)) return;

    const step = resume.steps.find((s) => s.id === stepId);
    if (!step) return;

    const enabledSteps = stepper.enabledSteps;

    if (step.enabled && stepper.current?.id === stepId) {
      if (enabledSteps.length > 1) {
        const index = enabledSteps.findIndex((s) => s.id === stepId);

        if (index < enabledSteps.length - 1) {
          stepper.next();
        } else {
          stepper.prev();
        }
      }
    }

    resume.setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const removeStep = (stepId: string) => {
    if (!stepId.startsWith("other-field-")) return;

    const enabledSteps = stepper.enabledSteps;

    if (stepper.current?.id === stepId) {
      if (enabledSteps.length > 1) {
        const index = enabledSteps.findIndex((s) => s.id === stepId);
        if (index < enabledSteps.length - 1) {
          stepper.next();
        } else {
          stepper.prev();
        }
      }
    }

    resume.removeSection(stepId);
  };

  const reorderStep = (activeStepId: string, overStepId: string) => {
    if (activeStepId === overStepId) {
      return;
    }
    if (
      FIXED_STEP_IDS.includes(activeStepId as any) ||
      FIXED_STEP_IDS.includes(overStepId as any)
    ) {
      return;
    }

    resume.setSteps((prev) => {
      const fromIndex = prev.findIndex((step) => step.id === activeStepId);
      const toIndex = prev.findIndex((step) => step.id === overStepId);

      if (fromIndex === -1 || toIndex === -1) {
        return prev;
      }

      const reordered = [...prev];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);

      return reordered;
    });
  };

  const setCurrentStep = (stepId: string) => {
    stepper.setCurrent(stepId);
    if (activeMobileMode === "preview") {
      setActiveMobileMode("edit");
    }
    if (activeDesktopWorkspaceTab === "preview") {
      setActiveDesktopWorkspaceTab("edit");
    }
  };

  return (
    <EditorContext.Provider
      value={{
        currentResumeId: resume.currentResumeId,
        resumeState: {
          isLoading: resume.isLoading,
          isSaving: resume.isSaving,
          error: resume.error,
          lastSaved: resume.lastSaved,
          hasUnsavedChanges: resume.hasUnsavedChanges,
          currentResumeId: resume.currentResumeId,
          save: resume.save,
        },
        updateSection: resume.updateSection,
        stepper: {
          steps: resume.steps,
          ...stepper,
          setCurrent: setCurrentStep,
          addStep,
          toggleStepEnabled,
          reorderStep,
          removeStep,
        },
        editorState: {
          activeMobileMode,
          activeDesktopWorkspaceTab,
          selectedTemplate: resume.template,
          colorHex: resume.colorHex,
          mobileSectionsOpen,
          setActiveMobileMode,
          setActiveDesktopWorkspaceTab,
          setSelectedTemplate: resume.setTemplate,
          setColorHex: resume.setColorHex,
          setMobileSectionsOpen,
        },
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
