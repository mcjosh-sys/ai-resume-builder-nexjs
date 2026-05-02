import { Step } from "@/features/editor/types/editor-resume.type";

export type AnyObject = Record<string, any>;
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type Optional<T extends AnyObject> = {
  [K in keyof T]?: T[K] extends readonly (infer U)[]
    ? U extends AnyObject
      ? Prettify<Optional<U>>[]
      : U[]
    : T[K] extends AnyObject
      ? T[K] extends Date
        ? T[K]
        : Optional<T[K]>
      : T[K];
};

export type WithoutResume<T> = Omit<T, "resumeId" | "resume">;

export type ExtractStep<T extends Step["id"]> = Extract<Step, { id: T }>;

export type ExtractStepData<T extends Step["id"]> = ExtractStep<T>["data"];

export * from "./page.types";
