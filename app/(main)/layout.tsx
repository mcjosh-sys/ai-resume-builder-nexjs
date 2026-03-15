"use client";

import { Topbar } from "@/components/topbar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditorRoute = pathname.startsWith("/editor/");

  return (
    <div className="h-full w-full flex flex-col">
      {!isEditorRoute && <Topbar />}
      <div
        className={cn(
          "relative w-full flex-1 min-h-0",
          !isEditorRoute && "max-w-7xl mx-auto",
        )}
      >
        {children}
      </div>
    </div>
  );
}
