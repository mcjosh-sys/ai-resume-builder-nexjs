"use client";

import { useDimensions } from "@/hooks/use-dimensions";
import { useEditorContext } from "../contexts/editor-context";
import { stepsToTemplateResume } from "../helpers/resume-helpers";
import {
  ResumeTemplateRenderer,
  type TemplateResume,
} from "./resume-template-renderer";
import type { ResumeTemplate } from "../resource/templates";

type ResumePreviewProps = {
  template: ResumeTemplate;
  overrideData?: Partial<TemplateResume>;
  forceColor?: string;
};

function ResumePreviewWithContext({
  template,
  targetRef,
  dimensions,
}: {
  template: ResumeTemplate;
  targetRef: any;
  dimensions: any;
}) {
  const { stepper, editorState } = useEditorContext();
  const data = stepsToTemplateResume(stepper.steps);
  const colorHex = editorState.colorHex;

  return (
    <ResumePreviewInner
      template={template}
      data={data}
      colorHex={colorHex}
      targetRef={targetRef}
      dimensions={dimensions}
    />
  );
}

function ResumePreviewInner({
  template,
  data,
  colorHex,
  targetRef,
  dimensions,
}: {
  template: ResumeTemplate;
  data: TemplateResume;
  colorHex: string;
  targetRef: any;
  dimensions: any;
}) {
  return (
    <div
      ref={targetRef}
      className="bg-white text-black h-fit w-full aspect-210/297 relative"
    >
      <div
        style={{ zoom: (1 / 794) * dimensions.width }}
        className="p-6 resume-preview-container h-full w-full"
      >
        <ResumeTemplateRenderer
          template={template}
          data={data}
          colorHex={colorHex}
        />
      </div>
    </div>
  );
}

export function ResumePreview({
  template,
  overrideData,
  forceColor,
}: ResumePreviewProps) {
  const { targetRef, dimensions } = useDimensions();

  if (overrideData) {
    const data = {
      sections: [],
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      awards: [],
      otherFields: [],
      ...overrideData,
    } as TemplateResume;

    return (
      <ResumePreviewInner
        template={template}
        data={data}
        colorHex={forceColor ?? "default"}
        targetRef={targetRef}
        dimensions={dimensions}
      />
    );
  }

  return (
    <ResumePreviewWithContext
      template={template}
      targetRef={targetRef}
      dimensions={dimensions}
    />
  );
}
