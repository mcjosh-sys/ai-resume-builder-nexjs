"use client";

import { DownloadPdfButton } from "@/components/download-pdf-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useSidebar } from "@/components/ui/sidebar";
import { useFromNow } from "@/hooks/use-from-now";
import { Menu, Save, Settings } from "lucide-react";
import { ComponentProps } from "react";
import { useEditorContext } from "../contexts/editor-context";

export function EditorShellHeader() {
  const {
    editorState,
    resumeState: { lastSaved, isSaving },
    stepper: { steps },
    currentResumeId,
  } = useEditorContext();

  const { selectedTemplate, setSelectedTemplate, colorHex } = editorState;
  const sidebar = useSidebar();
  const fromNow = useFromNow(lastSaved);
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background xm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              className="xm:hidden"
              onClick={sidebar.toggleSidebar}
              aria-label="Open sections"
            >
              <Menu className="size-5" />
            </Button>
            <div>
              <p className="text-xl font-semibold leading-tight">My Resume</p>
              {fromNow && (
                <p className="text-sm text-muted-foreground">
                  Last saved: {fromNow}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <SaveButton
              variant="ghost"
              size="icon-sm"
              aria-label="Save"
              iconOnly
            />
            <DownloadPdfButton
              variant="ghost"
              size="icon-sm"
              aria-label="Download"
              steps={steps}
              template={selectedTemplate}
              colorHex={colorHex}
              type="button"
            />
            <Button variant="ghost" size="icon-sm" aria-label="Settings">
              <Settings className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <header className="fixed h-18 inset-x-0 top-0 z-40 hidden border-b bg-background md:block">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo /> |
            <p className="text-muted-foreground font-semibold">My Resume</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* <select
              value={selectedTemplate}
              onChange={(event) => setSelectedTemplate(event.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
              aria-label="Choose resume template"
            >
              {RESUME_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} Template
                </option>
              ))}
            </select> */}

            <SaveButton variant="outline" />
            <DownloadPdfButton
              steps={steps}
              template={selectedTemplate}
              colorHex={colorHex}
              type="button"
            >
              {/* <Download /> */}
              Download PDF
            </DownloadPdfButton>
          </div>
        </div>
      </header>
    </>
  );
}

function SaveButton({
  onClick: _,
  iconOnly = false,
  ...props
}: ComponentProps<typeof Button> & { iconOnly?: boolean }) {
  const {
    resumeState: { isSaving, hasUnsavedChanges, save },
  } = useEditorContext();
  return (
    <Button
      onClick={save}
      type="button"
      {...props}
      disabled={isSaving || !hasUnsavedChanges}
    >
      <Save />
      {iconOnly ? "" : "Save"}
    </Button>
  );
}
