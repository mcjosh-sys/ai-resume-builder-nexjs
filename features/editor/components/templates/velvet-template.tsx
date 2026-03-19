"use client";

import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

function VelvetSectionTitle({
  label,
  accentClass,
}: {
  label: string;
  accentClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-px flex-1", accentClass)} />
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600">
        {label}
      </p>
      <div className={cn("h-px flex-1", accentClass)} />
    </div>
  );
}

export function VelvetTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentClass = template.accent;

  return (
    <div className="space-y-5 p-1">
      {/* Elegant centered header */}
      <header className="text-center space-y-2">
        {fullName && (
          <p className="text-3xl font-light tracking-[0.15em] uppercase">
            {fullName}
          </p>
        )}
        {data.jobTitle && (
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            {data.jobTitle}
          </p>
        )}
        {/* Decorative line */}
        <div className="flex items-center gap-3 justify-center mt-1">
          <div
            className={cn("h-px flex-1", accentClass.replace("bg-", "bg-"))}
          />
          <div className={cn("h-2 w-2 rounded-full", accentClass)} />
          <div className={cn("h-px flex-1", accentClass)} />
        </div>
        <p className="text-xs text-muted-foreground">
          {[data.email, data.phone, location(data.city, data.country)]
            .filter(Boolean)
            .join("  •  ")}
        </p>
      </header>

      {data.sections.map((section) => {
        if (section.id === "summary" && data.summary) {
          return (
            <section key="summary" className="space-y-2">
              <VelvetSectionTitle label="Profile" accentClass={accentClass} />
              <RichText
                html={data.summary}
                className="text-center text-neutral-600 leading-relaxed"
              />
            </section>
          );
        }
        if (section.id === "experience" && data.experience.length > 0) {
          return (
            <section key="experience" className="space-y-3">
              <VelvetSectionTitle
                label="Experience"
                accentClass={accentClass}
              />
              {data.experience.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold tracking-wide">
                        {item.position}
                      </p>
                      <p className="text-xs text-neutral-500 italic">
                        {item.company}
                        {location(item.city, item.country)
                          ? ` · ${location(item.city, item.country)}`
                          : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {dateRange(item.startDate, item.endDate, item.isCurrent)}
                    </span>
                  </div>
                  <RichText
                    html={item.description}
                    className="text-neutral-600"
                  />
                </div>
              ))}
            </section>
          );
        }
        if (section.id === "education" && data.education.length > 0) {
          return (
            <section key="education" className="space-y-2">
              <VelvetSectionTitle label="Education" accentClass={accentClass} />
              {data.education.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold tracking-wide">
                      {item.degree}
                    </p>
                    <p className="text-xs text-neutral-500 italic">
                      {item.school}
                      {location(item.city, item.country)
                        ? ` · ${location(item.city, item.country)}`
                        : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {dateRange(item.startDate, item.endDate, item.isCurrent)}
                  </span>
                </div>
              ))}
            </section>
          );
        }
        if (section.id === "skills" && data.skills.length > 0) {
          return (
            <section key="skills" className="space-y-2">
              <VelvetSectionTitle label="Skills" accentClass={accentClass} />
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-xs text-neutral-600">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          );
        }
        if (section.id === "projects" && data.projects.length > 0) {
          return (
            <section key="projects" className="space-y-3">
              <VelvetSectionTitle label="Projects" accentClass={accentClass} />
              {data.projects.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold tracking-wide">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {dateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {item.url && (
                    <p className="text-xs text-neutral-400 italic">
                      {item.url}
                    </p>
                  )}
                  <RichText
                    html={item.description}
                    className="text-neutral-600"
                  />
                </div>
              ))}
            </section>
          );
        }
        if (section.id === "certifications" && data.certifications.length > 0) {
          return (
            <section key="certifications" className="space-y-2">
              <VelvetSectionTitle
                label="Certifications"
                accentClass={accentClass}
              />
              {data.certifications.map((item, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-semibold tracking-wide">
                      {item.name}
                    </span>
                    {item.issuer && (
                      <span className="ml-2 text-xs text-neutral-500 italic">
                        — {item.issuer}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatDate(item.issueDate)}
                  </span>
                </div>
              ))}
            </section>
          );
        }
        if (section.id === "awards" && data.awards.length > 0) {
          return (
            <section key="awards" className="space-y-2">
              <VelvetSectionTitle label="Awards" accentClass={accentClass} />
              {data.awards.map((item, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-semibold tracking-wide">
                      {item.title}
                    </span>
                    {item.issuer && (
                      <span className="ml-2 text-xs text-neutral-500 italic">
                        — {item.issuer}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatDate(item.date)}
                  </span>
                </div>
              ))}
            </section>
          );
        }
        if (section.id.startsWith("other-field-")) {
          const otherFieldId = section.id.replace("other-field-", "");
          const fieldData = data.otherFields?.find(
            (f) => f.id === otherFieldId,
          );
          if (!fieldData) return null;
          return (
            <section key={section.id} className="space-y-3">
              <VelvetSectionTitle
                label={(section as any).title}
                accentClass={accentClass}
              />
              <div className="space-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold tracking-wide">
                    {fieldData.title}
                  </p>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {dateRange(fieldData.startDate, fieldData.endDate)}
                  </span>
                </div>
                {fieldData.subtitle && (
                  <p className="text-xs text-neutral-400 italic">
                    {fieldData.subtitle}
                  </p>
                )}
                <RichText
                  html={fieldData.description}
                  className="text-neutral-600"
                />
              </div>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
}
