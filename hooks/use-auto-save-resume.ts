"use client";

import { Step } from "@/features/editor/contexts/editor-context";
import { compileResume } from "@/features/editor/helpers/resume-helpers";
import { saveResume } from "@/features/resume/actions/resume.actions";
import { AppError } from "@/lib/errors";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSimpleDebounce from "./use-simple-debounce";
import { useStateUpdater } from "./use-state-updater";

interface UseAutoSaveResumeProps {
  resumeId?: string | null;
  steps: Step[];
  changeId: string | null;
  template: string;
  colorHex: string;
}

export const useAutoSaveResume = ({
  resumeId,
  steps,
  changeId,
  template,
  colorHex,
}: UseAutoSaveResumeProps) => {
  const debouncedChangeId = useSimpleDebounce(changeId, { delay: 500 });
  const [state, setState] = useState({
    error: null as AppError | null,
    lastSaved: null as Date | null,
    lastSavedChangeId: null as string | null,
    hasUnsavedChanges: false,
    isSaving: false,
    currentResumeId: resumeId,
  });

  const latestChangeRef = useRef<null | string>(null);
  const isMountedRef = useRef(true);

  const updateState = useStateUpdater(setState);

  const save = useCallback(async () => {
    try {
      updateState({ error: null, isSaving: true });
      const resumeData = compileResume(steps);
      resumeData.template = template;
      resumeData.colorHex = colorHex;
      state.currentResumeId && (resumeData.id = state.currentResumeId);
      const updatedResume = await saveResume(resumeData);
      if (isMountedRef.current)
        updateState({
          lastSavedChangeId: debouncedChangeId,
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
      });
    } finally {
      if (isMountedRef.current) {
        updateState((prev) => ({
          isSaving: false,
          hasUnsavedChanges: !!(
            latestChangeRef.current &&
            latestChangeRef.current !== prev.lastSavedChangeId
          ),
        }));
      }
    }
  }, [debouncedChangeId, steps, template, colorHex, state.currentResumeId]);

  useEffect(() => {
    updateState({ error: null });
    latestChangeRef.current = debouncedChangeId;
  }, [debouncedChangeId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      state.isSaving ||
      state.error ||
      !debouncedChangeId ||
      debouncedChangeId == state.lastSavedChangeId
    )
      return;
    if (state.hasUnsavedChanges) {
      updateState({ hasUnsavedChanges: false });
      return;
    }

    // toast.promise(save(), {
    //   loading: "Saving changes...",
    //   success: "Changes saved",
    //   error: {
    //     message: "Could not save changes",
    //     action: {
    //       label: "Retry",
    //       onClick: save,
    //     },
    //   },
    // });
    save();
  }, [debouncedChangeId, state.hasUnsavedChanges]);

  return { ...state, save };
};
