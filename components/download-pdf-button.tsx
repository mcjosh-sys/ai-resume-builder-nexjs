"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadPdfButtonProps extends Omit<ButtonProps, "onClick"> {
  resumeId: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  iconOnly?: boolean;
}

export function DownloadPdfButton({
  resumeId,
  onSuccess,
  onError,
  iconOnly = false,
  className,
  children,
  ...props
}: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/resumes/${resumeId}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Convert response to a blob and trigger browser download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Your PDF has been downloaded successfully.");

      onSuccess?.();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Something went wrong while generating your PDF. Please try again.");
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading || props.disabled}
      className={className}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Download />
      )}
      {!iconOnly && (children || "Download PDF")}
    </Button>
  );
}
