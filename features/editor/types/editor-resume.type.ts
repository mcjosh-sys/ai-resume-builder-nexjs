import { Prisma } from "@/lib/generated/prisma";
import { Prettify, WithoutResume } from "@/types";
import { ComponentType } from "react";

export type Step = (
  | {
    id: "header";
    data?: {
      photo?: File | null;
      photoUrl?: string
      summary?: string
      jobTitle?: string[];
      firstName?: string
      lastName?: string
      city?: string
      country?: string
      phone?: string
      email?: string
      links?: Prettify<WithoutResume<Prisma.LinkCreateInput>>[];
    };
  }
  | {
    id: "summary";
    data?: {
      summary?: string;
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
    id: "languages";
    data?: {
      languages: Prettify<WithoutResume<Prisma.LanguageCreateInput>>[];
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
  metadata: {
    template: string;
    colorHex: string;
    jobDescription: string;
    atsScore: number | null;
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
};

export type EducationSection = {
  id: "education";
  data: {
    educations: Prettify<WithoutResume<Prisma.EducationCreateInput>>[];
  };
};

export type WorkExperienceSection = {
  id: "experience";
  data: {
    workExperiences: Prettify<
      WithoutResume<Prisma.WorkExperienceCreateInput>
    >[];
  };
};

export type SkillSection = {
  id: "skills";
  data: {
    skills: Prettify<WithoutResume<Prisma.SkillCreateInput>>[];
  };
};

export type OtherFieldSection = {
  id: "other-fields";
  data: {
    otherFields: Prettify<WithoutResume<Prisma.OtherFieldCreateInput>>[];
  };
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

export type LanguageSection = {
  id: "languages";
  data: {
    languages: Prettify<WithoutResume<Prisma.LanguageCreateInput>>[];
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
  | AwardSection
  | LanguageSection;
