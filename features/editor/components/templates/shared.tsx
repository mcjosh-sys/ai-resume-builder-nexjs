import { cn } from "@/lib/utils";
import { ResumeTemplate } from "../../resource/templates";

// ---------- Data Types ----------

export type ResumeLink = {
  name: string;
  url: string;
};

export type ResumeExperience = {
  position?: string;
  company?: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
};

export type ResumeEducation = {
  degree?: string;
  school?: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
};

export type ResumeSkill = {
  name: string;
  level?: string;
  category?: string;
};

export type ResumeProject = {
  title?: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
};

export type ResumeCertification = {
  name?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
};

export type ResumeAward = {
  title?: string;
  issuer?: string;
  date?: string;
  description?: string;
};

export type ResumeOtherField = {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

/** A section entry that controls what to render and in what order. */
export type ResumeSection =
  | { id: "header" }
  | { id: "summary" }
  | { id: "experience" }
  | { id: "education" }
  | { id: "skills" }
  | { id: "projects" }
  | { id: "certifications" }
  | { id: "awards" }
  | { id: string; title: string }; // other-field or custom sections (not rendered yet)

export type TemplateResume = {
  // From header step
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  links?: ResumeLink[];

  // From summary step
  summary?: string;

  // From section steps
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  awards: ResumeAward[];
  otherFields: ResumeOtherField[];

  /** Ordered list of enabled sections — templates iterate this to determine render order */
  sections: ResumeSection[];
};

export type ResumeTemplateRendererProps = {
  template: ResumeTemplate;
  data: TemplateResume;
};

// ---------- Shared utilities ----------

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function dateRange(
  start?: string,
  end?: string,
  isCurrent?: boolean,
): string {
  const s = formatDate(start);
  const e = isCurrent ? "Present" : formatDate(end);
  if (s && e) return `${s} – ${e}`;
  if (s) return s;
  return "";
}

export function location(city?: string, country?: string): string {
  return [city, country].filter(Boolean).join(", ");
}

// ---------- Shared primitive components ----------

export function RichText({
  html,
  className,
}: {
  html?: string;
  className?: string;
}) {
  if (!html) return null;
  const isHtml = /<[a-z][\s\S]*>/i.test(html);
  if (isHtml) {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .richtext-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
          }
          .richtext-content ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
          }
        `,
          }}
        />
        <div
          className={cn("richtext-content text-sm", className)}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </>
    );
  }
  return (
    <p className={cn("text-sm leading-relaxed whitespace-pre-line", className)}>
      {html}
    </p>
  );
}

export function SectionTitle({
  label,
  accent,
  dark,
  minimal,
}: {
  label: string;
  accent: string;
  dark?: boolean;
  minimal?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {!minimal && (
        <span
          className={cn("h-2 w-2 rounded-full", accent, dark && "opacity-90")}
        />
      )}
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wide",
          dark ? "text-neutral-700" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
    </div>
  );
}

export function ContactLine({ data }: { data: TemplateResume }) {
  const parts = [
    location(data.city, data.country),
    data.email,
    data.phone,
    ...(data.links ?? []).map((l) => l.url),
  ].filter(Boolean);
  return <p className="text-xs text-muted-foreground">{parts.join(" · ")}</p>;
}
