import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function SummitTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentColor = template.accent; // e.g. bg-slate-700
  const textColor = accentColor.replace("bg-", "text-");

  // Format header contact info in a single line
  const contactParts = [
    data.phone,
    data.email,
    ...(data.links ?? []).map((l) => l.name || l.url),
    location(data.city, data.country),
  ].filter(Boolean);

  return (
    <div className="space-y-6 font-sans text-neutral-800 max-w-[800px] mx-auto p-2 leading-relaxed">
      {/* Centered Header */}
      <header className="text-center space-y-2 pb-4 border-b border-neutral-200">
        {fullName && (
          <p className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {fullName}
          </p>
        )}
        {data.jobTitle?.length && (
          <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
            {data.jobTitle?.join?.(" | ")}
          </p>
        )}
        {contactParts.length > 0 && (
          <p className="text-xs text-neutral-500 font-medium">
            {contactParts.join("   •   ")}
          </p>
        )}
      </header>

      {/* Body sections */}
      <div className="space-y-6">
        {data.sections.map((section) => {
          if (section.id === "summary" && data.summary) {
            return (
              <section key="summary" className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Summary
                </p>
                <RichText html={data.summary} className="text-xs text-neutral-700 leading-relaxed" />
              </section>
            );
          }

          if (section.id === "experience" && data.experience.length > 0) {
            return (
              <section key="experience" className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Experience
                </p>
                <div className="space-y-4">
                  {data.experience.map((item, i) => (
                    <div key={i} className="space-y-1.5 break-inside-avoid">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{item.position}</p>
                          {item.company && (
                            <p className={cn("text-xs font-semibold mt-0.5", textColor)}>
                              {item.company}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0 text-xs">
                          {location(item.city, item.country) && (
                            <p className="text-neutral-500 font-medium">{location(item.city, item.country)}</p>
                          )}
                          <p className="text-neutral-400 mt-0.5 font-medium">
                            {dateRange(item.startDate, item.endDate, item.isCurrent)}
                          </p>
                        </div>
                      </div>
                      <RichText html={item.description} className="text-neutral-600 text-xs leading-relaxed" />
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "education" && data.education.length > 0) {
            return (
              <section key="education" className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Education
                </p>
                <div className="space-y-3">
                  {data.education.map((item, i) => (
                    <div key={i} className="flex justify-between items-start gap-4 break-inside-avoid">
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{item.degree}</p>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">{item.school}</p>
                        {item.description && <RichText html={item.description} className="text-neutral-600 text-xs mt-1.5" />}
                      </div>
                      <div className="text-right shrink-0 text-xs">
                        {location(item.city, item.country) && (
                          <p className="text-neutral-500 font-medium">{location(item.city, item.country)}</p>
                        )}
                        <p className="text-neutral-400 mt-0.5 font-medium">
                          {dateRange(item.startDate, item.endDate, item.isCurrent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "skills" && data.skills.length > 0) {
            return (
              <section key="skills" className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Skills
                </p>
                <p className="text-xs text-neutral-600 font-medium">
                  {data.skills.map((s) => s.name).join(", ")}
                </p>
              </section>
            );
          }

          if (section.id === "languages" && data.languages.length > 0) {
            return (
              <section key="languages" className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Languages
                </p>
                <p className="text-xs text-neutral-600 font-medium">
                  {data.languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("   •   ")}
                </p>
              </section>
            );
          }

          if (section.id === "projects" && data.projects.length > 0) {
            return (
              <section key="projects" className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Projects
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {data.projects.map((item, i) => (
                    <div key={i} className="space-y-1 break-inside-avoid">
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-xs font-bold text-neutral-900">{item.title}</p>
                        <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                          {dateRange(item.startDate, item.endDate)}
                        </span>
                      </div>
                      {item.url && (
                        <p className="text-[10px] text-neutral-400">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {item.url.replace(/^https?:\/\//, "")}
                          </a>
                        </p>
                      )}
                      <RichText html={item.description} className="text-neutral-600 text-xs mt-1" />
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "certifications" && data.certifications.length > 0) {
            return (
              <section key="certifications" className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Certifications
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {data.certifications.map((item, i) => (
                    <div key={i} className="flex justify-between items-baseline gap-2 text-xs break-inside-avoid">
                      <div>
                        <span className="font-bold text-neutral-900">{item.name}</span>
                        {item.issuer && <span className="text-neutral-500 ml-1.5">({item.issuer})</span>}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium shrink-0">
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
              <section key="awards" className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Key Achievements
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {data.awards.map((item, i) => (
                    <div key={i} className="space-y-0.5 break-inside-avoid">
                      <div className="flex justify-between items-start gap-2">
                        <p className={cn("text-xs font-bold", textColor)}>{item.title}</p>
                        <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      {item.issuer && <p className="text-[10px] text-neutral-400 font-semibold">{item.issuer}</p>}
                      <RichText html={item.description} className="text-neutral-600 text-xs mt-1" />
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
              <section key={section.id} className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  {(section as any).title}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{fieldData.title}</p>
                      {fieldData.subtitle && <p className="text-[10px] text-neutral-500 mt-0.5">{fieldData.subtitle}</p>}
                    </div>
                    <span className="text-xs text-neutral-400 font-medium shrink-0">
                      {dateRange(fieldData.startDate, fieldData.endDate)}
                    </span>
                  </div>
                  <RichText html={fieldData.description} className="text-neutral-700 text-xs" />
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
