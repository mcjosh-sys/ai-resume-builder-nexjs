"use client";

import { useAppSearchParams } from "@/hooks/use-app-search-params";
import { useEffect, useMemo } from "react";
import { Step } from "../contexts/editor-context";

export const useStepper = (steps: Step[]) => {
  const enabledSteps = useMemo(
    () => steps.filter((s) => s.enabled !== false),
    [steps],
  );

  const {
    watchValues: { step: stepId },
    setValues,
  } = useAppSearchParams({ watchKeys: ["step"] });

  const currentIndex = useMemo(() => {
    const index = enabledSteps.findIndex((s) => s.id === stepId);
    return index === -1 ? 0 : index;
  }, [enabledSteps, stepId]);

  const currentStep: Step | null = enabledSteps[currentIndex] ?? null;

  const hasNextStep = currentIndex < enabledSteps.length - 1;
  const hasPrevStep = currentIndex > 0;

  useEffect(() => {
    if (!enabledSteps.length) return;

    const validStepId = enabledSteps[currentIndex]?.id;
    if (stepId !== validStepId) {
      setValues({ step: validStepId });
    }
  }, [enabledSteps, currentIndex, stepId, setValues]);

  const nextStep = () => {
    if (!hasNextStep) return;
    setValues({ step: enabledSteps[currentIndex + 1].id });
  };

  const prevStep = () => {
    if (!hasPrevStep) return;
    setValues({ step: enabledSteps[currentIndex - 1].id });
  };

  const setCurrent = (stepId: string) => {
    const index = enabledSteps.findIndex((s) => s.id === stepId);
    if (index === -1) {
      console.warn(`[useStepper] Invalid step id: ${stepId}`);
      return;
    }
    setValues({ step: enabledSteps[index].id });
  };

  return {
    current: currentStep,
    hasNext: hasNextStep,
    hasPrev: hasPrevStep,
    next: nextStep,
    prev: prevStep,
    setCurrent,
    enabledSteps,
  };
};
