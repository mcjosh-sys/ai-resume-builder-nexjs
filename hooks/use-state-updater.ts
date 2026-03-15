import { Dispatch, SetStateAction } from "react";

type Updater<T> = T extends readonly any[]
  ? SetStateAction<T>
  : T extends Record<string, any>
    ? Partial<T> | ((prev: T) => Partial<T>)
    : SetStateAction<T>;

export const useStateUpdater = <T>(dispatch: Dispatch<SetStateAction<T>>) => {
  return (updater: Updater<T>) => {
    dispatch((prev) => {
      if (typeof updater === "function") {
        const result = updater(prev as any);

        if (isPlainObject(prev) && isPlainObject(result)) {
          return { ...prev, ...result };
        }

        return result as T;
      }

      if (isPlainObject(prev) && isPlainObject(updater)) {
        return { ...prev, ...updater };
      }
      return updater as T;
    });
  };
};

const isPlainObject = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
