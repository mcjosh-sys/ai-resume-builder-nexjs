"use client";

import { useDimensions } from "@/hooks/use-dimensions";
import type { Step } from "../contexts/editor-context";
import { useEditorContext } from "../contexts/editor-context";
import {
  ResumeTemplateRenderer,
  type ResumeData,
} from "./resume-template-renderer";
import type { ResumeTemplate } from "./template-selector";

type ResumePreviewProps = {
  template: ResumeTemplate;
};

/** Convert editor context steps into the flat ResumeData the templates consume. */
function stepsToResumeData(steps: Step[]): ResumeData {
  const enabledSteps = steps.filter((s) => s.enabled !== false);

  // Gather section IDs in user-defined order (excluding header – it's always the document header)
  const sections: ResumeData["sections"] = enabledSteps
    .filter((s) => s.id !== "header")
    .map((s) => ({ id: s.id, title: s.title }));

  const headerStep = steps.find((s) => s.id === "header");
  const summaryStep = steps.find((s) => s.id === "summary");
  const experienceStep = steps.find((s) => s.id === "experience");
  const educationStep = steps.find((s) => s.id === "education");
  const skillsStep = steps.find((s) => s.id === "skills");
  const projectsStep = steps.find((s) => s.id === "projects");
  const certificationsStep = steps.find((s) => s.id === "certifications");
  const awardsStep = steps.find((s) => s.id === "awards");

  return {
    // header
    photoUrl: headerStep?.data?.photoUrl ?? "/images/template-avatar.svg",
    firstName: headerStep?.data?.firstName,
    lastName: headerStep?.data?.lastName,
    jobTitle: headerStep?.data?.jobTitle,
    email: headerStep?.data?.email,
    phone: headerStep?.data?.phone,
    city: headerStep?.data?.city,
    country: headerStep?.data?.country,
    links: (headerStep?.data?.links ?? []).map((l: any) => ({
      name: l.name ?? "",
      url: l.url ?? "",
    })),

    // summary
    summary: summaryStep?.data?.summary ?? headerStep?.data?.summary,

    // sections
    experience: (experienceStep?.data?.workExperiences ?? []).map((e: any) => ({
      position: e.position,
      company: e.company,
      city: e.city,
      country: e.country,
      startDate: e.startDate,
      endDate: e.endDate,
      isCurrent: e.isCurrent,
      description: e.description,
    })),

    education: (educationStep?.data?.educations ?? []).map((e: any) => ({
      degree: e.degree,
      school: e.school,
      city: e.city,
      country: e.country,
      startDate: e.startDate,
      endDate: e.endDate,
      isCurrent: e.isCurrent,
      description: e.description,
    })),

    skills: (skillsStep?.data?.skills ?? []).map((s: any) => ({
      name: s.name,
      level: s.level,
      category: s.category,
    })),

    projects: (projectsStep?.data?.projects ?? []).map((p: any) => ({
      title: p.title,
      description: p.description,
      url: p.url,
      startDate: p.startDate,
      endDate: p.endDate,
    })),

    certifications: (certificationsStep?.data?.certifications ?? []).map(
      (c: any) => ({
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        credentialUrl: c.credentialUrl,
      }),
    ),

    awards: (awardsStep?.data?.awards ?? []).map((a: any) => ({
      title: a.title,
      issuer: a.issuer,
      date: a.date,
      description: a.description,
    })),

    sections,
  };
}

export function ResumePreview({ template }: ResumePreviewProps) {
  const { targetRef, dimensions } = useDimensions();
  const { stepper, editorState } = useEditorContext();
  const data = stepsToResumeData(stepper.steps);
  const { colorHex } = editorState;

  // Extract the base tailwind color name from the template accent (e.g. "bg-sky-500" -> "sky-500", "bg-sky-500" -> "sky")
  const accentColorMatch = template.accent.match(/bg-([a-z]+)-(\d+)/);
  const baseColor = accentColorMatch ? accentColorMatch[1] : null;
  const colorWeight = accentColorMatch ? accentColorMatch[2] : null;

  return (
    <div
      ref={targetRef}
      className="bg-white text-black h-fit w-full aspect-210/297 relative"
    >
      {/* Dynamically inject styles to override the template's Tailwind color if a custom hex is set */}
      {colorHex && colorHex !== "default" && baseColor && colorWeight && (
        <style dangerouslySetInnerHTML={{
          __html: `
            .resume-preview-container .bg-${baseColor}-${colorWeight} {
              background-color: ${colorHex} !important;
            }
            .resume-preview-container .text-${baseColor}-${colorWeight} {
              color: ${colorHex} !important;
            }
            .resume-preview-container .border-${baseColor}-${colorWeight} {
              border-color: ${colorHex} !important;
            }
          `
        }} />
      )}
      <div
        style={{
          zoom: (1 / 794) * dimensions.width,
        }}
        className="p-6 resume-preview-container h-full w-full"
      >
        <ResumeTemplateRenderer template={template} data={data} />
      </div>
    </div>
  );
}
