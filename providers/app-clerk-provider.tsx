"use client";

import { useHtmlTheme } from "@/hooks/use-html-theme";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  const theme = useHtmlTheme();
  return (
    <ClerkProvider
      appearance={{
        theme: theme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
