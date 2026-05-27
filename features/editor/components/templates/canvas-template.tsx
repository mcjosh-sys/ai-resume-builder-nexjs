import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

function MercadoSidebarHeading({
  label,
  accent,
}: {
  label: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 mt-3 mb-1.5 first:mt-0">
      <span
        className={cn("h-1 w-1 rounded-full bg-white opacity-60 shrink-0")}
      />
      <p className="text-[10px] font-bold uppercase tracking-widest text-white opacity-80">
        {label}
      </p>
    </div>
  );
}

function MercadoMainHeading({
  label,
  accent,
}: {
  label: string;
  accent: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-widest",
          accent.replace("bg-", "text-"),
        )}
      >
        {label}
      </p>
      <div
        className={cn(
          "flex-1 h-px",
          accent.replace("bg-", "bg-") + " opacity-20",
        )}
      />
    </div>
  );
}

export function CanvasTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentBg = template.accent;

  return (
    <div className="flex min-h-full font-sans">
      {/* Dark sidebar */}
      <aside
        className={cn(
          "w-[35%] shrink-0 p-4 space-y-3 text-white",
          accentBg,
          "print:bg-neutral-900",
        )}
      >
        {/* Photo or accent block + name in sidebar */}
        {template.supportsPhoto && data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt={`${fullName || "Candidate"} profile`}
            className="h-20 w-20 rounded-lg border-2 border-white border-opacity-20 object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-white bg-opacity-15" />
        )}

        {/* Name in sidebar */}
        {fullName && (
          <div className="mt-1">
            <p className="text-base font-bold text-white leading-tight">
              {fullName}
            </p>
            {data.jobTitle?.length && (
              <p className="text-[11px] text-white opacity-70 mt-0.5">
                {data.jobTitle?.join?.(" · ")}
              </p>
            )}
          </div>
        )}

        {/* Contact */}
        <MercadoSidebarHeading label="Contact" />
        <div className="space-y-1.5">
          {data.phone && (
            <div className="space-y-0">
              <p className="text-[10px] text-white text-opacity-60 uppercase tracking-wide">
                Phone
              </p>
              <p className="text-xs text-white">{data.phone}</p>
            </div>
          )}
          {data.email && (
            <div className="space-y-0">
              <p className="text-[10px] text-white text-opacity-60 uppercase tracking-wide">
                Email
              </p>
              <p className="text-xs text-white break-all">{data.email}</p>
            </div>
          )}
          {location(data.city, data.country) && (
            <div className="space-y-0">
              <p className="text-[10px] text-white text-opacity-60 uppercase tracking-wide">
                Address
              </p>
              <p className="text-xs text-white">
                {location(data.city, data.country)}
              </p>
            </div>
          )}
          {(data.links ?? []).map((l, i) => (
            <p key={i} className="text-xs text-white break-all">
              {l.url}
            </p>
          ))}
        </div>

        {data.sections.map((section) => {
          if (section.id === "skills" && data.skills.length > 0) {
            return (
              <div key="skills">
                <MercadoSidebarHeading label="Expertise" />
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded border border-white border-opacity-30 px-1.5 py-0.5 text-[10px] text-white"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          if (section.id === "languages" && data.languages.length > 0) {
            return (
              <div key="languages">
                <MercadoSidebarHeading label="Languages" />
                <div className="flex flex-wrap gap-1">
                  {data.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="flex items-baseline gap-1 rounded border border-white border-opacity-30 px-1.5 py-0.5 text-[10px] text-white"
                    >
                      <span className="font-medium">{lang.name}</span>
                      {lang.level && (
                        <span className="opacity-70">({lang.level})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          if (
            section.id === "certifications" &&
            data.certifications.length > 0
          ) {
            return (
              <div key="certifications">
                <MercadoSidebarHeading label="Certifications" />
                <div className="space-y-0.5">
                  {data.certifications.map((item, i) => (
                    <p key={i} className="text-xs text-white">
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>
            );
          }

          if (section.id === "awards" && data.awards.length > 0) {
            return (
              <div key="awards">
                <MercadoSidebarHeading label="Awards" />
                <div className="space-y-2">
                  {data.awards.map((item, i) => (
                    <div key={i} className="space-y-0">
                      {item.date && (
                        <p className="text-[10px] text-white text-opacity-60">
                          {item.date}
                          {item.issuer ? ` · ${item.issuer}` : ""}
                        </p>
                      )}
                      <p className="text-xs text-white font-medium">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.id === "education" && data.education.length > 0) {
            return (
              <div key="education">
                <MercadoSidebarHeading label="Education" />
                <div className="space-y-2">
                  {data.education.map((item, i) => (
                    <div key={i} className="space-y-0">
                      <p className="text-[10px] text-white text-opacity-60">
                        {dateRange(
                          item.startDate,
                          item.endDate,
                          item.isCurrent,
                        )}
                      </p>
                      <p className="text-xs font-semibold text-white">
                        {item.school}
                      </p>
                      <p className="text-xs text-white">{item.degree}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.id.startsWith("other-field-")) {
            const otherFieldId = section.id.replace("other-field-", "");
            const fieldData = data.otherFields?.find(
              (f) => f.id === otherFieldId,
            );
            if (!fieldData) return null;
            return (
              <div key={section.id}>
                <MercadoSidebarHeading label={(section as any).title} />
                <p className="text-xs font-semibold text-white">
                  {fieldData.title}
                </p>
                {fieldData.subtitle && (
                  <p className="text-xs text-white text-opacity-70">
                    {fieldData.subtitle}
                  </p>
                )}
                <RichText
                  html={fieldData.description}
                  className="text-white text-xs"
                />
              </div>
            );
          }

          return null;
        })}
      </aside>

      {/* Main content — no separate name header since it's in the sidebar */}
      <main className="flex-1 p-5 space-y-4">
        {data.sections.map((section) => {
          if (section.id === "summary" && data.summary) {
            return (
              <section key="summary">
                <MercadoMainHeading label="Profile" accent={accentBg} />
                <RichText html={data.summary} />
              </section>
            );
          }

          if (section.id === "experience" && data.experience.length > 0) {
            return (
              <section key="experience" className="space-y-2.5">
                <MercadoMainHeading label="Experience" accent={accentBg} />
                {data.experience.map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      "pl-3 border-l-2 space-y-0.5",
                      accentBg.replace(/bg-([a-z]+)-\d+/, "border-$1-300"),
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-bold text-neutral-800">
                        {item.position}
                      </p>
                      <span className="shrink-0 text-[10px] text-neutral-500">
                        {dateRange(
                          item.startDate,
                          item.endDate,
                          item.isCurrent,
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {item.company}
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
              <section key="projects" className="space-y-2.5">
                <MercadoMainHeading label="Projects" accent={accentBg} />
                {data.projects.map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      "pl-3 border-l-2 space-y-0.5",
                      accentBg.replace(/bg-([a-z]+)-\d+/, "border-$1-300"),
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
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

          // Sidebar sections handled in the sidebar
          if (
            [
              "education",
              "skills",
              "certifications",
              "awards",
              "languages",
            ].includes(section.id)
          ) {
            return null;
          }

          return null;
        })}
      </main>
    </div>
  );
}
