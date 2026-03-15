import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      {children}
    </main>
  );
}
