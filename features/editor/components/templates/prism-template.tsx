import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function PrismTemplate({ template, data }: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentClass = template.accent;

  return (
    <div className="space-y-0">
      {/* Accent bar header */}
      <div className={cn("p-5 text-white", accentClass)}>
        {fullName && (
          <p className="text-2xl font-extrabold tracking-tight">{fullName}</p>
        )}
        {data.jobTitle && (
          <p className="text-sm font-medium opacity-90 mt-0.5">
            {data.jobTitle}
          </p>
        )}
      </div>

      {/* Sub-header contact strip */}
      <div className="bg-neutral-800 text-neutral-200 px-5 py-2 flex flex-wrap gap-x-4 gap-y-1">
        {data.email && <span className="text-xs">{data.email}</span>}
        {data.phone && <span className="text-xs">{data.phone}</span>}
        {location(data.city, data.country) && (
          <span className="text-xs">{location(data.city, data.country)}</span>
        )}
        {(data.links ?? []).map((l, i) => (
          <span key={i} className="text-xs">
            {l.url}
          </span>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {data.sections.map((section) => {
          if (section.id === "summary" && data.summary) {
            return (
              <section key="summary" className="space-y-1.5">
                <div
                  className={cn("h-0.5 w-8 rounded-full mb-1", accentClass)}
                />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Summary
                </p>
                <RichText html={data.summary} />
              </section>
            );
          }
          if (section.id === "experience" && data.experience.length > 0) {
            return (
              <section key="experience" className="space-y-3">
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Experience
                </p>
                {data.experience.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_auto] gap-x-4 break-inside-avoid"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold">{item.position}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.company}
                        {location(item.city, item.country)
                          ? ` · ${location(item.city, item.country)}`
                          : ""}
                      </p>
                      <RichText html={item.description} className="mt-1" />
                    </div>
                    <p className="text-xs text-muted-foreground text-right whitespace-nowrap">
                      {dateRange(item.startDate, item.endDate, item.isCurrent)}
                    </p>
                  </div>
                ))}
              </section>
            );
          }
          if (section.id === "education" && data.education.length > 0) {
            return (
              <section key="education" className="space-y-2">
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Education
                </p>
                {data.education.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-x-4">
                    <div>
                      <p className="text-sm font-bold">{item.degree}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.school}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground text-right whitespace-nowrap">
                      {dateRange(item.startDate, item.endDate, item.isCurrent)}
                    </p>
                  </div>
                ))}
              </section>
            );
          }
          if (section.id === "skills" && data.skills.length > 0) {
            return (
              <section key="skills" className="space-y-1.5">
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded px-2 py-0.5 text-xs font-medium text-white",
                        accentClass,
                        "opacity-80",
                      )}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            );
          }
          if (section.id === "languages" && data.languages.length > 0) {
            return (
              <section key="languages" className="space-y-1.5">
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Languages
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.languages.map((lang, i) => (
                    <span
                      key={i}
                      className={cn(
                        "flex items-baseline gap-1 rounded px-2 py-0.5 text-xs text-white",
                        accentClass,
                        "opacity-80",
                      )}
                    >
                      <span className="font-medium">{lang.name}</span>
                      {lang.level && (
                        <span className="text-[10px] opacity-80">
                          {lang.level}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </section>
            );
          }
          if (section.id === "projects" && data.projects.length > 0) {
            return (
              <section key="projects" className="space-y-2">
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Projects
                </p>
                {data.projects.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto] gap-x-4">
                    <div>
                      <p className="text-sm font-bold">{item.title}</p>
                      {item.url && (
                        <p className="text-xs text-muted-foreground">
                          {item.url}
                        </p>
                      )}
                      <RichText html={item.description} className="mt-1" />
                    </div>
                    <p className="text-xs text-muted-foreground text-right whitespace-nowrap">
                      {dateRange(item.startDate, item.endDate)}
                    </p>
                  </div>
                ))}
              </section>
            );
          }
          if (
            section.id === "certifications" &&
            data.certifications.length > 0
          ) {
            return (
              <section key="certifications" className="space-y-1.5">
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Certifications
                </p>
                {data.certifications.map((item, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-semibold">{item.name}</span>
                      {item.issuer && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          · {item.issuer}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(item.issueDate)}
                    </span>
                  </div>
                ))}
              </section>
            );
          }
          if (section.id === "awards" && data.awards.length > 0) {
            return (
              <section key="awards" className="space-y-1.5">
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Awards
                </p>
                {data.awards.map((item, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-semibold">
                        {item.title}
                      </span>
                      {item.issuer && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          · {item.issuer}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
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
                <div className={cn("h-0.5 w-8 rounded-full", accentClass)} />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  {(section as any).title}
                </p>
                <div className="grid grid-cols-[1fr_auto] gap-x-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">{fieldData.title}</p>
                    {fieldData.subtitle && (
                      <p className="text-xs text-muted-foreground">
                        {fieldData.subtitle}
                      </p>
                    )}
                    <RichText html={fieldData.description} className="mt-1" />
                  </div>
                  <p className="text-xs text-muted-foreground text-right whitespace-nowrap">
                    {dateRange(fieldData.startDate, fieldData.endDate)}
                  </p>
                </div>
              </section>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
