import Link from "next/link";
import Image from "next/image";
import { Share2, AtSign, Play, Send } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import DonateButton from "@/components/DonateButton";
import { ZellijDivider } from "@/components/zellij/Zellij";

const SOCIALS = [
  { href: "https://instagram.com", icon: AtSign,  label: "Instagram" },
  { href: "https://facebook.com",  icon: Share2,  label: "Facebook" },
  { href: "https://twitter.com",   icon: Send,    label: "Twitter" },
  { href: "https://youtube.com",   icon: Play,    label: "YouTube" },
];

export default function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <footer className="bg-[oklch(0.18_0.015_60)] text-stone-400">
      {/* Zellij band at the very top of the footer */}
      <ZellijDivider className="opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Imourig"
              width={1066}
              height={320}
              sizes="340px"
              className="h-11 w-auto mb-4"
            />
            <p className="text-stone-500 text-sm leading-relaxed mb-6 max-w-xs">
              {dict.footer.tagline}
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-xl bg-white/5 hover:bg-amber-500 flex items-center justify-center text-stone-400 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{dict.footer.platform}</h3>
            <ul className="space-y-1">
              {[
                { href: `/${locale}/experiences`,        label: dict.nav.browse },
                { href: `/${locale}/map`,                label: dict.map.title },
                { href: `/${locale}/operators/register`, label: dict.nav.listExperience },
                { href: `/${locale}/portal`,             label: dict.nav.portal },
                { href: `/${locale}/about`,              label: dict.nav.about },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group min-h-[2.5rem]">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-400 transition-colors shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Community</h3>
            <ul className="space-y-1">
              {[
                { href: `/${locale}/tips`,    label: dict.tips.title },
                { href: `/${locale}/suggest`, label: dict.footer.suggest },
                { href: `/${locale}/blog`,    label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group min-h-[2.5rem]">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-400 transition-colors shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + donate */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">{dict.footer.legal}</h3>
            <ul className="space-y-1 mb-8">
              {[
                { href: `/${locale}/terms`,                label: dict.footer.terms },
                { href: `/${locale}/privacy`,              label: dict.footer.privacy },
                { href: `/${locale}/affiliate-disclosure`, label: "Affiliate Disclosure" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group min-h-[2.5rem]">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-400 transition-colors shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <DonateButton />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} Imourig. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-stone-600 text-xs">
              {dict.footer.builtWith ?? "Authentic Morocco, direct from locals."}
            </p>
            <span className="text-stone-600 text-xs">🇲🇦 Made for Morocco</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
