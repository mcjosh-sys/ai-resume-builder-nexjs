import type { ResumeTemplate } from "../resource/templates";
import { AuroraTemplate } from "./templates/aurora-template";
import { AxisTemplate } from "./templates/axis-template";
import { BannerTemplate } from "./templates/banner-template";
import { CanvasTemplate } from "./templates/canvas-template";
import { EmberTemplate } from "./templates/ember-template";
import { FocalTemplate } from "./templates/focal-template";
import { LedgerTemplate } from "./templates/ledger-template";
import { NovaTemplate } from "./templates/nova-template";
import { PrismTemplate } from "./templates/prism-template";
import { SageTemplate } from "./templates/sage-template";
import { SlateTemplate } from "./templates/slate-template";
import { VelvetTemplate } from "./templates/velvet-template";
import { ChronicleTemplate } from "./templates/chronicle-template";
import { SummitTemplate } from "./templates/summit-template";
import { VanguardTemplate } from "./templates/vanguard-template";

// Re-export all public types so existing imports keep working
export type {
  ResumeAward,
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
  ResumeLink,
  ResumeProject,
  ResumeSection,
  ResumeSkill,
  ResumeTemplateRendererProps,
  TemplateResume,
} from "./templates/shared";

import { Case, Default, Switch } from "@/components/helpers/app-switch";
import type { TemplateResume } from "./templates/shared";

export function ResumeTemplateRenderer({
  template,
  data,
  colorHex,
}: {
  template: ResumeTemplate;
  data: TemplateResume;
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
        <Case value="axis">
          <AxisTemplate template={template} data={data} />
        </Case>
        <Case value="banner">
          <BannerTemplate template={template} data={data} />
        </Case>
        <Case value="canvas">
          <CanvasTemplate template={template} data={data} />
        </Case>
        <Case value="focal">
          <FocalTemplate template={template} data={data} />
        </Case>
        <Case value="ledger">
          <LedgerTemplate template={template} data={data} />
        </Case>
        <Case value="chronicle">
          <ChronicleTemplate template={template} data={data} />
        </Case>
        <Case value="summit">
          <SummitTemplate template={template} data={data} />
        </Case>
        <Case value="vanguard">
          <VanguardTemplate template={template} data={data} />
        </Case>
        <Default>
          <AuroraTemplate template={template} data={data} />
        </Default>
      </Switch>
    </>
  );
}
