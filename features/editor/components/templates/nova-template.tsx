import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function NovaTemplate({ template, data }: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentBg = template.accent; // e.g. bg-violet-500

  return (
    <div className="flex min-h-full">
      {/* Sidebar */}
      <aside className="w-[38%] shrink-0 bg-neutral-900 text-neutral-100 p-5 space-y-5 print:bg-neutral-900">
        {/* Avatar / accent badge */}
        {template.supportsPhoto && data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt={`${fullName || "Candidate"} profile`}
            className="h-16 w-16 rounded-2xl border border-neutral-700 object-cover"
          />
        ) : (
          <div className={cn("h-14 w-14 rounded-2xl", accentBg)} />
        )}

        {fullName && (
          <div>
            <p className="text-lg font-bold leading-tight">{fullName}</p>
            {data.jobTitle?.length && (
              <p className="text-xs text-neutral-300 mt-0.5">
                {data.jobTitle?.join?.(" · ")}
              </p>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Contact
          </p>
          {data.email && (
            <p className="text-xs text-neutral-200 break-all">{data.email}</p>
          )}
          {data.phone && (
            <p className="text-xs text-neutral-200">{data.phone}</p>
          )}
          {location(data.city, data.country) && (
            <p className="text-xs text-neutral-200">
              {location(data.city, data.country)}
            </p>
          )}
          {(data.links ?? []).map((l, i) => (
            <p key={i} className="text-xs text-neutral-300 break-all">
              {l.url}
            </p>
          ))}
        </div>

        {/* Skills in sidebar */}
        {data.sections.some((s) => s.id === "skills") &&
          data.skills.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Skills
              </p>
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      accentBg,
                    )}
                  />
                  <span className="text-xs text-neutral-200">{skill.name}</span>
                </div>
              ))}
            </div>
          )}

        {/* Languages in sidebar */}
        {data.sections.some((s) => s.id === "languages") &&
          data.languages.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Languages
              </p>
              {data.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      accentBg,
                    )}
                  />
                  <span className="text-xs text-neutral-200 flex items-baseline gap-1">
                    <span className="font-medium">{lang.name}</span>
                    {lang.level && (
                      <span className="text-[10px] opacity-70">
                        ({lang.level})
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

        {/* Education in sidebar */}
        {data.sections.some((s) => s.id === "education") &&
          data.education.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Education
              </p>
              {data.education.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-xs font-medium text-neutral-100">
                    {item.degree}
                  </p>
                  <p className="text-xs text-neutral-300">{item.school}</p>
                  <p className="text-xs text-neutral-400">
                    {dateRange(item.startDate, item.endDate, item.isCurrent)}
                  </p>
                </div>
              ))}
            </div>
          )}

        {/* Certifications in sidebar */}
        {data.sections.some((s) => s.id === "certifications") &&
          data.certifications.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Certifications
              </p>
              {data.certifications.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-xs font-medium text-neutral-100">
                    {item.name}
                  </p>
                  <p className="text-xs text-neutral-300">
                    {item.issuer}
                    {item.issueDate ? ` · ${formatDate(item.issueDate)}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
      </aside>

      {/* Main */}
      <main className="flex-1 p-5 space-y-5">
        {data.summary && data.sections.some((s) => s.id === "summary") && (
          <section className="space-y-1.5">
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-widest",
                accentBg.replace("bg-", "text-"),
              )}
            >
              About
            </p>
            <RichText html={data.summary} />
          </section>
        )}

        {data.sections.some((s) => s.id === "experience") &&
          data.experience.length > 0 && (
            <section className="space-y-3">
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-widest",
                  accentBg.replace("bg-", "text-"),
                )}
              >
                Experience
              </p>
              {data.experience.map((item, i) => (
                <div key={i} className="space-y-1">
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
          )}

        {data.sections.some((s) => s.id === "projects") &&
          data.projects.length > 0 && (
            <section className="space-y-3">
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-widest",
                  accentBg.replace("bg-", "text-"),
                )}
              >
                Projects
              </p>
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
                  <RichText html={item.description} />
                </div>
              ))}
            </section>
          )}

        {data.sections.some((s) => s.id === "awards") &&
          data.awards.length > 0 && (
            <section className="space-y-2">
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-widest",
                  accentBg.replace("bg-", "text-"),
                )}
              >
                Awards
              </p>
              {data.awards.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    {item.issuer && (
                      <p className="text-xs text-muted-foreground">
                        {item.issuer}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(item.date)}
                  </span>
                </div>
              ))}
            </section>
          )}

        {data.sections
          .filter((s) => s.id.startsWith("other-field-"))
          .map((section) => {
            const fieldData = data.otherFields?.find(
              (f) => f.id === section.id.replace("other-field-", ""),
            );
            if (!fieldData) return null;
            return (
              <section key={section.id} className="space-y-3">
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    accentBg.replace("bg-", "text-"),
                  )}
                >
                  {(section as any).title}
                </p>
                <div className="space-y-1">
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
          })}
      </main>
    </div>
  );
}
