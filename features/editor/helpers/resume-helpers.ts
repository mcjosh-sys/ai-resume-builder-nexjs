import { RawResume } from "@/features/resume/actions/resume.actions";
import { $Enums, Prisma } from "@/lib/generated/prisma";
import { parseDateInput } from "@/lib/utils";
import { WithoutResume } from "@/types";
import { createId } from "@paralleldrive/cuid2";
import { ResumeSection, Step } from "../contexts/editor-context";
import { DEFAULT_STEPS } from "../providers/editor-provider";
import { getIconById } from "../resource/icons";

const SectionTypeMap: Record<string, $Enums.SectionType> = {
  education: "EDUCATION",
  experience: "WORK_EXPERIENCE",
  skills: "SKILLS",
  header: "HEADER",
  projects: "PROJECT",
  certifications: "CERTIFICATION",
  awards: "AWARD",
  summary: "SUMMARY",
};

export function parseResume(resume: RawResume): {
  steps: Step[];
} {
  const steps = new Map<string, Step>();
  const addedStepIds = new Set<string>();

  // --- Summary (always first)
  const headerStep = DEFAULT_STEPS.find((s) => s.id === "header")!;
  const summaryStep = DEFAULT_STEPS.find((s) => s.id === "summary")!;
  summaryStep.data = {
    summary: resume?.summary ?? "",
  };
  headerStep.data = {
    jobTitle: resume?.jobTitle ?? "",
    firstName: resume?.firstName ?? "",
    lastName: resume?.lastName ?? "",
    city: resume?.city ?? "",
    country: resume?.country ?? "",
    photoUrl: resume?.photoUrl ?? "",
    phone: resume?.phone ?? "",
    email: resume?.email ?? "",
    links: (resume?.links as any) ?? [],
  };

  steps.set(headerStep.id, headerStep);
  addedStepIds.add(headerStep.id);

  steps.set(summaryStep.id, summaryStep);
  addedStepIds.add(summaryStep.id);

  const sortedSections = [...(resume?.sections ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  for (const section of sortedSections) {
    let step: Step | null = null;

    switch (section.sectionType) {
      case "EDUCATION":
        step = DEFAULT_STEPS.find((s) => s.id === "education")!;
        step.data = {
          educations: (resume?.educations ?? []).map((edu) => ({
            ...edu,
            startDate: parseDateInput(edu.startDate),
            endDate: parseDateInput(edu.endDate),
          })),
        };
        break;

      case "WORK_EXPERIENCE":
        step = DEFAULT_STEPS.find((s) => s.id === "experience")!;
        step.data = {
          workExperiences: (resume?.workExperiences ?? []).map((exp) => ({
            ...exp,
            startDate: parseDateInput(exp.startDate),
            endDate: parseDateInput(exp.endDate),
          })),
        };
        break;

      case "SKILLS":
        step = DEFAULT_STEPS.find((s) => s.id === "skills")!;
        step.data = { skills: (resume?.skills as any) ?? [] };
        break;

      case "PROJECT":
        step = DEFAULT_STEPS.find((s) => s.id === "projects")!;
        step.data = {
          projects: (resume?.projects ?? []).map((p) => ({
            ...p,
            startDate: parseDateInput(p.startDate),
            endDate: parseDateInput(p.endDate),
          })),
        };
        break;

      case "CERTIFICATION":
        step = DEFAULT_STEPS.find((s) => s.id === "certifications")!;
        step.data = {
          certifications: (resume?.certifications ?? []).map((c) => ({
            ...c,
            issueDate: parseDateInput(c.issueDate),
            expiryDate: parseDateInput(c.expiryDate),
          })),
        };
        break;

      case "AWARD":
        step = DEFAULT_STEPS.find((s) => s.id === "awards")!;
        step.data = {
          awards: (resume?.awards ?? []).map((a) => ({
            ...a,
            date: parseDateInput(a.date),
          })),
        };
        break;

      case "OTHER_FIELD":
        if (!section.otherFieldId) break;

        const otherStepId = `other-field-${section.otherFieldId}` as const;
        const data =
          resume?.otherFields?.find(
            (f) => (f as { id?: string }).id === section.otherFieldId,
          ) ?? {};
        step = {
          id: otherStepId,
          title: section.title ?? "",
          icon: getIconById(section.icon),
          sidebarDesc: section.sidebarDescription ?? "custom field",
          desc: section.description ?? "custom field",
          enabled: section.enabled ?? true,
          data: {
            ...data,
            startDate: parseDateInput(data.startDate),
            endDate: parseDateInput(data.endDate),
          },
        };
        break;
    }
    if (step) {
      if (!isOtherFieldStep(step)) {
        step.enabled = !!section.enabled;
        section.title && (step.title = section.title);
        section.sidebarDescription &&
          (step.sidebarDesc = section.sidebarDescription);
        section.description && (step.desc = section.description);
        section.icon && (step.icon = getIconById(section.icon));
      }
      steps.set(step.id, step);
      addedStepIds.add(step.id);
    }
  }

  for (const step of DEFAULT_STEPS) {
    if (!addedStepIds.has(step.id)) {
      steps.set(step.id, step);
    }
  }

  return { steps: Array.from(steps.values()) };
}

function findStepAndAdd(steps: Step[], id: Step["id"]) {
  const step = DEFAULT_STEPS.find((s) => s.id === id);
  if (step) {
    steps.push(step);
  }
}

function addOtherStep(steps: Step[], section: Prisma.SectionCreateManyInput) {
  steps.push(createOtherStep(section));
}

function createOtherStep(section: Prisma.SectionCreateManyInput): Step {
  return {
    id: `other-field-${section.id ?? createId()}`,
    title: section.title,
    icon: getIconById(section.icon),
    sidebarDesc: section.sidebarDescription ?? "custom field",
    desc: section.description ?? "custom field",
    enabled: !!section.enabled,
  };
}

export function compileResume(steps: Step[]) {
  const sectionData: WithoutResume<Prisma.SectionCreateManyInput>[] = [];
  const otherFields: WithoutResume<Prisma.OtherFieldCreateInput>[] = [];
  const resumeData: Partial<RawResume> = {};

  let order = 0;
  for (const step of steps) {
    const isOtherField = step.id.startsWith("other-field-");
    const otherFieldId = isOtherField
      ? step.id.replace("other-field-", "")
      : null;

    sectionData.push({
      sectionType: isOtherField ? "OTHER_FIELD" : SectionTypeMap[step.id],
      otherFieldId: isOtherField ? otherFieldId : undefined,
      title: step.title,
      description: step.desc,
      sidebarDescription: step.sidebarDesc,
      icon: step.icon?.id,
      enabled: step.enabled,
      order: order++,
    });
    switch (step.id) {
      case "header":
        resumeData.jobTitle = step.data?.jobTitle;
        resumeData.firstName = step.data?.firstName;
        resumeData.lastName = step.data?.lastName;
        resumeData.city = step.data?.city;
        resumeData.country = step.data?.country;
        resumeData.phone = step.data?.phone;
        resumeData.email = step.data?.email;
        resumeData.links = step.data?.links ?? [];
        resumeData.photo = step.data?.photo;
        break;
      case "summary":
        resumeData.summary = step.data?.summary;
        break;
      case "education":
        resumeData.educations = step.data?.educations.map(
          ({ resumeId, id, ...education }: any) => ({
            ...education,
            startDate: education.startDate
              ? new Date(education.startDate)
              : undefined,
            endDate: education.endDate
              ? new Date(education.endDate)
              : undefined,
          }),
        );
        break;
      case "experience":
        resumeData.workExperiences = step.data?.workExperiences.map(
          ({ resumeId, id, ...experience }: any) => ({
            ...experience,
            startDate: experience.startDate
              ? new Date(experience.startDate)
              : undefined,
            endDate: experience.endDate
              ? new Date(experience.endDate)
              : undefined,
          }),
        );
        break;
      case "skills":
        resumeData.skills = step.data?.skills.map(
          ({ resumeId, id, ...skill }: any) => ({
            ...skill,
          }),
        );
        break;
      case "projects":
        resumeData.projects = step.data?.projects.map(
          ({ resumeId, id, ...project }: any) => ({
            ...project,
            startDate: project.startDate
              ? new Date(project.startDate)
              : undefined,
            endDate: project.endDate ? new Date(project.endDate) : undefined,
          }),
        );
        break;
      case "certifications":
        resumeData.certifications = step.data?.certifications.map(
          ({ resumeId, id, ...cert }: any) => ({
            ...cert,
            issueDate: cert.issueDate ? new Date(cert.issueDate) : undefined,
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
          }),
        );
        break;
      case "awards":
        resumeData.awards = step.data?.awards.map(
          ({ resumeId, id, ...award }: any) => ({
            ...award,
            date: award.date ? new Date(award.date) : undefined,
          }),
        );
        break;
      default:
        if (isOtherField) {
          const { resumeId, id, ...otherFieldData } = step.data as any;
          otherFields.push({
            ...otherFieldData,
            id: otherFieldId!,
          });
        }
        break;
    }
  }

  resumeData.sections = sectionData;
  resumeData.otherFields = otherFields;

  return resumeData;
}

export type FlattenedResume =
  | {
      sectionType: "header";
      data: Extract<ResumeSection, { id: "header" }>["data"];
    }
  | {
      sectionType: "education";
      data: Extract<ResumeSection, { id: "education" }>["data"];
    }
  | {
      sectionType: "experience";
      data: Extract<ResumeSection, { id: "experience" }>["data"];
    }
  | {
      sectionType: "skills";
      data: Extract<ResumeSection, { id: "skills" }>["data"];
    }
  | {
      sectionType: "other-fields";
      data: Extract<
        ResumeSection,
        { id: "other-fields" }
      >["data"]["otherFields"][number];
    };

export function flattenResume(
  resumeSections: ResumeSection[],
  steps: Step[],
): FlattenedResume[] {
  const flattened: FlattenedResume[] = [];
  for (const step of steps) {
    switch (step.id) {
      case "header":
        flattened.push({
          sectionType: "header",
          data: resumeSections.find((section) => section.id === "header")
            ?.data!,
        });
        break;
      case "education":
        flattened.push({
          sectionType: "education",
          data: resumeSections.find((section) => section.id === "education")
            ?.data!,
        });
        break;
      case "experience":
        flattened.push({
          sectionType: "experience",
          data: resumeSections.find((section) => section.id === "experience")
            ?.data!,
        });
        break;
      case "skills":
        flattened.push({
          sectionType: "skills",
          data: resumeSections.find((section) => section.id === "skills")
            ?.data!,
        });
        break;
      default:
        if (isOtherFieldStep(step)) {
          flattened.push({
            sectionType: "other-fields",
            data: resumeSections
              .find((section) => section.id === "other-fields")
              ?.data.otherFields.find(
                (otherField) =>
                  otherField.id === step.id.replace("other-field-", ""),
              )!,
          });
        }
        break;
    }
  }
  return flattened;
}

function isOtherFieldStep(
  step: Step,
): step is Step & { id: `other-field-${string}` } {
  return step.id.startsWith("other-field-");
}
