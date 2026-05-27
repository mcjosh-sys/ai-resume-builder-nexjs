import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function LedgerTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  const contactParts = [
    data.phone ? `Phone: ${data.phone}` : "",
    data.email ? `Email: ${data.email}` : "",
    location(data.city, data.country)
      ? `Address: ${location(data.city, data.country)}`
      : "",
    ...(data.links ?? []).map((l) => (l.name ? `${l.name}: ${l.url}` : l.url)),
  ].filter(Boolean);

  function SectionRow({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex gap-4 border-b border-neutral-200 pb-3">
        <div className="w-[26%] shrink-0 pt-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {label}
          </p>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="font-sans space-y-3">
      {/* Header */}
      <header className="border-b-2 border-neutral-800 pb-3">
        <div className="flex items-baseline justify-between gap-2">
          {fullName && (
            <p className="text-xl font-bold text-neutral-900">{fullName}</p>
          )}
          {data.jobTitle?.length && (
            <p className="text-xs text-neutral-500">
              {data.jobTitle?.join?.(" | ")}
            </p>
          )}
        </div>
        {contactParts.length > 0 && (
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0">
            {contactParts.map((part, i) => (
              <p key={i} className="text-[10px] text-neutral-600">
                {part}
              </p>
            ))}
          </div>
        )}
      </header>

      {/* Sections */}
      <div className="space-y-3">
        {data.sections.map((section) => {
          if (section.id === "summary" && data.summary) {
            return (
              <SectionRow key="summary" label="Profile">
                <RichText html={data.summary} />
              </SectionRow>
            );
          }

          if (section.id === "experience" && data.experience.length > 0) {
            return (
              <SectionRow key="experience" label="Professional Experience">
                <div className="space-y-3">
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
                      <p className="text-xs text-neutral-600">
                        {item.position}
                        {location(item.city, item.country)
                          ? ` | ${location(item.city, item.country)}`
                          : ""}
                      </p>
                      <RichText html={item.description} />
                    </div>
                  ))}
                </div>
              </SectionRow>
            );
          }

          if (section.id === "education" && data.education.length > 0) {
            return (
              <SectionRow key="education" label="Education">
                <div className="space-y-2">
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
                </div>
              </SectionRow>
            );
          }

          if (section.id === "skills" && data.skills.length > 0) {
            return (
              <SectionRow key="skills" label="Skills">
                <div className="space-y-0.5">
                  {data.skills.map((skill, i) => (
                    <p key={i} className="text-xs text-neutral-700">
                      • {skill.name}
                    </p>
                  ))}
                </div>
              </SectionRow>
            );
          }

          if (section.id === "languages" && data.languages.length > 0) {
            return (
              <SectionRow key="languages" label="Languages">
                <div className="space-y-0.5">
                  {data.languages.map((lang, i) => (
                    <p key={i} className="text-xs text-neutral-700">
                      • <span className="font-medium">{lang.name}</span>
                      {lang.level ? ` (${lang.level})` : ""}
                    </p>
                  ))}
                </div>
              </SectionRow>
            );
          }

          if (section.id === "projects" && data.projects.length > 0) {
            return (
              <SectionRow key="projects" label="Projects">
                <div className="space-y-2">
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
                        <p className="text-[10px] text-neutral-500">
                          {item.url}
                        </p>
                      )}
                      <RichText html={item.description} />
                    </div>
                  ))}
                </div>
              </SectionRow>
            );
          }

          if (
            section.id === "certifications" &&
            data.certifications.length > 0
          ) {
            return (
              <SectionRow key="certifications" label="Certificates">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {data.certifications.map((item, i) => (
                    <div key={i} className="space-y-0">
                      <p className="text-xs font-semibold text-neutral-800">
                        {item.name}
                        {item.issueDate
                          ? ` | ${formatDate(item.issueDate)}`
                          : ""}
                      </p>
                      <p className="text-xs text-neutral-500">{item.issuer}</p>
                    </div>
                  ))}
                </div>
              </SectionRow>
            );
          }

          if (section.id === "awards" && data.awards.length > 0) {
            return (
              <SectionRow key="awards" label="Awards">
                <div className="space-y-1">
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
                          <p className="text-[10px] text-neutral-500">
                            {item.issuer}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] text-neutral-500">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionRow>
            );
          }

          if (section.id.startsWith("other-field-")) {
            const otherFieldId = section.id.replace("other-field-", "");
            const fieldData = data.otherFields?.find(
              (f) => f.id === otherFieldId,
            );
            if (!fieldData) return null;
            return (
              <SectionRow key={section.id} label={(section as any).title}>
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
                    <p className="text-xs text-neutral-600">
                      {fieldData.subtitle}
                    </p>
                  )}
                  <RichText html={fieldData.description} />
                </div>
              </SectionRow>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
