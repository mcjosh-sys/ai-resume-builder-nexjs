"use client";

import { compileResume } from "@/features/editor/helpers/resume-helpers";
import { Step } from "@/features/editor/types/editor-resume.type";
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
  lastSaved?: Date | null;
  jobDescription: string;
  atsScore: number | null;
  /**
   * When true, auto-save is suppressed (e.g. while the resume is being
   * fetched on initial load). This prevents a spurious save on first render.
   */
  isLoading?: boolean;
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
  isLoading = false,
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

  // Refs so that the memoized `save` callback always reads the latest values
  // without needing them as deps (which would recreate `save` too often).
  const debouncedChangeIdRef = useRef(debouncedChangeId);
  debouncedChangeIdRef.current = debouncedChangeId;

  const stateRef = useRef(state);
  stateRef.current = state;

  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const resumePayloadRef = useRef({ template, colorHex, jobDescription, atsScore });
  resumePayloadRef.current = { template, colorHex, jobDescription, atsScore };

  const updateState = useStateUpdater(setState);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!initialLastSaved) return;
    updateState({ lastSaved: initialLastSaved });
  }, [initialLastSaved]);

  // Mark unsaved changes only when the debounced changeId is new — and only
  // after the resume has finished loading so we never dirty-flag on first load.
  useEffect(() => {
    if (isLoading) return;
    if (!debouncedChangeId || debouncedChangeId === state.lastSavedChangeId)
      return;
    updateState({ error: null, hasUnsavedChanges: true });
  }, [debouncedChangeId, state.lastSavedChangeId, isLoading]);

  // `save` is stable — it reads all mutable values via refs, so it never needs
  // to be recreated when resume data changes. This prevents the auto-save
  // useEffect below from firing on every render.
  const save = useCallback(async () => {
    const currentState = stateRef.current;
    if (!currentState.hasUnsavedChanges || currentState.isSaving) return;

    const changeIdToSave = debouncedChangeIdRef.current;

    try {
      updateState({ error: null, isSaving: true });

      const { template, colorHex, jobDescription, atsScore } =
        resumePayloadRef.current;

      const resumeData = compileResume({
        id: currentState.currentResumeId ?? undefined,
        steps: stepsRef.current,
        metadata: { template, colorHex, jobDescription, atsScore },
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
            !!prev.error || changeIdToSave !== debouncedChangeIdRef.current,
        }));
      }
    }
  // `updateState` is stable (wraps `setState`), everything else is via refs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState]);

  // Trigger auto-save whenever there are unsaved changes.
  // Because `save` is now stable, this effect only re-runs when
  // hasUnsavedChanges / isSaving / error change — not on every render.
  useEffect(() => {
    if (!state.hasUnsavedChanges || state.isSaving || state.error) return;
    save();
  }, [state.hasUnsavedChanges, state.isSaving, state.error, save]);

  return { ...state, save };
};
