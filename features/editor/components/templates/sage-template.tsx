"use client";

import {
  RichText,
  SectionTitle,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function SageTemplate({ template, data }: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  // Sage is a two-column layout: left = secondary sections, right = primary (experience)
  const leftSectionIds = [
    "summary",
    "skills",
    "education",
    "certifications",
    "awards",
  ];
  const rightSectionIds = ["experience", "projects"];

  const ordered = data.sections.map((s) => s.id);
  const leftSections = ordered.filter((id) => leftSectionIds.includes(id));
  const rightSections = ordered.filter((id) => rightSectionIds.includes(id));

  function renderSection(id: string) {
    if (id === "summary" && data.summary) {
      return (
        <div key="summary" className="space-y-1.5">
          <SectionTitle label="Summary" accent={template.accent} minimal />
          <RichText html={data.summary} />
        </div>
      );
    }
    if (id === "skills" && data.skills.length > 0) {
      return (
        <div key="skills" className="space-y-1.5">
          <SectionTitle label="Skills" accent={template.accent} minimal />
          <div className="flex flex-wrap gap-1">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-full bg-muted px-2 py-0.5 text-xs"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      );
    }
    if (id === "education" && data.education.length > 0) {
      return (
        <div key="education" className="space-y-2">
          <SectionTitle label="Education" accent={template.accent} minimal />
          {data.education.map((item, i) => (
            <div key={i} className="space-y-0.5 text-xs">
              <p className="font-medium">{item.degree}</p>
              <p className="text-muted-foreground">{item.school}</p>
              <p className="text-muted-foreground">
                {dateRange(item.startDate, item.endDate, item.isCurrent)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    if (id === "certifications" && data.certifications.length > 0) {
      return (
        <div key="certifications" className="space-y-2">
          <SectionTitle
            label="Certifications"
            accent={template.accent}
            minimal
          />
          {data.certifications.map((item, i) => (
            <div key={i} className="space-y-0.5 text-xs">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground">
                {item.issuer}
                {item.issueDate ? ` · ${formatDate(item.issueDate)}` : ""}
              </p>
            </div>
          ))}
        </div>
      );
    }
    if (id === "awards" && data.awards.length > 0) {
      return (
        <div key="awards" className="space-y-2">
          <SectionTitle label="Awards" accent={template.accent} minimal />
          {data.awards.map((item, i) => (
            <div key={i} className="space-y-0.5 text-xs">
              <p className="font-medium">{item.title}</p>
              <p className="text-muted-foreground">{item.issuer}</p>
            </div>
          ))}
        </div>
      );
    }
    if (id === "experience" && data.experience.length > 0) {
      return (
        <div key="experience" className="space-y-3">
          <SectionTitle label="Experience" accent={template.accent} minimal />
          {data.experience.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{item.position}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.company}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {dateRange(item.startDate, item.endDate, item.isCurrent)}
                </span>
              </div>
              <RichText
                html={item.description}
                className="text-muted-foreground"
              />
            </div>
          ))}
        </div>
      );
    }
    if (id === "projects" && data.projects.length > 0) {
      return (
        <div key="projects" className="space-y-3">
          <SectionTitle label="Projects" accent={template.accent} minimal />
          {data.projects.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{item.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {dateRange(item.startDate, item.endDate)}
                </span>
              </div>
              {item.url && (
                <p className="text-xs text-muted-foreground">{item.url}</p>
              )}
              <RichText
                html={item.description}
                className="text-muted-foreground"
              />
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 border-b pb-4">
        {fullName && <p className="text-2xl font-semibold">{fullName}</p>}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {data.jobTitle && (
            <span className="rounded-full border px-2 py-0.5">
              {data.jobTitle}
            </span>
          )}
          {location(data.city, data.country) && (
            <span>{location(data.city, data.country)}</span>
          )}
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
        </div>
      </header>
      <div className="grid gap-6 grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          {leftSections.map((id) => renderSection(id))}
        </div>
        <div className="space-y-5">
          {rightSections.map((id) => renderSection(id))}
        </div>
      </div>
    </div>
  );
}
