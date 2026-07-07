"use client";

import { DownloadPdfButton } from "@/components/download-pdf-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useSidebar } from "@/components/ui/sidebar";
import { useFromNow } from "@/hooks/use-from-now";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Loader2,
  Menu,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";
import { ComponentProps } from "react";
import { useEditorContext } from "../contexts/editor-context";

export function EditorShellHeader() {
  const {
    editorState,
    resumeState: { lastSaved, isSaving },
    stepper: { steps },
    currentResumeId,
  } = useEditorContext();

  const { selectedTemplate, colorHex } = editorState;
  const sidebar = useSidebar();
  const fromNow = useFromNow(lastSaved);

  return (
    <>
      {/* ── Mobile header (< xm breakpoint) ── */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm xm:hidden">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={sidebar.toggleSidebar}
              aria-label="Open sections"
            >
              <Menu className="size-5" />
            </Button>
            <div>
              <p className="text-base font-semibold leading-tight">My Resume</p>
              <SaveStatusBadge isSaving={isSaving} fromNow={fromNow} compact />
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <UndoRedoButtons />
            <SaveButton
              variant="ghost"
              size="icon-sm"
              aria-label="Save"
              iconOnly
            />
            <DownloadPdfButton
              variant="ghost"
              size="icon-sm"
              aria-label="Download PDF"
              steps={steps}
              template={selectedTemplate}
              colorHex={colorHex}
              type="button"
            />
          </div>
        </div>
      </header>

      {/* ── Desktop header (≥ xm breakpoint) ── */}
      <header className="fixed h-16 inset-x-0 top-0 z-40 hidden border-b bg-background/95 backdrop-blur-sm xm:block">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <div
              aria-hidden="true"
              className="h-5 w-px bg-border"
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold leading-tight text-foreground">
                My Resume
              </p>
              <SaveStatusBadge isSaving={isSaving} fromNow={fromNow} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
              <UndoRedoButtons showLabels />
            </div>
            <SaveButton variant="outline" />
            <DownloadPdfButton
              steps={steps}
              template={selectedTemplate}
              colorHex={colorHex}
              type="button"
            >
              Download PDF
            </DownloadPdfButton>
          </div>
        </div>
      </header>
    </>
  );
}

function SaveStatusBadge({
  isSaving,
  fromNow,
  compact = false,
}: {
  isSaving: boolean;
  fromNow: string | null;
  compact?: boolean;
}) {
  if (!isSaving && !fromNow) return null;

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-muted-foreground",
        compact ? "text-[11px]" : "text-xs",
      )}
    >
      {isSaving ? (
        <>
          <Loader2 className="size-3 animate-spin text-primary" />
          <span>Saving…</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="size-3 text-emerald-500" />
          <span>Saved {fromNow}</span>
        </>
      )}
    </p>
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
      {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      {!iconOnly && <span>Save</span>}
    </Button>
  );
}

function UndoRedoButtons({ showLabels = false }: { showLabels?: boolean }) {
  const { history } = useEditorContext();
  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="ghost"
        size={showLabels ? "sm" : "icon-sm"}
        aria-label="Undo (Ctrl+Z)"
        title="Undo (Ctrl+Z)"
        disabled={!history.canUndo}
        onClick={history.undo}
      >
        <Undo2 className="size-4 shrink-0" />
        {showLabels && <span className="text-sm">Undo</span>}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size={showLabels ? "sm" : "icon-sm"}
        aria-label="Redo (Ctrl+Shift+Z)"
        title="Redo (Ctrl+Shift+Z)"
        disabled={!history.canRedo}
        onClick={history.redo}
      >
        <Redo2 className="size-4 shrink-0" />
        {showLabels && <span className="text-sm">Redo</span>}
      </Button>
    </div>
  );
}
