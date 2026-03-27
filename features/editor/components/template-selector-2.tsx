"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, Camera } from "lucide-react";
import { useState } from "react";
import { RESUME_TEMPLATES } from "../resource/templates";
import { ResumePreview } from "./resume-preview";

type TemplateSelectorProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

/** A tiny placeholder dataset so template previews look populated, not blank. */
const PREVIEW_DATA = {
  firstName: "Alex",
  lastName: "Morgan",
  jobTitle: "Senior Product Manager",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  summary:
    "Results-driven product leader with 8+ years building B2B SaaS products. Skilled at translating complex user needs into clear roadmaps.",
  experience: [
    {
      id: "1",
      company: "Acme Corp",
      position: "Senior PM",
      startDate: "2020",
      endDate: "Present",
      current: true,
      location: "San Francisco, CA",
      responsibilities: "<p>Led cross-functional teams to ship 3 major product releases.</p>",
    },
  ],
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "B.S. Computer Science",
      fieldOfStudy: "Computer Science",
      startDate: "2012",
      endDate: "2016",
      current: false,
      location: "Stanford, CA",
    },
  ],
  skills: [
    { id: "1", name: "Product Strategy", level: "Expert" as const },
    { id: "2", name: "Data Analysis", level: "Advanced" as const },
    { id: "3", name: "Roadmapping", level: "Expert" as const },
  ],
  projects: [],
  certifications: [],
  awards: [],
  sections: [],
  otherFields: [],
  photo: undefined,
  links: [],
} as const;

export function TemplateSelector2({ selectedId, onSelect }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);

  const selected = RESUME_TEMPLATES.find((t) => t.id === selectedId) ?? RESUME_TEMPLATES[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          role="combobox"
          aria-expanded={open}
          className="h-full flex-1 sm:flex-none gap-2"
        >
          <span
            className={cn("h-3 w-3 rounded-full shrink-0", selected.accent)}
          />
          {selected.name}
          <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-115 p-0"
        side="bottom"
        align="end"
        sideOffset={6}
      >
        <Command>
          <CommandInput placeholder="Search templates…" />
          <CommandList className="max-h-105">
            <CommandEmpty>No templates found.</CommandEmpty>
            <CommandGroup heading="Templates">
              {RESUME_TEMPLATES.map((template) => {
                const isSelected = template.id === selectedId;
                return (
                  <CommandItem
                    key={template.id}
                    value={template.name}
                    onSelect={() => {
                      onSelect(template.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 py-2 cursor-pointer"
                  >
                    {/* Mini template preview — the resume renders at 794px; scale it to fill the 48px wide thumbnail */}
                    <div className="h-17 w-12 shrink-0 overflow-hidden rounded border bg-white shadow-sm">
                      <div
                        style={{ zoom: 48 / 794 }}
                        className="pointer-events-none"
                      >
                        <ResumePreview
                          template={template}
                          overrideData={PREVIEW_DATA as any}
                          forceColor="default"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{template.name}</span>
                        {template.supportsPhoto && (
                          <span className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground leading-none">
                            <Camera className="h-2.5 w-2.5" />
                            Photo
                          </span>
                        )}
                        <span
                          className={cn(
                            "ml-auto h-2.5 w-2.5 rounded-full shrink-0",
                            template.accent,
                          )}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {template.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5 truncate">
                        {template.preview.subtitle}
                      </p>
                    </div>

                    {/* Selected check */}
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 shrink-0 text-primary transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
