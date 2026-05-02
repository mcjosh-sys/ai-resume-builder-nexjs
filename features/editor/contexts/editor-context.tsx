"use client";
import { ResumeMetadata } from "@/hooks/use-resume";
import { AppError } from "@/lib/errors";
import { createContext, useContext } from "react";
import { MobileEditorMode } from "../components/editor-bottom-nav";
import { AddStepInput, Step } from "../types/editor-resume.type";

export type EditorContext = {
  currentResumeId?: string | null;
  resumeMetadata: ResumeMetadata;
  resumeState: {
    isLoading: boolean;
    isSaving: boolean;
    error: AppError | null;
    lastSaved?: Date | null;
    hasUnsavedChanges: boolean;
    currentResumeId?: string | null;
    save: () => Promise<void>;
  };
  updateSection: (step: Pick<Step, "id" | "data">) => void;
  setSteps: (updater: Step[] | ((prev: Step[]) => Step[])) => void;
  stepper: {
    steps: Step[];
    enabledSteps: Step[];
    current: Step | null;
    setCurrent: (stepId: string) => void;
    hasNext: boolean;
    hasPrev: boolean;
    next: () => void;
    prev: () => void;
    addStep: (step: AddStepInput) => void;
    toggleStepEnabled: (stepId: Step["id"]) => void;
    reorderStep: (activeStepId: Step["id"], overStepId: Step["id"]) => void;
    removeStep: (stepId: string) => void;
  };
  editorState: {
    activeMobileMode: MobileEditorMode;
    activeDesktopWorkspaceTab: "edit" | "preview";
    selectedTemplate: string;
    colorHex: string;
    mobileSectionsOpen: boolean;
    setActiveMobileMode: (mode: MobileEditorMode) => void;
    setActiveDesktopWorkspaceTab: (tab: "edit" | "preview") => void;
    setSelectedTemplate: (template: string) => void;
    setColorHex: (colorHex: string) => void;
    setMobileSectionsOpen: (open: boolean) => void;
    updateResumeMetadata: (data: Partial<ResumeMetadata>) => void;
  };
};

export const EditorContext = createContext<EditorContext>({
  updateSection: () => {},
  setSteps: () => {},
  resumeState: {
    isLoading: false,
    isSaving: false,
    error: null,
    lastSaved: null,
    hasUnsavedChanges: false,
    currentResumeId: null,
    save: async () => {},
  },
  stepper: {
    steps: [],
    enabledSteps: [],
    current: null,
    setCurrent: () => {},
    hasNext: false,
    hasPrev: false,
    next: () => {},
    prev: () => {},
    addStep: () => {},
    toggleStepEnabled: () => {},
    reorderStep: () => {},
    removeStep: () => {},
  },
  editorState: {
    activeMobileMode: "edit",
    activeDesktopWorkspaceTab: "edit",
    selectedTemplate: "aurora",
    colorHex: "default",
    mobileSectionsOpen: false,
    setActiveMobileMode: () => {},
    setActiveDesktopWorkspaceTab: () => {},
    setSelectedTemplate: () => {},
    setColorHex: () => {},
    setMobileSectionsOpen: () => {},
    updateResumeMetadata: () => {},
  },
  resumeMetadata: {
    jobDescription: "",
    atsScore: null,
    colorHex: "default",
    template: "aurora",
  },
});

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
