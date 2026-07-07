import { AppError } from "../errors";

export class ActionInvalidatedError extends AppError {
    constructor(actionId: string, message = "Action invalidated") {
        super(message);
        this.id = actionId;
        this.name = "ActionInvalidatedError";
        this.severity = "info";
    }
}

export function isActionInvalidatedError(error: unknown): error is ActionInvalidatedError {
    return error instanceof ActionInvalidatedError;
}

export function createAction<T, Args extends unknown[]>(
    action: (...args: Args) => Promise<T>,
    invalidateSignal?: AbortSignal
) {
    let isCancelled = false;
    const id = `action@${Math.random().toString(36).substring(2, 15)}`;

    const throwInvalidated = () => {
        throw new ActionInvalidatedError(id);
    }

    const checkCancelled = () => isCancelled || invalidateSignal?.aborted;

    const execute = async (...args: Args): Promise<T> => {
        if (checkCancelled()) throwInvalidated();
        return action(...args)
            .then((result) => {
                if (checkCancelled()) throwInvalidated();
                return result;
            })
            .catch((error) => {
                if (isActionInvalidatedError(error)) throw error;
                throw error instanceof AppError
                    ? error
                    : new AppError("Action failed", { cause: error, id });
            });
    };

    const invalidate = () => { isCancelled = true; };

    return { id, execute, invalidate };
}