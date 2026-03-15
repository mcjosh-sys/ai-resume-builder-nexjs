"use client";

import { AddStepInput, Step } from "@/features/editor/contexts/editor-context";
import { parseResume } from "@/features/editor/helpers/resume-helpers";
import { DEFAULT_STEPS } from "@/features/editor/providers/editor-provider";
import { getResume } from "@/features/resume/actions/resume.actions";
import { AppError } from "@/lib/errors";
import { createId } from "@paralleldrive/cuid2";
import { useEffect, useRef, useState } from "react";
import { useAppSearchParams } from "./use-app-search-params";
import { useAutoSaveResume } from "./use-auto-save-resume";
import useUnloadWarning from "./use-unload-warning";

export const useResume = ({
  defaultSteps = DEFAULT_STEPS,
}: {
  defaultSteps?: Step[];
} = {}) => {
  const {
    watchValues: { id: resumeId },
    setValues,
  } = useAppSearchParams({ watchKeys: ["id"] });

  const [state, setState] = useState({
    isLoading: false,
    error: null as AppError | null,
    loaded: false,
    steps: defaultSteps,
    template: "aurora",
    colorHex: "default",
    changeId: null as string | null,
  });
  const isFreshResumeRef = useRef(true);

  const { currentResumeId, hasUnsavedChanges, isSaving, error, lastSaved } =
    useAutoSaveResume({
      resumeId,
      steps: state.steps,
      changeId: state.changeId,
      template: state.template,
      colorHex: state.colorHex,
    });

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
    if (currentResumeId && resumeId !== currentResumeId) {
      setValues({ id: currentResumeId });
    }
  }, [currentResumeId]);

  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        resume: null,
        steps: defaultSteps,
      }));

      try {
        const rawResume = await getResume(resumeId);

        if (!isMountedRef.current) return;

        if (!rawResume) {
          setValues({ id: "" });
          return;
        }

        const parsedResume = parseResume(rawResume);

        setState((prev) => ({
          ...prev,
          resume: rawResume,
          steps: parsedResume.steps,
          template: rawResume.template ?? "aurora",
          colorHex: rawResume.colorHex ?? "default",
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
          setState((prev) => ({ ...prev, error }));
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

  const addSection = (input: AddStepInput) => {
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
  };

  const setTemplate = (template: string) => {
    setState((prev) => ({
      ...prev,
      template,
      changeId: createId(),
    }));
  };

  const setColorHex = (colorHex: string) => {
    setState((prev) => ({
      ...prev,
      colorHex,
      changeId: createId(),
    }));
  };

  return {
    ...state,
    error: state.error || error,
    lastSaved,
    hasUnsavedChanges,
    currentResumeId,
    isSaving,
    setSteps,
    updateSection,
    addSection,
    setTemplate,
    setColorHex,
  };
};
