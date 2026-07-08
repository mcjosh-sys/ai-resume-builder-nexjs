"use client";

import { parseResume } from "@/features/editor/helpers/resume-helpers";
import { DEFAULT_STEPS } from "@/features/editor/resource/steps";
import { AddStepInput, Step } from "@/features/editor/types/editor-resume.type";
import { getResume } from "@/features/resume/actions/resume.actions";
import { AppError } from "@/lib/errors";
import { createId } from "@paralleldrive/cuid2";
import { isEqual } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAutoSaveResume } from "./use-auto-save-resume";
import { useHistory } from "./use-history";
import useUnloadWarning from "./use-unload-warning";

export type ResumeMetadata = {
  jobDescription: string;
  atsScore: number | null;
  colorHex: string;
  template: string;
};

/** The portion of resume state that participates in undo/redo history */
type HistoricalState = {
  steps: Step[];
  metadata: ResumeMetadata;
};

export const useResume = ({
  resumeId,
  defaultSteps = DEFAULT_STEPS,
}: {
  resumeId?: string | null;
  defaultSteps?: Step[];
} = {}) => {
  // Non-historical state (loading flags, error, ids, etc.)
  const [meta, setMeta] = useState({
    updatedAt: null as Date | null,
    isLoading: !!resumeId, // true from the start when we know we'll fetch
    error: null as AppError | null,
    changeId: null as string | null,
    currentResumeId: resumeId as string | null | undefined,
  });

  // Historical state — steps + metadata participate in undo/redo.
  // Destructure stable function refs directly to avoid capturing the plain
  // history object (which is recreated every render) in useCallback deps.
  const {
    present,
    push: pushHistory,
    replace: replaceHistory,
    reset: resetHistory,
    undo: historyUndo,
    redo: historyRedo,
    canUndo,
    canRedo,
  } = useHistory<HistoricalState>({
    steps: defaultSteps,
    metadata: {
      jobDescription: "",
      atsScore: null,
      colorHex: "default",
      template: "aurora",
    },
  });

  const { steps, metadata } = present;

  const isMountedRef = useRef(true);

  const {
    currentResumeId: savedResumeId,
    hasUnsavedChanges,
    isSaving,
    error,
    lastSaved,
    save,
  } = useAutoSaveResume({
    resumeId,
    steps,
    changeId: meta.changeId,
    template: metadata.template,
    colorHex: metadata.colorHex,
    jobDescription: metadata.jobDescription,
    atsScore: metadata.atsScore,
    lastSaved: meta.updatedAt,
    isLoading: meta.isLoading,
  });

  useEffect(() => {
    if (error || meta.error || savedResumeId === meta.currentResumeId) return;
    setMeta((prev) => ({ ...prev, currentResumeId: savedResumeId }));
  }, [savedResumeId, meta.currentResumeId, error, meta.error]);

  useUnloadWarning(hasUnsavedChanges || isSaving);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);



  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      setMeta((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        updatedAt: null,
      }));

      // Reset historical state to defaults while loading
      replaceHistory((current) => ({ steps: defaultSteps, metadata: current.metadata }));

      try {
        const rawResume = await getResume(resumeId);

        if (!isMountedRef.current) return;

        if (!rawResume) {
          throw new AppError("Resume not found", { status: 404 });
        }

        const parsedResume = parseResume(rawResume);

        // Reset history with the freshly loaded state (no undo across loads)
        resetHistory({
          steps: parsedResume.steps,
          metadata: {
            template: parsedResume.metadata.template,
            colorHex: parsedResume.metadata.colorHex,
            jobDescription: parsedResume.metadata.jobDescription,
            atsScore: parsedResume.metadata.atsScore,
          },
        });

        setMeta((prev) => ({
          ...prev,
          updatedAt: rawResume?.updatedAt,
          changeId: null,
        }));
      } catch (err) {
        if (isMountedRef.current) {
          console.error(err);
          const appError =
            err instanceof AppError
              ? err
              : new AppError("Something went wrong", { status: 500 });
          setMeta((prev) => ({ ...prev, error: appError, currentResumeId: null }));
        }
      } finally {
        if (isMountedRef.current) {
          // isLoading: false is set last — useAutoSaveResume uses isLoading
          // as a gate to prevent marking changes during the fetch cycle.
          setMeta((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mutating operations ────────────────────────────────────────────────────
  // All callbacks use functional updaters `(current) => nextState` so they
  // never need to capture `present` in their closure — making them stable
  // (deps: [pushHistory] which never changes) and preventing render loops.

  const updateSection = useCallback(
    (step: Pick<Step, "id" | "data">) => {
      let changed = false;
      pushHistory((current) => {
        const nextSteps = current.steps.map((s) =>
          s.id === step.id ? { ...s, data: step.data as any } : s,
        );
        if (isEqual(current.steps, nextSteps)) {
          return current;
        }
        changed = true;
        return {
          ...current,
          steps: nextSteps,
        };
      });
      if (changed) {
        setMeta((prev) => ({ ...prev, changeId: createId() }));
      }
    },
    [pushHistory],
  );

  const setSteps = useCallback(
    (updater: Step[] | ((prev: Step[]) => Step[])) => {
      let changed = false;
      pushHistory((current) => {
        const nextSteps = typeof updater === "function" ? updater(current.steps) : updater;
        if (isEqual(current.steps, nextSteps)) {
          return current;
        }
        changed = true;
        return {
          ...current,
          steps: nextSteps,
        };
      });
      if (changed) {
        setMeta((prev) => ({ ...prev, changeId: createId() }));
      }
    },
    [pushHistory],
  );

  const addSection = useCallback(
    (input: AddStepInput) => {
      const id = createId();
      const newSection: Step = {
        id: `other-field-${id}`,
        title: input.title,
        icon: input.icon,
        sidebarDesc: input.sidebarDesc,
        desc: input.desc,
        enabled: true,
        data: {},
      };
      pushHistory((current) => ({
        ...current,
        steps: [...current.steps, newSection],
      }));
      setMeta((prev) => ({ ...prev, changeId: createId() }));
      return newSection;
    },
    [pushHistory],
  );

  const removeSection = useCallback(
    (stepId: string) => {
      if (!stepId.startsWith("other-field-")) return;
      let changed = false;
      pushHistory((current) => {
        const nextSteps = current.steps.filter((s) => s.id !== stepId);
        if (current.steps.length === nextSteps.length) {
          return current;
        }
        changed = true;
        return {
          ...current,
          steps: nextSteps,
        };
      });
      if (changed) {
        setMeta((prev) => ({ ...prev, changeId: createId() }));
      }
    },
    [pushHistory],
  );

  const setTemplate = useCallback(
    (template: string) => {
      let changed = false;
      pushHistory((current) => {
        if (current.metadata.template === template) {
          return current;
        }
        changed = true;
        return {
          ...current,
          metadata: { ...current.metadata, template },
        };
      });
      if (changed) {
        setMeta((prev) => ({ ...prev, changeId: createId() }));
      }
    },
    [pushHistory],
  );

  const setColorHex = useCallback(
    (colorHex: string) => {
      let changed = false;
      pushHistory((current) => {
        if (current.metadata.colorHex === colorHex) {
          return current;
        }
        changed = true;
        return {
          ...current,
          metadata: { ...current.metadata, colorHex },
        };
      });
      if (changed) {
        setMeta((prev) => ({ ...prev, changeId: createId() }));
      }
    },
    [pushHistory],
  );

  const updateResumeMetadata = useCallback(
    (data: Partial<ResumeMetadata>) => {
      let changed = false;
      pushHistory((current) => {
        const nextMetadata = { ...current.metadata, ...data };
        if (isEqual(current.metadata, nextMetadata)) {
          return current;
        }
        changed = true;
        return {
          ...current,
          metadata: nextMetadata,
        };
      });
      if (changed) {
        setMeta((prev) => ({ ...prev, changeId: createId() }));
      }
    },
    [pushHistory],
  );

  // ── Undo / Redo wrappers ───────────────────────────────────────────────────
  // historyUndo / historyRedo are stable (empty useCallback deps in useHistory)

  const undo = useCallback(() => {
    historyUndo();
    setMeta((prev) => ({ ...prev, changeId: createId() }));
  }, [historyUndo]);

  const redo = useCallback(() => {
    historyRedo();
    setMeta((prev) => ({ ...prev, changeId: createId() }));
  }, [historyRedo]);

  return {
    ...meta,
    steps,
    metadata,
    error: meta.error || error,
    lastSaved,
    hasUnsavedChanges,
    isSaving,
    // history
    canUndo,
    canRedo,
    undo,
    redo,
    // mutations
    setSteps,
    updateSection,
    addSection,
    removeSection,
    setTemplate,
    setColorHex,
    save,
    updateResumeMetadata,
  };
};
