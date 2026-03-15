"use client";

import { useResume } from "@/hooks/use-resume";
import { BaseProps } from "@/types/component.types";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { MobileEditorMode } from "../components/editor-bottom-nav";
import { AddStepInput, EditorContext, Step } from "../contexts/editor-context";
import { useStepper } from "../hooks/use-stepper";
import { ICON_MAP } from "../resource/icons";

export const FIXED_STEP_IDS = ["header", "summary"] as const;

export const DEFAULT_STEPS: Step[] = [
  {
    id: "header",
    title: "Header",
    icon: ICON_MAP.contact,
    sidebarDesc: "Name, role, contact, summary",
    enabled: true,
  },
  {
    id: "summary",
    title: "Summary",
    icon: ICON_MAP.user,
    sidebarDesc: "Name, role, contact, summary",
    enabled: true,
  },
  {
    id: "experience",
    title: "Experience",
    icon: ICON_MAP.briefcase,
    sidebarDesc: "Work history",
    enabled: true,
  },
  {
    id: "education",
    title: "Education",
    icon: ICON_MAP.book,
    sidebarDesc: "Degrees, schools",
    enabled: true,
  },
  {
    id: "skills",
    title: "Skills",
    sidebarDesc: "Skills",
    icon: ICON_MAP.code,
    enabled: true,
  },
  {
    id: "projects",
    title: "Projects",
    icon: ICON_MAP.folder,
    sidebarDesc: "Personal & professional projects",
    enabled: true,
  },
  {
    id: "certifications",
    title: "Certifications",
    icon: ICON_MAP.award,
    sidebarDesc: "Licenses & credentials",
    enabled: true,
  },
  {
    id: "awards",
    title: "Awards",
    icon: ICON_MAP.star,
    sidebarDesc: "Achievements & recognition",
    enabled: true,
  },
] as const;

export default function EditorProvider({ children }: BaseProps) {
  const [activeMobileMode, setActiveMobileMode] =
    useState<MobileEditorMode>("edit");
  const [activeDesktopWorkspaceTab, setActiveDesktopWorkspaceTab] = useState<
    "edit" | "preview"
  >("edit");
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(false);
  const resume = useResume({ defaultSteps: DEFAULT_STEPS });
  const stepper = useStepper(resume.steps);

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
        resume: {
          isLoading: resume.isLoading,
          isSaving: resume.isSaving,
          error: resume.error,
          lastSaved: resume.lastSaved,
          hasUnsavedChanges: resume.hasUnsavedChanges,
          currentResumeId: resume.currentResumeId,
        },
        updateSection: resume.updateSection,
        stepper: {
          steps: resume.steps,
          ...stepper,
          setCurrent: setCurrentStep,
          addStep,
          toggleStepEnabled,
          reorderStep,
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
