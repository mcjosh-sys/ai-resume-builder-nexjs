import {
  ContactLine,
  RichText,
  SectionTitle,
  dateRange,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function AuroraTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  return (
    <div className="space-y-4 scroll-pt-6">
      {/* Header is always first */}
      <header className="space-y-1">
        {fullName && <p className="text-2xl font-semibold">{fullName}</p>}
        {data.jobTitle?.length && (
          <p className="text-sm text-muted-foreground">
            {data.jobTitle?.join?.(" · ")}
          </p>
        )}
        <ContactLine data={data} />
      </header>

      {data.sections.map((section) => {
        if (section.id === "summary" && data.summary) {
          return (
            <section key="summary" className="space-y-2">
              <SectionTitle label="Summary" accent={template.accent} />
              <RichText html={data.summary} />
            </section>
          );
        }

        if (section.id === "experience" && data.experience.length > 0) {
          return (
            <section key="experience" className="space-y-3">
              <SectionTitle label="Experience" accent={template.accent} />
              {data.experience.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-start justify-between gap-2 break-inside-avoid">
                    <div>
                      <p className="text-sm font-medium">{item.position}</p>
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

        if (section.id === "education" && data.education.length > 0) {
          return (
            <section key="education" className="space-y-2">
              <SectionTitle label="Education" accent={template.accent} />
              {data.education.map((item, i) => (
                <div key={i} className="space-y-0.5 break-inside-avoid">
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
                  <RichText html={item.description} />
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "skills" && data.skills.length > 0) {
          return (
            <section key="skills" className="space-y-2">
              <SectionTitle label="Skills" accent={template.accent} />
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
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
              <SectionTitle label="Languages" accent={template.accent} />
              <div className="flex flex-wrap gap-1.5">
                {data.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="flex items-baseline gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    <span className="font-medium text-foreground">
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

        if (section.id === "projects" && data.projects.length > 0) {
          return (
            <section key="projects" className="space-y-3">
              <SectionTitle label="Projects" accent={template.accent} />
              {data.projects.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.url && (
                        <p className="text-xs text-muted-foreground">
                          {item.url}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {dateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  <RichText html={item.description} />
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "certifications" && data.certifications.length > 0) {
          return (
            <section key="certifications" className="space-y-2">
              <SectionTitle label="Certifications" accent={template.accent} />
              {data.certifications.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.issuer}
                    {item.issueDate ? ` · ${item.issueDate}` : ""}
                  </p>
                </div>
              ))}
            </section>
          );
        }

        if (section.id === "awards" && data.awards.length > 0) {
          return (
            <section key="awards" className="space-y-2">
              <SectionTitle label="Awards" accent={template.accent} />
              {data.awards.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                  {item.issuer && (
                    <p className="text-xs text-muted-foreground">
                      {item.issuer}
                    </p>
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
          if (fieldData) {
            return (
              <section key={section.id} className="space-y-3">
                <SectionTitle
                  label={(section as any).title}
                  accent={template.accent}
                />
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{fieldData.title}</p>
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
