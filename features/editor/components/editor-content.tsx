import { Clock, Loader2 } from "lucide-react";
import { useEditorContext } from "../contexts/editor-context";
import { EditorBottomNav } from "./editor-bottom-nav";
import { EditorCopilotPanel } from "./editor-copilot-panel";
import { EditorWorkspace } from "./editor-workspace";

export function EditorContent() {
  const { editorState, resume } = useEditorContext();
  const {
    activeMobileMode,
    activeDesktopWorkspaceTab,
    selectedTemplate,
    setActiveMobileMode,
    setActiveDesktopWorkspaceTab,
    setSelectedTemplate,
  } = editorState;
  return (
    <div className="h-full w-full relative">
      {(resume.isSaving || resume.lastSaved) && (
        <div className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-md">
          {resume.isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin text-blue-500" />
              Saving...
            </>
          ) : (
            resume.lastSaved && (
              <>
                <Clock className="size-4" />
                Last saved:{" "}
                {resume.lastSaved.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </>
            )
          )}
        </div>
      )}

      <div className="lg:hidden">
        <main className="space-y-4 px-4 py-4 pb-48">
          {activeMobileMode === "edit" && (
            <EditorWorkspace
              mode="edit"
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          )}
          {activeMobileMode === "copilot" && <EditorCopilotPanel mobile />}
          {activeMobileMode === "preview" && (
            <EditorWorkspace
              mode="preview"
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          )}
        </main>

        <EditorBottomNav
          activeMode={activeMobileMode}
          onChangeMode={setActiveMobileMode}
        />
      </div>

      <div className="hidden relative lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:h-full">
        <section className="flex flex-col h-full">
          <div className="border-b p-3 sticky top-0 z-10 bg-background">
            <div className="inline-flex rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => setActiveDesktopWorkspaceTab("edit")}
                className={[
                  "rounded-lg px-4 py-1.5 text-sm font-semibold",
                  activeDesktopWorkspaceTab === "edit" ? "bg-background" : "",
                ].join(" ")}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveDesktopWorkspaceTab("preview")}
                className={[
                  "rounded-lg px-4 py-1.5 text-sm font-semibold",
                  activeDesktopWorkspaceTab === "preview"
                    ? "bg-background"
                    : "",
                ].join(" ")}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="h-full relative overflow-y-auto p-5 w-full">
            <div className="absolute top-0 left-0 w-full p-4">
              <EditorWorkspace
                mode={activeDesktopWorkspaceTab}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </div>
          </div>
        </section>

        <aside className="border-l bg-violet-50/40 relative overflow-y-auto h-full">
          <div className="absolute top-0 left-0 p-4">
            <EditorCopilotPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
