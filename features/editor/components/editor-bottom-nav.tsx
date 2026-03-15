"use client";

import { cn } from "@/lib/utils";
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
  activeClassName: string;
}> = [
  {
    id: "edit",
    label: "Edit",
    icon: FileText,
    activeClassName: "bg-blue-100 text-blue-700",
  },
  {
    id: "copilot",
    label: "AI Copilot",
    icon: Sparkles,
    activeClassName: "bg-violet-100 text-violet-700",
  },
  {
    id: "preview",
    label: "Preview",
    icon: Eye,
    activeClassName: "bg-emerald-100 text-emerald-700",
  },
];

export function EditorBottomNav({
  activeMode,
  onChangeMode,
}: EditorBottomNavProps) {
  return (
    <nav className="fixed inset-x-0 xm:left-64 bottom-0 z-30 border-t bg-background p-3 lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMode(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors",
                isActive && item.activeClassName,
              )}
            >
              {item.id === "copilot" && (
                <span className="absolute right-7 top-1 rounded-full bg-violet-600 px-1.5 text-[10px] text-white">
                  3
                </span>
              )}
              <Icon className="size-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
