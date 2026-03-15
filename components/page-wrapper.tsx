import { cn } from "@/lib/utils";
import { BaseProps } from "@/types/component.types";

export function PageWrapper({
  children,
  className,
  fullWidth,
}: BaseProps<{ fullWidth?: boolean }>) {
  return (
    <div
      className={cn(
        "w-full px-6 py-6 space-y-6",
        !fullWidth && "max-w-7xl mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
