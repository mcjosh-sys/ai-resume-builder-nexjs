import { AppClerkProvider } from "@/providers/app-clerk-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - CV Copilot",
    default: "CV Copilot",
  },
  description:
    "Build better resumes with an AI CV Copilot. Generate bullet points, improve experience descriptions, and tailor your CV for any job using intelligent suggestions.",

  openGraph: {
    title: "CV Copilot - AI Resume Builder",
    description:
      "Create job-winning resumes faster with AI. Improve bullet points and tailor your CV effortlessly.",
    url: "https://omega-cvcopilot.vercel.app",
    siteName: "CV Copilot",
    images: [
      {
        url: "https://omega-cvcopilot.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "CV Copilot Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CV Copilot - AI Resume Builder",
    description: "Your AI copilot for writing standout resumes and CVs.",
    images: ["https://omega-cvcopilot.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable}  antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </AppClerkProvider>
  );
}
