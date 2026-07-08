import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  MobileMenu,
  MobileMenuContent,
  MobileMenuGroup,
  MobileMenuItem,
  MobileMenuTrigger,
} from "@/components/ui/mobile-menu";
import { BrandSection } from "@/features/marketing/components/brands";
import { CallToAction } from "@/features/marketing/components/cta";
import { FeaturesSection } from "@/features/marketing/components/features";
import Footer from "@/features/marketing/components/footer";
import { Hero } from "@/features/marketing/components/hero";
import { PricingSection } from "@/features/marketing/components/pricing";
import { TestimonialsSection } from "@/features/marketing/components/testimonials";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-background/90">
      <nav className="flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 sm:px-6 py-3 shadow-sm dark:shadow-slate-900">
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

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 items-center">
          <li>
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
          </li>
        </ul>

        {/* Actions & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex gap-2 items-center">
            <SignedIn>
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <div className="flex gap-2 items-center">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </SignedOut>
          </div>

          <ThemeToggle />

          <MobileMenu>
            <MobileMenuTrigger />
            <MobileMenuContent>
              <SignedIn>
                <Button asChild className="w-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </div>
              </SignedOut>
              <MobileMenuGroup>
                <MobileMenuItem>
                  <Link
                    href="#features"
                    className="block py-2 px-3 rounded-md hover:bg-accent transition-colors"
                  >
                    Features
                  </Link>
                </MobileMenuItem>
                <MobileMenuItem>
                  <Link
                    href="#pricing"
                    className="block py-2 px-3 rounded-md hover:bg-accent transition-colors"
                  >
                    Pricing
                  </Link>
                </MobileMenuItem>
                <MobileMenuItem>
                  <Link
                    href="#about"
                    className="block py-2 px-3 rounded-md hover:bg-accent transition-colors"
                  >
                    About
                  </Link>
                </MobileMenuItem>
              </MobileMenuGroup>
            </MobileMenuContent>
          </MobileMenu>
        </div>
      </nav>

      {/* Content */}
      <div>
        <Hero />
        <BrandSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection id="pricing" />
        <CallToAction />
        <Footer />
      </div>
    </main>
  );
}
