import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function SlateTemplate({ template, data }: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <header className="text-center space-y-1 pb-3 border-b-2 border-neutral-800">
        {fullName && (
          <p className="text-2xl font-bold tracking-tight">{fullName}</p>
        )}
        {data.jobTitle && (
          <p className="text-sm text-neutral-600">{data.jobTitle}</p>
        )}
        <p className="text-xs text-neutral-500">
          {[
            data.email,
            data.phone,
            location(data.city, data.country),
            ...(data.links ?? []).map((l) => l.url),
          ]
            .filter(Boolean)
            .join("  |  ")}
        </p>
      </header>

      {data.sections.map((section) => {
        if (section.id === "summary" && data.summary) {
          return (
            <section key="summary">
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-1.5">
                Profile
              </p>
              <RichText html={data.summary} />
            </section>
          );
        }
        if (section.id === "experience" && data.experience.length > 0) {
          return (
            <section key="experience">
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2">
                Experience
              </p>
              <div className="space-y-3">
                {data.experience.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-bold">{item.position}</p>
                      <span className="text-xs text-neutral-500">
                        {dateRange(
                          item.startDate,
                          item.endDate,
                          item.isCurrent,
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 italic">
                      {item.company}
                      {location(item.city, item.country)
                        ? `, ${location(item.city, item.country)}`
                        : ""}
                    </p>
                    <RichText
                      html={item.description}
                      className="mt-1 text-neutral-700"
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (section.id === "education" && data.education.length > 0) {
          return (
            <section key="education">
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2">
                Education
              </p>
              <div className="space-y-2">
                {data.education.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-bold">{item.degree}</p>
                      <span className="text-xs text-neutral-500">
                        {dateRange(
                          item.startDate,
                          item.endDate,
                          item.isCurrent,
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 italic">
                      {item.school}
                      {location(item.city, item.country)
                        ? `, ${location(item.city, item.country)}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (section.id === "skills" && data.skills.length > 0) {
          return (
            <section key="skills">
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-1.5">
                Skills
              </p>
              <p className="text-xs text-neutral-700">
                {data.skills.map((s) => s.name).join(" · ")}
              </p>
            </section>
          );
        }
        if (section.id === "projects" && data.projects.length > 0) {
          return (
            <section key="projects">
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2">
                Projects
              </p>
              <div className="space-y-2">
                {data.projects.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-bold">{item.title}</p>
                      <span className="text-xs text-neutral-500">
                        {dateRange(item.startDate, item.endDate)}
                      </span>
                    </div>
                    {item.url && (
                      <p className="text-xs text-neutral-500 italic">
                        {item.url}
                      </p>
                    )}
                    <RichText
                      html={item.description}
                      className="mt-1 text-neutral-700"
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (section.id === "certifications" && data.certifications.length > 0) {
          return (
            <section key="certifications">
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2">
                Certifications
              </p>
              <div className="space-y-1">
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
              </div>
            </section>
          );
        }
        if (section.id === "awards" && data.awards.length > 0) {
          return (
            <section key="awards">
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2">
                Awards
              </p>
              <div className="space-y-1">
                {data.awards.map((item, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-semibold">
                        {item.title}
                      </span>
                      {item.issuer && (
                        <span className="text-xs text-neutral-500 ml-1.5">
                          · {item.issuer}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {formatDate(item.date)}
                    </span>
                  </div>
                ))}
              </div>
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
            <section key={section.id}>
              <p className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2">
                {(section as any).title}
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-bold">{fieldData.title}</p>
                    <span className="text-xs text-neutral-500">
                      {dateRange(fieldData.startDate, fieldData.endDate)}
                    </span>
                  </div>
                  {fieldData.subtitle && (
                    <p className="text-xs text-neutral-600 italic">
                      {fieldData.subtitle}
                    </p>
                  )}
                  <RichText
                    html={fieldData.description}
                    className="mt-1 text-neutral-700"
                  />
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
}
