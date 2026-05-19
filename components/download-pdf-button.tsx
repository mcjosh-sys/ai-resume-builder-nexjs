"use client";

import { Button } from "@/components/ui/button";
import {
  ResumeTemplateRenderer,
  TemplateResume,
} from "@/features/editor/components/resume-template-renderer";
import { stepsToTemplateResume } from "@/features/editor/helpers/resume-helpers";
import {
  getTemplateById,
  ResumeTemplate,
} from "@/features/editor/resource/templates";
import { Step } from "@/features/editor/types/editor-resume.type";
import { renderReactToHtml } from "@/lib/pdf";
import { cn, downalodObject } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";
import { toast } from "sonner";

type DownloadPdfButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  iconOnly?: boolean;
} & (
    | { resumeId: string; steps?: never; template?: never; colorHex?: never }
    | {
        steps: Step[];
        template?: string;
        colorHex?: string;
        resumeId?: never;
      }
  );
// interface DownloadPdfButtonProps extends Omit<
//   ComponentProps<typeof Button>,
//   "onClick"
// > {
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
//   iconOnly?: boolean;
//   resumeId?: string | null;
// }
// interface DownloadPdfButtonProps extends Omit<
//   ComponentProps<typeof Button>,
//   "onClick"
// > {
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
//   iconOnly?: boolean;
// }

export function DownloadPdfButton({
  resumeId,
  steps,
  template,
  colorHex,
  onSuccess,
  onError,
  iconOnly = false,
  className,
  children,
  ...props
}: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [templateData, setTemplateData] = useState({
    resume: null as TemplateResume | null,
    template: null as ResumeTemplate | null,
    colorHex: "default",
  });

  const isFromEditor = !!steps?.length;

  useEffect(() => {
    if (!steps || !steps.length) return;
    const resume = stepsToTemplateResume(steps);
    setTemplateData({
      resume,
      template: getTemplateById(template),
      colorHex: colorHex || "default",
    });
  }, [template, colorHex, steps]);

  const downloadPdf = async () => {
    // await loadResume();
    if (!templateData.resume) {
      toast.error("Failed to load resume");
      return;
    }

    const resumePreview = document.getElementById("resumePdf");
    if (!resumePreview) {
      toast.error("Failed to load resume");
      return;
    }

    setIsLoading(true);
    try {
      const css = await fetch("/css/main.css").then((res) => res.text());

      const html = renderReactToHtml(css, resumePreview.innerHTML);

      const response = await fetch(`/api/resumes/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Convert response to a blob and trigger browser download
      const blob = await response.blob();
      const filename = `${templateData.resume.firstName} ${templateData.resume.lastName} - ${templateData.resume.jobTitle || "Resume"}.pdf`;
      downalodObject(filename, blob);

      toast.success("Your PDF has been downloaded successfully.");

      onSuccess?.();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        "Something went wrong while generating your PDF. Please try again.",
      );
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPdfById = async () => {
    if (!resumeId) return;
    setIsLoading(true);
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

      onSuccess?.();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        "Something went wrong while generating your PDF. Please try again.",
      );
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (isFromEditor) {
      downloadPdf();
    } else {
      downloadPdfById();
    }
  };

  return (
    <>
      <Button
        onClick={handleDownload}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-grid [grid-template-areas:'stack'] relative justify-items-center items-center overflow-hidden",
          className,
        )}
        {...props}
      >
        <Loader2
          className={cn(
            "[grid-area:stack] transition-opacity",
            isLoading ? "visible animate-spin" : "invisible opacity-0",
          )}
        />
        <div
          className={cn(
            "[grid-area:stack] transition-opacity",
            !isLoading ? "visible opacity-100" : "invisible opacity-0",
          )}
        >
          {children ? children : <Download />}
        </div>
      </Button>
      {templateData.resume && (
        <div id="resumePdf" className="h-0 w-0 overflow-hidden">
          <div className="resume-preview-container">
            <ResumeTemplateRenderer
              data={templateData.resume}
              template={templateData.template!}
              colorHex={templateData.colorHex}
            />
          </div>
        </div>
      )}
    </>
  );
}
