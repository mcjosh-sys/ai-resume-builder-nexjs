"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "./ui/button";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  isLoading?: boolean;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  disabled,
  children,
  className,
  ...props
}) => {
  const [status, setStatus] = useState<"idle" | "loading" | "complete">("idle");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      setStatus("loading");
    } else if (status === "loading") {
      setStatus("complete");
      timer = setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <Button
      disabled={isLoading || disabled}
      className={cn(
        "inline-grid [grid-template-areas:'stack'] relative justify-items-center items-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <ImSpinner2
        className={cn(
          "[grid-area:stack] transition-opacity",
          status === "loading" ? "visible animate-spin" : "invisible opacity-0",
        )}
      />

      <FaCheckCircle
        className={cn(
          "[grid-area:stack] transition-all",
          status === "complete"
            ? "visible scale-100"
            : "invisible scale-50 opacity-0",
        )}
      />

      <div
        className={cn(
          "[grid-area:stack] transition-opacity",
          status !== "idle" ? "invisible opacity-0" : "visible opacity-100",
        )}
      >
        {children}
      </div>
    </Button>
  );
};
