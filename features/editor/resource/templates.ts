export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  accent: string;
  supportsPhoto?: boolean;
  noMargins?: boolean;
  preview: {
    title: string;
    subtitle: string;
  };
};

export const RESUME_TEMPLATES = Object.freeze([
  {
    id: "aurora",
    name: "Aurora",
    description: "Clean and calm with soft accent highlights.",
    accent: "bg-sky-500",
    preview: {
      title: "Modern professional",
      subtitle: "Balanced, recruiter-friendly layout",
    },
  } as const,
  {
    id: "ember",
    name: "Ember",
    supportsPhoto: true,
    description: "Bold headings with a confident, high-contrast style.",
    accent: "bg-orange-500",
    preview: {
      title: "Impact-driven",
      subtitle: "Strong typography for leadership roles",
    },
  } as const,
  {
    id: "sage",
    name: "Sage",
    description: "Minimal, editorial, and easy to scan.",
    accent: "bg-emerald-500",
    preview: {
      title: "Minimalist",
      subtitle: "Great for senior ICs and designers",
    },
  },
  {
    id: "nova",
    name: "Nova",
    supportsPhoto: true,
    description: "Two-column layout with a dark sidebar.",
    accent: "bg-violet-500",
    noMargins: true,
    preview: {
      title: "Modern two-column",
      subtitle: "Great for technical and creative roles",
    },
  } as const,
  {
    id: "slate",
    name: "Slate",
    description: "Classic professional, clean and monochrome.",
    accent: "bg-slate-600",
    preview: {
      title: "Traditional",
      subtitle: "Safe choice for corporate applications",
    },
  } as const,
  {
    id: "prism",
    name: "Prism",
    description: "Bold accent header bar with a structured grid.",
    accent: "bg-rose-500",
    noMargins: true,
    preview: {
      title: "Bold & structured",
      subtitle: "Great for standing out in tech",
    },
  },
  {
    id: "velvet",
    name: "Velvet",
    description: "Elegant and refined with decorative accents.",
    accent: "bg-amber-600",
    preview: {
      title: "Elegant",
      subtitle: "Perfect for creative or executive roles",
    },
  } as const,
  {
    id: "axis",
    name: "Axis",
    description:
      "Left-border section headers with extending rule line and skill chips.",
    accent: "bg-neutral-500",
    preview: {
      title: "Structured classic",
      subtitle: "Ideal for technical and UX roles",
    },
  } as const,
  {
    id: "banner",
    name: "Banner",
    description:
      "Solid accent sidebar and top stripe with centered white header.",
    accent: "bg-blue-600",
    noMargins: true,
    preview: {
      title: "Bold two-column",
      subtitle: "Clean and professional for business roles",
    },
  } as const,
  {
    id: "canvas",
    name: "Canvas",
    description:
      "Dark portrait sidebar with photo support and left-border experience entries.",
    accent: "bg-slate-800",
    supportsPhoto: true,
    noMargins: true,
    preview: {
      title: "Dark portrait",
      subtitle: "Premium look for creative professionals",
    },
  } as const,
  {
    id: "focal",
    name: "Focal",
    description:
      "Centered header and contact row with chip skills and two-column body.",
    accent: "bg-indigo-600",
    preview: {
      title: "Centered two-column",
      subtitle: "Great for academic and engineering roles",
    },
  } as const,
  {
    id: "ledger",
    name: "Ledger",
    description: "Tabular label-column rows with clean horizontal dividers.",
    accent: "bg-gray-700",
    preview: {
      title: "Tabular layout",
      subtitle: "Perfect for engineering and science roles",
    },
  } as const,
  {
    id: "chronicle",
    name: "Chronicle",
    supportsPhoto: true,
    description: "Modern timeline layout with a vertical spine and rounded photo.",
    accent: "bg-teal-600",
    preview: {
      title: "Modern timeline",
      subtitle: "Highly visual and recruiter-friendly layout",
    },
  } as const,
  {
    id: "summit",
    name: "Summit",
    description: "Clean corporate layout with right-aligned dates and structured grid columns.",
    accent: "bg-slate-700",
    preview: {
      title: "Corporate minimalist",
      subtitle: "Professional layout ideal for finance and accounting",
    },
  } as const,
  {
    id: "vanguard",
    name: "Vanguard",
    supportsPhoto: true,
    description: "Bold executive layout with thick dividers and bottom-border skill tags.",
    accent: "bg-blue-600",
    preview: {
      title: "Executive Accent",
      subtitle: "Premium look for leaders and managers",
    },
  } as const,
]);

export type TemplateId =
  | "aurora"
  | "ember"
  | "sage"
  | "nova"
  | "slate"
  | "prism"
  | "velvet"
  | "axis"
  | "banner"
  | "canvas"
  | "focal"
  | "ledger"
  | "chronicle"
  | "summit"
  | "vanguard";

export function getTemplateById(id: any) {
  return RESUME_TEMPLATES.find((item) => item.id === id) ?? RESUME_TEMPLATES[0];
}
