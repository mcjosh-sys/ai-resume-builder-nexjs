"use client";

import { UpgradePrompt } from "@/components/upgrade-prompt";
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
import { FREE_TEMPLATES } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Camera, CheckIcon, ChevronDownIcon, Lock } from "lucide-react";
import { useState } from "react";
import { RESUME_TEMPLATES } from "../resource/templates";
import { ResumePreview } from "./resume-preview";

type TemplateSelectorProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  /** Current user plan — passed from server component parent */
  userPlan?: "FREE" | "PRO" | "TEAM";
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

export function TemplateSelector2({ selectedId, onSelect, userPlan = "FREE" }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [lockedTemplate, setLockedTemplate] = useState<string | undefined>();

  const selected = RESUME_TEMPLATES.find((t) => t.id === selectedId) ?? RESUME_TEMPLATES[0];

  const isLocked = (templateId: string) =>
    userPlan === "FREE" &&
    !FREE_TEMPLATES.includes(templateId as (typeof FREE_TEMPLATES)[number]);

  const handleSelect = (templateId: string) => {
    if (isLocked(templateId)) {
      setLockedTemplate(templateId);
      setUpgradeOpen(true);
      setOpen(false);
      return;
    }
    onSelect(templateId);
    setOpen(false);
  };

  return (
    <>
      <UpgradePrompt
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        feature={`the "${lockedTemplate}" template`}
      />

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
                  const locked = isLocked(template.id);
                  return (
                    <CommandItem
                      key={template.id}
                      value={template.name}
                      onSelect={() => handleSelect(template.id)}
                      className="flex items-center gap-3 py-2 cursor-pointer"
                    >
                      {/* Mini template preview */}
                      <div className={cn(
                        "h-17 w-12 shrink-0 overflow-hidden rounded border bg-white shadow-sm relative",
                        locked && "opacity-60",
                      )}>
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
                        {locked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                            <Lock className="size-3 text-muted-foreground" />
                          </div>
                        )}
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
                          {locked && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600 leading-none dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400">
                              <Lock className="h-2 w-2" />
                              Pro
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
    </>
  );
}
