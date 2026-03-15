import {
  FaAward,
  FaBook,
  FaBriefcase,
  FaCode,
  FaFolderOpen,
  FaScrewdriverWrench,
  FaStar,
  FaUser,
} from "react-icons/fa6";
import { MdContacts } from "react-icons/md";
import { Step } from "../contexts/editor-context";

const ICON_IDS = [
  "briefcase",
  "folder",
  "code",
  "award",
  "book",
  "user",
  "tools",
  "star",
  "contact",
] as const;

export type IconId = (typeof ICON_IDS)[number];

export const ICON_OPTIONS: Array<{
  id: IconId;
  label: string;
  icon: NonNullable<Step["icon"]>["component"];
}> = [
  { id: "briefcase", label: "Experience", icon: FaBriefcase },
  { id: "folder", label: "Projects", icon: FaFolderOpen },
  { id: "code", label: "Skills", icon: FaCode },
  { id: "award", label: "Awards", icon: FaAward },
  { id: "book", label: "Education", icon: FaBook },
  { id: "user", label: "Profile", icon: FaUser },
  { id: "tools", label: "Tools", icon: FaScrewdriverWrench },
  { id: "star", label: "Custom", icon: FaStar },
  { id: "contact", label: "Contact", icon: MdContacts },
];

export function getIconById(id?: string): NonNullable<Step["icon"]> {
  if (!id) return { id: "star", component: FaStar };
  const icon = ICON_OPTIONS.find((option) => option.id === id)?.icon ?? FaStar;
  return {
    id,
    component: icon,
  };
}

function getIconMap() {
  return ICON_OPTIONS.reduce(
    (acc, option) => {
      acc[option.id] = { id: option.id, component: option.icon };
      return acc;
    },
    {} as Record<IconId, NonNullable<Step["icon"]>>,
  );
}

export const ICON_MAP = getIconMap();
