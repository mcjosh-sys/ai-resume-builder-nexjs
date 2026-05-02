"use client";

import { parseResume } from "@/features/editor/helpers/resume-helpers";
import { DEFAULT_STEPS } from "@/features/editor/resource/steps";
import { AddStepInput, Step } from "@/features/editor/types/editor-resume.type";
import { getResume } from "@/features/resume/actions/resume.actions";
import { AppError } from "@/lib/errors";
import { createId } from "@paralleldrive/cuid2";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAutoSaveResume } from "./use-auto-save-resume";
import useUnloadWarning from "./use-unload-warning";

export type ResumeMetadata = {
  jobDescription: string;
  atsScore: number | null;
  colorHex: string;
  template: string;
};

export const useResume = ({
  resumeId,
  defaultSteps = DEFAULT_STEPS,
}: {
  resumeId?: string | null;
  defaultSteps?: Step[];
} = {}) => {
  const [state, setState] = useState({
    updatedAt: null as Date | null,
    isLoading: false,
    error: null as AppError | null,
    loaded: false,
    steps: defaultSteps,
    metadata: {
      jobDescription: "",
      atsScore: null as number | null,
      colorHex: "default",
      template: "aurora",
    },
    changeId: null as string | null,
    currentResumeId: resumeId,
  });
  const isFreshResumeRef = useRef(true);

  const {
    currentResumeId: savedResumeId,
    hasUnsavedChanges,
    isSaving,
    error,
    lastSaved,
    save,
  } = useAutoSaveResume({
    resumeId,
    steps: state.steps,
    changeId: state.changeId,
    template: state.metadata.template,
    colorHex: state.metadata.colorHex,
    jobDescription: state.metadata.jobDescription,
    atsScore: state.metadata.atsScore,
    lastSaved: state.updatedAt,
  });

  useEffect(() => {
    if (error || state.error || savedResumeId === state.currentResumeId) return;
    setState((prev) => ({ ...prev, currentResumeId: savedResumeId }));
  }, [savedResumeId, state.currentResumeId, error, state.error]);

  const isMountedRef = useRef(true);
  useUnloadWarning(hasUnsavedChanges || isSaving);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (state.loaded) {
      isFreshResumeRef.current = false;
    }
  }, [state.loaded]);

  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        updatedAt: null,
        steps: defaultSteps,
      }));

      try {
        const rawResume = await getResume(resumeId);

        if (!isMountedRef.current) return;

        if (!rawResume) {
          throw new AppError("Resume not found", { status: 404 });
        }

        const parsedResume = parseResume(rawResume);

        setState((prev) => ({
          ...prev,
          updatedAt: rawResume?.updatedAt,
          steps: parsedResume.steps,
          metadata: {
            ...prev.metadata,
            template: parsedResume.metadata.template,
            colorHex: parsedResume.metadata.colorHex,
            jobDescription: parsedResume.metadata.jobDescription,
            atsScore: parsedResume.metadata.atsScore,
          },
          changeId: null,
        }));
        // isFreshResumeRef.current = false;
      } catch (err) {
        if (isMountedRef.current) {
          console.error(err);
          const error =
            err instanceof AppError
              ? err
              : new AppError("Something went wrong", { status: 500 });
          setState((prev) => ({ ...prev, error, currentResumeId: null }));
        }
      } finally {
        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchResume();
  }, []);

  const updateSection = (step: Pick<Step, "id" | "data">) => {
    setState((prev) => {
      const state = {
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === step.id ? { ...s, data: step.data as any } : s,
        ),
        changeId: createId(),
      };
      return state;
    });
  };

  const setSteps = (updater: Step[] | ((prev: Step[]) => Step[])) => {
    setState((prev) => ({
      ...prev,
      steps: typeof updater === "function" ? updater(prev.steps) : updater,
      changeId: createId(),
    }));
  };

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

      setState((prev) => ({
        ...prev,
        steps: [...prev.steps, newSection],
        changeId: createId(),
      }));

      return newSection;
    },
    [setState],
  );

  const removeSection = useCallback(
    (stepId: string) => {
      if (!stepId.startsWith("other-field-")) return;
      setState((prev) => ({
        ...prev,
        steps: prev.steps.filter((s) => s.id !== stepId),
        changeId: createId(),
      }));
    },
    [setState],
  );

  const setTemplate = useCallback(
    (template: string) => {
      setState((prev) => ({
        ...prev,
        template,
        changeId: createId(),
      }));
    },
    [setState],
  );

  const setColorHex = useCallback(
    (colorHex: string) => {
      setState((prev) => ({
        ...prev,
        colorHex,
        changeId: createId(),
      }));
    },
    [setState],
  );

  const updateResumeMetadata = useCallback(
    (data: Partial<ResumeMetadata>) => {
      setState((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, ...data },
        changeId: createId(),
      }));
    },
    [setState],
  );

  return {
    ...state,
    error: state.error || error,
    lastSaved,
    hasUnsavedChanges,
    isSaving,
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
