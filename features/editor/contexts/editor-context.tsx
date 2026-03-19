"use client";
import { AppError } from "@/lib/errors";
import { Prisma } from "@/lib/generated/prisma";
import { Prettify, WithoutResume } from "@/types";
import { ComponentType, createContext, useContext } from "react";
import { MobileEditorMode } from "../components/editor-bottom-nav";

export type Step = (
  | {
      id: "header";
      data?: {
        photo?: File | null;
        photoUrl?: string | undefined;
        summary?: string | undefined;
        jobTitle?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        city?: string | undefined;
        country?: string | undefined;
        phone?: string | undefined;
        email?: string | undefined;
        links?: Prettify<WithoutResume<Prisma.LinkCreateInput>>[];
      };
    }
  | {
      id: "summary";
      data?: {
        summary?: string | undefined;
      };
    }
  | {
      id: "education";
      data?: {
        educations: Prettify<WithoutResume<Prisma.EducationCreateInput>>[];
      };
    }
  | {
      id: "experience";
      data?: {
        workExperiences: Prettify<
          WithoutResume<Prisma.WorkExperienceCreateInput>
        >[];
      };
    }
  | {
      id: "skills";
      data?: {
        skills: Prettify<WithoutResume<Prisma.SkillCreateInput>>[];
      };
    }
  | {
      id: "projects";
      data?: {
        projects: Prettify<WithoutResume<Prisma.ProjectCreateInput>>[];
      };
    }
  | {
      id: "certifications";
      data?: {
        certifications: Prettify<
          WithoutResume<Prisma.CertificationCreateInput>
        >[];
      };
    }
  | {
      id: "awards";
      data?: {
        awards: Prettify<WithoutResume<Prisma.AwardCreateInput>>[];
      };
    }
  | {
      id: `other-field-${string}`;
      data?: Prettify<WithoutResume<Prisma.OtherFieldCreateInput>>;
    }
) & {
  title: string;
  icon?: {
    id: string;
    component: ComponentType<{ size?: number; className?: string }>;
  };
  sidebarDesc?: string;
  desc?: string;
  enabled?: boolean;
};

type StepById<ID extends Step["id"] | "other-fields"> =
  ID extends "other-fields"
    ? OtherFieldStep
    : Extract<Step, { id: Exclude<ID, "other-fields"> }>;
export type OtherFieldStep = Extract<Step, { id: `other-field-${string}` }>;
export type OtherFieldData = NonNullable<OtherFieldStep["data"]>;

export type FormCompProps<ID extends Step["id"] | "other-fields"> = {
  data: NonNullable<StepById<ID>["data"]>;
  onChange: (step: Pick<StepById<ID>, "id" | "data">) => void;
};

export type AddStepInput = {
  title: string;
  icon?: Step["icon"];
  sidebarDesc?: string;
  desc?: string;
};

export type EditorResume = {
  id?: string;
  steps: Step[];
  template: string;
  colorHex: string;
};

export type EditorContext = {
  resumeState: {
    isLoading: boolean;
    isSaving: boolean;
    error: AppError | null;
    lastSaved?: Date | null;
    hasUnsavedChanges: boolean;
    currentResumeId?: string | null;
  };
  updateSection: (step: Pick<Step, "id" | "data">) => void;
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
  };
};

export type HeaderSection = {
  id: "header";
  data: {
    photo?: string | undefined;
    summary?: string | undefined;
    jobTitle?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    city?: string | undefined;
    country?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    links?: Prettify<WithoutResume<Prisma.LinkCreateInput>>[];
  };
  // component: ComponentType<{ data: SummarySection["data"] }>;
};

export type EducationSection = {
  id: "education";
  data: {
    educations: Prettify<WithoutResume<Prisma.EducationCreateInput>>[];
  };
  // component: ComponentType<{ data: EducationSection["data"] }>;
};

export type WorkExperienceSection = {
  id: "experience";
  data: {
    workExperiences: Prettify<
      WithoutResume<Prisma.WorkExperienceCreateInput>
    >[];
  };
  // component: ComponentType<{ data: WorkExperienceSection["data"] }>;
};

export type SkillSection = {
  id: "skills";
  data: {
    skills: Prettify<WithoutResume<Prisma.SkillCreateInput>>[];
  };
  // component: ComponentType<{ data: SkillSection["data"] }>;
};

export type OtherFieldSection = {
  id: "other-fields";
  data: {
    otherFields: Prettify<WithoutResume<Prisma.OtherFieldCreateInput>>[];
  };
  // component: ComponentType<{ data: OtherFieldSection["data"] }>;
};

export type ProjectSection = {
  id: "projects";
  data: {
    projects: Prettify<WithoutResume<Prisma.ProjectCreateInput>>[];
  };
};

export type CertificationSection = {
  id: "certifications";
  data: {
    certifications: Prettify<WithoutResume<Prisma.CertificationCreateInput>>[];
  };
};

export type AwardSection = {
  id: "awards";
  data: {
    awards: Prettify<WithoutResume<Prisma.AwardCreateInput>>[];
  };
};

export type ResumeSection =
  | HeaderSection
  | EducationSection
  | WorkExperienceSection
  | SkillSection
  | OtherFieldSection
  | ProjectSection
  | CertificationSection
  | AwardSection;

export const EditorContext = createContext<EditorContext>({
  updateSection: () => {},
  resumeState: {
    isLoading: false,
    isSaving: false,
    error: null,
    lastSaved: null,
    hasUnsavedChanges: false,
    currentResumeId: null,
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
  },
});

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
