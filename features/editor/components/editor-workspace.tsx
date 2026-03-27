"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEditorContext } from "@/features/editor/contexts/editor-context";
import { ArrowLeft, ArrowRight, Palette, User } from "lucide-react";
import { useMemo } from "react";
import { RESUME_TEMPLATES } from "../resource/templates";
import AwardsForm from "./forms/awards-form";
import CertificationsForm from "./forms/certifications-form";
import CustomSectionForm from "./forms/custom-section-form";
import EducationForm from "./forms/education-form";
import { HeaderForm } from "./forms/header-form";
import ProjectsForm from "./forms/projects-form";
import SkillsForm from "./forms/skills-form";
import SummaryForm from "./forms/summary-form";
import WorkExperienceForm from "./forms/work-experience-form";
import { ResumePreview } from "./resume-preview";
import { TemplateSelector2 } from "./template-selector-2";

type EditorWorkspaceProps = {
  mode: "edit" | "preview";
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
};

const SAMPLE_TAGS = ["Leadership", "TypeScript", "Customer Success", "FinTech"];

export function EditorWorkspace({
  mode,
  selectedTemplate,
  onTemplateChange,
}: EditorWorkspaceProps) {
  const { stepper, editorState, resumeState: resume } = useEditorContext();
  const {
    steps,
    current: currentStep,
    next: nextStep,
    prev: prevStep,
  } = stepper;
  const { colorHex, setColorHex } = editorState;


  const enabledSteps = useMemo(
    () => steps.filter((step) => step.enabled !== false),
    [steps],
  );
  const currentEnabledIndex = enabledSteps.findIndex(
    (step) => step.id === currentStep?.id,
  );
  const totalSteps = enabledSteps.length || 1;
  const stepNumber = currentEnabledIndex >= 0 ? currentEnabledIndex + 1 : 1;
  const template = useMemo(
    () =>
      RESUME_TEMPLATES.find((item) => item.id === selectedTemplate) ??
      RESUME_TEMPLATES[0],
    [selectedTemplate],
  );

  if (mode === "preview") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-background p-4">
          <div>
            <h2 className="text-lg font-semibold">Resume Preview</h2>
            <p className="text-muted-foreground">{template.name} template</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border p-1 shadow-sm h-10 w-full sm:w-44">
              <label
                htmlFor="color-picker"
                className="flex items-center justify-center cursor-pointer hover:bg-muted p-1.5 rounded-md transition-colors"
                title="Choose custom accent color"
              >
                <Palette className="h-4 w-4 text-muted-foreground" />
                <input
                  id="color-picker"
                  type="color"
                  value={colorHex === "default" ? "#3b82f6" : colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="sr-only"
                />
              </label>

              <div className="w-px h-4 bg-border" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setColorHex("default")}
                disabled={colorHex === "default"}
                className="text-xs px-2 flex-1"
                type="button"
              >
                Default
              </Button>
            </div>

            <TemplateSelector2
              selectedId={selectedTemplate}
              onSelect={onTemplateChange}
            />
          </div>
        </div>

        <ResumePreview template={template} />
      </div>
    );
  }

  const Icon = currentStep?.icon?.component ?? User;

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-blue-100 p-2 text-blue-600">
              <Icon className="size-5" />
            </span>
            <div>
              <CardTitle className="text-2xl">
                {currentStep?.title ?? "Start editing your resume"}
              </CardTitle>
              <CardDescription className="">
                {currentStep?.sidebarDesc ?? "Your basic details"}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <HeaderForm />

        <SummaryForm />

        <WorkExperienceForm />

        <EducationForm />

        <ProjectsForm />

        <CertificationsForm />

        <AwardsForm />

        <SkillsForm />

        <CustomSectionForm />

        {!currentStep && (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Pick a section to start editing.
          </div>
        )}

        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={!stepper.hasPrev}
              type="button"
            >
              <ArrowLeft />
              Previous
            </Button>
            <Button
              size="sm"
              onClick={nextStep}
              disabled={!stepper.hasNext}
              type="button"
            >
              Next
              <ArrowRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
