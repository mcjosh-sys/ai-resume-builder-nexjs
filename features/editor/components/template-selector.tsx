"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RESUME_TEMPLATES } from "../resource/templates";

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
