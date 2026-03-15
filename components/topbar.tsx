"use client";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Topbar() {
  const pathname = usePathname();
  const isEditorRoute = pathname.startsWith("/editor");
  if (isEditorRoute) return null;
  return (
    <nav className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 sm:px-6 py-3 shadow-sm dark:shadow-slate-900">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            alt="logo"
            src="/images/logo.png"
            height="40"
            width="40"
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <p className="font-bold text-lg sm:text-xl">CVCopilot</p>
        </div>

        {/* Actions & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
                userButtonBox:
                  "border-blue-500 hover:bg-blue-600/10 border-2 rounded-full",
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard size={16} />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </nav>
  );
}
