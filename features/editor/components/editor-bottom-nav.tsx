"use client";

import { cn } from "@/lib/utils";
import { useAISuggestionStore } from "@/store/ai-suggestions.store";
import { Eye, FileText, Sparkles } from "lucide-react";

export type MobileEditorMode = "edit" | "copilot" | "preview";

type EditorBottomNavProps = {
  activeMode: MobileEditorMode;
  onChangeMode: (mode: MobileEditorMode) => void;
};

const NAV_ITEMS: Array<{
  id: MobileEditorMode;
  label: string;
  icon: typeof FileText;
}> = [
  { id: "edit", label: "Edit", icon: FileText },
  { id: "copilot", label: "AI Copilot", icon: Sparkles },
  { id: "preview", label: "Preview", icon: Eye },
];

export function EditorBottomNav({
  activeMode,
  onChangeMode,
}: EditorBottomNavProps) {
  const suggestionCount = useAISuggestionStore((s) => s.suggestions.length);

  return (
    <nav className="fixed inset-x-0 xm:left-64 bottom-0 z-30 border-t bg-background/95 backdrop-blur-sm p-2 lg:hidden">
      <div className="grid grid-cols-3 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;
          const badge = item.id === "copilot" && suggestionCount > 0 ? suggestionCount : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMode(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {badge !== null && (
                <span className="absolute right-5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-semibold text-white">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
              <Icon className={cn("size-5 transition-transform", isActive && "scale-110")} />
              <span className={cn("transition-all", isActive && "font-semibold")}>
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
