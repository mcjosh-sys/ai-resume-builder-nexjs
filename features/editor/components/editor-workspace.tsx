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
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Palette, User } from "lucide-react";
import { useMemo } from "react";
import { RESUME_TEMPLATES } from "../resource/templates";
import AwardsForm from "./forms/awards-form";
import CertificationsForm from "./forms/certifications-form";
import CustomSectionForm from "./forms/custom-section-form";
import EducationForm from "./forms/education-form";
import { HeaderForm } from "./forms/header-form";
import LanguagesForm from "./forms/languages-form";
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

export function EditorWorkspace({
  mode,
  selectedTemplate,
  onTemplateChange,
}: EditorWorkspaceProps) {
  const {
    stepper,
    editorState,
    resumeMetadata: { colorHex },
  } = useEditorContext();
  const {
    steps,
    current: currentStep,
    next: nextStep,
    prev: prevStep,
  } = stepper;
  const { updateResumeMetadata } = editorState;

  const handleColorChange = (hex: string) => updateResumeMetadata({ colorHex: hex });

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

  /* ── Preview mode ── */
  if (mode === "preview") {
    return (
      <div className="space-y-4">
        {/* Preview toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-background p-3 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold">Resume Preview</h2>
            <p className="text-xs text-muted-foreground">{template.name} template</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Color picker */}
            <div className="flex items-center gap-1.5 rounded-lg border bg-background px-2 py-1.5 shadow-sm h-9">
              <label
                htmlFor="color-picker"
                className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Choose accent color"
              >
                <Palette className="size-3.5" />
                <span className="hidden sm:inline">Color</span>
              </label>
              <input
                id="color-picker"
                type="color"
                value={colorHex === "default" ? "#3b82f6" : colorHex}
                onChange={(e) => handleColorChange(e.target.value)}
                className="sr-only"
              />
              {colorHex !== "default" && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <button
                    type="button"
                    onClick={() => handleColorChange("default")}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reset
                  </button>
                </>
              )}
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

  /* ── Edit mode ── */
  const Icon = currentStep?.icon?.component ?? User;

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/20 rounded-t-xl py-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-xl leading-tight truncate">
              {currentStep?.title ?? "Select a section"}
            </CardTitle>
            {currentStep?.sidebarDesc && (
              <CardDescription className="mt-0.5 text-sm">
                {currentStep.sidebarDesc}
              </CardDescription>
            )}
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
        <LanguagesForm />
        <CustomSectionForm />

        {!currentStep && (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Select a section from the sidebar to start editing.
            </p>
          </div>
        )}

        <Separator />

        {/* Step navigation */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={!stepper.hasPrev}
              type="button"
              className={cn(!stepper.hasPrev && "opacity-50")}
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              size="sm"
              onClick={nextStep}
              disabled={!stepper.hasNext}
              type="button"
              className={cn(!stepper.hasNext && "opacity-50")}
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
