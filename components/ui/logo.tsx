import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Logo: React.FC<{ className?: string; link?: string }> = ({
  className,
  link,
}) => {
  const MainLogo = () => (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        alt="logo"
        src="/images/logo.png"
        height="40"
        width="40"
        className="h-8 w-8 sm:h-10 sm:w-10"
      />
      <p className="font-bold text-lg sm:text-xl">CVCopilot</p>
    </div>
  );

  return (
    <>
      {link ? (
        <Link href={link}>
          <MainLogo />
        </Link>
      ) : (
        <MainLogo />
      )}
    </>
  );
};
