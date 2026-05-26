"use client";

import { compileResume } from "@/features/editor/helpers/resume-helpers";
import { Step } from "@/features/editor/types/editor-resume.type";
import { saveResume } from "@/features/resume/actions/resume.actions";
import { AppError } from "@/lib/errors";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSimpleDebounce from "./use-simple-debounce";
import { useStateUpdater } from "./use-state-updater";

interface UseAutoSaveResumeProps {
  resumeId?: string | null;
  steps: Step[];
  changeId: string | null;
  template: string;
  colorHex: string;
  lastSaved?: Date | null;
  jobDescription: string;
  atsScore: number | null;
}

export const useAutoSaveResume = ({
  resumeId,
  steps,
  changeId,
  template,
  colorHex,
  lastSaved: initialLastSaved,
  jobDescription,
  atsScore,
}: UseAutoSaveResumeProps) => {
  const debouncedChangeId = useSimpleDebounce(changeId, { delay: 1000 });
  const [state, setState] = useState({
    error: null as AppError | null,
    lastSaved: initialLastSaved,
    lastSavedChangeId: null as string | null,
    hasUnsavedChanges: false,
    isSaving: false,
    currentResumeId: resumeId,
  });

  const isMountedRef = useRef(true);

  const updateState = useStateUpdater(setState);

  useEffect(() => {
    if (!initialLastSaved) return;
    updateState({ lastSaved: initialLastSaved });
  }, [initialLastSaved]);

  useEffect(() => {
    if (!debouncedChangeId || debouncedChangeId === state.lastSavedChangeId)
      return;
    updateState({ error: null, hasUnsavedChanges: true });
  }, [debouncedChangeId, state.lastSavedChangeId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const save = async () => {
    if (!state.hasUnsavedChanges || state.isSaving) return;
    const changeIdToSave = debouncedChangeId;
    try {
      updateState({ error: null, isSaving: true });
      const resumeData = compileResume({
        id: state.currentResumeId ?? undefined,
        steps,
        metadata: {
          template,
          colorHex,
          jobDescription,
          atsScore,
        },
      });
      const updatedResume = await saveResume(resumeData);
      if (isMountedRef.current)
        updateState({
          lastSavedChangeId: changeIdToSave,
          currentResumeId: updatedResume.id,
          lastSaved: new Date(),
        });
    } catch (error) {
      console.error(error);
      if (isMountedRef.current)
        updateState({
          error:
            error instanceof AppError
              ? error
              : new AppError("Could not save resume", { status: 500 }),
        });
      // throw error;

      toast.error("Could not save changes", {
        action: {
          label: "Retry",
          onClick: save,
        },
        position: "bottom-right",
      });
    } finally {
      if (isMountedRef.current) {
        updateState((prev) => ({
          isSaving: false,
          hasUnsavedChanges:
            !!prev.error || changeIdToSave !== debouncedChangeId,
        }));
      }
    }
  };

  useEffect(() => {
    if (!state.hasUnsavedChanges || state.isSaving || state.error) return;

    save();
  }, [state.hasUnsavedChanges, save, state.isSaving, state.error]);

  return { ...state, save };
};
