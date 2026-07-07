import { SidebarProvider } from "@/components/ui/sidebar";
import { EditorShellHeader } from "@/features/editor/components/editor-shell-header";
import { EditorSidebar } from "@/features/editor/components/editor-sidebar";
import EditorProvider from "@/features/editor/providers/editor-provider";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Editor",
  description: "CV Copilot Editor",
};

export default function EditorLayout({ children }: PropsWithChildren) {
  return (
    <EditorProvider>
      <SidebarProvider breakpoint={900}>
        <EditorSidebar />
        <div className="h-svh overflow-hidden flex flex-col w-full">
          <EditorShellHeader />
          <div className="flex-1 min-h-0 overflow-auto lg:overflow-hidden w-full xm:mt-16">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </EditorProvider>
  );
}
