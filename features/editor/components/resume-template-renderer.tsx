"use client";

import type { ResumeTemplate } from "./template-selector";
import { AuroraTemplate } from "./templates/aurora-template";
import { EmberTemplate } from "./templates/ember-template";
import { NovaTemplate } from "./templates/nova-template";
import { PrismTemplate } from "./templates/prism-template";
import { SageTemplate } from "./templates/sage-template";
import { SlateTemplate } from "./templates/slate-template";
import { VelvetTemplate } from "./templates/velvet-template";

// Re-export all public types so existing imports keep working
export type {
  ResumeAward,
  ResumeCertification,
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeLink,
  ResumeProject,
  ResumeSection,
  ResumeSkill,
  ResumeTemplateRendererProps,
} from "./templates/shared";

import type { ResumeData } from "./templates/shared";

export function ResumeTemplateRenderer({
  template,
  data,
}: {
  template: ResumeTemplate;
  data: ResumeData;
}) {
  if (template.id === "ember")
    return <EmberTemplate template={template} data={data} />;
  if (template.id === "sage")
    return <SageTemplate template={template} data={data} />;
  if (template.id === "nova")
    return <NovaTemplate template={template} data={data} />;
  if (template.id === "slate")
    return <SlateTemplate template={template} data={data} />;
  if (template.id === "prism")
    return <PrismTemplate template={template} data={data} />;
  if (template.id === "velvet")
    return <VelvetTemplate template={template} data={data} />;
  return <AuroraTemplate template={template} data={data} />;
}
