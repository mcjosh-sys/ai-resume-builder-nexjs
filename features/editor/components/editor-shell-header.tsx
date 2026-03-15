"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useSidebar } from "@/components/ui/sidebar";
import { RESUME_TEMPLATES } from "@/features/editor/components/template-selector";
import { Download, Menu, Save, Settings } from "lucide-react";
import { useEditorContext } from "../contexts/editor-context";

type EditorShellHeaderProps = {
  selectedTemplate: string;
  onTemplateChange: (id: string) => void;
  onOpenSections: () => void;
};

export function EditorShellHeader() {
  const { editorState } = useEditorContext();
  const {
    selectedTemplate,
    setSelectedTemplate,
    setActiveDesktopWorkspaceTab,
    setMobileSectionsOpen,
  } = editorState;
  const sidebar = useSidebar();
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
              <p className="text-sm text-muted-foreground">
                Last saved: 2m ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" aria-label="Save">
              <Save className="size-5" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Download">
              <Download className="size-5" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Settings">
              <Settings className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <header className="fixed h-18 inset-x-0 top-0 z-40 hidden border-b bg-background xm:block">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo /> |
            <p className="text-muted-foreground font-semibold">My Resume</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <select
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
            </select>

            <Button variant="outline" type="button">
              <Save />
              Save
            </Button>
            <Button type="button">
              <Download />
              Download PDF
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
