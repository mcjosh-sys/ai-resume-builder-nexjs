"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  accent: string;
  supportsPhoto?: boolean;
  preview: {
    title: string;
    subtitle: string;
  };
};

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Clean and calm with soft accent highlights.",
    accent: "bg-sky-500",
    preview: {
      title: "Modern professional",
      subtitle: "Balanced, recruiter-friendly layout",
    },
  },
  {
    id: "ember",
    name: "Ember",
    supportsPhoto: true,
    description: "Bold headings with a confident, high-contrast style.",
    accent: "bg-orange-500",
    preview: {
      title: "Impact-driven",
      subtitle: "Strong typography for leadership roles",
    },
  },
  {
    id: "sage",
    name: "Sage",
    description: "Minimal, editorial, and easy to scan.",
    accent: "bg-emerald-500",
    preview: {
      title: "Minimalist",
      subtitle: "Great for senior ICs and designers",
    },
  },
  {
    id: "nova",
    name: "Nova",
    supportsPhoto: true,
    description: "Two-column layout with a dark sidebar.",
    accent: "bg-violet-500",
    preview: {
      title: "Modern two-column",
      subtitle: "Great for technical and creative roles",
    },
  },
  {
    id: "slate",
    name: "Slate",
    description: "Classic professional, clean and monochrome.",
    accent: "bg-slate-600",
    preview: {
      title: "Traditional",
      subtitle: "Safe choice for corporate applications",
    },
  },
  {
    id: "prism",
    name: "Prism",
    description: "Bold accent header bar with a structured grid.",
    accent: "bg-rose-500",
    preview: {
      title: "Bold & structured",
      subtitle: "Great for standing out in tech",
    },
  },
  {
    id: "velvet",
    name: "Velvet",
    description: "Elegant and refined with decorative accents.",
    accent: "bg-amber-600",
    preview: {
      title: "Elegant",
      subtitle: "Perfect for creative or executive roles",
    },
  },
];

type TemplateSelectorProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function TemplateSelector({
  selectedId,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {RESUME_TEMPLATES.map((template) => {
          const isSelected = template.id === selectedId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                isSelected
                  ? "border-blue-500 bg-blue-50/70"
                  : "hover:border-muted-foreground/40",
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-lg",
                  template.accent,
                  "opacity-80",
                )}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{template.name}</p>
                  {template.supportsPhoto && (
                    <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                      Photo
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {template.description}
                </p>
              </div>
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                type="button"
                asChild
              >
                <span>{isSelected ? "Selected" : "Use"}</span>
              </Button>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
