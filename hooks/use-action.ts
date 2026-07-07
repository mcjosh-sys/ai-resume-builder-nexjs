import { AppError } from "@/lib/errors";
import { createAction, isActionInvalidatedError } from "@/lib/utils/action";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStateUpdater } from "./use-state-updater";

export function useAction<Args extends unknown[], T>(
    action: (...args: Args) => Promise<T>,
    externalSignal?: AbortSignal
) {
    const [state, setState] = useState<{
        result: T | null;
        status: "idle" | "running" | "error" | "success" | "invalidated";
        error: AppError | null;
    }>({ result: null, status: "idle", error: null });
    const patch = useStateUpdater(setState);
    const invalidateRef = useRef<() => void>(() => { });
    const isRunningRef = useRef(false);

    useEffect(() => {
        return () => invalidateRef.current();
    }, []);

    const run = useCallback(async (...args: Args) => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;

        patch(prev => ({ ...prev, status: "running", error: null, result: null }));

        try {
            const { execute, invalidate } = createAction(action, externalSignal);
            invalidateRef.current = invalidate;
            const response = await execute(...args);
            patch(prev => ({ ...prev, status: "success", result: response }));
        } catch (error) {
            if (isActionInvalidatedError(error)) {
                patch(prev => ({ ...prev, status: "invalidated" }));
            }
            patch(prev => ({
                ...prev,
                status: "error",
                error: error instanceof AppError
                    ? error
                    : new AppError("Failed to run action", { cause: error }),
            }));
        } finally {
            isRunningRef.current = false;
        }
    }, [action, externalSignal]);

    const isRunning = state.status === "running";

    const reset = useCallback(() => {
        invalidateRef.current();
        patch({ result: null, status: "idle", error: null });
    }, []);

    return { run, ...state, isRunning, reset };
}