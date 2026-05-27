import { cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  Linkedin,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  FolderGit2,
  FileBadge
} from "lucide-react";
import {
  RichText,
  dateRange,
  formatDate,
  location,
  type ResumeTemplateRendererProps,
} from "./shared";

export function ChronicleTemplate({
  template,
  data,
}: ResumeTemplateRendererProps) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const accentColor = template.accent; // e.g. bg-teal-600
  const textColor = accentColor.replace("bg-", "text-");
  const borderColor = accentColor.replace("bg-", "border-");

  return (
    <div className="space-y-6 font-sans text-neutral-800 max-w-[800px] mx-auto p-2">
      {/* Header */}
      <header className="flex justify-between items-start gap-4 pb-4 border-b border-neutral-100">
        <div className="space-y-2 flex-1">
          {fullName && (
            <p className={cn("text-3xl font-extrabold tracking-wide", textColor)}>
              {fullName}
            </p>
          )}
          {data.jobTitle?.length && (
            <p className={cn("text-sm font-semibold tracking-wider uppercase opacity-90", textColor)}>
              {data.jobTitle?.join?.(" | ")}
            </p>
          )}
          {/* Contact Details with Icons */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-neutral-600">
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
              const isLinkedin = l.name?.toLowerCase().includes("linkedin") || l.url?.toLowerCase().includes("linkedin");
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
            className={cn("h-20 w-20 rounded-full object-cover shrink-0 border-2 shadow-sm", borderColor)}
          />
        )}
      </header>

      {/* Sections rendering */}
      <div className="space-y-6">
        {data.sections.map((section) => {
          if (section.id === "summary" && data.summary) {
            return (
              <section key="summary" className="space-y-2">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Summary
                </p>
                <RichText html={data.summary} className="text-neutral-700 text-xs leading-relaxed" />
              </section>
            );
          }

          if (section.id === "experience" && data.experience.length > 0) {
            return (
              <section key="experience" className="space-y-4">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Experience
                </p>
                <div className="space-y-0.5">
                  {data.experience.map((item, i) => (
                    <div key={i} className="flex gap-4 relative break-inside-avoid">
                      {/* Left Side: Date & Location */}
                      <div className="w-28 text-right shrink-0 pt-1">
                        <p className="text-xs font-bold text-neutral-800">
                          {dateRange(item.startDate, item.endDate, item.isCurrent)}
                        </p>
                        {location(item.city, item.country) && (
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            {location(item.city, item.country)}
                          </p>
                        )}
                      </div>

                      {/* Middle: Timeline Dot & Spine */}
                      <div className="relative flex flex-col items-center shrink-0 w-4">
                        <div className={cn("w-2 h-2 rounded-full z-10 mt-2.5", accentColor)} />
                        {i < data.experience.length - 1 && (
                          <div className="absolute top-2.5 bottom-[-16px] w-0.5 bg-neutral-200" />
                        )}
                      </div>

                      {/* Right Side: Content */}
                      <div className="flex-1 pb-4 pt-0.5">
                        <p className={cn("text-sm font-bold", textColor)}>
                          {item.position}
                        </p>
                        {item.company && (
                          <p className={cn("text-xs font-semibold mt-0.5 opacity-90", textColor)}>
                            {item.company}
                          </p>
                        )}
                        <RichText html={item.description} className="mt-2 text-neutral-700 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "education" && data.education.length > 0) {
            return (
              <section key="education" className="space-y-4">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Education
                </p>
                <div className="space-y-0.5">
                  {data.education.map((item, i) => (
                    <div key={i} className="flex gap-4 relative break-inside-avoid">
                      {/* Left Side: Date & Location */}
                      <div className="w-28 text-right shrink-0 pt-1">
                        <p className="text-xs font-bold text-neutral-800">
                          {dateRange(item.startDate, item.endDate, item.isCurrent)}
                        </p>
                        {location(item.city, item.country) && (
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            {location(item.city, item.country)}
                          </p>
                        )}
                      </div>

                      {/* Middle: Timeline Dot & Spine */}
                      <div className="relative flex flex-col items-center shrink-0 w-4">
                        <div className={cn("w-2 h-2 rounded-full z-10 mt-2.5", accentColor)} />
                        {i < data.education.length - 1 && (
                          <div className="absolute top-2.5 bottom-[-16px] w-0.5 bg-neutral-200" />
                        )}
                      </div>

                      {/* Right Side: Content */}
                      <div className="flex-1 pb-4 pt-0.5">
                        <p className={cn("text-sm font-bold", textColor)}>
                          {item.degree}
                        </p>
                        {item.school && (
                          <p className={cn("text-xs font-semibold mt-0.5 opacity-90", textColor)}>
                            {item.school}
                          </p>
                        )}
                        <RichText html={item.description} className="mt-2 text-neutral-700 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "skills" && data.skills.length > 0) {
            return (
              <section key="skills" className="space-y-2">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Skills
                </p>
                <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                  {data.skills.map((s) => s.name).join(", ")}
                </p>
              </section>
            );
          }

          if (section.id === "languages" && data.languages.length > 0) {
            return (
              <section key="languages" className="space-y-2">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Languages
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {data.languages.map((lang, i) => (
                    <span key={i} className="text-xs text-neutral-700 font-semibold flex items-center gap-1">
                      <span className={textColor}>{lang.name}</span>
                      {lang.level && <span className="text-[10px] text-neutral-500 font-normal">({lang.level})</span>}
                    </span>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "projects" && data.projects.length > 0) {
            return (
              <section key="projects" className="space-y-3">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Projects
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {data.projects.map((item, i) => (
                    <div key={i} className="space-y-1 p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 transition-colors break-inside-avoid">
                      <div className="flex justify-between items-start gap-2">
                        <p className={cn("text-xs font-bold", textColor)}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-neutral-500 shrink-0 font-medium">
                          {dateRange(item.startDate, item.endDate)}
                        </span>
                      </div>
                      {item.url && (
                        <p className="text-[10px] text-neutral-400 break-all truncate">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {item.url.replace(/^https?:\/\//, "")}
                          </a>
                        </p>
                      )}
                      <RichText html={item.description} className="text-neutral-600 text-[11px] leading-relaxed mt-1" />
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.id === "certifications" && data.certifications.length > 0) {
            return (
              <section key="certifications" className="space-y-2">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Certifications
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {data.certifications.map((item, i) => (
                    <div key={i} className="flex justify-between items-start gap-2 text-xs break-inside-avoid">
                      <div>
                        <p className="font-bold text-neutral-800">{item.name}</p>
                        {item.issuer && <p className="text-[10px] text-neutral-500 mt-0.5">{item.issuer}</p>}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium shrink-0 pt-0.5">
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
              <section key="awards" className="space-y-2">
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  Awards
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {data.awards.map((item, i) => (
                    <div key={i} className="space-y-0.5 break-inside-avoid">
                      <div className="flex justify-between items-start gap-2 text-xs">
                        <p className={cn("font-bold", textColor)}>{item.title}</p>
                        <span className="text-[10px] text-neutral-400 shrink-0 font-medium">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      {item.issuer && <p className="text-[10px] text-neutral-500 font-medium">{item.issuer}</p>}
                      <RichText html={item.description} className="text-neutral-600 text-[11px] leading-relaxed mt-1" />
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
                <p className={cn("text-xs font-bold uppercase tracking-widest border-b border-neutral-100 pb-1", textColor)}>
                  {(section as any).title}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2 text-xs">
                    <div>
                      <p className="font-bold text-neutral-800">{fieldData.title}</p>
                      {fieldData.subtitle && <p className="text-[10px] text-neutral-500 mt-0.5">{fieldData.subtitle}</p>}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                      {dateRange(fieldData.startDate, fieldData.endDate)}
                    </span>
                  </div>
                  <RichText html={fieldData.description} className="text-neutral-700 text-xs leading-relaxed" />
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
