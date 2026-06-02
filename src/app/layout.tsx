import type { Metadata } from "next";
import { Raleway, Open_Sans } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Imourig — Discover Morocco",
    template: "%s | Imourig",
  },
  description:
    "Authentic Morocco experiences booked directly with verified local operators — surf, cooking, desert and more across 39 destinations. No middleman markup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={`${openSans.variable} ${raleway.variable} h-full`}>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col antialiased bg-white text-stone-900"
      >
        {children}
      </body>
    </html>
  );
}
