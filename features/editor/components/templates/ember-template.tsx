import { cn } from "@/lib/utils";
import {
  RichText,
  SectionTitle,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function EmberTemplate({ template, data }: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  return (
    <div className="space-y-5">
      <header className="rounded-xl bg-neutral-950 p-4 text-neutral-100 print:bg-transparent print:text-black">
        <div className="flex items-start justify-between gap-4">
          <div>
            {fullName && <p className="text-2xl font-semibold">{fullName}</p>}
            {data.jobTitle?.length && (
              <p className="text-sm text-neutral-300 print:text-neutral-600">
                {data.jobTitle?.join?.(" · ")}
              </p>
            )}
            <p className="text-xs text-neutral-400 print:text-neutral-500">
              {[location(data.city, data.country), data.email, data.phone]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          {template.supportsPhoto && data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt={`${fullName || "Candidate"} profile`}
              className="h-12 w-12 shrink-0 rounded-lg border border-neutral-700 object-cover print:border-neutral-300"
            />
          ) : (
            <div
              className={cn("h-10 w-10 shrink-0 rounded-lg", template.accent)}
            />
          )}
        </div>
      </header>

      {data.sections.map((section) => {
        if (section.id === "summary" && data.summary) {
          return (
            <section key="summary" className="space-y-2">
              <SectionTitle label="Profile" accent={template.accent} dark />
              <RichText html={data.summary} />
            </section>
          );
        }

        if (section.id === "experience" && data.experience.length > 0) {
          return (
            <section key="experience" className="space-y-3">
              <SectionTitle label="Experience" accent={template.accent} dark />
              {data.experience.map((item, i) => (
                <div key={i} className="space-y-1 border-l-2 border-muted pl-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{item.position}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.company}
                        {location(item.city, item.country)
                          ? ` · ${location(item.city, item.country)}`
                          : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {dateRange(item.startDate, item.endDate, item.isCurrent)}
                    </span>
                  </div>
                  <RichText html={item.description} />
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "projects" && data.projects.length > 0) {
          return (
            <section key="projects" className="space-y-3">
              <SectionTitle label="Projects" accent={template.accent} dark />
              {data.projects.map((item, i) => (
                <div key={i} className="space-y-1 border-l-2 border-muted pl-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {dateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {item.url && (
                    <p className="text-xs text-muted-foreground">{item.url}</p>
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
              <SectionTitle label="Education" accent={template.accent} dark />
              {data.education.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-sm font-medium">{item.degree}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.school}
                    {location(item.city, item.country)
                      ? ` · ${location(item.city, item.country)}`
                      : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dateRange(item.startDate, item.endDate, item.isCurrent)}
                  </p>
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "skills" && data.skills.length > 0) {
          return (
            <section key="skills" className="space-y-2">
              <SectionTitle label="Skills" accent={template.accent} dark />
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-neutral-800 px-2 py-0.5 text-xs text-neutral-700 print:border-neutral-300"
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
            <section key="languages" className="space-y-2">
              <SectionTitle label="Languages" accent={template.accent} dark />
              <div className="flex flex-wrap gap-1.5">
                {data.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="flex items-baseline gap-1 rounded-full border border-neutral-800 px-2 py-0.5 text-xs text-neutral-700 print:border-neutral-300"
                  >
                    <span className="font-medium text-neutral-900 print:text-black">
                      {lang.name}
                    </span>
                    {lang.level && (
                      <span className="text-[10px] opacity-70">
                        {lang.level}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </section>
          );
        }

        if (section.id === "certifications" && data.certifications.length > 0) {
          return (
            <section key="certifications" className="space-y-2">
              <SectionTitle
                label="Certifications"
                accent={template.accent}
                dark
              />
              {data.certifications.map((item, i) => (
                <div
                  key={i}
                  className="space-y-0.5 border-l-2 border-muted pl-3"
                >
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.issuer}
                    {item.issueDate ? ` · ${formatDate(item.issueDate)}` : ""}
                  </p>
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "awards" && data.awards.length > 0) {
          return (
            <section key="awards" className="space-y-2">
              <SectionTitle label="Awards" accent={template.accent} dark />
              {data.awards.map((item, i) => (
                <div
                  key={i}
                  className="space-y-0.5 border-l-2 border-muted pl-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  {item.issuer && (
                    <p className="text-xs text-muted-foreground">
                      {item.issuer}
                    </p>
                  )}
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
          if (fieldData) {
            return (
              <section key={section.id} className="space-y-3">
                <SectionTitle
                  label={(section as any).title}
                  accent={template.accent}
                  dark
                />
                <div className="space-y-1 border-l-2 border-muted pl-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{fieldData.title}</p>
                      {fieldData.subtitle && (
                        <p className="text-xs text-muted-foreground">
                          {fieldData.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {dateRange(fieldData.startDate, fieldData.endDate)}
                    </span>
                  </div>
                  <RichText html={fieldData.description} />
                </div>
              </section>
            );
          }
        }

        return null;
      })}
    </div>
  );
}
