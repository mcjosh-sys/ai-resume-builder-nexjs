"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "@/hooks/use-navigate";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { ResumeCard, ResumeCardData, ResumeListItem } from "./resume-card";

interface ResumesListProps {
  resumes: ResumeCardData[];
  showCreateButton?: boolean;
  view?: "grid" | "list";
}

export function ResumesList({
  resumes: initialResumes,
  showCreateButton = false,
  view = "grid",
}: ResumesListProps) {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState(initialResumes);

  const handleDeleted = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <FileText className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">No resumes yet</p>
          <p className="text-xs text-muted-foreground">
            Create your first resume to get started
          </p>
        </div>
        {showCreateButton && (
          <Button
            size="sm"
            onClick={() => navigate("/resumes")}
            className="gap-2"
          >
            <Plus className="size-4" />
            Create Resume
          </Button>
        )}
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="flex flex-col divide-y divide-border/40 rounded-lg border border-border/60 overflow-hidden">
        {resumes.map((resume) => (
          <ResumeListItem
            key={resume.id}
            resume={resume}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} onDeleted={handleDeleted} />
      ))}
    </div>
  );
}
