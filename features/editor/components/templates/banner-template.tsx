import { cn } from "@/lib/utils";
import {
  RichText,
  dateRange,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

function SidebarHeading({
  label,
}: {
  label: string;
}) {
  return (
    <div className="mb-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white text-opacity-90">
        {label}
      </p>
      <hr className="mt-0.5 border-t border-white border-opacity-30" />
    </div>
  );
}

function MainHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="mb-2">
      <p className={cn("text-xs font-bold uppercase tracking-widest", accent.replace("bg-", "text-"))}>
        {label}
      </p>
      <hr className={cn("mt-0.5 border-t", accent.replace("bg-", "border-"))} />
    </div>
  );
}

export function BannerTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentBg = template.accent;
  const accentLight = accentBg.replace(/bg-([a-z]+)-\d+/, "bg-$1-50");

  const hasSidebar = data.sections.some((s) =>
    ["education", "skills", "certifications", "awards"].includes(s.id),
  );

  return (
    <div className="font-sans min-h-full flex flex-col">
      {/* Accent top bar */}
      <div className={cn("h-1.5 w-full", accentBg)} />

      {/* Header — centered, plain white bg */}
      <header className="text-center py-4 px-5 bg-white border-b border-neutral-100">
        {fullName && (
          <p className="text-xl font-bold uppercase tracking-widest text-neutral-900">
            {fullName}
          </p>
        )}
        {data.jobTitle && (
          <p className="text-xs text-neutral-500 mt-0.5">{data.jobTitle}</p>
        )}
        <p className="text-xs text-neutral-400 mt-1">
          {[
            location(data.city, data.country),
            data.email,
            data.phone,
          ]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Left sidebar – solid accent background */}
        {hasSidebar && (
          <aside className={cn("w-[36%] shrink-0 p-4 space-y-4 text-white", accentBg)}>
            {/* Contact */}
            <div className="space-y-1">
              <SidebarHeading label="Contact" />
              {data.phone && (
                <p className="text-xs text-white flex items-start gap-1.5">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-sm bg-white opacity-70 shrink-0" />
                  {data.phone}
                </p>
              )}
              {data.email && (
                <p className="text-xs text-white break-all flex items-start gap-1.5">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-sm bg-white opacity-70 shrink-0" />
                  {data.email}
                </p>
              )}
              {location(data.city, data.country) && (
                <p className="text-xs text-white flex items-start gap-1.5">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-sm bg-white opacity-70 shrink-0" />
                  {location(data.city, data.country)}
                </p>
              )}
              {(data.links ?? []).map((l, i) => (
                <p
                  key={i}
                  className="text-xs text-white break-all flex items-start gap-1.5"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-sm bg-white opacity-70 shrink-0" />
                  {l.url}
                </p>
              ))}
            </div>

            {data.sections.map((section) => {
              if (section.id === "education" && data.education.length > 0) {
                return (
                  <div key="education" className="space-y-2">
                    <SidebarHeading label="Education" />
                    {data.education.map((item, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="text-[10px] text-white opacity-70">
                          {dateRange(item.startDate, item.endDate, item.isCurrent)}
                        </p>
                        <p className="text-xs font-semibold text-white">
                          {item.school}
                        </p>
                        <p className="text-xs text-white opacity-80">{item.degree}</p>
                        {item.description && (
                          <RichText html={item.description} className="text-xs text-white" />
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              if (section.id === "skills" && data.skills.length > 0) {
                return (
                  <div key="skills" className="space-y-1.5">
                    <SidebarHeading label="Skills" />
                    {data.skills.map((skill, i) => (
                      <p key={i} className="text-xs text-white flex items-start gap-1.5">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-sm bg-white opacity-70 shrink-0" />
                        {skill.name}
                      </p>
                    ))}
                  </div>
                );
              }

              if (section.id === "certifications" && data.certifications.length > 0) {
                return (
                  <div key="certifications" className="space-y-1">
                    <SidebarHeading label="Certifications" />
                    {data.certifications.map((item, i) => (
                      <p key={i} className="text-xs text-white flex items-start gap-1.5">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-sm bg-white opacity-70 shrink-0" />
                        {item.name}
                      </p>
                    ))}
                  </div>
                );
              }

              if (section.id === "awards" && data.awards.length > 0) {
                return (
                  <div key="awards" className="space-y-1.5">
                    <SidebarHeading label="Awards" />
                    {data.awards.map((item, i) => (
                      <div key={i} className="space-y-0.5">
                        <p className="text-xs font-semibold text-white">
                          {item.title}
                        </p>
                        {item.issuer && (
                          <p className="text-xs text-white opacity-70">{item.issuer}</p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              if (section.id.startsWith("other-field-")) {
                const otherFieldId = section.id.replace("other-field-", "");
                const fieldData = data.otherFields?.find((f) => f.id === otherFieldId);
                if (!fieldData) return null;
                return (
                  <div key={section.id} className="space-y-1">
                    <SidebarHeading
                      label={(section as any).title}
                    />
                    <p className="text-xs font-semibold text-white">
                      {fieldData.title}
                    </p>
                    {fieldData.subtitle && (
                      <p className="text-xs text-white opacity-70">{fieldData.subtitle}</p>
                    )}
                    <RichText html={fieldData.description} className="text-xs text-white" />
                  </div>
                );
              }

              return null;
            })}
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 space-y-4">
          {data.sections.map((section) => {
            if (section.id === "summary" && data.summary) {
              return (
                <section key="summary" className="space-y-1">
                  <MainHeading label="Profile Summary" accent={accentBg} />
                  <RichText html={data.summary} />
                </section>
              );
            }

            if (
              section.id === "experience" &&
              data.experience.length > 0
            ) {
              return (
                <section key="experience" className="space-y-3">
                  <MainHeading label="Work Experience" accent={accentBg} />
                  {data.experience.map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-bold text-neutral-800">
                          {item.company}
                        </p>
                        <span className="shrink-0 text-xs text-neutral-500">
                          {dateRange(item.startDate, item.endDate, item.isCurrent)}
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
                  <MainHeading label="Projects" accent={accentBg} />
                  {data.projects.map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-bold text-neutral-800">
                          {item.title}
                        </p>
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

            // Sidebar sections handled in the sidebar column
            if (
              ["education", "skills", "certifications", "awards"].includes(
                section.id,
              )
            ) {
              return null;
            }

            return null;
          })}
        </main>
      </div>
    </div>
  );
}
