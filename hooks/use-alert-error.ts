import { AppError, isAppError } from "@/lib/errors";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

type AlertableError = AppError | Error | null | undefined;

const toastMap = {
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
} as const;

function getToast(error: NonNullable<AlertableError>) {
  if (!isAppError(error)) {
    return toast.error;
  }
  return toastMap[error.severity] ?? toast.error;
}

export function useAlertErrors(
  errors: AlertableError[],
  defaultMessage = "Something went wrong",
) {
  const alertError = useCallback(
    (error: Exclude<AlertableError, null | undefined>) => {
      const message = error.message?.trim() || defaultMessage;
      const toast = getToast(error);

      toast(message, {
        position: "top-right",
        id: `${error.name}:${message}`,
      });
    },
    [defaultMessage],
  );

  useEffect(() => {
    for (const error of errors) {
      if (error) {
        alertError(error);
      }
    }
  }, [errors, alertError]);

  return { alertError };
}
