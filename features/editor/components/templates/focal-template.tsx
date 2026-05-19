import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

function CrestSectionLabel({
  label,
  accent,
}: {
  label: string;
  accent: string;
}) {
  return (
    <p
      className={cn(
        "text-[10px] font-bold uppercase tracking-widest pb-1 border-b",
        accent.replace("bg-", "text-"),
        accent.replace("bg-", "border-"),
      )}
    >
      {label}
    </p>
  );
}

export function FocalTemplate({ template, data }: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentBg = template.accent;

  const contactParts: string[] = [
    data.phone ? `Phone: ${data.phone}` : "",
    location(data.city, data.country)
      ? `Address: ${location(data.city, data.country)}`
      : "",
    data.email ? `Email: ${data.email}` : "",
    ...(data.links ?? []).map((l) => l.url),
  ].filter(Boolean);

  // Split sections: left column: education + skills + certifications + languages; right: experience + projects + awards + summary
  const leftSectionIds = ["education", "skills", "certifications", "languages"];
  const rightSectionIds = ["summary", "experience", "projects", "awards"];

  return (
    <div className="font-sans space-y-3">
      {/* Header */}
      <header className="pb-3 border-b border-neutral-200">
        {fullName && (
          <p className="text-2xl font-bold tracking-tight text-center">
            {fullName}
          </p>
        )}
        {data.jobTitle && (
          <p className="text-xs text-center text-neutral-500 mt-0.5">
            {data.jobTitle}
          </p>
        )}

        {/* Contact strip — inline horizontal */}
        {contactParts.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
            {contactParts.map((part, i) => (
              <p key={i} className="text-[10px] text-neutral-500">
                {i > 0 && <span className="mr-3 text-neutral-300">|</span>}
                {part}
              </p>
            ))}
          </div>
        )}
      </header>

      {/* Body — two-column */}
      <div className="flex gap-5">
        {/* Left column: education, skills, certs */}
        <div className="w-[42%] shrink-0 space-y-4">
          {data.sections.map((section) => {
            if (!leftSectionIds.includes(section.id)) return null;

            if (section.id === "education" && data.education.length > 0) {
              return (
                <section key="education" className="space-y-2">
                  <CrestSectionLabel label="Education" accent={accentBg} />
                  {data.education.map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="text-xs font-bold text-neutral-800">
                          {item.school}
                        </p>
                        <span className="shrink-0 text-[10px] text-neutral-500">
                          {dateRange(
                            item.startDate,
                            item.endDate,
                            item.isCurrent,
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">{item.degree}</p>
                      {location(item.city, item.country) && (
                        <p className="text-[10px] text-neutral-500">
                          {location(item.city, item.country)}
                        </p>
                      )}
                      <RichText html={item.description} />
                    </div>
                  ))}
                </section>
              );
            }

            if (section.id === "skills" && data.skills.length > 0) {
              return (
                <section key="skills" className="space-y-1.5">
                  <CrestSectionLabel label="Skills" accent={accentBg} />
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {data.skills.map((skill, i) => (
                      <span
                        key={i}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] text-neutral-600",
                          accentBg.replace(/bg-([a-z]+)-\d+/, "border-$1-200"),
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
                  <CrestSectionLabel label="Languages" accent={accentBg} />
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {data.languages.map((lang, i) => (
                      <span
                        key={i}
                        className={cn(
                          "flex items-baseline gap-1 rounded-full border px-2 py-0.5 text-[10px] text-neutral-600",
                          accentBg.replace(/bg-([a-z]+)-\d+/, "border-$1-200"),
                        )}
                      >
                        <span className="font-semibold">{lang.name}</span>
                        {lang.level && <span className="opacity-70 text-[8px]">{lang.level}</span>}
                      </span>
                    ))}
                  </div>
                </section>
              );
            }

            if (
              section.id === "certifications" &&
              data.certifications.length > 0
            ) {
              return (
                <section key="certifications" className="space-y-1.5">
                  <CrestSectionLabel label="Certifications" accent={accentBg} />
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {data.certifications.map((item, i) => (
                      <div key={i} className="space-y-0">
                        <p className="text-xs font-semibold text-neutral-800">
                          {item.name}
                        </p>
                        <p
                          className={cn(
                            "text-[10px]",
                            accentBg.replace("bg-", "text-"),
                          )}
                        >
                          {item.issuer}
                        </p>
                        {item.issueDate && (
                          <p className="text-[10px] text-neutral-500">
                            {formatDate(item.issueDate)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            return null;
          })}
        </div>

        {/* Right column: summary, experience, projects, awards */}
        <div className="flex-1 space-y-4">
          {data.sections.map((section) => {
            if (
              !rightSectionIds.includes(section.id) &&
              !section.id.startsWith("other-field-")
            )
              return null;

            if (section.id === "summary" && data.summary) {
              return (
                <section key="summary" className="space-y-1">
                  <CrestSectionLabel label="Profile Info" accent={accentBg} />
                  <RichText html={data.summary} />
                </section>
              );
            }

            if (section.id === "experience" && data.experience.length > 0) {
              return (
                <section key="experience" className="space-y-3">
                  <CrestSectionLabel
                    label="Work Experience"
                    accent={accentBg}
                  />
                  {data.experience.map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="text-xs font-bold text-neutral-800">
                          {item.company}
                        </p>
                        <span className="shrink-0 text-[10px] text-neutral-500">
                          {dateRange(
                            item.startDate,
                            item.endDate,
                            item.isCurrent,
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 italic">
                        {item.position}
                        {location(item.city, item.country)
                          ? ` · ${location(item.city, item.country)}`
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
                  <CrestSectionLabel label="Projects" accent={accentBg} />
                  {data.projects.map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="text-xs font-bold text-neutral-800">
                          {item.title}
                        </p>
                        <span className="shrink-0 text-[10px] text-neutral-500">
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

            if (section.id === "awards" && data.awards.length > 0) {
              return (
                <section key="awards" className="space-y-1.5">
                  <CrestSectionLabel label="Awards" accent={accentBg} />
                  {data.awards.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-baseline justify-between gap-1"
                    >
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">
                          {item.title}
                        </p>
                        {item.issuer && (
                          <p className="text-xs text-neutral-500">
                            {item.issuer}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] text-neutral-500">
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
                <section key={section.id} className="space-y-1.5">
                  <CrestSectionLabel
                    label={(section as any).title}
                    accent={accentBg}
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-baseline justify-between gap-1">
                      <p className="text-xs font-bold text-neutral-800">
                        {fieldData.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-neutral-500">
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
      </div>
    </div>
  );
}
