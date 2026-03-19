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

import { Case, Default, Switch } from "@/components/helpers/app-switch";
import type { ResumeData } from "./templates/shared";

export function ResumeTemplateRenderer({
  template,
  data,
  colorHex,
}: {
  template: ResumeTemplate;
  data: ResumeData;
  colorHex: string;
}) {
  const accentColorMatch = template.accent.match(/bg-([a-z]+)-(\d+)/);
  const baseColor = accentColorMatch ? accentColorMatch[1] : null;
  const colorWeight = accentColorMatch ? accentColorMatch[2] : null;

  return (
    <>
      {colorHex && colorHex !== "default" && baseColor && colorWeight && (
        <style
          dangerouslySetInnerHTML={{
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
          `,
          }}
        />
      )}

      <Switch expression={template.id}>
        <Case value="ember">
          <EmberTemplate template={template} data={data} />
        </Case>
        <Case value="sage">
          <SageTemplate template={template} data={data} />
        </Case>
        <Case value="nova">
          <NovaTemplate template={template} data={data} />
        </Case>
        <Case value="slate">
          <SlateTemplate template={template} data={data} />
        </Case>
        <Case value="prism">
          <PrismTemplate template={template} data={data} />
        </Case>
        <Case value="velvet">
          <VelvetTemplate template={template} data={data} />
        </Case>
        <Default>
          <AuroraTemplate template={template} data={data} />
        </Default>
      </Switch>
    </>
  );
}
