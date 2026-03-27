"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFromNow } from "@/hooks/use-from-now";
import { useNavigate } from "@/hooks/use-navigate";
import { cn, downalodObject } from "@/lib/utils";
import { Loader2, MoreHorizontal, Pencil, Trash2, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFilePdf, FaUser } from "react-icons/fa6";
import { toast } from "sonner";
import { deleteResume } from "../actions/resume.actions";
import { RenameResumeModal } from "./modals/rename-resume-modal";

export type ResumeCardData = {
  id: string;
  title: string | null;
  description: string | null;
  template: string;
  photoUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  updatedAt: Date;
  createdAt: Date;
  atsScore?: number | null;
};

const TEMPLATE_COLORS: Record<string, string> = {
  aurora: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  sage: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  ember:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  dusk: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300",
  nova: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  zephyr: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
};

function TemplateBadge({ template }: { template: string }) {
  const color =
    TEMPLATE_COLORS[template.toLowerCase()] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        color,
      )}
    >
      {template}
    </span>
  );
}

export function ResumeCard({
  resume,
  onDeleted,
}: {
  resume: ResumeCardData;
  onDeleted?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const lastEdited = useFromNow(resume.updatedAt);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState(
    resume.title || "Untitled Resume",
  );

  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>(
    {},
  );

  const updateDownloadingStatus = (resumeId: string, status: boolean) => {
    if (status) {
      setIsDownloading((prev) => ({
        ...prev,
        [resumeId]: true,
      }));
      return;
    }
    setIsDownloading((prev) => {
      const { [resumeId]: _, ...rest } = prev;
      return rest;
    });
  };

  const fullName = [resume.firstName, resume.lastName]
    .filter(Boolean)
    .join(" ");

  const handleEdit = () => {
    navigate(`/editor?id=${resume.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteResume(resume.id);
      onDeleted?.(resume.id);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "group cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-200 relative overflow-hidden",
          isDeleting && "opacity-50 pointer-events-none",
        )}
        onClick={handleEdit}
      >
        {/* Colour accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/60 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* ATS Score Badge (absolute top right, overlapping) */}
        {typeof resume.atsScore === "number" && (
          <div
            className={cn(
              "absolute top-3 right-3 flex flex-col items-center justify-center h-10 w-10 text-xs font-bold leading-none rounded-full border-2 bg-background shadow-sm z-10",
              getAtsColor(resume.atsScore),
            )}
          >
            <span className="text-xs font-bold leading-none">
              {resume.atsScore}
            </span>
            <span className="text-[8px] font-medium opacity-80 uppercase mt-0.5">
              ATS
            </span>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            {/* Avatar / initial */}
            <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
              {resume.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resume.photoUrl}
                  alt={fullName || "Resume photo"}
                  className="h-full w-full object-cover"
                />
              ) : fullName ? (
                <span className="font-semibold text-sm">
                  {resume.firstName?.[0]}
                  {resume.lastName?.[0]}
                </span>
              ) : (
                <FaUser className="size-4" />
              )}
            </div>

            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="p-1 rounded-md hover:bg-muted focus:outline-none"
                disabled={isDownloading[resume.id]}
                onClick={(e) => e.stopPropagation()}
              >
                {isDownloading[resume.id] ? (
                  <Loader2 className="size-4 text-muted-foreground animate-spin" />
                ) : (
                  <MoreHorizontal className="size-4 text-muted-foreground" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 size-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenameOpen(true);
                  }}
                >
                  <Type className="mr-2 size-3.5" />
                  Rename
                </DropdownMenuItem>
                <DownloadPdfMenuItem
                  resumeId={resume.id}
                  onStatusChange={updateDownloadingStatus}
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 size-3.5" />
                  {isDeleting ? "Deleting…" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 space-y-1">
            <CardTitle className="text-base line-clamp-1">
              {resumeTitle}
            </CardTitle>
            {resume.description && (
              <CardDescription className="line-clamp-2 text-xs">
                {resume.description}
              </CardDescription>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <TemplateBadge template={resume.template} />
            <span className="text-xs text-muted-foreground">{lastEdited}</span>
          </div>
        </CardHeader>
      </Card>

      <RenameResumeModal
        isOpen={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        resumeId={resume.id}
        initialTitle={resumeTitle}
        onRenamed={(_, newTitle) => setResumeTitle(newTitle)}
      />
    </>
  );
}

function getAtsColor(score: number): string {
  if (score >= 80)
    return "text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
  if (score >= 50)
    return "text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
  return "text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
}

export function ResumeListItem({
  resume,
  onDeleted,
}: {
  resume: ResumeCardData;
  onDeleted?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const lastEdited = useFromNow(resume.updatedAt);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState(
    resume.title || "Untitled Resume",
  );
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>(
    {},
  );

  const updateDownloadingStatus = (resumeId: string, status: boolean) => {
    if (status) {
      setIsDownloading((prev) => ({
        ...prev,
        [resumeId]: true,
      }));
      return;
    }
    setIsDownloading((prev) => {
      const { [resumeId]: _, ...rest } = prev;
      return rest;
    });
  };

  const fullName = [resume.firstName, resume.lastName]
    .filter(Boolean)
    .join(" ");

  const handleEdit = () => navigate(`/editor?id=${resume.id}`);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteResume(resume.id);
      onDeleted?.(resume.id);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted/60 transition-colors duration-150 border border-transparent hover:border-border/50",
          isDeleting && "opacity-50 pointer-events-none",
        )}
        onClick={handleEdit}
      >
        {/* Avatar */}
        <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden text-xs font-semibold">
          {resume.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resume.photoUrl}
              alt={fullName || "Resume"}
              className="h-full w-full object-cover"
            />
          ) : fullName ? (
            <span>
              {resume.firstName?.[0]}
              {resume.lastName?.[0]}
            </span>
          ) : (
            <FaUser className="size-3" />
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{resumeTitle}</p>
          <p className="text-xs text-muted-foreground truncate">{lastEdited}</p>
        </div>

        {/* Template badge */}
        <div className="hidden sm:block">
          <TemplateBadge template={resume.template} />
        </div>

        {/* ATS Score */}
        {typeof resume.atsScore === "number" && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-md border",
              getAtsColor(resume.atsScore),
            )}
          >
            <span className="text-xs font-bold">{resume.atsScore}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
              ATS
            </span>
          </div>
        )}

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="p-1 rounded-md hover:bg-muted focus:outline-none"
            disabled={isDownloading[resume.id]}
            onClick={(e) => e.stopPropagation()}
          >
            {isDownloading[resume.id] ? (
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            ) : (
              <MoreHorizontal className="size-4 text-muted-foreground" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsRenameOpen(true);
              }}
            >
              <Type className="mr-2 size-3.5" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()} asChild>
              <DownloadPdfMenuItem
                resumeId={resume.id}
                onStatusChange={updateDownloadingStatus}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 size-3.5" />
              {isDeleting ? "Deleting…" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RenameResumeModal
        isOpen={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        resumeId={resume.id}
        initialTitle={resumeTitle}
        onRenamed={(_, newTitle) => setResumeTitle(newTitle)}
      />
    </>
  );
}

function DownloadPdfMenuItem({
  resumeId,
  onStatusChange,
}: {
  resumeId: string;
  onStatusChange?: (resumeId: string, status: boolean) => void;
}) {
  const handleDownload = async (e: React.MouseEvent, resumeId: string) => {
    e.stopPropagation();
    onStatusChange?.(resumeId, true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Convert response to a blob and trigger browser download
      const blob = await response.blob();
      let filename = "resume.pdf";
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      downalodObject(filename, blob);

      toast.success("Your PDF has been downloaded successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        "Something went wrong while generating your PDF. Please try again.",
      );
    } finally {
      onStatusChange?.(resumeId, false);
    }
  };

  return (
    <DropdownMenuItem onClick={(e) => handleDownload(e, resumeId)}>
      <FaFilePdf className="mr-2 size-3.5" />
      Download PDF
    </DropdownMenuItem>
  );
}
