import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

function GallegoSectionTitle({
  label,
  accent,
}: {
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className={cn("w-1 h-4 rounded-full shrink-0", accent)} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
        {label}
      </p>
      <div className="flex-1 h-px bg-neutral-200" />
    </div>
  );
}

export function AxisTemplate({ template, data }: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentBg = template.accent;

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <header className="space-y-1 pb-3">
        {fullName && (
          <p className="text-2xl font-bold uppercase tracking-wide">
            {fullName}
          </p>
        )}
        {data.jobTitle && (
          <div className="flex items-center gap-2">
            <div className={cn("h-0.5 w-8 rounded", accentBg)} />
            <p
              className={cn(
                "text-sm font-medium",
                accentBg.replace("bg-", "text-"),
              )}
            >
              {data.jobTitle}
            </p>
          </div>
        )}
        <p className="text-xs text-neutral-500 pt-0.5 border-t border-neutral-200">
          {[
            location(data.city, data.country),
            data.email,
            data.phone,
            ...(data.links ?? []).map((l) => l.url),
          ]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </header>

      {data.sections.map((section) => {
        if (section.id === "summary" && data.summary) {
          return (
            <section key="summary" className="space-y-1.5">
              <GallegoSectionTitle label="Summary" accent={accentBg} />
              <RichText html={data.summary} />
            </section>
          );
        }

        if (section.id === "skills" && data.skills.length > 0) {
          return (
            <section key="skills" className="space-y-1.5">
              <GallegoSectionTitle label="Technical Skills" accent={accentBg} />
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded border border-neutral-300 px-2 py-0.5 text-xs text-neutral-700"
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
              <GallegoSectionTitle label="Languages" accent={accentBg} />
              <div className="flex flex-wrap gap-1.5">
                {data.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="flex items-baseline gap-1 rounded border border-neutral-300 px-2 py-0.5 text-xs text-neutral-700"
                  >
                    <span className="font-medium">{lang.name}</span>
                    {lang.level && <span className="text-[10px] opacity-70">{lang.level}</span>}
                  </span>
                ))}
              </div>
            </section>
          );
        }

        if (section.id === "experience" && data.experience.length > 0) {
          return (
            <section key="experience" className="space-y-3">
              <GallegoSectionTitle
                label="Professional Experience"
                accent={accentBg}
              />
              {data.experience.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">
                        {item.position}
                        {item.company ? `, ${item.company}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {dateRange(item.startDate, item.endDate, item.isCurrent)}
                    </span>
                  </div>
                  {location(item.city, item.country) && (
                    <p className="text-xs text-neutral-500">
                      {location(item.city, item.country)}
                    </p>
                  )}
                  <RichText html={item.description} />
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "education" && data.education.length > 0) {
          return (
            <section key="education" className="space-y-2">
              <GallegoSectionTitle label="Education" accent={accentBg} />
              {data.education.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-bold">{item.degree}</p>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {dateRange(item.startDate, item.endDate, item.isCurrent)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    {item.school}
                    {location(item.city, item.country)
                      ? `, ${location(item.city, item.country)}`
                      : ""}
                  </p>
                  <RichText html={item.description} />
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "projects" && data.projects.length > 0) {
          return (
            <section key="projects" className="space-y-2">
              <GallegoSectionTitle label="Projects" accent={accentBg} />
              {data.projects.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-bold">{item.title}</p>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {dateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {item.url && (
                    <p className="text-xs text-neutral-500">{item.url}</p>
                  )}
                  <RichText html={item.description} />
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "certifications" && data.certifications.length > 0) {
          return (
            <section key="certifications" className="space-y-1.5">
              <GallegoSectionTitle label="Certifications" accent={accentBg} />
              {data.certifications.map((item, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-semibold">{item.name}</span>
                    {item.issuer && (
                      <span className="text-xs text-neutral-500 ml-1.5">
                        · {item.issuer}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-neutral-500">
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
              <GallegoSectionTitle label="Awards" accent={accentBg} />
              {data.awards.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold">{item.title}</p>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  {item.issuer && (
                    <p className="text-xs text-neutral-500">{item.issuer}</p>
                  )}
                  <RichText html={item.description} />
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
            <section key={section.id} className="space-y-2">
              <GallegoSectionTitle
                label={(section as any).title}
                accent={accentBg}
              />
              <div className="space-y-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-bold">{fieldData.title}</p>
                  <span className="shrink-0 text-xs text-neutral-500">
                    {dateRange(fieldData.startDate, fieldData.endDate)}
                  </span>
                </div>
                {fieldData.subtitle && (
                  <p className="text-xs text-neutral-500">
                    {fieldData.subtitle}
                  </p>
                )}
                <RichText html={fieldData.description} />
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
