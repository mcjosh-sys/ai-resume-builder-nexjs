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

export * from "./page.types";
