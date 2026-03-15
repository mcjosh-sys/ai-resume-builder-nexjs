import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#" },
      { name: "Templates", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Reviews", href: "#" },
    ],
    resources: [
      { name: "Resume Examples", href: "#" },
      { name: "Career Blog", href: "#" },
      { name: "Cover Letter Builder", href: "#" },
      { name: "Help Center", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-muted pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Info (Column 1) */}
          <div className="lg:col-span-4 max-w-sm">
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
            <p className="text-muted-foreground leading-relaxed mb-8">
              The AI-powered resume builder that helps you write better resumes,
              faster. Get hired at top companies with confidence.
            </p>
            <div className="flex gap-5 text-slate-400">
              <Link href="#" className="hover:text-blue-600 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links (Columns 2-4) */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold  mb-6">Product</h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold  mb-6">Resources</h4>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold  mb-6">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} CVCopilot Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
