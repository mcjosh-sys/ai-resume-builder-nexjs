import { cn } from "@/lib/utils";
import { Calendar, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

function VanguardSectionTitle({
  label,
  textColor,
  accentColor,
}: {
  label: string;
  textColor: string;
  accentColor: string;
}) {
  return (
    <div className="space-y-1.5 mt-5 mb-3 break-inside-avoid">
      <p className="text-xs font-extrabold uppercase tracking-widest text-neutral-900">
        {label}
      </p>
      <div className={cn("h-0.75 w-full rounded-sm", accentColor)} />
    </div>
  );
}

export function VanguardTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentColor = template.accent; // e.g. bg-blue-600
  const textColor = accentColor.replace("bg-", "text-");
  const borderColor = accentColor.replace("bg-", "border-");

  return (
    <div className="space-y-5 font-sans text-neutral-800 max-w-200 mx-auto p-2 leading-normal">
      {/* Header with Photo on Right */}
      <header className="flex justify-between items-start gap-4 pb-3 border-b border-neutral-100">
        <div className="space-y-2 flex-1">
          {fullName && (
            <p className="text-3xl font-extrabold tracking-tight text-neutral-950 uppercase">
              {fullName}
            </p>
          )}
          {data.jobTitle?.length && (
            <p
              className={cn(
                "text-xs font-bold tracking-wider uppercase",
                textColor,
              )}
            >
              {data.jobTitle?.join?.(" | ")}
            </p>
          )}

          {/* Single Row Contact details with small blue icons */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] text-neutral-600 font-medium">
            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone className={cn("w-3.5 h-3.5", textColor)} />
                {data.phone}
              </span>
            )}
            {data.email && (
              <span className="flex items-center gap-1">
                <Mail className={cn("w-3.5 h-3.5", textColor)} />
                {data.email}
              </span>
            )}
            {location(data.city, data.country) && (
              <span className="flex items-center gap-1">
                <MapPin className={cn("w-3.5 h-3.5", textColor)} />
                {location(data.city, data.country)}
              </span>
            )}
            {(data.links ?? []).map((l, i) => {
              const isLinkedin =
                l.name?.toLowerCase().includes("linkedin") ||
                l.url?.toLowerCase().includes("linkedin");
              return (
                <span key={i} className="flex items-center gap-1">
                  {isLinkedin ? (
                    <Linkedin className={cn("w-3.5 h-3.5", textColor)} />
                  ) : (
                    <Globe className={cn("w-3.5 h-3.5", textColor)} />
                  )}
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {l.name || "Link"}
                  </a>
                </span>
              );
            })}
          </div>
        </div>

        {template.supportsPhoto && data.photoUrl && (
          <img
            src={data.photoUrl}
            alt={`${fullName || "Candidate"} profile`}
            className={cn(
              "h-20 w-20 rounded-full object-cover shrink-0 border-2 shadow-md",
              borderColor,
            )}
          />
        )}
      </header>

      {/* Body sections */}
      <div className="space-y-4">
        {data.sections.map((section) => {
          if (section.id === "summary" && data.summary) {
            return (
              <section key="summary" className="space-y-2">
                <VanguardSectionTitle
                  label="Summary"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <RichText
                  html={data.summary}
                  className="text-neutral-700 text-xs leading-relaxed"
                />
              </section>
            );
          }

          if (section.id === "experience" && data.experience.length > 0) {
            return (
              <section key="experience" className="space-y-1">
                <VanguardSectionTitle
                  label="Work Experience"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="space-y-3">
                  {data.experience.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      {i > 0 && (
                        <div className="border-t border-dashed border-neutral-200 my-2" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-neutral-900">
                          {item.position}
                        </p>
                        <p
                          className={cn("text-xs font-bold mt-0.5", textColor)}
                        >
                          {item.company}
                        </p>
                      </div>

                      {/* Icon Metadata Row */}
                      <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {dateRange(
                            item.startDate,
                            item.endDate,
                            item.isCurrent,
                          )}
                        </span>
                        {location(item.city, item.country) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {location(item.city, item.country)}
                          </span>
                        )}
                      </div>
                      <RichText
                        html={item.description}
                        className="text-neutral-700 text-xs leading-relaxed pt-0.5"
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "education" && data.education.length > 0) {
            return (
              <section key="education" className="space-y-1">
                <VanguardSectionTitle
                  label="Education"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="space-y-3">
                  {data.education.map((item, i) => (
                    <div key={i} className="space-y-1.5 break-inside-avoid">
                      {i > 0 && (
                        <div className="border-t border-dashed border-neutral-200 my-2" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-neutral-900">
                          {item.degree}
                        </p>
                        <p
                          className={cn("text-xs font-bold mt-0.5", textColor)}
                        >
                          {item.school}
                        </p>
                      </div>

                      {/* Icon Metadata Row */}
                      <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {dateRange(
                            item.startDate,
                            item.endDate,
                            item.isCurrent,
                          )}
                        </span>
                        {location(item.city, item.country) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {location(item.city, item.country)}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <RichText
                          html={item.description}
                          className="text-neutral-700 text-xs mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "skills" && data.skills.length > 0) {
            return (
              <section key="skills" className="space-y-2">
                <VanguardSectionTitle
                  label="Skills"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={cn(
                        "bg-white border border-neutral-200 border-b-2 px-3 py-1 font-bold text-[11px] text-neutral-800 rounded-sm shadow-sm hover:translate-y-[-0.5px] transition-transform",
                        `border-b-${textColor.split("-")[1]}-${textColor.split("-")[2] || "500"}`,
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
              <section key="languages" className="space-y-2">
                <VanguardSectionTitle
                  label="Languages"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((lang, i) => (
                    <span
                      key={i}
                      className={cn(
                        "bg-white border border-neutral-200 border-b-2 px-3 py-1 font-bold text-[11px] text-neutral-800 rounded-sm shadow-sm flex items-center gap-1.5",
                        `border-b-${textColor.split("-")[1]}-${textColor.split("-")[2] || "500"}`,
                      )}
                    >
                      <span>{lang.name}</span>
                      {lang.level && (
                        <span className="text-[10px] text-neutral-400 font-normal">
                          ({lang.level})
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
              <section key="projects" className="space-y-2">
                <VanguardSectionTitle
                  label="Projects"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="grid grid-cols-2 gap-4">
                  {data.projects.map((item, i) => (
                    <div
                      key={i}
                      className="space-y-1.5 p-3 rounded border border-neutral-100 shadow-sm break-inside-avoid"
                    >
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-xs font-bold text-neutral-900">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-neutral-500 font-semibold shrink-0">
                          {dateRange(item.startDate, item.endDate)}
                        </span>
                      </div>
                      {item.url && (
                        <p className="text-[10px] text-neutral-400 truncate">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {item.url.replace(/^https?:\/\//, "")}
                          </a>
                        </p>
                      )}
                      <RichText
                        html={item.description}
                        className="text-neutral-600 text-xs mt-1"
                      />
                    </div>
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
              <section key="certifications" className="space-y-2">
                <VanguardSectionTitle
                  label="Certifications"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {data.certifications.map((item, i) => (
                    <div key={i} className="space-y-1 break-inside-avoid">
                      <div className="flex justify-between items-baseline gap-2 text-xs">
                        <span className="font-bold text-neutral-900">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                          {formatDate(item.issueDate)}
                        </span>
                      </div>
                      {item.issuer && (
                        <p className="text-[10px] text-neutral-500 font-medium">
                          {item.issuer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "awards" && data.awards.length > 0) {
            return (
              <section key="awards" className="space-y-2">
                <VanguardSectionTitle
                  label="Key Achievements"
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="grid grid-cols-2 gap-4">
                  {data.awards.map((item, i) => (
                    <div
                      key={i}
                      className="space-y-1.5 p-3 rounded border border-neutral-100 shadow-sm break-inside-avoid"
                    >
                      <div className="flex justify-between items-baseline gap-2 text-xs">
                        <p className={cn("font-bold", textColor)}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      {item.issuer && (
                        <p className="text-[10px] text-neutral-500 font-medium">
                          {item.issuer}
                        </p>
                      )}
                      <RichText
                        html={item.description}
                        className="text-neutral-600 text-xs mt-1"
                      />
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
                <VanguardSectionTitle
                  label={(section as any).title}
                  textColor={textColor}
                  accentColor={accentColor}
                />
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">
                        {fieldData.title}
                      </p>
                      {fieldData.subtitle && (
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {fieldData.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                      {dateRange(fieldData.startDate, fieldData.endDate)}
                    </span>
                  </div>
                  <RichText
                    html={fieldData.description}
                    className="text-neutral-700 text-xs"
                  />
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
