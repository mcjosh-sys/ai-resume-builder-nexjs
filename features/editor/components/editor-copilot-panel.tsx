"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useResumeAI } from "@/hooks/use-resume-ai";
import { cn } from "@/lib/utils";
import { Sparkles, WandSparkles, Zap } from "lucide-react";
import { useState } from "react";
import { useEditorContext } from "../contexts/editor-context";

type EditorCopilotPanelProps = {
  mobile?: boolean;
};

const QUICK_ACTIONS = [
  { id: "rewrite", label: "Rewrite with AI", icon: WandSparkles },
  { id: "bullets", label: "Improve Bullet Points", icon: Zap },
  { id: "tailor", label: "Tailor to Job", icon: Sparkles },
] as const;

export function EditorCopilotPanel({
  mobile = false,
}: EditorCopilotPanelProps) {
  const [activeTab, setActiveTab] = useState<"actions" | "suggestions">(
    "actions",
  );
  const [jobDescription, setJobDescription] = useState("");

  const {
    stepper: { steps },
    editorState: { selectedTemplate, colorHex },
  } = useEditorContext();

  const { status, error, rewrite, getSuggestions } = useResumeAI({
    steps,
    template: selectedTemplate,
    colorHex,
  });

  const quickActionHandlers = {
    rewrite: () => {
      rewrite();
    },
  };

  return (
    <div className={cn("space-y-4", mobile && "space-y-5")}>
      <div
        className={cn(
          "rounded-xl border bg-violet-50/60 p-4",
          mobile && "bg-violet-50",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-linear-to-br from-violet-500 to-blue-500 p-2 text-white">
            <Sparkles className="size-6" />
          </div>
          <div>
            <p className="text-3xl font-semibold">AI Copilot</p>
            <p className="text-muted-foreground">
              Your intelligent writing assistant
            </p>
          </div>
        </div>

        {mobile && (
          <div className="mt-4 rounded-full bg-muted p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("actions")}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold",
                  activeTab === "actions" && "bg-background",
                )}
              >
                Quick Actions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("suggestions")}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold",
                  activeTab === "suggestions" && "bg-background",
                )}
              >
                Suggestions 3
              </button>
            </div>
          </div>
        )}
      </div>

      {(!mobile || activeTab === "actions") && (
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-lg font-medium hover:bg-muted/40"
                  onClick={() => (quickActionHandlers as any)[action.id]?.()}
                >
                  <span className="rounded-lg bg-muted p-2">
                    <Icon className="size-4" />
                  </span>
                  {action.label}
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {(!mobile || activeTab === "suggestions") && (
        <>
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-xl">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get AI-powered suggestions..."
                className="resize-none"
              />
              <Button
                className="w-full bg-linear-to-r from-violet-600 to-blue-600"
                onClick={() => getSuggestions(jobDescription)}
                disabled={status === "suggesting" || !jobDescription}
              >
                <Sparkles />
                Analyze & Optimize
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-xl">AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                <p className="text-lg text-slate-700">
                  Add metrics to your bullet points to quantify your
                  achievements.
                </p>
                <Button variant="outline" className="mt-3 w-full">
                  Apply Suggestion
                </Button>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-lg text-slate-700">
                Use stronger action verbs like "architected" and "accelerated".
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
