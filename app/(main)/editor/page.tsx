"use client";

import { type MobileEditorMode } from "@/features/editor/components/editor-bottom-nav";
import { EditorContent } from "@/features/editor/components/editor-content";
import { useEditorContext } from "@/features/editor/contexts/editor-context";
import { useMemo, useState } from "react";

export default function EditorPage() {
  const [activeMobileMode, setActiveMobileMode] =
    useState<MobileEditorMode>("edit");
  const [activeDesktopWorkspaceTab, setActiveDesktopWorkspaceTab] = useState<
    "edit" | "preview"
  >("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("aurora");
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(false);

  const { stepper } = useEditorContext();
  const { steps, current: currentStep, setCurrent: setCurrentStep } = stepper;

  const enabledSteps = useMemo(
    () => steps.filter((step) => step.enabled !== false),
    [steps],
  );

  return (
    <div className="h-full bg-muted/30">
      <EditorContent />
    </div>
  );
}
