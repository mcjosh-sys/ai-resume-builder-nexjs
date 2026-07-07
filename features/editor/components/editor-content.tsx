"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEditorContext } from "../contexts/editor-context";
import { EditorBottomNav } from "./editor-bottom-nav";
import { EditorCopilotPanel } from "./editor-copilot-panel";
import { EditorWorkspace } from "./editor-workspace";

export function EditorContent() {
  const {
    editorState,
    resumeState: resume,
    resumeMetadata,
  } = useEditorContext();
  const {
    activeMobileMode,
    activeDesktopWorkspaceTab,
    setActiveMobileMode,
    setActiveDesktopWorkspaceTab,
    updateResumeMetadata,
  } = editorState;
  const { template: selectedTemplate } = resumeMetadata;

  const handleTemplateChange = (template: string) => {
    updateResumeMetadata({ template });
  };

  return (
    <div className="h-full w-full relative">
      {/* ── Save status floating indicator ── */}
      {(resume.isSaving || resume.lastSaved) && (
        <div className="fixed bottom-24 right-4 lg:bottom-5 lg:right-5 z-50 flex items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm transition-opacity">
          {resume.isSaving ? (
            <>
              <Loader2 className="size-3 animate-spin text-primary" />
              <span>Saving…</span>
            </>
          ) : (
            resume.lastSaved && (
              <>
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>
                  Saved at{" "}
                  {resume.lastSaved.toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </>
            )
          )}
        </div>
      )}

      {/* ── Mobile layout (< lg) ── */}
      <div className="lg:hidden">
        <main className="space-y-4 px-4 py-4 pb-28">
          {activeMobileMode === "edit" && (
            <EditorWorkspace
              mode="edit"
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />
          )}
          {activeMobileMode === "copilot" && <EditorCopilotPanel mobile />}
          {activeMobileMode === "preview" && (
            <EditorWorkspace
              mode="preview"
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />
          )}
        </main>

        <EditorBottomNav
          activeMode={activeMobileMode}
          onChangeMode={setActiveMobileMode}
        />
      </div>

      {/* ── Desktop layout (≥ lg) ── */}
      <div className="hidden lg:flex lg:h-full">
        {/* Left: edit / preview workspace */}
        <section className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Tab strip */}
          <div className="shrink-0 border-b bg-background px-4 py-2.5 flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-muted p-1 gap-0.5">
              {(["edit", "preview"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveDesktopWorkspaceTab(tab)}
                  className={[
                    "rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition-all duration-150",
                    activeDesktopWorkspaceTab === tab
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-5">
              <EditorWorkspace
                mode={activeDesktopWorkspaceTab}
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
              />
            </div>
          </div>
        </section>

        {/* Right: AI Copilot panel */}
        <aside className="w-[360px] shrink-0 border-l bg-muted/20 h-full overflow-y-auto">
          <div className="p-4">
            <EditorCopilotPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
