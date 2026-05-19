import { Step } from "../types/editor-resume.type";
import { ICON_MAP } from "./icons";

export const FIXED_STEP_IDS = ["header", "summary"] as const;

export const DEFAULT_STEPS: Step[] = [
  {
    id: "header",
    title: "Header",
    icon: ICON_MAP.contact,
    sidebarDesc: "Name, role, contact, summary",
    enabled: true,
  },
  {
    id: "summary",
    title: "Summary",
    icon: ICON_MAP.user,
    sidebarDesc: "Name, role, contact, summary",
    enabled: true,
  },
  {
    id: "experience",
    title: "Experience",
    icon: ICON_MAP.briefcase,
    sidebarDesc: "Work history",
    enabled: true,
  },
  {
    id: "education",
    title: "Education",
    icon: ICON_MAP.book,
    sidebarDesc: "Degrees, schools",
    enabled: true,
  },
  {
    id: "skills",
    title: "Skills",
    sidebarDesc: "Skills",
    icon: ICON_MAP.code,
    enabled: true,
  },
  {
    id: "projects",
    title: "Projects",
    icon: ICON_MAP.folder,
    sidebarDesc: "Personal & professional projects",
    enabled: true,
  },
  {
    id: "certifications",
    title: "Certifications",
    icon: ICON_MAP.award,
    sidebarDesc: "Licenses & credentials",
    enabled: false,
  },
  {
    id: "awards",
    title: "Awards",
    icon: ICON_MAP.star,
    sidebarDesc: "Achievements & recognition",
    enabled: false,
  },
  {
    id: "languages",
    title: "Languages",
    icon: ICON_MAP.globe,
    sidebarDesc: "Languages you speak",
    enabled: false,
  },
] as const;
